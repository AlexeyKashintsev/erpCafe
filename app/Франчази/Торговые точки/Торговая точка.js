/**
 * 
 * @author Alexey
 */
function TradePoint() {
    var self = this, model = this.model, form = this;
    
    var fmCity = new TPCommonSettings();
    fmCity.showOnPanel(form.pnlGeneral);
    
    var fmWarehouse = new SelectItemsInWH();
    fmWarehouse.showOnPanel(form.pnlWarehouse);
    
    var fmTradeItems = new TradeItemsOnTPView();
    fmTradeItems.showOnPanel(form.pnlTradePositions);
    
    var fmFranchaziUsers = new FranchaziUsers();
    fmFranchaziUsers.showOnPanel(form.pnlBaristas);
    
    var fmTradeItemsCost = new TradeItemsWCostOnTPView();
    fmTradeItemsCost.showOnPanel(form.pnlTradePositionsCost);
            
    self.setFranchazi = function(aFranchazi) {
        //model.params.franchaziId = aFranchazi;
        fmWarehouse.setFranchazi(aFranchazi);
        //fmTradeItems.setFranchazi(aFranchazi);
        fmFranchaziUsers.setFranchazi(aFranchazi);
        fmCity.setFranchazi(aFranchazi);
    };
    
    self.setTradePoint = function(aTradePoint) {
        session.tradePoint = aTradePoint;
        fmWarehouse.setTradePoint(aTradePoint);
        fmTradeItems.setTradePoint(aTradePoint);
        fmTradeItemsCost.setTradePoint(aTradePoint);
        fmFranchaziUsers.setTradePoint(aTradePoint);
        fmCity.setTradePoint(aTradePoint);
    };
}
