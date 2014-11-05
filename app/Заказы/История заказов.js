/**
 * 
 * @author minya92
 */
function HistoryOrders() {
    var self = this, model = this.model, form = this;
    var billModule  = new ServerModule("BillModule");
    
    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    model.requery();
    }//GEN-LAST:event_btnReqActionPerformed

    function btnReciveActionPerformed(evt) {//GEN-FIRST:event_btnReciveActionPerformed
        if(confirm("Изменить статус операции?")){
            billModule.setStatusBillOperation(model.qHistoryOrders.cursor.bill_operations_id, billModule.getSelfPropertyValue("OP_STATUS_RECIVED"));
            model.requery();
        }
    }//GEN-LAST:event_btnReciveActionPerformed

    function qHistoryOrdersOnScrolled(evt) {//GEN-FIRST:event_qHistoryOrdersOnScrolled
        if(model.qHistoryOrders.cursor.operation_status == billModule.getSelfPropertyValue("OP_STATUS_SEND")){
            form.btnRecive.enabled = true;
        } else form.btnRecive.enabled = false;
        model.params.operation_id = model.qHistoryOrders.cursor.bill_operations_id;
        model.qOperationsItems.requery();
    }//GEN-LAST:event_qHistoryOrdersOnScrolled

    function qHistoryOrdersOnRequeried(evt) {//GEN-FIRST:event_qHistoryOrdersOnRequeried
        if(model.qHistoryOrders.cursor.operation_status == billModule.getSelfPropertyValue("OP_STATUS_SEND")){
            form.btnRecive.enabled = true;
        } else form.btnRecive.enabled = false;
        model.params.operation_id = model.qHistoryOrders.cursor.bill_operations_id;
        model.qOperationsItems.requery();
    }//GEN-LAST:event_qHistoryOrdersOnRequeried
}
