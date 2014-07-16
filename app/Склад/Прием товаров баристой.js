/**
 * 
 * @author Алексей
 * @name GetItemsByBarista
 * @public
 */

function GetItemsByBarista() {
    
var self = this, model = this.model, form = this;
var getItemsByBaristaModule = new ServerModule("GetItemsByBaristaModule");
model.params.trade_point_id = 4;
model.params.session_id = null;

self.setTradePointId = function(aTradePointId) {
     model.params.trade_point_id = aTradePointId;
};

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


function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    model.itemsByTP.beforeFirst();
    while(model.itemsByTP.next()){
        model.itemsByTP.cursor.start_value = 0;
    }
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing

}//GEN-LAST:event_formWindowClosing

    function btnCloseSessionActionPerformed(evt) {//GEN-FIRST:event_btnCloseSessionActionPerformed
        var aItems = {};
        if(confirm("Вы уверены что хотите добавить на склад? Это действие будет невозможно отменить!")){
            model.itemsByTP.beforeFirst();
            while (model.itemsByTP.next()){
                if(model.itemsByTP.cursor.start_value != 0){
                    aItems[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.start_value;
                }            
            }
            //if(aItems.length > 0){
                //добавить в таблицу
                getItemsByBaristaModule.AddMovements(model.params.trade_point_id, aItems);
           // }
            form.close();  
       }     
    }//GEN-LAST:event_btnCloseSessionActionPerformed
}