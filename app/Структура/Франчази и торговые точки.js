/**
 * 
 * @author Alexey
 */
function FranchaziAndTradePoints() {
    var self = this, model = this.model, form = this;
    
    self.franchazi = new SelectFranchaziAdminForm();
    self.franchazi.parent = self;
    self.tradePoints = new TradePoints();
    self.tradePoints.parent = self;
    self.tradePoints.addButtons = true;
    
    self.franchazi.showOnPanel(form.pnlFranchazi);
    self.tradePoints.showOnPanel(form.pnlTradePoints);
    
    self.setFranchazi = function(aFranchazi) {
        self.tradePoints.setFranchazi(aFranchazi);
    };
}
