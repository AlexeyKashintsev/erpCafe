/**
 * 
 * @author minya92
 */
function EditServiceForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var billModule = new P.ServerModule("BillModule");
    
    self.serviceId = 0;
    self.setServiceId = function(aServiceId){
        self.serviceId = aServiceId;
    };
    
    form.rbMonth.onActionPerformed = function(evt) {//GEN-FIRST:event_rbMonthActionPerformed
        form.tfDays.text = "0";
        form.tfDays.enabled = false;
    }//GEN-LAST:event_rbMonthActionPerformed

    form.rbDays.onActionPerformed = function(evt) {//GEN-FIRST:event_rbDaysActionPerformed
        form.tfDays.enabled = true;
    }//GEN-LAST:event_rbDaysActionPerformed

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        billModule.editService(self.serviceId, form.tfName.text, form.tfSum.text, form.tfDays.text);
        form.close();
    }//GEN-LAST:event_btnSaveActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.service_id = self.serviceId;
        model.requery();
        form.tfName.text = model.qServiceList.cursor.service_name;
        form.tfSum.text = model.qServiceList.cursor.service_sum;
        form.tfDays.text = model.qServiceList.cursor.service_days;
    }//GEN-LAST:event_formWindowOpened
    
    self.show = function() {
        form.show();
    };
}
