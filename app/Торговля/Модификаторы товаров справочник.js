/**
 * 
 * @author Алексей
 * @public
 * TODO Доделать
 */

function TradeItemsModifiersTypes(aFranchazi, aFranshize) {
var self = this, model = this.model, form = this; 

model.qItemsModifiersTypes.params.franchazi_id = aFranchazi ? aFranchazi : session.franchaziId;
model.qItemsModifiersTypes.requery();

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
        model.qItemsModifiersTypes.push({
            modifier_parent:    model.qItemsModifiersTypes.cursor.modifier_parent ? model.qItemsModifiersTypes.cursor.modifier_parent : null,
            franchazi_id:   model.qItemsModifiersTypes.params.franchazi_id,
            modifier_name: prompt('Наименование модификатора')
        });
    }//GEN-LAST:event_btnAddActionPerformed

    function btnAddParentActionPerformed(evt) {//GEN-FIRST:event_btnAddParentActionPerformed
         model.qItemsModifiersTypes.push({
            modifier_parent:    model.qItemsModifiersTypes.cursor.items_modifiers_id ? model.qItemsModifiersTypes.cursor.items_modifiers_id : null,
            franchazi_id:   model.qItemsModifiersTypes.params.franchazi_id,
            modifier_name: prompt('Наименование модификатора')
        });
    }//GEN-LAST:event_btnAddParentActionPerformed
}