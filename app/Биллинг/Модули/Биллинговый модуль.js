/**
 * 
 * @author minya92
 * @module
 * @public
 */ 
function BillModule() {
    var self = this, model = this.model;
    
    self.OPERATION_ADD = 1; //Добавление средств на счет
    self.OPERATION_DEL = 2; //Списание средств
    self.TYPE_DEFAULT = 1; //Основной 
    self.TYPE_CREDIT = 2; //Кредитный
    self.STATUS_SUCCESS = 1;
    self.STATUS_FAIL = 2;
    self.STATUS_PRICE = 3;
    self.STATUS_LOADING = 4;
    
    /*
     * Создает новый биллинговый аккаунт и возвращает его ID
     */
    self.createBillAccount = function(aFrancId,aType,aSum){
//        if(!aType) aType = self.TYPE_DEFAULT;
//        if(!aSum) aSum = 0;
        model.qAddBillAccount.insert(
                model.qAddBillAccount.schema.franchazi_id, aFrancId,
                model.qAddBillAccount.schema.account_type, aType,
                model.qAddBillAccount.schema.currnt_sum, aSum
        );
        model.save();
        return model.qAddBillAccount.cursor.bill_accounts_id;
       // Logger.info('Аккаунт для франчайзе уже существует'); 
    };
    
    /*
     * Добавление новой опреции по счету
     * anAccountId - Id франчайзе
     * aType - тип операции (списание или пополнение)
     * aSum - сумма денежных средств
     */
    self.addBillOperation = function(anAccountId, anOperationType, aSum, aStatus){
        model.qAddBillOperations.push({
            account_id : anAccountId,
            operation_sum: aSum,
            operation_date: new Date(),
            operation_type: anOperationType,
            operation_status: aStatus
        });
        if(aStatus == 1){
            model.params.account_id = anAccountId;
            model.qAddBillAccount.requery();
            model.qAddBillAccount.cursor.currnt_sum = model.qAddBillAccount.cursor.currnt_sum + aSum * 1.0; 
        }
        model.save();
        return model.qAddBillOperations.cursor.bill_operations_id;
    };
    
    self.listBillAccounts = function(aFranchaziId, aType){
        model.params.franchazi_id = aFranchaziId;
        model.params.account_type = aType;
        model.qAddBillAccount.requery();
        
    };
    
//    self.confirmOperation = function(aFrancId, aOpId){
//        var accountId = addBillAccount(aFrancId);
//        model.params.account_id = accountId;
//    };
}
