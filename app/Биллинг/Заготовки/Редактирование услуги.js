/**
 * 
 * @author minya92
 */
function EditServiceForm() {
    var self = this, model = this.model, form = this;
    var billModule = new ServerModule("BillModule");
    
    self.serviceId = 0;
    self.setServiceId = function(aServiceId){
        self.serviceId = aServiceId;
    };
    
    function rbMonthActionPerformed(evt) {//GEN-FIRST:event_rbMonthActionPerformed
        form.tfDays.text = "0";
        form.tfDays.enabled = false;
    }//GEN-LAST:event_rbMonthActionPerformed

    function rbDaysActionPerformed(evt) {//GEN-FIRST:event_rbDaysActionPerformed
        form.tfDays.enabled = true;
    }//GEN-LAST:event_rbDaysActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        billModule.editService(self.serviceId, form.tfName.text, form.tfSum.text, form.tfDays.text);
        form.close();
    }//GEN-LAST:event_btnSaveActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.service_id = self.serviceId;
        model.requery();
        form.tfName.text = model.qServiceList.cursor.service_name;
        form.tfSum.text = model.qServiceList.cursor.item_cost;
        form.tfDays.text = model.qServiceList.cursor.service_days;
    }//GEN-LAST:event_formWindowOpened

    function tfSumActionPerformed(evt) {//GEN-FIRST:event_tfSumActionPerformed
        // TODO Добавьте свой код:
    }//GEN-LAST:event_tfSumActionPerformed
}
