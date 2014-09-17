/**
 * 
 * @author minya92
 */
function BillsFranchazi() {
    var self = this, model = this.model, form = this;
    model.params.franchazi_id = null;
    
    self.setFranchaziId = function(aId){
        model.params.franchazi_id = aId;
        model.requery();
    };
}
