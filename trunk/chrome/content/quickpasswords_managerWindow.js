

// Code is currently unused.
// QuickPasswords.Manager replaces LinkAlert from Linkalerts overlay
if (!QuickPasswords.Manager)
	QuickPasswords.Manager = {
	LAST_TARGET: null,
	MOVE_TARGET: null,

	onMove: function(e){
		var tooltip = true; // replace that with a pref later

		var moveTarget = e.target;
		QuickPasswords.Util.logDebug("QuickPasswords.Manager.onMove(" + e.toString() + ")");
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
	
	logoutMaster: function() {
		QuickPasswords.Util.logDebugOptional("Manager",  "logout Master Password");
		Components.classes["@mozilla.org/security/pk11tokendb;1"]
			.getService(Components.interfaces.nsIPK11TokenDB)
			.findTokenByName("").logoutAndDropAuthenticatedResources();
	} ,
	
	protectPasswordManager: function(checkbox) {
		let toggleProtect = checkbox.checked;
		let pref = document.getElementById('quickpasswords_protectOnClose');
		QuickPasswords.Preferences.service.setBoolPref(pref.name, toggleProtect);
	} ,
	
	keyListener: function(evt) {
	  if (event.keyCode && event.keyCode  == 13) {
			return;
		}
  },
	
	load: function () {
		QuickPasswords.Util.logDebugOptional("Manager", "QuickPasswords.Manager.init()");
		let signonsTree = document.getElementById("signonsTree");
		if (signonsTree) {
			QuickPasswords.Util.logDebugOptional("Manager", "Adding event listeners to signonsTree");
			// double click
			signonsTree.addEventListener("dblclick", 
				function(evt) { 
					QuickPasswords.Util.logDebug("doubleclick event:\n" + evt.toString());
					// do login...
					QuickPasswords.attemptLogin(true);
					evt.preventDefault();
					evt.stopPropagation();
					}, false);	
			// Enter key
			signonsTree.addEventListener('keypress', 
				function(evt) {
					if (evt.keyCode && evt.keyCode  == 13) {
						QuickPasswords.Util.logDebug("Enter Key was pressed:\n" + evt.toString());
						// do login...
						QuickPasswords.attemptLogin(true);
						evt.preventDefault();
						evt.stopPropagation();
					}					
				}, false);
		}
		// move the wizard Button before the "Search" label
		// where it logically belongs
		if (QuickPasswords.Preferences.getBoolPref("wizardAbove"))
		{
			let filter = document.getElementById("filter");
			if (filter) {
				let wizardBtn = document.getElementById("quickPasswordsUriFilterRefiner");
				let par = filter.parentNode;
				if (wizardBtn)
					par.insertBefore(wizardBtn, par.firstChild); // before the label
			}
		}
		
		// disable the security checkbox (Master Password) if no master password is used:
		let cbProtect = document.getElementById('quickPasswordsLockAfterClosing');
		if (!this.isMasterPasswordActive) {
			if (cbProtect)
				cbProtect.disabled = true;
		}
		// if the password was not given we should probably also disable the lock!
		
		
		// get container for close button
		let actions = document.documentElement.getElementsByClassName('actionButtons');
		let nodes = actions[0].getElementsByTagName('button');
		for (let i=0; i<nodes.length; i++) {
			let button = nodes[i];
			if (button.getAttribute('oncommand') == 'close();'
			    ||
					button.getAttribute('icon') == 'close')
			{
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
		
	close: function() {
		if (!this.isMasterPasswordActive)
			return;
		let cbProtect = document.getElementById('quickPasswordsLockAfterClosing');
		if (cbProtect) {
			if (cbProtect.checked)
				this.logoutMaster();
		}
	} 
	


}

