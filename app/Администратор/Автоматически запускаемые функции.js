/**
 * 
 * @author minya92
 */
function AutoEventsForm() {
    var self = this, model = this.model, form = this;
        var billServerModule = new ServerModule("BillServerModule");

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        billServerModule.paymentForServices();
    }//GEN-LAST:event_buttonActionPerformed
}
