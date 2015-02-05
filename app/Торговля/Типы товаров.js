/**
 * @author minya92
 */
function ChangeItemType() {
    var self = this, model = this.model, form = this;
    var addItemType = new AddItemType();
    var userSession = Session.get("UserSession");
    
    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        form.close(model.itemType.cursor.wh_item_types_id);
    }//GEN-LAST:event_button1ActionPerformed

    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (model.modified&&confirm('Сохранить изменения?')){
            model.save();
        }
        model.requery();
    }//GEN-LAST:event_btnReqActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        addItemType.showModal(function (aReq) {
            if(aReq) model.requery();
        });
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        model.itemType.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
    }//GEN-LAST:event_formWindowClosing

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(userSession.getUserRole() == "admin"){
            form.modelGrid.editable = true;
            form.modelGrid.deletable = true;
            form.modelGrid.insertable = true;
            
            form.btnDel.visible = true;
        }
        model.itemType.requery();
    }//GEN-LAST:event_formWindowOpened
}
