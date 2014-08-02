/**
 * 
 * @author Alexey
 * @module
 */ 
function BaristaClient() {
    var self = this, model = this.model;
    self.userSession = new ServerModule('UserSession');   
    
    function setSession(aSession) {
        if (aSession) {}
    }
    
    self.session.login(function(aFranchazi){
        if (!aFranchazi) self.close();
        model.tradeItemsByTradePointWithCost.params.franchazi_id = aFranchazi;
        model.tradeItemsByTradePointWithCost.params.actual_date = new Date();
        
        self.session.getActiveTPSession(function(aSession){
            setSession(aSession);
        });    
        
    });
}
