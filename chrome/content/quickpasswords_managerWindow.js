

// Code is currently unused.
// QuickPasswords.Manager replaces LinkAlert from Linkalerts overlay
if (!QuickPasswords.Manager)
	QuickPasswords.Manager = {
	LAST_TARGET: null,
	MOVE_TARGET: null,

	onMove: function onMove(e){
		var tooltip = true; // replace that with a pref later

		var moveTarget = e.target;
		QuickPasswords.Util.logDebugOptional("default", "QuickPasswords.Manager.onMove(" + e.toString() + ")");
// 		while(){
// 			moveTarget = moveTarget.parentNode;
// 		}
		QuickPasswords.Manager.MOVE_TARGET = moveTarget;

		if(tooltip){
			box = new QuickPasswordsTooltip(e);
		}

		if(moveTarget.nodeName.toLowerCase() == "tree" && moveTarget.id == "signonsTree")
		{
			var iconSrc = QuickPasswords.Manager.getIcons(moveTarget);

			var anyIcons = false;
			for(var i = 0; i < iconSrc.length; i++){
				if(iconSrc[i] != "") {
					anyIcons = true;
					break;
				}
			}

			if(anyIcons){
				box.show(iconSrc);
				QuickPasswords.Manager.LAST_TARGET = e.target;
			}
			else {
				box.hide();
				QuickPasswords.Manager.LAST_TARGET = null;
			}
		}
		else {
			box.hide();
		}
	} ,
	
	logoutMaster: function logoutMaster() {
		QuickPasswords.Util.logDebugOptional("Manager",  "logout Master Password");
		Components.classes["@mozilla.org/security/pk11tokendb;1"]
			.getService(Components.interfaces.nsIPK11TokenDB)
			.findTokenByName("").logoutAndDropAuthenticatedResources();
      
    QuickPasswords.initToolbarLock(); // visual clue
	} ,

	// since the passwords sub Tab has no Id we cannot use any built in helper from Thunderbird
  openPasswordsTab: function openPasswordsTab(win, checkbox) {
    // find the passwords tab by looking for the tabpane that contains the checkbox
		if (checkbox) {
		  let p=checkbox.parentNode;
			while (p && (p.tagName != 'tabpanel')) {
			  p = p.parentNode;
			}
			if (p) {
			  win.setTimeout(
				  function() {
						// find tab index and then activate the panel
						let tabPanels = p.parentNode;
						for (let i=0; i<tabPanels.tabbox.tabs.childNodes.length; i++) {
							if (tabPanels.children[i] == p) {
								tabPanels.tabbox.tabs.childNodes[i].click();
								break;
							}
						}
					});
			}
		}
  }	,
	
	protectPasswordManager: function protectPasswordManager(checkbox) {
	  if (!this.isMasterPasswordActive) {
			let txtAlert;
			try {
				txtAlert = QuickPasswords.Bundle.GetStringFromName("alertSetupMasterPassword");
			}
			catch(ex) {
				txtAlert = 'To protect your passwords, set up a master password first.';
			}
			alert(txtAlert);
		  let prefURI, dialog;
			switch(QuickPasswords.Util.Application) {
				case 'Firefox': 
				  prefURI = "chrome://browser/content/preferences/preferences.xul";
				  dialog = window.openDialog(prefURI, 
														 "Preferences",
														 "chrome,dependent,titlebar,toolbar,alwaysRaised,centerscreen,dialog=no", 
														 "paneSecurity");
				  break;
				case 'SeaMonkey':
			    let wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Components.interfaces.nsIWindowMediator);
					let win = wm.getMostRecentWindow("navigator:browser") ||
					     wm.getMostRecentWindow("mail:3pane") ||
							 wm.getMostRecentWindow("mail:messageWindow") ||
							 wm.getMostRecentWindow("msgcompose");
					if (typeof win.goPreferences == "function") {
					  win.goPreferences('masterpass_pane');
					}
					break;
				case 'Postbox':
				  prefURI = "chrome://messenger/content/preferences/preferences.xul";
				  dialog = window.openDialog(prefURI, 
														 "Preferences",
														 "chrome,dependent,titlebar,toolbar,alwaysRaised,centerscreen,dialog=no", 
														 "panePrivacy"
														 );
					break;
				case 'Thunderbird': 
				  prefURI = "chrome://messenger/content/preferences/preferences.xul";
				  dialog = window.openDialog(prefURI, 
														 "Preferences",
														 "chrome,dependent,titlebar,toolbar,alwaysRaised,centerscreen,dialog=no", 
														 "paneSecurity", 
														 "passwordsTab"  // Thunderbird has no name for this tab yet, so this will not work until this bug is fixed.
														 );
				  break;
			}
			if (QuickPasswords.Util.Application!='SeaMonkey') {
			  dialog.window.addEventListener('load',
					function() {
						dialog.window.setTimeout(
							function() {
								QuickPasswords.Util.logDebugOptional("Manager", "useMasterPassword...");
								let doc = dialog.document;
								let chkMasterPassword = doc.getElementById('useMasterPassword');
								let container = chkMasterPassword.parentNode;
								if (!container || container.tagName != 'hbox') 
								  container = chkMasterPassword;
								
								QuickPasswords.Util.logDebugOptional("Manager", "useMasterPassword: " + chkMasterPassword);
								chkMasterPassword.style.color = "#FFFFFF";
								container.style.backgroundColor = "#CC0000";
								let bgStyle = (QuickPasswords.Util.Application=='Postbox')  ?
								              "-moz-linear-gradient(top, rgba(255,191,191,1) 0%,rgba(214,79,79,1) 30%,rgba(144,11,2,1) 51%,rgba(110,7,0,1) 100%)" :
															"linear-gradient(to bottom, rgba(255,191,191,1) 0%,rgba(214,79,79,1) 30%,rgba(144,11,2,1) 51%,rgba(110,7,0,1) 100%)";
								container.style.backgroundImage = bgStyle;
								container.style.borderColor = "#FFFFFF";
								// some special code for selecting the correct sub tab:
								if (QuickPasswords.Util.Application == 'Thunderbird')
									QuickPasswords.Manager.openPasswordsTab(dialog.window, chkMasterPassword);
								dialog.window.focus();
							},
							100 );
					}, true );
				// update the style of protection button accordingly:
				dialog.window.addEventListener('close', QuickPasswords.Manager.initProtectionButton, false);
			}
		}
		else {
			let toggleProtect = checkbox.checked;
			let pref = document.getElementById('quickpasswords_protectOnClose');
			QuickPasswords.Preferences.service.setBoolPref(pref.name, toggleProtect);
		}
	} ,
	
	keyListener: function keyListener(evt) {
	  if (event.keyCode && event.keyCode  == 13) {
			return;
		}
  },
	
	initProtectionButton: function initProtectionButton() {
		// disable the security checkbox (Master Password) if no master password is USED:
    let isProtected = QuickPasswords.Manager.isMasterPasswordActive;
    QuickPasswords.Util.logDebugOptional("Manager", "initProtectionButton() - protection = " + isProtected );
		let cbProtect = document.getElementById('quickPasswordsLockAfterClosing');
		if (cbProtect) {
			if (!isProtected) {
				// no masterpassword is set at the moment - need to change behavior
        QuickPasswords.Util.classListToggle(cbProtect, 'disabled', true);
			}
			else {
        QuickPasswords.Util.classListToggle(cbProtect, 'disabled', false);
        // now make sure the checked state is set correctly
        // let isSessionProtected = false;
        let chk = document.getElementById('quickpasswords_protectOnClose');
			}
		}
		return cbProtect;
	} ,
  
  isElementInViewport: function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    QuickPasswords.Util.logDebug('rect: ' + rect.top + ', ' + rect.left + ', ' + rect.bottom + ', ' + rect.right);
    return (rect.top < rect.bottom && rect.left < rect.right);
  } ,
  
	load: function load() {
		QuickPasswords.Util.logDebugOptional("Manager", "QuickPasswords.Manager.init()");
		let signonsTree = document.getElementById("signonsTree");
		if (signonsTree) {
			QuickPasswords.Util.logDebugOptional("Manager", "Adding event listeners to signonsTree");
			// double click
			signonsTree.addEventListener("dblclick", 
				function(evt) { 
					QuickPasswords.Util.logDebugOptional("default", "doubleclick event:\n" + evt.toString());
					// do login...
					QuickPasswords.attemptLogin(true);
					evt.preventDefault();
					evt.stopPropagation();
					}, false);	
			// Enter key
			signonsTree.addEventListener('keypress', 
				function(evt) {
					if (evt.keyCode && evt.keyCode  == 13) {
						QuickPasswords.Util.logDebugOptional("default", "Enter Key was pressed:\n" + evt.toString());
						// do login...
						QuickPasswords.attemptLogin(true);
						evt.preventDefault();
						evt.stopPropagation();
					}					
				}, false);
      if (QuickPasswords.Util.checkIsMasterLocked) {
        let lock = document.getElementById('quickPasswordsLockAfterClosing');
        lock.checked = true;
        lock.disabled = true; // you can't unlock password from here!
      }
		}
		// move the wizard Button before the "Search" label
		// where it logically belongs
		if (QuickPasswords.Preferences.getBoolPref("wizardAbove")) {
			let filter = document.getElementById("filter");
			if (filter) {
				let wizardBtn = document.getElementById("quickPasswordsUriFilterRefiner");
				let par = filter.parentNode;
				if (wizardBtn)
					par.insertBefore(wizardBtn, par.firstChild); // before the label
			}
		}
		
		let cbProtect = this.initProtectionButton();
		
		// get container for close button
		let actions = document.documentElement.getElementsByClassName('actionButtons');
		let nodes = actions[0].getElementsByTagName('button');
    let isCloseButton = false;
		for (let i=0; i<nodes.length; i++) {
			let button = nodes[i];
			if (button.getAttribute('oncommand') == 'close();'
			    ||
					button.getAttribute('icon') == 'close')
			{
        if (button.collapsed
          ||
            !this.isElementInViewport(button)) break;  // in case Close is hidden
        
        QuickPasswords.Util.logDebug('Close button found - move lock button before it...');
        isCloseButton = true;
				// make sure we check protection code when close button is used!
				// (this doesn't trigger window's close event)
				button.addEventListener("click", 
						function(evt) { QuickPasswords.Manager.close();}, 
						false);
				// .. and move the protection icon before the close button
				let pr = button.parentNode;
				pr.insertBefore(cbProtect, button); // before the label
				break; // done
			}  
		}
    // Mac case - no close button - insert before the [Show Passwords] button instead:
    if (!isCloseButton) {
      QuickPasswords.Util.logDebug('No close button - move lock button before show pwd');
      let button = document.getElementById('togglePasswords');
      if (button) {
        let pr = button.parentNode;
        pr.insertBefore(cbProtect, button); // before the label
      }
      else
        QuickPasswords.Util.logDebug('No togglePasswords button found!');      
    }
    
		QuickPasswords.prepareAustralis(window.document, QuickPasswords.Preferences.getBoolPref('skin.australis'));
    if (QuickPasswords.Util.Application=='Postbox') {
      let repairBtn = document.getElementById('QuickPasswordsBtnRepair');
      if (repairBtn) repairBtn.collapsed = true;
    }
	} ,
	
	get isMasterPasswordActive() {
    // code from browser/components/preferences/security.js - _masterPasswordSet()
		let Ci = Components.interfaces;
    var secmodDB = Components.classes["@mozilla.org/security/pkcs11moduledb;1"].
                   getService(Ci.nsIPKCS11ModuleDB);
    var slot = secmodDB.findSlotByName("");
    if (slot) {
      var status = slot.status;
      var hasMP = status != Ci.nsIPKCS11Slot.SLOT_UNINITIALIZED &&
                  status != Ci.nsIPKCS11Slot.SLOT_READY;
      return hasMP;
    } else {
      return false;
    }
 } ,
		
	close: function close() {
		if (!this.isMasterPasswordActive)
			return;
		let cbProtect = document.getElementById('quickPasswordsLockAfterClosing');
		if (cbProtect) {
			if (cbProtect.checked) {
				this.logoutMaster();
      }  
		}
	} 
	


}

