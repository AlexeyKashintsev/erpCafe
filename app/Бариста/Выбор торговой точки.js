/**
 * 
 * @author Alexey
 */
function TradePointSelector() {
    var self = this, model = this.model, form = this;

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        self.close(model.qTradePointsByUser.org_trade_point_id);
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qTradePointsByUser.params.user_name = self.userName ? self.userName : self.principal.name;
        model.qTradePointsByUser.requery();
    }//GEN-LAST:event_formWindowOpened
}
