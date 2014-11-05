/**
 * 
 * @author Алексей
 * @name FranchaziUsers
 * @rolesAllowed franchazi admin
 * @public
 */

function FranchaziUsers() {
    var self = this, model = this.model, form = this;
    self.isSelectForm = false;
    
    //var tradePointsForm = new TradePoints();
    var userCreateAndEditForm = new UserCreateAndEditForm();
    var baristaTP = new TradePointsbaristForm();
    
    model.params.franchazi_id = null;
    model.params.trade_point_id = null;
    
    
    self.setFranchazi = function(aFranchaziId) {
        model.params.franchazi_id = aFranchaziId;
    };

    self.setTradePoint = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
    };
    
    self.setFranchazi(1);

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
        form.pnlSelLock.visible = self.isSelectForm;
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing


    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        form.close(model.listTradePointUsers.usr_name);
    }//GEN-LAST:event_btnSelectActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        userCreateAndEditForm.setFranchazi(model.params.franchazi_id);
        userCreateAndEditForm.setUserName(undefined);
        userCreateAndEditForm.showModal(function(){
                model.requery();
            });
    }//GEN-LAST:event_btnAddActionPerformed

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
        if (evt.clickCount === 2) {
            userCreateAndEditForm.setFranchazi(model.params.franchazi_id);
            userCreateAndEditForm.setUserName(model.listTradePointUsers.cursor.usr_name);
            userCreateAndEditForm.showModal(function(){
                    model.requery();
                });
        }
        form.btnSetPoints.enabled = 
                (model.listTradePointUsers.group_name == 'barista');
    }//GEN-LAST:event_modelGridMouseClicked

    function btnSetPointsActionPerformed(evt) {//GEN-FIRST:event_btnSetPointsActionPerformed
        baristaTP.setFranchazi(model.params.franchazi_id);
        baristaTP.setUserName(model.listTradePointUsers.usr_name);
        baristaTP.showModal();
    }//GEN-LAST:event_btnSetPointsActionPerformed

    function modelGridMousePressed(evt) {//GEN-FIRST:event_modelGridMousePressed
    }//GEN-LAST:event_modelGridMousePressed

    function btnDel1ActionPerformed(evt) {//GEN-FIRST:event_btnDel1ActionPerformed
    }//GEN-LAST:event_btnDel1ActionPerformed
}