/**
 * 
 * @author mike
 */
function createFancUserForm() {
    var self = this, model = this.model, form = this;
    var adminFunctions = new ServerModule("AdminFunctions");
    var changePassView = new ChangePassView();
    
    model.params.franchazi_id = 1;
    model.params.user_name = "test3";
    
    self.setFranchaziId = function(aFranchaziId){
        model.params.franchazi_id = aFranchaziId;
    };
    
    self.setUserName = function(aUserName){
        model.params.user_name = aUserName;
    };

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        var roleName;
        if(form.rbAdmin.selected){
           roleName = "franchazi";
        } else {
           roleName = "barista";     
        }
        model.params.role_name = roleName;

        model.usersByName.cursor.usr_name = form.tfLogin.text;
        model.usersByName.cursor.usr_passwd = adminFunctions.MD5(form.tfPass.text);
        model.usersByName.cursor.usr_roles = roleName;
        model.usersByName.cursor.usr_form = model.queryRoles.cursor.role_form;
        
        model.createFrancizerUser.cursor.franchazi_id = model.params.franchazi_id;
        model.createFrancizerUser.cursor.user_name = form.tfLogin.text;
        if(form.rbEnable.selected)
            model.createFrancizerUser.cursor.franc_users_active = true;
        else 
            model.createFrancizerUser.cursor.franc_users_active = false;
        if(model.save()){
                form.close();
            }     
    }//GEN-LAST:event_btnSaveActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(model.params.user_name){
            form.tfLogin.enabled = false;
            form.panelBarist.visible = false;
            form.tfLogin.text = model.usersByName.cursor.usr_name;
            form.tfPass.text = "********";
            if(!model.createFrancizerUser.cursor.franc_users_active)
                form.rbDisable.selected = true;
        } else {
            form.panelEnabled.visible = false;
            model.usersByName.insert();
            model.createFrancizerUser.insert();
        }
    }//GEN-LAST:event_formWindowOpened

    function formWindowClosed(evt) {//GEN-FIRST:event_formWindowClosed
        model.requery();
    }//GEN-LAST:event_formWindowClosed

    function tfPassMouseClicked(evt) {//GEN-FIRST:event_tfPassMouseClicked
        if(model.params.user_name){
            changePassView.setUserId(model.params.user_name);
            changePassView.showModal(function(){
                model.requery();
            });
        }
    }//GEN-LAST:event_tfPassMouseClicked
}
