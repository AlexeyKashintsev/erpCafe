/**
 * @author Alexey
 */

//TODO Доделать

function SuppliersForm() {
    var self = this, model = this.model, form = this;
    var userSession = Session.getModule("UserSession");
    var franchazi_id = userSession.getFranchazi();
    model.qSuppliers.params.franchazi_id = franchazi_id;
    
    self.isSelectMode = false;
    
    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (model.modified&&confirm('Сохранить изменения?')){
            model.save();
        }
        model.requery();
    }//GEN-LAST:event_btnReqActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        var supplierName = prompt("Название поставщика:");
        var shortName = prompt("Сокращенное наименование:");
        if (supplierName){
            model.qSuppliers.push({
                supplier_name:  supplierName,
                short_name:     shortName,
                franchazi_id:   model.qSuppliers.params.franchazi_id
            });
        }
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if(model.itemType.cursor.franchazi_id == franchazi_id)
            model.itemType.deleteRow();
        else alert("Нельзя удалять данного поставщика!");
    }//GEN-LAST:event_btnDelActionPerformed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
    }//GEN-LAST:event_formWindowClosing

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

    }//GEN-LAST:event_formWindowOpened

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if (self.isSelectMode) {
            if (model.modified)// && confirm("Сохранить изменения?"))
                model.save();
            form.close(model.qSuppliers.cursor.suppliers_id);
        }
    }//GEN-LAST:event_buttonActionPerformed
}