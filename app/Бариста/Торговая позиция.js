/**
 * 
 * @author Alexey
 */
function ProductItem(aParent) {
    var self = this, model = this.model, form = this;
    self.parent = aParent;
    self.data = {};

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        form.lbItemName.text = self.data.item_name;
        form.lbItemCost.text = self.data.item_cost + " р.";
        form.lbItemType.text = self.data.type_name;
        form.lbQuantity.text = "";
    }//GEN-LAST:event_formWindowOpened

    function addToOrder(evt) {//GEN-FIRST:event_addToOrder
        self.parent.orderList.addItem(self.data);
    }//GEN-LAST:event_addToOrder
}
