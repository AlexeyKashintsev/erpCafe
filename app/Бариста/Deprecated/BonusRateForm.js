/**
 * 
 * @author Work
 */
function BonusRateForm() {
    var self = this, model = this.model, form = this;
    
    var bonus = new ServerModule("BonusModule");
    
    self.setTradeItem = function(anItem){
        model.params.item_id = anItem;
        update();
    };
    
    function update(){
        if (model.qBonusCountForTradeItemReadonly.length > 0)
        form.lblInfo.text = "Бонусная ставка по товару " + model.qTradeItems.cursor.item_name 
                + " составляет: " + model.qBonusCountForTradeItemReadonly.cursor.bonus_rate;
        else 
            form.lblInfo.text = "Бонусная ставка по товару " + model.qTradeItems.cursor.item_name 
                + " не указана.";
    }
 
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var rate = prompt("Введите бонусную ставку для товара: " + model.qTradeItems.cursor.item_name, 0);
        if (rate) {
            bonus.setBonusRate(model.qTradeItems.cursor.wh_items_id, null, rate);
            update();
        }
    }//GEN-LAST:event_buttonActionPerformed
}
