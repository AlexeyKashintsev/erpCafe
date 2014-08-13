/**
 * 
 * @author minya92
 * @module
 * @public
 */ 
function BillModule() {
    var self = this, model = this.model;
    var eventProcessor = new ServerModule("EventProcessor");
    
    self.OPERATION_ADD = 1; //Добавление средств на счет
    self.OPERATION_DEL = 2; //Списание средств
    self.ACCOUNT_TYPE_DEFAULT = 1; //Основной 
    self.ACCOUNT_TYPE_CREDIT = 2; //Кредитный
    self.OP_STATUS_SUCCESS = 1;
    self.OP_STATUS_FAIL = 2;
    self.OP_STATUS_PRICE = 3;
    self.OP_STATUS_LOADING = 4;
    
    /*
     * Создает новый биллинговый аккаунт и возвращает его ID
     */
    self.createBillAccount = function(aFrancId,aType,aSum){
        if(!aType) aType = self.ACCOUNT_TYPE_DEFAULT;
        if(!aSum) aSum = 0;
        model.qBillAccount.push({
                franchazi_id: aFrancId,
                account_type: aType,
                currnt_sum: aSum,
                active: true
        });
        model.save();
        eventProcessor.addEvent('billCreated', {
                franchazi_id: aFrancId,
                account_type: aType,
                currnt_sum: aSum
        });
        return model.qBillAccount.cursor.bill_accounts_id;
       // Logger.info('Аккаунт для франчайзе уже существует'); 
    };
    
    self.delBillAccount = function(anAccountId){
        model.params.account_id = anAccountId;
        model.qBillAccount.requery(function(){
            if(model.qBillAccount.length > 0){
                model.qBillAccount.cursor.active = false;
                model.save();
                eventProcessor.addEvent('delBillAccount', anAccountId);
                return true;
            } else {
                eventProcessor.addEvent('errorDelBillAccount', anAccountId);
                return false;
            }
        });
    };
    
    /*
     * Добавление новой опреции по счету
     * anAccountId - Id франчайзе
     * aType - тип операции (списание или пополнение)
     * aSum - сумма денежных средств
     */
    self.addBillOperation = function(anAccountId, anOperationType, aSum, aStatus){
        var obj = {
            account_id : anAccountId,
            operation_sum: aSum,
            operation_date: new Date(),
            operation_type: anOperationType,
            operation_status: aStatus
        };
        if((anOperationType === self.OPERATION_DEL) && (aStatus === self.OP_STATUS_SUCCESS)){
            model.params.account_id = anAccountId;
            model.qBillAccount.requery(function(){
                if(model.qBillAccount.cursor.currnt_sum < aSum){
                    aStatus = self.OP_STATUS_FAIL;
                    Logger.info('Недостаточно средств на счету');
                }
            });  
        } 
        model.qAddBillOperations.push(obj);
        if(aStatus === self.OP_STATUS_SUCCESS){
            var multipler;
            switch (anOperationType){
                case self.OPERATION_ADD: multipler = 1.0; break;
                case self.OPERATION_DEL: multipler = -1.0; break;
            }
            model.params.account_id = anAccountId;
            model.qBillAccount.requery(function(){
                model.qBillAccount.cursor.currnt_sum = model.qBillAccount.cursor.currnt_sum + aSum * multipler; 
            });    
        }
        model.save();
        eventProcessor.addEvent('addBillOperation', obj);
            return model.qAddBillOperations.cursor.bill_operations_id;    
    };
    
    self.AddService = function(anAccountId, aServiceId){
        var obj ={
            account_id: anAccountId,
            service_id: aServiceId
        };
        model.qAddService.push(obj);
        model.save();
    };
    
    self.CreateService = function(aName, aDays, aSum){
        var obj = {
            service_name: aName,
            service_days: aDays,
            sevice_sum:   aSum
        };
        model.qServiceList.push(obj);
        model.save();
        eventProcessor.addEvent('errorDelBillAccount',obj);
        return true;
    };
    
    
}
