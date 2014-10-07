/**
 * 
 * @author minya92
 */
function CreateServiceForm() {
    var self = this, model = this.model, form = this;
    var serviceModule = new ServerModule("ServiceModule");
    var editServiceForm = new EditServiceForm;
    // TODO : place your code here

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        serviceModule.CreateService(form.tfName.text, form.tfSum.text, form.tfDays.text);
        model.requery();
    }//GEN-LAST:event_btnSaveActionPerformed

    function rbMonthActionPerformed(evt) {//GEN-FIRST:event_rbMonthActionPerformed
        form.tfDays.text = "0";
        form.tfDays.enabled = false;
    }//GEN-LAST:event_rbMonthActionPerformed

    function rbDaysActionPerformed(evt) {//GEN-FIRST:event_rbDaysActionPerformed
        form.tfDays.enabled = true;
    }//GEN-LAST:event_rbDaysActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if(confirm("Вы уверены что хотите удалить услугу?")){
            serviceModule.delService(model.qServiceList.cursor.bill_services_id);
            model.requery();
        }
    }//GEN-LAST:event_btnDelActionPerformed

    function btnEditActionPerformed(evt) {//GEN-FIRST:event_btnEditActionPerformed
        editServiceForm.setServiceId(model.qServiceList.cursor.bill_services_id);
        editServiceForm.showModal();
        model.requery();
    }//GEN-LAST:event_btnEditActionPerformed
}
