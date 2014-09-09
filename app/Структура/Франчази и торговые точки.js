/**
 * 
 * @author Alexey
 */
function FranchaziAndTradePoints() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    self.franchazi = new SelectFranchaziAdminForm();
    self.franchazi.parent = self;
    self.tradePoints = new TradePoints();
    self.tradePoints.parent = self;
    
    self.franchazi.showOnPanel(form.pnlFranchazi);
    self.tradePoints.showOnPanel(form.pnlTradePoints);
    
    self.setFranchazi = function(aFranchazi) {
        self.tradePoints.setFranchazi(aFranchazi);
    };
    
    self.show = function() {
        form.show();
    };
}
