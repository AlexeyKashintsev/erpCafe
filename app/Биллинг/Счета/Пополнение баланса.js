/**
 * 
 * @author minya92
 */
function AddBalance(anAccountId) {
    var self = this, model = this.model, form = this;
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
    }//GEN-LAST:event_formWindowOpened

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if(anAccountId){
            var billCreator = new Report('DetailedBill');
            try {
                billCreator.show();
            } catch (e) {
                Logger.warning(e);
            }
        }
    }//GEN-LAST:event_buttonActionPerformed
}
