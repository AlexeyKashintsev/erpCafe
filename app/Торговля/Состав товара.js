/**
 * 
 * @author Алексей
 * @name ContentTradeItem
 * @public
 */

function ContentTradeItem() {
var self = this, model = this.model, form = this; 
var warehouseItemList = new WarehouseItemList();
self.productName = '';
self.block = false;

self.setTradeItem = function (aTradeItem){
    model.params.trade_item = aTradeItem;
};

self.setBlock = function(aBlock){
    self.block = aBlock;
}

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (model.modified&&confirm('Сохранить изменения?')){
        model.save();
    }
    model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    form.title = "Состав товара " + self.productName;
    if(self.block) {
        form.modelGrid.editable = false;
        form.btnAdd.visible = false;
        form.btnDel.visible = false;
        form.btnSelect.visible = false;
        form.label.visible = true;
    }
    else{
        form.modelGrid.editable = true;
        form.btnAdd.visible = true;
        form.btnDel.visible = true;
        form.btnSelect.visible = true;
        form.label.visible = false;
    }
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (model.modified&&confirm('Сохранить изменения?')){
        model.save();
    }
}//GEN-LAST:event_formWindowClosing


    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        warehouseItemList.setDialogMode();
        warehouseItemList.showModal(function(aResult){
            if(aResult){
                model.qContents.insert(
                    model.qContents.schema.trade_item, model.params.trade_item,
                    model.qContents.schema.wh_item, aResult
                );
            }
        });
    }//GEN-LAST:event_btnAddActionPerformed

    function colWh_itemOnSelect(aEditor) {//GEN-FIRST:event_colWh_itemOnSelect
        warehouseItemList.showModal(function(item){
            model.qContents.cursor.wh_item = item;
        });
    }//GEN-LAST:event_colWh_itemOnSelect

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        model.save();
        form.close(true);
    }//GEN-LAST:event_btnSelectActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        model.qContents.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed
}