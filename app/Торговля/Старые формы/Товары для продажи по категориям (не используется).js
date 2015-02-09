/**
 * 
 * @author Алексей
 * @public
 */

function ____________ItemsForTrade() {
    var self = this, model = this.model, form = this;
    var contentTradeItem = new ContentTradeItem();
    var session = new ServerReport("UserSession");
    var bonus = new ServerModule("BonusModule");
    
    model.params.franchazi_id = session.getFranchazi();
    
    self.setFranchazi = function(aFranchazi) {
        model.params.franchazi_id = aFranchazi;
    };

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (model.modified && confirm('Сохранить изменения?')) {
            model.save();
        }
        model.qTradeItems.requery();
        model.qTradeItemContents.requery();
}//GEN-LAST:event_btnReqActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (model.modified && confirm('Сохранить изменения?')) {
            model.save();
        }
}//GEN-LAST:event_formWindowClosing

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if (model.itemType.cursor.wh_item_types_id <= 0) {
            alert("Выберите тип товара отличный от \"Все товары\" и \"Мои товары\"");
        } else {
            model.qTradeItems.insert(
                    model.qTradeItems.schema.franchazi_id, model.params.franchazi_id,
                    model.qTradeItems.schema.item_type, model.itemType.cursor.wh_item_types_id
                    );
        }
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        //Убрал проверку
        if (model.qTradeItems.cursor.franchazi_id) {
            if (confirm('Вы уверены что хотите удалить товар?'))
                model.qTradeItems.deleteRow();
        } else {
            alert('Данная операция доступна только администратору!');
        }
    }//GEN-LAST:event_btnDelActionPerformed

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked

    }//GEN-LAST:event_modelGridMouseClicked

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        model.save();
    }//GEN-LAST:event_btnSelectActionPerformed

    function btnAdd1ActionPerformed(evt) {//GEN-FIRST:event_btnAdd1ActionPerformed
        var p = model.itemType.cursor.parent_type;
        model.itemType.insert(model.itemType.schema.parent_type, p);
    }//GEN-LAST:event_btnAdd1ActionPerformed

    function btnAddParentActionPerformed(evt) {//GEN-FIRST:event_btnAddParentActionPerformed
        var p = model.itemType.cursor.wh_item_types_id;
        model.itemType.insert(model.itemType.schema.parent_type, p);
    }//GEN-LAST:event_btnAddParentActionPerformed

    function btnDel1ActionPerformed(evt) {//GEN-FIRST:event_btnDel1ActionPerformed
        //TODO Разрешить франчайзям
        if (model.qTradeItems.cursor.franchazi_id || session.userRole === 'admin') {
            if (confirm('Вы уверены что хотите удалить эту категорию?'))
                model.itemType.deleteRow();
        } else {
            alert('Данная операция доступна только администратору!');
        }
    }//GEN-LAST:event_btnDel1ActionPerformed

    function btnReq1ActionPerformed(evt) {//GEN-FIRST:event_btnReq1ActionPerformed
        if (model.modified && confirm('Сохранить изменения?')) {
            model.save();
        }
        model.itemType.requery();
    }//GEN-LAST:event_btnReq1ActionPerformed

    function btnItemEditContentActionPerformed(evt) {//GEN-FIRST:event_btnItemEditContentActionPerformed
        //Редактор состава товара.  Убрал проверку на админа.

        if (model.qTradeItems.length > 0) {
            if (model.modified && confirm('Сохранить изменения?')) {
                model.save();
            }
            Logger.info(model.qTradeItems.cursor.wh_items_id);
            contentTradeItem.setTradeItem(model.qTradeItems.cursor.wh_items_id);
            contentTradeItem.setBlock(false);
            contentTradeItem.showModal(function() {
                model.requery();
            });
        } else {
            alert('Вы не выбрали товар!');
        }
    }//GEN-LAST:event_btnItemEditContentActionPerformed

    function selectOnSelect(aEditor) {//GEN-FIRST:event_selectOnSelect
        model.save();
        model.qTradeItems.requery();
        model.qTradeItemContents.requery();
        Logger.info(model.qTradeItems.cursor.wh_items_id);
        contentTradeItem.setTradeItem(model.qTradeItems.cursor.wh_items_id);
        contentTradeItem.showModal(function() {
            model.qTradeItemContents.requery();
            model.qTradeItems.requery();
        });
    }//GEN-LAST:event_selectOnSelect
    var flag = 0;
    function qTradeItemsOnChanged(evt) {//GEN-FIRST:event_qTradeItemsOnChanged
        if (!evt.object.franchazi_id) {
            if (flag === 0) {

                model.qTradeItemContents.beforeFirst();
                while (model.qTradeItemContents.next()) {
                    if (model.qTradeItemContents.cursor.wh_items_id === model.qTradeItems.cursor.wh_items_id) {
                        model.qTradeItems.insert(
                                model.qTradeItems.schema.franchazi_id, model.params.franchazi_id,
                                model.qTradeItems.schema.item_type, model.qTradeItems.cursor.item_type,
                                model.qTradeItems.schema.original_id, model.qTradeItems.cursor.wh_items_id
                                );
                        model.qTradeItemContents.insert(
                                model.qTradeItemContents.schema.wh_items_id, model.qTradeItems.cursor.wh_items_id,
                                model.qTradeItemContents.schema.contents, model.qTradeItemContents.cursor.contents
                                );
                    }
                }

                flag = 1;

                model.qContents.params.trade_item_id = evt.object.wh_items_id;
                model.qContents.requery(function() {
                    if (model.qContents.length > 0) {
                        model.qContents.beforeFirst();
                        while (model.qContents.next()) {
                            model.qContents.insert(
                                    model.qContents.schema.wh_item, model.qContents.cursor.wh_item,
                                    model.qContents.schema.usage_quantity, model.qContents.cursor.usage_quantity,
                                    model.qContents.schema.trade_item, model.qTradeItems.cursor.wh_items_id
                                    );
                        }
                    }
                    alert("Товар продублирован!");
                    model.qTradeItems.beforeFirst();
                    while (model.qTradeItems.next()) {
                        if (model.qTradeItems.cursor.item_name === evt.newValue) {
                            model.qTradeItems.cursor.item_name = evt.oldValue;
                            flag = 0;
                        }
                        if (!model.qTradeItems.cursor.item_name)
                            model.qTradeItems.cursor.item_name = evt.newValue;
                    }
                });
            }
        }
    }//GEN-LAST:event_qTradeItemsOnChanged

    function qTradeItemsWillChange(evt) {//GEN-FIRST:event_qTradeItemsWillChange
        
    }//GEN-LAST:event_qTradeItemsWillChange

    function btnItemCreateDoubleActionPerformed(evt) {//GEN-FIRST:event_btnItemCreateDoubleActionPerformed
        //TODO Дублирование теперь не нужно
        //Переделать в подгрузку стандартных айтемов
        model.qContents.params.trade_item_id = model.qTradeItems.cursor.wh_items_id;
        model.qTradeItemContents.beforeFirst();
        while (model.qTradeItemContents.next()) {
            if (model.qTradeItemContents.cursor.wh_items_id === model.qTradeItems.cursor.wh_items_id) {
                model.qTradeItems.insert(
                        model.qTradeItems.schema.franchazi_id, model.params.franchazi_id,
                        model.qTradeItems.schema.item_type, model.qTradeItems.cursor.item_type,
                        model.qTradeItems.schema.item_name, model.qTradeItems.cursor.item_name + " - копия",
                        model.qTradeItems.schema.original_id, model.qTradeItems.cursor.wh_items_id
                        );
                model.qTradeItemContents.insert(
                        model.qTradeItemContents.schema.wh_items_id, model.qTradeItems.cursor.wh_items_id,
                        model.qTradeItemContents.schema.contents, model.qTradeItemContents.cursor.contents
                        );
            }
        }

        model.qContents.requery(function() {
            if (model.qContents.length > 0) {
                model.qContents.beforeFirst();
                while (model.qContents.next()) {
                    model.qContents.insert(
                            model.qContents.schema.wh_item, model.qContents.cursor.wh_item,
                            model.qContents.schema.usage_quantity, model.qContents.cursor.usage_quantity,
                            model.qContents.schema.trade_item, model.qTradeItems.cursor.wh_items_id
                            );
                }
            }
        });    
    }//GEN-LAST:event_btnItemCreateDoubleActionPerformed

    function paramsOnChanged(evt) {//GEN-FIRST:event_paramsOnChanged
    }//GEN-LAST:event_paramsOnChanged

    function qTradeItemsOnScrolled(evt) {//GEN-FIRST:event_qTradeItemsOnScrolled
        model.qBonusCountForTradeItemReadonly.params.trade_item = model.qTradeItems.cursor.wh_items_id;
        model.qBonusCountForTradeItemReadonly.params.trade_type = null;
        model.qBonusCountForTradeItemReadonly.requery(function() {
            if (model.qBonusCountForTradeItemReadonly.length > 0) {
                form.lbItem.text = "Бонусная ставка по товару: " + model.qBonusCountForTradeItemReadonly.cursor.bonus_rate + "%";
                if (model.qTradeItems.cursor.franchazi_id)
                    form.btnResetItems.visible = true;
            } else {
                form.lbItem.text = "Бонусная ставка по товару не назначена";
                form.btnResetItems.visible = false;
            }
        });
    }//GEN-LAST:event_qTradeItemsOnScrolled

    function lbCategoryMouseClicked(evt) {//GEN-FIRST:event_lbCategoryMouseClicked
        if (evt.clickCount > 1 && session.getUserRole() === "admin") {
            var rate = prompt("Введите бонусную ставку для категории товара: " + model.itemType.cursor.type_description, 0);
            if (rate) {
                model.qBonusCountForTradeItemReadonly.params.trade_type = model.itemType.cursor.wh_item_types_id;
                model.qBonusCountForTradeItemReadonly.params.trade_item = null;
                bonus.setBonusRate(null, model.itemType.cursor.wh_item_types_id, rate);
                form.lbCategory.text = "Бонусная ставка по категории товара: " + rate + "%";
                form.btnResetCategory.visible = true;
            }
        }
    }//GEN-LAST:event_lbCategoryMouseClicked

    function lbItemMouseClicked(evt) {//GEN-FIRST:event_lbItemMouseClicked
        if ((evt.clickCount > 1 && model.qTradeItems.cursor.franchazi_id) || (evt.clickCount > 1 && session.getUserRole() === "admin")) {
            var rate = prompt("Введите бонусную ставку для товара: " + model.qTradeItems.cursor.item_name, 0);
            if (rate) {
                bonus.setBonusRate(model.qTradeItems.cursor.wh_items_id, null, rate);
                form.lbItem.text = "Бонусная ставка по товару: " + rate + "%";
                form.btnResetItems.visible = true;
            }
        }
    }//GEN-LAST:event_lbItemMouseClicked

    function btnResetItemsActionPerformed(evt) {//GEN-FIRST:event_btnResetItemsActionPerformed
        bonus.clearBonusRate(model.qTradeItems.cursor.wh_items_id, null);
        form.lbItem.text = "Бонусная ставка по товару не назначена";
        form.btnResetItems.visible = false;
    }//GEN-LAST:event_btnResetItemsActionPerformed

    function btnResetCategoryActionPerformed(evt) {//GEN-FIRST:event_btnResetCategoryActionPerformed
        bonus.clearBonusRate(null, model.itemType.cursor.wh_item_types_id);
        form.lbCategory.text = "Бонусная ставка по категории товара не назначена";
        form.btnResetCategory.visible = false;
    }//GEN-LAST:event_btnResetCategoryActionPerformed
}