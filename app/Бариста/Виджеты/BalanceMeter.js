/**
 * 
 * @author Alexey
 * @module
 */ 
function BalanceMeter() {
    var self = this, model = this.model;
    var callback;
    var msgAPI = function() {
        var obj = {};
        obj.DeviceType = "scales";
        obj.Action = "get_weight";
        obj.Data = null;
        return "apimsg:" + JSON.stringify(obj);
    }();
    
    window.addEventListener("FromPage", function(evt) {
        console.log(evt)
        //if (evt.DeviceType == "scales")
            self.setBalance(evt.detail);
    }.bind(this), false);
    
    
    self.weight = 0;
    self.measure = 'кг';
    self.itemDescription = null;
    self.itemData = null;
    
    self.setBalance = function(aBalance) {
        if (aBalance > 0.01) {
            self.weight = aBalance / 1000;
            self.updateView();
        } else {
            console.log(aBalance);
            //askScales();
        }
    };
    
    function askScales() {
        console.log(msgAPI);
    }
    
    self.getWeight = function(anItemData, aCallback) {
        if (anItemData.item_name) self.itemData = anItemData;
        if (aCallback) callback = aCallback;
        askScales();
        self.show();
    };
    
    self.accept = function() {
        self.hide();
        if (callback)
            callback(self.weight);
    };
    
    wf.BalanceMeter.bind(this)();
}
