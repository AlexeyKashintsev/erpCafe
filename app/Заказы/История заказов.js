/**
 * 
 * @author minya92
 */
function HistoryOrders() {
    var self = this, model = this.model, form = this;
    var billModule  = new ServerModule("BillModule");
    
    model.params.status = 7;
    
    function btnSendAgainActionPerformed(evt) {//GEN-FIRST:event_btnSendAgainActionPerformed
        if(confirm("Повторить заказ?\nС Вашего счета спишется сумма этого заказа!")){
            if(billModule.getSumFromAccountId(model.qHistoryOrders.cursor.bill_accounts_id) >= model.qHistoryOrders.cursor.operation_sum){
                 billModule.setStatusBillOperation(model.qHistoryOrders.cursor.bill_operations_id, billModule.getSelfPropertyValue("OP_STATUS_PAID"));
                 model.requery();
            } else{
                alert("На Вашем счету недостаточно средств!");
            }
        }
    }//GEN-LAST:event_btnSendAgainActionPerformed

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
        if(model.qHistoryOrders.cursor.operation_status == billModule.getSelfPropertyValue("OP_STATUS_CREATE")){
            form.btnSendAgain.enabled = true;
        } else form.btnSendAgain.enabled = false;
        model.params.operation_id = model.qHistoryOrders.cursor.bill_operations_id;
        model.qOperationsItems.requery();
    }//GEN-LAST:event_qHistoryOrdersOnScrolled

    function qHistoryOrdersOnRequeried(evt) {//GEN-FIRST:event_qHistoryOrdersOnRequeried
        if(model.qHistoryOrders.cursor.operation_status == billModule.getSelfPropertyValue("OP_STATUS_SEND")){
            form.btnRecive.enabled = true;
        } else form.btnRecive.enabled = false;
        if(model.qHistoryOrders.cursor.operation_status == billModule.getSelfPropertyValue("OP_STATUS_CREATE")){
            form.btnSendAgain.enabled = true;
        } else form.btnSendAgain.enabled = false;
        
        model.params.operation_id = model.qHistoryOrders.cursor.bill_operations_id;
        model.qOperationsItems.requery();
    }//GEN-LAST:event_qHistoryOrdersOnRequeried

    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
        model.requery();
    }//GEN-LAST:event_btnReqActionPerformed

    function rbSentActionPerformed(evt) {//GEN-FIRST:event_rbSentActionPerformed
        model.params.status = 8;
    }//GEN-LAST:event_rbSentActionPerformed

    function rbPaidActionPerformed(evt) {//GEN-FIRST:event_rbPaidActionPerformed
        model.params.status = 7;
    }//GEN-LAST:event_rbPaidActionPerformed

    function rbPaid1ActionPerformed(evt) {//GEN-FIRST:event_rbPaid1ActionPerformed
        model.params.status = 5;
    }//GEN-LAST:event_rbPaid1ActionPerformed
}
