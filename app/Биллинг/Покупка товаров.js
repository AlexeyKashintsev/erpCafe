/**
 * 
 * @author minya92
 */
function BillBuyItems() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    //var detalizeBillForm = new _DetalizeBillForm();
    self.cost = 0; self.items = [];
    model.params.account_id = 0;
    
    self.setAccountId = function(anAccountId){
        model.params.account_id = anAccountId;
        model.requery();
    };
    
    model.qItemBillCost.onChanged = function(evt) {//GEN-FIRST:event_qItemBillCostOnChanged
        if(evt.propertyName == "selected"){
            if(evt.newValue){
                self.items[evt.source.wh_items_id] = {
                    item_id: evt.source.wh_items_id,
                    name: evt.source.item_name,
                    cost: evt.source.item_cost,
                };
                if(evt.source.item_count)
                     self.items[evt.source.wh_items_id].count = evt.source.item_count;
                else self.items[evt.source.wh_items_id].count = 1;
            } else {
                delete(self.items[evt.source.wh_items_id]);
            }
        }
        if(evt.propertyName == "item_count"){
            if(evt.source.selected)
                self.items[evt.source.wh_items_id].count = evt.newValue;
        }
        self.cost = 0;
        for(var id in self.items){
            self.cost += self.items[id].cost * self.items[id].count;
        }
        form.tfSum.text = "Сумма на счету: " + model.qBillAccount.cursor.currnt_sum;
        form.tfCost.text = "Сумма заказа: " + self.cost; 
        var lost = model.qBillAccount.cursor.currnt_sum * 1 - self.cost * 1;
        form.tfLost.text = "Остаток на счету: " + lost;
    }//GEN-LAST:event_qItemBillCostOnChanged

    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
//        detalizeBillForm.setSum(self.cost);
//        detalizeBillForm.setItems(self.items);
//        detalizeBillForm.setAccountId(model.params.account_id);
//        detalizeBillForm.showModal();
    }//GEN-LAST:event_buttonActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        form.tfSum.text = "Сумма на счету: " + model.qBillAccount.cursor.currnt_sum;
        form.tfCost.text = "Сумма заказа: " + self.cost; 
        var lost = model.qBillAccount.cursor.currnt_sum * 1 - self.cost * 1;
        form.tfLost.text = "Остаток на счету: " + lost;
    }//GEN-LAST:event_formWindowOpened
    
    self.show = function() {
        form.show();
    };
}
