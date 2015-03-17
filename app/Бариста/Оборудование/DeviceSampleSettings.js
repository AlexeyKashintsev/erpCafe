/**
 * 
 * @author Alexey
 * @module
 */ 
function DeviceSampleSettings(aParent) {
    var self = this, model = this.model;
    var storedSettings = {};
    window.addEventListener("setSetting", evtProcess);
        
    function evtProcess(aEvtObj) {
        aParent.setSettings(aEvtObj);
    }
    
    self.getAvaibleDevices = function() {
        var obj = {};
        obj.DeviceType = "main";
        obj.Action = "getDevices";
        obj.Data = null;
        console.log("apimsg:" + JSON.stringify(obj));
    };
    
    self.setSettings = function(aSettings) {
        storedSettings = aSettings;
        var obj = {};
        obj.DeviceType = "main";
        obj.Action = "getDevices";
        obj.Data = aSettings;
        console.log("apimsg:" + JSON.stringify(obj));
    };
    
    self.getSettings = function() {
        return storedSettings;
    };
    
    function getAvailabalePorts() {
        return ["Не задан", "com1", "com2", "com4", "com9"];
    }
}
