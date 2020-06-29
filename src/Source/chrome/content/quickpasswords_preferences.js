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

	isDebug: function () {
		return this.getBoolPref("debug");
	},

	isDebugOption: function(option) { // granular debugging
		if(!this.isDebug()) return false;
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

	isCopyMsg: function() {
		return this.getBoolPref("copyMsg");
	} ,

	isLoginMsg: function() {
		return this.getBoolPref("loginMsg");
	} ,

	isMultiRowHeader: function() {
		return this.getBoolPref("multiRowHeader");
	} ,

	isAutoClose: function() {
		return this.getBoolPref("autoCloseManager");
	} ,

	isContextMenu: function() { // obsolete
		return Boolean(this.service.getBoolPref("extensions.quickpasswords.displayContextMenu")); // obsolete!
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