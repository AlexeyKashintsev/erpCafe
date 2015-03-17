/**
 * 
 * @author Alexey
 * @module
 * @public
 */
function DeviceSettings(aContainer) {
    var self = this, model = this.model;

    var APP_API = new DeviceSampleSettings(self);
    APP_API.getAvailableDevices();
    var devSettings = {};
    
    
    self.setSettings = function(aSettings){
        for (var devType in aSettings) {
            devSettings[devType] = new DevSettings(aSettings[devType]);
        }
    }
    
    var btnSave = cmn.createElement("button", "btnOk", aContainer);
    btnSave.innerHTML = "Сохранить";
    btnSave.onclick = function() {
        var resSettings = {};
        for (var j in devSettings) {
            resSettings[j] = devSettings[j].getSettings();
        }
        APP_API.setSettings(resSettings);
    };
    
    var btnCancel = cmn.createElement("button", "btnCancel", aContainer);
    btnCancel.innerHTML = "Сбросить";
    btnCancel.onclick = function() {
        var storedSettings = APP_API.getSettings();
        
        for (var devType in storedSettings)
            if (storedSettings[devType]) {
                devSettings[devType].setDevice(storedSettings[devType].name, storedSettings[devType].settings);
            }
    };    
    

    function DevSettings(devData) {
        var devSet = this;
        devSet.data = devData;
        devSet.settings = {};
        var selectedDevice;
        var defSettings;

        devSet.showSettings = function(aSettings) {
            if (!cmn.isObjEmpty(devSet.settings))
                for (var j in devSet.settings) {
                    devSet.settings[j].destroy();
                }
            this.settings = {};
            for (var j in aSettings) {
                devSet.settings[j] = new Setting(aSettings[j]);
            }
            if (defSettings) {
                devSet.setSettings(defSettings);
                defSettings = null;
            }
        };

        devSet.setSettings = function(aSettingsData) {
            for (var j in aSettingsData)
                if (devSet.settings[j])
                    devSet.settings[j].setSetting(aSettingsData[j]);
        };

        devSet.getSettings = function() {
            var res = null;
            if (selectedDevice) {
                res = {
                    name :  selectedDevice
                };
                res.settings = {};
                for (var j in devSet.settings)
                    res.settings[j] = devSet.settings[j].getSetting();
            }
            return res;
        };
        
        devSet.setDevice = function(aDevName, aSettings) {
            defSettings = aSettings;
            devSet.selectorList.setSelection(aDevName);
        };

        devSet.selectDevice = function(aDevName) {
            selectedDevice = aDevName;
            devSet.data.values.forEach(function(aData) {
                if (aData.name === aDevName)
                    devSet.showSettings(aData.settings);
            }, this);
        };

        function Setting(aSetting) {
            this.data = aSetting;
            this.selectOption = function(aOption) {
                this.selected = aOption;
            };
            wf.DevSetting.bind(this)(devSet.settingsPane);

            this.setSetting = function(aValue) {
                this.selectorList.setSelection(aValue);
            }.bind(this);

            this.getSetting = function() {
                return this.selected;
            }.bind(this);
        }

        wf.DeviceSettings.bind(devSet)(aContainer);
    }
}
