/**
 * 
 * @author Алексей
 * @name SelectFranchaziAdminForm
 * @public
 */

function SelectFranchaziAdminForm() {
var self = this, model = this.model, form = this;
//model.listFranchazi.schema.org_franchazi_id.pk = true;

var isSelectForm = true;
var isEditable = false;
var canSetEdit = true;

var tradePointsForm = new TradePointsForm();
var usersFrachaziOrTP = new UsersFrachaziOrTP();
var selectFranchaziForm = new SelectFranchaziForm();
var selectBaristForm = new SelectBaristForm();

function setEdit(){
//    self.modelGrid.editable = self.btnAdd.enabled = 
//            self.btnDel.enabled = self.btnSave.enabled = isEditable;    
//    self.btnAddParent.enabled = isEditable;
//    self.tbSetEdit.visible = canSetEdit;
//    self.tbSetEdit.selected = isEditable;
}

function setElShown(){
    setEdit();
    if (!isSelectForm){
        self.pnlSelLock.visible = false;
        self.pnlWorkSpace.height += 48;
        self.modelGrid.bottom += 48;
    }
}

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
   setElShown();
}//GEN-LAST:event_formWindowOpened

function tbSetEditActionPerformed(evt) {//GEN-FIRST:event_tbSetEditActionPerformed
    isEditable = self.tbSetEdit.selected;
    setEdit();
}//GEN-LAST:event_tbSetEditActionPerformed

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing


    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
//        tradePointsForm.setFranchaziId(model.listFranchazi.cursor.org_franchazi_id);
//        tradePointsForm.showModal(function(){            
//        });

//        usersFrachaziOrTP.setFranchaziId(model.listFranchazi.cursor.org_franchazi_id);
//        usersFrachaziOrTP.showModal(function(){          
//        });

//        selectFranchaziForm.setFranchazi_id(model.listFranchazi.cursor.org_franchazi_id);
//        selectFranchaziForm.showModal(function(){          
//        });
        
//        selectFranchaziForm.setFranchaziId(model.listFranchazi.cursor.org_franchazi_id);
//        selectFranchaziForm.showModal(function(){          
//        });
//        
        selectBaristForm.setFranchaziId(model.listFranchazi.cursor.org_franchazi_id);
        selectBaristForm.showModal(function(){          
        });
    }//GEN-LAST:event_btnSelectActionPerformed
}