/**
 * 
 * @author Work
 * @module
 * @public 
 */
function ServerModuleForTests() {
    var self = this, model = this.model;
    
   self.checkItem = function(data){
        model.tradeItemsByTP.params.actual_date = new Date();
        model.tradeItemsByTP.params.franchazi_id = 1;
        model.tradeItemsByTP.params.item_id = data.id;
        model.tradeItemsByTP.params.trade_point_id = data.tp;
        model.tradeItemsByTP.requery();
        if (model.tradeItemsByTP.length > 0){
            return true;
        } else {
            return false;
        }
    };
    
    self.checkOperationsSum = function(aSession, aTP){
        model.tradeSessionDetails.params.session_id = aSession;
        model.tradeSessionDetails.params.trade_point_id = aTP;
        model.tradeSessionDetails.requery();
        return model.tradeSessionDetails.cursor.operationsSum;
    }
    
    self.changeInCashBoxBalance = function(aSession){
        if (aSession){
            model.qTradeSessionBalance.params.trade_session = aSession;
            model.qTradeSessionBalance.requery();
            return model.qTradeSessionBalance.cursor.end_value - model.qTradeSessionBalance.cursor.start_value;
        } else {
            return false;
        }
    };
    
    self.getItemsFromTradePoint = function(aTP){
        var out = [];
        model.itemsByTP.params.trade_point_id = aTP;
        model.itemsByTP.requery();
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()){
            out[model.itemsByTP.cursor.item_id] = 100;
        }
        return out;
    };
}
