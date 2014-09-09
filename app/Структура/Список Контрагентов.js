/**
 * 
 * @author Алексей
 * @name ContragentForm
 * @public
 */

function ContragentForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

    var contragentDetailsForm = new ContragentDetailsForm();

    var isSelectForm = true;
    var isEditable = false;
    var canSetEdit = true;

    function setEdit(){
        self.modelGrid.editable = false;
        self.btnAdd.enabled = true;
        self.btnDel.enabled = true;
        self.btnAddParent.enabled = isEditable;
    }

    function setElShown(){
        setEdit();
        if (!isSelectForm){
            self.pnlSelLock.visible = false;
            self.pnlWorkSpace.height += 48;
            self.modelGrid.bottom += 48;
        }
    }

    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
    //    if (self.model.modified&&confirm('Сохранить изменения?')){
    //        self.model.save();
    //    }
        self.model.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        self.model.save();
    };//GEN-LAST:event_btnSaveActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        setElShown();
    };//GEN-LAST:event_formWindowOpened

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
    };//GEN-LAST:event_formWindowClosing

    form.modelGrid.onMouseClicked = function(evt) {//GEN-FIRST:event_modelGridMouseClicked
        if(evt.clickCount == 2) {
            contragentDetailsForm.setContragentId(model.listContragent.cursor.org_contragent_id);
            contragentDetailsForm.showModal(function(aResult){
                self.model.requery();
            });
        }  
    };//GEN-LAST:event_modelGridMouseClicked

    form.btnSelect.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        contragentDetailsForm.setContragentId(model.listContragent.cursor.org_contragent_id);
        contragentDetailsForm.showModal(function(aResult){
            self.model.requery();
        });
    };//GEN-LAST:event_btnSelectActionPerformed

    form.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        contragentDetailsForm.showModal(function(aResult){
            self.model.requery();
        });
    };//GEN-LAST:event_btnAddActionPerformed

    form.btnDel.onActionPerformed = function(evt) {//GEN-FIRST:event_btnDelActionPerformed
        model.listContragent.deleteRow();
        model.save();
        self.model.requery();
    };//GEN-LAST:event_btnDelActionPerformed
    
    self.show = function() {
        form.show();
    };
}