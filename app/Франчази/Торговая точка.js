/**
 * 
 * @author Alexey
 */
function TradePoint() {
    var self = this, model = this.model, form = this;
    
    var fmWarehouse = new SelectItemsInWH();
    fmWarehouse.showOnPanel(form.pnlWarehouse);
    
    var fmTradeItems = new ItemsForTrade();
    fmTradeItems.showOnPanel(form.pnlTradePositions);
    
    self.setFranchazi = function(aFranchazi) {
        self.model.params.franchaziId = aFranchazi;
        fmWarehouse.setFranchazi(aFranchazi);
        fmTradeItems.set
    };
    
    self.setTradePoint = function(aTradePoint) {
        model.params.tradePoint = aTradePoint;
        fmWarehouse.setTradePoint(aTradePoint);
    };
}
