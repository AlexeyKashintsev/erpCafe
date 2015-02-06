/**
 * 
 * @author Алексей
 * @name GetItemsByBaristaForm
 * @public
 */

function WHSetAddMovement() {
var MSG_SESSION_CLOSED_ERROR = "Сначала нужно открыть смену!";
var MSG_SET_MOVEMENTS_ERROR  = "Произошла ошибка при добавлении товара!";

var self = this, model = this.model, form = this;
var whSession = session.whSession ? session.whSession : new ServerModule("WhSessionModule");
model.params.trade_point_id = null;
var grid;

var mItems = {};
function itemValueChange(anItemData) {
    if (!mItems[anItemData.id]) {
        mItems[anItemData.id] = {
            value   :   anItemData.value,
            cost    :   null
        };
    } else {
        mItems[anItemData.id].value = anItemData.value;
    }
}

function itemCostChange(anItemData) {
    if (!mItems[anItemData.id]) {
        mItems[anItemData.id] = {
            value   :   null,
            cost    :   anItemData.value
        };
    } else {
        mItems[anItemData.id].cost = anItemData.value;
    }
}

function fillGrid() {
    var items = [];
    model.itemsByTP.forEach(function(anItem) {
        items.push([anItem.item_name, 
            {id: anItem.item_id, editable: true, value: null, onchange: itemValueChange}, ''
            //{id: anItem.item_id, editable: true, value: null, onchange: itemCostChange}
            ]);
    });
    grid.setData(items);
}

function proceed() {
    var items = {};
    for (var j in mItems)
        items[j] = mItems[j].value;
    whSession.setTradePoint(model.params.trade_point_id);
    if (whSession.whMovement(items, whSession.getSelfPropertyValue("WH_ADD_ITEMS"))) {
        new Alerter(null, "alert-success", 'Операция проведена успешно', true, 15000);
        cancel();
    } else {
        new Alerter(null, "alert-danger", 'Операция проведена успешно', true, 15000);
    }
}

function cancel() {
    model.itemsByTP.requery();
}

self.setTradePoint = function(aTradePointId) {
    model.params.trade_point_id = aTradePointId;
};

self.manualShow = function(aContainer) {
    if (!grid) {
        var header = ['Наименование', 'Количество', 'Закупочная цена'];
        grid = new wf.Table(aContainer, header);
        self.container = grid.dockElement;
        if (!model.itemsByTP.empty)
            fillGrid();
        var btnProceed = cmn.createElement('button', 'color green-sea', aContainer);
        btnProceed.innerHTML = 'Провести';
        btnProceed.onclick = proceed;
        var btnClear = cmn.createElement('button', 'color alizarin', aContainer);
        btnClear.innerHTML = 'Отмена';
        btnClear.onclick = cancel;
    }
};

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    //self.setTradePoint(session.tradePoint);
    form.btnProceed.enabled = true;
    if(!model.params.trade_point_id) {
        alert(MSG_SESSION_CLOSED_ERROR);
        form.close();
    }
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing

}//GEN-LAST:event_formWindowClosing

    function btnProceedActionPerformed(evt) {//GEN-FIRST:event_btnProceedActionPerformed
         var items = {};
         model.itemsByTP.beforeFirst();
         while(model.itemsByTP.next()){
             if(model.itemsByTP.cursor.start_value != null) {
                 items[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.start_value;
             }
         }
         whSession.setTradePoint(model.params.trade_point_id);
         if (whSession.whMovement(items, whSession.getSelfPropertyValue("WH_ADD_ITEMS"))) 
            form.close();
         else
             alert(MSG_SET_MOVEMENTS_ERROR);
    }//GEN-LAST:event_btnProceedActionPerformed

    function itemsByTPOnRequeried(evt) {//GEN-FIRST:event_itemsByTPOnRequeried
        if (grid)
            fillGrid();
    }//GEN-LAST:event_itemsByTPOnRequeried
}