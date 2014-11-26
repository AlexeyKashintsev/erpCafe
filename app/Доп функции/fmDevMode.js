/**
 * 
 * @author Alexey
 */
function fmDevMode() {
    var self = this, model = this.model, form = this;
    
    

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var js = form.textArea.text;
        form.textArea1.text = eval(js);
    }//GEN-LAST:event_buttonActionPerformed
}
