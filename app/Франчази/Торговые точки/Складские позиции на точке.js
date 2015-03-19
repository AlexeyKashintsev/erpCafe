/**
 * 
 * @author Алексей
 * @name SelectItemsInWH
 * @public
 */

function SelectItemsInWH() {

    var self = this, model = this.model, form = this;

    self.changes = [];
    self.autoChange = true;
    model.params.item_type = null;
    
    self.setFranchazi = function(aFranchazi) {
        self.model.params.franchazi_id = aFranchazi;
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

    function ModelSave() {
        /*model.queryItems.forEach(function(cursor) {
            if (cursor.selectItemHidden != cursor.selectItem) {
                if (cursor.selectItem) {
                    var obj = {};
                    obj.warehouse = model.params.trade_point_id;
                    obj.item_id = cursor.items_catalog_id;
                    model.queryItemsInWH.push(obj);
                } else {
                    model.delItemsInWH.params.item_id = cursor.items_catalog_id;
                    try {
                        model.delItemsInWH.execute();
                    } catch(e) {
                        Logger.info(e);
                    }
                    //model.delItemsInWH.executeUpdate();
                }
            }
        });
        model.save();*/
        alert('Данный функционал временно не доступен');
    }

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        ModelSave();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified && confirm('Сохранить изменения?')) {
            ModelSave();
            self.model.save();
        }
}//GEN-LAST:event_formWindowClosing

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.queryItems.insert(model.queryItems.schema.item_type, model.itemType.cursor.items_types_id,
                                model.queryItems.schema.franchazi_id, model.params.franchazi_id,
                                model.queryItems.schema.warehouse, model.params.trade_point_id
                                );
        model.queryItems.cursor.item_id = model.queryItems.cursor.items_catalog_id;
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm('Вы уверены что хотите удалить этот товар?'))
            model.queryItems.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
        self.autoChange = false;
    }//GEN-LAST:event_modelGridMouseClicked
}