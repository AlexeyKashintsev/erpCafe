/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function OrderListPane(aContainer, anAcceptOrder, aDeleteOrder) {
    var self = this, model = this.model;
    var dockElement = cmn.createElement("div", 'baristaOrder panel panel-primary', aContainer);

    var oPanel = cmn.createElement("div", "", dockElement);
    oPanel.innerHTML =
            "\
            <div class='panel-heading'>\
                <h3 class='panel-title'>Заказ</h3>\n\
            </div>";

    var oliContainer = cmn.createElement("div", "", oPanel, 'orderItems');//document.getElementById('orderItems');
    var oDetails = cmn.createElement("div", "panel-body", oPanel, 'orderDetails');
    var ordSum = cmn.createElement("div", "", oDetails, 'orderSum');

    var btnCancel = cmn.createElement("button", "btnCancel", dockElement);
    btnCancel.innerHTML = 'Отменить';
    btnCancel.onclick = aDeleteOrder;

    var btnAcceptOrder = cmn.createElement("button", "btnOk", dockElement);
    btnAcceptOrder.innerHTML = 'Оплатить';
    btnAcceptOrder.onclick = anAcceptOrder;

    self.updateOrderSum = function(aOrdSum) {
        ordSum.innerHTML = '<h3>Итого: <b>' + aOrdSum + '</b> рублей</h3>';
    };

    self.updateOrderSum(0);
    /**
     * 
     * @param {type} aObject
     * @param {type} aContainer
     * @returns {undefined}
     */
    self.orderItem = function(aObject, aContainer) {
        var container = aContainer ? aContainer : oliContainer;
        var divEl = cmn.createElement("div", "orderItem", container);
        var itemName = cmn.createElement("h4", "itemName", divEl);
        var itemCount = cmn.createElement("h4", "itemCount", divEl);

        var btnRemove = cmn.createElement("button", "removeBtn", divEl);
        btnRemove.innerHTML = '<span class="glyphicon glyphicon-minus"></span>';
        btnRemove.className = "removeBtn";

        var btnDelete = cmn.createElement("button", "deleteBtn", divEl);
        btnDelete.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';

        this.updateText = this.show = function() {
            itemName.innerHTML = aObject.itemName;
            itemCount.innerHTML = aObject.orderQuantity + ' шт. ' + aObject.orderSum + " р.";
        };

        this.stop = false;

        this.delete = function() {
            container.removeChild(divEl);
        };

        divEl.onclick = function() {
            if (!this.stop)
                aObject.increase();
            else
                this.stop = false;
        };

        btnRemove.onclick = function() {
            aObject.decrease();
            this.stop = true;
        };

        btnDelete.onclick = aObject.delete;

        this.show();
    };
}
