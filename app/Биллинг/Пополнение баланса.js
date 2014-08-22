/**
 * 
 * @author minya92
 */
function AddBalanceForm() {
    var self = this, model = this.model, form = this;
    
    self.account_id = 0;
    self.setAccountId = function(anAccountId) {
        self.account_id = anAccountId;
    };
    
    self.sum = 0;
    self.setSum = function(aSum){
        self.sum = aSum;
    };
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        alert(form.formattedField.text * 1.0);
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        form.tfSum.text = "Сумма платежа: " + self.sum + " руб.";
    }//GEN-LAST:event_formWindowOpened
}
