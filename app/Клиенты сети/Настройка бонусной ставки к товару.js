/**
 * 
 * @author stipjey
 */
function BonusRateForItemsAdd() {
    var self = this, model = this.model, form = this;
    
    // TODO : place your code here

    function qTradeItemsOnScrolled(evt) {//GEN-FIRST:event_qTradeItemsOnScrolled
        model.qBonusRateForItemsEdit.params.item_id = model.qTradeItems.cursor.trade_items_id;
        model.qBonusRateForItemsEdit.requery(function(){
            if (model.qBonusRateForItemsEdit.length == 0){
                model.qGetBonusCategories.beforeFirst();
                while (model.qGetBonusCategories.next()){
                    model.qBonusRateForItemsEdit.insert();
                    model.qBonusRateForItemsEdit.cursor.trade_item = model.qTradeItems.cursor.trade_items_id;
                    model.qBonusRateForItemsEdit.cursor.client_bonus_category = model.qGetBonusCategories.cursor.client_bonus_category_id;
                }
                model.save();
            }
        });
    }//GEN-LAST:event_qTradeItemsOnScrolled

    function qBonusRateForItemsEditOnChanged(evt) {//GEN-FIRST:event_qBonusRateForItemsEditOnChanged
        model.save();
    }//GEN-LAST:event_qBonusRateForItemsEditOnChanged
}
