/**
 * 
 * @author Work
 */
function ItemSettingsAndCost(aTradeItemId, aOpenType) {
    var self = this, model = this.model, form = this;
    var tradeAdminModule = Session.get("TradeAdminModule");

    var fmItemCard, fmTIcontents, fmItemCost, fmBonuses, fmGroup, fmModifiers;
    /*require(['ItemCard', 'ContentTradeItem', 'ItemCostForm', 'BonusRateForm'],
        function() {*/
            fmItemCard = new ItemCard();
            fmItemCard.setOpenType(aOpenType);
            fmItemCard.showOnPanel(form.pnlCard);
            fmTIcontents = new ContentTradeItem(true);
            fmTIcontents.showOnPanel(form.pnlContent);
            fmGroup = new TradeTypesByItemForm();
            fmGroup.showOnPanel(form.pnlTradeGroup);
            fmItemCost = new ItemCostForm();
            fmItemCost.showOnPanel(form.pnlCost);
            fmBonuses = new BonusRateForm();
            fmBonuses.showOnPanel(form.pnlBonus);
            fmModifiers = new TradeItemsModifiers();
            fmModifiers.showOnPanel(form.pnlModifiers);
      //  });


    self.setTradeItem = function(anItemId, aTradePoint, anItemOnTpId) {
        model.params.trade_pont = (aTradePoint ? aTradePoint : 
                (session.tradePoint ? session.tradePoint : model.params.trade_pont));
        
        model.params.item_id = anItemId ? anItemId : model.params.item_id;
        model.params.item_on_tp = anItemOnTpId ? anItemOnTpId : null;
        
        anItemId = model.params.item_id;
        
        model.qSuppliers.params.franchazi_id = session.franchaziId;
        model.qSuppliers.execute();
        
//        model.qTradeItemsOnTP.params.trade_point = model.params.trade_pont;
//        model.qTradeItemsOnTP.params.item_id = anItemId;
        model.qTradeItemsOnTP.params.item_on_tp = model.params.item_on_tp;
        model.qTradeItemsOnTP.requery(function() {
            if (!model.qTradeItemsOnTP.empty && model.params.item_on_tp) {
                form.cbTradeItem.selected = model.qTradeItemsOnTP.cursor.trade_item;
                form.cbWhContent.selected = model.qTradeItemsOnTP.cursor.wh_content;
                form.cbWhItem.selected = model.qTradeItemsOnTP.cursor.wh_item;
                model.params.color = model.qTradeItemsOnTP.cursor.color;
                model.params.supplier = model.qTradeItemsOnTP.cursor.supplier;
                model.params.short_str = 
                        form.taShortStr.text = model.qTradeItemsOnTP.cursor.short_string;
            } else {
                form.cbTradeItem.selected = true;
                form.cbWhContent.selected = false;
                form.cbWhItem.selected = true;
                model.params.color = null;
            }
            fmItemCard.setItem(anItemId);
            fmTIcontents.setTradeItem(anItemId);
            fmGroup.setTradeItem(anItemId);
            fmItemCost.setItem(anItemOnTpId);
            fmBonuses.setTradeItem(anItemId);
            fmModifiers.setItem(anItemOnTpId, anItemId);
        });
    };

    if (aTradeItemId)
        self.setTradeItem(aTradeItemId);
    
    function getShortStr() {
        var supplier = model.params.supplier ? model.qSuppliers.findById(model.params.supplier) : '';
        if (supplier !== '')
            supplier = (supplier.short_name ? supplier.short_name : supplier.supplier_name) + ' ';
        model.params.short_str = 
                form.taShortStr.text = supplier + fmModifiers.getModString();
        return model.params.short_str;
    }

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        fmItemCard.save();
        fmTIcontents.save();
        fmGroup.save();

        tradeAdminModule.processChangesForTradeItem({
            item_on_tp: model.params.item_on_tp,
            item_id: model.params.item_id,
            trade_point: model.params.trade_pont,
            color: model.params.color,
            wh_item: form.cbWhItem.selected,
            wh_content: form.cbWhContent.selected,
            trade_item: form.cbTradeItem.selected,
            costs: fmItemCost.getCosts(),
            supplier: model.params.supplier,
            short_str:  model.params.short_str ? model.params.short_str : getShortStr(),
            modifiers:  fmModifiers.getModifiers()
        });
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        /*model.save();
        fmItemCard.save();
        fmTIcontents.save();
        fmItemCost.save(true);*/
        tradeAdminModule.processChangesForTradeItem({
            item_on_tp: model.params.item_on_tp,
            for_delete: true
        });
        form.close(true);
    }//GEN-LAST:event_btnDelActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);
    }//GEN-LAST:event_btnCancelActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

    }//GEN-LAST:event_formWindowOpened

    function btnGetShortStrActionPerformed(evt) {//GEN-FIRST:event_btnGetShortStrActionPerformed
        getShortStr();
    }//GEN-LAST:event_btnGetShortStrActionPerformed

    function taShortStrKeyTyped(evt) {//GEN-FIRST:event_taShortStrKeyTyped
        model.params.short_str = form.taShortStr.text;
    }//GEN-LAST:event_taShortStrKeyTyped
}
