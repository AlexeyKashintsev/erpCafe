/**
 * 
 * @author Alexey
 */
function TradePointCommonDetails(aTPDetails) {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    self.setFranchazi = function(aFranchazi) {
        
    };
    
    self.setTradePoint = function(aTradePoint) {
        model.params.tradePointID = aTradePoint;
    };
}
