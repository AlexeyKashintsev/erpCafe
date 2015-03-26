/**
 * @author minya92
 */
function ChangeItemType() {
    var self = this, model = this.model, form = this;
    var userSession = Session.get("UserSession");
    var franchazi_id = userSession.getFranchazi();
    model.itemType.params.franchazi_id = franchazi_id;
    
    self.isSelectTradeType = false;
    
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
        var typeName = prompt("Название типа товара:");
        if(typeName){
            model.itemType.insert();
            model.itemType.cursor.type_description = typeName;
            model.itemType.cursor.franchazi_id = franchazi_id;
            model.save();
            model.requery();
        }
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if(model.itemType.cursor.franchazi_id == franchazi_id)
            model.itemType.deleteRow();
        else alert("Нельзя удалять общий тип товара!");
    }//GEN-LAST:event_btnDelActionPerformed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
    }//GEN-LAST:event_formWindowClosing

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(userSession.getUserRole() == "admin"){
            form.modelGrid.editable = true;
            form.modelGrid.deletable = true;
            form.modelGrid.insertable = true;
            
            form.btnDel.visible = true;
        }
        model.itemType.requery();
    }//GEN-LAST:event_formWindowOpened

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
        if(evt.clickCount == 2){
            if(model.itemType.cursor.franchazi_id == franchazi_id){
                var typeDesc = prompt("Введите новое наименование");
                model.itemType.cursor.type_description = typeDesc;
            }
            else if(confirm("Нельзя изменять общий тип товара!\nСоздать новый?")){
                btnAddActionPerformed();
            }
        }
    }//GEN-LAST:event_modelGridMouseClicked

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if (self.isSelectTradeType) {
            if (!model.itemType.cursor.trade_type)
                model.itemType.cursor.trade_type = true;
            if (model.modified)// && confirm("Сохранить изменения?"))
                model.save();
            form.close(model.itemType.cursor.items_types_id);
        }
    }//GEN-LAST:event_buttonActionPerformed
}
