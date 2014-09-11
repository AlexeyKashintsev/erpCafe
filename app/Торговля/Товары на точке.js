/**
 * 
 * @author Алексей
 * @name SelectItemsInWH
 * @public
 */

function TradeItemsOnTradePoint() {

    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

    self.selectForm = false;
    model.params.show_only_present = false;
    model.params.sort_by_type = false;
    /*model.params.beginUpdate();
    model.params.item_type = null;
    model.params.show_only_present = true;
    model.params.sort_by_type = true;
    model.params.actual_date = new Date();
    model.params.endUpdate();*/
    
    
    var TradeAdminModule = new P.ServerModule('TradeAdminModule');
    var askForChanges = new AskForChangesApplying();
    
    self.setFranchazi = function(aFranchazi) {
        self.model.params.franchazi_id = aFranchazi;
    };
    
    self.setTradePoint = function(aTradePoint) {
        model.params.trade_point_id = aTradePoint;
    };
    
    //self.setFranchazi(1);
    //self.setTradePoint(15);

    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
            if (self.model.modified && confirm('Сохранить изменения?')) {
                modelSave();
            }
            model.qTradeItemsAndType.params.show_only_present = model.params.show_only_present;
            model.qTradeItemsAndType.params.sort_by_type = model.params.sort_by_type;
            /*Logger.info('Param show_only_present: '+ model.params.show_only_present);
            Logger.info('Param model.params.sort_by_type: '+ model.params.sort_by_type);*/
            self.model.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    function modelSave() {
        model.qTradeItemsAndType.params.actual_date = new Date();
        model.qTradeItemsAndType.beforeFirst();
        while (model.qTradeItemsAndType.next()) {
            if ((model.qTradeItemsAndType.cursor.r_cost !== model.qTradeItemsAndType.cursor.r_old_cost) && (model.qTradeItemsAndType.cursor.r_id.match(/type/gi))){
                alert ('Нельзя устанавливать цену на тип');
            } else {
                if (model.qTradeItemsAndType.cursor.r_selected2 !== model.qTradeItemsAndType.cursor.r_selected ||
                        model.qTradeItemsAndType.cursor.r_cost !== model.qTradeItemsAndType.cursor.r_old_cost) {
                    if (model.qTradeItemsAndType.cursor.r_selected || (
                            !model.qTradeItemsAndType.cursor.r_selected&&!model.qTradeItemsAndType.cursor.r_selected2)) {
                        TradeAdminModule.setCost4TradeItemOnTradePointOrFranchzi(
                                model.qTradeItemsAndType.r_id,
                                model.qTradeItemsAndType.add2TP ? model.params.trade_point_id : null,
                                model.params.franchazi_id, 
                                model.qTradeItemsAndType.cursor.r_cost
                            );
                        } else {
                            TradeAdminModule.setEndDateForTradeItem(model.qTradeItemsAndType.r_id,
                                model.qTradeItemsAndType.add2TP ? model.params.trade_point_id : null,
                                model.params.franchazi_id, 
                                new Date());
                        }
                }
            }
        }
        model.revert();
        model.params.actual_date = new Date();
    }

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
            modelSave();
    };//GEN-LAST:event_btnSaveActionPerformed

    form.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.qTradeItemsAndType.insert(model.qTradeItemsAndType.schema.item_type, model.itemType.cursor.wh_item_types_id,
                                model.qTradeItemsAndType.schema.franchazi_id, model.params.franchazi_id,
                                model.qTradeItemsAndType.schema.warehouse, model.params.trade_point_id
                                );
        model.qTradeItemsAndType.cursor.item_id = model.qTradeItemsAndType.cursor.wh_items_id;
    };//GEN-LAST:event_btnAddActionPerformed

    form.btnDel.onActionPerformed = function(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm('Вы уверены что хотите удалить этот товар?'))
            model.qTradeItemsAndType.deleteRow();
    };//GEN-LAST:event_btnDelActionPerformed

    form.btnSelect.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        if(model.qTradeItemsAndType.length > 0){
            form.close(model.qTradeItemsAndType.cursor.wh_items_id);
        } else {
            alert('Вы ничего не выбрали!');
        }
    };//GEN-LAST:event_btnSelectActionPerformed

    model.qTradeItemsAndType.onChanged = function(evt) {//GEN-FIRST:event_qTradeItemsAndTypeOnChanged
        if (evt.propertyName === 'r_cost' || evt.propertyName === 'r_selected') {
            if (model.qTradeItemsAndType.cursor.r_cost && (model.qTradeItemsAndType.cursor.r_id.match(/type/gi))) {
                //alert ('Нельзя устанавливать цену на категорию');
                model.qTradeItemsAndType.cursor.r_cost = null;
            } else if (model.qTradeItemsAndType.cursor.r_cost !== null){
                askForChanges.showModal(function(aResult) {
                    model.qTradeItemsAndType.scrollTo(model.qTradeItemsAndType.findById(evt.object.r_id));
                    model.qTradeItemsAndType.cursor.add2TP = (aResult === 1);
                });
            }
        }
    };//GEN-LAST:event_qTradeItemsAndTypeOnChanged

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        form.pnlSelLock.visible = self.selectForm;
        model.params.beginUpdate();
        //model.params.item_type = null;
        //model.params.show_only_present = false;
        //model.params.sort_by_type = false;
        model.params.actual_date = new Date();
        model.params.endUpdate();
    };//GEN-LAST:event_formWindowOpened

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
        if (model.modified && confirm('Сохранить изменения?')) {
            modelSave();
        }
    };//GEN-LAST:event_formWindowClosing

    model.params.onWillChange = function(evt) {//GEN-FIRST:event_paramsWillChange
        if (model.modified && confirm('Сохранить изменения?')) {
            modelSave();
        }
    };//GEN-LAST:event_paramsWillChange

    model.qTradeItemsAndType.onWillChange = function(evt) {//GEN-FIRST:event_qTradeItemsAndTypeWillChange
        if (evt.propertyName === 'r_selected' && evt.newValue === true &&
                !model.qTradeItemsAndType.cursor.r_cost) {
            alert('Необходимо указывать стоимость товара!');
            return false;
        }
    };//GEN-LAST:event_qTradeItemsAndTypeWillChange
    
    self.show = function() {
        form.show();
    };
}