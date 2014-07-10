/**
 * 
 * @author Alexey
 */
function TradePoint() {
    var self = this, model = this.model, form = this;
    
    self.setFranchazi = function(aFranchazi) {
        self.model.params.franchaziId = aFranchazi;
    };
    
    self.setTradePoint = function(aTradePoint) {
        model.params.tradePoint = aTradePoint;
    };
}
