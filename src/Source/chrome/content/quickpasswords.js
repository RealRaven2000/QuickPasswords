"use strict";

/*
	QuickPasswords
	created by Axel Grude

	Version History
	0.9 - 10/02/2010
		First Release on AMO
	0.9.3 - 10/02/2010
		Fixed localization issues
		Fixed an issue with case sensitivity in Linux
		Added missing icon for small toolbar view
		Added 'real' settings to options dialog
	0.9.4 - 12/02/2010
		Fixed Icon and Writing on Browser Content Popup Menu
		Added links to new extension homepage:	 http://quickpasswords.mozdev.org
		Removed any references to the old working title "PasswordClipper"
	0.9.5 - 14/02/2010
		Added German Locale (AG)
		Added French Locale (Bilouba http://lionel.bijaoui.free.fr/)
		Added feature context menu in password manager
		Added copy row feature
		Added about button to options dialog
	0.9.6 - 20/02/2010
		Added "copy multiple lines / records" feature
		Added: option to include header (for pasting data in spreadsheets) when doing this
		Added: Log copied information about copied data to javascript console (passwords are not displayed)
		Added Dutch Locale (markh van BabelZilla.org)
		Added: Localization in extension description strings
	0.9.6.1 - 27/02/2010
		markh: Reviewed Dutch locale
		Added link to Mozdev homepage to options dialog
		removed JSON module
		Added Russian Locale (Anton Pinsky)
		Added Simplified Chinese Locale (Loviny)
		Added About button + Full Version number to Options screen
	0.9.7 - 07/03/2010
		Added Option for automatic closing of Password Manager after copying
		Added Vietnamese locale (Nguyen Hoang Long http://timelinelive.blogspot.com)
		Added Hungarian locale (WonderCsabo of Babelzilla.org)
	0.9.8 - 01/06/2010
		New Options for copying User and Site
	1.0 - 08/07/2010
		Added da locale (Jorgen Rasmussen)
	1.1 - 29/12/2010
		Fixed a bug that made Header row appear as "undefined" when copying multiple records and "Display message after copying" was disabled
		Made context menu compatible with the "Saved Password Editor" Extension
	1.2 - 04/01/2011
		Made Extension compatible with Firefox 4.0
		Added he-IL Locale (barryoni)
	1.3 - 22/01/2011
		Removed a bug "menu is null" when opening password manager window
		Added Options Menu Item
		Added option to hide Context Menu
		Context Menu item in browser window is now only visible on editable elements
		Added es-AR locale (Eduardo Leon)
		Added ja-JP locale (Noumi Ryoko)
		Added sv-SE locale (Mikael Hiort af Ornaes)
	1.4 - 10/02/2011
		Force icons in context menu even in default theme (class menuitem-iconic)
		Added tooltip (and updated label text) to the time delay option
		Now there are 3 options for displaying browser context menu: never, on text items and always
		open issues: in Fx4, I am still not able to display the extension's version number!
	1.5 - 11/09/2011
		Added Fx + Tb 6.0* compatibility
		Fixed links in options dialog and setting focus to tabs in SeaMonkey
		Added refine sites button (magic wand) to narrow down sites with multiple entry points
		Added new versioning regime and link to site on update / first install - triggered by first use!
		Added tons of functionality for mail clients
			- retrieve mail account password (when in folder)
			- retrieve URL account passwords (when in content tab, like in Firefox)
			- retrieve passwords based on current sender (when viewing a single message)
		New locales:
			- tr-TR  thanks to Nikneyim [BabelZilla.org]
			- sr     thanks to Rancher [BabelZilla.org]

	1.6 - 08/12/2011
		Added "change (multiple) passwords" feature
		stability fixes mainly for SeaMonkey and Postbox
		Added Support for private browsing mode (Firefox and SeaMonkey)
		rapid release bump (maxVer = 9.*)
		removed locale from jar file

	1.7 - 25/12/2011
		Added cancel login menu item
		Added scrolling to selected row in Manager

	1.8 - 20/01/2012
		Fix of German locale (UTF format) in order to display change password dialog correctly

	1.9 - 30/01/2012  Layout Fixes
		Some fixes in change password box
		Fixed [Bug 22904] Icon Size on toolbar buttons was too big

	2.0 - 30/05/2012
	  Compatibility with Gecko 15
		Removed some unnecessary errors from console to improve S/N ratio
		changed overlay using messenger.xul instead of mailWindowOverlay.xul
		layout fixes in change multiple password dialog
		
	2.1 - 13/06/2012
		Fixed <a href='https://www.mozdev.org/bugs/show_bug.cgi?id=24940'>[Bug 24940]</a> - Doesn't fill username/password in firefox 13
		Completed Hu locale
		fixed display of version link and donation pages after updates
	

===========================================================================================

		Planned: adding option for configuring delimiter of multi line export. At the moment this is hard coded to tab.
		Planned: login function (bypassing the clipboard)

*/


var CC_loginManager = Components.classes["@mozilla.org/login-manager;1"]; // Fx 3
var CC_passwordManager = Components.classes["@mozilla.org/passwordmanager;1"]; // Fx 2 (TB?)

var QuickPasswords_BundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
var QuickPasswords_Bundle = QuickPasswords_BundleService.createBundle("chrome://quickpasswords/locale/overlay.properties");

var QuickPasswords = {
	strings:null,
	initialized:false,
	lastContentLocation:'',
	PasswordManagerWindow: null,
	promptParentWindow: null,
	name: 'QuickPasswords',
	onLoad: function() {
		if(this.initialized)
			return;

		QuickPasswords.Util.checkVersionFirstRun(); // asynchronous version check

		//http://kb.mozillazine.org/Adding_items_to_menus
		var menu = document.getElementById("contentAreaContextMenu");
		// no need to do this when coming back from password window, document context is wrong then and throws an error
		if (menu) {
			menu.addEventListener("popupshowing", QuickPasswords.contextPopupShowing, false);
		}

		QuickPasswords_BundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
		QuickPasswords_Bundle = QuickPasswords_BundleService.createBundle("chrome://quickpasswords/locale/overlay.properties");
		this.strings = document.getElementById("QuickPasswords-strings");
		QuickPasswords.Util.logDebug("QuickPasswords " + QuickPasswords.Util.Version()
			 + " running on " + QuickPasswords.Util.Application()
			 + " Version " + QuickPasswords.Util.AppverFull() + "."
			 + "\nOS: " + QuickPasswords.Util.HostSystem());
		this.initialized = true;
	},


	contextPopupShowing: function() {
		// only show if a text item is right-clicked and also the option must be checked.
		// 0 = always
		// 1 = selective
		// 2 = never
		var show = !(QuickPasswords.Preferences.contextMenuOption() == 2) &&
				(
					(QuickPasswords.Preferences.contextMenuOption() == 0) ||
					((QuickPasswords.Preferences.contextMenuOption() == 1) && gContextMenu.onTextInput)
				)


		gContextMenu.showItem("context-quickPasswords", show);
		gContextMenu.showItem("context-quickPasswords-insertUser", show);
		gContextMenu.showItem("context-quickPasswords-insertPassword", show);
		gContextMenu.showItem("context-quickPasswords-cancelLogin", show);
	},

	// find last window of the given windowtype - we use this to find the changePassword window!
	getOpenWindow: function(name) {
		var mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		var win = mediator.getMostRecentWindow(name);
		return win;
	},

	loadPasswordManager: function() {
		QuickPasswords.Util.logDebug("loadPasswordManager()");
		// remove event listener
		// window.removeEventListener("load", this, false);
		// reset url to current location
		QuickPasswords.getURIcontext('');
	},

	getPasswordManagerWindow: function(filterString) {
		const name = "Toolkit:PasswordManager";
		const uri = "chrome://passwordmgr/content/passwordManager.xul";

		var win = QuickPasswords.getOpenWindow(name);

		if (!win) {
			var argstring;
			argstring = Components.classes["@mozilla.org/supports-string;1"]
							.createInstance(Components.interfaces.nsISupportsString);
			argstring.data = filterString;


			var watcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
			win = watcher.openWindow(null, uri, name, "chrome,centerscreen,resizable,alwaysRaised", argstring); //
		}
		return win;
	},

	showPasswords: function(filterString) {

		var win = this.getPasswordManagerWindow(filterString);
		this.PasswordManagerWindow = win;

		var fs = filterString; // need to marshall this into the setFilter method, the filterString parameter doesn't survive
		var fullActiveURI = this.getActiveUri(true);
		var theTime = QuickPasswords.Preferences.waitForManager();

		QuickPasswords.Util.logDebugOptional ("showPasswords","showPasswords(" + fs + ") uri=" + fullActiveURI + " time=" + theTime.toString());

		win.setTimeout(
			function () {
				QuickPasswords.Util.logDebugOptional ("showPasswords", "in setTimeout( anonymous function )");
				if (win.self.setFilter) {
					win.self.setFilter(fs);
					// now select activeURI in Manager
					var tree = win.signonsTree;
					if (tree.view && tree.view.rowCount) {
						// find activeURI
						var sel = tree.view.selection.QueryInterface(Components.interfaces.nsITreeSelection);
						for (var i=0; i<tree.view.rowCount;i++)
						{
							var s = QuickPasswords.getSite(i, tree);
							if (s==fullActiveURI) {
								sel.clearSelection();
								sel.select(i);
								var boxobject = tree.boxObject;
								boxobject.QueryInterface(Components.interfaces.nsITreeBoxObject);
								boxobject.scrollToRow(i);
								return;
							}
						}

					}
				}
			}, theTime);


	 },

	getManagerColumn:   function (idx, colName, tree) {
		if (!tree)
			tree = self.signonsTree;
		if (!tree.view.rowCount)
			return '';
		return tree.view.getCellText(idx, tree.columns.getNamedColumn(colName));
	},

	getSite:     function (idx, t) {
		// truncate at first space to avoid comment e.g. www.xxx.com (foo bar)
		var theSite =  this.getManagerColumn (idx, 'siteCol', t);
		return theSite.split(" ", 1).toString();
	},
	getUser:     function (idx, t) { return this.getManagerColumn (idx, 'userCol', t);     },
	getPassword: function (idx, t) { return this.getManagerColumn (idx, 'passwordCol', t); },


	isMailBox : function() {
	} ,

	isMailMessage : function() {

	},

	getCurrentBrowserWindow : function () {
		var DomWindow = null;
		var theBrowser = null;
		try {
			var ci = Components.interfaces;
			// find topmost navigator window
			var mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(ci.nsIWindowMediator);
			var browsers = null;

			switch (QuickPasswords.Util.Application()) {
				case 'Thunderbird': // Fall through
				case 'Postbox':
					browsers = mediator.getZOrderDOMWindowEnumerator ('mail:3pane', true);
					break
				case 'SeaMonkey':
					// navigator is the default case.
					browsers = mediator.getZOrderDOMWindowEnumerator ('navigator:browser', true);
					if (!browsers)
						browsers = mediator.getZOrderDOMWindowEnumerator ('mail:3pane', true);
					break;
				default: // Firefox
					browsers = mediator.getZOrderDOMWindowEnumerator ('navigator:browser', true);
					break;
			}
			theBrowser = browsers.getNext();
			if (theBrowser && theBrowser.getInterface)
				DomWindow = theBrowser.getInterface(ci.nsIDOMWindow);
			else {
				browsers = mediator.getXULWindowEnumerator ('navigator:browser', true);
				if (!browsers)
					browsers = mediator.getXULWindowEnumerator ('mail:3pane', true);
				if (!browsers)
					return  null;
				if (browsers.hasMoreElements()) {
					theBrowser = browsers.getNext();
					if (theBrowser.getInterface)
						DomWindow = theBrowser.getInterface(ci.nsIDOMWindow);
					else // Linux
						DomWindow = theBrowser.QueryInterface(ci.nsIInterfaceRequestor).getInterface(ci.nsIDOMWindow)
				}
				else
					DomWindow = getBrowser(); // Linux last resort

			}
		}
		catch(ex) {
			// in Linux getZOrderDOMWindowEnumerator is currently broken
			QuickPasswords.Util.logException("Error trying to get current Browser window: ", ex);
		}
		finally {
			if (!DomWindow)
				return  null;

			return DomWindow;
		}
	},


	getActiveUri : function(withServer) {
		function findAccountFromFolder (theFolder) {
			if (!theFolder)
				return null;
			var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
				.getService(Components.interfaces.nsIMsgAccountManager);
			var accounts = acctMgr.accounts;
			for (var i = 0; i < accounts.Count(); i++) {
				var account = accounts.QueryElementAt(i, Components.interfaces.nsIMsgAccount);
				var rootFolder = account.incomingServer.rootFolder; // nsIMsgFolder

				if (rootFolder.hasSubFolders) {
					var subFolders = rootFolder.subFolders; // nsIMsgFolder
					while(subFolders.hasMoreElements()) {
						if (theFolder == subFolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder))
							return account.QueryInterface(Components.interfaces.nsIMsgAccount);
					}
				}
			}
			return '';
		}
		var isMailbox = false;

		var browser = this.getCurrentBrowserWindow();
		if(browser || document.getElementById("tabmail")) {  // in Linux we cannot get the browser while options dialog is displayed :(
			try {
				var currentURI = '';
				if (QuickPasswords.Util.Application()!='Firefox') {
					var tabmail = browser.document ? browser.document.getElementById("tabmail") : document.getElementById("tabmail");
					if (tabmail) {
						var tab = tabmail.selectedTab ? tabmail.selectedTab : tabmail.currentTab;  // Pb currentTab
						var theMode = tab.mode ? tab.mode.name : tab.getAttribute("type");
						if (!browser)
							browser = tab.browser


						QuickPasswords.Util.logDebug("Selected Tab mode: " + theMode);
						switch (theMode) {
							case 'folder':
								isMailbox = true;

								try {

									var currentFolder =
										tab.folderDisplay ?
										tab.folderDisplay.displayedFolder :
										browser.GetFirstSelectedMsgFolder().QueryInterface(Components.interfaces.nsIMsgFolder);
									// var currentFolder2 = tab.folderDisplay.view.displayedFolder.QueryInterface(Components.interfaces.nsIMsgFolder);
									// var msgFolder = theFolder.QueryInterface(Components.interfaces.nsIMsgFolder);
									currentURI = currentFolder.server.hostName; // password manager shows the host name
									if (currentURI == 'localhost')
										currentURI = currentFolder.server.realHostName;
									// var act = findAccountFromFolder(currentFolder)
									// if (act.defaultIdentity) {
									//	currentURI = act.defaultIdentity;
									//}
								}
								catch(ex) { 
									QuickPasswords.Util.logException("Could not determine current folder: ",ex); 
									return ""
								}
								break;

							case 'calendar':
								currentURI="Calendar";
								break;
							case 'contentTab':      // fall through
							case 'thunderbrowse':
								var currentURI = tab.browser.currentURI.host;
								break;
							case 'tasks':
								break;
							case 'glodaFacet':         // fall through
							case 'glodaSearch-result': // fall through
							case 'glodaList':          // fall through
							case 'message':            // fall through
								// find out about currently viewed message
								try {
									var msg = null;
									if (tab.folderDisplay) {
										msg = tab.folderDisplay.selectedMessage;
									}
									else {
										if (tab.messageDisplay && tab.messageDisplay.selectedCount==1)
											msg = tab.messageDisplay.displayedMessage;
										else {
											var ar = this.alternativeGetSelectedMessages (browser);
											if (ar)
												var msgUri=ar[0];
												msg = browser.messenger.messageServiceFromURI(msgUri).messageURIToMsgHdr(msgUri);
										}
									}
									if (!msg)
										return '';
									// strip out unneccessary parts:
									//      'Author Name <author.name@domain.ext.ext>'
									//  =>                           'domain.ext.ext'
									currentURI = msg.author;
									var domainStart = currentURI.indexOf('@');
									if (domainStart) {
										currentURI = currentURI.substr(domainStart+1);
									}
									var domainEnd = currentURI.indexOf('>');
									if (domainEnd) {
										currentURI = currentURI.substr(0,domainEnd);
									}
								}
								catch(ex) { currentURI = "{no message selected}"; };

								break;
							default:
								break;
						}
					}

					if (!QuickPasswords.Util.isPrivateBrowsing()) {
						QuickPasswords.Util.logDebug("current URI of tab is: " + currentURI);
					}

				}
				else {
					var uri = browser.gBrowser.selectedTab.linkedBrowser.registeredOpenURI;

					// prepend http:// or https:// etc.
					var uriProtocol =
						 (withServer)
						 ?
						 (uri.scheme + '://')
						 :
						 "";

					currentURI = uriProtocol + uri.host;
				}
			}
			catch(ex) {
				if (!QuickPasswords.Util.isPrivateBrowsing()) {
					QuickPasswords.Util.logException("Error retrieving current URL:", ex);
				}
			}
		}

		return currentURI;
	},

	alternativeGetSelectedMessages : function (theWin)
	{
	try {
		var messageArray = {};
		var length = {};
		var view = theWin.GetDBView();
		view.getURIsForSelection(messageArray, length);
		if (length.value)
			return messageArray.value;
		else
			return null;
		}
		catch (ex) {
			dump("GetSelectedMessages ex = " + ex + "\n");
			return null;
		}
	},

	askSelectByPassword: function (win, pwdElement) {
		if (pwdElement) {
			try {
				if(pwdElement.value=='')
					alert(QuickPasswords_Bundle.GetStringFromName("enterOriginalPasswordMessage"));
				else {
					var info = {'cmd':'selectByPassword', 'pwd':pwdElement.value}; // {'cmd': 'init', 'timestamp': Date.now()}
					// second parameter for postMessage is probably completely random!
					win.opener.postMessage(info, "*"); // TARGET: chrome://passwordmgr SOURCE://chrome://quickpasswords
				}
			}
			catch(ex) {
				QuickPasswords.Util.logException("Error trying selectByPassword: ", ex);
			}
		}
	} ,


	refineUriFilter : function (win) {
		var newFilter, filter;

		if (win) {
			var activeURI = this.getActiveUri(false);

			filter = document.getElementById('filter').value;

			if (activeURI) {
				QuickPasswords.Preferences.setLastLocation(activeURI);
				// when pw manager is opened, we initialize the current URI
				// the refine function will strip the first domain token (e.g. www. etc.)
				if (!filter) {
					filter = activeURI;
				}
			}

			try { newFilter = this.getURIcontext(filter); }
			catch(er) { newFilter = ''; }

			this.PasswordManagerWindow = win;
			if (win.self.setFilter) {
				win.self.setFilter(newFilter);
			}
		}
	} ,

	copyToClipboard : function(what) {

		const name = "Toolkit:PasswordManager";
		var lstPasswords = document.getElementById('signonsTree'); // password list
		var treeView = self.signonsTreeView;
		var tree = self.signonsTree;

		if (tree.currentIndex<0) {
			var msg = QuickPasswords_Bundle.GetStringFromName("selectOneMessage");
			alert (msg);
		}


		var site = this.getSite(tree.currentIndex);
		var user = this.getUser(tree.currentIndex);
		var pwd = this.getPassword(tree.currentIndex);
		var cm,cu,cs,cp,ct;
		var sCopyDummy="";

		if (QuickPasswords.Preferences.isCopyMsg() || what=='row') {
			try {
				// in SeaMonkey, this fails for some reason
				cm = QuickPasswords_Bundle.GetStringFromName("copyMessage");
				cu = QuickPasswords_Bundle.GetStringFromName("copyMessageUser");
				cs = QuickPasswords_Bundle.GetStringFromName("copyMessageDomain");
				cp = QuickPasswords_Bundle.GetStringFromName("copyMessagePassword");
				ct = QuickPasswords_Bundle.GetStringFromName("copyMessageTitle"); // currently unused
			}
			catch (ex)
			{
				QuickPasswords.Util.logToConsole("Error trying to get string bundle: " + ex);
				cm = "Copied Password to Clipboard!";
				cu = "User";
				cs = "Site";
				ct = "QuickPasswords";
				cp = "Password";
			}
		}

		switch (what) {
			case 'pwd':
				QuickPasswords.Util.copyStringToClipboard(pwd);
				if (QuickPasswords.Preferences.isCopyMsg())
					alert (cm + '\n' + cu + ': ' + user + '\n' + cs + ': ' + site);
				break;

			case 'url':
				QuickPasswords.Util.copyStringToClipboard(site);

				if (QuickPasswords.Preferences.isCopyMsg())
					alert (cm.replace(new RegExp(cp, "i" ), cs) + '\n' + cu + ': ' + user + '\n' + cs + ': ' + site); // replace case insensitive!
				break;


			case 'usr':
				QuickPasswords.Util.copyStringToClipboard(user);

				if (QuickPasswords.Preferences.isCopyMsg())
					alert (cm.replace(new RegExp(cp, "i" ), cu) + '\n' + cu + ': ' + user + '\n' + cs + ': ' + site); // replace case insensitive!
				break;

			case 'row':
				var iPasswordsSelected = 0;
				var start = new Object();
				var end = new Object();
				var numRanges = tree.view.selection.getRangeCount();
				var sLine = '';
				var sCopyText='';

				for (var t = 0; t < numRanges; t++){
					tree.view.selection.getRangeAt(t,start,end);
					for (var v = start.value; v <= end.value; v++){
						iPasswordsSelected++;
						site = this.getSite(v);
						user = this.getUser(v);
						pwd = this.getPassword(v);
						sLine = site + '\t' + user + '\t' + pwd;
						sCopyText = sCopyText + sLine + '\n';
						sCopyDummy = sCopyDummy + site + '\t' + user + '\t' + '*********\n';
					}
				}
				if (iPasswordsSelected==0) {
					cm = QuickPasswords_Bundle.GetStringFromName("selectOneMessage");
					alert (cm);
					return;
				}

				if (iPasswordsSelected > 1) {
					if (QuickPasswords.Preferences.isMultiRowHeader())
						sCopyText = cs + '\t' + cu + '\t' + cp + '\n' + sCopyText;
					sCopyDummy = cs + '\t' + cu + '\t' + cp + '\n' + sCopyDummy;

					QuickPasswords.Util.copyStringToClipboard(sCopyText);
				}
				else
					QuickPasswords.Util.copyStringToClipboard(site + '\t' + user + '\t' + pwd);
				if (QuickPasswords.Preferences.isCopyMsg()) {
					try {
						if (1==iPasswordsSelected)
							cm = QuickPasswords_Bundle.GetStringFromName("copyRecordMessage");
						else
							cm = QuickPasswords_Bundle.GetStringFromName("copyRecordsMessage");
					}
					catch(e) {
						QuickPasswords.Util.logToConsole("Error getting String Bundle GetStringFromName\n" + e);
						cm="Data copied to clipboard - see error console for detail";
					}
					alert (cm);
				}
				break;

		}

		if (!QuickPasswords.Util.isPrivateBrowsing()) {
			if (""!=sCopyDummy)
				QuickPasswords.Util.logToConsole("Copied Password Information to Clipboard:\n" + sCopyDummy);
			else
				QuickPasswords.Util.logToConsole("Copied Password Information to Clipboard for user: " + user + " at site: " + site);
		}

		if (QuickPasswords.Preferences.isAutoClose())
			this.closePasswordManager();
	},

	closePasswordManager: function() {
		if (null==this.PasswordManagerWindow)
			this.PasswordManagerWindow = self;
		this.PasswordManagerWindow.close();
		this.PasswordManagerWindow=null;
	} ,

	// retrieves current URI from clicked context
	// in a browser window we will get this from the global content var
	// in a tabmail window, lets use the getActiveUri helper function
	getURIcontext: function(currentFilter) {
		var sBaseDomain;

		// if currentFilter is passed in, lets refine it more!

		if (content) {
			QuickPasswords.lastContentLocation = content.location.host;
			QuickPasswords.Preferences.setLastLocation(content.location.host);
		}
		else
			QuickPasswords.lastContentLocation = QuickPasswords.Preferences.getLastLocation();

		var sHost = QuickPasswords.lastContentLocation ;


		var pos = sHost.indexOf('.');
		var s2 = sHost.substring(pos+1, sHost.length);
		var pos2 = s2.indexOf('.');
		// strip first word if second is long enough to be a domain; gets rid of stuff like www. login. etc.
		if (pos2>3)
			sHost=sHost.substring(pos+1,sHost.length);
		if (sHost == currentFilter) {
			sBaseDomain = QuickPasswords.lastContentLocation;
		}
		else
			sBaseDomain = sHost;
		if (!QuickPasswords.Util.isPrivateBrowsing())
			QuickPasswords.Util.logDebug("Determined Domain from Host String:" + sBaseDomain);

		return sBaseDomain;
	},

	getContextMenu: function(win, sName) {
		if (!win)
			return;
		return win.document.getElementById('context-quickPasswords-' + sName);
	} ,

	prepareContextMenu: function(win, sName, sValue) {
		if (!win)
			return;
		var doc = win.document ? win.document : window.document;
		var el = doc.getElementById('context-quickPasswords-' + sName);
		if(el) {
			el.collapsed= (sValue == '') ? true : false
			el.quickPasswordsData = sValue;
		}

	} ,

	attemptLogin: function() {
		var tree = window.signonsTree;
		if (tree.currentIndex<0) {
			var msg = QuickPasswords_Bundle.GetStringFromName("selectOneMessage");
			alert (msg);
			return;
		}
		// get main window context menu and uncollapse the invisible login items.
		// Right-click the User and Password boxes to insert the Information automatically. This operation is extra secure as it does not use the Clipboard at all.
		if (QuickPasswords.Preferences.isLoginMsg())
			alert (QuickPasswords_Bundle.GetStringFromName('loginPrompt'));

		var win = QuickPasswords.getCurrentBrowserWindow ();

		if (win) {
			var el;
			var user = this.getUser(tree.currentIndex, tree);
			QuickPasswords.prepareContextMenu(win, 'insertUser', user);

			var pwd = this.getPassword(tree.currentIndex, tree);
			QuickPasswords.prepareContextMenu(win, 'insertPassword', pwd);

			QuickPasswords.prepareContextMenu(win, 'cancelLogin', 'cancel');

			setTimeout(function() { QuickPasswords.Util.popupAlert("QuickPasswords", "Password + User prepared, right click the textbox to insert."); }, 0);

			// close the window
			if (QuickPasswords.Preferences.isAutoClose())
				this.closePasswordManager();

		}

	},

	onMenuItemCommand: function(e, cmd, clickTarget) {
		var filter;
		var menuItem = e.target;

		var parentMenu = e.explicitOriginalTarget.parentNode;

		if (!cmd)
			cmd='passwordManager';
		var browserWin = QuickPasswords.getCurrentBrowserWindow ();

		switch (cmd) {
			case 'passwordManager':
				// reset + collapse menu contents if there are any left from last time.
				// this can also be used by users to clear out the password / user info from the context menu.
				// make sure to add a listener later that resets it as soon as the originating page URI is replaced
				// however, we shall still allow inserting User/password on another tab!
				// there is no instantiation per tab, its global to the browser
				QuickPasswords.prepareContextMenu(browserWin, 'insertUser', '');
				QuickPasswords.prepareContextMenu(browserWin, 'insertPassword', '');
				QuickPasswords.prepareContextMenu(browserWin, 'cancelLogin', '');

				// reset last location and determine it fresh
				QuickPasswords.Preferences.setLastLocation('');

				switch (QuickPasswords.Util.Application()) {
					case 'Postbox':     // fall through
					case 'Thunderbird': // try to use folder mail account name or email sender as filter?
						filter = this.getActiveUri(false);
						break;
					case 'Firefox': // use current address bar address, if in
						filter = this.getURIcontext('');
						break;
					case 'SeaMonkey':
						// we need to find out whether I am called from the messenger window or from navigator!
						try { filter = this.getURIcontext(''); }
						catch(er) { filter = ''; }
						break;
				}
				this.showPasswords(filter);
				break;

			case 'cancelLogin': // reset the context menu items
				QuickPasswords.prepareContextMenu(browserWin, 'insertUser', '');
				QuickPasswords.prepareContextMenu(browserWin, 'insertPassword', '');
				QuickPasswords.prepareContextMenu(browserWin, 'cancelLogin', '');
				break;

			default:
				var pMenu = QuickPasswords.getContextMenu(browserWin, 'insertPassword');
				var uMenu = QuickPasswords.getContextMenu(browserWin, 'insertUser');
				var cMenu = QuickPasswords.getContextMenu(browserWin, 'cancelLogin');
				var managerWin = QuickPasswords.PasswordManagerWindow;
				if (managerWin && (!managerWin.signonsTree || managerWin.closed)) { //stale info?
					managerWin=null;
					QuickPasswords.PasswordManagerWindow=null; // should do this on pwd manager close!!

				}

				// get password / username from selected row in Password Manager
				// this has precedence over a previously selected login that might
				// still be stored in the context menu item...
				if (managerWin) {
					var tree = managerWin.signonsTree;
					if (tree.currentIndex<0) {
						var msg = QuickPasswords_Bundle.GetStringFromName("selectExactlyOneEntry");
						alert (msg);
						return;
					}
					var removeCancel = false;
					var el = null;
					switch(cmd) {
						case 'pasteUser':
							// get User from highlighted location and insert it into current textbox (without using clipboard)
							var user = QuickPasswords.getUser(tree.currentIndex, tree);
							clickTarget.value = user;
							// if both password and user are empty, remove the cancel item!
							if (pMenu.collapsed) {
								removeCancel = true;
								el = pMenu;
							}
							break;

						case 'pastePassword':
							el = browserWin.document.getElementById('context-quickPasswords-pasteUser')
							// get Password from highlighted location and insert it into current textbox (without using clipboard)
							var pwd = QuickPasswords.getPassword(tree.currentIndex, tree);
							clickTarget.value = pwd;
							// if both password and user are empty, remove the cancel item!
							if (uMenu.collapsed) {
								removeCancel = true;
								el = uMenu;
							}
							break;
					}


				}
				else {
					if (menuItem) {
						switch(cmd) {
							case 'pasteUser':
								if (pMenu.collapsed) {
									removeCancel = true;
									el = pMenu;
								}
								clickTarget.value = menuItem.quickPasswordsData;
								break;
							case 'pastePassword':
								// if both password and user are empty, remove the cancel item!
								if (uMenu.collapsed) {
									removeCancel = true;
									el = uMenu;
								}
								clickTarget.value = menuItem.quickPasswordsData;
								break;
						}
					}
				}
				// reset & hide insert menu item
				if (menuItem
					&&
					(cmd =='pasteUser' || cmd == 'pastePassword')
					)
				{
					menuItem.collapsed = true;
					menuItem.quickPasswordsData = '';
				}
				if (removeCancel) {
					cMenu.collapsed = true;
					cMenu.quickPasswordsData = '';
				}

		}

		// if (this.strings==null) this.onLoad();
		/*promptService.alert(window, this.strings.getString("helloMessageTitle"),
									this.strings.getString("helloMessage")); */
	},

// 	onContextMenuCommand: function(e) {
// 		promptService.alert(window,"test","onContextMenuCommand...");
// 		this.showPasswords('test.com'); // filter string from id of right click item! or from current domain?
// 	},

	onToolbarButtonCommand: function(e) {
		QuickPasswords.onMenuItemCommand(e);
	},

	onLoadChangePassword: function() {
		QuickPasswords.Util.onLoadVersionInfoDialog();
        if (window.arguments && window.arguments[0].inn)
        {
			//get site and domain and open the window
			document.getElementById('qp-Site').value = window.arguments[0].inn.site;
			document.getElementById('qp-User').value = window.arguments[0].inn.user;
			document.getElementById('qp-hdnPassword').value = window.arguments[0].inn.password;
			document.getElementById('txtOldPassword').value = window.arguments[0].inn.password;
		}

	},


	processSelectedPassword: function(srvLoginManager, v, oldPassword, newPassword) {
		var loginsChanged = 0;

		function displayLoginInfo(items)
		{
			var str = '';
			for (var i=0; i<items.length; i++) {
				str = str
					+ '[' + i + ']\n'
					+ 'formSubmitURL: '+ items[i].formSubmitURL + '\n'
					+ 'hostname:      '+ items[i].hostname + '\n'
					+ 'password:      '+ '*********' + '\n'
					+ 'passwordField: '+ items[i].passwordField + '\n'
					+ 'username:      '+ items[i].username + '\n'
					+ 'usernameField: '+ items[i].usernameField;
				if (items[i].httpRealm)
					str = str +  'httpRealm:     '+ items[i].httpRealm + '\n';

			}
			return str;
		}

//		from docs for nsILoginManager:
// 		void searchLogins(
// 			out unsigned long count,
// 			in nsIPropertyBag matchData,
// 			[retval, array, size_is(count)] out nsILoginInfo logins
// 		);
		var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
		                              Components.interfaces.nsILoginInfo,
		                              "init");
		var site = QuickPasswords.getSite(v);
		var user = QuickPasswords.getUser(v);

// 		// try this one...
// 		// see https://developer.mozilla.org/en/XPCOM_Interface_Reference/Using_nsILoginManager
// 		// also: http://pastebin.mozilla.org/1387854
// 		srvLoginManager.findLogins({}, hostname, formSubmitURL, httprealm);

//		var bag = Components.Constructor['@mozilla.org/hash-property-bag;1']
//					.createInstance(Components.interfaces.nsIPropertyBag);

		const nsPropertyBag = Components.Constructor('@mozilla.org/hash-property-bag;1', 'nsIWritablePropertyBag');
		var bag = nsPropertyBag();

		// add some properties to the bag - to filter out the correct credentials
		bag.setProperty('hostname', site);

//		bag.setProperty('username', user); // unfortunately we cannot do this - it throws error NS_ERROR_XPC_JS_THREW_STRINGS Unexpected field: username
					// this might be a bug in nsILoginManager.searchLogins ??

// other Attributes
//		password
// 		formSubmitURL
// 		hostname
// 		httpRealm
// 		password
// 		passwordField
// 		username
// 		usernameField

		//  out arguments must be objects.
		// = new Object();
		var count = new Object();
		// this will create an array of nsLoginInfo(s)
		var matches  = srvLoginManager.searchLogins(count, bag);

		// count should be 1 to be unique!!
		if (count) {
			QuickPasswords.Util.logDebug('Found ' + count.value + ' match(es):');
			for (var i=0; i<matches.length; i++) {
				if (matches[i].username == user
				    &&
				    matches[i].password == oldPassword)
				{
					QuickPasswords.Util.logDebug('Changing Login: ' + displayLoginInfo(matches));
					var newLogin = matches[i].clone();
					/*******************************/
					/*  MODIFIES THE PASSWORD!!    */
					/*******************************/
					newLogin.password = newPassword;
					loginsChanged ++;
					// overwrite with new Password
					srvLoginManager.modifyLogin(matches[i], newLogin);


				}
			}

		}

		return loginsChanged;
	} ,

	// setting up a message listener to wait for a password for bulk change;
	// as I need to call the tree traversing code from the PasswordManager context
	receiveCommand: function(event) {
		var filter;
		QuickPasswords.Util.logDebug('received a message!\n'
			+ 'cmd:' + event.data.cmd + '\n '
			+ 'pwd:' + event.data.pwd.replace(new RegExp('.', 'g'),'*') + '\n'
			+ 'origin: ' + event.origin );
		try {
			switch(event.data.cmd) {
				case 'selectByPassword':
					filter = event.data.pwd;
					QuickPasswords.selectByPassword(filter);
					break;
				case 'changeBulkPasswords':
					// match password
					filter = event.data.pwd;
					var bMatch=true;
					var newPassword = event.data.newPwd;
					var theWin = QuickPasswords.getOpenWindow("dlg:QuickPasswords_Change");
					QuickPasswords.promptParentWindow = theWin ? theWin : window;

					// iterate selection and make sure all passwords match
					var tree = window.signonsTree;
					var selection = tree.view.selection;

					var user, site, pwd;
					var iPasswordsSelected = 0;
					var start = new Object();
					var end = new Object();
					var numRanges = selection.getRangeCount();
					var iPasswordsSelected = 0;
					var sSites = "";

					for (var t = 0; t < numRanges; t++){
						selection.getRangeAt(t,start,end);
						for (var v = start.value; v <= end.value; v++){
							iPasswordsSelected++;
							pwd = QuickPasswords.getPassword(v);
							if (filter != pwd)
								bMatch = false;
							sSites = sSites + ', ' + QuickPasswords.getSite(v);
						}
					}

					var iPasswordsModified = 0;
					// change passwords
					if (bMatch) {
						pwd = filter;
						if (QuickPasswords.promptParentWindow.confirm( QuickPasswords_Bundle.GetStringFromName('changePasswordPrompt') + "\n" + sSites.substr(2))) {
							var srvLoginManager =
								Components.classes["@mozilla.org/login-manager;1"]
									.getService(Components.interfaces.nsILoginManager);

							for (var t = 0; t < numRanges; t++){
								selection.getRangeAt(t,start,end);
								for (var v = start.value; v <= end.value; v++)
								{
									iPasswordsSelected--;
									iPasswordsModified = iPasswordsModified
											+ QuickPasswords.processSelectedPassword (srvLoginManager, v, filter, newPassword);

								}
							}
							QuickPasswords.promptParentWindow.alert(QuickPasswords.Util.stringFormat(QuickPasswords_Bundle.GetStringFromName('successChangePasswordsMessage'), iPasswordsModified));
							// we now MUST refresh the tree view because it contains the stale password. it does not automagically update itself.`

							// Clear the Tree Display
							window.self.SignonClearFilter();
							var theFilter = document.getElementById('filter').value;
							window.self.setFilter(theFilter);

							if (iPasswordsModified>0) {
								//close the change Passwords dialog!
								if (theWin)
									theWin.close();
							}

// 							tree.view.rowCount = 0;
// 							tree.treeBoxObject.rowCountChanged(0, -tree.view._filterSet.length);
// 							window.self.LoadSignons();
// 							var theFilter = document.getElementById('filter').value;
// 							if (window.self.setFilter)
// 							{
// 								window.setTimeout(, 20);
// 							}



						};
					}
					else {
						// if not: display error
						QuickPasswords.promptParentWindow.alert(QuickPasswords_Bundle.GetStringFromName("wrongPasswordMessage"));
					}
					break;
				default:
					alert('received an invalid message!\n data:'
						+ event.data + '\norigin: '
						+ event.origin );

			}
		}
		catch(ex) {
			alert(ex);
		}
	} ,



	displayChangePassword: function(that) {
		try {
			var tree = window.signonsTree;
			var tI = tree.currentIndex;

			if (tree.view.selection.count==0 || ''==theSite)
				alert(QuickPasswords.Properties.GetStringFromName("selectOneMessage"));
			else
			{
				var theSite = QuickPasswords.getSite(tI);
				var params =
				{
					inn:
					{	site:theSite,
						user:QuickPasswords.getUser(tI),
						password:QuickPasswords.getPassword(tI),
						instance: QuickPasswords
					},
					out:null
				};
				window.addEventListener("message", this.receiveCommand, false);

				// window name (2nd parameter) really has no function, do not confuse with windowtype!
				window.openDialog('chrome://quickpasswords/content/changePassword.xul',
					'quickpasswords-editPassword',
					'chrome,titlebar,resizable,dependent,alwaysRaised,top=' + window.screenY.toString() + ',left=' + (window.screenX + window.outerWidth).toString(),
					params).focus();
			}
		}
		catch(e) { alert(e); }
	},

	selectByPassword : function (thePassword) {
		// get tree from PasswordManager window
		var tree = window.signonsTree;
		tree.selectedIndex = tree.currentIndex; // only select one item!

		var selection = tree.view.selection;
		selection.clearSelection();

		var view = tree.view.QueryInterface(Components.interfaces.nsITreeView);

		for (var i=0; i<tree.view.rowCount;i++)
		{
			if (this.getManagerColumn (i, 'passwordCol') == thePassword)
			{
				selection.toggleSelect(i);
			//	var item = view.getItemAtIndex(i);
			//	tree.addItemToSelection( item );

			}

		}
	},


	onAcceptChangePasswords: function(pwdElement) {
		if (document.getElementById('txtNewPassword').value=='') {
			alert(QuickPasswords_Bundle.GetStringFromName('enterNewPasswordsPrompt'));
			return false;
		}
		if (document.getElementById('txtNewPassword').value!=document.getElementById('txtNewPassword2').value) {
			alert(QuickPasswords_Bundle.GetStringFromName('newPasswordsDontMatch'));
			return false;
		}

		var info = {
			'cmd':'changeBulkPasswords',
			'pwd':pwdElement.value,
			'newPwd':document.getElementById('txtNewPassword').value
			};
		// second parameter for postMessage is probably completely random!
		window.opener.postMessage(info, "*"); // TARGET: chrome://passwordmgr SOURCE://chrome://quickpasswords
		return false;
	}


};