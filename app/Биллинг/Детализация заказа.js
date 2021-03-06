/**
 * 
 * @author minya92
 */
function DetalizeBillForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var bm = new P.ServerModule("BillModule");
    //var detalieBill = new Report("DetalieBill");
    
    self.account_id = 0;
    self.setAccountId = function(anAccountId) {
        self.account_id = anAccountId;
    };
    self.items = 0;
    self.setItems = function(anItems) {
        self.items = anItems;
    };
    self.sum = 0;
    self.setSum = function(aSum){
        self.sum = aSum;
    };
    
    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        var opId = bm.addBillOperation(self.account_id, bm.OPERATION_DEL_BUY, self.sum, bm.OP_STATUS_SUCCESS);
        if(opId) bm.addItemsOnOperation(opId, self.items);
    }//GEN-LAST:event_buttonActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        form.tfSum.text = "Сумма платежа: \n" + self.sum + " руб.";
        var n = 1;
        for(var id in self.items){
            //self.cost += self.items[id].cost * self.items[id].count;
            form.lbItems.text += "\r\n" + n + ". " + self.items[id].name+"\n";
            n++;
        }
    }//GEN-LAST:event_formWindowOpened
    
    self.show = function() {
        form.show();
    };
}
