/**
 * 
 * @author Alexey
 */
function OrderList(aParent) {
    var self = this, model = this.model, form = this;
    self.browser = aParent.browser;
    self.orderDetails = {};
    
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
            
            obj.btnAdd = document.createElement("button");
            obj.btnAdd.innerHTML = '<span class="glyphicon glyphicon-plus-sign"></span>';
            obj.btnAdd.className = "addBtn";
            
            obj.btnRemove = document.createElement("button");
            obj.btnRemove.innerHTML = '<span class="glyphicon glyphicon-minus-sign"></span>';
            obj.btnRemove.className = "removeBtn";
            
            obj.btnDelete = document.createElement("button");
            obj.btnDelete.innerHTML = '<span class="glyphicon glyphicon-remove-sign"></span>';
            obj.btnDelete.className = "deleteBtn";
            
            obj.divEl.appendChild(obj.btnAdd);
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
            else this.close();
        };
        
        if (self.browser) {
            obj.btnAdd.onclick = obj.increase;
            obj.btnRemove.onclick = obj.decrease;
            obj.btnDelete.onclick = obj.delete;
        }
        
        obj.show();
        return obj;
    }
    
    if (self.browser) {
        var dockElement = document.createElement('div');
        document.getElementById("actionPanel").appendChild(dockElement);
        dockElement.className = 'baristaOrder';
        dockElement.innerHTML = 
"<h3>Заказ</h3>\
<div id='orderItems'></div><div id='orderDetails'>\n\
<div id='orderSum'>Итого: 0 рублей</div><button id='completeOrder'>Пробить чек</button>\n\
<button id='cancelOrder'>Сбросить</button></div>";
        //self.showOnPanel('orderDetails');
    } else {
        self.showOnPanel(aParent.pnlLeft);
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
        if (!!self.orderDetails[anItemData.item_id]){
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

    function btnOkActionPerformed(evt) {//GEN-FIRST:event_btnOkActionPerformed
        // TODO Добавьте свой код:
    }//GEN-LAST:event_btnOkActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        self.deleteOrder();
    }//GEN-LAST:event_btnCancelActionPerformed
}
