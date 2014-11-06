/**
 * 
 * @author Work
 * @public
 * @module 
 */
function ClientPublicModule() {
    var self = this, model = this.model;
    var BM = Session.get("BillModule");
    var CSM = Session.get("ClientServerModule");
    
    self.CreateUserWithBonuses = function (aPhone, anEmail, aFirstName, aMiddleName, aLastName, aBirthday, anAddress, anUserName){
        if (aPhone && anEmail){
            var account = CSM.createUser(aPhone, anEmail, aFirstName, aMiddleName, aLastName, aBirthday, anAddress, anUserName, 1);
            if(account){
                BM.addBillOperation(account, BM.OPERATION_ADD_BONUS, 100);
            }
        }
    };
}
