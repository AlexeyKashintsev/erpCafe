/**
 * 
 * @author Алексей
 * @public
 */

function ItemsForTrade() {
    var self = this, model = this.model, form = this;
    var contentTradeItem = new ContentTradeItem();

    
    self.setFranchaziId = function(aFranchazi) {
        self.model.params.franchazi_id = aFranchazi;
    };

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (self.model.modified && confirm('Сохранить изменения?')) {
            self.model.save();
        }
        self.model.qTradeItems.requery();
}//GEN-LAST:event_btnReqActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified && confirm('Сохранить изменения?')) {
           self.model.save();
        }
}//GEN-LAST:event_formWindowClosing

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if(model.qTradeItemTypes.cursor.trade_item_type_id == 0){
            alert("Выберите тип товара");
        } else {
            model.qTradeItems.insert(
                    model.qTradeItems.schema.franchazi_id, model.params.franchazi_id,
                    model.qTradeItems.schema.item_type, model.qTradeItemTypes.cursor.trade_item_type_id
            );
        }
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm('Вы уверены что хотите удалить товар?'))
            model.qTradeItems.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked

    }//GEN-LAST:event_modelGridMouseClicked

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        model.save();
    }//GEN-LAST:event_btnSelectActionPerformed

    function btnAdd1ActionPerformed(evt) {//GEN-FIRST:event_btnAdd1ActionPerformed
        var p = model.qTradeItemTypes.cursor.parent_type;
        model.qTradeItemTypes.insert(model.qTradeItemTypes.schema.parent_type, p);
    }//GEN-LAST:event_btnAdd1ActionPerformed

    function btnAddParentActionPerformed(evt) {//GEN-FIRST:event_btnAddParentActionPerformed
        var p = model.qTradeItemTypes.cursor.trade_item_type_id;
        model.qTradeItemTypes.insert(model.qTradeItemTypes.schema.parent_type, p);
    }//GEN-LAST:event_btnAddParentActionPerformed

    function btnDel1ActionPerformed(evt) {//GEN-FIRST:event_btnDel1ActionPerformed
        if(confirm('Вы уверены что хотите удалить эту категорию?'))
            model.qTradeItemTypes.deleteRow();
    }//GEN-LAST:event_btnDel1ActionPerformed

    function btnReq1ActionPerformed(evt) {//GEN-FIRST:event_btnReq1ActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.qTradeItemTypes.requery();
    }//GEN-LAST:event_btnReq1ActionPerformed

    function btnItemSelActionPerformed(evt) {//GEN-FIRST:event_btnItemSelActionPerformed
        if(model.qTradeItems.length > 0){
            if (self.model.modified&&confirm('Сохранить изменения?')){
                self.model.save();
                contentTradeItem.setTradeItem(model.qTradeItems.cursor.trade_items_id);
                contentTradeItem.showModal(function(){
                    model.qTradeItemContents.requery();
                    model.qTradeItems.requery();
                });
            }
        } else {
            alert('Вы не выбрали товар!');
        }
    }//GEN-LAST:event_btnItemSelActionPerformed

    function modelGrid1MouseClicked(evt) {//GEN-FIRST:event_modelGrid1MouseClicked
        if(evt.clickCount === 2){
            if(model.qTradeItems.length > 0){
                if (model.modified&&confirm('Сохранить изменения?')){
                    model.save();
                }
                contentTradeItem.setTradeItem(model.qTradeItems.cursor.trade_items_id);
                contentTradeItem.productName = model.qTradeItems.cursor.item_name;
                contentTradeItem.showModal(function(){
                    model.qTradeItemContents.requery();
                    model.qTradeItems.requery();
                });
            } else {
                alert('Вы не выбрали товар!');
            }
        }
    }//GEN-LAST:event_modelGrid1MouseClicked
}