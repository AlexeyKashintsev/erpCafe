/**
 * 
 * @author Alexey
 */
function test() {
    var self = this, model = this.model, form = this;
    
    var stateModule = new ServerModule('testModule');

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        stateModule.setState(form.textField.text);
        stateModule.getState(function(aValue){
            form.label.text = aValue;
        });
    }//GEN-LAST:event_buttonActionPerformed
}
