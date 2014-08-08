/**
 * 
 * @author stipjey
 * @module
 */ 
function UserModule() {
    var self = this, model = this.model;
    
    self.createUser = function(aLogin, passMD5, role_form, aRoleName, aEmail, aPhone){
        model.usersByName.insert();
        model.usersByName.usr_name = aLogin;
        model.usersByName.usr_passwd = passMD5;
        model.usersByName.usr_form = role_form;
        model.usersByName.usr_email = aEmail;
        model.usersByName.usr_phone = aPhone;
        model.save();
        addRole(aLogin, aRoleName);
    };
    
    function addRole(aUserName, aRoleName){
        model.qUserAddRole.params.usr_name = aUserName;
        model.qUserAddRole.params.usr_role = aRoleName;
        model.qUserAddRole.executeUpdate();
    }
    
    self.setPassword = function(aUserName, aNewPasswordMD5) {
        
    };
    
    self.checkLogin = function(aLogin) {
        model.params.user_name = aLogin;
        if (model.usersByName.find(model.usersByName.schema.usr_name, aLogin).length > 0){
            return true;
        } else return false;
    };
}
