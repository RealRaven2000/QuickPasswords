"use strict";

if (!QuickPasswords.StringBundle)
	QuickPasswords.StringBundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
if (!QuickPasswords.Properties)
	QuickPasswords.Properties = QuickPasswords.StringBundle.createBundle("chrome://quickpasswords/locale/overlay.properties");


var QuickPasswords_TabURIregexp = {
	get _thunderbirdRegExp() {
		delete this._thunderbirdRegExp;
		return this._thunderbirdRegExp = new RegExp("^http://quickpasswords.mozdev.org/");
	}
};

// open the new content tab for displaying support info, see
// https://developer.mozilla.org/en/Thunderbird/Content_Tabs
var QuickPasswords_TabURIopener = {

	openURLInTab: function (URL) {
		try {
			var sTabMode="";


			var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Components.interfaces.nsIWindowMediator);
			var mainWindow = wm.getMostRecentWindow("navigator:browser");
			if (mainWindow) {
				var newTab = mainWindow.gBrowser.addTab(URL);
				mainWindow.gBrowser.selectedTab = newTab;
				return;
			}


			var tabmail;
			tabmail = document.getElementById("tabmail");
			if (!tabmail) {
				// Try opening new tabs in an existing 3pane window
				var mail3PaneWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"]
										 .getService(Components.interfaces.nsIWindowMediator)
										 .getMostRecentWindow("mail:3pane");
				if (mail3PaneWindow) {
					tabmail = mail3PaneWindow.document.getElementById("tabmail");
					mail3PaneWindow.focus();
				}
			}
			if (tabmail) {
				sTabMode = (QuickPasswords.Util.Application() == "Thunderbird" && QuickPasswords.Util.Appver()>=3) ? "contentTab" : "3pane";
				tabmail.openTab(sTabMode,
				{contentPage: URL, clickHandler: "specialTabs.siteClickHandler(event, QuickPasswords_TabURIregexp._thunderbirdRegExp);"});
			}
			else
				window.openDialog("chrome://messenger/content/", "_blank",
								  "chrome,dialog=no,all", null,
			  { tabType: "contentTab",
			   tabParams: {contentPage: URL,
			              clickHandler: "specialTabs.siteClickHandler(event, QuickPasswords_TabURIregexp._thunderbirdRegExp);", id:"QuickPasswords_Weblink"}
			  } );
		}
		catch(e) { 
			this.logException("openURLInTab(" + URL + ")", e);
			return false; 
		}
		return true;
	}
};

QuickPasswords.Util = {
	QuickPasswords_CURRENTVERSION : '2.0.1', // just a fallback value
	get AddonId() {
		return "QuickPasswords@axelg.com";
	},
	ConsoleService: null,
	name: 'QuickPasswords.Util',
	mAppver: null,
	mAppName: null,
	mHost: null,
	lastTime: 0,
	mExtensionVer: null,
	VersionProxyRunning: false,

  $: function(id) {
      return document.getElementById(id);
  } ,

  getAddon: function(aId) {
    var em = Components.classes["@mozilla.org/extensions/manager;1"]
                .getService(Components.interfaces.nsIExtensionManager);
      return em.getItemForID(aId);
  } ,

	VersionProxy: function() {
		try {
			if(this.mExtensionVer)
				return; // early exit, we got the version!
			if (QuickPasswords.Util.VersionProxyRunning)
				return; // do not allow recursion...
			QuickPasswords.Util.VersionProxyRunning = true;
			QuickPasswords.Util.logDebugOptional("firstRun", "Util.VersionProxy() started.");
			setTimeout (function () {
				if (Components.utils.import) {
					Components.utils.import("resource://gre/modules/AddonManager.jsm");

					AddonManager.getAddonByID(QuickPasswords.Util.AddonId, function(addon) {
						let u = QuickPasswords.Util;
						u.mExtensionVer = addon.version;
						u.logDebug("================================================\n" +
						           "================================================");
						u.logDebug("AddonManager: QuickPasswords extension's version is " + addon.version);
						u.logDebug("QuickPasswords.VersionProxy() - DETECTED QuickPasswords Version " + u.mExtensionVer + "\n" + "Running on " + u.Application()	 + " Version " + u.AppverFull());
						u.logDebug("================================================\n" +
						           "================================================");
						var wd=window.document;
						if (wd) {
							let elVersion = wd.getElementById("qp-version-field");
							if (elVersion)
								elVersion.setAttribute("value", addon.version);
						}

					});
				}
			},0);

			QuickPasswords.Util.logDebugOptional("firstRun", "AddonManager.getAddonByID .. added callback for setting extensionVer.");

		}
		catch(ex) {
			QuickPasswords.Util.logException("QuickPasswords VersionProxy failed - are you using an old version of " + QuickPasswords.Util.Application() + "?" , ex);
		}
		finally {
			QuickPasswords.Util.VersionProxyRunning=false;
		}

	},

	Version: function() {
		//returns the current extension version number.
		var bAddonManager = false;
		if(QuickPasswords.Util.mExtensionVer)
			return QuickPasswords.Util.mExtensionVer;
		if (!Components.classes["@mozilla.org/extensions/manager;1"]) {
			QuickPasswords.Util.VersionProxy(); // modern Mozilla builds.
											  // these will set mExtensionVer (eventually)
											  // also we will delay firstRun.init() until we _know_ the version number
			bAddonManager = true;
		}

		// --- older code
		var current = null;

		if (bAddonManager)
			current = QuickPasswords.Util.QuickPasswords_CURRENTVERSION + "-AddonManagerVersionPending";
		else {
			current = QuickPasswords.Util.QuickPasswords_CURRENTVERSION + "(?)";
			try {
				if(Components.classes["@mozilla.org/extensions/manager;1"])
				{
					var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
						.getService(Components.interfaces.nsIExtensionManager);
					current = gExtensionManager.getItemForID(QuickPasswords.Util.AddonId).version;
					QuickPasswords.Util.mExtensionVer = current; // legal version (pre Tb3.3)
				}
				else {
					current = QuickPasswords.Util.QuickPasswords_CURRENTVERSION + "(?)"
				}
				QuickPasswords.Util.mExtensionVer = current;

			}
			catch(ex) {
				current = QuickPasswords.Util.QuickPasswords_CURRENTVERSION + "(?ex?)" // hardcoded, program this for Tb 3.3 later
				QuickPasswords.Util.logException("QuickPasswords VersionProxy failed - are you using an old version of " + QuickPasswords.Util.Application() + "?", ex);
			}
		}
		return current;

	} ,

	onLoadVersionInfoDialog: function()
	{
		if (window.arguments && window.arguments[0].inn)
		{
			QuickPasswords.Util.mExtensionVer = window.arguments[0].inn.instance.Util.Version();
		}
		var version=QuickPasswords.Util.Version(); // local instance of
		var wd=window.document;
		if (version=="") version='version?';
		wd.getElementById("qp-version-field").setAttribute("value", version);

	} ,


	// dedicated function for email clients which don't support tabs
	// and for secured pages (donation page).
	openLinkInBrowserForced: function(linkURI) {
		try {
			this.logDebug("openLinkInBrowserForced (" + linkURI + ")");
			if (QuickPasswords.Util.Application()=='SeaMonkey') {
				var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
				browser = windowManager.getMostRecentWindow( "navigator:browser" );
				if (browser) {
					let URI = linkURI;
					setTimeout(function() { QuickPasswords_TabURIopener.openURLInTab(URI); }, 250);
				}
				else
					window.openDialog(getBrowserURL(), "_blank", "all,dialog=no", linkURI, null, 'QuickPasswords update');

				return;
			}
			var service = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
				.getService(Components.interfaces.nsIExternalProtocolService);
			var ioservice = Components.classes["@mozilla.org/network/io-service;1"].
						getService(Components.interfaces.nsIIOService);
			var uri = ioservice.newURI(linkURI, null, null);
			service.loadURI(uri);
		}
		catch(e) { this.logException("openLinkInBrowserForced (" + linkURI + ") ", e); }
	},


	// moved from options.js
	// use this to follow a href that did not trigger the browser to open (from a XUL file)
	openLinkInBrowser: function(evt,linkURI) {
		if (QuickPasswords.Util.Appver()>=3 && QuickPasswords.Util.Application()=='Thunderbird') {
			var service = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
				.getService(Components.interfaces.nsIExternalProtocolService);
			var ioservice = Components.classes["@mozilla.org/network/io-service;1"].
						getService(Components.interfaces.nsIIOService);
			service.loadURI(ioservice.newURI(linkURI, null, null));
			if(null!=evt)
				evt.stopPropagation();
		}
		else
			this.openLinkInBrowserForced(linkURI);
	},

	// moved from options.js (then called
	openURL: function(evt,URL) { // workaround for a bug in TB3 that causes href's not be followed anymore.
		var ioservice,iuri,eps;

		if (QuickPasswords.Util.Appver()<3 && QuickPasswords.Util.Application()=='Thunderbird'
			|| QuickPasswords.Util.Application()=='SeaMonkey'
			|| QuickPasswords.Util.Application()=='Postbox')
		{
			this.openLinkInBrowserForced(URL);
			if(null!=evt) evt.stopPropagation();
		}
		else {
			if (QuickPasswords_TabURIopener.openURLInTab(URL) && null!=evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}
		}
	},

	popupAlert: function (title, text) {
	  try {
	    Components.classes['@mozilla.org/alerts-service;1'].
	              getService(Components.interfaces.nsIAlertsService).
	              showAlertNotification("chrome://quickpasswords/skin/quickpasswords-Icon.png", title, text, false, '', null);
	  } catch(e) {
	    // prevents runtime error on platforms that don't implement nsIAlertsService
	  }
	} ,

	checkfirstRun: function() {
		QuickPasswords.Util.logDebug("checkfirstRun");
		var prev = -1, firstRun = false;
		var debugfirstRun = false;

		var svc = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService);
		var ssPrefs = svc.getBranch("extensions.quickpasswords.");

		var current = QuickPasswords.Util.Version();
		QuickPasswords.Util.logDebug("Current QuickPasswords Version: " + current);
		try {
			QuickPasswords.Util.logDebugOptional ("firstRun","try to get setting: getCharPref(version)");
			try { 
				prev = ssPrefs.getCharPref("version"); 
			} catch (e) { prev = "?"; } ;

			QuickPasswords.Util.logDebugOptional ("firstRun","try to get setting: getBoolPref(firstRun)");
			try { 
				firstRun = ssPrefs.getBoolPref("firstRun"); 
			} 
			catch (e) { firstRun = true; }

			// enablefirstRuns=false - allows start pages to be turned off for partners
			QuickPasswords.Util.logDebugOptional ("firstRun","try to get setting: getBoolPref(enablefirstRuns)");

			QuickPasswords.Util.logDebugOptional ("firstRun", "Settings retrieved:"
					+ "\nprevious version=" + prev
					+ "\ncurrent version=" + current
					+ "\nfirstRun=" + firstRun
					+ "\ndebugfirstRun=" + debugfirstRun);

		}
		catch(e) {

			alert("QuickPasswords exception in quickpasswords_util.js: " + e.message
				+ "\n\ncurrent: " + current
				+ "\nprev: " + prev
				+ "\nfirstRun: " + firstRun
				+ "\ndebugfirstRun: " + debugfirstRun);

		}
		finally {
			QuickPasswords.Util.logDebugOptional ("firstRun","finally - firstRun=" + firstRun);

			// AG if this is a pre-release, cut off everything from "pre" on... e.g. 1.9pre11 => 1.9
			var pre=0;
			var pureVersion=current;
			if (0<(pre=current.indexOf('pre'))) {
				pureVersion = current.substring(0,pre);
			}
			QuickPasswords.Util.logDebugOptional ("firstRun","finally - pureVersion=" + pureVersion);
			// change this depending on the branch
			var versionPage = "http://quickpasswords.mozdev.org/version.html#" + pureVersion;
			QuickPasswords.Util.logDebugOptional ("firstRun","finally - versionPage=" + versionPage);

			if (firstRun) {
				// installed quickPasswords for the first time...
				QuickPasswords.Util.logDebugOptional ("firstRun","set firstRun=false and store version " + current);
				ssPrefs.setBoolPref("firstRun",false);
				ssPrefs.setCharPref("version",current); // store current (simplified) version!

				// Insert code for first run here
				// on very first run, we go to the index page - welcome blablabla
				QuickPasswords.Util.logDebugOptional ("firstRun","setTimeout for content tab (index.html)");
				window.setTimeout(function() {
					                             QuickPasswords.Util.openURL(null, "http://quickpasswords.mozdev.org/index.html");
					                           }, 1500); //Firefox 2 fix - or else tab will get closed (leave it in....)
			}
			else { 
				// update or just new session?
				QuickPasswords.Util.logDebugOptional ("firstRun","checkfirstRun: previous=" + prev + ", current = " + current);
				if (prev!=current) { // VERSION UPDATE!
					// upgrade case!!
					ssPrefs.setCharPref("version",current);

					// version is different => upgrade (or conceivably downgrade)
					QuickPasswords.Util.logDebugOptional ("firstRun","open tab for version history + browser for donation" + current);
					window.setTimeout(function(){
						// display version history
						QuickPasswords.Util.openURL(null, versionPage);
					}, 1500); //Firefox 2 fix - or else tab will get closed
					
					window.setTimeout(function(){
						// display donation page (can be disabled; I will send out method to all donators and anyone who asks me for it)
						if ((QuickPasswords.Preferences.getBoolPref("donateNoMore")))
							QuickPasswords.Util.logDebugOptional ("firstRun","Jump to donations page disabled by user");
						else
							QuickPasswords.Util.openURL(null, "http://quickpasswords.mozdev.org/donate.html"); // show donation page!
						}, 2200);

				}
				else {
					QuickPasswords.Util.logDebugOptional ("firstRun","prev!=current -> just a reload of same version - prev=" + prev + ", current = " + current);
				}
			}
		}
	} ,


	checkVersionFirstRun: function() {
		let utils = QuickPasswords.Util;
		utils.logDebugOptional("firstRun", "Util.checkVersionFirstRun() - mExtensionVer = " + utils.mExtensionVer);
		let aId = utils.AddonId;
		
		// if finding our version number is still pending, exit!
		if (utils.mExtensionVer && utils.mExtensionVer.indexOf("VersionPending")<0) {
			return;
		}

		if(!Components.classes["@mozilla.org/extensions/manager;1"])
		{
			if (typeof AddonManager == 'undefined')
				Components.utils.import("resource://gre/modules/AddonManager.jsm");
			setTimeout (function () {
					AddonManager.getAddonByID(aId,
						function(addon) {
							// This is an asynchronous callback function that might not be called immediately, ah well...
							let ut = QuickPasswords.Util;
							ut.logDebug("AddonManager retrieved Version number: " + addon.version);
							if (addon.version)
								ut.checkfirstRun();
							else
								ut.checkVersionFirstRun();
						}
					);
			}, 50);
		}
		else { // Tb 3.0
			utils.mExtensionVer = this.getAddon(aId).version;
			utils.logDebug("Retrieved Version number from nsIExtensionManager (legacy): " + utils.mExtensionVer);
			utils.checkfirstRun();
		}
	},
	
	AppverFull: function() {
	  var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
	                  .getService(Components.interfaces.nsIXULAppInfo);
	    return appInfo.version;
	},

    Appver: function() {
        if (null == this.mAppver) {
	    var appVer=this.AppverFull().substr(0,3); // only use 1st three letters - that's all we need for compatibility checking!
		    this.mAppver = parseFloat(appVer); // quick n dirty!
        }
		return this.mAppver;
    },

    Application: function() {
		if (null==this.mAppName) {
        var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
                        .getService(Components.interfaces.nsIXULAppInfo);
			const FIREFOX_ID = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}";
			const THUNDERBIRD_ID = "{3550f703-e582-4d05-9a08-453d09bdfdc6}";
			const SEAMONKEY_ID = "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}";
			const POSTBOX_ID = "postbox@postbox-inc.com";
			switch(appInfo.ID) {
				case FIREFOX_ID:
				  return this.mAppName='Firefox';
				case THUNDERBIRD_ID:
				  return this.mAppName='Thunderbird';
				case SEAMONKEY_ID:
				  return this.mAppName='SeaMonkey';
				case POSTBOX_ID:
				  return this.mAppName='Postbox';
				default:
				  this.mAppName=appInfo.name;
				  this.logDebug ( 'Unknown Application: ' + appInfo.name);
				  return appInfo.name;
			}
        }
	    return this.mAppName;
    },

    HostSystem: function() {
		if (null==this.mHost) {
			var osString = Components.classes["@mozilla.org/xre/app-info;1"]
		                .getService(Components.interfaces.nsIXULRuntime).OS;
			this.mHost = osString.toLowerCase();
        }
        return this.mHost; // linux - winnt - darwin
    },

    copyStringToClipboard: function(sString) {
       var service = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
       var clipboardhelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
	   clipboardhelper.copyString(sString);
    },


		debugVar: function(value) {
		    str = "Value: " + value + "\r\n";
		    for(prop in value) {
		        str += prop + " => " + value[prop] + "\r\n";
		    }
		
		    this.logDebug(str);
		},

		logTime: function() {
			var timePassed = '';
			try {
				var end= new Date();
				var endTime = end.getTime();
				var elapsed = new String(endTime  - this.lastTime); // time in milliseconds
				timePassed = '[' + elapsed + ' ms]   ';
				this.lastTime = endTime; // remember last time
			}
			catch(e) {;}
			return end.getHours() + ':' + end.getMinutes() + ':' + end.getSeconds() + '.' + end.getMilliseconds() + '  ' + timePassed;
		},

		logToConsole: function (msg, optionTitle) {
		if (this.ConsoleService == null)
		  this.ConsoleService = Components.classes["@mozilla.org/consoleservice;1"]
		                             .getService(Components.interfaces.nsIConsoleService);
		                             
		let title = "QuickPasswords " + (typeof optionTitle == 'undefined') 
			          ? ''
			          : '{' + optionTitle.toUpperCase() + '}';
		this.ConsoleService.logStringMessage(title + " " + this.logTime() + "\n"+ msg);
	},

	logDebug: function (msg) {
	  if (QuickPasswords.Preferences.isDebug())
	    this.logToConsole(msg);
	},

	logDebugOptional: function (option, msg) {
	  if (QuickPasswords.Preferences.isDebugOption(option))
	    this.logToConsole(msg, option);
	},
	
	logError: function (aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags)
	{
	  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	                                 .getService(Components.interfaces.nsIConsoleService);
	  var aCategory = '';

	  var scriptError = Components.classes["@mozilla.org/scripterror;1"].createInstance(Components.interfaces.nsIScriptError);
	  scriptError.init(aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags, aCategory);
	  consoleService.logMessage(scriptError);
	} ,
	
	logException: function (aMessage, ex) {
		var stack = ''
		if (typeof ex.stack!='undefined')
			stack= ex.stack.replace("@","\n  ");
		// let's display a caught exception as a warning.
		let fn = ex.fileName ? ex.fileName : "?";
		this.logError(aMessage + "\n" + ex.message, fn, stack, ex.lineNumber, 0, 0x1);
	},

	about: function() {
		// show the built in about dialog:
		//window.opener.gExtensionsView.builder.rebuild();
		window.opener.gExtensionsViewController.doCommand('cmd_about');
	},

	onLoadOptions: function() {
		this.onLoadVersionInfoDialog();
		document.getElementById('qp-version-field').value=this.Version();
		// hide about button...
		if (!window.opener.gExtensionsViewController) {
			var about = document.getElementById("qp-About");
			if (about)
				about.style["visibility"]="hidden";
		}

	},

	displayOptions: function() {
		var params = {inn:{instance: QuickPasswords}, out:null};
		setTimeout(
			function() {
		window.openDialog('chrome://quickpasswords/content/quickpassword_options.xul',
				'quickpasswords-passwords','chrome,titlebar,centerscreen,modal,resizable',
				params).focus();
			});
	} ,

	showAboutConfig: function(filter, readOnly) {

		const name = "Preferences:ConfigManager";
		const uri = "chrome://global/content/config.xul";

		var mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		var w = mediator.getMostRecentWindow(name);

		if (!w) {
			var watcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
			w = watcher.openWindow(null, uri, name, "chrome,resizable,centerscreen,width=500px,height=350px", null);
		}
		w.focus();
		w.setTimeout(
			function () {
				var flt = w.document.getElementById("textbox");
				if (flt) {
					 flt.value=filter;
				 	// make filter box readonly to prevent damage!
					 if (!readOnly)
					   flt.focus();
					 else
						flt.setAttribute('readonly',true);
					 if (w.self.FilterPrefs) {
					 w.self.FilterPrefs();
				}
			}, 300);
	},

	getBundleString: function(id, defaultText) { // moved from local copies in various modules.
		var s="";
		try {s= QuickPasswords.Properties.GetStringFromName(id);}
		catch(e) {
			s= defaultText;
			this.logException ("Could not retrieve bundle string: " + id, e);
		}
		return s;
	} ,

	showVersionHistory: function(label, ask) {
		var pre=0;
		var current=label.value.toString();  // retrieve version number from label
		var pureVersion = current;
		if (0<(pre=current.indexOf('pre'))) {   // make sure to strip of any pre release labels
			pureVersion = current.substring(0,pre);
		}

		var sPrompt = QuickPasswords.Util.getBundleString("qfConfirmVersionLink", "Display version history for QuickPasswords")
		if (!ask || confirm(sPrompt + " " + pureVersion + "?")) {
			QuickPasswords.Util.openURL(null, "http://quickpasswords.mozdev.org/version.html" + "#" + pureVersion);
		}
	},

	isPrivateBrowsing: function() {
		if (QuickPasswords.Util.Application() == "Thunderbird" || QuickPasswords.Util.Application() == "Postbox")
			return false;
		try {
			var pbs = Components.classes["@mozilla.org/privatebrowsing;1"]
				        .getService(Components.interfaces.nsIPrivateBrowsingService);
			if (pbs)
				return pbs.privateBrowsingEnabled;
			else
				return false;
		}
		catch (ex) {
			return false;
		}
	},

	stringFormat : function(str) {
		var args = Array.slice(arguments, 1);
		return str.replace(/\{(\d+)\}/g, function ($0, $1) args[$1])
	}


};

