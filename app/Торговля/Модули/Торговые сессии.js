/**
 * 
 * @author Alexey
 * @module
 * @public
 */
function TradeSessions() {
    Session.set('TradeSessions', this);
    var self = this, model = this.model;
    var whSession = Session.get('WhSessionModule');
    var clientModule = Session.get('ClientServerModule');
    var billing = Session.get('BillModule');
    var bonuses = Session.get('BonusModule');
    var ep = new EventProcessor();
    var session = Session.get("UserSession");
    var sessionItems = {};
    
    /*
     * Типы операций
     * Деньги: 0
     * Бонусы: 1
     * Безнал: 10
     */
    var PAYMENT_TYPE_MONEY = 0;
    var PAYMENT_TYPE_BONUS = 1;
    var PAYMENT_TYPE_CARD = 10;

    self.getInfoForErrors = function(anError) {
        switch (anError) {
            case 1 :
                return "Несовпадение суммы операции на клиенте и на сервере";
            case 2 :
                return "Недостаточно бонусов для оплаты бонусами";
        }
    };

    /*
     * Инициализация сессии
     * @param {type} aSession
     * @param {type} aStartBalance
     * @returns {undefined}
     */
    self.initializeSession = function(aSession, aStartBalance) {
        if (aSession === session.getActiveTPSession()) {
            //aSession = session.getActiveTPSession();
        //};
            model.qTradeSessionBalance.push({
                session_id: aSession,
                start_value: aStartBalance
            });
            model.params.session_id = aSession;
            ep.addEvent('newSession', {
                session: aSession,
                module: 'TradeSessions',
                startB: aStartBalance
            });
            model.save();
        } else {
            Logger.warning('Ошибка при инициализации сессии');
        }
    };

    self.calculateFinalValues = function(aSession) {
        if (!aSession) {
            aSession = model.params.session_id ? model.params.session_id :
                                                    getCurrentSession();
        };
        Logger.info('Закрытие сессии ' + aSession);
        model.prSetFinalBalance4CashBox.params.session_id = aSession;
        model.prSetFinalBalance4CashBox.executeUpdate();
    };

    /*
     * Получение текущей сессии
     * @returns {@this;@pro;model.qOpenedSession.org_session_id}
     */
    function getCurrentSession() {
        model.qOpenedSession.params.user_name = session.getUserName();
        model.qOpenedSession.execute();
        ep.addEvent('openSession', {
            session: model.qOpenedSession.org_session_id,
            module: 'TradeSessions'
        });
        if (model.qOpenedSession.org_session_id) {
            whSession.setCurrentSession(model.qOpenedSession.org_session_id);
            model.params.session_id = model.qOpenedSession.org_session_id;
            getTradeItemsByTradePointWithCostAndBonuses();
        }
        return model.params.session_id;
    }

    function TradeOperationAddToCashBox(anOrderSum, anOperationType, aClientId) {
        model.qTradeOperationBySession.push({
            operation_sum: anOrderSum,
            operation_date: new Date(),
            session_id: model.params.session_id,
            operation_type: anOperationType,
            client_id: aClientId
        });
        return model.qTradeOperationBySession.trade_cash_box_operation_id;
    }

    /*
     * @param {type} aCashBoxOperationId
     * @param {type} anItemId
     * @param {type} aQuantity
     * @returns {undefined}
     */
    function TradeItemsPushInTradeOperation(aCashBoxOperationId, anItemId, aQuantity) {
        model.qTradeOperationsWithItems.push({
            cash_box_operation: aCashBoxOperationId,
            trade_item: anItemId,
            items_quantity: aQuantity
        });
    }

    /*
     * Расчет потребления складских позиций
     * @param {type} anItemId
     * @param {type} aQuantity
     * @returns {Array}
     */
    function WhItemsConsumption(anItemId, aQuantity, aTradeOperationId) {
        var WhItemsConsump = [];
        var empty = true;
        model.qContents.params.trade_item_id = anItemId;
        model.qContents.execute();
        model.qContents.beforeFirst();
        while (model.qContents.next()) {
            empty = false;
            if (WhItemsConsump[model.qContents.cursor.wh_item]) {
                WhItemsConsump[model.qContents.cursor.wh_item] += model.qContents.cursor.usage_quantity * aQuantity;
            } else {
                WhItemsConsump[model.qContents.cursor.wh_item] = model.qContents.cursor.usage_quantity * aQuantity;
            }
        }
        if (!empty)
            try {
                whSession.whMovement(WhItemsConsump, whSession.WH_PRODUCE_ITEMS);
            } catch (e) {
                ep.addEvent('errorAddTradeOperation', {
                    desk: 'Ошибка при добавлении расхода товара на склад(er#tr108)',
                    opID: aTradeOperationId,
                    iID: anItemId
                });
            }
        else {
            ep.addEvent('errorAddTradeOperation', {
                desk: 'Не указан состав товара(er#tr115)',
                opID: aTradeOperationId,
                iID: anItemId
            });
        }
    }

    function getTradeItemsByTradePointWithCostAndBonuses(){
        model.tradeItemsByTradePointWithCost.params.actual_date = new Date();
        model.tradeItemsByTradePointWithCost.params.franchazi_id = session.getFranchazi();
        model.tradeItemsByTradePointWithCost.params.trade_point_id = session.getTradePoint();  
        model.tradeItemsByTradePointWithCost.requery();
        model.tradeItemsByTradePointWithCost.beforeFirst();
        while (model.tradeItemsByTradePointWithCost.next()){
            sessionItems[model.tradeItemsByTradePointWithCost.cursor.item_id] = {};
            sessionItems[model.tradeItemsByTradePointWithCost.cursor.item_id].cost = model.tradeItemsByTradePointWithCost.cursor.item_cost;
            sessionItems[model.tradeItemsByTradePointWithCost.cursor.item_id].name = model.tradeItemsByTradePointWithCost.cursor.item_name;
            sessionItems[model.tradeItemsByTradePointWithCost.cursor.item_id].bonus_category = [];
            for (var i = 1; i<=3; i++){
                sessionItems[model.tradeItemsByTradePointWithCost.cursor.item_id].bonus_category[i] = bonuses.getCountBonusesByItem(model.tradeItemsByTradePointWithCost.cursor.item_id, i);
            }
        }
        return sessionItems;
    }

    /*
     * Запись проданных товаров в торговую операцию
     * @param {type} anOrderItem
     * @param {type} aTradeOperationId
     * @returns {Boolean}
     */
    function processOrderItem(anOrderItem, aTradeOperationId) {
        if (anOrderItem.itemId && anOrderItem.quantity) {
            TradeItemsPushInTradeOperation( aTradeOperationId,
                                            anOrderItem.itemId,
                                            anOrderItem.quantity);

            WhItemsConsumption(anOrderItem.itemId, anOrderItem.quantity);
        } else {
            ep.addEvent('errorAddTradeOperation', {
                desk: 'Не указано количество или ID товара(er#170)',
                opID: aTradeOperationId
            });
        }
    }

    function calculateOrderSum(anItems) {
        var sum = 0;
        model.qOpenedSession.params.user_name = session.getUserName();
        var tpid = model.qOpenedSession.cursor.trade_point;
        for (var i in anItems) {
            sum += sessionItems[anItems[i].itemId] * anItems[i].quantity;
        };
        return sum;
    }
    
    function checkOrderSum(anItems, aSum){
        if (calculateOrderSum(anItems) !== aSum) return false;
        else return true;
    }
    
    /*
     * Процесс продажи
     * @param {type} anOrderDetails
     * @returns {String}
     */
    self.processOrder = function(anOrderDetails) {
        var client = false;
        getCurrentSession();
//        if (!model.params.session_id) {
//            getCurrentSession();
//        }

       /* if (!checkOrderSum(anOrderDetails.orderItems, anOrderDetails.orderSum)) {
            ep.addEvent('sumDifference', {client: anOrderDetails, server: ServerSum});
            return 1;
        }*/

        if (anOrderDetails.clientData)
            client = clientModule.getClientDataByPhone(anOrderDetails.clientData.phone);

        //При внесении операции после окончания серверной сессии
        if (!model.params.session_id && session.checkSession(anOrderDetails.session_id)) {
            model.params.session_id = anOrderDetails.session_id;
            whSession.setCurrentSession(anOrderDetails.session_id);
        }

        if (model.params.session_id) {
            switch (anOrderDetails.methodOfPayment) {
                case "money":
                    var BonusCount = 0;
                    var BonusOperation = billing.OPERATION_ADD_BONUS;
                    var OperationType = PAYMENT_TYPE_MONEY;
                    break;
                case "bonus":
                    BonusOperation = billing.OPERATION_DEL_BUY;
                    OperationType = PAYMENT_TYPE_BONUS;
                    BonusCount = anOrderDetails.orderSum;
                    if (client.bonusBill) {
                        if (client.bonusCount < anOrderDetails.orderSum) {
                            ep.addEvent('errorNotEnoughBonuses', anOrderDetails);
                            return 2;
                        }
                    }
                    break;
                default:
                    ep.addEvent('errorMethodOfPaymentIsNull', anOrderDetails);
                    return "error";
            }

            var TradeOperationId = TradeOperationAddToCashBox(anOrderDetails.orderSum,
                    OperationType,
                    client ? client.bonusBill : null);
                    
            for (var i in anOrderDetails.orderItems) {
                processOrderItem(anOrderDetails.orderItems[i], TradeOperationId);

                if (client && anOrderDetails.methodOfPayment === "money") {
                    BonusCount += sessionItems[anOrderDetails.orderItems[i].itemId].bonus_category[client.bonusCategory]
                            * sessionItems[anOrderDetails.orderItems[i].itemId].cost//getCountBonusesByItem(anOrderDetails.orderItems[i].itemId, client.bonusCategory)
                            * anOrderDetails.orderItems[i].quantity;
                }
            }
            model.save();

            if (client.bonusBill) {
                bonuses.bonusOperation(client, BonusOperation, BonusCount, TradeOperationId);
            }

        };
        return 0;
    };
    getCurrentSession();
}
