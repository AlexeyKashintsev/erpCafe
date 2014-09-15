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

    form.USR_PASSWD.onSelect = function(aEditor) {
        model.save();
        changePassView.setUserId(self.dsMtdUsers.usr_name);
        changePassView.showModal(function(aResult){
            if (aResult) {
                refreshUsers();
                setControlsEnabled();
            }	
        });   
    };

    form.btnReq.onActionPerformed = function(evt) {
       refreshUsers();
       setControlsEnabled();
    };

    form.btnSave.onActionPerformed = function(evt) {
        model.save();
        refreshUsers();
        setControlsEnabled();	
    };

    form.tbSetEdit.onActionPerformed = function(evt) {
        //isEditable = self.tbSetEdit.selected;
        setEdit();
    };

    model.dsMtdUsers.onChanged = function(evt) {
        setControlsEnabled();
    };

    form.btnAdd.onActionPerformed = function(evt) {
        model.dsMtdUsers.insert();
    };

    form.btnDel.onActionPerformed = function(evt) {
        if (confirm("Удалить текущего пользователя")){
            model.dsMtdUsers.usr_passwd = 'false';
            model.save();
            refreshUsers();
        }
    };

    form.btnFind.onActionPerformed = function(evt) {
        form.grdUsers.findSomething();
    };
    
    self.show = function() {
        form.show();
    };
    
    self.getView = function(){
      return form.view;  
    };
}
