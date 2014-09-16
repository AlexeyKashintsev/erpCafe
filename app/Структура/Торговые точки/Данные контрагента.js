/**
 * 
 * @name ContragentDetailsForm
 * @author Alexey
 */
function ContragentDetailsForm() {
    var self = this, model = this.model, form = this;
    model.params.contragent_id = 0;
    
    self.setContragentId = function(aContragentId){
        model.params.contragent_id = aContragentId;
    };
    
    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(model.params.contragent_id === 0){
            model.requery();
            model.listContragent.insert();
        }
    }//GEN-LAST:event_formWindowOpened

    function formWindowClosed(evt) {//GEN-FIRST:event_formWindowClosed
        model.params.contragent_id = 0;
    }//GEN-LAST:event_formWindowClosed
}
