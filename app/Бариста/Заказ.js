/**
 * 
 * @author Alexey
 */
function OrderList(aParent) {
    var self = this, model = this.model, form = this;
    self.orderDetails = {};
    var lastDiv = null;
    var clientSelector = new ClientPhoneSelector();
    var choiceMethodOfPayment = new ChoiceMethodOfPayment();
    


    function alerter(anAlert, aType, aText, aClosable, aCloseTimeOut) {
        if (!anAlert) {
            var divEl = cmn.createElement("div", "alert " + aType, "actionPanel", null, lastDiv ? lastDiv : false);
            divEl.role = "alert";
            lastDiv = divEl;
        } else {
            divEl = anAlert;
            if (aType)
                divEl.className = "alert " + aType;
        }

        divEl.innerHTML = aText;

        function closeIt() {
            divEl.parentNode.removeChild(divEl);
            if (lastDiv === divEl)
                lastDiv = null;
        }

        if (aClosable)
            divEl.onclick = closeIt;

        if (aCloseTimeOut)
            setTimeout(closeIt, aCloseTimeOut);

        return divEl;
    }

    function UnprocessedOrders() {
        var orders = [];
        var divEl = null;

        function processOrders() {
            for (var j in orders) {
                processOrder(orders[j]);
            }
            orders = [];
            alerter(divEl, false, "", false, 1);
            divEl = null;
        }

        this.addOrder = function(anOrderDetails) {
            orders.push(anOrderDetails);
            divEl = alerter(divEl, "alert-warning", "<h4>Нажмите, чтобы отправить снова</h4>Не обработано заказов: " + orders.length, false, false);
            divEl.onclick = processOrders;
        };
    }

    var unprocessedOrders = new UnprocessedOrders();

    function processOrder(anOrderDetails, anAlert, anAttempt) {
        var attempt = anAttempt ? anAttempt : 0;
        attempt++;
        Logger.info("Отправка данных заказа на сервер попытка №" + attempt);
        var alert = alerter(anAlert, "alert-info", "<h4>Обработка заказа</h4>Попытка № " + attempt, false);
        session.tradeSession.processOrder(anOrderDetails, function() {
                alerter(alert, "alert-success", "<h4>Заказ успешно проведен</h4>Сумма заказа: <strong>"
                        + anOrderDetails.orderSum + " рублей </strong>", true, 15000);
            }, function() {
                if (attempt < 5)
                    processOrder(anOrderDetails, alert, attempt);
                else {
                    alerter(alert, "alert-danger", "<h4>Заказ не проведен</h4>Проверьте связь с сервером", true, 15000);
                    unprocessedOrders.addOrder(anOrderDetails);
                }
            });
    }

    self.calculateOrder = function() {
        var orderSum = 0;
        for (var i in self.orderDetails) {
            orderSum += self.orderDetails[i].orderSum;
        }
        document.getElementById("orderSum").innerHTML = '<h3>Итого: <b>' + orderSum + '</b> рублей</h3>';
        return orderSum;
    };

    self.addItem = function(anItemData) {
        if (!!self.orderDetails[anItemData.item_id]) {
            self.orderDetails[anItemData.item_id].increase();
        } else {
            self.orderDetails[anItemData.item_id] = widgetCreator.orderItem(anItemData, self);
            self.calculateOrder();
        }
    };

    self.deleteOrder = function() {
        for (var i in self.orderDetails)
            self.orderDetails[i].delete();
    };

    self.acceptOrder = function() {
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
                    processOrder(anOrderDetails);
                });
            } else {
                anOrderDetails.methodOfPayment = "money";
                processOrder(anOrderDetails);
            }
        } else {
            alert("Ничего не выбрано");
        }
    };

    clientSelector.show("actionPanel"); //createClientSelectPane();
    widgetCreator.createOrderListPane();

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
