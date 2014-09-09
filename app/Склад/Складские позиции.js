/**
 * 
 * @author Алексей
 * @name SelectItemsInWH
 * @public
 */

function WarehouseItemList() {

    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    model.params.item_type = null;
   // model.params.franchazi_id = 1;
    self.setFranchazi = function(aFranchazi) {
        self.model.params.franchazi_id = aFranchazi;
    };
    
    self.setTradePoint = function(aTradePoint) {
        if (self.model.modified && confirm('Сохранить изменения?')) {
            self.model.save();
        }
        model.params.trade_point_id = aTradePoint;
    };

    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
            if (self.model.modified && confirm('Сохранить изменения?')) {
                self.model.save();
            }
            self.model.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
            model.save();
    };//GEN-LAST:event_btnSaveActionPerformed

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
            if (self.model.modified && confirm('Сохранить изменения?')) {
                model.save();
                self.model.save();
            }
    };//GEN-LAST:event_formWindowClosing

    form.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.qWarehouseItems.insert(model.qWarehouseItems.schema.item_type, model.itemType.cursor.wh_item_types_id,
                                model.qWarehouseItems.schema.franchazi_id, model.params.franchazi_id
                                );
    };//GEN-LAST:event_btnAddActionPerformed

    form.btnDel.onActionPerformed = function(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm('Вы уверены что хотите удалить этот товар?'))
            model.qWarehouseItems.deleteRow();
    };//GEN-LAST:event_btnDelActionPerformed

    form.modelGrid.onMouseClicked = function(evt) {//GEN-FIRST:event_modelGridMouseClicked
        self.autoChange = false;
    };//GEN-LAST:event_modelGridMouseClicked

    form.btnSelect.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        if(model.qWarehouseItems.length > 0){
            form.close(model.qWarehouseItems.cursor.wh_items_id);
        } else {
            alert('Вы ничего не выбрали!');
        }
    };//GEN-LAST:event_btnSelectActionPerformed
    
    self.show = function() {
        form.show();
    };
}