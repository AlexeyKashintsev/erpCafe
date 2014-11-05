/**
 * 
 * @author minya92
 */
function UnpaidBills() {
    var self = this, model = this.model, form = this;
    var billModule  = new ServerModule("BillModule");
    model.qBillOperationsList.params.status = 3;

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    }//GEN-LAST:event_formWindowOpened

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if(confirm("Провести выбранный счет?\n Операцию нельзя отменить!")){
            billModule.setStatusBillOperation(model.qBillOperationsList.cursor.bill_operations_id, billModule.getSelfPropertyValue("OP_STATUS_SUCCESS"));
            model.requery();
        }
    }//GEN-LAST:event_buttonActionPerformed

    function btnReq1ActionPerformed(evt) {//GEN-FIRST:event_btnReq1ActionPerformed
        model.requery();
    }//GEN-LAST:event_btnReq1ActionPerformed
}
