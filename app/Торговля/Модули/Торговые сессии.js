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
      
    //Запись прихода по кассе
    self.processOrder = function(anOrderDetails){
        if (!model.params.session_id){
            model.params.session_id = getCurrentSession();
        }
        if (model.params.session_id){
            
            model.qTradeOperationBySession.push({
                operation_sum    : anOrderDetails.orderSum,
                operation_date   : new Date(),
                session_id       : model.params.session_id,
                operation_type   : null //TODO Поменять тип операции
            });
            
            var anWH_items = [];
            model.qTradeOperationsWithItems.params.cash_box_operation_id = model.qTradeOperationBySession.trade_cash_box_operation_id;
            for (var i in anOrderDetails.orderItems) {
                if (anOrderDetails.orderItems[i].itemId && anOrderDetails.orderItems[i].quantity){
                    model.qTradeOperationsWithItems.push({
                        cash_box_operation : model.qTradeOperationsWithItems.params.cash_box_operation_id,
                        trade_item : anOrderDetails.orderItems[i].itemId,
                        items_quantity : anOrderDetails.orderItems[i].quantity
                    });
                    model.qContents.params.trade_item_id = anOrderDetails.orderItems[i].itemId;
                    model.qContents.execute();
                    model.qContents.beforeFirst();
                    while (model.qContents.next()){
                        if (anWH_items[model.qContents.cursor.wh_item]){
                            anWH_items[model.qContents.cursor.wh_item] += model.qContents.cursor.usage_quantity * anOrderDetails.orderItems[i].quantity;
                        } else {
                            anWH_items[model.qContents.cursor.wh_item] = model.qContents.cursor.usage_quantity * anOrderDetails.orderItems[i].quantity;
                        }
                    }
                } else {
                    //alert('Ничего не выбрано');
                }
            }
            
            //TODO посчитать расходники, а не торговые позиции
            
            if (whSession.whMovement(anWH_items, whSession.WH_PRODUCE_ITEMS)){
            } else {
                ep.addEvent('errorAddTradeOperation', anOrderDetails);
            }
        }
        
        
        model.save();
    };

}
