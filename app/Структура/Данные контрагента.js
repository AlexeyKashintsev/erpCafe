/**
 * 
 * @name ContragentDetailsForm
 * @author Alexey
 */
function ContragentDetailsForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    model.params.contragent_id = 0;
    
    self.setContragentId = function(aContragentId){
        model.params.contragent_id = aContragentId;
    };
    
    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        form.close(true);
    };//GEN-LAST:event_btnSaveActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        if(model.params.contragent_id === 0){
            model.requery();
            model.listContragent.insert();
        }
    };//GEN-LAST:event_formWindowOpened

    form.onWindowClosed = function(evt) {//GEN-FIRST:event_formWindowClosed
        model.params.contragent_id = 0;
    };//GEN-LAST:event_formWindowClosed
    
    self.show = function() {
        form.show();
    };
}
