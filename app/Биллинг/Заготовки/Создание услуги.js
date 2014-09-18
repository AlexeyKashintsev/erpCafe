/**
 * 
 * @author minya92
 */
function AddEditServiceForm() {
    var self = this, model = this.model, form = this;
    self.service_id = false;
    var bm = new ServerModule("BillModule");
    
    self.setServiceId = function(aServiceId){
        self.service_id = aServiceId;
    }
    
    // TODO : place your code here

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        
        self.service_id = false;
    }//GEN-LAST:event_btnSaveActionPerformed

    function rbMonthActionPerformed(evt) {//GEN-FIRST:event_rbMonthActionPerformed
        form.tfDays.text = "0";
        form.tfDays.enabled = false;
    }//GEN-LAST:event_rbMonthActionPerformed

    function rbDaysActionPerformed(evt) {//GEN-FIRST:event_rbDaysActionPerformed
        form.tfDays.enabled = true;
    }//GEN-LAST:event_rbDaysActionPerformed

    function btnSave1ActionPerformed(evt) {//GEN-FIRST:event_btnSave1ActionPerformed
        billModule.CreateService(form.tfName.text, form.tfSum.text, form.tfDays.text);
        model.requery();
    }//GEN-LAST:event_btnSave1ActionPerformed
}
