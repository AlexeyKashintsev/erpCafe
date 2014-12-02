/**
 * 
 * @author Alexey
 */
function OrderList(aParent) {
    var self = this, model = this.model, form = this;
    self.orderDetails = {};
    var clientSelector = new ClientPhoneSelector(aParent);
    var orderProcessor = new OrderProcessor();
    var orderChanged = false;

    self.calculateOrder = function() {
        var orderSum = 0;
        orderChanged = true;
        for (var i in self.orderDetails) {
            orderSum += self.orderDetails[i].orderSum;
        }
        document.getElementById("orderSum").innerHTML = '<h3>Итого: <b>' + orderSum + '</b> рублей</h3>';
        
        try {
            if (!!MenuWindow) {
                MenuWindow.setOrder(self, orderSum);
            }
        } catch (e) {
            Logger.info('No MenuWindow!');
        }
        if (aParent.cashBackCalc.shown)
            aParent.cashBackCalc.setPurchaseSum(orderSum);
        return orderSum;
    };

    self.addItem = function(anItemData) {
        if (!!self.orderDetails[anItemData.item_id]) {
            self.orderDetails[anItemData.item_id].increase();
        } else {
            self.orderDetails[anItemData.item_id] = odp.orderItem(anItemData, self);
            self.calculateOrder();
        }
    };

    self.deleteOrder = function() {
        for (var i in self.orderDetails)
            self.orderDetails[i].delete();
        aParent.cashBackCalc.hide();
        //TODO MenuWindow.location = "as_welcome.html";
    };
    
    self.acceptOrder = function() {
        if (orderChanged) {
            var orderSum = self.calculateOrder();
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
                clientData: clientSelector.getClient(),
                session_id: session.activeSession
            };
            var ic = 0;//items count

            if (self.orderDetails) {              
                for (var i in self.orderDetails) {
                    anOrderDetails.orderSum += self.orderDetails[i].orderSum;
                    anOrderDetails.orderItems.push({
                        itemId: self.orderDetails[i].itemId,
                        quantity: self.orderDetails[i].orderQuantity
                    });
                    ic++;
                }
            }
            clientSelector.clearClient();
            self.deleteOrder();
            if (ic > 0) {
                anOrderDetails.methodOfPayment = aPayDetails.paymentMethod;//"money";
                orderProcessor.processOrder(anOrderDetails);
            } else {
                alert("Ничего не выбрано");
            }
        }
    };

    clientSelector.show("actionPanel"); //createClientSelectPane();
    var odp = new widgetCreator.OrderListPane(self);

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
