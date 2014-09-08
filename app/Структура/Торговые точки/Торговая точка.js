/**
 * 
 * @author Alexey
 */
function TradePoint() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
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
