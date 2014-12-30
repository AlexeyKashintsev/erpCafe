/**
 * 
 * @author Алексей
 * @name SelectItemsInWH
 * @public
 */

function TradeItemsOnTradePoint() {

    var self = this, model = this.model, form = this;

    self.selectForm = false;
    var changed = false;
    var addTradeItem;
    
    model.params.beginUpdate();
    model.params.item_type = null;
    model.params.show_only_present = true;
    model.params.sort_by_type = true;
    model.params.actual_date = new Date();
    model.params.endUpdate();
    
    
    var TradeAdminModule = new ServerModule('TradeAdminModule');
    var askForChanges = new AskForChangesApplying();
    
    self.setFranchazi = function(aFranchazi) {
       // alert('!' + aFranchazi);
        self.model.params.franchazi_id = aFranchazi;
    };
    
    self.setTradePoint = function(aTradePoint) {
        model.params.trade_point_id = aTradePoint;
    };

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        //model.params.actual_date = new Date();
        //alert(model.params.franchazi_id + '\\' + model.params.trade_point_id + '\\' + model.params.actual_date);
        if (self.model.modified && confirm('Сохранить изменения?')) {
            modelSave();
        }
        self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

    function modelSave() {
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

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        modelSave();
}//GEN-LAST:event_btnSaveActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if (!addTradeItem)
            addTradeItem = new addItemToDashboard();
        addTradeItem.showModal();
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (confirm('Вы уверены что хотите удалить этот товар с точки?'))
            model.qTradeItemsAndType.deleteRow();
    }//GEN-LAST:event_btnDelActionPerformed

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        if(model.qTradeItemsAndType.length > 0){
            form.close(model.qTradeItemsAndType.cursor.wh_items_id);
        } else {
            alert('Вы ничего не выбрали!');
        }
    }//GEN-LAST:event_btnSelectActionPerformed

    function qTradeItemsAndTypeOnChanged(evt) {//GEN-FIRST:event_qTradeItemsAndTypeOnChanged
        //if (evt.propertyName === 'r_cost' || evt.propertyName === 'r_selected') {
        if (!changed) {
            if (model.qTradeItemsAndType.cursor.r_cost && (model.qTradeItemsAndType.cursor.r_id.match(/type/gi))) {
                //alert ('Нельзя устанавливать цену на категорию');
                model.qTradeItemsAndType.cursor.r_cost = null;
            } else if (model.qTradeItemsAndType.cursor.r_cost !== null){
                askForChanges.showModal(function(aResult) {
                    model.qTradeItemsAndType.scrollTo(model.qTradeItemsAndType.findById(evt.object.r_id));
                    model.qTradeItemsAndType.cursor.add2TP = (aResult === 1);
                });
            }
            changed = true;
        } else changed = false;
    }//GEN-LAST:event_qTradeItemsAndTypeOnChanged

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        form.pnlSelLock.visible = self.selectForm;
        model.params.actual_date = new Date();
    }//GEN-LAST:event_formWindowOpened

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (model.modified && confirm('Сохранить изменения?')) {
            modelSave();
        }
    }//GEN-LAST:event_formWindowClosing

    function paramsWillChange(evt) {//GEN-FIRST:event_paramsWillChange
        if (model.modified && confirm('Сохранить изменения?')) {
            modelSave();
        }
    }//GEN-LAST:event_paramsWillChange

    function qTradeItemsAndTypeWillChange(evt) {//GEN-FIRST:event_qTradeItemsAndTypeWillChange
        if (evt.propertyName === 'r_selected' && evt.newValue === true &&
                !model.qTradeItemsAndType.cursor.r_cost) {
            alert('Необходимо указывать стоимость товара!');
            return false;
        }
    }//GEN-LAST:event_qTradeItemsAndTypeWillChange

    function qTradeItemsAndTypeOnRequeried(evt) {//GEN-FIRST:event_qTradeItemsAndTypeOnRequeried
        Logger.info("\nLength: " + model.qTradeItemsAndType.length +
                    "\nF_ID: " + model.qTradeItemsAndType.params.franchazi_id +
                    "\nTP_ID: " + model.qTradeItemsAndType.params.trade_point_id +
                    "\nSoP: " + model.qTradeItemsAndType.params.show_only_present +
                    "\nSbT: " + model.qTradeItemsAndType.params.sort_by_type +
                    "\nAcD: " + model.qTradeItemsAndType.params.actual_date);
    }//GEN-LAST:event_qTradeItemsAndTypeOnRequeried

    function tbExistsActionPerformed(evt) {//GEN-FIRST:event_tbExistsActionPerformed
        model.params.show_only_present = this.selected ? true : null;
    }//GEN-LAST:event_tbExistsActionPerformed

    function tbSortByTypeActionPerformed(evt) {//GEN-FIRST:event_tbSortByTypeActionPerformed
        model.params.sort_by_type = this.selected ? true : null;
    }//GEN-LAST:event_tbSortByTypeActionPerformed

    function rbAllActionPerformed(evt) {//GEN-FIRST:event_rbAllActionPerformed
        model.params.show_type = 0;
    }//GEN-LAST:event_rbAllActionPerformed

    function rbMyActionPerformed(evt) {//GEN-FIRST:event_rbMyActionPerformed
        model.params.show_type = 2;
    }//GEN-LAST:event_rbMyActionPerformed
}