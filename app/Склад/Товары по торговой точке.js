/**
 * 
 * @author Алексей
 * @name ItemsByTradePointForm
 * @public
 */

function ItemsByTradePointForm() {

var self = this, model = this.model, form = this;

var isSelectForm = true;
var isEditable = true;

var canSetEdit = true;

model.params.trade_point_id = 3;
model.params.franchazi_id = 3;

self.setTradePointId = function(aTradePointId){
    model.params.trade_point_id = aTradePointId;
};
self.setFranchaziId = function(aFranchaziId){
    model.params.franchazi_id = aFranchaziId;
};
function setEdit(){
    self.modelGrid.editable = self.btnAdd.enabled = 
            self.btnDel.enabled = self.btnSave.enabled = isEditable;    
    self.btnAddParent.enabled = isEditable;
    self.tbSetEdit.selected = isEditable;
}

function setElShown(){
    setEdit();
    if (!isSelectForm){
        self.pnlSelLock.visible = false;
        self.pnlWorkSpace.height += 48;
        self.modelGrid.bottom += 48;
    }
}

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    self.model.save();
    model.requery();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    setElShown();
}//GEN-LAST:event_formWindowOpened

function tbSetEditActionPerformed(evt) {//GEN-FIRST:event_tbSetEditActionPerformed
    isEditable = self.tbSetEdit.selected;
    setEdit();
}//GEN-LAST:event_tbSetEditActionPerformed

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.itemsByTP.insert();
        model.itemsByTP.cursor.item_id = model.itemsByTP.cursor.wh_items_id;
        model.itemsByTP.cursor.warehouse = model.params.trade_point_id;
        model.itemsByTP.cursor.franchazi_id = model.params.franchazi_id;
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if(confirm('Вы уверены что хотите удалить этот товар?'))
            model.itemsByTP.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed
}