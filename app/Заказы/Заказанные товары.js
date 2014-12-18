/**
 * 
 * @author minya92
 */
function OrederItems() {
    var self = this, model = this.model, form = this;
    var billModule  = new ServerModule("BillModule");
    
    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    model.requery();
    }//GEN-LAST:event_btnReqActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed

    }//GEN-LAST:event_btnSaveActionPerformed

    function btnReciveActionPerformed(evt) {//GEN-FIRST:event_btnReciveActionPerformed
        if(confirm("Изменить статус операции?")){
            billModule.setStatusBillOperation(model.qOrederItems.cursor.bill_operations_id, billModule.getSelfPropertyValue("OP_STATUS_SEND"));
            model.requery();
        }
    }//GEN-LAST:event_btnReciveActionPerformed

    function qOrederItemsOnScrolled(evt) {//GEN-FIRST:event_qOrederItemsOnScrolled
        if(model.qOrederItems.cursor.operation_status == billModule.getSelfPropertyValue("OP_STATUS_PAID")){
            form.btnRecive.enabled = true;
        } else form.btnRecive.enabled = false;
        model.params.operation_id = model.qOrederItems.cursor.bill_operations_id;
        model.qOperationsItems.requery();
    }//GEN-LAST:event_qOrederItemsOnScrolled

    function qOrederItemsOnRequeried(evt) {//GEN-FIRST:event_qOrederItemsOnRequeried
        if(model.qOrederItems.cursor.operation_status == billModule.getSelfPropertyValue("OP_STATUS_PAID")){
            form.btnRecive.enabled = true;
        } else form.btnRecive.enabled = false;
        model.params.operation_id = model.qOrederItems.cursor.bill_operations_id;
        model.qOperationsItems.requery();
    }//GEN-LAST:event_qOrederItemsOnRequeried

    function rbPaidActionPerformed(evt) {//GEN-FIRST:event_rbPaidActionPerformed
        model.params.status = 7;
    }//GEN-LAST:event_rbPaidActionPerformed

    function rbSentActionPerformed(evt) {//GEN-FIRST:event_rbSentActionPerformed
        model.params.status = 8;
    }//GEN-LAST:event_rbSentActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        form.rbPaid.selected = true;
        model.params.status = 7;
    }//GEN-LAST:event_formWindowOpened
}
