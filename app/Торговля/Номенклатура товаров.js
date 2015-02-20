/**
 * 
 * @author Work
 */
function ItemsForTrade() {
    var self = this, model = this.model, form = this;
    var itemTypes, contentTradeItem, itemSettings; 
    model.params.franchazi_id = session.franchaziId;
    
    require(['ChangeItemType', 'ContentTradeItem', 'ItemSettings'], function() {
        itemTypes = new ChangeItemType();
        contentTradeItem = new ContentTradeItem();
        itemSettings = new ItemSettings(); 
    });
    

    function btnItemEditContentActionPerformed(evt) {//GEN-FIRST:event_btnItemEditContentActionPerformed
        if (model.qTradeItemsWithContents.length > 0) {
            if (model.modified && confirm('Сохранить изменения?')) {
                model.save();
            }
            Logger.info(model.qTradeItemsWithContents.cursor.wh_items_id);
            itemSettings.setTradeItem(model.qTradeItemsWithContents.cursor.wh_items_id);
            itemSettings.showModal(function() {
                model.requery();
            });
        } else {
            alert('Вы не выбрали товар!');
        }
    }//GEN-LAST:event_btnItemEditContentActionPerformed

    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (model.modified && confirm('Сохранить изменения?')) {
            model.save();
        }
        model.qTradeItemsWithContents.requery();
    }//GEN-LAST:event_btnReqActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm('Вы уверены что хотите удалить товар?'))
            model.qTradeItemsWithContents.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if (model.itemType.cursor.wh_items_type_id <= 0) {
            alert("Выберите тип товара отличный от \"Все товары\" и \"Мои товары\"");
        } else {
            model.qTradeItemsWithContents.push({
                    franchazi_id    : model.params.franchazi_id,
                    item_type       : model.itemType.cursor.wh_items_type_id
                });
        }
    }//GEN-LAST:event_btnAddActionPerformed

    function btnConfigureTypesActionPerformed(evt) {//GEN-FIRST:event_btnConfigureTypesActionPerformed
        itemTypes.showModal(function(){
            model.requery();
        });
    }//GEN-LAST:event_btnConfigureTypesActionPerformed

    function itemTypeOnScrolled(evt) {//GEN-FIRST:event_itemTypeOnScrolled
        model.qTradeItemsWithContents.params.item_type = model.itemType.cursor.wh_item_types_id;
        model.qTradeItemsWithContents.requery();
    }//GEN-LAST:event_itemTypeOnScrolled

    function qTradeItemsWithContentsOnRequeried(evt) {//GEN-FIRST:event_qTradeItemsWithContentsOnRequeried
        if (model.qTradeItemsWithContents.empty 
                && model.itemType.wh_item_types_id === 0
                && confirm('Не обнаружено товарной номенклатуры.\nЗаполнить из основного справочника?')) {
            (new ServerModule('WhModuleAdmin')).initItemsForFranchazi(session.franchaziId, model.requery);
        }
    }//GEN-LAST:event_qTradeItemsWithContentsOnRequeried

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
    }//GEN-LAST:event_btnSaveActionPerformed
}
