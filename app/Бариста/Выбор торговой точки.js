/**
 * 
 * @author Alexey
 */
function TradePointSelector() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        self.close(model.qTradeItemsByUser.org_trade_point_id);
    }//GEN-LAST:event_buttonActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        model.qTradeItemsByUser.params.user_name = self.userName ? self.userName : self.principal.name;
        model.qTradeItemsByUser.requery();
    }//GEN-LAST:event_formWindowOpened
    
    self.show = function() {
        form.show();
    };
}
