/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function TradeSessions() {
    var self = this, model = this.model;
    var whSession = new WhSessionModule();
    var clientModule = new ClientServerModule();
    var billing = new BillModule();
    var ep = new EventProcessor();
    var ClientPhone = null; //УДалить
    //var tradeOperationType = "money";
    
    self.setClientPhone = function(aPhone){//TODO Убрать в модуль работы с клиентами, удалить
        ClientPhone = aPhone;
    };
    
    self.setClient = function (aPhone){
        client = new clientModule.ClientConstructor(aPhone);
    }
//    self.setTradeOperationType = function(aType){//TODO Зло^ использовать меч света
//        tradeOperationType = aType;
//    };
    
    self.getBonusCount = function(){//TODO Тоже самое
        return billing.getSumFromUserId(ClientPhone);
    };
    
    self.initializeSession = function(aSession, aStartBalance) {
        model.qTradeSessionBalance.push({
            session_id  :   aSession,
            start_value :   aStartBalance
        });
        model.params.session_id = aSession;
        ep.addEvent('newSession', {
            session :   aSession,
            module  :   'TradeSessions',
            startB  :   aStartBalance
        });
        model.save();
    };

  
    function getCurrentSession(){
        model.qOpenedSession.params.user_name = self.principal.name;
        model.qOpenedSession.execute();
        ep.addEvent('openSession', {
            session :   model.qOpenedSession.org_session_id,
            module  :   'TradeSessions'
        });
        whSession.setCurrentSession(model.qOpenedSession.org_session_id);
        return model.qOpenedSession.org_session_id;
    }
    
    function TradeOperationAddToCashBox(anOrderSum, anOperationType, aClientId){
        model.qTradeOperationBySession.push({
            operation_sum    : anOrderSum,
            operation_date   : new Date(),
            session_id       : model.params.session_id,
            operation_type   : anOperationType,
            client_id        : aClientId
        });
        return model.qTradeOperationBySession.trade_cash_box_operation_id;
    }
    
    function TradeItemsPushInTradeOperation(aCashBoxOperationId, anItemId, aQuantity){
        model.qTradeOperationsWithItems.push({
            cash_box_operation : aCashBoxOperationId,
            trade_item : anItemId,
            items_quantity : aQuantity
        });
    }
    
    
    /*
     * Расчет потребления складских позиций
     */
    function WhItemsCalculation (anItemId, aQuantity){
        var WhItems = [];
        model.qContents.params.trade_item_id = anItemId;
        model.qContents.execute();
        model.qContents.beforeFirst();
        while (model.qContents.next()){
            if (WhItems[model.qContents.cursor.wh_item]){///Что-то здесь поправил!!!!! TODO Проверить
                WhItems[model.qContents.cursor.wh_item] += model.qContents.cursor.usage_quantity * aQuantity;
            } else {
                WhItems[model.qContents.cursor.wh_item] = model.qContents.cursor.usage_quantity * aQuantity;
            }
        }
        return WhItems;
    }
    
    //TODO Написать функцию возвращающую список всех товаров на точке со всем и возможными бонусами
    //Обращение к БД всего один раз + передача списка доступных товаров на сторону клента (см tradeItemsByTradePointWithCost)
    
    function getCountBonusesByItem(anItem){
        model.qBonusRateForItemsEdit.params.item_id = anItem;
        model.qBonusRateForItemsEdit.params.bonus_category = clientModule.getBonusCategory(ClientPhone);
        model.qBonusRateForItemsEdit.requery();
        if (model.qBonusRateForItemsEdit.length > 0){
            return model.qBonusRateForItemsEdit.cursor.bonus_rate;
        } else {
            model.qOpenedSession.params.user_name = self.principal.name;
            model.tradeItemCost.params.date_id = new Date();
            model.tradeItemCost.params.item_id = anItem;
            model.tradeItemCost.params.trade_point_id = model.qOpenedSession.cursor.trade_point;
            model.tradeItemCost.requery();
            return model.tradeItemCost.cursor.item_cost * getCountBonusesByCategory(model.qBonusRateForItemsEdit.params.bonus_category) / 100;
        }
    }
    
    function getCountBonusesByCategory(aCatId){
        model.qGetBonusCategories.params.category_id = aCatId;
        model.qGetBonusCategories.requery();
        return model.qGetBonusCategories.cursor.category_bonus_rate;
    }
    
    //Запись прихода по кассе
    self.processOrder = function(anOrderDetails){
        if (!model.params.session_id){
            model.params.session_id = getCurrentSession();
        }

        if (model.params.session_id){
            switch (anOrderDetails.methodOfPayment){
                case "money":
                    var BonusCount = 0;
                    break;
                case "bonus":
//                    model.qBillAccount.params.user_id = ClientPhone;
//                    model.qBillAccount.requery();
//                    if (model.qBillAccount.length > 0){
                      if (client.bonusBill.length > 0){
                        if (model.qBillAccount.cursor.currnt_sum < anOrderDetails.orderSum){
                            ep.addEvent('errorNotEnoughBonuses', anOrderDetails);
                            return "error";
                        }
                    }
                    break;
                default:
                    ep.addEvent('errorMethodOfPaymentIsNull', anOrderDetails);
                    return "error";
            }
            
            var TradeOperationId = TradeOperationAddToCashBox(  anOrderDetails.orderSum,
                                                                    anOrderDetails.methodOfPayment,
                                                                    //clientModule.getBonusBill(ClientPhone));
                                                                    client.bonusBill);
            for (var i in anOrderDetails.orderItems) {
                if (anOrderDetails.orderItems[i].itemId && anOrderDetails.orderItems[i].quantity){
                    TradeItemsPushInTradeOperation( TradeOperationId, 
                                                    anOrderDetails.orderItems[i].itemId, 
                                                    anOrderDetails.orderItems[i].quantity);
                    if (client.bonusBill){
                        BonusCount += getCountBonusesByItem(anOrderDetails.orderItems[i].itemId) * anOrderDetails.orderItems[i].quantity;
                    }
                    var calculationConsumption = WhItemsCalculation(anOrderDetails.orderItems[i].itemId, 
                                                                    anOrderDetails.orderItems[i].quantity);

                    if (!whSession.whMovement(calculationConsumption, whSession.WH_PRODUCE_ITEMS)){
                        ep.addEvent('errorAddTradeOperation', anOrderDetails);
                    }
                }
            }
            switch (anOrderDetails.methodOfPayment){
                case "money":
                    if (client.bonusBill){
                        billing.addBillOperation(client.bonusBill, 
                                                 billing.OPERATION_ADD_BONUS, 
                                                 BonusCount);
                    }
                    break;
                case "bonus":
                    if (client.bonusBill){
                        billing.addBillOperation(client.bonusBill, 
                                                 billing.OPERATION_DEL_BUY, 
                                                 anOrderDetails.orderSum);
                    }
                    break;
                default:
                    ep.addEvent('errorMethodOfPaymentIsNull', anOrderDetails);
                    return "error";
            }
            model.save();
           //TODO Досписать добавление бонусов на счет франчайзи
        }
    };
}
