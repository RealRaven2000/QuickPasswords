"use strict";

QuickPasswords.Preferences = {
	service: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
	get ExtensionBranch() {
    return 	"extensions.quickpasswords.";
	},
  
  updatePasswordWindow: function(chk) {  
    let w = QuickPasswords.getPasswordManagerWindow();
    if (w) {
      QuickPasswords.prepareAustralis(w.document, !chk.checked);
    }
  } ,

	getBoolPref: function(term) {
	  let eBranch = this.ExtensionBranch + term;
		try {
			return this.service.getBoolPref(eBranch);
		}
		catch(ex) {
			QuickPasswords.Util.logException("getBoolPref(" + eBranch + ")", ex);
			return false;
		}
	},
	
	setBoolPref: function(term, val) {
		this.service.setBoolPref(this.ExtensionBranch + term, val);
	},

	get isDebug() {
		return this.getBoolPref("debug");
	},

	isDebugOption: function(option) { // granular debugging
		if(!this.isDebug) return false;
		try {return this.getBoolPref("debug." + option);}
		catch(e) {return false;}
	},

	setLastLocation: function(URL) {
		this.service.setCharPref(this.ExtensionBranch + "lastLocation",URL)
	} ,

	getLastLocation: function() {
	  let branch = this.ExtensionBranch + "lastLocation";
		if(!this.service.prefHasUserValue(branch))
			return "";

		var ll = this.service.getCharPref(branch).toString();
		return ll;
	} ,


	setUrlEntries: function(UrlEntries) { // store array as JSON string
		var json = JSON.stringify(UrlEntries);
		QuickPasswords.Util.logDebug(json);
		this.service.setCharPref(this.ExtensionBranch + "Urls",json);
	} ,

	getUrlEntries: function() { // retrieve a list of values...
	  let branch = this.ExtensionBranch + "Urls";
		if(!this.service.prefHasUserValue(branch)) {
			return [];
		}

		var Urls;

		if((Urls = this.service.getCharPref(branch).toString())) {
			return JSON.parse(Urls);
		}
		else {
			return [];
		}
	} ,

	get isCopyMsg() {
		return this.getBoolPref("copyMsg");
	} ,

	get isLoginMsg() {
		return this.getBoolPref("loginMsg");
	} ,

	get isMultiRowHeader() {
		return this.getBoolPref("multiRowHeader");
	} ,

	get isAutoCloseOnCopy() {
		return this.getBoolPref("autoCloseManager");
	} ,

	get isAutoCloseOnLogin() {
		return this.getBoolPref("autoCloseLogin");
	} ,
	
	get isAutoInsert() {
		return this.getBoolPref("autoInsertCredentials");
	} ,

	get isContextMenu() { // obsolete
		return Boolean(this.service.getBoolPref(this.ExtensionBranch + "displayContextMenu")); // obsolete!
	} ,
	
	get isUpdateFieldIds() {
	  return this.getBoolPref("updateFieldsNotify");
	} ,
	
	get isAutoFill() {
	  return this.getBoolPref("autofilter");
	} ,
	
	contextMenuOption: function() {
		return this.service.getIntPref(this.ExtensionBranch + "displayContextMenuChoice");
	},

	waitForManager: function() {
		return this.getIntPref(this.ExtensionBranch + 'waitForManagerTime');
	},

	getIntPref: function(p) {
		return this.service.getIntPref(p);
	}

}