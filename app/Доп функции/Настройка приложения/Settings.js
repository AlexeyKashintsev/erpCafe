/**
 * 
 * @author Andrew
 * @name Settings
 * @public
 */
function Settings() {
    var self = this, model = self.model;
    
    var userSession = Session.get('UserSession');
    var currentSettings = null;
    
    self.updateSettings();
    
    self.updateSettings = function() {
        model.dsSettings.params.franchazi_id = userSession.getFranchazi();
        model.dsSettings.params.trade_point_id = userSession.getTradePoint();
        model.dsSettings.params.usr_name = userSession.getUserName();
        model.dsSettings.execute();
    };
    
    function setSettingsByName(aName, aSettings, aUserName) {
        if (aSettings && aName) {
            var settings = {};
            settings[aName] = aSettings;
            setSettings(settings, aUserName);
        }
    }

    function getSettings(aUserName) {
        if (!self.model.dsUserSettings.empty) {
            self.model.dsUserSettings.beforeFirst();
            var userSettings = {};
            while (self.model.dsUserSettings.next()) {
                try {
                    userSettings[self.model.dsUserSettings.cursor.propname] = JSON.parse(self.model.dsUserSettings.cursor.propvalue);
                } catch (e) {
                    userSettings[self.model.dsUserSettings.cursor.propname] = self.model.dsUserSettings.cursor.propvalue;
                }
            }
            return userSettings;
        }
        return null;
    }

    function getSettingByName(aSettingName) {
        var settings = model.dsSettings.find([model.dsSettings.schema.setting_name, aSettingName]);
        var priority = 0, used_prior = 0, setting = {};
        if (length(settings) > 1) {
            for (var j in settings) {
                if (settings[j].franchazi_id) priority = 1;
                if (settings[j].trade_point_id) priority = 2;
                if (settings[j].usr_name) priority = 3;
                if (priority > used_prior) {
                    used_prior = priority;
                    setting = settings[j].setting_data;
                }
                priority = 0;
            }
        }
        else 
            setting = settings[0].setting_data;
        return JSON.parse(setting);
    }

    function setSettings(aSettingsName, aSettings, aUserName, aTradePoint, aFranchazi) {
       var settingData = JSON.stringify(aSettings);
        var lst = model.dsSettings.find([model.dsSettings.schema.setting_name, aSettingsName],
                        aUserName   ? [model.dsSettings.schema.usr_name, aUserName]         : [],
                        aTradePoint ? [model.dsSettings.schema.trade_point_id, aTradePoint] : [],
                        aFranchazi  ? [model.dsSettings.schema.franchazi_id, aFranchazi]    : []);
        if (lst.length > 0 && self.model.dsSettings.scrollTo(lst[0])) {
            model.dsSettings.cursor.setting_data = settingData;
        } else {
            model.dsSettings.insert(
                    model.dsSettings.schema.usr_name, aUserName,
                    model.dsSettings.schema.setting_name, aSettingsName,
                    model.dsSettings.schema.trade_point_id, aTradePoint,
                    model.dsSettings.schema.franchazi_id, aFranchazi,
                    model.dsSettings.schema.setting_data, settingData
                );
        }
        model.save();
    }
}