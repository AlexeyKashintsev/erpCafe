/**
 * 
 * @author Алексей
 * @name SelectFranchaziAdminForm
 * @public
 */

function SelectFranchaziAdminForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
        self.model.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        self.model.save();
    };//GEN-LAST:event_btnSaveActionPerformed

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
    };//GEN-LAST:event_formWindowClosing

    form.btnSelect.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        close(model.listFranchazi.org_franchazi_id);
    };//GEN-LAST:event_btnSelectActionPerformed

    model.listFranchazi.onScrolled = function(evt) {//GEN-FIRST:event_listFranchaziOnScrolled
        if (self.parent) {
            self.parent.setFranchazi(model.listFranchazi.org_franchazi_id);
        }
    };//GEN-LAST:event_listFranchaziOnScrolled
    
    self.show = function() {
        form.show();
    };
}