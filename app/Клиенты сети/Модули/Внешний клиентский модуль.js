/**
 * 
 * @author Work
 * @public
 * @module 
 */
function ClientPublicModule() {
    var self = this, model = this.model;
    var BM = Session.getModule("BillModule");
    var CSM = Session.getModule("ClientServerModule");
    
    self.CreateUserWithBonuses = function (){
        var post = self.http.request.params;
        if (post.phone && post.first_name){
            var account = CSM.createUser(post.phone, post.email, post.first_name, post.middle_name, post.last_name, post.birthday, post.address, post.username, 1);
            if(account){
                BM.addBillOperation(account, BM.OPERATION_ADD_BONUS, 70);
            }
        }
    };
}
