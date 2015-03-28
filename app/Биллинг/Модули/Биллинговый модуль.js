/**
 * 
 * @author minya92
 * @module
 * @public
 */
function BillModule() {
    Session.setModule('BillModule', this);
    var self = this, model = this.model;
    var eventProcessor = new EventProcessor();
    var session = Session.getModule("UserSession");

    // Типы операций
    self.OPERATION_ADD_CASH = 1; //Добавление средств на счет
    self.OPERATION_ADD_BONUS = 2; //
    self.OPERATION_DEL_BUY = 3; //Списание средств
    self.OPERATION_DEL_SERVICE = 4; //
    self.OPERATION_ADD_ITEM_TYPE = 5; // Добавление бонусов на лицевой счет
    // Типы аккаунтов
    self.ACCOUNT_TYPE_DEFAULT = 1; //Основной 
    self.ACCOUNT_TYPE_CREDIT = 2; //Кредитный
    self.ACCOUNT_TYPE_BONUS = 3; //Клиентский бонусный
    //Статусы операций
    self.OP_STATUS_SUCCESS = 1;
    self.OP_STATUS_FAIL = 2;
    self.OP_STATUS_BILL = 3;
    self.OP_STATUS_PROCESSING = 4;    //Заказ в обработке
    self.OP_STATUS_CREATE = 5;    //Создан
    self.OP_STATUS_CREATE_AUTO = 6;    //Создан автоматически
    self.OP_STATUS_PAID = 7;    //Оплачен
    self.OP_STATUS_SEND = 8;    //Товар Отправлен
    self.OP_STATUS_RECIVED = 9;   //Товар получен 
    //Яндекс
    self.OP_YANDEX_CREATE = 10;
    self.OP_YANDEX_PROCESSING = 11;
    self.OP_YANDEX_ERROR = 13;

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
    function checkMoneyOnAccount(anAccountId, aSum) {
        var sum = self.getSumFromAccountId(anAccountId);
        if (sum >= aSum)
            return true;
        else
            return false;
    }

    function reqBillAccounts(anAccountId, aFranchaziId, aType, aClientId) {
        model.qBillAccountServer.params.type = aType;
        model.qBillAccountServer.params.franchazi_id = aFranchaziId;
        model.qBillAccountServer.params.account_id = anAccountId;
        model.qBillAccountServer.params.client_id = aClientId;
        model.qBillAccountServer.requery();
        if (!model.qBillAccountServer.empty)
            return {accountId: model.qBillAccountServer.cursor.bill_accounts_id,
                accountType: model.qBillAccountServer.cursor.account_type};
        else
            return null;
    }

    function getMultiplier(aOperationType) {
        model.qBillOperationTypes.beforeFirst();
        while (model.qBillOperationTypes.next()) {
            if (model.qBillOperationTypes.cursor.bill_operations_type_id === aOperationType)
                return model.qBillOperationTypes.cursor.multiplier;
        }
        return false;
    }
    /*
     * Создает новый биллинговый аккаунт и возвращает его ID
     * @param {type} aFrancId
     * @param {type} aType
     * @param {type} aSum
     * @returns {@this;@pro;model.qBillAccountServer.cursor.bill_accounts_id}
     */
    self.createBillAccount = function(aType, aFranchaziId, aClientId) {
        if (!aType)
            aType = self.ACCOUNT_TYPE_DEFAULT;
        model.qBillAccountServer.push({
            franchazi_id: aFranchaziId,
            account_type: aType,
            currnt_sum: 0,
            active: true,
            client_id: aClientId
        });
        model.save();
        eventProcessor.addEvent('billCreated', {
            franchazi_id: aFranchaziId,
            account_type: aType
        });
        return model.qBillAccountServer.cursor.bill_accounts_id;
    };
    /*
     * Получить быстрый баланс счета по ID
     * Использовать ТОЛЬКО для быстрого отображения!!!
     * @param {type} anAccountId
     * @returns {undefined}
     */
    self.getQuickSumFromAccountId = function(anAccountId) {
        reqBillAccounts(anAccountId, null, null, null);
        if (model.qBillAccountServer.length > 0)
            return model.qBillAccountServer.cursor.currnt_sum;
        else
            return false;
    };
    /*
     * Получить баланс счета по ID
     * @param {type} anAccountId
     * @returns {undefined} 
     * TODO Переписать...
     */
    self.getSumFromAccountId = function(anAccountId) {
        model.qGetAccountBalance.params.account_id = anAccountId;
        reqBillAccounts(anAccountId, null, null, null);
        model.qGetAccountBalance.requery();
        var account_balance = model.qGetAccountBalance.empty ? 0 : model.qGetAccountBalance.cursor.account_balance;
        if (model.qBillAccountServer.cursor.currnt_sum !== account_balance) {
            eventProcessor.addEvent("accountCurrentSumChanged", {
                account_id: anAccountId,
                old_sum: model.qBillAccountServer.cursor.currnt_sum,
                new_sum: account_balance
            });
            //model.qBillAccountServer.cursor.currnt_sum = model.qGetAccountBalance.cursor.account_balance;
            //model.save();
        }
        return model.qGetAccountBalance.empty ? model.qBillAccountServer.cursor.currnt_sum : account_balance;
        /*if (model.qGetAccountBalance.length > 0)
            return model.qGetAccountBalance.cursor.account_balance;
        else
            return false;*/
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
     * anAccountId - номер счета
     * aType - тип операции (списание или пополнение)
     * aSum - сумма денежных средств
     * aStatus - статус операции (успешно, провалено, выставлен счет, в обработке)
     */
    self.addBillOperation = function(anAccountId, anOperationType, aSum, aStatus, aClientId) {
        //Его проще заново переписать, пиздец тут говна О_о -> X_x 
        var accountType = null;
        var multiplier = getMultiplier(anOperationType);

        if (!aStatus)
            aStatus = self.OP_STATUS_SUCCESS;

        if (aClientId) {
            var account = reqBillAccounts(null, null, null, aClientId);
            if (!anAccountId)
                return false;
            else {
                anAccountId = account.accountId;
                accountType = account.accountType;
            }
        }

        var billOperation = {
            account_id: anAccountId,
            operation_sum: aSum,
            operation_date: new Date(),
            operation_type: anOperationType,
            operation_status: aStatus,
            user_name_perfomed: self.principal.name
        };

        reqBillAccounts(anAccountId, null, null, null);

        //Проверка безопасного проведенеия операции пополнения счета
        if (session.getUserRole() !== "admin"
                && anOperationType === self.OPERATION_ADD_CASH
                && aSum > 0 && aStatus === self.OP_STATUS_SUCCESS
                && multiplier > 0)
            return false;

        if (!checkMoneyOnAccount(anAccountId, aSum)) {
            if ((multiplier === -1)
                    && (aStatus === self.OP_STATUS_SUCCESS || aStatus === self.OP_STATUS_PAID)
                    && (anOperationType !== self.OPERATION_DEL_SERVICE)
                    && (accountType !== self.ACCOUNT_TYPE_CREDIT))
            {
                eventProcessor.addEvent('errorLostMoney', billOperation);
                return false;
            }
        }

        model.qBillOperationsListServer.push(billOperation);
        if (aStatus === self.OP_STATUS_SUCCESS) {
            reqBillAccounts(anAccountId, null, null, null);
            if (model.qBillAccountServer.length > 0) {
                model.qBillAccountServer.cursor.currnt_sum = model.qBillAccountServer.cursor.currnt_sum + aSum * multiplier;

            }
        }
        model.save();
        eventProcessor.addEvent('addBillOperation', billOperation);
        return model.qBillOperationsListServer.cursor.bill_operations_id;
    };

    /*
     * Изменение статуса операции по счету
     * @param {type} anOperationId
     * @param {type} aStatus
     * @returns {undefined}
     */
    self.setStatusBillOperation = function(anOperationId, aStatus, aShopPassword) {
        model.params.operation_id = anOperationId;
        model.qBillOperationsListServer.requery();
        if (model.qBillOperationsListServer.length > 0) {
            if (checkMoneyOnAccount(model.qBillOperationsListServer.cursor.account_id,
                    model.qBillOperationsListServer.cursor.operation_sum))
            {
                var settings = Session.getModule("Settings");
                var SHOP_PASSWORD = settings.getSettingByName("shopPassword").pass;
                if (aStatus === self.OP_STATUS_SUCCESS && ((session.getUserRole() === "admin") ||
                        aShopPassword === SHOP_PASSWORD)) {
                    reqBillAccounts(model.qBillOperationsListServer.cursor.account_id, null, null, null);
                    model.qBillAccountServer.cursor.currnt_sum = model.qBillAccountServer.cursor.currnt_sum +
                            model.qBillOperationsListServer.cursor.operation_sum *
                            model.qBillOperationsListServer.cursor.multiplier;
                } else
                    return false;

                model.qBillOperationsListServer.cursor.operation_status = aStatus;
                model.save();
                self.getSumFromAccountId(model.qBillOperationsListServer.cursor.account_id);
                eventProcessor.addEvent('setStatusBillOperation', {
                    operation_id: model.qBillOperationsListServer.cursor.bill_operations_id,
                    status: aStatus
                });
                return true;
            } else {
                eventProcessor.addEvent('errorSetStatusBillOperation', {
                    operation_id: model.qBillOperationsListServer.cursor.bill_operations_id,
                    status: aStatus,
                    error: ERRORS.LOST_MONEY});
                return false;
            }
        } else {
            eventProcessor.addEvent('errorSetStatusBillOperation', {
                operation_id: model.qBillOperationsListServer.cursor.bill_operations_id,
                status: aStatus,
                error: ERRORS.INVALID_OP_ID});
            return false;
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
        model.qBillOperationsListServer.requery(function() {
        });
        if (model.qBillOperationsListServer.length > 0) {
            for (var id in anItems) {
                model.qItemBillCost.params.item_id = anItems[id].item_id;
                model.qItemBillCost.requery(function() {
                    model.qAddItemsOnOperation.push({
                        operation_id: model.qBillOperationsListServer.cursor.bill_operations_id,
                        cost_id: model.qItemBillCost.cursor.bill_item_cost_id
                    });
                });
            }
            model.save();
        }
    };

    /*
     * Получение счетов клинта
     */
    self.getBillAccountClient = function(aClientId, aType) {
        if (!aType)
            aType = null;
        reqBillAccounts(null, null, aType, aClientId);
        return model.qBillAccountServer.cursor.bill_accounts_id;
    };
}