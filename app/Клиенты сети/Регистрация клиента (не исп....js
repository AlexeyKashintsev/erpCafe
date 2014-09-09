/**
 * 
 * @author stipjey
 */
function clientRegForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    // TODO : place your code here

    form.last_name.onActionPerformed = function(evt) {//GEN-FIRST:event_last_nameActionPerformed
        // TODO Добавьте свой код:
    }//GEN-LAST:event_last_nameActionPerformed

    form.last_name1.onActionPerformed = function(evt) {//GEN-FIRST:event_last_name1ActionPerformed
        // TODO Добавьте свой код:
    }//GEN-LAST:event_last_name1ActionPerformed
    
    self.show = function() {
        form.show();
    };
}
