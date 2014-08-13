/**
 * 
 * @author minya92
 */
function CreateBillAccount() {
    var self = this, model = this.model, form = this;
    var billModule = new ServerModule("BillModule");
    self.FranchaziId = null;
    self.setFranchaziId = function(aFranchaziId){
        self.FranchaziId = aFranchaziId;
    };


    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var type;
        if(form.rbDefault.selected) 
            type = billModule.ACCOUNT_TYPE_DEFAULT;
        else
            type = billModule.ACCOUNT_TYPE_CREDIT;
        billModule.createBillAccount(self.FranchaziId, type, form.tfSum.text);
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed
}
