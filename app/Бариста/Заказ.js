/**
 * 
 * @author Alexey
 */
function OrderList(aParent) {
    var self = this, model = this.model, form = this;
    self.orderDetails = {};
    
    var orderProcessor = new OrderProcessor();
    var orderChanged = false;
    //var AS = new AdditionalScreen();

    function calculateOrder() {
        var orderSum = 0;
        orderChanged = true;
        for (var i in self.orderDetails) {
            for (var j in self.orderDetails[i])
                orderSum += self.orderDetails[i][j].orderSum;
        }
        odp.updateOrderSum(orderSum);
        
        //AS.updateOrder(self, orderSum);
        
        if (aParent.cashBackCalc.shown)
            aParent.cashBackCalc.setPurchaseSum(orderSum);
        return orderSum;
    };
    
    function OrderItem(anItemData, aPriceType, aPrice) {
        var ordItem = this;
        
        ordItem.orderQuantity = 0;
        ordItem.itemId = anItemData.item_id;
        ordItem.itemName = anItemData.item_name;
        ordItem.itemCost = aPrice ? aPrice : anItemData.item_cost;
        ordItem.PriceType = aPriceType;
        ordItem.orderSum = 0;
        
        ordItem.increase = function() {
            ordItem.orderSum = ++ordItem.orderQuantity * ordItem.itemCost;
            ordItem.view.updateText();
            calculateOrder();
        };
        
        ordItem.decrease = function() {
            if (ordItem.orderQuantity > 1)
                ordItem.orderSum = --ordItem.orderQuantity * ordItem.itemCost;
            else
                ordItem.delete();
            ordItem.view.updateText();
            calculateOrder();
        };
        
        ordItem.delete = function(aWORecalc) {
            ordItem.orderSum = ordItem.orderQuantity = 0;
            delete(self.orderDetails[ordItem.itemId]);
            ordItem.view.delete();
            if (!!aWORecalc) calculateOrder();
        };
        
        ordItem.view = new odp.orderItem(ordItem);
    }

    self.addItem = function(anItemData, aPriceType, aPrice) {
        if (!self.orderDetails[anItemData.item_id]) {
            self.orderDetails[anItemData.item_id] = {};
        }
        if (!self.orderDetails[anItemData.item_id][aPriceType]) {
            self.orderDetails[anItemData.item_id][aPriceType] = new OrderItem(anItemData, aPriceType, aPrice);
        }
        self.orderDetails[anItemData.item_id][aPriceType].increase();
    };

    self.deleteOrder = function() {
        for (var i in self.orderDetails) {
            for (var j in self.orderDetails[i])
                self.orderDetails[i][j].delete(true);
        }
        self.orderDetails = {};
        aParent.cashBackCalc.hide();
        calculateOrder();
        //AS.cancelOrder();
    };
    
    self.acceptOrder = function() {
        if (orderChanged) {
            var orderSum = calculateOrder();
            aParent.cashBackCalc.setPurchaseSum(orderSum);
        }
        
        var pm = aParent.cashBackCalc.getPaymentMethod();
        if (!orderChanged || orderSum > 0) {
            orderChanged = false;
            if (!pm) {
                if (!aParent.cashBackCalc.shown)
                    aParent.cashBackCalc.show();
            } else {
                self.acceptOrderFinal(pm);
            }
        } else {
            aParent.cashBackCalc.hide();
        }
    };

    self.acceptOrderFinal = function(aPayDetails) {
        if (aPayDetails) {
            var anOrderDetails = {
                orderSum: 0,
                orderItems: [],
                clientData: aParent.clientSelector.getClient(),
                session_id: session.activeSession
            };
            var ic = 0;//items count
           
            for (var i in self.orderDetails) {
                for (var j in self.orderDetails[i]) {
                    anOrderDetails.orderSum += self.orderDetails[i][j].orderSum;
                    anOrderDetails.orderItems.push({
                        itemId      :   self.orderDetails[i][j].itemId,
                        quantity    :   self.orderDetails[i][j].orderQuantity,
                        priceType   :   j
                    });
                    ic++;
                }
            }
            aParent.clientSelector.clearClient();
            self.deleteOrder();
            if (ic > 0) {
                anOrderDetails.methodOfPayment = aPayDetails.paymentMethod;//"money";
                orderProcessor.processOrder(anOrderDetails);
            } else {
                alert("Ничего не выбрано");
            }
        }
    };

    
    var odp = new OrderListPane("actionPanel", self.acceptOrder, self.deleteOrder);

    function btnOkActionPerformed(evt) {
        self.acceptOrder();
    }
    
    function btnOkActionPerformed(evt) {//GEN-FIRST:event_btnOkActionPerformed
        goAcceptOrder();
    }//GEN-LAST:event_btnOkActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        self.deleteOrder();
    }//GEN-LAST:event_btnCancelActionPerformed
}
