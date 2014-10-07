/**
 * 
 * @author minya92
 */
function AddServiceForm() {
    var self = this, model = this.model, form = this;
   // var billModule = new ServerModule("BillModule");
    var serviceModule = new ServerModule("ServiceModule");
    self.accountId = null;
    self.setAccountId = function(anAccountId){
        self.accountId = anAccountId;
    }; 

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if(serviceModule.AddService(self.accountId, model.qServiceList.cursor.bill_services_id)){
            form.close(true);
        } else {
            alert("На счету недостаточно средств для добавления данной услуги!");
            //form.close(false);
        }
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.requery();
    }//GEN-LAST:event_formWindowOpened
}
