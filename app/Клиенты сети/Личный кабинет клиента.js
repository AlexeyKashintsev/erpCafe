/**
 * 
 * @author stipjey
 */
function clientDesktop() {
    var self = this, model = this.model, form = this;
    var ClientEditPersonalInfo = new clientEditPersonalInfo();
    var clientModule = new ServerModule('ClientServerModule');
    var clientData = clientModule.getClientData();
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
         ClientEditPersonalInfo.showModal();
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qGetSumAndBonusesFromTradeOperation.params.account_id = clientData.bonusBill;
        model.qGetSumAndBonusesFromTradeOperation.requery();
        form.lblBonusBillCount.text = "На вашем бонусном счету " + Number(clientData.bonusCount) + " баллов";
    }//GEN-LAST:event_formWindowOpened
}
