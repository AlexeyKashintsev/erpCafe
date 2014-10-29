/**
 * 
 * @author Work
 * @public
 * @module 
 */
function ClientPublicModule() {
    var self = this, model = this.model;
    var CSM = new ClientServerModule();
    
    function CreateUser(aPhone, anEmail, aFirstName, aMiddleName, aLastName, aBirthday, anAddress, anUserName){
        if (aPhone && anEmail){
            CSM.createUser(aPhone, anEmail, aFirstName, aMiddleName, aLastName, aBirthday, anAddress, anUserName, 1);
        }
    }
}
