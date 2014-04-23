"use strict";

QuickPasswords.ToolbarListener = {
  onWidgetAfterDOMChange: function (node, nextNode, container)  {
    if (node && node.id === 'QuickPasswords-toolbar-button') {
      node.classList.toggle('australis', QuickPasswords.Preferences.getBoolPref('skin.australis'));
      QuickPasswords.initToolbarLock(null, node);
    }
  }
}

QuickPasswords.Observer = function(subject, topic, data) {
  QuickPasswords.prepareAustralis(null, QuickPasswords.Preferences.getBoolPref('skin.australis'));
  Services.obs.removeObserver(QuickPasswords.Observer, "browser-delayed-startup-finished");
  
  if (QuickPasswords.Util.Application == 'Firefox') {
    const { CustomizableUI } = Components.utils.import("resource:///modules/CustomizableUI.jsm", {});
    CustomizableUI.addListener(QuickPasswords.ToolbarListener);
  }
}
Services.obs.addObserver(QuickPasswords.Observer, "browser-delayed-startup-finished", false);

window.addEventListener("load", QuickPasswords.onLoad, false);

/*** Thunderbird: to hide context menu item - doesn't work yet ... */
//if (document.getElementById("tabmail")) { 
//	document.getElementById("tabmail").tabContainer.addEventListener("TabOpen", QuickPasswords.onLoad, false); 
//}
