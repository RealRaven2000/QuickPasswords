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

  2.9 - 05/05/2013
    Improved automatic password filling to also work with form elements that are identified by name and not by id.
		Bumped up compatibility
		nsIPrivateBrowsingService was removed in version 20 for per-window private browsing mode
		fix: made compatible with redefinition of Thunderbird's nsIMsgAccount interface #
		
	3.0 - 28/09/2013
	  Streamlined password window by using a toolbar
		Better heuristics to determine which fields are not visible to avoid filling the wrong logon fields
		Added "Correct Field Names" button
		
	3.1 - WIP
		Fixed disabling (login / repair) buttons in IETabs - IE tabs do not support modifying the context menu
	  Added translations for toggle version and donation messages.
		Now opens Security preferences when clicking the "Lock" button and no master password is set
		Moved options css file into skins folder
		Removed obsolete buttons from passwordwindow overlay
		Enabled decreasing amount of console messages making most messages dependant on debug.default (defaults to true)
		Removed some global variables to avoid namespace pollution
		
	
		
===========================================================================================

		Planned: adding option for configuring delimiter of multi line export. At the moment this is hard coded to tab.
		Planned: after successfully changing multiple passwords, hide the change dialog and refresh the passwords list (old password is still shown)
		Nice to Have: support "change password" doorhanger with an additional button "multiple sites")
		http://mxr.mozilla.org/mozilla-central/source/toolkit/components/passwordmgr/nsLoginManagerPrompter.js#1023

*/

var QuickPasswords = {
	_bundle: null,
  BundleService: Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService),
  get Bundle() {
	  if (!this._bundle) {
		  this._bundle = this.BundleService.createBundle("chrome://quickpasswords/locale/overlay.properties");
		}
		return this._bundle;
	},
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

		this.strings = document.getElementById("QuickPasswords-strings");
		QuickPasswords.Util.logDebugOptional("default", "QuickPasswords " + QuickPasswords.Util.Version
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
		QuickPasswords.Util.logDebugOptional("default", "loadPasswordManager()");
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
		let win = this.getPasswordManagerWindow(filterString);
		this.PasswordManagerWindow = win;

		let fs = filterString; // need to marshall this into the setFilter method, the filterString parameter doesn't survive
		let serverURI = this.getActiveUri(true, true);
		let prettyURI = this.getActiveUri(false, true); // without protocol, first match
		let theTime = QuickPasswords.Preferences.waitForManager();

		QuickPasswords.Util.logDebugOptional ("showPasswords", "showPasswords(" + fs + ") uri=" + serverURI + " time=" + theTime.toString());	
		let theContent = null;
		// global variable.
		if (typeof content !== 'undefined') {
			theContent = content;
		}

		if (!QuickPasswords.Preferences.isAutoFill)
		  return;
			
		let doAutoFilter = 	function () {
			try  {
				QuickPasswords.Util.logDebugOptional ("showPasswords", "START: doAutoFilter()");
				// ieTab2 support - disable the login to page as we cannot control context menu of the IE container
				if (theContent) {
					let btnLogin = 	win.document.getElementById('QuickPasswordsBtnLogin');
					if (btnLogin) {
						let host = theContent.location.host;
						btnLogin.disabled = (host == "ietab2" || host == "messenger");
					}
					let btnRepair = win.document.getElementById('QuickPasswordsBtnRepair');
					if (btnRepair) {
						let host = theContent.location.host;
						btnRepair.disabled = (host == "ietab2" || host == "messenger");
					}
				}
				if (win.self.setFilter) {
					let tree = win.signonsTree;
				  try {
						if (!tree.view.rowCount) { // throws if Thunderbird is not ready.
							QuickPasswords.Util.logDebugOptional ("showPasswords", "no rows in tree, postponing doAutoFilter for 200ms...");
							win.setTimeout(
								function() {QuickPasswords.checkCountChanged(0, tree, doAutoFilter)},
								200);
							return;
						}
						win.self.setFilter(fs);
						QuickPasswords.Util.logDebugOptional ("showPasswords", "after setFilter(" + fs + ")");
					}
					catch(ex) {
					  // this can happen if master password dialog is shown (Password Manager is invisible)
						QuickPasswords.Util.logException("auto filter - password manager not ready - postponing by 1 sec:", ex);
						win.setTimeout(
							function() {QuickPasswords.checkCountChanged(0, tree, doAutoFilter)},
							1000);
						return;
					}
					
					// now select activeURI in Manager
					if (tree.view.rowCount) {
						QuickPasswords.Util.logDebugOptional ("showPasswords.treeview", "start to enumerate " + tree.view.rowCount + " rows for selecting...");
						// find activeURI
						var sel = tree.view.selection.QueryInterface(Components.interfaces.nsITreeSelection);
						QuickPasswords.Util.logDebugOptional ("showPasswords.treeview", "got selection - " + sel);
						for (let i=0; i<tree.view.rowCount;i++)
						{
							let site = QuickPasswords.getSite(i, tree);
							let afterHostLoc = site.indexOf('//') + 2;
							afterHostLoc = (afterHostLoc==1) ? 0 : afterHostLoc; // not found.
							let prettySite = site.substr(afterHostLoc);
							if (site==serverURI || prettySite==prettyURI) {
								QuickPasswords.Util.logDebugOptional ("showPasswords.treeview", "found matching URI: " + serverURI);
								sel.clearSelection();
								QuickPasswords.Util.logDebugOptional ("showPasswords.treeview", "selecting item " + i);
								sel.select(i);
								// if scrolling happens too soon (before filtering is done) it can scroll to invisible portion of treeview contents. closured: tree, i
								win.setTimeout( function() {
									QuickPasswords.Util.logDebugOptional ("showPasswords.treeview", "ensuring row is visible " + i);
									let boxobject = tree.boxObject;
									boxobject.QueryInterface(Components.interfaces.nsITreeBoxObject);
									boxobject.ensureRowIsVisible(i); }, 100);
								if (site==serverURI) {
									QuickPasswords.Util.logDebugOptional ("showPasswords.treeview", "complete URI match: " + serverURI);
									break; // full match
								}
							}
						}
						// make sure to refilter if the count changes.
						win.setTimeout(
							function() {QuickPasswords.checkCountChanged(tree.view.rowCount, tree, doAutoFilter)},
							250);
					}
					
					
				}
			}
			catch(ex) {
				QuickPasswords.Util.logException("Error during auto filter", ex);
			}
		}
		// what if LoadSignons is called after doAutoFilter?
		win.addEventListener('load', function() {win.setTimeout(doAutoFilter, theTime)});
		if (win.LoadSignons) {
		  win.LoadSignons = function() {
			  win.LoadSignons();
				win.setTimeout(doAutoFilter, theTime);
			}
		}
	},
	
	checkCountChanged: function(oldCount, tree, theFilterFunction) {
	  if(tree) {
		  let rowCount = tree.view.rowCount;
		  if (rowCount > oldCount || rowCount == 0) {
				QuickPasswords.Util.logDebugOptional ("showPasswords", 
				  rowCount ? 
					"checkCountChanged() - count changed:" + rowCount :
					"checkCountChanged() - no rows found");
				setTimeOut(
					function() { QuickPasswords.checkCountChanged(rowCount, tree, theFilterFunction); },
					rowCount ? 250 : 1000);
			}
			else
				QuickPasswords.Util.logDebugOptional ("showPasswords", "checkCountChanged() unchanged:" + tree.view.rowCount);
		}
	} ,

	getManagerColumn: function (idx, colName, tree) {
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
		return theSite ? theSite.split(" ", 1).toString() : '';
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

						QuickPasswords.Util.logDebugOptional("default", "Selected Tab mode: " + theMode);
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
						QuickPasswords.Util.logDebugOptional("default", "current URI of tab is: " + currentURI);
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
					alert(QuickPasswords.Bundle.GetStringFromName("enterOriginalPasswordMessage"));
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
		let lstPasswords = document.getElementById('signonsTree'); // password list
		let treeView = self.signonsTreeView;
		let tree = self.signonsTree;

		if (tree.currentIndex<0) {
			var msg = QuickPasswords.Bundle.GetStringFromName("selectOneMessage");
			alert (msg);
		}

		let site = this.getSite(tree.currentIndex);
		let user = this.getUser(tree.currentIndex);
		let pwd = this.getPassword(tree.currentIndex);
		let cm,cu,cs,cp,ct;
		let sCopyDummy="";

		try {
			// in SeaMonkey, this fails for some reason
			cm = QuickPasswords.Bundle.GetStringFromName("copyMessage");
			cu = QuickPasswords.Bundle.GetStringFromName("copyMessageUser");
			cs = QuickPasswords.Bundle.GetStringFromName("copyMessageDomain");
			cp = QuickPasswords.Bundle.GetStringFromName("copyMessagePassword");
			ct = QuickPasswords.Bundle.GetStringFromName("copyMessageTitle"); // currently unused
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
		
		// prompts that can be hidden 
		let prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]  
														.getService(Components.interfaces.nsIPromptService);  
		let dontShowAgain = QuickPasswords.Util.getBundleString("dontShowAgain", "Do not show this message again.")						
		let check = {value: false};   // default the checkbox to true  
		let title = QuickPasswords.Util.getBundleString("copyMessageTitle", "QuickPasswords");
		let alertShown = false;
		let msg='';

		switch (what) {
			case 'pwd':
				QuickPasswords.Util.copyStringToClipboard(pwd);
				msg = cm + '\n' + cu + ': ' + user + '\n' + cs + ': ' + site;
				if (QuickPasswords.Preferences.isCopyMsg) {
					alertShown = true;
					let result = prompts.alertCheck(null, title, msg, dontShowAgain, check);
					if (check.value==true) {
						QuickPasswords.Preferences.setBoolPref("copyMsg", false);
					}
				}
				break;

			case 'url':
				QuickPasswords.Util.copyStringToClipboard(site);
				msg = cm.replace(new RegExp(cp, "i" ), cs) + '\n' + cu + ': ' + user + '\n' + cs + ': ' + site; 

				if (QuickPasswords.Preferences.isCopyMsg) {
					alertShown = true;
					let result = prompts.alertCheck(null, title, msg, dontShowAgain, check);
					if (check.value==true) {
						QuickPasswords.Preferences.setBoolPref("copyMsg", false);
					}
				}
				break;

			case 'usr':
				QuickPasswords.Util.copyStringToClipboard(user);
				msg = cm.replace(new RegExp(cp, "i" ), cu) + '\n' + cu + ': ' + user + '\n' + cs + ': ' + site; 

				if (QuickPasswords.Preferences.isCopyMsg) {
					alertShown = true;
					let result = prompts.alertCheck(null, title, msg, dontShowAgain, check);
					if (check.value==true) {
						QuickPasswords.Preferences.setBoolPref("copyMsg", false);
					}
				}
				break;

			case 'row':
				let iPasswordsSelected = 0;
				let start = new Object();
				let end = new Object();
				let numRanges = tree.view.selection.getRangeCount();
				let sLine = '';
				let sCopyText='';

				for (let t = 0; t < numRanges; t++){
					tree.view.selection.getRangeAt(t,start,end);
					for (let v = start.value; v <= end.value; v++){
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
					cm = QuickPasswords.Bundle.GetStringFromName("selectOneMessage");
					alert (cm);
					return;
				}

				if (iPasswordsSelected > 1) {
					if (QuickPasswords.Preferences.isMultiRowHeader)
						sCopyText = cs + '\t' + cu + '\t' + cp + '\n' + sCopyText;
					sCopyDummy = cs + '\t' + cu + '\t' + cp + '\n' + sCopyDummy;

					QuickPasswords.Util.copyStringToClipboard(sCopyText);
				}
				else {
					QuickPasswords.Util.copyStringToClipboard(site + '\t' + user + '\t' + pwd);
				}
				try {
					if (1==iPasswordsSelected)
						cm = QuickPasswords.Bundle.GetStringFromName("copyRecordMessage");
					else
						cm = QuickPasswords.Bundle.GetStringFromName("copyRecordsMessage");
				}
				catch(e) {
					QuickPasswords.Util.logToConsole("Error getting String Bundle GetStringFromName\n" + e);
					cm="Data copied to clipboard - see error console for detail";
				}
				if (QuickPasswords.Preferences.isCopyMsg) {
					alertShown = true;
					alert (cm);
				}
				msg = cm;
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
		// show sliding notification if no alert was shown.
		if (!alertShown && (msg != '')) {
		  setTimeout(function() { QuickPasswords.Util.popupAlert('QuickPasswords', msg); });
		}

		
	},

	closePasswordManager: function() {
		QuickPasswords.Manager.close();
		if (null==this.PasswordManagerWindow)
			this.PasswordManagerWindow = self;
		this.PasswordManagerWindow.close();
		this.PasswordManagerWindow=null;
	} ,

	// retrieves current URI from clicked context
	// in a browser window we will get this from the global content let
	// in a tabmail window, lets use the getActiveUri helper function
	getURIcontext: function(currentFilter) {
		let sBaseDomain;

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

		let sHost = QuickPasswords.lastContentLocation ;


		let pos = sHost.indexOf('.');
		let s2 = sHost.substring(pos+1, sHost.length);
		let pos2 = s2.indexOf('.');
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
			QuickPasswords.Util.logDebugOptional("default", "Determined Domain from Host String:" + sBaseDomain);

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
		let doc = win.document ? win.document : window.document;
		let el = doc.getElementById('context-quickPasswords-' + elementName);
		if(el) {
			el.collapsed = (theValue == '') ? true : false;
			// value to fill in
			el.quickPasswordsData = theValue; 
			// use this for correcting stored form information
			el.quickPasswords_FormId = documentId ? documentId : '';
			el.quickPasswords_loginInfo = loginInfo ? loginInfo : null;
		}

	} ,
	
	
	isVisible: function(win, element) {
		try {
			let computedStyle = win.getComputedStyle(element, null);
			let dis = computedStyle.getPropertyValue('display');
			if (dis && dis == 'none') {
				return false;
			}
			let left = computedStyle.getPropertyValue('left');
			// we pick an arbitrary value of 200px for elements / parents in case there were some layout adjustments
			if (left && parseInt(left,10) < -200) {  
				return false;
			}
			let top = computedStyle.getPropertyValue('left');
			if (top && parseInt(top,10) < -200) {  
				return false;
			}
			QuickPasswords.Util.logDebugOptional('formFill', 'Element ' + element + ' display=' + dis + '  left=' + left + '  top=' + top);
			
			// we assume body is always visible.
			if (element.tagName && element.tagName.toLowerCase() == 'body')
				return true;
			if (element.parentElement) {
				return this.isVisible(win, element.parentElement);
			}
			else 
				return false;
		}
		catch(ex) {
			QuickPasswords.Util.logException('Error trying to get field visibility', ex);
		}
		return false;
	} ,
	
	repairLoginTitle: '',
	
	repairLoginFields: function repairLoginFields(btn) {
	  if (btn) {
			this.repairLoginTitle = btn.getAttribute('label');
		}
		this.attemptLogin(false);
	} ,

	attemptLogin: function attemptLogin(fillForm) {
		let isRepairMode = !fillForm;
		let utils = QuickPasswords.Util;
		utils.logDebugOptional('formFill', 'attemptLogin() starts...');
		let tree = window.signonsTree;
		if (tree.currentIndex<0) {
			let msg = QuickPasswords.Bundle.GetStringFromName("selectOneMessage");
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
			utils.logDebugOptional('formFill', "browserWin: " + browserWin);

			if (browserWin) {
				let el;
				
			  utils.logDebugOptional('formFill', 
					'user from Manager: ' + (user ? 'yes' : 'no') +'\npassword from Manager: '  + (pwd ? 'yes' : 'no') + '\n');
				/*******  NEW: auto-login   ******/
				// automatic login
				try {
					let loginManager = Components.classes["@mozilla.org/login-manager;1"]
											 .getService(Components.interfaces.nsILoginManager);
					let theSite = this.getSite(tree.currentIndex, tree);
					let uri = this.getActiveUri(false, false); // browserWin.gBrowser.currentURI;
					
					// retrieve field names of user name and password INPUT elements (via matching usr+pwd)
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
					
					// matching browser URI?
					if (theSite.indexOf(uri) >= 0) {
						utils.logDebugOptional('formFill',
							'Searching forms for password field =' + passwordField + 
							', username field =' + usernameField + '...');
						let form = browserWin.gBrowser.contentDocument.querySelectorAll("form");
						// Find users for the given parameters
						//  count, hostname, actionURL, httpRealm, ...out logins
						
						// try to autofill both form values
						if (fillForm) {
							for(let i=0; i<form.length; i++) {
							
								let theForm = form[i];

								try {
									let id = utils.getIdentifier(theForm);
									if (!id) id='??';
									let properties = '\nid: ' + id
																 + '\nhas ' + theForm.elements.length + ' elements';
									utils.logDebugOptional('formFill', 'Parsing Form [' + i.toString() + '] '+ properties + '...');
								}
								catch(e) {;}
									
								if (theForm.visible == false) {
									utils.logDebugOptional('formFill', 'Skipping Form (invisible form)');
									continue;
								}
															 
								let u = theForm.elements.namedItem(usernameField);
								if (u) {
									if (this.isVisible(browserWin, u)) {
										utils.logDebugOptional('formFill', 'found user field [' + usernameField + '] in form[' + i + ']');
										u.value = user;
										usrFilled = true;
									}
									else
										utils.logDebugOptional('formFill', 'not filling - invisible: ' + usernameField);
								}
								let p = theForm.elements.namedItem(passwordField);
								if (p) {
									if (this.isVisible(browserWin, p)) {
										utils.logDebugOptional('formFill', 'found password field [' + passwordField + '] in form[' + i + ']');
										p.value = pwd;
										pwdFilled = true;
									}
									else
										utils.logDebugOptional('formFill', 'not filling - invisible: ' + passwordField);
								}
								if (usrFilled && pwdFilled)
									break;
								// if(loginManager.fillForm(theForm)) 
								//	dump('Form filled!\n');
							} // for loop.
						}
					}  // end of uri matching
					else {
					  // no match, no correction!!
					  foundLoginInfo = null;
					}
				}
				catch(ex) {
					utils.logException('Error trying to get auto-login: ', ex);
					// no match, no correction!!
					foundLoginInfo = null;
				}
			}
			utils.logDebugOptional('formFill', 
				'attemptLogin() end of autoInsert:\n'
				+ 'pwdFilled: ' + pwdFilled + '\n'
				+ 'usrFilled: ' + usrFilled);
				
		} // auto insert
			
		// Prepare context menu with all necessary information, including existing and target field name
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
			let dontShowAgain = utils.getBundleString("dontShowAgain", "Do not show this message again.")						
			let check = {value: false};   // default the checkbox to true  
			let title = utils.getBundleString("copyMessageTitle", "QuickPasswords");
			
			let msg = QuickPasswords.Bundle.GetStringFromName('loginPrompt'); 
			let result = prompts.alertCheck(null, title, msg, dontShowAgain, check);
			if (check.value==true) {
				QuickPasswords.Preferences.setBoolPref("loginMsg", false);
			}
		}
		
		// close the window
		if (QuickPasswords.Preferences.isAutoCloseOnLogin || isRepairMode)
			this.closePasswordManager();

		let Message = QuickPasswords.Bundle.GetStringFromName(msgId);
		let notifyBox = utils.NotificationBox;
		// just display a transient box in most cases. If there is no notifyBox available (SeaMonkey) we also use this function (but it disaplys an alert)
		if (!isRepairMode || (isRepairMode && !notifyBox)) {
			utils.logDebugOptional('formFill', 'popup alert:\n' + Message);
			setTimeout(function() { utils.popupAlert('QuickPasswords', Message); }, 0);
		}

		// In repair Mode, show a permanent sliding notification
		if (isRepairMode && notifyBox){  
		  let notificationId = "quickpasswords-changeprompt.repairFields"; 
			let item = notifyBox.getNotificationWithValue(notificationId)
			if(item) {
				notifyBox.removeNotification(item);
			}
			if (this.repairLoginTitle) {
			  Message = this.repairLoginTitle + ": " + Message;
			}
			let btnCancel = utils.getBundleString("loginPrepared.updateIdPrompt.Cancel", "Cancel");
			let nbox_buttons = [
				{
					label: btnCancel,
					accessKey: btnCancel.substr(0,1), 
					callback: function() { QuickPasswords.onMenuItemCommand(null,'cancelLogin'); },
					popup: null
				}				
			];			
			notifyBox.appendNotification( Message, 
						notificationId, 
						"chrome://quickpasswords/skin/repair24.png" , 
						notifyBox.PRIORITY_INFO_HIGH, 
						nbox_buttons);
		}
	},
	
	onMenuItemCommand: function(e, cmd, clickTarget) {
		let filter;
		let menuItem = e ? e.target : null;

		let parentMenu = e ? e.explicitOriginalTarget.parentNode : null;

		if (!cmd)
			cmd='passwordManager';
		let browserWin = QuickPasswords.getCurrentBrowserWindow (e);

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
				let pMenu = QuickPasswords.getContextMenu(browserWin, 'insertPassword');
				let uMenu = QuickPasswords.getContextMenu(browserWin, 'insertUser');
				let cMenu = QuickPasswords.getContextMenu(browserWin, 'cancelLogin');
				let managerWin = QuickPasswords.PasswordManagerWindow;
				if (managerWin && (!managerWin.signonsTree || managerWin.closed)) { //stale info?
					managerWin=null;
					QuickPasswords.PasswordManagerWindow=null; // should do this on pwd manager close!!

				}

				// get password / username from selected row in Password Manager
				// this has precedence over a previously selected login that might
				// still be stored in the context menu item...
				if (managerWin) {
					let tree = managerWin.signonsTree;
					if (tree.currentIndex<0) {
						var msg = QuickPasswords.Bundle.GetStringFromName('selectExactlyOneEntry');
						alert (msg);
						return;
					}
					var removeCancel = false;
					var el = null;
					// remove repair instruction before pasting
					if (cmd.indexOf('paste') == 0) {
						let notifyBox = QuickPasswords.Util.NotificationBox;
						if (notifyBox) {
						  let notificationKey = "quickpasswords-changeprompt.repairFields";
							let item = notifyBox.getNotificationWithValue(notificationKey)
							if(item) { notifyBox.removeNotification(item); }
						}
					}
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
				break;
		} // end switch.

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
				QuickPasswords.promptParentWindow.alert(QuickPasswords.Bundle.GetStringFromName("wrongPasswordMessage"));
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
			if (!QuickPasswords.promptParentWindow.confirm( QuickPasswords.Bundle.GetStringFromName('changePasswordPrompt') + "\n" + sSites.substr(2))) 
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
						QuickPasswords.Bundle.GetStringFromName('successChangePasswordsMessage'), countModifications)
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
			alert(QuickPasswords.Bundle.GetStringFromName('enterNewPasswordsPrompt'));
			return false;
		}
		if (document.getElementById('txtNewPassword').value!=document.getElementById('txtNewPassword2').value) {
			alert(QuickPasswords.Bundle.GetStringFromName('newPasswordsDontMatch'));
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