/**
 * 
 * @author Alexey
 * @module
 * @public
 */
function OrderList(aParent, aContainer) {
    var self = this, model = this.model, form = this;
    self.orderDetails = {};
    orderList = this;
    
    var orderProcessor = new OrderProcessor();
    var orderChanged = false;
    //var AS = new AdditionalScreen();

    self.calculateOrder = function() {
        var orderSum = 0;
        orderChanged = true;
        for (var i in self.orderDetails) {
            for (var j in self.orderDetails[i])
                orderSum += self.orderDetails[i][j].orderSum;
        }
        self.updateOrderSum(orderSum);
        
        //AS.updateOrder(self, orderSum);
        
        if (aParent.cashBackCalc.shown)
            aParent.cashBackCalc.setPurchaseSum(orderSum);
        return orderSum;
    };

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
        self.calculateOrder();
        //AS.cancelOrder();
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
                        priceType   :   j,
                        price       :   self.orderDetails[i][j].itemCost,
                        cost        :   self.orderDetails[i][j].orderSum
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

    wf.OrderListPane.bind(self)(aContainer ? aContainer : "actionPanel");                                      
}
