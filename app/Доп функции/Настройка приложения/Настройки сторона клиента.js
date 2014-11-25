/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function SettingsClientSide() {
    var self = this, model = this.model;
    var ServSettings = new ServerModule('Settings');
    
    var currentSettings =  ServSettings.getSettings();
    
    this.getSettings = function(aSettingName) {
        return currentSettings[aSettingName];
    };
    
    this.setSettings = function(aSettingName, aData) {
        //TODO Subj
    };
}
