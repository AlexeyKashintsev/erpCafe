/**
 * 
 * @author Alexey
 */
function TradePointCommonDetails(aTPDetails) {
    var self = this, model = this.model, form = this;
    
    self.setFranchazi = function(aFranchazi) {
        
    };
    
    self.setTradePoint = function(aTradePoint) {
        model.params.tradePointID = aTradePoint;
    };
}
