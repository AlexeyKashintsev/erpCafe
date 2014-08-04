/**
 * 
 * @author Alexey
 */
function OrderList() {
    var self = this, model = this.model, form = this;
    self.orderDetails = {};
    self.tradeSession = null;
    
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
    
    self.acceptOrder = function() {
        var anOrderDetails = {
            orderSum : 0,
            orderItems : []
        };
        
        if (self.orderDetails){
            for (var i in self.orderDetails) {
                anOrderDetails.orderSum += self.orderDetails[i].orderSum;
                anOrderDetails.orderItems.push({
                    itemId : self.orderDetails[i].itemId,
                    quantity : self.orderDetails[i].orderQuantity
                });
            }
        }
        self.tradeSession.processOrder(anOrderDetails);
    };

    function btnOkActionPerformed(evt) {//GEN-FIRST:event_btnOkActionPerformed
        self.acceptOrder();
    }//GEN-LAST:event_btnOkActionPerformed
}
