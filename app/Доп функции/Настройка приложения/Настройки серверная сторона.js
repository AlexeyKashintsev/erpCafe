/**
 * 
 * @author Andrew
 * @name Settings
 * @public
 */
function Settings() {
    var self = this, model = self.model;
    
    var userSession = Session.get('UserSession');
    
    self.updateSettingsParams = function(aFranchazi, aTradePoint, aUserName) {
        model.dsSettings.params.franchazi_id =  aFranchazi ? aFranchazi : userSession.getFranchazi();
        model.dsSettings.params.trade_point_id = aTradePoint ? aTradePoint : userSession.getTradePoint();
        model.dsSettings.params.usr_name = aUserName ? aUserName : userSession.getUserName();
        model.dsSettings.execute();
    };
    
    self.getSettings = function(aFranchazi, aTradePoint, aUserName) {
        self.updateSettingsParams(aFranchazi, aTradePoint, aUserName);
        var res = {};
        model.dsSettings.beforeFirst();
        while (model.dsSettings.next()) {
            res[model.dsSettings.cursor.setting_name] = 
                    self.getSettingByName(model.dsSettings.cursor.setting_name);
        }
        return res;
    };

    self.getSettingByName = function(aSettingName) {
        var settings = model.dsSettings.find(model.dsSettings.schema.setting_name, aSettingName);
        var priority = 0, used_prior = 0, setting = {};
        if (settings.length > 0) {
            if (settings.length > 1) {
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
            var res = JSON.parse(setting);
            res.priority = used_prior;
            return res;
        } else return null;
    };
    
    self.setSettings = function(aSettingsName, aSettings, aUserName, aTradePoint, aFranchazi) {
        var settingData = JSON.stringify(aSettings);
        var lst = model.dsSettings.find(model.dsSettings.schema.setting_name, aSettingsName,
                        aUserName   ? model.dsSettings.schema.usr_name : null,
                        aUserName   ? aUserName : null,
                        aTradePoint ? model.dsSettings.schema.trade_point_id : null,
                        aTradePoint ? aTradePoint : null,
                        aFranchazi  ? model.dsSettings.schema.franchazi_id : null,
                        aFranchazi  ? aFranchazi : null);
        if (lst.length > 0 && self.model.dsSettings.scrollTo(lst[0])) {
            model.dsSettings.cursor.setting_data = settingData;
        } else {
            model.dsSettings.insert(
                    model.dsSettings.schema.usr_name, aUserName ? aUserName : null,
                    model.dsSettings.schema.setting_name, aSettingsName,
                    model.dsSettings.schema.trade_point_id, aTradePoint ? aTradePoint : null,
                    model.dsSettings.schema.franchazi_id, aFranchazi ? aFranchazi : null,
                    model.dsSettings.schema.setting_data, settingData
                );
        }
        model.save();
    };
    
    self.getSettings();
}