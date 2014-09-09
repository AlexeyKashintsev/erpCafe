/**
 * 
 * @author minya92
 */
function CreateBillAccount() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var billModule = new P.ServerModule("BillModule");
    self.FranchaziId = null;
    self.setFranchaziId = function(aFranchaziId){
        self.FranchaziId = aFranchaziId;
    };

    form.buttonActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        var type;
        if(form.rbDefault.selected) 
            type = billModule.ACCOUNT_TYPE_DEFAULT;
        else
            type = billModule.ACCOUNT_TYPE_CREDIT;
        billModule.createBillAccount(self.FranchaziId, type, form.tfSum.text);
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed
    
    self.show = function() {
        form.show();
    };
}
