/**
 * 
 * @author stipjey
 * @module
 */ 
function UserModule() {
    var self = this, model = this.model;
    
    self.SaveUser = function(login, pass, role){
        model.usersByName.usr_name = login;
        model.usersByName.usr_passwd = adminFunctions.MD5(pass);
        model.usersByName.usr_form = role;
    }
    
    self.AddRole = function(role){
        model.qUserAddRole.params.usr_name = model.usersByName.usr_name;
        model.qUserAddRole.params.usr_role = role;
        model.qUserAddRole.executeUpdate();
    }
}
