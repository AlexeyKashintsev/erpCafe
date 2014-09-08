/**
 * @name CreateTradePointUser
 * @author mike
 */
function AddBaristaToTradePoint() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    //model.params.franchazi_id = 3;
    self.setFranchazi = function(aFranchaziId){
         model.params.franchazi_id = aFranchaziId;
    };
        

    function btnCreateActionPerformed(evt) {//GEN-FIRST:event_btnCreateActionPerformed
        var user = {
            user_name : form.modelComboUsrName,
            trade_point_id : form.modelComboTradePoint
        };
        form.close(user);
    }//GEN-LAST:event_btnCreateActionPerformed
}
