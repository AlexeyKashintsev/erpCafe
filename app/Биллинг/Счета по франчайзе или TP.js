/**
 * 
 * @author Алексей
 * @name TradePoints
 * @public
 */

function BillsFranchazi() {
var self = this, model = this.model, form = this;
var createBillAccount = new CreateBillAccount();


model.params.franchazi_id = null;

self.setFranchaziId = function(aFranchaziId){
    model.params.franchazi_id = aFranchaziId;
    model.listTradePoints.requery();
};
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

    function qBillAccountOnScrolled(evt) {//GEN-FIRST:event_qBillAccountOnScrolled
        model.params.account_id = model.qBillAccount.cursor.bill_accounts_id;
        model.qServiceListByAccount.requery();
    }//GEN-LAST:event_qBillAccountOnScrolled

    function qBillAccountOnRequeried(evt) {//GEN-FIRST:event_qBillAccountOnRequeried
        model.params.account_id = model.qBillAccount.cursor.bill_accounts_id;
        model.qServiceListByAccount.requery();
    }//GEN-LAST:event_qBillAccountOnRequeried

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        createBillAccount.setFranchaziId(model.params.franchazi_id);
        createBillAccount.showModal(function(){});
        model.qBillAccount.requery();
    }//GEN-LAST:event_btnAddActionPerformed
}