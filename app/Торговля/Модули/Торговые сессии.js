/**
 * 
 * @author Alexey
 * @module
 * @resident
 * @public
 */ 
function TradeSessions() {
    var self = this, model = this.model;
    
    self.initializeSession = function(aSession, aStartBalance) {
        model.qTradeSessionBalance.push({
            session_id  :   aSession,
            start_value :   aStartBalance
        });
        model.save();
    };
}
