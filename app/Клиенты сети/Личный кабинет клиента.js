/**
 * 
 * @author stipjey
 */
function clientDesktop() {
    var self = this, model = this.model, form = this;
    var ClientEditPersonalInfo = new clientEditPersonalInfo();
    var UserName = null;
    // TODO : place your code here

    self.SetUserName = function (anUserName){
        UserName = anUserName;
    };
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
         ClientEditPersonalInfo.showModal();
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qBillAccount.params.user_id = self.principal.name;
        form.lblBonusBillCount.text = "На вашем бонусном счету " + model.qBillAccount.cursor.currnt_sum + " баллов";
    }//GEN-LAST:event_formWindowOpened
}
