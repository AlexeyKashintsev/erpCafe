/**
 * 
 * @author Alexey
 * @module
 * @stateless
 */ 
function OrderProcessorServer() {
    var self = this, model = this.model;
    var whSession, clientModule, billing, bonuses;
    var ep = new EventProcessor();
    var session, sessionItems;
    
    function getModules() {
         whSession = Session.getModule('WhSessionModule');
         clientModule = Session.getModule('ClientServerModule');
         billing = Session.getModule('BillModule');
         bonuses = Session.getModule('BonusModule');
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
            TradeItemsPushInTradeOperation( aTradeOperationId,
                                            anOrderItem.tradeId,
                                            anOrderItem.itemId,
                                            anOrderItem.quantity,
                                            anOrderItem.priceType);

            //WhItemsConsumption(anOrderItem.itemId, anOrderItem.quantity);
            //TODO Тут тоже переписать ЖАРА!!!!
        } else {
            ep.addEvent('errorAddTradeOperation', {
                desk: 'Не указано количество или ID товара(er#170)',
                opID: aTradeOperationId
            });
        }
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

        var OperationType = anOrderDetails.methodOfPayment;
        /*OP1*/

        var TradeOperationId = TradeOperationAddToCashBox(anOrderDetails.orderSum,
                                                            OperationType, client ? client.bonusBill : null);
                                                            
        var whCons = {};
        for (var i in anOrderDetails.orderItems) {
            processOrderItem(anOrderDetails.orderItems[i], TradeOperationId);
            whCons[anOrderDetails.orderItems[i].tradeId] = anOrderDetails.orderItems[i].quantity;
            /*OP2*/
        }
        model.save();
        whSession.processTradeItems(whCons);

        /*OP3*/
        return 0;
    };
}


/** OLD PROCESSING
* 1:    if (anOrderDetails.clientData)
            client = clientModule.getClientDataByPhone(anOrderDetails.clientData.phone);
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
2:          if (client && anOrderDetails.methodOfPayment === 0) {
                BonusCount += sessionItems[anOrderDetails.orderItems[i].tradeId].bonus_category[client.bonusCategory]
                        * sessionItems[anOrderDetails.orderItems[i].tradeId].cost//getCountBonusesByItem(anOrderDetails.orderItems[i].itemId, client.bonusCategory)
                        * anOrderDetails.orderItems[i].quantity;
            }
3:      if (client.bonusBill) {
            bonuses.bonusOperation(client, BonusOperation, BonusCount, TradeOperationId);
        }
 * 
 */