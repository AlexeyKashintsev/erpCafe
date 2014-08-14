/**
 * 
 * @author Alexey
 */
function FranchaziAndUsers() {
    var self = this, model = this.model, form = this;
    
    self.franchazi = new SelectFranchaziAdminForm();
    self.franchazi.parent = self;
    self.franchaziUsers = new FranchaziUsers();
    self.franchaziUsers.parent = self;
    
    self.franchazi.showOnPanel(form.pnlFranchazi);
    self.franchaziUsers.showOnPanel(form.pnlTradePoints);
    
    self.setFranchazi = function(aFranchaziId) {
        self.franchaziUsers.setFranchazi(aFranchaziId)
    };
}
