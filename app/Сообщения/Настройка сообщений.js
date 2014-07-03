/**
 * 
 * @name messngerSettings
 * @author Alexey
 */
function messngerSettings() {
    var self = this;
    
    // TODO : place your code here

    function btnSaveMouseClicked(evt) {//GEN-FIRST:event_btnSaveMouseClicked
        self.model.save();
    }//GEN-LAST:event_btnSaveMouseClicked

    function btnExitActionPerformed(evt) {//GEN-FIRST:event_btnExitActionPerformed
        self.close();
    }//GEN-LAST:event_btnExitActionPerformed
}
