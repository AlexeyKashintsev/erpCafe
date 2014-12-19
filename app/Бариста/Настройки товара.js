/**
 * 
 * @author Work
 */
function SettingsOfItem() {
    var self = this, model = this.model, form = this;
    var controlOfWH = new ControlOnWarehouse();
    controlOfWH.showOnPanel(form.pnlGeneral);
    var contentTradeItem = new ContentTradeItem();
    contentTradeItem.showOnPanel(form.pnlContent);
    
    self.setTradeItem = function(anItem){
        Item = anItem;
        controlOfWH.setTradeItem(anItem);
        contentTradeItem.setTradeItem(anItem);
    };
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
    }//GEN-LAST:event_formWindowOpened
}
