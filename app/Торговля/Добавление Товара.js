/**
 * @author minya92
 */
function AddItemType() {
    var self = this, model = this.model, form = this;
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.save();
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed

    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        form.close();
    }//GEN-LAST:event_button1ActionPerformed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if(model.modified)
            model.itemType.deleteRow();
    }//GEN-LAST:event_formWindowClosing

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.itemType.insert();
    }//GEN-LAST:event_formWindowOpened
}
