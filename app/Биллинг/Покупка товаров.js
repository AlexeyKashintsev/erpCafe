/**
 * 
 * @author minya92
 */
function BillBuyItems() {
    var self = this, model = this.model, form = this;
    
    self.cost = 0; self.items = [];

    function qItemBillCostOnChanged(evt) {//GEN-FIRST:event_qItemBillCostOnChanged
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
        form.tfCost.text = "Сумма заказа: " + self.cost;
    }//GEN-LAST:event_qItemBillCostOnChanged
}
