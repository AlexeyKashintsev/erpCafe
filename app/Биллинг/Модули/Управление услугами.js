/**
 * @public
 * @author minya92
 * @module
 */ 
function ServiceModule() {
    var self = this, model = this.model;
    var eventProcessor = new EventProcessor();
    var bm = Modules.get("BillModule"); //Modules.get - устарел, использовать Session.get
    var session = Modules.get("UserSession");
    
    var ERRORS = {
        FIND_ACCOUNT_ID: "Аккаунт с таким ID не найден",
        FIND_SERVICE_ID: "Услуга с таким ID не найдена",
        LOST_MONEY: "Недостаточно средств на счету",
        INVALID_OP_ID: "Неверный ID операции",
        SERVICE_ADDED: "Услуга уже добавлена на лицевой счет",
        SERVICE_LOCKED: "Ошибка удаления услуги с аккаунта. Услуга заблокирована для удаления!"
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
    self.AddService = function(anAccountId, aServiceId, aFranchaziId) {
        if(aFranchaziId){
           anAccountId = bm.getBillAccount(aFranchaziId);
        }
        model.params.service_id = aServiceId;
        model.qBillAccountServer.params.type = null;
        model.qBillAccountServer.params.franchazi_id = null;
        model.qBillAccountServer.params.account_id = anAccountId;
        model.qServiceList.params.account_id = anAccountId;
        model.qServiceList. params.service_id = aServiceId;
        model.requery(function() {});
        if (model.qServiceList.length > 0) {
            if (model.qBillAccountServer.length > 0) {
                if (model.qAddService.length == 0) {
                    if (bm.getSumFromAccountId(model.qBillAccountServer.cursor.bill_accounts_id) >= model.qServiceList.cursor.item_cost) {
                        var payDate = new Date();
                        bm.addBillOperation(anAccountId, bm.OPERATION_DEL_SERVICE, model.qServiceList.cursor.item_cost);
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
     * @rolesAllowed admin
     * @param {type} anAccountId
     * @returns {undefined}
     */
    function delLockedServiceFromAccount(anAccountId, aServiceId){
        
    }
    
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
            if ((session.getUserRole() == "franchazi" && !model.qServiceListByAccount.cursor.locked) || session.getUserRole() == "admin") {
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
    
}
