/**
 * 
 * @author Work
 * @public
 * @module 
 */
function ClientPublicModule() {
    var self = this, model = this.model;
    var CSM = new ClientServerModule();
    var BM = new BillModule();
    
    self.CreateUser = function (aPhone, anEmail, aFirstName, aMiddleName, aLastName, aBirthday, anAddress, anUserName){
        if (aPhone && anEmail){
            var account = CSM.createUser(aPhone, anEmail, aFirstName, aMiddleName, aLastName, aBirthday, anAddress, anUserName, 1);
            if(account){
                BM.addBillOperation(account, BM.OPERATION_ADD_BONUS, 100);
            }
        }
    };
}
