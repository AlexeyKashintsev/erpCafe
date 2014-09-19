/**
 * 
 * @author minya92
 */
function BillMeasures() {
    var self = this, model = this.model, form = this;
    
    // TODO : place your code here

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.save();
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed

    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        model.qBillMeasures.insert();
    }//GEN-LAST:event_button1ActionPerformed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (model.modified&&confirm('Сохранить изменения?')){
            model.save();
        }
    }//GEN-LAST:event_formWindowClosing
}
