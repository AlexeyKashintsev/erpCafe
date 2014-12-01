/**
 * 
 * @author Alexey
 */
function OrderList(aParent) {
    var self = this, model = this.model, form = this;
    self.orderDetails = {};
    var clientSelector = new ClientPhoneSelector();
    var choiceMethodOfPayment = new ChoiceMethodOfPayment();
    var orderProcessor = new OrderProcessor();
    var orderChanged = false;

    self.calculateOrder = function() {
        var orderSum = 0;
        orderChanged = true;
        for (var i in self.orderDetails) {
            orderSum += self.orderDetails[i].orderSum;
        }
        document.getElementById("orderSum").innerHTML = '<h3>Итого: <b>' + orderSum + '</b> рублей</h3>';
        
        if (typeof(MenuWindow) !== "undefined") {
            MenuWindow.setOrder(self, orderSum);
        }
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
    
    var acceptOrderClick = 0;
    self.acceptOrder = function(aPayDetails) {
        if (orderChanged) {
            var orderSum = self.calculateOrder();
            orderChanged = false;
            acceptOrderClick = 0;
        }
        acceptOrderClick++;
        if (acceptOrderClick < 2) {
            aParent.cashBackCalc.show();
            aParent.cashBackCalc.setPurchaseSum(orderSum);
        } else {
            aPayDetails = aPayDetails ? aPayDetails : aParent.cashBackCalc.getPaymentMethod();
        }
    };

    self.acceptOrderOld = function() {
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
            //Если сумма заказа покрывается бонусами на счету, то предложить оплату бонусами
            if (anOrderDetails.orderSum <= anOrderDetails.clientData.bonusCount) {
                choiceMethodOfPayment.showModal(function(aResult) {
                    anOrderDetails.methodOfPayment = aResult ? aResult : "money";
                    orderProcessor.processOrder(anOrderDetails);
                });
            } else {
                anOrderDetails.methodOfPayment = "money";
                orderProcessor.processOrder(anOrderDetails);
            }
        } else {
            alert("Ничего не выбрано");
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
