/**
 * 
 * @author Алексей
 * @name SelectItemsInWH
 * @public
 */

function WarehouseItemList() {

    var self = this, model = this.model, form = this;
    model.params.item_type = 0;
    self.dialogMode = false;
    
    self.setFranchazi = function(aFranchazi) {
        self.model.params.franchazi_id = aFranchazi;
    };
    
    self.setDialogMode = function() {
        self.dialogMode = true;
    };
    
    self.setTradePoint = function(aTradePoint) {
        if (self.model.modified && confirm('Сохранить изменения?')) {
            self.model.save();
        }
        model.params.trade_point_id = aTradePoint;
    };

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (self.model.modified && confirm('Сохранить изменения?')) {
            self.model.save();
        }
        self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(self.dialogMode){
            form.btnSelect.visible = true;
            form.panel2.visible = true;
        }
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified && confirm('Сохранить изменения?')) {
            model.save();
            self.model.save();
        }
}//GEN-LAST:event_formWindowClosing

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.qWarehouseItems.insert(model.qWarehouseItems.schema.item_type, model.itemType.cursor.items_types_id === 0 ? null : model.itemType.cursor.items_types_id,
                                model.qWarehouseItems.schema.franchazi_id, model.params.franchazi_id
                                );
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (model.qWarehouseItems.cursor.franchazi_id || session.userRole === 'admin') {
            if (confirm('Вы уверены что хотите удалить этот товар?'))
                model.qWarehouseItems.deleteRow();
        } else {
            alert('Данная операция доступна только администратору!');
        }
    }//GEN-LAST:event_btnDelActionPerformed

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
        self.autoChange = false;
    }//GEN-LAST:event_modelGridMouseClicked

    function itemTypeOnScrolled(evt) {//GEN-FIRST:event_itemTypeOnScrolled
        model.params.item_type = model.itemType.cursor.items_types_id;
    }//GEN-LAST:event_itemTypeOnScrolled

    function rbAllActionPerformed(evt) {//GEN-FIRST:event_rbAllActionPerformed
        model.params.show_type = 0;
    }//GEN-LAST:event_rbAllActionPerformed

    function rbMyActionPerformed(evt) {//GEN-FIRST:event_rbMyActionPerformed
        model.params.show_type = 2;
    }//GEN-LAST:event_rbMyActionPerformed

    function rbCommonActionPerformed(evt) {//GEN-FIRST:event_rbCommonActionPerformed
        model.params.show_type = 1;
    }//GEN-LAST:event_rbCommonActionPerformed

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        if(model.qWarehouseItems.length > 0){
            form.close(model.qWarehouseItems.cursor.items_catalog_id);
        } else {
            alert('Вы ничего не выбрали!');
        }
    }//GEN-LAST:event_btnSelectActionPerformed
}