/**
 * 
 * @author stipjey
 */
function clientDesktop() {
    var self = this, model = this.model, form = this;
    var ClientEditPersonalInfo = new clientEditPersonalInfo();
    var ClientAutorize = new clientAutorize();
    var UserName = null;
    // TODO : place your code here

    self.SetUserName = function (anUserName){
        UserName = anUserName;
    }
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
         ClientEditPersonalInfo.showModal();
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if (!UserName){
            ClientAutorize.showModal(function (aResult){
                self.SetUserName = aResult;
            })
        }
    }//GEN-LAST:event_formWindowOpened
}
