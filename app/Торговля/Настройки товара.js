/**
 * 
 * @author Work
 */
function SettingsOfItem() {
    var self = this, model = this.model, form = this;
    var itemCard = new addItem();
    itemCard.showOnPanel(form.pnlCard);
    var controlOfWH = new ControlOnWarehouse();
    controlOfWH.showOnPanel(form.pnlControlWH);
    controlOfWH.setParent(self);
    var contentTradeItem = new ContentTradeItem();
    contentTradeItem.showOnPanel(form.pnlContent);
    //var bonusPanel = new BonusRateForm();
    //bonusPanel.showOnPanel(form.pnlBonus);
    
    self.setTradeItem = function(anItem){
        Item = anItem;
        itemCard.setItem(anItem);
        controlOfWH.setTradeItem(anItem);
        contentTradeItem.setTradeItem(anItem);
        //bonusPanel.setTradeItem(anItem);
    };
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
    }//GEN-LAST:event_formWindowOpened
}
