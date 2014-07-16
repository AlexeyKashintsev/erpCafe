/**
 * 
 * @author Алексей
 * @name WhRevisionByBarista
 * @public
 */

function WhRevisionByBarista() {

var self = this, model = this.model, form = this;
var whRevisionByBaristaModule = new ServerModule("WhRevisionByBaristaModule");
model.params.trade_point_id = 4;
model.params.session_id = null;

self.setTradePointId = function(aTradePointId) {
     model.params.trade_point_id = aTradePointId;
};

self.session_id;

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
    self.sess.items = whRevisionByBaristaModule.AddItems(self.sess.id, items);
}

function ModelRequery(){ 
    self.sess = whRevisionByBaristaModule.GetSession(model.params.trade_point_id);
    model.itemsByTP.beforeFirst();
    while(model.itemsByTP.next()){
        model.itemsByTP.cursor.start_value = self.sess.items[model.itemsByTP.cursor.item_id];
    } 
}

function ModelModified(){
    if(form.btnCloseSession.enabled){
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

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (ModelModified()&&confirm('Сохранить изменения?')){    
        ModelSave();
    }
        ModelRequery();
}//GEN-LAST:event_btnReqActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    form.btnCloseSession.enabled = true;
    form.modelGrid.colItem_id.readonly = false;
    whRevisionByBaristaModule.createSession(anTradePointId)
    self.sess = whRevisionByBaristaModule.GetSession(model.params.trade_point_id);
    model.itemsByTP.beforeFirst();
    while(model.itemsByTP.next()){
        model.itemsByTP.cursor.start_value = self.sess.items[model.itemsByTP.cursor.item_id];
    }
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (ModelModified()&&confirm('Сохранить изменения?')){    
        ModelSave();
    }
}//GEN-LAST:event_formWindowClosing

    function btnCloseSessionActionPerformed(evt) {//GEN-FIRST:event_btnCloseSessionActionPerformed
       if(confirm("Вы уверены что хотите начать работу? Это действие будет невозможно отменить!")){
           if(whRevisionByBaristaModule.CloseSession(model.params.trade_point_id, self.sess.id)){
                model.itemsByTP.beforeFirst();
                while (model.itemsByTP.next()){
                    model.itemsByTP.cursor.start_value = " ";
                }
                form.modelGrid.colItem_id.readonly = true;
                form.btnCloseSession.enabled = false; // Чтобы не выскакивал запрос о сохранинии
                form.close();
            } else {
                alert("Ошибка!");
                form.close();
            }
       }     
    }//GEN-LAST:event_btnCloseSessionActionPerformed
}