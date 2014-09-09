/**
 * 
 * @author Алексей
 * @name ContentTradeItem
 * @public
 */

function ContentTradeItem() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model); 
    var selectItemsInWH = new SelectItemsInWH();
    self.productName = '';

    self.setTradeItem = function (aTradeItem){
        model.params.trade_item = aTradeItem;
    };

    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (model.modified&&confirm('Сохранить изменения?')){
            model.save();
        }
        model.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        form.title = "Состав товара " + self.productName;
    };//GEN-LAST:event_formWindowOpened

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
        if (model.modified&&confirm('Сохранить изменения?')){
            model.save();
        }
    };//GEN-LAST:event_formWindowClosing


    from.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.qContents.insert(
                model.qContents.schema.trade_item, model.params.trade_item
        );
    };//GEN-LAST:event_btnAddActionPerformed

    form.colWh_item.onSelect = function(aEditor) {//GEN-FIRST:event_colWh_itemOnSelect
        selectItemsInWH.showModal(function(item){
            model.qContents.cursor.wh_item = item;
        });
    };//GEN-LAST:event_colWh_itemOnSelect

    form.btnSelect.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        model.save();
        form.close(true);
    };//GEN-LAST:event_btnSelectActionPerformed
    
    self.show = function() {
        form.show();
    };
}