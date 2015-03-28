/**
 * 
 * @author Алексей
 * @name SelectFranchaziAdminForm
 * @public
 */

function SelectFranchaziAdminForm() {
var self = this, model = this.model, form = this;
//var bm = Session.getModule("BillModule");
//var whModuleAdmin = Session.getModule("WhModuleAdmin");

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

    function listFranchaziOnRequeried(evt) {//GEN-FIRST:event_listFranchaziOnRequeried
        if (self.parent) {
            self.parent.setFranchazi(model.listFranchazi.org_franchazi_id);
        }
    }//GEN-LAST:event_listFranchaziOnRequeried

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        var franName = prompt("Введите имя нового франчази:");
        //TODO Что-то тут не так, не работет Session.get
        var bm = new ServerModule("BillModule");
        var whModuleAdmin = new ServerModule("WhModuleAdmin");
        if(franName){
            model.listFranchazi.insert();
            model.listFranchazi.cursor.f_name = franName;
            model.save();
            bm.createBillAccount(false, model.listFranchazi.cursor.org_franchazi_id);
            whModuleAdmin.initItemsForFranchazi(model.listFranchazi.cursor.org_franchazi_id);
            model.requery();
        }
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm("Действительно удалить франчази " + 
                model.listFranchazi.cursor.f_name))
            model.listFranchazi.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed
}