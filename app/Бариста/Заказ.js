/**
 * 
 * @author Alexey
 */
function OrderList() {
    var self = this, model = this.model, form = this;
    self.orderDetails = {};
    
    self.calculateOrder = function() {
        var orderSum = 0;
        for (var i in self.orderDetails) {
            orderSum += self.orderDetails[i].orderSum;
        }
        form.lbOrderSum.text = orderSum + ' р.';
        return orderSum;
    };
    
    self.addItem = function(anItemData) {
        if (!!self.orderDetails[anItemData.item_id]){
            self.orderDetails[anItemData.item_id].increase();
        } else {
            self.orderDetails[anItemData.item_id] = new OrderDetail(anItemData, self);
            self.calculateOrder();
        }
    };

    function btnOkActionPerformed(evt) {//GEN-FIRST:event_btnOkActionPerformed
        // TODO Добавьте свой код:
    }//GEN-LAST:event_btnOkActionPerformed
}
