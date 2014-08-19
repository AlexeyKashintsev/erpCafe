/**
 * 
 * @author minya92
 * @module
 * @public
 */ 
function BillModule() {
    var self = this, model = this.model;
    var eventProcessor = new ServerModule("EventProcessor");
    
    self.ERROR_LOST_MONEY = false;
    // Типы операций
    self.OPERATION_ADD_CASH = 1; //Добавление средств на счет
    self.OPERATION_ADD_BONUS = 2; //
    self.OPERATION_DEL_BUY = 3; //Списание средств
    self.OPERATION_DEL_SERVICE = 4; //
    // Типы аккаунтов
    self.ACCOUNT_TYPE_DEFAULT = 1; //Основной 
    self.ACCOUNT_TYPE_CREDIT = 2; //Кредитный
    self.ACCOUNT_TYPE_CLIENT = 3; //Клиентский
    //Статусы операций
    self.OP_STATUS_SUCCESS = 1;
    self.OP_STATUS_FAIL = 2;
    self.OP_STATUS_BILL = 3;
    self.OP_STATUS_PROCESSING = 4;
    
    var ERRORS ={
        FIND_ACCOUNT_ID: "Аккаунт с таким ID не найден",
        FIND_SERVICE_ID: "Услуга с таким ID не найдена",
        LOST_MONEY:      "Недостаточно средств на счету",
        INVALID_OP_ID:   "Неверный ID операции"
    };
    
    /*
     * Создает новый биллинговый аккаунт и возвращает его ID
     * @param {type} aFrancId
     * @param {type} aType
     * @param {type} aSum
     * @returns {@this;@pro;model.qBillAccount.cursor.bill_accounts_id}
     */
    self.createBillAccount = function(aUserId,aType,aSum){
        if(!aType) aType = self.ACCOUNT_TYPE_DEFAULT;
        model.qBillAccount.push({
                user_id: aUserId,
                account_type: aType,
                currnt_sum: 0,
                active: true
        });
        model.save();
        if(aSum)
            self.addBillOperation(model.qBillAccount.cursor.bill_accounts_id, self.OPERATION_ADD_CASH, aSum, self.OP_STATUS_SUCCESS);
        eventProcessor.addEvent('billCreated', {
                user_id: aUserId,
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
        if(!aStatus) aStatus = self.OP_STATUS_SUCCESS;
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
        if((multiplier === -1) && (aStatus === self.OP_STATUS_SUCCESS) && (anOperationType != self.OPERATION_DEL_SERVICE)){
            model.params.account_id = anAccountId;
            model.qBillAccount.requery(function(){
                if(model.qBillAccount.cursor.currnt_sum < aSum){
                    self.ERROR_LOST_MONEY = true;
                } 
            });  
        } 
        if(self.ERROR_LOST_MONEY){
            Logger.info(ERRORS.LOST_MONEY);
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
    /*
     * Изменение статуса операции
     * @param {type} anOperationId
     * @param {type} aStatus
     * @returns {undefined}
     */
    self.setStatusBillOperation= function(anOperationId, aStatus){
        self.ERROR_LOST_MONEY = false;
        model.params.operation_id = anOperationId;
        model.qBillOperationsList.requery(function(){
            if(model.qBillOperationsList.length > 0){
                if(aStatus == self.OP_STATUS_SUCCESS){
                    model.params.account_id = model.qBillOperationsList.cursor.account_id;
                    model.qBillAccount.requery(function(){
                        if(model.qBillAccount.cursor.currnt_sum >= model.qBillOperationsList.cursor.operation_sum){
                            model.qBillAccount.cursor.currnt_sum = model.qBillAccount.cursor.currnt_sum + model.qBillOperationsList.cursor.operation_sum * model.qBillOperationsList.cursor.multiplier;
                        } else {
                            self.ERROR_LOST_MONEY = true;
                        }
                    });
                }
                if(!self.ERROR_LOST_MONEY){
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
                        set_date: new Date(),
                        comment: ERRORS.LOST_MONEY
                    });
                    return false;
                }  
            } else {
                eventProcessor.addEvent('errorSetStatusBillOperation', {
                    operation_id: model.qBillOperationsList.cursor.bill_operations_id,
                    status: aStatus,
                    set_date: new Date(),
                    comment: ERRORS.INVALID_OP_ID
                });
                return false;
            }
        });
    };
    
    /*
     * Добавление услуги на лицевой счет 
     */
    self.AddService = function(anAccountId, aServiceId){
        model.params.service_id = aServiceId;
        model.params.account_id = anAccountId;
        model.requery(function(){
            if(model.qServiceList.length > 0){
                if(model.qBillAccount.length > 0){
                    if(model.qBillAccount.cursor.currnt_sum >=model.qServiceList.cursor.service_sum){
                        var payDate = new Date();
                        self.addBillOperation(anAccountId, self.OPERATION_DEL_SERVICE, model.qServiceList.cursor.service_sum);
                        if(model.qServiceList.cursor.service_month){
                            payDate.setMonth(payDate.getMonth()+1);
                        }else{
                            payDate.setDate(payDate.getDate() + model.qServiceList.cursor.service_days);
                        }
                        var obj ={
                            account_id: anAccountId,
                            service_id: aServiceId,
                            payment_date: payDate
                        };
                        model.qAddService.push(obj);
                        model.save();
                        eventProcessor.addEvent('addServiceOnAccount',obj);
                        return true;
                    } else {
                        Logger.info(ERRORS.LOST_MONEY);
                        eventProcessor.addEvent('errorAddServiceOnAccount',{
                            account_id: anAccountId,
                            service_id: aServiceId,
                            error: ERRORS.LOST_MONEY
                        });
                        return false;
                    }  
                } else {
                    Logger.info(ERRORS.FIND_ACCOUNT_ID);
                    eventProcessor.addEvent('errorAddServiceOnAccount',{
                        account_id: anAccountId,
                        service_id: aServiceId,
                        error: ERRORS.FIND_ACCOUNT_ID
                    });
                    return false;
                } 
            } else {
                Logger.info(ERRORS.FIND_SERVICE_ID);
                eventProcessor.addEvent('errorAddServiceOnAccount',{
                        account_id: anAccountId,
                        service_id: aServiceId,
                        error: ERRORS.FIND_SERVICE_ID
                    });
                return false;
            }
        });
    };
    /*
     * Удаление услуги с лицевого счета
     * @param {type} anAccountId
     * @param {type} aServiceId
     * @returns {undefined}
     */
    self.delServiceFromAccount = function(anAccountId, aServiceId){
        model.params.service_id = aServiceId;
        model.params.account_id = anAccountId;
        model.requery(function(){
            if(model.qServiceList.length > 0){
                if(model.qBillAccount.length > 0){
                    model.qDelServiceFromAccount.params.account_id = anAccountId;
                    model.qDelServiceFromAccount.params.service_id = aServiceId;
                    model.qDelServiceFromAccount.executeUpdate();
                    model.save();
                    eventProcessor.addEvent('delServiceFromAccount', {
                        account_id: anAccountId,
                        service_id: aServiceId
                    });
                    return true;
                } else {
                    Logger.info(ERRORS.FIND_ACCOUNT_ID);
                    eventProcessor.addEvent('errorDelServiceFromAccount',{
                        account_id: anAccountId,
                        service_id: aServiceId,
                        error: ERRORS.FIND_ACCOUNT_ID
                    });
                    return false;
                }
            } else {
                Logger.info(ERRORS.FIND_SERVICE_ID);
                eventProcessor.addEvent('errorDelServiceFromAccount',{
                        account_id: anAccountId,
                        service_id: aServiceId,
                        error: ERRORS.FIND_SERVICE_ID
                 });
                return false;
            }    
        });
    };
    
    /*
     * Создание новой услуги
     * aDays - промежуток дней для снятия абонентской платы
     * aDays (null) - ежемесячное списание абонентской платы
     */
    self.CreateService = function(aName, aSum, aDays){
        var aMonth = false;
        if(aDays == false || aDays == 0 || aDays == null || aDays === undefined) aMonth = true;
        var obj = {
            service_name: aName,
            service_days: aDays,
            service_sum:   aSum,
            service_month: aMonth
        };
        model.qServiceList.push(obj);
        model.save();
        eventProcessor.addEvent('serviceCreated',obj);
        return true;
    };
    
    /*
     * Удаление услуги
     */
    self.delService = function(aServiceId){
        model.params.service_id = aServiceId;
        model.qServiceList.requery(function (){
            if(model.qServiceList.length > 0){
                 model.qDelService.params.service_id = aServiceId;
                 model.qDelService.executeUpdate();
                 model.save();
                 eventProcessor.addEvent('delService', {
                     service_id: aServiceId
                 });
                 return true;
            } else {
                 eventProcessor.addEvent('errorDelService',{
                     service_id: aServiceId,
                     error: ERRORS.FIND_SERVICE_ID
                 });
                 return false;
            }
        });
    };
    //TODO Включить журнал, создать запрос
    self.editService = function(aServiceId, aName, aSum, aDays){
        var aMonth = false;
        if(aDays == false || aDays == 0 || aDays == null || aDays === undefined) aMonth = true;
        model.params.service_id = aServiceId;
        if(model.qServiceList.length > 0){
            model.qServiceList.cursor.service_name = aName;
            model.qServiceList.cursor.service_sum = aSum;
            model.qServiceList.cursor.service_days = aDays;
            model.qServiceList.cursor.service_month = aMonth;
            model.save();
        }
    };
}
