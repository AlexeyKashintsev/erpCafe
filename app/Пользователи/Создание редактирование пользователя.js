/**
 * 
 * @author mike
 * @rolesAllowed admin franchazi
 */
function UserCreateAndEditForm() {
    var self = this, model = this.model, form = this;
    var adminFunctions = new ServerModule("AdminFunctions");
    var changePassView = new ChangePassView();
    
    model.params.franchazi_id = null;
    model.params.user_name = "barista";
    
    self.setFranchaziId = function(aFranchaziId){
        model.params.franchazi_id = aFranchaziId;
    };
    
    self.setUserName = function(aUserName){
        model.params.user_name = aUserName;
    };

    /**
    * @rolesAllowed barista
    */   
   function setInputActive(aValue){
        form.tfEmail.enabled = form.tfPhone.enabled = form.tfFIO.enabled = 
            form.tfAdress.enabled = form.tfAdditional.enabled = aValue;
   }

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        if (!model.params.user_name) { //Создан новый пользователь?
            if(form.rbAdmin.selected){
               var roleName = "franchazi";
            } else {
               roleName = "barista";     
            }
            model.params.role_name = roleName;

            model.usersByName.usr_name = form.tfLogin.text;
            model.usersByName.usr_passwd = adminFunctions.MD5(form.tfPass.text);
            model.usersByName.usr_form = model.queryRoles.cursor.role_form;

            model.createFrancizerUser.franchazi_id = model.params.franchazi_id;
            model.createFrancizerUser.user_name = form.tfLogin.text;
            model.createFrancizerUser.franc_users_active = true;
            
            model.save(function(){
                    model.qUserAddRole.params.usr_name = model.usersByName.usr_name;
                    model.qUserAddRole.params.usr_role = roleName;
                    model.qUserAddRole.executeUpdate();
                    form.close();
                });
            } else {
                if(form.rbEnable.selected)
                    model.createFrancizerUser.cursor.franc_users_active = true;
                else 
                    model.createFrancizerUser.cursor.franc_users_active = false;
                model.save(form.close);
            }
    }//GEN-LAST:event_btnSaveActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(model.params.user_name){
            form.tfLogin.enabled = false;
            form.panelBarist.visible = false;
            setInputActive(true);
            form.tfLogin.text = model.usersByName.cursor.usr_name;
            form.tfPass.text = "********";
            if(!model.createFrancizerUser.cursor.franc_users_active)
                form.rbDisable.selected = true;
        } else {
            setInputActive(false);
            form.panelEnabled.visible = false;
            form.btnSave.enabled = false;
            model.usersByName.insert();
            model.createFrancizerUser.insert();
        }
    }//GEN-LAST:event_formWindowOpened

    function formWindowClosed(evt) {//GEN-FIRST:event_formWindowClosed
        model.requery();
    }//GEN-LAST:event_formWindowClosed

    function tfPassMouseClicked(evt) {//GEN-FIRST:event_tfPassMouseClicked
        
        if(model.params.user_name && !form.tfLogin.enabled){
            changePassView.setUserId(model.params.user_name);
            changePassView.showModal(function(){
                model.requery();
            });
        }
    }//GEN-LAST:event_tfPassMouseClicked
    
    var validateLogin = false;
    var validatePass = false;
    
    function ValidateForm(){
        if(validateLogin && validatePass){
            ChangeStateElements(true);
            setInputActive();
            model.requery();
            model.createFrancizerUser.insert();
            model.usersByName.insert();
        }
        else
            ChangeStateElements(false);
    }
    
    function ChangeStateElements(state) {
        form.btnSave.enabled = state;
        form.tfEmail.enabled = state;
        form.tfPhone.enabled = state;
        form.tfFIO.enabled = state;
        form.tfAdress.enabled = state;
        form.tfAdditional.enabled = state;
    }
    
    function tfLoginFocusLost(evt) {//GEN-FIRST:event_tfLoginFocusLost
        model.requery();
        model.params.user_name = form.tfLogin.text;
        if(model.usersByName.cursor){
            form.lbInfo.text = "Логин уже занят!";
            form.lbInfo.foreground = Color.RED;
            model.params.user_name = null;
            //model.requery();
            //model.createFrancizerUser.insert();
            validateLogin = false;
        } else {
            form.lbInfo.text = "Логин свободен!";
            form.lbInfo.foreground = new Color("#2F7F39");
            validateLogin = true;
        }
        ValidateForm();
    }//GEN-LAST:event_tfLoginFocusLost

    function tfPassKeyPressed(evt) {//GEN-FIRST:event_tfPassKeyPressed
        if(form.tfPass.text.length < 5){
            form.lbPass.text = "Пароль меньше 5 символов!";
            form.lbPass.foreground = Color.RED;
            validatePass = false;
        } else {
            form.lbPass.text = "";
            validatePass = true;
        }
        ValidateForm();
    }//GEN-LAST:event_tfPassKeyPressed
    /**
    * @rolesAllowed barista
    */   
    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close();
    }//GEN-LAST:event_btnCancelActionPerformed
}
