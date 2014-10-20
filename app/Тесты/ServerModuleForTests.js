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
    
    self.changeInCashBoxBalance = function(aSession){
        model.qTradeSessionBalance.params.trade_session = aSession;
        model.qTradeSessionBalance.requery();
        return model.qTradeSessionBalance.cursor.end_value - model.qTradeSessionBalance.cursor.start_value;
    };
    
    self.getItemsFromTradePoint = function(aTP){
        var out = [];
        var i = 0;
        model.itemsByTP.params.trade_point_id = aTP;
        model.itemsByTP.requery();
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()){
            out[model.itemsByTP.cursor.item_id] = 100;
        }
    };
}
