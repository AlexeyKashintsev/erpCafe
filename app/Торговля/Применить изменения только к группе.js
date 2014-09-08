/**
 * 
 * @author Alexey
 */
function AskForChangesApplying() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

    function btnTPActionPerformed(evt) {//GEN-FIRST:event_btnTPActionPerformed
        self.close(1);
    }//GEN-LAST:event_btnTPActionPerformed

    function btnFrancizeActionPerformed(evt) {//GEN-FIRST:event_btnFrancizeActionPerformed
        self.close(2);
    }//GEN-LAST:event_btnFrancizeActionPerformed
}
