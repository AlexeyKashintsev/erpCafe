/**
 * 
 * @author Алексей
 * @public
 */

function ItemsForTrade() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var contentTradeItem = new ContentTradeItem();

    
    self.setFranchazi = function(aFranchazi) {
        model.params.franchazi_id = aFranchazi;
    };

    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
            if (model.modified && confirm('Сохранить изменения?')) {
                model.save();
            }
            model.qTradeItems.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
            if (model.modified && confirm('Сохранить изменения?')) {
               model.save();
            }
    };//GEN-LAST:event_formWindowClosing

    form.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if(model.qTradeItemTypes.cursor.trade_item_type_id == 0){
            alert("Выберите тип товара");
        } else {
            model.qTradeItems.insert(
                    model.qTradeItems.schema.franchazi_id, model.params.franchazi_id,
                    model.qTradeItems.schema.item_type, model.qTradeItemTypes.cursor.trade_item_type_id
            );
        }
    };//GEN-LAST:event_btnAddActionPerformed

    form.btnDel.onActionPerformed = function(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm('Вы уверены что хотите удалить товар?'))
            model.qTradeItems.deleteRow();
    };//GEN-LAST:event_btnDelActionPerformed

    form.btnSelect.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        model.save();
    };//GEN-LAST:event_btnSelectActionPerformed

    form.btnAdd1.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAdd1ActionPerformed
        var p = model.qTradeItemTypes.cursor.parent_type;
        model.qTradeItemTypes.insert(model.qTradeItemTypes.schema.parent_type, p);
    };//GEN-LAST:event_btnAdd1ActionPerformed

    form.btnAddParent.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddParentActionPerformed
        var p = model.qTradeItemTypes.cursor.trade_item_type_id;
        model.qTradeItemTypes.insert(model.qTradeItemTypes.schema.parent_type, p);
    };//GEN-LAST:event_btnAddParentActionPerformed

    form.btnDel1.onActionPerformed = function(evt) {//GEN-FIRST:event_btnDel1ActionPerformed
        if(confirm('Вы уверены что хотите удалить эту категорию?'))
            model.qTradeItemTypes.deleteRow();
    };//GEN-LAST:event_btnDel1ActionPerformed

    form.btnReq1.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReq1ActionPerformed
        if (model.modified&&confirm('Сохранить изменения?')){
            model.save();
        }
        model.qTradeItemTypes.requery();
    };//GEN-LAST:event_btnReq1ActionPerformed

    form.btnItemSel.onActionPerformed = function(evt) {//GEN-FIRST:event_btnItemSelActionPerformed
        if(model.qTradeItems.length > 0) {
            if (model.modified&&confirm('Сохранить изменения?')){
                model.save();
            }
            contentTradeItem.setTradeItem(model.qTradeItems.cursor.trade_items_id);
            contentTradeItem.showModal(function(){
                model.qTradeItemContents.requery();
                model.qTradeItems.requery();
            });
        } else {
            alert('Вы не выбрали товар!');
        }
    };//GEN-LAST:event_btnItemSelActionPerformed


    form.select.onSelect = function(aEditor) {//GEN-FIRST:event_selectOnSelect
        model.save();
                contentTradeItem.setTradeItem(model.qTradeItems.cursor.trade_items_id);
                contentTradeItem.showModal(function(){
                    model.qTradeItemContents.requery();
                    model.qTradeItems.requery();
                });
    };//GEN-LAST:event_selectOnSelect
    
    self.show = function() {
        form.show();
    };
}