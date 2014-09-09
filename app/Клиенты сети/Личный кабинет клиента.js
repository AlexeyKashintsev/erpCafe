/**
 * 
 * @author stipjey
 */
function clientDesktop() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var ClientEditPersonalInfo = new clientEditPersonalInfo();
    var UserName = null;
    // TODO : place your code here

    self.SetUserName = function (anUserName){
        UserName = anUserName;
    };
    
    form.buttonActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
         ClientEditPersonalInfo.showModal();
    };//GEN-LAST:event_buttonActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        model.qBillAccount.params.user_id = self.principal.name;
        form.lblBonusBillCount.text = "На вашем бонусном счету " + model.qBillAccount.cursor.currnt_sum + " баллов";
    };//GEN-LAST:event_formWindowOpened
    
    self.show = function() {
        form.show();
    };
}
