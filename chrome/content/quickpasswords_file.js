"use strict";

Components.utils.import("resource://gre/modules/Services.jsm");

/*
if (QuickPasswords.Util.Application == 'Postbox'){ 
  if (typeof XPCOMUtils != 'undefined') {
    XPCOMUtils.defineLazyGetter(this, "NetUtil", function() {
    Components.utils.import("resource://gre/modules/NetUtil.jsm");
    return NetUtil;
    });
  }
  else {
    Components.utils.import("resource://gre/modules/NetUtil.jsm");
  }
}
else {
  Components.utils.import("resource:///modules/MailUtils.js");
}
*/

QuickPasswords.Persist = {
	get Entries() {
		const util = QuickPasswords.Util,
		      prefs = QuickPasswords.Preferences,
		      Cc = Components.classes,
          Ci = Components.interfaces;
		let logins = Services.logins.getAllLogins(),
		    persistedLogins = [],
		    cryptoService = Cc["@mozilla.org/login-manager/crypto/SDR;1"].getService(Ci.nsILoginManagerCrypto);	
				
		if (prefs.isDebug) debugger;
		for (let i=0; i < logins.length; i++) {
			let login = logins[i],
			    PL = {
				    hostname: login.hostname,
						formSubmitURL: login.formSubmitURL,
						httpRealm: login.httpRealm,
						pwd: cryptoService.encrypt(login.password),
						pwdField: login.passwordField,
						usr: login.username,
						usrField: login.usernameField
					};
			// Query for Optional fields.
			let metaInfo = login.QueryInterface(Ci.nsILoginMetaInfo);
			if (metaInfo) {
				PL.timeCreated = metaInfo.timeCreated;
				PL.timeLastUsed = metaInfo.timePasswordChanged;
				PL.guid = metaInfo.guid;
			}

			persistedLogins.push(PL);
		}
		return persistedLogins;
		//		from docs for nsILoginManager
		/*
		let nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
		                              Ci.nsILoginInfo,
		                              "init"),
		*/
		// logins wrapper for saving.
	},
	
	set Entries(jRead) {
		// wrapper for reading logins
		// this is where we need to do merge etc.
		let entries = JSON.parse(jRead);
		for (let i=0; i<entries.length; i++) {
			let e = entries[i];
			
		}
	},
	
  // %file(filePath,encoding)%
  // %file(imagePath,altText)%
	// mode = 'read' or 'write'
  getFileName: function getFileName(mode, callbackFunction) {
    const fileType ='json',
					util = QuickPasswords.Util,
		      prefs = QuickPasswords.Preferences,
		      Cc = Components.classes,
          Ci = Components.interfaces,
					//localized text for filePicker filter menu
					strBndlSvc = Cc["@mozilla.org/intl/stringbundle;1"].getService(Ci.nsIStringBundleService),
					bundle = strBndlSvc.createBundle("chrome://quickpasswords/locale/overlay.properties"),
					filterText = bundle.GetStringFromName("fpJSONFile"),
					{OS} = Components.utils.import("resource://gre/modules/osfile.jsm", {});

			// default file name		
			let tm = new Date(),
			    dateStamp = tm.getFullYear().toString() + '-' + (tm.getMonth() + 1) + '-' + tm.getDate(),
          profileDir = OS.Constants.Path.profileDir,
					defaultFile =  "logins" + dateStamp + ".json",
          path,
					defaultPath = prefs.getStringPref("backup.path");
					
		let fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
		fp.init(window, "", mode == 'read' ? fp.modeOpen : fp.modeSave); // second parameter: prompt
		fp.appendFilter(filterText, "*.json");
		
		if (mode =='write') {
			fp.defaultString = defaultFile;
		}
    
    let fpCallback = function fpCallback_FilePicker(aResult) {
      if (aResult != Ci.nsIFilePicker.returnCancel) {  // returnOk=0 or returnReplace=2
        if (fp.file) {
          let path = fp.file.path; 
					prefs.setStringPref("backup.path", path);  // save path for next time
          //localFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
          try {
						// call the function that does something with the file name path
						callbackFunction(fp.file.path);
          }
          catch(ex) {
            util.logException('fpCallback_FilePicker', ex);
          }
        }
      }
    }
    
		if (fp.open) {
			let file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
			defaultPath = defaultPath || OS.Path.join(profileDir, "extensions", "QuickPasswords");
			file.initWithPath(defaultPath);
			fp.displayDirectory = file;
			fp.open(fpCallback);		
		}
		else { // Postbox
		  fpCallback(fp.show());
		}
    
    return true;    
  } ,	
	
	store: function store(path) {
    const util = QuickPasswords.Util,
					prefs = QuickPasswords.Preferences;
    util.logDebug("QuickPasswords.Persist.store()...");
		
		if (util.Application == 'Postbox') {
			Services.prompt.alert(null, 'QuickPasswords.backupPasswords', 'Saving not supported in ' + util.Application);			
			return;
		}
    try {
      const {OS} = Components.utils.import("resource://gre/modules/osfile.jsm", {});
			let promiseBackup;
					
			let	promiseExists = OS.File.exists(path).then (
				function onSuccess(exists) {
					if (exists) {
						let backPath = path + ".bak",
								promiseDelete = OS.File.remove(backPath);  // only if it exists
						// promiseBackup = 
						promiseDelete.then(
							function () { 
								util.logDebug ('OS.File.move is next...'); 
								OS.File.move(path, backPath); 
							},
							function failedDelete(fileError) { 
								util.logDebug ('OS.File.remove failed for reason:' + fileError); 
								OS.File.move(path, backPath); 
							}
						);
					}
				},
				function onFailure(ex) {
					util.logDebug('exists failed.');
				}
			);

			// if (!promiseBackup) return;
      promiseExists.then( 
        function backSuccess() {
					let entries = QuickPasswords.Persist.Entries,
              entity = entries.length ? entries : '',
              outString = JSON.stringify(entity, null, '  '); // prettify
					util.logDebug('backSuccess() \npath = ' + path);
          try {
            // let theArray = new Uint8Array(outString);
						util.logDebug ('Start writeAtomic...');
            let promise = OS.File.writeAtomic(path, outString, { encoding: "utf-8"});
            promise.then(
              function saveSuccess(byteCount) {
                util.logDebug ('successfully saved ' + entries.length + ' logins [' + byteCount + ' bytes] to file');
              },
              function saveReject(fileError) {  // OS.File.Error
                util.logDebug ('logins.save error:' + fileError);
              }
            );
          }
          catch (ex) {
            util.logException('QuickPasswords.Persist.store - backSuccess()', ex);
          }
        },
        function backupFailure(fileError) {
          util.logDebug ('promiseBackup error:' + fileError);
        }
      );
    }
    catch(ex) {
      util.logException('QuickPasswords.Persist.store()', ex);
    }
	} ,
	
	readStringFile: function readStringFile(path) {
    // To read content from file
    const {TextDecoder,OS} = Components.utils.import("resource://gre/modules/osfile.jsm", {});
    let decoder = new TextDecoder(),        // This decoder can be reused for several reads
        promise = OS.File.read(path, { encoding: "utf-8" }); // Read the complete file as an array - returns Uint8Array 
    return promise;
  } ,
  
	
	load: function load(path) {
    const util = QuickPasswords.Util,
		      prefs = QuickPasswords.Preferences;
    util.logDebug("QuickPasswords.Persist.load():\n" + path);
		
		if (util.Application == 'Postbox') {
			Services.prompt.alert(null, 'QuickPasswords.Persist.load', 'Backup/Restore not supported in ' + util.Application);			
			return;
		}
		
    try {
      const {OS} = Components.utils.import("resource://gre/modules/osfile.jsm", {});
					
			let	promiseExists = OS.File.exists(path);
			promiseExists.then(
				function onSuccess(exists) {
					if (exists) {
						let promiseRead = QuickPasswords.Persist.readStringFile(path).then (
						  function onSuccess(data) {
								// restoration payload!
								QuickPasswords.Persist.Entries = data;
							},
							function onFailure(ex) {
								util.logDebug ('readStringFile failed!' + ex);
								if (ex.becauseNoSuchFile) {
									// File does not exist);
								}
								else {
									// Some other error
									Services.prompt.alert(null, 'QuickPasswords.Persist.load', 'Reading the passwords file failed\n' + ex);
								}     
							}
						);
					}
					else {
						Services.prompt.alert(null, 'QuickPasswords.Persist.load', "File doesn't exist:\n" + path);
					}
				},
				function onFailure(ex) {
					util.logDebug('exists failed.');
				}
			);
    }
    catch(ex) {
      util.logException('QuickPasswords.Persist.backupPasswords()', ex);
    }		
		
		
	} ,
	
	backupPasswords : function (win) {
    const util = QuickPasswords.Util;
		if (util.isDebug) debugger;
		if (!QuickPasswords.Manager.isMasterPasswordActive) {
			let msg = QuickPasswords.Bundle.GetStringFromName("alert.backup.masterpassword");
			if (util.confirm(msg))
				QuickPasswords.Manager.createMasterPassword();
			return;
		}
    util.logDebug("QuickPasswords.Persist.backupPasswords()...");
		QuickPasswords.Persist.getFileName('write', QuickPasswords.Persist.store);
    util.logDebug("QuickPasswords.Persist.backupPasswords() complete.");
	} ,
	
	restorePasswords : function (win) {
		const util = QuickPasswords.Util,
		      prefs = QuickPasswords.Preferences,
		      Cc = Components.classes,
          Ci = Components.interfaces;
		let cryptoService = Cc["@mozilla.org/login-manager/crypto/SDR;1"].getService(Ci.nsILoginManagerCrypto);	
		
		if (util.isDebug) debugger;
		if (!QuickPasswords.Manager.isMasterPasswordActive) {
			let msg = QuickPasswords.Bundle.GetStringFromName("alert.backup.masterpassword");
			if (util.confirm(msg))
				QuickPasswords.Manager.createMasterPassword();
			return;
		}
		
		if (!cryptoService.isLoggedIn || cryptoService.uiBusy) {
			if (!QuickPasswords.Manager.loginMaster(false)) {
				return;
			}
		}
		
		QuickPasswords.Persist.getFileName('read', QuickPasswords.Persist.load);
	}
};
