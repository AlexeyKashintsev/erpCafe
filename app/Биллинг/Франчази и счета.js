/**
 * 
 * @author Alexey
 */
function FranchaziAndBills() {
    var self = this, model = this.model, form = this;
    
    self.franchazi = new SelectFranchaziAdminForm();
    self.franchazi.parent = self;
    self.billsFranchazi = new BillsFranchazi();
    self.billsFranchazi.parent = self;
    
    self.franchazi.showOnPanel(form.pnlFranchazi);
    self.billsFranchazi.showOnPanel(form.pnlBills);
    
    self.setFranchazi = function(aFranchazi) {
        self.billsFranchazi.setFranchaziId(aFranchazi);
    };
}
