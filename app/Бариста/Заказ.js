/**
 * 
 * @author Alexey
 */
function OrderList(aParent) {
    var self = this, model = this.model, form = this;
    self.browser = aParent.browser;
    self.orderDetails = {};
    var lastDiv = null;
    session.clientModule = new ServerModule("ClientServerModule");
    var choiceMethodOfPayment = new ChoiceMethodOfPayment();
    var getPhone = new GetUserPhoneForm();
    
    var client = false;
    var clientPane = null;
    var clientRegPane = null;
    var inpPhone = null;
    var btnSelect = null;
    var clientReg = new ClientRegistrationByBarist();
    
    function checkIfClientPhoneExists() {
        if (inpPhone.value != "") {
            if (session.clientModule.checkIfPhoneExist(inpPhone.value)){
                client = session.clientModule.getClientDataByPhone(inpPhone.value);
                $(clientRegPane).hide();
                $(clientPane).show();
                var clientPhoneDiv = cmn.getElement("div", '', clientPane, "clientPhoneDiv");
                clientPhoneDiv.innerHTML = "Клиент: " + client.firstName;
                var clientBonusDiv = cmn.getElement("div", '', clientPane, "clientBonusDiv");
                clientBonusDiv.innerHTML = "Бонусов: " + client.bonusCount;
             } else {
                 client = null;
                 $(clientPane).hide();
                 $(clientRegPane).show();
                 clientRegPane.innerHTML = "Клиент не найден";
                 var btnRegister = cmn.getElement("button", 'btnRegister', clientRegPane, "btnRegister");
                 btnRegister.innerHTML = "Зарегистрировать";
                 btnRegister.onclick = function() {
                     clientReg.setPhone = inpPhone.value;
                     clientReg.showModal(function(aPhone) {
                         if (inpPhone.value === aPhone) {
                             checkIfClientPhoneExists();
                         } else {
                             inpPhone.value = aPhone;
                         }
                     });
                 };
             }
         } else {
             $(clientPane).hide();
             $(clientRegPane).hide();
             clientPane.innerHTML = "";
         }
    }

    function createClientSelectPane() {
        var dockElement = cmn.createElement("div", 'baristaOrder panel panel-primary', "actionPanel");
        var clientLabel = cmn.createElement("h4", 'clientLabel', dockElement, 'clientLabel');
        clientLabel.innerHTML = "Введите номер телефона клиента";
        inpPhone = cmn.createElement("input", "client-phone-input", dockElement);
        inpPhone.onchange = checkIfClientPhoneExists;
        clientPane = cmn.createElement("div", 'clientInfo', dockElement, "clientPane");
        clientRegPane = cmn.createElement("div", 'clientInfo', dockElement, "clientRegPane");
        $(clientPane).hide();
        $(clientRegPane).hide();
    }

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
    ;

    var unprocessedOrders = new UnprocessedOrders();

    function tradeSessionProcessOrder(anOrderDetails, alert, attempt) {
        session.tradeSession.processOrder(anOrderDetails, function() {
            alerter(alert, "alert-success", "<h4>Заказ успешно проведен</h4>Сумма заказа: <strong>"
                    + anOrderDetails.orderSum + " рублей </strong>", true, 15000);
            document.getElementById("clientPane").innerHTML = "";
            client = null;
        }, function() {
            if (attempt < 5)
                processOrder(anOrderDetails, alert, attempt);
            else {
                alerter(alert, "alert-danger", "<h4>Заказ не проведен</h4>Проверьте связь с сервером", true, 15000);
                unprocessedOrders.addOrder(anOrderDetails);
            }
        });
    }

    function processOrder(anOrderDetails, anAlert, anAttempt) {
        var attempt = anAttempt ? anAttempt : 0;
        attempt++;
        Logger.info("Отправка данных заказа на сервер попытка №" + attempt);
        var alert = alerter(anAlert, "alert-info", "<h4>Обработка заказа</h4>Попытка № " + attempt, false);
        anOrderDetails.methodOfPayment = "money";
        //Если сумма заказа покрывается бонусами на счету, то предложить оплату бонусами
        if (anOrderDetails.orderSum <= client.bonusCount) {
            choiceMethodOfPayment.showModal(function(aResult) {
                anOrderDetails.methodOfPayment = aResult;
                tradeSessionProcessOrder(anOrderDetails, alert, attempt);
            });
        } else {
            tradeSessionProcessOrder(anOrderDetails, alert, attempt);
        }
//        self.tradeSession.processOrder(anOrderDetails, function() {
//            alerter(alert, "alert-success", "<h4>Заказ успешно проведен</h4>Сумма заказа: <strong>"
//                + anOrderDetails.orderSum + " рублей </strong>", true, 15000);
//            document.getElementById("clientPane").innerHTML = "";
//        }, function() {
//            if (attempt < 5)
//                processOrder(anOrderDetails, alert, attempt);
//            else {
//                alerter(alert, "alert-danger", "<h4>Заказ не проведен</h4>Проверьте связь с сервером", true, 15000);
//                unprocessedOrders.addOrder(anOrderDetails);
//            }
//        });
    }

    function orderItem(anItemData) {
        var obj = {};
        if (self.browser) {
            obj.docDiv = document.getElementById("orderItems");
            obj.divEl = document.createElement("div");
            obj.divEl.className = "orderItem";
            obj.docDiv.appendChild(obj.divEl);

            obj.label = document.createElement("h4");
            obj.divEl.appendChild(obj.label);
            obj.label.className = "itemName";

            obj.count = document.createElement("h4");
            obj.divEl.appendChild(obj.count);
            obj.count.className = "itemCount";

            /*    obj.sum = document.createElement("h4");
             obj.divEl.appendChild(obj.sum);
             obj.sum.className = "itemSum";*/

            /*obj.btnAdd = document.createElement("button");
             obj.btnAdd.innerHTML = '<span class="glyphicon glyphicon-plus"></span>';
             obj.btnAdd.className = "addBtn";
             obj.divEl.appendChild(obj.btnAdd);*/

            obj.btnRemove = document.createElement("button");
            obj.btnRemove.innerHTML = '<span class="glyphicon glyphicon-minus"></span>';
            obj.btnRemove.className = "removeBtn";

            obj.btnDelete = document.createElement("button");
            obj.btnDelete.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
            obj.btnDelete.className = "deleteBtn";

            obj.divEl.appendChild(obj.btnRemove);
            obj.divEl.appendChild(obj.btnDelete);

            obj.updateText = obj.show = function() {
                obj.label.innerHTML = obj.itemName;
                obj.count.innerHTML = obj.orderQuantity + ' шт. ' + obj.orderSum + " р.";
                //  obj.sum.innerHTML = obj.orderSum + " р.";
                obj.parent.calculateOrder();
            };
        } else
            obj = new OrderDetail(anItemData);
        obj.orderQuantity = 1;
        obj.itemId = anItemData.item_id;
        obj.itemName = anItemData.item_name;
        obj.itemCost = anItemData.item_cost;
        obj.orderSum = anItemData.item_cost;
        obj.parent = self;
        obj.stop = false;

        obj.increase = function() {
            obj.orderSum = ++obj.orderQuantity * obj.itemCost;
            obj.updateText();
        };

        obj.decrease = function() {
            if (obj.orderQuantity > 1)
                obj.orderSum = --obj.orderQuantity * obj.itemCost;
            else
                self.delete();
            obj.updateText();
        };

        obj.delete = function() {
            obj.orderSum = obj.orderQuantity = 0;
            delete(obj.parent.orderDetails[obj.itemId]);
            obj.parent.pnlOrderList.remove(obj.panel);
            obj.parent.calculateOrder();
            if (self.browser)
                obj.docDiv.removeChild(obj.divEl);
            else
                this.close();
        };

        if (self.browser) {
            // obj.btnAdd.onclick = obj.increase;
            obj.divEl.onclick = function() {
                if (!obj.stop)
                    obj.increase();
                else
                    obj.stop = false;
            };
            obj.btnRemove.onclick = function() {
                obj.decrease();
                obj.stop = true;
            };
            obj.btnDelete.onclick = obj.delete;
        }

        obj.show();
        return obj;
    }

    self.calculateOrder = function() {
        var orderSum = 0;
        for (var i in self.orderDetails) {
            orderSum += self.orderDetails[i].orderSum;
        }
        if (self.browser) {
            document.getElementById("orderSum").innerHTML = '<h3>Итого: <b>' + orderSum + '</b> рублей</h3>';
        }
        else
            form.lbOrderSum.text = orderSum + ' р.';
        return orderSum;
    };

    self.addItem = function(anItemData) {
        if (!!self.orderDetails[anItemData.item_id]) {
            self.orderDetails[anItemData.item_id].increase();
        } else {
            self.orderDetails[anItemData.item_id] = orderItem(anItemData);
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
            clientData: client
        };
        var ic = 0;

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
        if (ic > 0) {
            processOrder(anOrderDetails);
            self.deleteOrder();
        } else {
            alert("Ничего не выбрано");
        }
    };

    function createOrderListPane() {
        var dockElement = cmn.createElement("div", 'baristaOrder panel panel-primary', "actionPanel");

        var newHTMLElement = document.createElement('div');
        newHTMLElement.innerHTML =
                "<div class='panel-heading'><h3 class='panel-title'>Заказ</h3></div>\
<div id='orderItems'></div><div id='orderDetails'>\
<div class='panel-body'>\
<div id='orderSum'>Итого: 0 рублей</div>\
</div>";
        dockElement.appendChild(newHTMLElement);

        var newHTMLElement = document.createElement('button');
        newHTMLElement.innerHTML = 'Отменить';
        newHTMLElement.className = 'btnCancel';
        newHTMLElement.onclick = self.deleteOrder;
        dockElement.appendChild(newHTMLElement);

        newHTMLElement = document.createElement('button');
        newHTMLElement.innerHTML = 'Пробить чек';
        newHTMLElement.className = 'btnOk';
        dockElement.appendChild(newHTMLElement);
        newHTMLElement.onclick = self.acceptOrder;
    }

    createClientSelectPane();
    createOrderListPane();

    function btnOkActionPerformed(evt) {
        //setPhone.tradeSession = session.tradeSession;
        //setPhone.showModal();
        self.acceptOrder();
    }
    
    function btnOkActionPerformed(evt) {//GEN-FIRST:event_btnOkActionPerformed
        goAcceptOrder();
    }//GEN-LAST:event_btnOkActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        self.deleteOrder();
    }//GEN-LAST:event_btnCancelActionPerformed
}
