/**
 * 
 * @author Алексей
 * @name template
 * @public
 */

function TradeItemsModifiersValues(aFranchazi, aFranshize) {
var self = this, model = this.model, form = this; 

model.qItemsModifiersTypes.params.franchazi_id = 
        model.qModValues.params.franchazi_id = aFranchazi ? aFranchazi : session.franchaziId;
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
        model.qModValues.push({
            modifier:    model.qItemsModifiersTypes.cursor.items_modifiers_id,
            franchazi_id:   model.qItemsModifiersTypes.params.franchazi_id,
            mod_value: prompt('Значение модификатора'),
            display_name: prompt('Отображаемое значение модификатора')
        });
    }//GEN-LAST:event_btnAddActionPerformed

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        form.close([model.qModValues.cursor.items_mods_values_id, model.qItemsModifiersTypes.cursor.items_modifiers_id]);
    }//GEN-LAST:event_btnSelectActionPerformed
}