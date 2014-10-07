/**
 * 
 * @author minya92
 * @module
 * @public
 */
function BillModule() {
    var self = this, model = this.model;
    var eventProcessor = new EventProcessor();
    var session = Modules.get("UserSession");
    var sender = new MessageSender();
    
    // Типы операций
    self.OPERATION_ADD_CASH     = 1; //Добавление средств на счет
    self.OPERATION_ADD_BONUS    = 2; //
    self.OPERATION_DEL_BUY      = 3; //Списание средств
    self.OPERATION_DEL_SERVICE  = 4; //
    // Типы аккаунтов
    self.ACCOUNT_TYPE_DEFAULT   = 1; //Основной 
    self.ACCOUNT_TYPE_CREDIT    = 2; //Кредитный
    self.ACCOUNT_TYPE_CLIENT    = 3; //Клиентский
    //Статусы операций
    self.OP_STATUS_SUCCESS      = 1;
    self.OP_STATUS_FAIL         = 2;
    self.OP_STATUS_BILL         = 3;
    self.OP_STATUS_PROCESSING   = 4;    //Заказ в обработке
    self.OP_STATUS_CREATE       = 5;    //Создан
    self.OP_STATUS_CREATE_AUTO  = 6;    //Создан автоматически
    self.OP_STATUS_PAID         = 7;    //Оплачен
    self.OP_STATUS_SEND         = 8;    //Товар Отправлен
    self.OP_STATUS_RECIVED      = 9;   //Товар получен 
    
    self.getSelfPropertyValue = function(aPropertyName) {
        return self[aPropertyName];
    };
    
    var ERRORS = {
        FIND_ACCOUNT_ID: "Аккаунт с таким ID не найден",
        FIND_SERVICE_ID: "Услуга с таким ID не найдена",
        LOST_MONEY: "Недостаточно средств на счету",
        INVALID_OP_ID: "Неверный ID операции",
        SERVICE_ADDED: "Услуга уже добавлена на лицевой счет",
        SERVICE_LOCKED: "Ошибка удаления услуги с аккаунта. Услуга заблокирована для удаления!"
    };
    
    /*
     * Проверка суммы на лицевом счете
     * @param {type} anAccountId
     * @param {type} aSum
     * @returns: false - сумма есть; true - недостаточно средств
     */
    function checkMoneyOnAccount(anAccountId, aSum){
        var sum = self.getSumFromAccountId(anAccountId);
        if(sum >= aSum) return false;
        else return true;
    }
    
    /*
     * Создает новый биллинговый аккаунт и возвращает его ID
     * @param {type} aFrancId
     * @param {type} aType
     * @param {type} aSum
     * @returns {@this;@pro;model.qBillAccount.cursor.bill_accounts_id}
     */
    self.createBillAccount = function(aType, aUserId) {
        if (!aType)
            aType = self.ACCOUNT_TYPE_DEFAULT;
        model.qBillAccount.push({
            franchazi_id: aUserId,
            account_type: aType,
            currnt_sum: 0,
            active: true
        });
        model.save();
        eventProcessor.addEvent('billCreated', {
            franchazi_id: aUserId,
            account_type: aType
        });
        return model.qBillAccount.cursor.bill_accounts_id;
    };
    /*
     * Получить быстрый баланс счета по ID
     * Использовать ТОЛЬКО для быстрого отображения!!!
     * @param {type} anAccountId
     * @returns {undefined}
     */
    self.getQuickSumFromAccountId = function(anAccountId) {
        model.qBillAccount.params.type = null;
        model.qBillAccount.params.franchazi_id = null;
        model.qBillAccount.params.account_id = anAccountId;
        model.qBillAccount.requery();
        if (model.qBillAccount.length > 0) return model.qBillAccount.cursor.currnt_sum;
        else return false;
    };
     /*
     * Получить баланс счета по ID
     * @param {type} anAccountId
     * @returns {undefined} 
     */
    self.getSumFromAccountId = function(anAccountId) {
        model.qGetAccountBalance.params.account_id = anAccountId;
        model.qBillAccount.params.type = null;
        model.qBillAccount.params.franchazi_id = null;
        model.qBillAccount.params.account_id = anAccountId;
        model.qGetAccountBalance.requery();
        model.qBillAccount.requery();
        if(model.qBillAccount.cursor.currnt_sum != model.qGetAccountBalance.cursor.account_balance){
            eventProcessor.addEvent("accountCurrentSumChanged", {
                account_id: anAccountId,
                old_sum: model.qBillAccount.cursor.currnt_sum,
                new_sum: model.qGetAccountBalance.cursor.account_balance
            });
            model.qBillAccount.cursor.currnt_sum = model.qGetAccountBalance.cursor.account_balance;
            model.save();
        }
        if (model.qGetAccountBalance.length > 0) return model.qGetAccountBalance.cursor.account_balance;
        else return false;
    };
    /*
     * Удаление лицеовго счета
     * @param {type} anAccountId
     * @returns {undefined}
     */
    self.delBillAccount = function(anAccountId) {
        model.qDeleteBillAccount.params.account_id = anAccountId;
        model.qDeleteBillAccount.executeUpdate();
        model.save();
        eventProcessor.addEvent('delBillAccount', anAccountId);
        return true;
    };
    /*
     * Добавление новой опреции по счету
     * anAccountId - Id франчайзе
     * aType - тип операции (списание или пополнение)
     * aSum - сумма денежных средств
     * aStatus - статус операции (успешно, провалено, выставлен счет, в обработке)
     */
    self.addBillOperation = function(anAccountId, anOperationType, aSum, aStatus) {
        if (!aStatus)
            aStatus = self.OP_STATUS_SUCCESS;
        var ERROR_SHORTAGE_MONEY = false;
        var obj = {
            account_id: anAccountId,
            operation_sum: aSum,
            operation_date: new Date(),
            operation_type: anOperationType,
            operation_status: aStatus,
            //user_name_perfomed: session.getUserName()
            user_name_perfomed: self.principal.name
        };
        var multiplier;
        switch (anOperationType) {
            case self.OPERATION_ADD_CASH:
                multiplier = 1.0;
                break;//TODO Есть ли смысл такого разделения?
            case self.OPERATION_ADD_BONUS:
                multiplier = 1.0;
                break;//Относиться к бонусам
            case self.OPERATION_DEL_BUY:
                multiplier = -1.0;
                break;
            case self.OPERATION_DEL_SERVICE:
                multiplier = -1.0;
                break;
        }
        var accountType;
        model.qBillAccount.params.type = null;
        model.qBillAccount.params.franchazi_id = null;
        model.qBillAccount.params.account_id = anAccountId;
        model.qBillAccount.requery();
        accountType = model.qBillAccount.cursor.account_type;
        if ((multiplier === -1) && (aStatus === self.OP_STATUS_SUCCESS || aStatus === self.OP_STATUS_PAID) && (anOperationType != self.OPERATION_DEL_SERVICE) && (accountType != self.ACCOUNT_TYPE_CREDIT)) {
            ERROR_SHORTAGE_MONEY = checkMoneyOnAccount(anAccountId, aSum);
        }
        if (ERROR_SHORTAGE_MONEY) {
            Logger.info(ERRORS.LOST_MONEY);
            eventProcessor.addEvent('errorLostMoney', obj);
            return false;
        } else {
            model.qBillOperationsList.push(obj);
            if (aStatus === self.OP_STATUS_SUCCESS) {
                model.qBillAccount.params.type = null;
                model.qBillAccount.params.franchazi_id = null;
                model.qBillAccount.params.account_id = anAccountId;
                model.qBillAccount.requery();
                if (model.qBillAccount.length > 0)
                    model.qBillAccount.cursor.currnt_sum = model.qBillAccount.cursor.currnt_sum + aSum * multiplier;
            }
            model.save();
            eventProcessor.addEvent('addBillOperation', obj);
            return model.qBillOperationsList.cursor.bill_operations_id;
        }
    };
    /*
     * Добавление товаров на счет
     * @param {type} anOpId
     * @param {type} anItems
     * @returns {undefined}
     */
    self.addItemsOnOperation = function(anOpId, anItems) {
        model.params.operation_id = anOpId;
        model.qBillOperationsList.requery(function() {});
        if (model.qBillOperationsList.length > 0) {
            for (var id in anItems) {
                model.qItemBillCost.params.item_id = anItems[id].item_id;
                model.qItemBillCost.requery(function() {
                    model.qAddItemsOnOperation.push({
                        operation_id: model.qBillOperationsList.cursor.bill_operations_id,
                        cost_id: model.qItemBillCost.cursor.bill_item_cost_id
                    });
                });
            }
            model.save();
        }
    };
    /*
     * Изменение статуса операции
     * @param {type} anOperationId
     * @param {type} aStatus
     * @returns {undefined}
     */
    self.setStatusBillOperation = function(anOperationId, aStatus) {
        var ERROR_SHORTAGE_MONEY = false;
        model.params.operation_id = anOperationId;
        model.qBillOperationsList.requery(function() {});
        if (model.qBillOperationsList.length > 0) {
            if (aStatus == self.OP_STATUS_SUCCESS) {
                model.qBillAccount.params.type = null;
                model.qBillAccount.params.franchazi_id = null;
                model.qBillAccount.params.account_id = model.qBillOperationsList.cursor.account_id;
                model.qBillAccount.requery(function() {
                    ERROR_SHORTAGE_MONEY = checkMoneyOnAccount(model.qBillOperationsList.cursor.account_id, model.qBillOperationsList.cursor.operation_sum);
                    if(!ERROR_SHORTAGE_MONEY)
                        model.qBillAccount.cursor.currnt_sum = model.qBillAccount.cursor.currnt_sum + model.qBillOperationsList.cursor.operation_sum * model.qBillOperationsList.cursor.multiplier;
                }); 
            }
            if (!self.ERROR_SHORTAGE_MONEY) {
                model.qBillOperationsList.cursor.operation_status = aStatus;
                model.save();
                self.getSumFromAccountId(model.qBillOperationsList.cursor.account_id);
                eventProcessor.addEvent('setStatusBillOperation', {
                    operation_id: model.qBillOperationsList.cursor.bill_operations_id,
                    status: aStatus
                });
                return true;
            } else {
                return addErrorToLogger('errorSetStatusBillOperation', {
                    operation_id: model.qBillOperationsList.cursor.bill_operations_id,
                    status: aStatus
                }, ERRORS.LOST_MONEY);
            }
        } else {
            return addErrorToLogger('errorSetStatusBillOperation', {
                    operation_id: model.qBillOperationsList.cursor.bill_operations_id,
                    status: aStatus
                }, ERRORS.INVALID_OP_ID);
        }
    };
    
    
    /*
     * 
     */
    self.getBillAccount = function(aFranId){
        model.qBillAccount.params.type = null;
        model.qBillAccount.params.account_id = null;
        model.qBillAccount.params.franchazi_id = aFranId;
        model.qBillAccount.requery();
        return model.qBillAccount.cursor.bill_accounts_id;
    };
    
    /*
     * TODO Описать подробнее что эта чтука делает, Здесь она точно нужна?
     * @param {type} aTradeOperation
     * @param {type} aBillOperation
     * @returns {undefined}
     */
    function connectBillAndTradeOperation(aTradeOperation, aBillOperation){
        model.qConnectTradeAndBillOperations.push({
            trade_cashbox_operation: aTradeOperation,
            bill_operation: aBillOperation
        });
    }
    /*
     * Добавление денег франчайзе за попукупку бонусами
     * @param {type} aSum
     * @param {type} aType
     * @param {type} aFranchaziId
     * @returns {@this;@pro;model.qBillOperationsList.cursor.bill_operations_id|Boolean}
     */
    self.addCashToFranchazi = function(aSum, aType, aFranchaziId){
        var franchaziId = aFranchaziId ? aFranchaziId : session.getFranchazi();
        model.qBillAccount.params.account_id = null;
        model.qBillAccount.params.franchazi_id = franchaziId;
        model.qBillAccount.params.type = self.ACCOUNT_TYPE_DEFAULT;
        model.qBillAccount.requery();
        if(model.qBillAccount.length > 0){
            var accountId = model.qBillAccount.cursor.bill_accounts_id;
            if (aType === "bonus"){
                var multiplier = 0.05;
                return self.addBillOperation(accountId, self.OPERATION_ADD_CASH, aSum * multiplier);
            }
            if (aType === "money")
                return self.addBillOperation(accountId, self.OPERATION_ADD_CASH, aSum);
        } else 
            return false;
    };
    
    /*
     * Проведение бонусной операции и начаисление денег на счет франчайзе
     */
    self.bonusOperation = function(aClient, aBonusOperation, aCount, aTradeOperationId) {
        // Если идет списание средст с бонусного счета клиента, то начислить деньги на счет франчази
        if (aBonusOperation === self.OPERATION_DEL_BUY) {
            var BillOperation = self.addCashToFranchazi(aCount, "bonus");
            connectBillAndTradeOperation(aTradeOperationId, BillOperation);
        }
         // Проведение бонусной операции со счетом клиента
        var BillOperation = self.addBillOperation(aClient.bonusBill, aBonusOperation, aCount);
        connectBillAndTradeOperation(aTradeOperationId, BillOperation);
        if (aBonusOperation === self.OPERATION_ADD_BONUS){
            sender.sendMessage(sender.BONUS_ADD, {
                username:   aClient.firstName,
                count   :   aCount,
                phone   :   aClient.phone,
                email   :   aClient.email,
                subject :   "Информационное сообщение сети кафе ERP"
            });
        }else if (aBonusOperation === self.OPERATION_DEL_BUY){
            sender.sendMessage(sender.BONUS_REMOVE, {
                username:   aClient.firstName,
                count   :   aCount,
                phone   :   aClient.phone,
                email   :   aClient.email,
                subject :   "Информационное сообщение сети кафе ERP"
            });
        }
        model.save();
    };
}
