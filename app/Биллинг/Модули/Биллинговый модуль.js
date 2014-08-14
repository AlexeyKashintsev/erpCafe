/**
 * 
 * @author minya92
 * @module
 * @public
 */ 
function BillModule() {
    var self = this, model = this.model;
    var eventProcessor = new ServerModule("EventProcessor");
    
    self.OPERATION_ADD_CASH = 1; //Добавление средств на счет
    self.OPERATION_ADD_BONUS = 2; //Списание средств
    self.OPERATION_DEL_BUY = 3; //Списание средств
    self.OPERATION_DEL_SERVICE = 4; //Списание средств
    self.ACCOUNT_TYPE_DEFAULT = 1; //Основной 
    self.ACCOUNT_TYPE_CREDIT = 2; //Кредитный
    self.OP_STATUS_SUCCESS = 1;
    self.OP_STATUS_FAIL = 2;
    self.OP_STATUS_BILL = 3;
    self.OP_STATUS_PROCESSING = 4;
    self.ERROR_LOST_MONEY = false;
    /*
     * Создает новый биллинговый аккаунт и возвращает его ID
     * @param {type} aFrancId
     * @param {type} aType
     * @param {type} aSum
     * @returns {@this;@pro;model.qBillAccount.cursor.bill_accounts_id}
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
    /*
     * Удаление лицеовго счета
     * @param {type} anAccountId
     * @returns {undefined}
     */
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
     * aStatus - статус операции (успешно, провалено, выставлен счет, в обработке)
     */
    self.addBillOperation = function(anAccountId, anOperationType, aSum, aStatus){
        self.ERROR_LOST_MONEY = false;
        var obj = {
            account_id : anAccountId,
            operation_sum: aSum,
            operation_date: new Date(),
            operation_type: anOperationType,
            operation_status: aStatus,
            //user_name_perfomed: units.userSession.getUserName()
            user_name_perfomed: self.principal.name
        };
        var multiplier;
        switch (anOperationType){
            case self.OPERATION_ADD_CASH: multiplier = 1.0; break;
            case self.OPERATION_ADD_BONUS: multiplier = 1.0; break;
            case self.OPERATION_DEL_BUY: multiplier = -1.0; break;
            case self.OPERATION_DEL_SERVICE: multiplier = -1.0; break;
        }
        if((multiplier === -1) && (aStatus === self.OP_STATUS_SUCCESS)){
            model.params.account_id = anAccountId;
            model.qBillAccount.requery(function(){
                if(model.qBillAccount.cursor.currnt_sum < aSum){
                    self.ERROR_LOST_MONEY = true;
                } 
            });  
        } 
        if(self.ERROR_LOST_MONEY){
            Logger.info('Недостаточно средств на счету');
            eventProcessor.addEvent('errorLostMoney',obj);
            return false;
        } else {
            model.qBillOperationsList.push(obj);
            if(aStatus === self.OP_STATUS_SUCCESS){
                model.params.account_id = anAccountId;
                model.qBillAccount.requery(function(){
                    model.qBillAccount.cursor.currnt_sum = model.qBillAccount.cursor.currnt_sum + aSum * multiplier; 
                });    
            }
            model.save();
            eventProcessor.addEvent('addBillOperation', obj);
            return model.qBillOperationsList.cursor.bill_operations_id;    
        }
    };
    
    self.setStatusBillOperation= function(anOperationId, aStatus){
        model.params.operation_id = anOperationId;
        model.qBillOperationsList.requery(function(){
            if(model.qBillOperationsList.length > 0){
                model.qBillOperationsList.cursor.operation_status = aStatus;
                model.save();
                eventProcessor.addEvent('setStatusBillOperation', {
                    operation_id: model.qBillOperationsList.cursor.bill_operations_id,
                    status: aStatus,
                    set_date: new Date()
                });
                return true;
            } else {
                eventProcessor.addEvent('errorSetStatusBillOperation', {
                    operation_id: model.qBillOperationsList.cursor.bill_operations_id,
                    status: aStatus,
                    set_date: new Date()
                });
                return false;
            }
        });
    };
    
    /*
     * Добавление услуги на лицевой счет 
     */
    self.AddService = function(anAccountId, aServiceId){
        var obj ={
            account_id: anAccountId,
            service_id: aServiceId
        };
        model.qAddService.push(obj);
        model.save();
    };
    /*
     * Создание новой услуги
     */
    self.CreateService = function(aName, aDays, aSum){
        var obj = {
            service_name: aName,
            service_days: aDays,
            sevice_sum:   aSum
        };
        model.qServiceList.push(obj);
        model.save();
        eventProcessor.addEvent('serviceCreated',obj);
        return true;
    };
}
