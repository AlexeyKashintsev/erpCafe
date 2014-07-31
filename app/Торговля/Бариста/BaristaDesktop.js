/**
 * 
 * @author Alexey
 */
function BaristaDesktop() {
    var self = this, model = this.model, form = this;
    self.tradeItems = {};
    
    model.tradeItemsByTradePointWithCost.params.franchazi_id = 1;
    model.tradeItemsByTradePointWithCost.params.trade_point_id = 4;
    model.tradeItemsByTradePointWithCost.params.actual_date = new Date();
    
    var orderList = new OrderList();
    orderList.showOnPanel(form.pnlLeft);
    model.tradeItemsByTradePointWithCost.execute();

    function tradeItemsByTradePointWithCostOnRequeried(evt) {//GEN-FIRST:event_tradeItemsByTradePointWithCostOnRequeried
        model.tradeItemsByTradePointWithCost.beforeFirst();
        while (model.tradeItemsByTradePointWithCost.next()) {
             var itemForm = new ProductItem();
             var itemPanel = new AnchorsPane();
             itemForm.data = model.tradeItemsByTradePointWithCost.cursor;
             self.tradeItems[model.tradeItemsByTradePointWithCost.item_id] = itemForm;
             itemForm.showOnPanel(itemPanel);
             form.pnlRigth.add(itemPanel);
        }
    }//GEN-LAST:event_tradeItemsByTradePointWithCostOnRequeried
}
