/**
 * 
 * @author stipjey
 */
function BonusRateForItemsAdd() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    // TODO : place your code here

    model.qTradeItems.onScrolled = function(evt) {//GEN-FIRST:event_qTradeItemsOnScrolled
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

    model.qBonusRateForItemsEdit.onChanged = function(evt) {//GEN-FIRST:event_qBonusRateForItemsEditOnChanged
        model.save();//TODO Кнопка сохранить. Вообще, для таких форм есть шаблон
    }//GEN-LAST:event_qBonusRateForItemsEditOnChanged
    
    self.show = function() {
        form.show();
    };
}
