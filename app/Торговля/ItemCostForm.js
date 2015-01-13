/**
 * 
 * @author Work
 */
function ItemCostForm() {
    var self = this, model = this.model, form = this;
    var tradeModule = new ServerModule("TradeAdminModule");
    
    self.setItem = function (anItemId){
        model.qPriceTypeForTradeItem.params.item_id = anItemId;
        model.qPriceTypeForTradeItem.params.actual_date = new Date();
        model.qPriceTypeForTradeItem.params.trade_point = session.tradePoint;
        model.requery();
    };
    
                                    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        
        var obj = {
            item_id     :   model.qPriceTypeForTradeItem.params.item_id,
            trade_point :   model.qPriceTypeForTradeItem.params.trade_point,
            costs       :   []
        };
        
        model.qPriceTypeForTradeItem.beforeFirst();
        while (model.qPriceTypeForTradeItem.next()){
            obj.costs[model.qPriceTypeForTradeItem.cursor.trade_price_types_id] = model.qPriceTypeForTradeItem.cursor.item_cost;
        };
        
        tradeModule.setCost4TradeItemFromJSON(obj);
        model.requery();
    }//GEN-LAST:event_buttonActionPerformed
}
