/**
 * @name UserView
*/
function UserView(){
    var self = this, model = self.model, form = P.loadForm(this.constructor.name, model);
    var changePassView = new ChangePassView();
    var rolesForm = new RolesForm();
    
    function setControlsEnabled() {
         form.btnSave.enabled = model.modified;
    }
    
    function refreshUsers() {
        var cur = model.dsMtdUsers.usr_id;
        if (model.modified && confirm('Сохранить изменения?', self.title))
            model.save();
        model.requery();
       
    }

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        setControlsEnabled();
    };//GEN-LAST:event_formWindowOpened

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
        if(model.modified && confirm("Сохранить?", self.title))
            model.save();
    };//GEN-LAST:event_formWindowClosing

    form.USR_ROLE.onSelectValue = function(aEditor) {//GEN-FIRST:event_USR_ROLESelectValue
        model.save();
        rolesForm.setUserName(model.dsMtdUsers.cursor.usr_name);
        rolesForm.showModal(function(user){
           if(user){
                model.dsMtdUsers.cursor.usr_roles = user.usr_role;      
                model.dsMtdUsers.cursor.usr_form = user.usr_form;  
                model.save();
                model.requery();
           }
        });
    };//GEN-LAST:event_USR_ROLESelectValue

    form.USR_PASSWD.onSelect = function(aEditor) {//GEN-FIRST:event_USR_PASSWDOnSelect
        model.save();
        changePassView.setUserId(self.dsMtdUsers.usr_name);
        changePassView.showModal(function(aResult){
            if (aResult) {
                refreshUsers();
                setControlsEnabled();
            }	
        });   
    };//GEN-LAST:event_USR_PASSWDOnSelect

    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
       refreshUsers();
       setControlsEnabled();
    };//GEN-LAST:event_btnReqActionPerformed

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        refreshUsers();
        setControlsEnabled();	
    };//GEN-LAST:event_btnSaveActionPerformed

    form.tbSetEdit.onActionPerformed = function(evt) {//GEN-FIRST:event_tbSetEditActionPerformed
        //isEditable = self.tbSetEdit.selected;
        setEdit();
    };//GEN-LAST:event_tbSetEditActionPerformed

    model.dsMtdUsers.onChanged = function(evt) {//GEN-FIRST:event_dsMtdUsersOnChanged
        setControlsEnabled();
    };//GEN-LAST:event_dsMtdUsersOnChanged

    form.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.dsMtdUsers.insert();
    };//GEN-LAST:event_btnAddActionPerformed

    form.btnDel.onActionPerformed = function(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm("Удалить текущего пользователя")){
            model.dsMtdUsers.usr_passwd = 'false';
            model.save();
            refreshUsers();
        }
    };//GEN-LAST:event_btnDelActionPerformed

    form.btnFind.onActionPerformed = function(evt) {//GEN-FIRST:event_btnFindActionPerformed
        form.grdUsers.findSomething();
    };//GEN-LAST:event_btnFindActionPerformed
    
    self.show = function() {
        form.show();
    };
}
