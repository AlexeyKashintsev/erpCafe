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
    self.selectForm = false;
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
        model.queryItems.beforeFirst();
        while (model.queryItems.next()) {
            if (model.queryItems.cursor.selectItemHidden != model.queryItems.cursor.selectItem) {
                if (model.queryItems.cursor.selectItem) {
                    var obj = {};
                    obj.warehouse = model.params.trade_point_id;
                    obj.item_id = model.queryItems.cursor.wh_items_id;
                    model.queryItemsInWH.push(obj);
                } else {
                    model.delItemsInWH.params.item_id = model.queryItems.cursor.wh_items_id;
                    try {
                        model.delItemsInWH.execute();
                    } catch(e) {
                        Logger.info(e);
                    }
                    //model.delItemsInWH.executeUpdate();
                }
            }
        }
        model.save();
    }

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        ModelSave();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        form.pnlSelLock.visible = self.selectForm;
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified && confirm('Сохранить изменения?')) {
            ModelSave();
            self.model.save();
        }
}//GEN-LAST:event_formWindowClosing

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.queryItems.insert(model.queryItems.schema.item_type, model.itemType.cursor.wh_item_types_id,
                                model.queryItems.schema.franchazi_id, model.params.franchazi_id,
                                model.queryItems.schema.warehouse, model.params.trade_point_id
                                );
        model.queryItems.cursor.item_id = model.queryItems.cursor.wh_items_id;
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm('Вы уверены что хотите удалить этот товар?'))
            model.queryItems.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
        self.autoChange = false;
    }//GEN-LAST:event_modelGridMouseClicked

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
//        var items = [];
//        var i = 0;
//        model.queryItems.beforeFirst();
//        while (model.queryItems.next()) {
//            if (model.queryItems.cursor.selectItem) {
//                items[i] = {};
//                items[i].franchazi_id = model.queryItems.cursor.franchazi_id;
//                items[i].item_name = model.queryItems.cursor.item_name;
//                items[i].item_type = model.queryItems.cursor.item_type;
//                items[i].wh_item_id = model.queryItems.cursor.wh_items_id;
//                i++;
//            }
//        }
//        alert(items);
        if(model.queryItems.length > 0){
            form.close(model.queryItems.cursor.wh_items_id);
        } else {
            alert('Вы ничего не выбрали!');
        }
    }//GEN-LAST:event_btnSelectActionPerformed

    function queryItemsOnChanged(evt) {//GEN-FIRST:event_queryItemsOnChanged
        if (!self.autoChange) {
            var i = 0;
            model.queryItems.beforeFirst();
            while (model.queryItems.next()) {
                if (model.queryItems.cursor.selectItemHidden !== model.queryItems.cursor.selectItem &&
                        self.changes[model.queryItems.cursor.wh_items_id] === undefined) {
                    self.changes[model.queryItems.cursor.wh_items_id] = model.queryItems.cursor.selectItem;
                }
                else if (model.queryItems.cursor.selectItemHidden === model.queryItems.cursor.selectItem &&
                        self.changes[model.queryItems.cursor.wh_items_id] !== undefined)
                    delete self.changes[model.queryItems.cursor.wh_items_id]
            }
        }
    }//GEN-LAST:event_queryItemsOnChanged

    function queryItemsOnRequeried(evt) {//GEN-FIRST:event_queryItemsOnRequeried
        self.autoChange = true;
        model.queryItems.beforeFirst();
        while (model.queryItems.next()){
            if (self.changes[model.queryItems.cursor.wh_items_id] !== undefined)
                model.queryItems.cursor.selectItem = self.changes[model.queryItems.cursor.wh_items_id];
        }
    }//GEN-LAST:event_queryItemsOnRequeried
}