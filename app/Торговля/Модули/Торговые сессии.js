/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function TradeSessions() {
    var self = this, model = this.model;
    var whSession = new WhSessionModule();
    var ep = new EventProcessor();
    
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
    //Запись прихода по кассе
    self.processOrder = function(anOrderDetails){
        if (!model.params.session_id){
            model.params.session_id = getCurrentSession();
        }
        if (model.params.session_id){
            for (var i in anOrderDetails.orderItems) {
                if (anOrderDetails.orderItems[i].itemId && anOrderDetails.orderItems[i].quantity){
                    TradeItemsPushInTradeOperation(TradeOperationPushInCashBox(anOrderDetails.orderSum), anOrderDetails.orderItems[i].itemId, anOrderDetails.orderItems[i].quantity);
                    if (!whSession.whMovement(WhItemsCalculation(anOrderDetails.orderItems[i].itemId, anOrderDetails.orderItems[i].quantity), whSession.WH_PRODUCE_ITEMS)){
                        ep.addEvent('errorAddTradeOperation', anOrderDetails);
                    }
                }
            }
            model.save();
        }
    };
}
