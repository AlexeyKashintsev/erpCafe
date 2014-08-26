/**
 * 
 * @author stipjey
 */
function ChoiceMethodOfPayment() {
    var self = this, model = this.model, form = this;
    self.tradeSession = null;
    // TODO : place your code here

    function btnChoiceBonusActionPerformed(evt) {//GEN-FIRST:event_btnChoiceBonusActionPerformed
        self.tradeSession.setTradeOperationType("bonus");
        form.close("bonus");
    }//GEN-LAST:event_btnChoiceBonusActionPerformed

    function btnChoiceMoneyActionPerformed(evt) {//GEN-FIRST:event_btnChoiceMoneyActionPerformed
        self.tradeSession.setTradeOperationType("money");
        form.close("money");
    }//GEN-LAST:event_btnChoiceMoneyActionPerformed
}
