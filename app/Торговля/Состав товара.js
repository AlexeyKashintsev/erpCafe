/**
 * 
 * @author Алексей
 * @name ContentTradeItem
 * @public
 */

function ContentTradeItem(aHideSaveBtn) {
    var self = this, model = this.model, form = this; 
    var warehouseItemList = new WarehouseItemList();
    self.productName = '';
    self.block = false;

    self.setTradeItem = function (aTradeItem){
        model.params.trade_item = aTradeItem;
    };

    self.setSaveBtn = function(aHide){
        self.hideSaveBtn = aHide;
    };

    self.save = function(){
            model.save();
        };
        
    if (aHideSaveBtn) self.setSaveBtn(aHideSaveBtn);

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (model.modified&&confirm('Сохранить изменения?')){
        model.save();
    }
    model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    model.qContents.requery();
    form.title = "Состав товара " + self.productName;
    if(self.hideSaveBtn) {
        form.btnSelect.visible = false;
    }
    else{
        form.btnSelect.visible = true;
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
                model.qContents.push({
                    trade_item: model.params.trade_item,
                    wh_item: aResult
                });
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
    }//GEN-LAST:event_btnSelectActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        model.qContents.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed
}