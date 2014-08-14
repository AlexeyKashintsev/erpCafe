/**
 * 
 * @author Алексей
 * @name SelectFranchaziAdminForm
 * @public
 */

function SelectFranchaziAdminForm() {
var self = this, model = this.model, form = this;

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    self.model.save();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        close(model.listFranchazi.org_franchazi_id);
    }//GEN-LAST:event_btnSelectActionPerformed

    function listFranchaziOnScrolled(evt) {//GEN-FIRST:event_listFranchaziOnScrolled
        if (self.parent) {
            self.parent.setFranchazi(model.listFranchazi.org_franchazi_id);
        }
    }//GEN-LAST:event_listFranchaziOnScrolled
}