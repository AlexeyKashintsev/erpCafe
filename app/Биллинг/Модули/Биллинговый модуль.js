/**
 * 
 * @author minya92
 * @module
 */ 
function billModule() {
    var self = this, model = this.model;

    /*
     * Создает новый биллинговый аккаунт и возвращает его ID
     */
    self.addBillAccount = function(aFrancId){
        model.params.franchazi_id = aFrancId;
        model.qAddBillAccount.requery();
        if(model.qAddBillAccount.length == 0){
            model.qAddBillAccount.insert(
                    model.qAddBillAccount.schema.franchazi_id, aFrancId,
                    model.qAddBillAccount.schema.account_type, 1,
                    model.qAddBillAccount.schema.currnt_sum, 0
            );
            model.save();
            return model.qAddBillAccount.cursor.bill_accounts_id;
        } else {
            return model.qAddBillAccount.cursor.bill_accounts_id;
        }
    };
    
    self.billOperation = function(){
        
    };
}
