/**
 * 
 * @author Alexey
 * @rolesAllowed barista
 */
function OrderDetail(anItemData, aParent) {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    self.show = function() {
        if (self.parent.browser) {
            var dockPanel = document.getElementById('orderItems');
            form.width = dockPanel.offsetWidth;
            self.panel = document.createElement('div');
            form.showOnPanel(self.panel);
            dockPanel.appendChild(self.panel);
        } else {
            self.panel = new AnchorsPane();
            form.showOnPanel(self.panel);
            self.parent.pnlOrderList.add(self.panel);
        }
        self.updateText();
    };
    
    self.updateText = function() {
        form.lbItemName.text = self.itemName ;
        form.lbItemQuantity.text = self.orderQuantity;
        form.lbSum.text = self.orderSum;
        self.parent.calculateOrder();
    };

    form.btnRemove.onActionPerformed = function(evt) {//GEN-FIRST:event_btnRemoveActionPerformed
        self.decrease();
    }//GEN-LAST:event_btnRemoveActionPerformed

    form.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        self.increase();
    }//GEN-LAST:event_btnAddActionPerformed

    form.btnDelete.onActionPerformed = function(evt) {//GEN-FIRST:event_btnDeleteActionPerformed
        self.delete();
    }//GEN-LAST:event_btnDeleteActionPerformed
    
    self.show = function() {
        form.show();
    };
}
