/**
 * 
 * @author Алексей
 * @name TradePoints
 * @public
 */

function BillsFranchazi() {
var self = this, model = this.model, form = this;
var createBillAccount = new CreateBillAccount();
var bm = Session.get("BillModule");
var serviceModule = Session.get("ServiceModule");
var addServiceForm = new AddServiceForm();
var addBillOperation = new AddBillOperation();
var historyOperations = new HistoryOperations();
var billServerModule = new ServerModule("BillServerModule");

model.params.franchazi_id = null;

self.setFranchaziId = function(aFranchaziId){
    model.params.franchazi_id = aFranchaziId;
    model.qBillAccount.params.franchazi_id = aFranchaziId;
    model.qBillAccount.requery();
};
function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    model.qBillAccount.requery();
    model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    //Не позволит пополнить счет не админу на стороне сервера.
    if(session.getUserRole()== "admin"){
        addBillOperation.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        addBillOperation.showModal(function(aResult){
            model.qBillAccount.requery();
            model.requery();
        });
    } else {
        var addBalance = new AddBalance(model.qBillAccount.cursor.bill_accounts_id);
        addBalance.showModal(function(){
            model.qBillAccount.requery();
            model.requery();
        });
    }
    
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    if(!model.params.franchazi_id){
        model.params.franchazi_id = session.getFranchazi();
        model.qBillAccount.params.franchazi_id = session.getFranchazi();
        model.qBillAccount.requery();
    }
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

    function btnAdd1ActionPerformed(evt) {//GEN-FIRST:event_btnAdd1ActionPerformed
        addServiceForm.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        addServiceForm.showModal(function(aResult){
            if(aResult) model.requery();
        });
    }//GEN-LAST:event_btnAdd1ActionPerformed

    function btnDel1ActionPerformed(evt) {//GEN-FIRST:event_btnDel1ActionPerformed
        if(confirm("Удалить услугу с выбранного счета?")){
            serviceModule.delServiceFromAccount(model.qBillAccount.cursor.bill_accounts_id, model.qServiceListByAccount.cursor.bill_services_id);
            model.qServiceListByAccount.requery();
        }
    }//GEN-LAST:event_btnDel1ActionPerformed

    function btnSave1ActionPerformed(evt) {//GEN-FIRST:event_btnSave1ActionPerformed
        historyOperations.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        historyOperations.showModal(function(){});
    }//GEN-LAST:event_btnSave1ActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
       billServerModule.paymentForServices();
    }//GEN-LAST:event_buttonActionPerformed

    function btnReq1ActionPerformed(evt) {//GEN-FIRST:event_btnReq1ActionPerformed
        model.qServiceListByAccount.requery();
    }//GEN-LAST:event_btnReq1ActionPerformed
}