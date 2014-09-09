/**
 * 
 * @author stipjey
 */
function ChoiceMethodOfPayment() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    self.tradeSession = null;
    // TODO : place your code here

    form.btnChoiceBonus.onActionPerformed = function(evt) {//GEN-FIRST:event_btnChoiceBonusActionPerformed
        self.tradeSession.setTradeOperationType("bonus");
        form.close("bonus");
    };//GEN-LAST:event_btnChoiceBonusActionPerformed

    form.btnChoiceMoney.onActionPerformed = function(evt) {//GEN-FIRST:event_btnChoiceMoneyActionPerformed
        self.tradeSession.setTradeOperationType("money");
        form.close("money");
    };//GEN-LAST:event_btnChoiceMoneyActionPerformed
    
    self.show = function() {
        form.show();
    };
}
