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
                start_value: aStartBalance ? aStartBalance : 0
            });
            model.params.session_id = aSession;
            ep.addEvent('newSession', {
                session: aSession,
                module: 'TradeSessions',
                startB: aStartBalance ? aStartBalance : 0
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
    function TradeItemsPushInTradeOperation(aCashBoxOperationId, aTradeId, anItemId, aQuantity, aPriceType) {
        model.qTradeOperationsWithItems.push({
            cash_box_operation  :   aCashBoxOperationId,
            item_on_tp          :   aTradeId,
            trade_item          :   anItemId,
            items_quantity      :   aQuantity,
            price_type          :   aPriceType
        });
    }

    function getTradeItemsByTradePointWithCostAndBonuses(){
        model.tradeItemsByTPwCost.params.actual_date = new Date();
        //model.tradeItemsByTradePointWithCost.params.franchazi_id = session.getFranchazi();
        model.tradeItemsByTPwCost.params.trade_point_id = session.getTradePoint();  
        model.tradeItemsByTPwCost.requery();
        model.tradeItemsByTPwCost.forEach(function(cursor) {
            sessionItems[cursor.items_on_tp_id] = {};
            sessionItems[cursor.items_on_tp_id].itemID = cursor.item_id;
            sessionItems[cursor.items_on_tp_id].cost = model.tradeItemsByTPwCost.cursor.item_cost;
            sessionItems[cursor.items_on_tp_id].name = model.tradeItemsByTPwCost.cursor.item_name;
            sessionItems[cursor.items_on_tp_id].bonus_category = [];
            for (var i = 1; i<=3; i++){
                sessionItems[cursor.items_on_tp_id].bonus_category[i] = bonuses.getCountBonusesByItem(cursor.item_id, i);
            }
        });
        return sessionItems;
    }

    /*
     * Запись проданных товаров в торговую операцию
     * @param {type} anOrderItem
     * @param {type} aTradeOperationId
     * @returns {Boolean}
     */
    function processOrderItem(anOrderItem, aTradeOperationId) {
        if (anOrderItem.tradeId && anOrderItem.quantity) {
            //var itemId = sessionItems[anOrderItem.tradeId].itemID;
            TradeItemsPushInTradeOperation( aTradeOperationId,
                                            anOrderItem.tradeId,
                                            anOrderItem.itemId,
                                            anOrderItem.quantity,
                                            anOrderItem.priceType);

            //WhItemsConsumption(anOrderItem.itemId, anOrderItem.quantity);
            //TODO Тут тоже переписать ЖАРА!!!!
            var cons = {};
            cons[anOrderItem.tradeId] = anOrderItem.quantity;
            whSession.processTradeItems(cons);
        } else {
            ep.addEvent('errorAddTradeOperation', {
                desk: 'Не указано количество или ID товара(er#170)',
                opID: aTradeOperationId
            });
        }
    }

    function calculateOrderSum(anItems) { //TODO Исправить для использования с типом цены
        var sum = 0;
        model.qOpenedSession.params.user_name = session.getUserName();
        var tpid = model.qOpenedSession.cursor.trade_point;
        for (var i in anItems) {
            sum += sessionItems[anItems[i].tradeId] * anItems[i].quantity;
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

        if (anOrderDetails.clientData)
            client = clientModule.getClientDataByPhone(anOrderDetails.clientData.phone);

        //При внесении операции после окончания серверной сессии
        if (!model.params.session_id && session.checkSession(anOrderDetails.session_id)) {
            model.params.session_id = anOrderDetails.session_id;
            whSession.setCurrentSession(anOrderDetails.session_id);
        }

        if (model.params.session_id) {
            var OperationType = anOrderDetails.methodOfPayment;
            
            switch (anOrderDetails.methodOfPayment) {
                case 0: //Деньги
                    var BonusCount = 0;
                    var BonusOperation = billing.OPERATION_ADD_BONUS;
                    break;
                case 1: //"bonus":
                    BonusOperation = billing.OPERATION_DEL_BUY;
                    BonusCount = anOrderDetails.orderSum;
                    if (client.bonusBill) {
                        if (client.bonusCount < anOrderDetails.orderSum) {
                            ep.addEvent('errorNotEnoughBonuses', anOrderDetails);
                            return 2;
                        }
                    }
                    break;
                case 10 : break;
                default:
                    ep.addEvent('errorMethodOfPaymentIsNull', anOrderDetails);
                    return "error";
            }

            var TradeOperationId = TradeOperationAddToCashBox(anOrderDetails.orderSum,
                    OperationType,
                    client ? client.bonusBill : null);
                    
            for (var i in anOrderDetails.orderItems) {
                processOrderItem(anOrderDetails.orderItems[i], TradeOperationId);

                if (client && anOrderDetails.methodOfPayment === 0) {
                    BonusCount += sessionItems[anOrderDetails.orderItems[i].tradeId].bonus_category[client.bonusCategory]
                            * sessionItems[anOrderDetails.orderItems[i].tradeId].cost//getCountBonusesByItem(anOrderDetails.orderItems[i].itemId, client.bonusCategory)
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
