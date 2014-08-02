/**
 * 
 * @author Alexey
 */
function TradePointSelector() {
    var self = this, model = this.model, form = this;

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        self.close(model.qTradeItemsByUser.org_trade_point_id);
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qTradeItemsByUser.params.user_name = self.userName ? self.userName : self.principal.name;
        model.qTradeItemsByUser.requery();
    }//GEN-LAST:event_formWindowOpened
}
