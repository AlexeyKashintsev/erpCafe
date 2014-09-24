/**
 * 
 * @author minya92
 */
function HistoryOrders() {
    var self = this, model = this.model, form = this;
    
    // TODO : place your code here

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        createBillAccount.setFranchaziId(model.params.franchazi_id);
        createBillAccount.showModal(function(aResult){
            if(aResult) model.requery();
        });
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if(confirm("Удалить выбранный счет?")){
            bm.delBillAccount(model.qBillAccount.cursor.bill_accounts_id);
            model.requery();
        }
    }//GEN-LAST:event_btnDelActionPerformed

    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    model.requery();
    }//GEN-LAST:event_btnReqActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    //TODO Наверное так делать не безопасно, хз как правильно сделать
    if(session.getUserRole()== "admin"){
        addBillOperation.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        addBillOperation.showModal(function(aResult){
            model.requery();
        });
    } else {
        var addBalance = new AddBalance(model.qBillAccount.cursor.bill_accounts_id);
        addBalance.showModal(function(){
            model.requery();
        });
    }
    
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnSave1ActionPerformed(evt) {//GEN-FIRST:event_btnSave1ActionPerformed
        historyOperations.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        historyOperations.showModal(function(){});
    }//GEN-LAST:event_btnSave1ActionPerformed
}
