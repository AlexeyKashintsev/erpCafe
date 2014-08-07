/**
 * 
 * @author stipjey
 * @module
 */ 
function ClientServerModule() {
    var self = this, model = this.model;
    var adminFunctions = new ServerModule("AdminFunctions");
    
    
    self.AddNewUser = function(login, passwd){
        passmd5 = adminFunctions.MD5(passwd);
        model.qAddNewUser.push({
            usr_name : login,
            usr_passwd : passmd5
        });
    }
}
