/**
 * 
 * @author Алексей
 * @public
 */

function ItemsForTrade() {
    var self = this, model = this.model, form = this;
    var contentTradeItem = new ContentTradeItem();
    var session = new ServerReport("UserSession");
    var bonus = new ServerModule("BonusModule");

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
        if (model.qTradeItemTypes.cursor.trade_item_type_id <= 0) {
            alert("Выберите тип товара отличный от \"Все товары\" и \"Мои товары\"");
        } else {
            model.qTradeItems.insert(
                    model.qTradeItems.schema.franchazi_id, model.params.franchazi_id,
                    model.qTradeItems.schema.item_type, model.qTradeItemTypes.cursor.trade_item_type_id
                    );
        }
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (model.qTradeItems.cursor.franchazi_id || session.userRole === 'admin') {
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
        var p = model.qTradeItemTypes.cursor.parent_type;
        model.qTradeItemTypes.insert(model.qTradeItemTypes.schema.parent_type, p);
    }//GEN-LAST:event_btnAdd1ActionPerformed

    function btnAddParentActionPerformed(evt) {//GEN-FIRST:event_btnAddParentActionPerformed
        var p = model.qTradeItemTypes.cursor.trade_item_type_id;
        model.qTradeItemTypes.insert(model.qTradeItemTypes.schema.parent_type, p);
    }//GEN-LAST:event_btnAddParentActionPerformed

    function btnDel1ActionPerformed(evt) {//GEN-FIRST:event_btnDel1ActionPerformed
        if (session.userRole === 'admin') {
            if (confirm('Вы уверены что хотите удалить эту категорию?'))
                model.qTradeItemTypes.deleteRow();
        } else {
            alert('Данная операция доступна только администратору!');
        }
    }//GEN-LAST:event_btnDel1ActionPerformed

    function btnReq1ActionPerformed(evt) {//GEN-FIRST:event_btnReq1ActionPerformed
        if (model.modified && confirm('Сохранить изменения?')) {
            model.save();
        }
        model.qTradeItemTypes.requery();
    }//GEN-LAST:event_btnReq1ActionPerformed

    function btnItemEditContentActionPerformed(evt) {//GEN-FIRST:event_btnItemEditContentActionPerformed
        if (model.qTradeItems.cursor.franchazi_id || session.userRole === 'admin') {
            if (model.qTradeItems.length > 0) {
                if (model.modified && confirm('Сохранить изменения?')) {
                    model.save();
                }
                Logger.info(model.qTradeItems.cursor.wh_items_id);
                contentTradeItem.setTradeItem(model.qTradeItems.cursor.wh_items_id);
                contentTradeItem.setBlock(false);
                contentTradeItem.showModal(function() {
                    /* model.qTradeItemContents.requery();                   .* ьщвудюйЕкфвуШеуьСщтеутеыюкуйгукн()ж
                     
                     model.qTradeItems.requery();*/
                    model.requery();
                });
            } else {
                alert('Вы не выбрали товар!');
            }
        } else {
            contentTradeItem.setTradeItem(model.qTradeItems.cursor.wh_items_id);
            contentTradeItem.setBlock(true);
            //alert("Сначала продублируйте товар!");
            contentTradeItem.showModal(function() {
                model.requery();
            });
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
            if (flag == 0) {

                model.qTradeItemContents.beforeFirst();
                while (model.qTradeItemContents.next()) {
                    if (model.qTradeItemContents.cursor.wh_items_id == model.qTradeItems.cursor.wh_items_id) {
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
                        if (model.qTradeItems.cursor.item_name == evt.newValue) {
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
        model.qContents.params.trade_item_id = model.qTradeItems.cursor.wh_items_id;
        model.qTradeItemContents.beforeFirst();
        while (model.qTradeItemContents.next()) {
            if (model.qTradeItemContents.cursor.wh_items_id == model.qTradeItems.cursor.wh_items_id) {
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

    function rbAllActionPerformed(evt) {//GEN-FIRST:event_rbAllActionPerformed
        model.params.show_type = 0;
    }//GEN-LAST:event_rbAllActionPerformed

    function rbMyActionPerformed(evt) {//GEN-FIRST:event_rbMyActionPerformed
        model.params.show_type = 2;
    }//GEN-LAST:event_rbMyActionPerformed

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

    function qTradeItemTypesOnScrolled(evt) {//GEN-FIRST:event_qTradeItemTypesOnScrolled
        //alert(model.qTradeItemTypes.cursor.trade_item_type_id);
        model.qBonusCountForTradeItemReadonly.params.trade_type = model.qTradeItemTypes.cursor.trade_item_type_id;
        model.qBonusCountForTradeItemReadonly.params.trade_item = null;
        model.qBonusCountForTradeItemReadonly.requery(function() {
            if (!model.qBonusCountForTradeItemReadonly.empty) {
                form.lbCategory.text = "Бонусная ставка по категории товара: " + model.qBonusCountForTradeItemReadonly.cursor.bonus_rate + "%";
                if (session.getUserRole() === "admin")
                    form.btnResetCategory.visible = true;
            } else {
                form.lbCategory.text = "Бонусная ставка по категории товара не назначена";
                form.btnResetCategory.visible = false;
            }
        });
    }//GEN-LAST:event_qTradeItemTypesOnScrolled

    function lbCategoryMouseClicked(evt) {//GEN-FIRST:event_lbCategoryMouseClicked
        if (evt.clickCount > 1 && session.getUserRole() === "admin") {
            var rate = prompt("Введите бонусную ставку для категории товара: " + model.qTradeItemTypes.cursor.type_name, 0);
            if (rate) {
                model.qBonusCountForTradeItemReadonly.params.trade_type = model.qTradeItemTypes.cursor.trade_item_type_id;
                model.qBonusCountForTradeItemReadonly.params.trade_item = null;
                bonus.setBonusRate(null, model.qTradeItemTypes.cursor.trade_item_type_id, rate);
                form.lbCategory.text = "Бонусная ставка по категории товара: " + rate + "%";
                form.btnResetCategory.visible = true;
            }
        }
    }//GEN-LAST:event_lbCategoryMouseClicked

    function qTradeItemTypesOnRequeried(evt) {//GEN-FIRST:event_qTradeItemTypesOnRequeried
        model.qBonusCountForTradeItemReadonly.params.trade_type = model.qTradeItemTypes.cursor.trade_item_type_id;
        model.qBonusCountForTradeItemReadonly.params.trade_item = null;
        model.qBonusCountForTradeItemReadonly.requery(function() {
            if (model.qBonusCountForTradeItemReadonly.length > 0) {
                form.lbCategory.text = "Бонусная ставка по категории товара: " + model.qBonusCountForTradeItemReadonly.cursor.bonus_rate + "%";
                if (session.getUserRole() === "admin")
                    form.btnResetCategory.visible = true;
            } else {
                form.lbCategory.text = "Бонусная ставка по категории товара не назначена";
                form.btnResetCategory.visible = false;
            }
        });
    }//GEN-LAST:event_qTradeItemTypesOnRequeried

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
        bonus.clearBonusRate(null, model.qTradeItemTypes.cursor.trade_item_type_id);
        form.lbCategory.text = "Бонусная ставка по категории товара не назначена";
        form.btnResetCategory.visible = false;
    }//GEN-LAST:event_btnResetCategoryActionPerformed
}