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
        tradeModule.setCost4TradeItemFromJSON(model.qPriceTypeForTradeItem);
        model.requery();
    }//GEN-LAST:event_buttonActionPerformed
}
