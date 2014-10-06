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
            user_id: aUserId,
            account_type: aType,
            currnt_sum: 0,
            active: true
        });
        model.save();
        eventProcessor.addEvent('billCreated', {
            user_id: aUserId,
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
        model.qBillAccount.params.user_id = null;
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
        model.qBillAccount.params.user_id = null;
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
        model.qBillAccount.params.user_id = null;
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
                model.qBillAccount.params.user_id = null;
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
                model.qBillAccount.params.user_id = null;
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
     * Вспомогательная функция для избежания дублирования кода
     * @param {type} aEvent
     * @param {type} aObj
     * @param {type} aError
     * @returns {Boolean}
     */
    function addErrorToLogger(aEvent, aObj, aError) {
        Logger.info(aError);
        eventProcessor.addEvent(aEvent, {
            info: aObj,
            error: aError
        });
        return false;
    }
    /*
     * Добавление услуги на лицевой счет 
     */
    self.AddService = function(anAccountId, aServiceId) {
        model.params.service_id = aServiceId;
        model.qBillAccount.params.type = null;
        model.qBillAccount.params.user_id = null;
        model.qBillAccount.params.account_id = anAccountId;
        model.qAddService.params.account_id = anAccountId;
        model.qAddService.params.service_id = aServiceId;
        model.requery(function() {});
        if (model.qServiceList.length > 0) {
            if (model.qBillAccount.length > 0) {
                if (model.qAddService.length == 0) {
                    if (self.getSumFromAccountId(model.qBillAccount.cursor.bill_accounts_id) >= model.qServiceList.cursor.item_cost) {
                        var payDate = new Date();
                        self.addBillOperation(anAccountId, self.OPERATION_DEL_SERVICE, model.qServiceList.cursor.item_cost);
                        if (model.qServiceList.cursor.service_month) {
                            payDate.setMonth(payDate.getMonth() + 1);
                        } else {
                            payDate.setDate(payDate.getDate() + model.qServiceList.cursor.service_days);
                        }
                        var obj = {
                            account_id: anAccountId,
                            service_cost_id: model.qServiceList.cursor.bill_item_cost_id,
                            payment_date: payDate
                        };
                        model.qAddService.push(obj);
                        model.save();
                        eventProcessor.addEvent('addServiceOnAccount', obj);
                        return true;
                    } else {
                        return addErrorToLogger('errorAddServiceOnAccount', obj, ERRORS.LOST_MONEY);
                    }
                } else {
                    return addErrorToLogger('errorAddServiceOnAccount', obj, ERRORS.SERVICE_ADDED);
                }
            } else {
                return addErrorToLogger('errorAddServiceOnAccount', obj, ERRORS.FIND_ACCOUNT_ID);
            }
        } else {
            return addErrorToLogger('errorAddServiceOnAccount', obj, ERRORS.FIND_SERVICE_ID);
        }
    };
    /*
     * Удаление услуги с лицевого счета
     * @param {type} anAccountId
     * @param {type} aServiceId
     * @returns {undefined}
     */
    self.delServiceFromAccount = function(anAccountId, aServiceId) {
        model.qServiceListByAccount.params.service_id = aServiceId;
        model.qServiceListByAccount.params.account_id = anAccountId;
        model.qServiceListByAccount.requery(function() {});
        if (model.qServiceListByAccount.length > 0) {
            if (!model.qServiceListByAccount.cursor.locked) {
                model.qDelServiceFromAccount.params.account_id = anAccountId;
                model.qDelServiceFromAccount.params.service_id = model.qServiceListByAccount.cursor.bill_item_cost_id;
                model.qDelServiceFromAccount.params.service_account_id = model.qServiceListByAccount.cursor.bill_services_accounts_id;
                model.qDelServiceFromAccount.executeUpdate();
                model.save();
                eventProcessor.addEvent('delServiceFromAccount', {
                    account_id: anAccountId,
                    service_id: aServiceId
                });
                return true;
            } else {
                return addErrorToLogger('errorDelServiceFromAccount', {
                    account_id: anAccountId,
                    service_id: aServiceId
                }, ERRORS.SERVICE_LOCKED);
            }
        } else {
            return addErrorToLogger('errorDelServiceFromAccount', {
                account_id: anAccountId,
                service_id: aServiceId
            }, ERRORS.FIND_SERVICE_ID);
        }
    };
    /*
     * Создание новой услуги
     * aDays - промежуток дней для снятия абонентской платы
     * aDays (null) - ежемесячное списание абонентской платы
     * @param {type} aName
     * @param {type} aSum
     * @param {type} aDays
     * @returns {Boolean}
     */
    self.CreateService = function(aName, aSum, aDays, aLock) {
        var aMonth = false;
        if (aDays == false || aDays == 0 || aDays == null || aDays === undefined || !aDays){
            aMonth = true;
            aDays = 0;
        }
        var obj = {
            service_name: aName,
            service_days: aDays,
            item_cost: aSum,
            service_month: aMonth
        };
        //model.qServiceList.push(obj);
        model.qServiceList.insert();
        model.qServiceList.cursor.service_id = model.qServiceList.cursor.bill_services_id;
        model.qServiceList.cursor.item_cost = aSum;
        model.qServiceList.cursor.service_days = aDays;
        model.qServiceList.cursor.service_month = aMonth;
        model.qServiceList.cursor.service_name = aName;
        model.qServiceList.cursor.locked = aLock;
        model.qServiceList.cursor.start_date = new Date();
        model.save();
        eventProcessor.addEvent('serviceCreated', obj);
        return true;
    };
    /*
     * Удаление услуги
     */
    self.delService = function(aServiceId) {
        model.params.service_id = aServiceId;
        model.qServiceList.requery(function() {});
        if (model.qServiceList.length > 0) {
            model.qCloseItemCost.params.item_id = aServiceId;
            model.qCloseItemCost.executeUpdate();
            model.save();
            eventProcessor.addEvent('delService', {service_id: aServiceId});
            return true;
        } else {
            eventProcessor.addEvent('errorDelService', {
                service_id: aServiceId,
                error: ERRORS.FIND_SERVICE_ID
            });
            return false;
        }
    };
    /*
     * Редактирование услуги
     */
    self.editService = function(aServiceId, aName, aSum, aDays, aLock) {
        var aMonth = false;
        if (aDays == false || aDays == 0 || aDays == null || aDays === undefined)
            aMonth = true;
        model.params.service_id = aServiceId;
        model.qService.params.service_id = aServiceId;
        model.qService.requery();
        model.qServiceList.requery(function() {});
        if (model.qServiceList.length > 0) {
            model.qCloseItemCost.params.service_id = aServiceId;
            model.qCloseItemCost.executeUpdate();
            var obj = {
                service_id: aServiceId,
                item_cost: aSum,
                service_days: aDays,
                service_month: aMonth,
                start_date: new Date()
            };
            model.qServiseCostAdd.push(obj);
            model.qService.cursor.service_name = aName;
            model.qService.cursor.locked = aLock;
            model.save();
            eventProcessor.addEvent('changeService', obj);
            return true;
        } else {
            eventProcessor.addEvent('errorChangeService', {service_id: aServiceId});
            return false;
        }
    };
    
    /*
     * 
     */
    self.getBillAccount = function(aFranId){
        model.qBillAccount.params.type = null;
        model.qBillAccount.params.account_id = null;
        model.qBillAccount.params.user_id = aFranId;
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
    
    self.addCashToFranchazi = function(aSum, aType, aFranchaziId){
        var franchaziId = aFranchaziId ? aFranchaziId : session.getFranchazi();
        model.qBillAccount.params.account_id = null;
        model.qBillAccount.params.user_id = franchaziId;
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
     * 
     */
    self.bonusOperation = function(aClient, aBonusOperation, aCount, aTradeOperationId) {
        /*
         * Если идет списание средст с бонусного счета клиента, то начислить деньги на счет франчази
         */
        if (aBonusOperation === self.OPERATION_DEL_BUY) {
            var BillOperation = self.addCashToFranchazi(aCount, "bonus");
            connectBillAndTradeOperation(aTradeOperationId, BillOperation);
        }
        /*
         * Проведение бонусной операции со счетом клиента
         */
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
    };
}
