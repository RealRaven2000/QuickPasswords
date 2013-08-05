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

	2.2 - 23/10/2012
		Completed fr locale - thanks to Jean Michel Bourde
		Added Italian Locale - thanks to Leopoldo Saggin
		Fixed a problem with showing advanced debug settings (window was going to background)
		Replaced deprecated -moz-linear-gradient CSS values
		Replaced -moz-transition CSS values with newer ones

	2.3 - 13/12/2012
	  Fixed legacy layout issues in Postbox
	  Ietab2 support
		make it possible to disable donation screen displayed on update by changing extensions.quickpasswords.donations.askOnUpdate = false
		
		known issues: Problems wit replacing multiple passwords - Thunderbird throws error...
		
	2.5 - 10/01/2013
    Fixed an issue in load method "Warning: ReferenceError: reference to undefined property QuickPasswords.Util.AppverFull" 
		New [FR 25287] automatic login on double click
		New [FR 25287] QuickPasswords now inserts the login information automatically 
		               How: QuickPasswords will go through all forms in the page and match the names of password & user name 
									 fields and also make sure these are currently visible. (Many pages have multiple forms, some of them hidden)
									 Only then it will insert matching information username / password or both. If something cannot be matched, then the
									 context menu entry of the missing field(s) is added as a fallback, like in the previous version.
		Removed duplicate "copy UserName" menu item.
		Known Issues: The context menu is always visible when in a Thunderbird content tab

	2.6 - 17/01/2013
	  Fixed [Bug 25307] - On the Statusbar of Thunderbird and SeaMOnkey mail windows some or all icons are missing
		Added QuickPasswords command to folder pane context menu
		Improved filter prediction in SeaMonkey mail windows
		   We are  now able to filter passwords for 
			    - the mailbox when right-clicking a folder 
					- the sender domain when right-clicking a message
	2.7 - 02/02/2013
    Added [x] "do not show this message again" checkbox to make it easier for beginners 
		         (no need to open options dialog any more)
    AutoClose - default to true for less clutter	
    moved wizard button to top
		Rearranged action buttons to right making them easier accessible
		made version check at startup more robust
		toned down the small icons (less opacity) and removed obsolete graphics
		Double-click and Enter key can be used for login directly from the Saved Passwords list
		New feature to correct changed login field names
		Fixed size for large icon mode
 
  2.8 - 13/02/2013
    Fixed [Bug 25336] - From Fx18.0.2 upwards - When changing a many of passwords an error can be thrown by Mozilla core code:
      "Javascript Error: signon is undefined" or "undefined proiperty table[selections[0].number]"		

  2.9 - WIP
    Improved automatic password filling to also work with form elements that are identified by name and not by id.
		Bumped up compatibility
		nsIPrivateBrowsingService was removed in version 20 for per-window private browsing mode
		fix: made compatible with redefinition of Thunderbird's nsIMsgAccount interface 
		
===========================================================================================

		Planned: adding option for configuring delimiter of multi line export. At the moment this is hard coded to tab.
		Planned: after successfully changing multiple passwords, hide the change dialog and refresh the passwords list (old password is still shown)
		Nice to Have: support "change password" doorhanger with an additional button "multiple sites")
		http://mxr.mozilla.org/mozilla-central/source/toolkit/components/passwordmgr/nsLoginManagerPrompter.js#1023

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
	signonsTree: null,
	onLoad: function() {
		if(this.initialized)
			return;

		QuickPasswords.Util.checkVersionFirstRun(); // asynchronous version check

		//http://kb.mozillazine.org/Adding_items_to_menus
		let menu = document.getElementById("contentAreaContextMenu");
		if (QuickPasswords.Util.Application == 'Thunderbird' || QuickPasswords.Util.Application == 'Postbox')
			menu = document.getElementById("mailContext");
		QuickPasswords.Util.logDebugOptional ("contextMenu", "searched contentArea context menu: " + (menu ? 'found.' : 'not found.'));
		// no need to do this when coming back from password window, document context is wrong then and throws an error
		if (menu) {
			menu.addEventListener("popupshowing", QuickPasswords.contextPopupShowing, false);
		}

		QuickPasswords_BundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
		QuickPasswords_Bundle = QuickPasswords_BundleService.createBundle("chrome://quickpasswords/locale/overlay.properties");
		this.strings = document.getElementById("QuickPasswords-strings");
		QuickPasswords.Util.logDebug("QuickPasswords " + QuickPasswords.Util.Version
			 + " running on " + QuickPasswords.Util.Application
			 + " Version " + QuickPasswords.Util.AppVersionFull + "."
			 + "\nOS: " + QuickPasswords.Util.HostSystem);
		this.initialized = true;
	},

	contextPopupShowing: function() {
	  function showInMenu(contextMenu, visible) {
			if (contextMenu) {
				contextMenu.showItem("context-quickPasswords", visible);
				contextMenu.showItem("context-quickPasswords-insertUser", visible);
				contextMenu.showItem("context-quickPasswords-insertPassword", visible);
				contextMenu.showItem("context-quickPasswords-cancelLogin", visible);
				QuickPasswords.Util.logDebugOptional ("contextMenu", 'contextPopupShowing: visible = ' + visible);
			}
			else {
				QuickPasswords.Util.logDebugOptional ("contextMenu", 'Context Menu not found!');
			}
		}
		QuickPasswords.Util.logDebugOptional ("contextMenu", "contextPopupShowing() ...");

		let menu;
		switch (QuickPasswords.Util.Application) {
			case 'Thunderbird': // Fall through
			case 'Postbox':
				menu = document.getElementById('mailContext');
				break
			case 'SeaMonkey':
				menu = gContextMenu;
				break;
			case 'Firefox':
				menu = gContextMenu;
				break;
		}
		// only show if a text item is right-clicked and also the option must be checked.
		// 0 = always
		// 1 = selective
		// 2 = never
		let show = !(QuickPasswords.Preferences.contextMenuOption() == 2) &&
				(
					(QuickPasswords.Preferences.contextMenuOption() == 0) ||
					((QuickPasswords.Preferences.contextMenuOption() == 1) && menu.onTextInput)
				);
		showInMenu(menu, show);
				
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
		var fullActiveURI = this.getActiveUri(true, true);
		var theTime = QuickPasswords.Preferences.waitForManager();

		QuickPasswords.Util.logDebugOptional ("showPasswords","showPasswords(" + fs + ") uri=" + fullActiveURI + " time=" + theTime.toString());

		win.setTimeout(
			function () {
				QuickPasswords.Util.logDebugOptional ("showPasswords", "in setTimeout( anonymous function )");
				// ieTab2 support - disable the login to page as we cannot control context menu of the IE container
				if (content) {
					let btnLogin = 	win.document.getElementById('quickPasswordsLogin');
					let host = content.location.host;
					if (btnLogin)
						btnLogin.disabled = (host == "ietab2" || host == "messenger");
				}
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
			tree = self.signonsTree ? self.signonsTree : QuickPasswords.signonsTree;  // we might have hidden this for SSO password change!
		if (!tree.view.rowCount)
			return '';
		try {
			return tree.view.getCellText(idx, tree.columns.getNamedColumn(colName));
		}
		catch (ex) {
		  throw('getCellText(idx=' + idx + ', colName = ' + colName + ' threw exception:\n' + ex.toString());
		}
	},

	getSite: function (idx, t) {
		// truncate at first space to avoid comment e.g. www.xxx.com (foo bar)
		var theSite =  this.getManagerColumn (idx, 'siteCol', t);
		return theSite.split(" ", 1).toString();
	},
	getUser: function (idx, t) { return this.getManagerColumn (idx, 'userCol', t); },
	getPassword: function (idx, t) { return this.getManagerColumn (idx, 'passwordCol', t); },


	isMailBox : function() {
	} ,

	isMailMessage : function() {

	},

	getCurrentBrowserWindow : function (evt) {
		let ci = Components.interfaces;
		let interfaceType = ci.nsIDOMWindow;
		var DomWindow = null;
		var theBrowser = null;
		try {
			// find topmost navigator window
			let mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(ci.nsIWindowMediator);
			let browsers = null;

			switch (QuickPasswords.Util.Application) {
				case 'Thunderbird': // Fall through
				case 'Postbox':
					browsers = mediator.getZOrderDOMWindowEnumerator ('mail:3pane', true);
					break
				case 'SeaMonkey':
				  // check if click comes from mail window:
					if (evt && evt.originalTarget && evt.originalTarget.baseURI == "chrome://messenger/content/messenger.xul"
					    ||
							content && content.window && content.window.name == 'messagepane')
						browsers = mediator.getZOrderDOMWindowEnumerator ('mail:3pane', true);
					// navigator is the fallback case.
					if (!browsers)
						browsers = mediator.getZOrderDOMWindowEnumerator ('navigator:browser', true);
						
					break;
				default: // Firefox
					browsers = mediator.getZOrderDOMWindowEnumerator ('navigator:browser', true);
					break;
			}
			theBrowser = browsers.getNext();
			if (theBrowser && theBrowser.getInterface)
				DomWindow = theBrowser.getInterface(interfaceType);
			else {
				browsers = mediator.getXULWindowEnumerator ('navigator:browser', true);
				if (!browsers)
					browsers = mediator.getXULWindowEnumerator ('mail:3pane', true);
				if (!browsers)
					return  null;
				if (browsers.hasMoreElements()) {
					theBrowser = browsers.getNext();
					if (theBrowser.getInterface)
						DomWindow = theBrowser.getInterface(interfaceType);
					else // Linux
						DomWindow = theBrowser.QueryInterface(ci.nsIInterfaceRequestor).getInterface(interfaceType)
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

	getActiveUri : function(withServer, withHost) {
		function findAccountFromFolder (theFolder) {
			if (!theFolder)
				return null;
			let Ci = Components.interfaces;
			let acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
				.getService(Ci.nsIMsgAccountManager);
			let accounts = acctMgr.accounts;
			let iAccounts = (typeof accounts.Count === 'undefined') ? accounts.length : accounts.Count();
			for (let i = 0; i < iAccounts; i++) {
				let account = accounts.queryElementAt ?
					accounts.queryElementAt(i, Ci.nsIMsgAccount) :
					accounts.GetElementAt(i).QueryInterface(Ci.nsIMsgAccount);
				let rootFolder = account.incomingServer.rootFolder; // nsIMsgFolder

				if (rootFolder.hasSubFolders) {
					let subFolders = rootFolder.subFolders; // nsIMsgFolder
					while(subFolders.hasMoreElements()) {
						if (theFolder == subFolders.getNext().QueryInterface(Ci.nsIMsgFolder))
							return account.QueryInterface(Ci.nsIMsgAccount);
					}
				}
			}
			return '';
		}
		
		let isMailbox = false;

		let browser = this.getCurrentBrowserWindow();
		let tabmail = null;
		let currentURI = '';
		
		if (browser || document.getElementById("tabmail")) {  // in Linux we cannot get the browser while options dialog is displayed :(
			try {
				let isOriginBrowser = (QuickPasswords.Util.Application=='Firefox');
				// for SeaMonkey we need to determine whether we opened from the messenger or from the navigator window
				if (QuickPasswords.Util.Application!='Firefox') {
					tabmail = browser.document ? browser.document.getElementById("tabmail") : document.getElementById("tabmail");
					// double check whether we come from browser
					if (QuickPasswords.Util.Application=='SeaMonkey') {
					  if (!tabmail) {
							isOriginBrowser = true;
						}
						else {  
						  // both windows are open, now what?
						  // best: which window is in foreground. or which window called (owner?)
						}
					}
				}
				/*     GET CONTEXT FROM CURRENT MAIL TAB  */
				if (!isOriginBrowser) {
					
					if (tabmail) {
						var tab = tabmail.selectedTab ? tabmail.selectedTab : tabmail.currentTab;  // Pb currentTab
						var theMode = tab.mode ? tab.mode.name : tab.getAttribute("type");
						if (!browser)
							browser = tab.browser;
						if (theMode == 'folder') {
						  // if we are in folder mode we might have a message selected
							if (tab.folderDisplay && tab.folderDisplay.focusedPane && tab.folderDisplay.focusedPane.id =='threadTree') {
								theMode = 'message';
							}
						}

						QuickPasswords.Util.logDebug("Selected Tab mode: " + theMode);
						switch (theMode) {
							case 'folder':
								isMailbox = true;

								try {
									let currentFolder =
										tab.folderDisplay ?
										tab.folderDisplay.displayedFolder :
										browser.GetFirstSelectedMsgFolder().QueryInterface(Components.interfaces.nsIMsgFolder);
									// var currentFolder2 = tab.folderDisplay.view.displayedFolder.QueryInterface(Components.interfaces.nsIMsgFolder);
									// var msgFolder = theFolder.QueryInterface(Components.interfaces.nsIMsgFolder);
									currentURI = currentFolder.server.hostName; // password manager shows the host name
									if (currentURI == 'localhost') {
										currentURI = currentFolder.server.realHostName;
									}
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
										if (tab.messageDisplay && tab.messageDisplay.selectedCount==1) {
											msg = tab.messageDisplay.displayedMessage;
										}
										else {
											let msgUri = this.alternativeGetSelectedMessageURI (browser);
											if (msgUri) {
												msg = browser.messenger.messageServiceFromURI(msgUri).messageURIToMsgHdr(msgUri);
											}
										}
									}
									if (!msg) return '';
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
								catch(ex) { 
								  QuickPasswords.Util.logException("Could not retrieve message from context menu", ex);
									currentURI = "{no message selected}"; 
								};
								break;
							default:
								break;
						}
					}

					if (!QuickPasswords.Util.PrivateBrowsing) {
						QuickPasswords.Util.logDebug("current URI of tab is: " + currentURI);
					}

				}
				/*     GET CONTEXT FROM CURRENT BROWSER  */
				else {
				  // Fx
					let lB = browser.gBrowser.selectedTab.linkedBrowser;
					// SM:
					let uri = lB.registeredOpenURI ? lB.registeredOpenURI : lB.currentURI;
				  // for ieTab support, we need to filter:
					// chrome://ietab2/content/reloaded.html?url=
					
					// prepend http:// or https:// etc.
					var uriProtocol =
						 (withServer)
						 ?
						 (uri.scheme + '://')
						 :
						 "";
					
					if (uri.host == "ietab2") {
						// find first url parameter:
						let f = uri.path.indexOf("?url=");
						let ieTabUri = "";
						if (f > 0) {
							let ieTabUri = uri.path.substring(f + 5);
							f = ieTabUri.indexOf("//");
							if (withServer && f > 0) {
								uriProtocol = ieTabUri.substring(0, f+2);
							}
							else {
								uriProtocol = "";
							}
							let r = ieTabUri.substring(f+2);
							currentURI = uriProtocol +  r.substring(0 , r.indexOf("/"));
							return currentURI;
						}
					}

					let domain = withHost 
												? uri.host
												: uri.host.substr(uri.host.indexOf('.')+1);
					currentURI = uriProtocol + domain;
					
				}
			}
			catch(ex) {
				if (!QuickPasswords.Util.PrivateBrowsing) {
					QuickPasswords.Util.logException("Error retrieving current URL:", ex);
				}
			}
		}

		return currentURI;
	},

	alternativeGetSelectedMessageURI : function (theWin)
	{
	try {
		let view = theWin.GetDBView();
		if (view.URIForFirstSelectedMessage)
			return view.URIForFirstSelectedMessage;
		
		let messageArray = {};
		let length = {};
		view.getURIsForSelection(messageArray, length);
		if (length.value)
			return messageArray.value[0];
		else
			return null;
		}
		catch (ex) {
			dump("alternativeGetSelectedMessageURI ex = " + ex + "\n");
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
			var activeURI = this.getActiveUri(false, true);

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

		if (QuickPasswords.Preferences.isCopyMsg || what=='row') {
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
		// prompts that can be hidden 
		let prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]  
														.getService(Components.interfaces.nsIPromptService);  
		let dontShowAgain = QuickPasswords.Util.getBundleString("dontShowAgain", "Do not show this message again.")						
		let check = {value: false};   // default the checkbox to true  
		let title = QuickPasswords.Util.getBundleString("copyMessageTitle", "QuickPasswords");

		switch (what) {
			case 'pwd':
				QuickPasswords.Util.copyStringToClipboard(pwd);
				
				if (QuickPasswords.Preferences.isCopyMsg) {
					let msg = cm + '\n' + cu + ': ' + user + '\n' + cs + ': ' + site;
					let result = prompts.alertCheck(null, title, msg, dontShowAgain, check);
					if (check.value==true) {
						QuickPasswords.Preferences.setBoolPref("copyMsg", false);
					}
				}
				break;

			case 'url':
				QuickPasswords.Util.copyStringToClipboard(site);

				if (QuickPasswords.Preferences.isCopyMsg) {
					let msg = cm.replace(new RegExp(cp, "i" ), cs) + '\n' + cu + ': ' + user + '\n' + cs + ': ' + site; 
					let result = prompts.alertCheck(null, title, msg, dontShowAgain, check);
					if (check.value==true) {
						QuickPasswords.Preferences.setBoolPref("copyMsg", false);
					}
				}
				break;

			case 'usr':
				QuickPasswords.Util.copyStringToClipboard(user);

				if (QuickPasswords.Preferences.isCopyMsg) {
					let msg = cm.replace(new RegExp(cp, "i" ), cu) + '\n' + cu + ': ' + user + '\n' + cs + ': ' + site; 
					let result = prompts.alertCheck(null, title, msg, dontShowAgain, check);
					if (check.value==true) {
						QuickPasswords.Preferences.setBoolPref("copyMsg", false);
					}
				}
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
					if (QuickPasswords.Preferences.isMultiRowHeader)
						sCopyText = cs + '\t' + cu + '\t' + cp + '\n' + sCopyText;
					sCopyDummy = cs + '\t' + cu + '\t' + cp + '\n' + sCopyDummy;

					QuickPasswords.Util.copyStringToClipboard(sCopyText);
				}
				else
					QuickPasswords.Util.copyStringToClipboard(site + '\t' + user + '\t' + pwd);
				if (QuickPasswords.Preferences.isCopyMsg) {
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

		if (!QuickPasswords.Util.PrivateBrowsing) {
			if (""!=sCopyDummy)
				QuickPasswords.Util.logToConsole("Copied Password Information to Clipboard:\n" + sCopyDummy);
			else
				QuickPasswords.Util.logToConsole("Copied Password Information to Clipboard for " + user + " at site: " + site);
		}

		if (QuickPasswords.Preferences.isAutoCloseOnCopy)
			this.closePasswordManager();
	},

	closePasswordManager: function() {
		QuickPasswords.Manager.close();
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

		if (content) {
			let theHost = content.location.host;
			if (theHost == "ietab2" 
			   || theHost == "messenger"
				 || (content.window && content.window.name == 'messagepane')
				 ) {
				theHost = this.getActiveUri(false, true);
			}
			QuickPasswords.lastContentLocation = theHost;
			QuickPasswords.Preferences.setLastLocation(theHost);
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
		// if currentFilter is passed in, lets refine it more!
		if (sHost == currentFilter) {
			sBaseDomain = QuickPasswords.lastContentLocation;
		}
		else
			sBaseDomain = sHost;
		if (!QuickPasswords.Util.PrivateBrowsing)
			QuickPasswords.Util.logDebug("Determined Domain from Host String:" + sBaseDomain);

		return sBaseDomain;
	},

	getContextMenu: function(win, sName) {
		if (!win)
			return null;
		return win.document.getElementById('context-quickPasswords-' + sName);
	} ,

	prepareContextMenu: function(win, elementName, theValue, documentId, loginInfo) {
		if (!win)
			return;
		var doc = win.document ? win.document : window.document;
		var el = doc.getElementById('context-quickPasswords-' + elementName);
		if(el) {
			el.collapsed = (theValue == '') ? true : false;
			// value to fill in
			el.quickPasswordsData = theValue; 
			// use this for correcting stored form information
			el.quickPasswords_FormId = documentId ? documentId : '';
			el.quickPasswords_loginInfo = loginInfo ? loginInfo : null;
		}

	} ,

	attemptLogin: function attemptLogin() {
		function isVisible(win, element) {
			try {
				let dis = win.getComputedStyle(element, null).getPropertyValue('display');
				if (dis == 'none') {
					return false;
				}
				// we assume body is always visible.
				if (element.tagName && element.tagName.toLowerCase() == 'body')
					return true;
				if (element.parentElement) {
					return isVisible(win, element.parentElement);
				}
				else 
					return false;
			}
			catch(ex) {
				QuickPasswords.Util.logException('Error trying to get field visibility', ex);
			}
			return false;
		}
		
		QuickPasswords.Util.logDebugOptional('formFill', 'attemptLogin() starts...');
		var tree = window.signonsTree;
		if (tree.currentIndex<0) {
			var msg = QuickPasswords_Bundle.GetStringFromName("selectOneMessage");
			alert (msg);
			return;
		}
		// get main window context menu and uncollapse the invisible login items.
		let pwd = this.getPassword(tree.currentIndex, tree);
		
		// autofill
		let usrFilled = false;
		let pwdFilled = false;
		let passwordField = '';
		let usernameField = '';
		let browserWin = QuickPasswords.getCurrentBrowserWindow ();
		let foundLoginInfo = null;
		let user = this.getUser(tree.currentIndex, tree);
		
		// auto insert ...
		if (QuickPasswords.Preferences.isAutoInsert) {
			QuickPasswords.Util.logDebugOptional('formFill', "browserWin: " + browserWin);

			if (browserWin) {
				let el;
				
			  QuickPasswords.Util.logDebugOptional('formFill', 
					'user from Manager: ' + (user ? 'yes' : 'no') +'\npassword from Manager: '  + (pwd ? 'yes' : 'no') + '\n');
				/*******  NEW: auto-login   ******/
				// automatic login
				try {
					let loginManager = Components.classes["@mozilla.org/login-manager;1"]
											 .getService(Components.interfaces.nsILoginManager);
					let theSite = this.getSite(tree.currentIndex, tree);
					let uri = this.getActiveUri(false, false); // browserWin.gBrowser.currentURI;
					
					// correct browser URI?
					if (theSite.indexOf(uri) >= 0) {
						let form = browserWin.gBrowser.contentDocument.querySelectorAll("form");
						// Find users for the given parameters
						//  count, hostname, actionURL, httpRealm, ...out logins
						let logins = loginManager.findLogins({}, theSite, '', null);

						// Find user from returned array of nsILoginInfo objects
						for (let i = 0; i < logins.length; i++) {
							if ((logins[i].username == user) && (pwd == logins[i].password)) {
								foundLoginInfo = logins[i];
								passwordField = foundLoginInfo.passwordField;
								usernameField = foundLoginInfo.usernameField;
								break;
							}
						}				
						QuickPasswords.Util.logDebugOptional('formFill',
							'Searching for password field =' + passwordField + 
							', username field =' + usernameField + '...');
						
						// try to autofill both form values
						for(let i=0; i<form.length; i++) {
							let theForm = form[i];

							try {
								let id = QuickPasswords.Util.getIdentifier(theForm);
								if (!id) id='??';
								let properties = '\nid: ' + id
															 + '\nhas ' + theForm.elements.length + ' elements';
								QuickPasswords.Util.logDebugOptional('formFill', 'Parsing Form [' + i.toString() + '] '+ properties + '...');
							}
							catch(e) {;}
								
							if (theForm.visible == false) {
								QuickPasswords.Util.logDebugOptional('formFill', 'Skipping Form (invisible form)');
								continue;
							}
														 
							let u = theForm.elements.namedItem(usernameField);
							if (u) {
								if (isVisible(browserWin, u)) {
									QuickPasswords.Util.logDebugOptional('formFill', 'found user field [' + usernameField + '] in form[' + i + ']');
									u.value = user;
									usrFilled = true;
								}
								else
									QuickPasswords.Util.logDebugOptional('formFill', 'not filling - invisible: ' + usernameField);
							}
							let p = theForm.elements.namedItem(passwordField);
							if (p) {
								if (isVisible(browserWin, p)) {
									QuickPasswords.Util.logDebugOptional('formFill', 'found password field [' + passwordField + '] in form[' + i + ']');
									p.value = pwd;
									pwdFilled = true;
								}
								else
									QuickPasswords.Util.logDebugOptional('formFill', 'not filling - invisible: ' + passwordField);
							}
							if (usrFilled && pwdFilled)
								break;
							// if(loginManager.fillForm(theForm)) 
							//	dump('Form filled!\n');
						}
					}  // end of uri matching
				}
				catch(ex) {
					QuickPasswords.Util.logException('Error trying to get auto-login: ', ex);
				}
			}
			QuickPasswords.Util.logDebugOptional('formFill', 
				'attemptLogin() end of autoInsert:\n'
				+ 'pwdFilled: ' + pwdFilled + '\n'
				+ 'usrFilled: ' + usrFilled);
				
		} // auto insert
			
		// loginManager.fillForm(form);	 
		if (!pwdFilled)
			QuickPasswords.prepareContextMenu(browserWin, 'insertPassword', pwd, passwordField, foundLoginInfo);
		if (!usrFilled)
			QuickPasswords.prepareContextMenu(browserWin, 'insertUser', user, usernameField, foundLoginInfo);
		if (!pwdFilled || !usrFilled)
			QuickPasswords.prepareContextMenu(browserWin, 'cancelLogin', 'cancel');
				
		let msgId = 'loginPrepared.manual';
		if (pwdFilled && usrFilled) {
			msgId = 'loginPrepared.insertAll';
		}
		else {
			if (usrFilled)
				msgId = 'loginPrepared.insertUser';
			else if (pwdFilled)
				msgId = 'loginPrepared.insertPassword';
		}
		
		// never show message if autofill was successful!
		// Right-click the User and Password boxes to insert the Information automatically. This operation is extra secure as it does not use the Clipboard at all.
		if (!pwdFilled && !usrFilled && QuickPasswords.Preferences.isLoginMsg) {
		
			let prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]  
															.getService(Components.interfaces.nsIPromptService);  
			let dontShowAgain = QuickPasswords.Util.getBundleString("dontShowAgain", "Do not show this message again.")						
			let check = {value: false};   // default the checkbox to true  
			let title = QuickPasswords.Util.getBundleString("copyMessageTitle", "QuickPasswords");
			
			let msg = QuickPasswords_Bundle.GetStringFromName('loginPrompt'); 
			let result = prompts.alertCheck(null, title, msg, dontShowAgain, check);
			if (check.value==true) {
				QuickPasswords.Preferences.setBoolPref("loginMsg", false);
			}
		}

		let Message = QuickPasswords_Bundle.GetStringFromName(msgId);
		QuickPasswords.Util.logDebugOptional('formFill', 'popup alert:\n' + Message);
		setTimeout(function() { 
			QuickPasswords.Util.popupAlert('QuickPasswords', Message); 
			}, 0);

		// close the window
		if (QuickPasswords.Preferences.isAutoCloseOnLogin)
			this.closePasswordManager();

	},
	
	onMenuItemCommand: function(e, cmd, clickTarget) {
		var filter;
		var menuItem = e.target;

		var parentMenu = e.explicitOriginalTarget.parentNode;

		if (!cmd)
			cmd='passwordManager';
		var browserWin = QuickPasswords.getCurrentBrowserWindow (e);

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

				switch (QuickPasswords.Util.Application) {
					case 'Postbox':     // fall through
					case 'Thunderbird': // try to use folder mail account name or email sender as filter?
						filter = this.getActiveUri(false, true);
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
						var msg = QuickPasswords_Bundle.GetStringFromName('selectExactlyOneEntry');
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
								
								// check if id has changed:
								if (QuickPasswords.Preferences.isUpdateFieldIds
								    &&
										menuItem.quickPasswords_FormId != QuickPasswords.Util.getIdentifier(clickTarget)) {
									QuickPasswords.Util.notifyUpdateId (menuItem.quickPasswords_FormId, QuickPasswords.Util.getIdentifier(clickTarget), 'user', menuItem.quickPasswordsData, menuItem.quickPasswords_loginInfo);
								}
								
								break;
							case 'pastePassword':
								// if both password and user are empty, remove the cancel item!
								if (uMenu.collapsed) {
									removeCancel = true;
									el = uMenu;
								}
								clickTarget.value = menuItem.quickPasswordsData;
								
								// check if id has changed:
								if (QuickPasswords.Preferences.isUpdateFieldIds
								    &&
										menuItem.quickPasswords_FormId != QuickPasswords.Util.getIdentifier(clickTarget)) {
									QuickPasswords.Util.notifyUpdateId (menuItem.quickPasswords_FormId, QuickPasswords.Util.getIdentifier(clickTarget), 'password', null, menuItem.quickPasswords_loginInfo);
								}
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
		function displayLoginInfo(items)
		{
			let str = '';
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
		// create a new wrapper for passing back login and modified clone
		let resultLogin = {
			oldPwd: oldPassword,
			newPwd: newPassword,
			matchedLogin: null,
			newLogin: null
		};

//		from docs for nsILoginManager:
// 		void searchLogins(
// 			out unsigned long count,
// 			in nsIPropertyBag matchData,
// 			[retval, array, size_is(count)] out nsILoginInfo logins
// 		);
		let nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
		                              Components.interfaces.nsILoginInfo,
		                              "init");
		let site = QuickPasswords.getSite(v);
		let user = QuickPasswords.getUser(v);
		let encryptedUser = ''; let encryptedPassword = '';

// 		// try this one...
// 		// see https://developer.mozilla.org/en/XPCOM_Interface_Reference/Using_nsILoginManager
// 		// also: http://pastebin.mozilla.org/1387854
// 		srvLoginManager.findLogins({}, hostname, formSubmitURL, httprealm);

		const nsPropertyBag = Components.Constructor('@mozilla.org/hash-property-bag;1', 'nsIWritablePropertyBag');
		var bag = nsPropertyBag();

		// add some properties to the bag - to filter out the correct credentials
		bag.setProperty('hostname', site);
		
    let cryptoService = Components.classes["@mozilla.org/login-manager/crypto/SDR;1"].getService(Components.interfaces.nsILoginManagerCrypto);																	
		if (cryptoService) {
			encryptedUser = cryptoService.encrypt(user);
			encryptedPassword = cryptoService.encrypt(oldPassword);
			// unfortunately, we doi not get any matches if we include these fields in the search
			// bag.setProperty('encryptedUsername', user);  // encryptedUser
			// bag.setProperty('encryptedPassword', encryptedPassword);
		}
// other Attributes:
// 		formSubmitURL, hostname, httpRealm, password, passwordField,  username,  usernameField


		//  out arguments must be objects.
		// = new Object();
		let count = new Object();
		// this will create an array of nsLoginInfo(s)
		let matches  = srvLoginManager.searchLogins(count, bag);

		// count should be 1 to be unique!!
		if (count && count.value) {
			QuickPasswords.Util.logDebugOptional('changePasswords.detail', 'Found ' + count.value + ' match(es):');
			let foundMatch = false
			for (var i=0; i<matches.length; i++) { // was matches.length, but I only do the first one! TO DO later ( matches should be unique as we match usr, pwd + hostname
				if (matches[i].username == user
				    &&
				    matches[i].password == oldPassword)
				{
					QuickPasswords.Util.logDebugOptional('changePasswords.detail', 'Changing Login: ' + displayLoginInfo(matches));
					resultLogin.matchedLogin = matches[i];
					resultLogin.newLogin = matches[i].clone();
					/*******************************/
					/*  MODIFIES THE PASSWORD!!    */
					/*******************************/
					resultLogin.newLogin.password = newPassword;
					foundMatch = true;
					// overwrite with new Password
					// after changes in code code - this refreshes the password list, 
					// so it is not save to call within a loop from the password
					// tree selection! => need to defer the call!
					// => call from outside: srvLoginManager.modifyLogin(resultLogin.matchedLogin, resultLogin.newLogin);
				}
				else {
				  let mismatchReason = '';
					if (matches[i].password != oldPassword)
						mismatchReason += '\nOld Password mismatched';
					if (matches[i].username != user)
						mismatchReason += '\nName {' + user + '} doesn\'t  match selected user';
					QuickPasswords.Util.logToConsole('Could not modify login for site: ' + site + mismatchReason);
				}
			}
			if(!foundMatch) {
				QuickPasswords.Util.logToConsole('No match found for site: ' + site + mismatchReason);
				return null;
			}
		}
		else {
		
		  return null;  // no matchy!
		}

		return resultLogin;
	} ,

	// setting up a message listener to wait for a password for bulk change;
	// as I need to call the tree traversing code from the PasswordManager context
	receiveCommand: function(event) {
		QuickPasswords.Util.logDebugOptional("changePasswords.postMessage", 'received a message!\n'
			+ 'cmd:' + event.data.cmd + '\n '
			+ 'pwd:' + event.data.pwd.replace(new RegExp('.', 'g'),'*') + '\n'
			+ 'origin: ' + event.origin );
		try {
			switch(event.data.cmd) {
				case 'selectByPassword':
					let filter = event.data.pwd;
					QuickPasswords.selectByPassword(filter);
					break;
				case 'changeBulkPasswords':
					QuickPasswords.modifyPasswords(event);
					break;
				default:
					alert('received an invalid message!\n data:'
						+ event.data + '\norigin: '
						+ event.origin );
					break;
			}
		}
		catch(ex) {
			alert(ex);
		}
	} ,

  modifyPasswords: function(event) {
		try {
			// match password
			let filter = event.data.pwd;
			var bMatch=true;
			var newPassword = event.data.newPwd;

			// change password window: this is where we get this event from
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
			
			if (!bMatch) {
				QuickPasswords.promptParentWindow.alert(QuickPasswords_Bundle.GetStringFromName("wrongPasswordMessage"));
				return;
			}

			let countQueued = 0;
			let countModifications = 0;
			// change passwords
			let logins = []; // build an array of logins to defer processing...
			let throbber = document.getElementById('quickPasswordsThrobber'); 

			// let's overwrite the global signonsTree variable while we do our changes.
			QuickPasswords.signonsTree = signonsTree;
			signonsTree = null;
			
			pwd = filter;
			if (!QuickPasswords.promptParentWindow.confirm( QuickPasswords_Bundle.GetStringFromName('changePasswordPrompt') + "\n" + sSites.substr(2))) 
				return;
				
			throbber.hidden = false;
			// let's do this asynchronous to give time for throbber to appear:
			window.setTimeout(function()
			{
				var srvLoginManager =
					Components.classes["@mozilla.org/login-manager;1"]
						.getService(Components.interfaces.nsILoginManager);
				
				QuickPasswords.Util.logDebugOptional("changePasswords", "Gathering logins...");
				for (let t = numRanges-1; t >= 0; t--){
					selection.getRangeAt(t,start,end);
					if (start.value != null) {
						for (let v = start.value; v <= end.value; v++)
						{
							iPasswordsSelected--;
							let lg = QuickPasswords.processSelectedPassword (srvLoginManager, v, filter, newPassword);
							// only push on match!
							if (lg && lg.matchedLogin) {
								logins.push(lg);
								countQueued++;
							}
							
						}
					}
					else {
						QuickPasswords.Util.logWarning("Invalid Range:\n"
							+ "range index=" + t + "\n"
							+ "start.value=" + start.value + "\n"
							+ "end.value=" + end.value, 
							"QuickPasswords.receiveCommand(" + event.data.cmd + ")");
					}
				}

				// the modificiation can take a kong time if MANY logins are selected!
				
				QuickPasswords.Util.logDebugOptional("changePasswords", "Modifying logins: Prepared " + countQueued + " logins.");
				try {
					while (logins.length) {
						let lg = logins.pop();
						//setTimeout (function() {
							srvLoginManager.modifyLogin(lg.matchedLogin, lg.newLogin);
						//}, countModifications * 30); // let's queue these up with some delay...
						countModifications++;
					}
				}
				catch (ex) {
					QuickPasswords.Util.logException('changeBulkPasswords', ex);
				}
				
				QuickPasswords.Util.logDebugOptional("changePasswords", "Modifying logins complete. Changed " + countModifications + " logins.");
				
				QuickPasswords.promptParentWindow.alert(
					QuickPasswords.Util.stringFormat(
						QuickPasswords_Bundle.GetStringFromName('successChangePasswordsMessage'), countModifications)
				);
				if (throbber) throbber.hidden = true;
				
				// restore the variable so refreshes can happen again
				signonsTree = QuickPasswords.signonsTree;

				// Clear the Tree Display
				window.self.SignonClearFilter();
				var theFilter = document.getElementById('filter').value;
				window.self.setFilter(theFilter);

				if (countQueued>0) {
					//close the change Passwords dialog!
					if (theWin)
						theWin.close();
				}
			} , 100);  //end of setTimeout


		}
		catch(ex) {
			if (!signonsTree) {
				signonsTree = QuickPasswords.signonsTree;
				QuickPasswords.signonsTree = null;
			}
		
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