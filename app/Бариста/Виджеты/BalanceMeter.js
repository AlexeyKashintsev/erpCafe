/**
 * 
 * @author Alexey
 * @module
 */ 
function BalanceMeter() {
    var self = this, model = this.model;
    
window.addEventListener("FromPage", function(evt) {
    self.setBalance(evt.detail);
}.bind(this), false);
    
    
    self.weight = 0;
    self.measure = 'кг';
    
    wf.BalanceMeter.bind(this)();
    
    self.setBalance = function(aBalance) {
        self.weight = aBalance;
        self.updateView();
    };
    
    setInterval(function(){
        var obj = {};
        obj.DeviceType = "scales";
        obj.Action = "get_weight";
        obj.Data = null;
        console.log("apimsg:" + JSON.stringify(obj));
    }, 3000);
    
    //addBalanceAction(self.setBalance);
}
