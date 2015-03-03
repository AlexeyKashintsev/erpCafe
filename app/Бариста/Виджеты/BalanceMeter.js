/**
 * 
 * @author Alexey
 * @module
 */ 
function BalanceMeter() {
    var self = this, model = this.model;
    var callback;
    
    window.addEventListener("FromPage", function(evt) {
        self.setBalance(evt.detail);
    }.bind(this), false);
    
    
    self.weight = 0;
    self.measure = 'кг';
    self.itemDescription = null;
    self.itemData = null;
    
    self.setBalance = function(aBalance) {
        self.weight = aBalance;
        self.updateView();
    };
    
    setInterval(function(){
        //++self.weight;
        //self.updateView();
        var obj = {};
        obj.DeviceType = "scales";
        obj.Action = "get_weight";
        obj.Data = null;
        console.log("apimsg:" + JSON.stringify(obj));
    }, 3000);
    
    self.getWeight = function(anItemData, aCallback) {
        self.itemData = anItemData;
        self.weight = 0;
        callback = aCallback;
        self.show();
    };
    
    self.accept = function() {
        self.hide();
        if (callback)
            callback(self.weight);
    };
    
    wf.BalanceMeter.bind(this)();
}
