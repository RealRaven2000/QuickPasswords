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
				PL.timePasswordChanged = metaInfo.timePasswordChanged;
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
		const util = QuickPasswords.Util,
		      prefs = QuickPasswords.Preferences,
		      Cc = Components.classes,
          Ci = Components.interfaces;
		let logins = Services.logins.getAllLogins(),  // nsLoginInfo[]
		    cryptoService = Cc["@mozilla.org/login-manager/crypto/SDR;1"].getService(Ci.nsILoginManagerCrypto),
				srvLoginManager = Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager);

		// wrapper for reading logins
		// this is where we need to do merge etc.
		let persistedLogins = JSON.parse(jRead),
				ctModified = 0,
				ctUnmodified = 0,
				ctNew = 0,
				read = persistedLogins.length,
				addedLogins = [],  // missing logins before restore; the others will be updated in place where appropriate
				failedToAdd = [];
		for (let j=0; j<read; j++) {
			let record = persistedLogins[j],
					isChanged = false,
					exists = false,
					userChanged = false,
					login, metaInfo, pwd;
			try { 
			  // the decryption may fail! (to do: find out the conditions that can make it fail? 
				// changing / restoring master password?
			  pwd = cryptoService.decrypt (record.pwd);
			}
			catch (ex) {
				record.exception = ex.message;
				failedToAdd.push(record);
				continue;
			}
			for (let i=0; i < logins.length; i++) {
				login = logins[i];
				// for a match, both formSubmitURL [alternatively hostName / httpRealm] and user have to match
				if (login.userName == record.usr) { // match user name - note: changed user names are NOT caught
					// match url
					if (login.formSubmitURL) {
						if (login.formSubmitURL == record.formSubmitURL)				    
							exists = true;
					}
					else if (login.httpRealm) {
						if (login.httpRealm == record.httpRealm)				    
							exists = true;
					}
					else if (login.hostName) {
						if (login.hostName == record.hostName)				    
							exists = true;
					}
					break;
				}
				else { // special case - user was changed - we base this on GUID
				  if (login.guid == record.guid) {
  					userChanged = true;
						exists = true;
					}
				}
			}
			if (exists) {
				let isModified = false;
				metaInfo = login.QueryInterface(Ci.nsILoginMetaInfo);
				if (metaInfo) {
					// do we know that it was changed, based on recorded time stamp
					if (metaInfo.timePasswordChanged < record.timePasswordChanged)
						isModified = true;
				}
				else {
					if (login.password != pwd
					    || login.passwordField != record.passwordField
							|| login.usernameField != record.usrField)
						isModified = true;
				}
				
				if (isModified) {
					let newLogin = login.clone();
					if (userChanged) newLogin.username = record.usr;
				  newLogin.hostname = record.hostname;
					newLogin.formSubmitURL = record.formSubmitURL;
					newLogin.httpRealm = record.httpRealm;
					newLogin.password = pwd;
					newLogin.passwordField = record.pwdField;
					newLogin.username = record.usr;
					newLogin.usernameField = record.usrField;
					if (util.confirm(msgModExisting)) {
					  srvLoginManager.modifyLogin(login, newLogin);
						ctModified++;
					}
					else ctUnmodified++;
				}
				else ctUnmodified++;
			}
			else 
				addedLogins.push(record);
		}
		// create a constructor for new logins
		let nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1", Ci.nsILoginInfo, "init");
		for (let i=0; i < addedLogins.length; i++) {
			let record = addedLogins[i];
			try {
				let createdLogin = new nsLoginInfo (
					record.hostname, 
					record.formSubmitURL, 
					record.httpRealm, 
					record.usr, 
					pwd, 
					record.usrField, 
					record.pwdField
				);
				srvLoginManager.addLogin(createdLogin);
				ctNew++;
			}
			catch(ex) {
				record.exception = ex.message;
				failedToAdd.push(record);
			}
		}
		let msg = '{0} existing logins changed.\n{1} logins added.\n{2} logins were unchanged.';
		msg = msg.replace('{0}', ctModified).replace('{1}', ctNew).replace('{2}', ctUnmodified);
		
		if (failedToAdd.length) {
			let failMsg = "\nSome Addons could not be added, do you want to review these?";
			if (util.confirm(msg + failMsg, 'QuickPasswords - Logins Restored')) {
				let errList = 'FAILED LOGINS\n' +
				          '=============\n';
				for (let x=0; x<failedToAdd.length; x++) {
					let record = failedToAdd[x];
					errList += '\n' + (10000 + x).toString().slice(-4); // 4digit leading zeroes
					        + '\n' + 'hostname = ' + record.hostname
					        + '\n' + 'formSubmitURL = ' + record.formSubmitURL
					        + '\n' + 'httpRealm = ' + record.httpRealm
					        + '\n' + 'username = ' + record.usr
					        + '\n' + 'usernameField = ' + record.usrField
					        + '\n' + 'passwordField = ' + record.pwdField
					        + '\n' + 'error = ' + record.exception
									+ '\n ---------------------------';
				}
				util.copyStringToClipboard(errList);
				util.alert('Information was copied to clipboard');
			}
		}
		else
			util.alert(msg, 'QuickPasswords - Logins Restored');
		
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
          let path = fp.file.path,
					    // workaround for getting folder path for file:
					    folderPath = path.substr(0, path.lastIndexOf('\\'));
					if (!folderPath) folderPath = path.substr(0, path.lastIndexOf('/'));
					prefs.setStringPref("backup.path", folderPath);  // save path for next time
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
					    entryCount = entries.length,
              entity = entryCount ? entries : '',
              outString = JSON.stringify(entity, null, '  '); // prettify
					util.logDebug('backSuccess() \npath = ' + path);
          try {
            // let theArray = new Uint8Array(outString);
						util.logDebug ('Start writeAtomic...');
            let promise = OS.File.writeAtomic(path, outString, { encoding: "utf-8"});
            promise.then(
              function saveSuccess(byteCount) {
								let msg = 'Successfully saved {0} logins [{1} bytes] to file';
								msg = msg.replace('{0}',entryCount).replace('{1}',byteCount);
                util.logDebug (msg);
								util.alert(msg);
              },
              function saveReject(fileError) {  // OS.File.Error
							  let msg = 'An error occured while trying to save the logins:\n' + fileError;
                util.logDebug (msg);
								util.alert(msg);
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
		
		let managerWin;
    try {
			// disable logins list
			let mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
			managerWin = mediator.getMostRecentWindow('Toolkit:PasswordManager');
			if (managerWin) {
				managerWin.document.getElementById('signonsTree').setAttribute("disabled", "true");
			}
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
		finally {
			if (managerWin) {
				managerWin.document.getElementById('signonsTree').removeAttribute("disabled");
			}
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
