/**
 * 
 * @author Work
 */
function initClientsForm() {
    var self = this, model = this.model, form = this;
    
    var CM = new ServerModule("ClientServerModule")

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        CM.clientInitialize();
    }//GEN-LAST:event_buttonActionPerformed
}
