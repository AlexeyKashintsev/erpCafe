/**
 * 
 * @author Work
 */
function ItemsForTrade() {
    var self = this, model = this.model, form = this;
    var us = Session.get("UserSession");
    var itemTypes = new ChangeItemType();
    var contentTradeItem = new ContentTradeItem();
    
    function btnItemCreateDoubleActionPerformed(evt) {//GEN-FIRST:event_btnItemCreateDoubleActionPerformed
        //TODO Дублирование теперь не нужно
        //Переделать в подгрузку стандартных айтемов
    }//GEN-LAST:event_btnItemCreateDoubleActionPerformed

    function btnItemEditContentActionPerformed(evt) {//GEN-FIRST:event_btnItemEditContentActionPerformed
        //Редактор состава товара.  Убрал проверку на админа.
        if (model.qTradeItemsWithContents.length > 0) {
            if (model.modified && confirm('Сохранить изменения?')) {
                model.save();
            }
            Logger.info(model.qTradeItemsWithContents.cursor.wh_items_id);
            contentTradeItem.setTradeItem(model.qTradeItemsWithContents.cursor.wh_items_id);
            contentTradeItem.setBlock(false);
            contentTradeItem.showModal(function() {
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
        if (model.qTradeItemsWithContents.cursor.franchazi_id) {
            if (confirm('Вы уверены что хотите удалить товар?'))
                model.qTradeItemsWithContents.deleteRow();
        } else {
            alert('Данная операция доступна только администратору!');
        }
    }//GEN-LAST:event_btnDelActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if (model.qTradeItemTypes.cursor.trade_item_type_id <= 0) {
            alert("Выберите тип товара отличный от \"Все товары\" и \"Мои товары\"");
        } else {
            model.qTradeItemsWithContents.insert(
                    model.qTradeItemsWithContents.schema.franchazi_id, model.params.franchazi_id,
                    model.qTradeItemsWithContents.schema.item_type, model.qTradeItemTypes.cursor.trade_item_type_id
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

    function qTradeItemTypesOnRequeried(evt) {//GEN-FIRST:event_qTradeItemTypesOnRequeried
        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_qTradeItemTypesOnRequeried

    function qTradeItemTypesOnScrolled(evt) {//GEN-FIRST:event_qTradeItemTypesOnScrolled
        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_qTradeItemTypesOnScrolled

    function qTradeItemsOnChanged(evt) {//GEN-FIRST:event_qTradeItemsOnChanged
        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_qTradeItemsOnChanged

    function qTradeItemsOnScrolled(evt) {//GEN-FIRST:event_qTradeItemsOnScrolled
        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_qTradeItemsOnScrolled

    function qTradeItemsWillChange(evt) {//GEN-FIRST:event_qTradeItemsWillChange
        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_qTradeItemsWillChange

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(us.getUserRole() == "admin"){
            model.params.franchazi_id = 0;
        } else {
            model.params.franchazi_id = session.franchaziId;
        }
    }//GEN-LAST:event_formWindowOpened
}
