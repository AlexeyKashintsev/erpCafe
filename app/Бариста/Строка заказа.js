/**
 * 
 * @author Alexey
 * @rolesAllowed barista
 */
function OrderDetail(anItemData, aParent) {
    var self = this, model = this.model, form = this;
    
    self.orderQuantity = 1;
    self.itemId = anItemData.item_id;
    self.itemName = anItemData.item_name;
    self.itemCost = anItemData.item_cost;
    self.orderSum = anItemData.item_cost;
    self.parent = aParent;
    
    self.panel = new AnchorsPane();
    form.showOnPanel(self.panel);
    self.parent.pnlOrderList.add(self.panel);
    
    self.increase = function() {
        self.orderSum = ++self.orderQuantity * self.itemCost;
        updateText();
    };
    
    self.decrease = function() {
        if (self.orderQuantity > 1)
            self.orderSum = --self.orderQuantity * self.itemCost;
        else
            self.delete();
        updateText();
    };
    
    self.delete = function() {
        self.orderSum = self.orderQuantity = 0;
        delete(self.parent.orderDetails[self.itemId]);
        self.parent.pnlOrderList.remove(self.panel);
        self.parent.calculateOrder();
        form.close();
    };
    
    function updateText() {
        form.lbItemName.text = self.itemName ;
        form.lbItemQuantity.text = self.orderQuantity;
        form.lbSum.text = self.orderSum;
        self.parent.calculateOrder();
    }

    function btnRemoveActionPerformed(evt) {//GEN-FIRST:event_btnRemoveActionPerformed
        self.decrease();
    }//GEN-LAST:event_btnRemoveActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        self.increase();
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDeleteActionPerformed(evt) {//GEN-FIRST:event_btnDeleteActionPerformed
        self.delete();
    }//GEN-LAST:event_btnDeleteActionPerformed
    
    updateText();
}
