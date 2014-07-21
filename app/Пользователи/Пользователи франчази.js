/**
 * 
 * @author Алексей
 * @name SelectBaristForm
 * @rolesAllowed barista
 * @public
 */

function SelectBaristForm() {
    var self = this, model = this.model, form = this;

    var tradePointsForm = new TradePointsForm();
    var createTradePointUser = new CreateTradePointUser();
    model.params.franchazi_id = null;
    model.params.trade_point_id = null;
    
    
    self.setFranchaziId = function(aFranchaziId) {
        model.params.franchazi_id = aFranchaziId;
    };

    self.setTradePointId = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
    };

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    self.model.save();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

}//GEN-LAST:event_formWindowOpened

function tbSetEditActionPerformed(evt) {//GEN-FIRST:event_tbSetEditActionPerformed

}//GEN-LAST:event_tbSetEditActionPerformed

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing


    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        form.close(model.listTradePointUsers.usr_name);
    }//GEN-LAST:event_btnSelectActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        createTradePointUser.setFranchaziId(model.params.franchazi_id);
        createTradePointUser.showModal(function(user){
            if(user){
                model.createTradePointUser.insert(
                model.createTradePointUser.schema.user_name, user.user_name,
                model.createTradePointUser.schema.trade_point_id, user.trade_point_id,
                model.createTradePointUser.schema.tp_users_active , true);
                model.save();
                model.requery();
            }   
        });
    }//GEN-LAST:event_btnAddActionPerformed
}