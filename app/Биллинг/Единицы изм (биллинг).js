/**
 * 
 * @author minya92
 */
function BillMeasures() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    // TODO : place your code here

    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.save();
    }//GEN-LAST:event_buttonActionPerformed

    form.button1.onActionPerformed = function(evt) {//GEN-FIRST:event_button1ActionPerformed
        model.qBillMeasures.insert();
    }//GEN-LAST:event_button1ActionPerformed

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
        if (model.modified&&confirm('Сохранить изменения?')){
            model.save();
        }
    }//GEN-LAST:event_formWindowClosing
    
    self.show = function() {
        form.show();
    };
}
