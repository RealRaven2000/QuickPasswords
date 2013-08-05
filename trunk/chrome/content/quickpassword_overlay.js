"use strict";

QuickPasswords.onFirefoxLoad = function(event) {
	QuickPasswords.Util.checkVersionFirstRun();
	let context = document.getElementById("contentAreaContextMenu");
	// only main window!!
	if (context) {
		context.addEventListener("popupshowing", function (e){ QuickPasswords.showFirefoxContextMenu(e); }, false);
	}
};

QuickPasswords.showFirefoxContextMenu = function(event) {
	// show or hide the menuitem based on what the context menu is on
	// say we only enable this on password fields??
	document.getElementById("context-quickPasswords").hidden = gContextMenu.onImage;
	document.getElementById("context-quickPasswords-insertUser").hidden = gContextMenu.onImage;
	document.getElementById("context-quickPasswords-insertPassword").hidden = gContextMenu.onImage;
	document.getElementById("context-quickPasswords-cancelLogin").hidden = gContextMenu.onImage;
};

window.addEventListener("load", QuickPasswords.onFirefoxLoad, false);
