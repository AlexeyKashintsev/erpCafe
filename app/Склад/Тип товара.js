/**
 * 
 * @author Алексей
 * @name ItemTypesForm
 * @public
 */

function ItemTypesForm() {
    
var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
        self.model.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        self.model.save();
    };//GEN-LAST:event_btnSaveActionPerformed

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
    };//GEN-LAST:event_formWindowClosing

    form.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        var p = model.itemType.cursor.parent_type;
        model.itemType.insert(model.itemType.schema.parent_type, p);
    };//GEN-LAST:event_btnAddActionPerformed

    form.btnAddParent.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddParentActionPerformed
        var p = model.itemType.cursor.wh_item_types_id;
        model.itemType.insert(model.itemType.schema.parent_type, p);
    };//GEN-LAST:event_btnAddParentActionPerformed

    form.btnDel.onActionPerformed = function(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if(confirm('Вы уверены что хотите удалить этот товар?'))
            model.itemType.deleteRow();
    };//GEN-LAST:event_btnDelActionPerformed
    
    self.show = function() {
        form.show();
    };
}