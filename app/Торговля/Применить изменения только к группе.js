/**
 * 
 * @author Alexey
 */
function AskForChangesApplying() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

    form.btnTP.onActionPerformed = function(evt) {//GEN-FIRST:event_btnTPActionPerformed
        self.close(1);
    };//GEN-LAST:event_btnTPActionPerformed

    form.btnFrancize.onActionPerformed = function(evt) {//GEN-FIRST:event_btnFrancizeActionPerformed
        self.close(2);
    };//GEN-LAST:event_btnFrancizeActionPerformed
    
    self.show = function() {
        form.show();
    };
}
