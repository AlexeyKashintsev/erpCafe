/**
 * 
 * @author minya92
 */
function AutoEventsForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
        var billServerModule = new ServerModule("BillServerModule");
    // TODO : place your code here

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        billServerModule.paymentForServices();
    }//GEN-LAST:event_buttonActionPerformed
}
