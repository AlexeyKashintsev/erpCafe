/**
 * 
 * @author Alexey
 */
function test() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    var stateModule = new ServerModule('testModule');

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        stateModule.setState(form.textField.text);
        stateModule.getState(function(aValue){
            form.label.text = aValue;
        });
    }//GEN-LAST:event_buttonActionPerformed
}
