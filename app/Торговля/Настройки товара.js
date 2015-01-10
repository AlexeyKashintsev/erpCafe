/**
 * 
 * @author Work
 */
function ItemSettingsAndCost(aTradeItemId) {
    var self = this, model = this.model, form = this;
    var itemCard = new ItemCard();
    itemCard.showOnPanel(form.pnlCard);
    
    var controlOfWH = new ControlOnWarehouse();
    controlOfWH.showOnPanel(form.pnlControlWH);
    controlOfWH.setParent(self);
    var contentTradeItem = new ContentTradeItem();
    contentTradeItem.showOnPanel(form.pnlContent);
    //var bonusPanel = new BonusRateForm();
    //bonusPanel.showOnPanel(form.pnlBonus);
    
    self.setTradeItem = function(anItemId){
        //Item = anItemId; TODO Это вот зачем так сделано?
        itemCard.setItem(anItemId);
        controlOfWH.setTradeItem(anItemId);
        contentTradeItem.setTradeItem(anItemId);
        //bonusPanel.setTradeItem(anItem);
    };
    
    if (aTradeItemId)
        self.setTradeItem(aTradeItemId);
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
    }//GEN-LAST:event_formWindowOpened
}
