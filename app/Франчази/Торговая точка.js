/**
 * 
 * @author Alexey
 */
function TradePoint() {
    var self = this, model = this.model, form = this;
    
    var fmWarehouse = new SelectItemsInWH();
    fmWarehouse.showOnPanel(form.pnlWarehouse);
    
    var fmTradeItems = new TradeItemsOnTradePoint();
    fmTradeItems.showOnPanel(form.pnlTradePositions);
    
    self.setFranchazi = function(aFranchazi) {
        //model.params.franchaziId = aFranchazi;
        fmWarehouse.setFranchazi(aFranchazi);
        fmTradeItems.setFranchazi(aFranchazi);
    };
    
    self.setTradePoint = function(aTradePoint) {
        //model.params.tradePoint = aTradePoint;
        fmWarehouse.setTradePoint(aTradePoint);
        fmTradeItems.setTradePoint(aTradePoint);
    };
}
