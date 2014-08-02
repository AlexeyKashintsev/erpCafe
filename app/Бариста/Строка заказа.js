/**
 * 
 * @author Alexey
 * @rolesAllowed barista
 */
function OrderDetail() {
    var self = this, model = this.model, form = this;
    
    self.orderQuantity = 0;
    self.itemId = null;
    self.itemName = '';
    self.itemCost = 0;
    self.orderSum = 0;
    self.parent = null;
    
    function updateText() {
        form.lbItemName.text = self.itemName ;
        form.lbItemQuantity.text = self.orderQuantity;
        form.lbSum.text = self.orderSum;
    }

    function btnRemoveActionPerformed(evt) {//GEN-FIRST:event_btnRemoveActionPerformed
        if (self.orderQuantity > 0)
            self.orderSum = --self.orderQuantity * self.itemCost;
    }//GEN-LAST:event_btnRemoveActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        self.orderSum = ++self.orderQuantity * self.itemCost;
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDeleteActionPerformed(evt) {//GEN-FIRST:event_btnDeleteActionPerformed
        self.orderSum = self.orderQuantity = 0;
        self.parent.deleteItemFromOrder(self.itemId);
        form.close();
    }//GEN-LAST:event_btnDeleteActionPerformed
}
