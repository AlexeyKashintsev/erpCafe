/**
 * @name UserView
*/
function UserView(){
    var self = this, model = self.model, form = this;
    var changePassView = new ChangePassView();
    
    function setControlsEnabled() {
         form.btnSave.enabled = model.modified;
    }
    
    function refreshUsers() {
        var cur = model.dsMtdUsers.usr_id;
        if (model.modified && confirm('Сохранить изменения?', self.title))
            model.save();
        model.requery();
       
    }

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        setControlsEnabled();
    }//GEN-LAST:event_formWindowOpened

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if(model.modified && confirm("Сохранить?", self.title))
            model.save();
    }//GEN-LAST:event_formWindowClosing

    function usr_formSelectValue() {//GEN-FIRST:event_usr_formSelectValue
//        if(self.fmAppElS.showModal() == self.ok)
//            return self.fmAppElS.getSelected();
    }//GEN-LAST:event_usr_formSelectValue

    function USR_ROLESelectValue(aEditor) {//GEN-FIRST:event_USR_ROLESelectValue
        // TODO Добавьте свой код:
    }//GEN-LAST:event_USR_ROLESelectValue

    function USR_PASSWDOnSelect(aEditor) {//GEN-FIRST:event_USR_PASSWDOnSelect
        model.save();
        changePassView.setUserId(self.dsMtdUsers.usr_name);
        changePassView.showModal(function(aResult){
            if (aResult) {
                refreshUsers();
                setControlsEnabled();
            }	
        });   
    }//GEN-LAST:event_USR_PASSWDOnSelect

    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
       refreshUsers();
       setControlsEnabled();
    }//GEN-LAST:event_btnReqActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        refreshUsers();
        setControlsEnabled();	
    }//GEN-LAST:event_btnSaveActionPerformed

    function tbSetEditActionPerformed(evt) {//GEN-FIRST:event_tbSetEditActionPerformed
        isEditable = self.tbSetEdit.selected;
        setEdit();
    }//GEN-LAST:event_tbSetEditActionPerformed

    function dsMtdUsersOnChanged(evt) {//GEN-FIRST:event_dsMtdUsersOnChanged
        setControlsEnabled();
    }//GEN-LAST:event_dsMtdUsersOnChanged

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.dsMtdUsers.insert();
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm("Удалить текущего пользователя"))
            model.dsMtdUsers.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed

    function btnFindActionPerformed(evt) {//GEN-FIRST:event_btnFindActionPerformed
        form.grdUsers.findSomething();
    }//GEN-LAST:event_btnFindActionPerformed
}
