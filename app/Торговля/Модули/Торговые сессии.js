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
    var ClientPhone = null;
    
    self.setClientPhone = function(aPhone){
        ClientPhone = aPhone;
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
    
    function TradeOperationPushInCashBox(anOrderSum){
        model.qTradeOperationBySession.push({
            operation_sum    : anOrderSum,
            operation_date   : new Date(),
            session_id       : model.params.session_id,
            operation_type   : null //TODO Поменять тип операции
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
    
    function WhItemsCalculation (anItemId, aQuantity){
        var WhItems = [];
        model.qContents.params.trade_item_id = anItemId;
        model.qContents.execute();
        model.qContents.beforeFirst();
        while (model.qContents.next()){
            if (WhItems[model.qContents.cursor.wh_item]){
                anWH_items[model.qContents.cursor.wh_item] += model.qContents.cursor.usage_quantity * aQuantity;
            } else {
                WhItems[model.qContents.cursor.wh_item] = model.qContents.cursor.usage_quantity * aQuantity;
            }
        }
        return WhItems;
    }
    
    function getCountBonusesByItem(anItem){
        model.qBonusRateForItemsEdit.params.item_id = anItem;
        model.qBonusRateForItemsEdit.params.bonus_category = clientModule.getBonusCategory(ClientPhone);
        if (model.qBonusRateForItemsEdit.cursor.bonus_rate){
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
        // Если мы в сессии,то
        if (model.params.session_id){
            var BonusCount = 0;
            // для всех товаров
            for (var i in anOrderDetails.orderItems) {
                if (anOrderDetails.orderItems[i].itemId && anOrderDetails.orderItems[i].quantity){
                    // записать проданные товары в тороговую операцию. При этом добавив приход в кассу.
                    TradeItemsPushInTradeOperation(TradeOperationPushInCashBox(anOrderDetails.orderSum), anOrderDetails.orderItems[i].itemId, anOrderDetails.orderItems[i].quantity);
                    // TODO Добавить добавление бонусов клиенту на его счет.
                    BonusCount += getCountBonusesByItem(anOrderDetails.orderItems[i].itemId) * anOrderDetails.orderItems[i].quantity;
                    // затем написать уход элементов состава товара со склада. 
                    if (!whSession.whMovement(WhItemsCalculation(anOrderDetails.orderItems[i].itemId, anOrderDetails.orderItems[i].quantity), whSession.WH_PRODUCE_ITEMS)){
                        //если не получилось - вывести ошибку.
                        ep.addEvent('errorAddTradeOperation', anOrderDetails);
                    }
                }
            }
            billing.addBillOperation(clientModule.getBonusBill(ClientPhone), billing.OPERATION_ADD_BONUS, BonusCount);
            model.save();
        }
    };
}
