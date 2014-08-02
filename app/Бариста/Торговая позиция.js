/**
 * 
 * @author Alexey
 */
function ProductItem() {
    var self = this, model = this.model, form = this;
    self.data = {};

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        form.lbItemName.text = self.data.item_name;
        form.lbItemCost.text = self.data.item_cost + " р.";
        form.lbItemType.text = self.data.type_name;
        form.lbQuantity.text = "";
    }//GEN-LAST:event_formWindowOpened
}
