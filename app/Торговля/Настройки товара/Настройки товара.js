/**
 * 
 * @author Work
 */
function ItemSettingsAndCost(aTradeItemId, aOpenType) {
    var self = this, model = this.model, form = this;
    var tradeAdminModule = Session.get("TradeAdminModule");

    var fmItemCard, fmTIcontents, fmItemCost, fmBonuses;
    /*require(['ItemCard', 'ContentTradeItem', 'ItemCostForm', 'BonusRateForm'],
        function() {*/
            fmItemCard = new ItemCard();
            fmItemCard.setOpenType(aOpenType);
            fmItemCard.showOnPanel(form.pnlCard);
            fmTIcontents = new ContentTradeItem(true);
            fmTIcontents.showOnPanel(form.pnlContent);
            fmItemCost = new ItemCostForm();
            fmItemCost.showOnPanel(form.pnlCost);
            fmBonuses = new BonusRateForm();
            fmBonuses.showOnPanel(form.pnlBonus);
      //  });


    self.setTradeItem = function(anItemId, aTradePoint) {
        model.params.trade_pont = (aTradePoint ? aTradePoint : 
                (session.tradePoint ? session.tradePoint : model.params.trade_pont));
        
        model.params.item_id = anItemId ? anItemId : model.params.item_id;

        model.qTradeItemsOnTP.params.trade_point = model.params.trade_pont;
        model.qTradeItemsOnTP.params.item_id = model.params.item_id;
        model.qTradeItemsOnTP.requery();

        fmItemCard.setItem(model.qTradeItemsOnTP.params.item_id);
        fmTIcontents.setTradeItem(model.qTradeItemsOnTP.params.item_id);
        fmItemCost.setItem(model.qTradeItemsOnTP.params.item_id);
        fmBonuses.setTradeItem(model.qTradeItemsOnTP.params.item_id);
    };

    if (aTradeItemId)
        self.setTradeItem(aTradeItemId);


    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        fmItemCard.save();
        fmTIcontents.save();

        tradeAdminModule.processChangesForTradeItem({
            item_id: model.params.item_id,
            trade_point: model.params.trade_pont,
            color: model.params.color,
            wh_item: form.cbWhItem.selected,
            wh_content: form.cbWhContent.selected,
            trade_item: form.cbTradeItem.selected,
            costs: fmItemCost.getCosts()
        });
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        model.save();
        fmItemCard.save();
        fmTIcontents.save();
        //fmItemCost.save(true);
        form.close(true);
    }//GEN-LAST:event_btnDelActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);
    }//GEN-LAST:event_btnCancelActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qTradeItemsOnTP.requery(function() {
            if (!model.qTradeItemsOnTP.empty) {
                form.cbTradeItem.selected = model.qTradeItemsOnTP.cursor.trade_item;
                form.cbWhContent.selected = model.qTradeItemsOnTP.cursor.wh_content;
                form.cbWhItem.selected = model.qTradeItemsOnTP.cursor.wh_item;
                model.params.color = model.qTradeItemsOnTP.cursor.color;
            } else {
                form.cbTradeItem.selected = true;
                form.cbWhContent.selected = false;
                form.cbWhItem.selected = true;
                model.params.color = null;
            }
        });
    }//GEN-LAST:event_formWindowOpened
}
