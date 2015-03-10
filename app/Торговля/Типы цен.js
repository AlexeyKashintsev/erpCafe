/**
 * 
 * @author Алексей
 * @name template
 * @public
 */

function PriceTypesForm() {
var self = this, model = this.model, form = this; 

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    self.model.save();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing


    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.qTradePriceTypes.insert();
        model.qTradePriceTypes.cursor.franchazi_id =  model.params.franchazi_id;
    }//GEN-LAST:event_btnAddActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.franchazi_id = session.getFranchazi();
    }//GEN-LAST:event_formWindowOpened
}