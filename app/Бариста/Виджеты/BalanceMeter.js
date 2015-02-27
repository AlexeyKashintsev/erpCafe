/**
 * 
 * @author Alexey
 * @module
 */ 
function BalanceMeter() {
    var self = this, model = this.model;
    
    self.weight = 0;
    self.measure = 'кг';
    
    wf.BalanceMeter.bind(this)();
    
    self.setBalance = function(aBalance) {
        self.weight = aBalance;
        self.updateView();
    };
    
    //addBalanceAction(self.setBalance);
}
