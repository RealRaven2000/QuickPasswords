

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
			}else{
				box.hide();
				QuickPasswords.Manager.LAST_TARGET = null;
			}
		}else{
			box.hide();
		}
	} ,

	init: function () {
		QuickPasswords.Util.logDebug("QuickPasswords.Manager.init()");
		window.addEventListener("mousemove", QuickPasswords.Manager.onMove, false);
    } ,

    destroy: function () {

    }



}

