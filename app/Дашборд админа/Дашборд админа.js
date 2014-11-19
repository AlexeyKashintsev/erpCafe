/**
 * 
 * @author Alexey
 * @module
 */ 
function AdminDashboard() {
    var self = this, model = this.model;
    var fran = {};
    
    self.manualShow = function(aContainer) {
        self.container = aContainer;
        model.listFranchazi.params.franchazi_id = null;
        model.listFranchazi.requery(function() {
            model.listFranchazi.beforeFirst();
            while (model.listFranchazi.next()) {
                fran[model.listFranchazi.cursor.org_franchazi_id] = 
                    new franActivity(model.listFranchazi.cursor.org_franchazi_id,
                                     self.container);
            }    
        });

    };

    function listFranchaziOnRequeried(evt) {//GEN-FIRST:event_listFranchaziOnRequeried
       
    }//GEN-LAST:event_listFranchaziOnRequeried
}
