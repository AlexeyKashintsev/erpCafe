/**
 * 
 * @author mike
 * @rolesAllowed franchazi
 */
function AdminStartForm() {
    var self = this, model = this.model, form = this;

    self.session = new ServerModule('UserSession');
    var guiUtils = new guiModule();
    var usersView = null;
    var workShop = null;
    
    self.session.login(function(aFranchazi){
        self.setFranchazi(aFranchazi);
    });
    
    self.setFranchazi = function(aFaranchazi) {
        usersView = new FranchaziUsers();
        workShop = new FranchaziWorkShop();

        usersView.setFranchaziId(aFaranchazi);
        workShop.setFranchaziId(aFaranchazi);
    };
    
self.showFormAsInternal = function(aForm) {
    if(!guiUtils.showOpenedForm(aForm, form.desktop)){
        var frameRunner = aForm;
        var lenCookie = guiUtils.beginLengthyOperation(this);
        try{
            frameRunner.desktop = form.desktop;
            frameRunner.showInternalFrame(form.desktop);
        }finally{
            lenCookie.end();
        }
        frameRunner.toFront();
    }
};

    function btnUsersViewActionPerformed(evt) {//GEN-FIRST:event_btnUsersViewActionPerformed
        self.showFormAsInternal(usersView);
    }//GEN-LAST:event_btnUsersViewActionPerformed

    function button2ActionPerformed(evt) {//GEN-FIRST:event_button2ActionPerformed
        self.showFormAsInternal(workShop);
    }//GEN-LAST:event_button2ActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qFrancByUserName.requery();
    }//GEN-LAST:event_formWindowOpened
}
