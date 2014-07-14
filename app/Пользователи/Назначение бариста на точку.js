/**
 * @name CreateTradePointUser
 * @author mike
 */
function CreateTradePointUser() {
    var self = this, model = this.model, form = this;
    
    self.setFranchaziId = function(aFranchaziId){
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
