/**
 * 
 * @author minya92
 * TODO Добавить описание услуги
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
        if(self.serviceId)
            billModule.editService(self.serviceId, form.tfName.text, form.tfSum.text, form.tfDays.text, form.checkBox.selected);
        else billModule.CreateService(form.tfName.text, form.tfSum.text, form.tfDays.text, form.checkBox.selected);
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(self.serviceId){
            model.params.service_id = self.serviceId;
            model.requery(function(){
                form.tfName.text = model.qServiceList.cursor.service_name;
                form.tfSum.text = model.qServiceList.cursor.item_cost;
                form.tfDays.text = model.qServiceList.cursor.service_days;
                form.checkBox.selected = model.qServiceList.cursor.locked;                
            });
        } else {
            form.tfName.text = "";
            form.tfSum.text = "";
            form.tfDays.text = "";
            form.checkBox.selected = false;    
        }
    }//GEN-LAST:event_formWindowOpened

    function tfSumActionPerformed(evt) {//GEN-FIRST:event_tfSumActionPerformed
        // TODO Добавьте свой код:
    }//GEN-LAST:event_tfSumActionPerformed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing

    }//GEN-LAST:event_formWindowClosing
}
