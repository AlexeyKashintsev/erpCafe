/**
 * @name UserView
*/
function UserView(){
    var self = this, model = self.model, form = this;
    var changePassView = new ChangePassView();
    
    function setControlsEnabled() {
         self.btnSave.enabled = model.modified;
    }
    
    function refreshUsers() {
        var cur = model.dsMtdUsers.usr_id;
        if (model.modified && confirm('Сохранить изменения?', self.title))
            model.save();
        model.requery();
        
    }

function btnCloseActionPerformed(evt) {//GEN-FIRST:event_btnCloseActionPerformed
    form.close();
}//GEN-LAST:event_btnCloseActionPerformed

function btnCreateUserActionPerformed(evt) {//GEN-FIRST:event_btnCreateUserActionPerformed
    model.dsMtdUsers.insert();
    //model.dsMtdUsers.userrole = ROLE_USER_UCH;
    model.dsMtdUsers.usr_form = self.dsRole.defaultform;
}//GEN-LAST:event_btnCreateUserActionPerformed

function btnDeleteUserActionPerformed(evt) {//GEN-FIRST:event_btnDeleteUserActionPerformed
    if (confirm("Удалить текущего пользователя"))
        model.dsMtdUsers.deleteRow();
    
}//GEN-LAST:event_btnDeleteUserActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    model.save();
    setControlsEnabled();	
}//GEN-LAST:event_btnSaveActionPerformed

function btnRefreshActionPerformed(evt) {//GEN-FIRST:event_btnRefreshActionPerformed
    refreshUsers();
    setControlsEnabled();	
}//GEN-LAST:event_btnRefreshActionPerformed

function btnFindActionPerformed(evt) {//GEN-FIRST:event_btnFindActionPerformed
    form.grdUsers.findSomething();
}//GEN-LAST:event_btnFindActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    setControlsEnabled();
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if(model.modified && confirm("Сохранить?", self.title))
        model.save();
}//GEN-LAST:event_formWindowClosing

function usr_formSelectValue() {//GEN-FIRST:event_usr_formSelectValue
    if(self.fmAppElS.showModal() == self.ok)
        return self.fmAppElS.getSelected();
}//GEN-LAST:event_usr_formSelectValue

    function USR_ROLESelectValue(aEditor) {//GEN-FIRST:event_USR_ROLESelectValue
        // TODO Добавьте свой код:
    }//GEN-LAST:event_USR_ROLESelectValue

    function USR_PASSWDOnSelect(aEditor) {//GEN-FIRST:event_USR_PASSWDOnSelect
    changePassView.setUserId(self.dsMtdUsers.usr_name);
    changePassView.showModal(function(){
        refreshUsers();
    });   
    }//GEN-LAST:event_USR_PASSWDOnSelect
}