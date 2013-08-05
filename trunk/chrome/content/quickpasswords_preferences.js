"use strict";

QuickPasswords.Preferences = {
	service: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),

	getBoolPref: function(term) {
		try {
			return this.service.getBoolPref("extensions.quickpasswords." + term);
		}
		catch(ex) {
			QuickPasswords.Util.logException("getBoolPref(extensions.quickpasswords." + term + ")", ex);
			return false;
		}
	},
	
	setBoolPref: function(term, val) {
		this.service.setBoolPref("extensions.quickpasswords." + term, val);
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
		this.service.setCharPref("extensions.quickPasswords.lastLocation",URL)
	} ,

	getLastLocation: function() {
		if(!this.service.prefHasUserValue("extensions.quickPasswords.lastLocation"))
			return "";

		var ll = this.service.getCharPref("extensions.quickPasswords.lastLocation").toString();
		return ll;
	} ,


	setUrlEntries: function(UrlEntries) { // store array as JSON string
		var json = JSON.stringify(UrlEntries)

		QuickPasswords.Util.logDebug(json)

		this.service.setCharPref("extensions.quickPasswords.Urls",json)
	} ,

	getUrlEntries: function() { // retrieve a list of values...
		if(!this.service.prefHasUserValue("extensions.quickPasswords.Urls")) {
			return [];
		}

		var Urls;

		if((Urls = this.service.getCharPref("extensions.quickPasswords.Urls").toString())) {
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
		return Boolean(this.service.getBoolPref("extensions.quickpasswords.displayContextMenu")); // obsolete!
	} ,
	
	get isUpdateFieldIds() {
	  return this.getBoolPref("updateFieldsNotify");
	} ,

	contextMenuOption: function() {
		return this.service.getIntPref("extensions.quickpasswords.displayContextMenuChoice");
	},

	waitForManager: function() {
		return this.getIntPref('extensions.quickpasswords.waitForManagerTime');
	},

	getIntPref: function(p) {
		return this.service.getIntPref(p);
	}

}