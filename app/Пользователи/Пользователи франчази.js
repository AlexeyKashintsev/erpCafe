/**
 * 
 * @author Алексей
 * @name SelectBaristForm
 * @public
 */

function SelectBaristForm() {
    var self = this, model = this.model, form = this;

    var tradePointsForm = new TreadPointsForm();
    var usersFrachaziOrTP = new UsersFrachaziOrTP();
    var createTreadPointUser = new CreateTreadPointUser();

    var isSelectForm = true;
    var isEditable = false;
    var canSetEdit = true;

    model.params.franchazi_id = null;

    self.setFranchaziId = function(aFranchaziId) {
        model.params.franchazi_id = aFranchaziId;
    };
    
    self.setTradePointId = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
    };

//
//function setEdit(){
//    self.modelGrid.editable = self.btnAdd.enabled = 
//            self.btnDel.enabled = self.btnSave.enabled = isEditable;    
//    self.btnAddParent.enabled = isEditable;
//    self.tbSetEdit.visible = canSetEdit;
//    self.tbSetEdit.selected = isEditable;
//}

//function setElShown(){
//    setEdit();
//    if (!isSelectForm){
//        self.pnlSelLock.visible = false;
//        self.pnlWorkSpace.height += 48;
//        self.modelGrid.bottom += 48;
//    }
//}

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
//   setElShown();
}//GEN-LAST:event_formWindowOpened

function tbSetEditActionPerformed(evt) {//GEN-FIRST:event_tbSetEditActionPerformed
//    isEditable = self.tbSetEdit.selected;
//    setEdit();
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
        createTreadPointUser.setFranchaziId(model.params.franchazi_id);
        createTreadPointUser.showModal(function(user){
            if(user){
                model.createTreadPointUser.insert(
                model.createTreadPointUser.schema.user_name, user.user_name,
                model.createTreadPointUser.schema.trade_point_id, user.trade_point_id,
                model.createTreadPointUser.schema.tp_users_active , true);
                model.save();
                model.requery();
            }   
        });
    }//GEN-LAST:event_btnAddActionPerformed
}