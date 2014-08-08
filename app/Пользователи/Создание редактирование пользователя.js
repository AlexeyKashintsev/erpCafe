/**
 * 
 * @author mike
 * @rolesAllowed admin franchazi
 */
function UserCreateAndEditForm() {
    var self = this, model = this.model, form = this;
    var adminFunctions = new ServerModule("AdminFunctions");
    var changePassView = new ChangePassView();
    var userModule = new UserModule();
    var userNew = false;
    var validateLogin = false;
    var validatePass = false;
    
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
   

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        if (userNew) { //Если создан новый пользователь...
            if (form.rbAdmin.selected){
               var roleName = "franchazi";
            } else {
               roleName = "barista";     
            }
            
            model.params.role_name = roleName;
            userModule.createUser(form.tfLogin.text, adminFunctions.MD5(form.tfPass.text), 
                                  model.queryRoles.cursor.role_form, roleName, 
                                  form.tfEmail.text, form.tfPhone.text);

            model.createFrancizerUser.franchazi_id = model.params.franchazi_id;
            model.createFrancizerUser.user_name = form.tfLogin.text;
            model.createFrancizerUser.franc_users_active = true;
            
            model.save(function(){
                form.close(true);
            });
        } else {
            if(form.rbEnable.selected)
                model.createFrancizerUser.cursor.franc_users_active = true;
            else 
                model.createFrancizerUser.cursor.franc_users_active = false;
            userModule.editUser(form.tfLogin.text, form.tfEmail.text, form.tfPhone.text);
            model.save(function(){form.close(true);});                
        }
    }//GEN-LAST:event_btnSaveActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(model.params.user_name){
            userNew = false; //говорим что это не новый пользователь
            form.tfLogin.enabled = false;
            form.panelBarist.visible = false;
            form.tfLogin.text = model.usersByName.cursor.usr_name;
            form.tfPass.text = "********";
            form.tfEmail.text = model.usersByName.cursor.usr_email;
            form.tfPhone.text = model.usersByName.cursor.usr_phone;
            if(!model.createFrancizerUser.cursor.franc_users_active)
                form.rbDisable.selected = true; 
            else  form.rbEnable.selected = true; 
        } else {
            //очищаем поля и разрешаем редактировать
            userNew = true; //Говорим что создаем нового пользователя
            form.tfLogin.text = "";
            form.tfLogin.enabled = true;
            form.tfPass.text = "";
            form.tfPass.enabled = true;           
            form.btnSave.enabled = true;
            model.createFrancizerUser.insert();
        }
    }//GEN-LAST:event_formWindowOpened

    function formWindowClosed(evt) {//GEN-FIRST:event_formWindowClosed
        model.requery();
    }//GEN-LAST:event_formWindowClosed

    function tfPassMouseClicked(evt) {//GEN-FIRST:event_tfPassMouseClicked
        
        if(model.params.user_name && !form.tfLogin.enabled){
            changePassView.setUserName(model.params.user_name);
            changePassView.showModal(function(){
                model.requery();
            });
        }
    }//GEN-LAST:event_tfPassMouseClicked

    function ValidateForm(){
        if(validateLogin && validatePass){
            ChangeStateElements(true);
        } else ChangeStateElements(false);
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
        if(userModule.checkLogin(form.tfLogin.text)){
                form.lbInfo.text = "Логин уже занят!";
                form.lbInfo.foreground = Color.RED;
                model.params.user_name = null;
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

    function tfLoginKeyPressed(evt) {//GEN-FIRST:event_tfLoginKeyPressed
//        TODO Асинхронный код
//        
//        userModule.checkLogin(form.tfLogin.text, function(aResult){
//            if(!aResult){
//                form.lbInfo.text = "Логин уже занят!";
//                form.lbInfo.foreground = Color.RED;
//                model.params.user_name = null;
//                validateLogin = false;
//            } else {
//                form.lbInfo.text = "Логин свободен!";
//                form.lbInfo.foreground = new Color("#2F7F39");
//                validateLogin = true;
//            }
//            ValidateForm();            
//        });
    }//GEN-LAST:event_tfLoginKeyPressed

    function tfEmailFocusLost(evt) {//GEN-FIRST:event_tfEmailFocusLost
        // TODO Добавьте свой код:
    }//GEN-LAST:event_tfEmailFocusLost

    function tfEmailKeyPressed(evt) {//GEN-FIRST:event_tfEmailKeyPressed
        // TODO Добавьте свой код:
    }//GEN-LAST:event_tfEmailKeyPressed

    function tfPhoneFocusLost(evt) {//GEN-FIRST:event_tfPhoneFocusLost
        // TODO Добавьте свой код:
    }//GEN-LAST:event_tfPhoneFocusLost

    function tfPhoneKeyPressed(evt) {//GEN-FIRST:event_tfPhoneKeyPressed
        // TODO Добавьте свой код:
    }//GEN-LAST:event_tfPhoneKeyPressed
}
