/**
 * 
 * @author Work
 */
function ItemsForTrade() {
    var self = this, model = this.model, form = this;
    var itemTypes, contentTradeItem, itemSettings; 
    require(['ChangeItemType', 'ContentTradeItem', 'ItemSettings'], function() {
        itemTypes = new ChangeItemType();
        contentTradeItem = new ContentTradeItem();
        itemSettings = new ItemSettings(); 
    });

    function btnItemEditContentActionPerformed(evt) {//GEN-FIRST:event_btnItemEditContentActionPerformed
        //Редактор состава товара.  Убрал проверку на админа.
        if (model.qTradeItemsWithContents.length > 0) {
            if (model.modified && confirm('Сохранить изменения?')) {
                model.save();
            }
            Logger.info(model.qTradeItemsWithContents.cursor.wh_items_id);
//            contentTradeItem.setTradeItem(model.qTradeItemsWithContents.cursor.wh_items_id);
//            contentTradeItem.setBlock(false);
//            contentTradeItem.showModal(function() {
//                model.requery();
//            });
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
        //Убрал проверку
        //if (model.qTradeItemsWithContents.cursor.franchazi_id) {
            if (confirm('Вы уверены что хотите удалить товар?'))
                model.qTradeItemsWithContents.deleteRow();
//        } else {
//            alert('Данная операция доступна только администратору!');
//        }
    }//GEN-LAST:event_btnDelActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if (model.itemType.cursor.wh_items_type_id <= 0) {
            alert("Выберите тип товара отличный от \"Все товары\" и \"Мои товары\"");
        } else {
            model.qTradeItemsWithContents.insert(
                    model.qTradeItemsWithContents.schema.franchazi_id, model.params.franchazi_id,
                    model.qTradeItemsWithContents.schema.item_type, model.itemType.cursor.wh_items_type_id
                    );
        }
    }//GEN-LAST:event_btnAddActionPerformed

    function btnAdd1ActionPerformed(evt) {//GEN-FIRST:event_btnAdd1ActionPerformed
        itemTypes.showModal(function(){
            model.requery();
        });
    }//GEN-LAST:event_btnAdd1ActionPerformed

    function itemTypeOnScrolled(evt) {//GEN-FIRST:event_itemTypeOnScrolled
        model.qTradeItemsWithContents.params.item_type = model.itemType.cursor.wh_item_types_id;
        model.qTradeItemsWithContents.requery();
    }//GEN-LAST:event_itemTypeOnScrolled

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

    }//GEN-LAST:event_formWindowOpened
}
