/**
 * 
 * @author minya92
 */
function ManageServices() {
    var self = this, model = this.model, form = this;
    var bm = new ServerModule("BillModule");
    var editServiceForm = new EditServiceForm();

    function btnAdd1ActionPerformed(evt) {//GEN-FIRST:event_btnAdd1ActionPerformed
        editServiceForm.setServiceId(false);
        editServiceForm.showModal(function(aResult){
            model.requery();
        });
    }//GEN-LAST:event_btnAdd1ActionPerformed

    function btnDel1ActionPerformed(evt) {//GEN-FIRST:event_btnDel1ActionPerformed
        if(confirm("Удалить услугу?")){
            bm.delService(model.qServiceList.cursor.bill_services_id);
            model.qServiceListByAccount.requery();
        }
    }//GEN-LAST:event_btnDel1ActionPerformed

    function btnReq1ActionPerformed(evt) {//GEN-FIRST:event_btnReq1ActionPerformed
        editServiceForm.setServiceId(model.qServiceList.cursor.bill_services_id);
        editServiceForm.showModal(function(aResult){
            model.requery();
        });
    }//GEN-LAST:event_btnReq1ActionPerformed

    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
    }//GEN-LAST:event_btnReqActionPerformed
}
