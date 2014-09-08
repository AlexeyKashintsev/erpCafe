/**
 * 
 * @author Алексей
 * @name ItemTypesForm
 * @public
 */

function ItemTypesForm() {
    
var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    self.model.save();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        var p = model.itemType.cursor.parent_type;
        model.itemType.insert(model.itemType.schema.parent_type, p);
    }//GEN-LAST:event_btnAddActionPerformed

    function btnAddParentActionPerformed(evt) {//GEN-FIRST:event_btnAddParentActionPerformed
        var p = model.itemType.cursor.wh_item_types_id;
        model.itemType.insert(model.itemType.schema.parent_type, p);
    }//GEN-LAST:event_btnAddParentActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if(confirm('Вы уверены что хотите удалить этот товар?'))
            model.itemType.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed
}