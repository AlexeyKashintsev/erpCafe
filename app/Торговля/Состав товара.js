/**
 * 
 * @author Алексей
 * @name ContentTradeItem
 * @public
 */

function ContentTradeItem() {
var self = this, model = this.model, form = this; 
var selectItemsInWH = new SelectItemsInWH();
self.productName = '';

self.setTradeItem = function (aTradeItem){
    model.params.trade_item = aTradeItem;
};

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (model.modified&&confirm('Сохранить изменения?')){
        model.save();
    }
    model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    form.title = "Состав товара " + self.productName;
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (model.modified&&confirm('Сохранить изменения?')){
        model.save();
    }
}//GEN-LAST:event_formWindowClosing


    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.qContents.insert(
                model.qContents.schema.trade_item, model.params.trade_item
        );
    }//GEN-LAST:event_btnAddActionPerformed

    function colWh_itemOnSelect(aEditor) {//GEN-FIRST:event_colWh_itemOnSelect
        selectItemsInWH.showModal(function(item){
            model.qContents.cursor.wh_item = item;
        });
    }//GEN-LAST:event_colWh_itemOnSelect

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        model.save();
        form.close(true);
    }//GEN-LAST:event_btnSelectActionPerformed
}