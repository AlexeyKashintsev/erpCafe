/**
 * 
 * @author Алексей
 * @name WhRevisionByBarista
 * @public
 */

function WhRevisionByBarista_1() {

var self = this, model = this.model, form = this;
var warehouseFunctions = new ServerModule("WarehouseFunctions");
model.params.trade_point_id = 4;
model.params.session_id = null;

self.setTradePointId = function(aTradePointId) {
     model.params.trade_point_id = aTradePointId;
};

self.sess = {};
self.sessClosed = false;

var isSelectForm = true;
var isEditable = true;
var canSetEdit = true;

function setEdit(){
    self.modelGrid.editable = self.btnAdd.enabled = 
            self.btnDel.enabled = self.btnSave.enabled = isEditable;    
    self.btnAddParent.enabled = isEditable;
    self.tbSetEdit.visible = canSetEdit;
    self.tbSetEdit.selected = isEditable;
}

function setElShown(){
    setEdit();
    if (!isSelectForm){
        self.pnlSelLock.visible = false;
    }
}

function ModelSave(){
    var items = [];
    model.itemsByTP.beforeFirst();
    while(model.itemsByTP.next()){
        items[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.start_value;
    }
    self.sess.items = warehouseFunctions.AddItems(self.sess.id, items);
}

function ModelRequery(){
    if(!self.sessClosed){
        self.sess = warehouseFunctions.GetSession(model.params.trade_point_id);
        model.itemsByTP.beforeFirst();
        while(model.itemsByTP.next()){
            model.itemsByTP.cursor.start_value = self.sess.items[model.itemsByTP.cursor.item_id];
        }
    }
}

function ModelModified(){
    if(!self.sessClosed){
        model.itemsByTP.beforeFirst();
        while(model.itemsByTP.next()){
            if(self.sess.items[model.itemsByTP.cursor.item_id] != model.itemsByTP.cursor.start_value)
                return true;
        }
        return false;
    } else {
        return false;
    }
    
}

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    form.modelGrid.colItem_id.readonly = true;
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (ModelModified()&&confirm('Сохранить изменения?')){    
        ModelSave();
    }
}//GEN-LAST:event_formWindowClosing

    function btnCloseSessionActionPerformed(evt) {//GEN-FIRST:event_btnCloseSessionActionPerformed
        if(warehouseFunctions.CloseSession(model.params.trade_point_id, self.sess.id)){
            model.itemsByTP.beforeFirst();
            while (model.itemsByTP.next()){
                model.itemsByTP.cursor.start_value = " ";
            }
            form.modelGrid.colItem_id.readonly = true;
            self.sessClosed = true;
            alert("Сессия успешно закрыта!");
        } else {
            alert("Не удалось закрыть сессию");
        }
    }//GEN-LAST:event_btnCloseSessionActionPerformed

    function btnStartSessionActionPerformed(evt) {//GEN-FIRST:event_btnStartSessionActionPerformed
        form.modelGrid.colItem_id.readonly = false;
        self.sess = warehouseFunctions.GetSession(model.params.trade_point_id);
        model.itemsByTP.beforeFirst();
        while(model.itemsByTP.next()){
            model.itemsByTP.cursor.start_value = self.sess.items[model.itemsByTP.cursor.item_id];
        }
    }//GEN-LAST:event_btnStartSessionActionPerformed
}