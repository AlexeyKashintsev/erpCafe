/**
 * 
 * @author Алексей
 * @name SelectFranchaziForm
 * @public
 */

function SelectFranchaziForm() {
var self = this, model = this.model, form = this;
var treadPointsForm = new TreadPointsForm();
var isSelectForm = true;
var isEditable = false;
var canSetEdit = true;

model.params.franchazi_id = null;

self.setFranchaziId = function(aFranchaziId){
    model.params.franchazi_id = aFranchaziId;
};

var usersFrachaziOrTP = new UsersFrachaziOrTP();
//
//function setEdit(){
//    self.modelGrid.editable = self.btnAdd.enabled = 
//            self.btnDel.enabled = self.btnSave.enabled = isEditable;    
//    self.btnAddParent.enabled = isEditable;
//    self.tbSetEdit.visible = canSetEdit;
//    self.tbSetEdit.selected = isEditable;
//}

//function setElShown(){
//    setEdit();
//    if (!isSelectForm){
//        self.pnlSelLock.visible = false;
//        self.pnlWorkSpace.height += 48;
//        self.modelGrid.bottom += 48;
//    }
//}

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    self.model.save();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
//   setElShown();
}//GEN-LAST:event_formWindowOpened

function tbSetEditActionPerformed(evt) {//GEN-FIRST:event_tbSetEditActionPerformed
//    isEditable = self.tbSetEdit.selected;
//    setEdit();
}//GEN-LAST:event_tbSetEditActionPerformed

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing


    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        treadPointsForm.setFranchaziId(model.listFranchazi.cursor.org_franchazi_id);
        treadPointsForm.showModal(function(){
            
        });
        usersFrachaziOrTP.setFranchaziId(model.listFranchazi.cursor.org_franchazi_id);
        usersFrachaziOrTP.showModal(function(){
            
        });
    }//GEN-LAST:event_btnSelectActionPerformed
}