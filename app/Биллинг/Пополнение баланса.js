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
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        alert(form.formattedField.text * 1.0);
    }//GEN-LAST:event_buttonActionPerformed
}
