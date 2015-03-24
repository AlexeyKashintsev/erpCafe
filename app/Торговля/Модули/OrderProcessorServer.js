/**
 * 
 * @author Alexey
 * @module
 * @stateless
 */ 
function OrderProcessorServer() {
    var self = this, model = this.model;
    var whSession, clientModule, billing, bonuses;
    var session, sessionItems;
    
    function getModules() {
         whSession = Session.get('WhSessionModule');
         clientModule = Session.get('ClientServerModule');
         billing = Session.get('BillModule');
         bonuses = Session.get('BonusModule');
    }
    
    function TradeOperationAddToCashBox(anOrderSum, anOperationType, aClientId) {
        model.qTradeOperationBySession.push({
            operation_sum: anOrderSum,
            operation_date: new Date(),
            session_id: session,
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
        for (var i in anItems) {
            sum += sessionItems[anItems[i].tradeId] * anItems[i].quantity;
        };
        return sum;
    }
    
    /*
     * Процесс продажи
     * @param {type} anOrderDetails
     * @returns {String}
     */
    self.processOrder = function(anOrderDetails, aSession, aSessionItems) {
        var client = false;
        getModules();
        session = aSession;
        sessionItems = aSessionItems;

        if (anOrderDetails.clientData)
            client = clientModule.getClientDataByPhone(anOrderDetails.clientData.phone);

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

        return 0;
    };
}
