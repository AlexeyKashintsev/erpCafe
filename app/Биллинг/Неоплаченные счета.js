/**
 * 
 * @author minya92
 */
function UnpaidBills() {
    var self = this, model = this.model, form = this;
    var billModule  = new ServerModule("BillModule");
    model.qBillOperationsList.execute();
    function btnPaymentActionPerformed(evt) {//GEN-FIRST:event_btnPaymentActionPerformed
        if(confirm("Провести выбранный счет?\n Операцию нельзя отменить!")){
            billModule.setStatusBillOperation(model.qBillOperationsList.cursor.bill_operations_id, billModule.getSelfPropertyValue("OP_STATUS_SUCCESS"));
            model.requery();
        }
    }//GEN-LAST:event_btnPaymentActionPerformed

    function paramsOnChanged(evt) {//GEN-FIRST:event_paramsOnChanged
        model.qBillOperationsList.params.status = model.params.status_id;
        model.qBillOperationsList.execute();
    }//GEN-LAST:event_paramsOnChanged

    function btnReq11ActionPerformed(evt) {//GEN-FIRST:event_btnReq11ActionPerformed
         model.qBillOperationsList.execute();
    }//GEN-LAST:event_btnReq11ActionPerformed

    function qBillOperationsListOnScrolled(evt) {//GEN-FIRST:event_qBillOperationsListOnScrolled
        if(model.qBillOperationsList.cursor.bill_operations_status_id == billModule.getSelfPropertyValue("OP_STATUS_BILL"))
             form.btnPayment.enabled = true;
        else form.btnPayment.enabled = false;
    }//GEN-LAST:event_qBillOperationsListOnScrolled

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.status_id = 3;
    }//GEN-LAST:event_formWindowOpened
}
