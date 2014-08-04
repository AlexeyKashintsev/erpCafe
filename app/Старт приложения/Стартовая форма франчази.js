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
    var userRole = null;
    var workShop = null;
    
    //Определяем как запущена программа
    self.browser = null;
    try {
        (function(){
            self.browser = false;
            userRole = self.session.login();
            self.setFranchazi(self.session.getFranchazi());
        }).invokeBackground();
    } catch (e) {
        Logger.info('browser');
        self.browser = true;
        self.session.login(function(anUserRole){
            userRole = anUserRole;
            self.session.getFranchazi(function(anFranchaziId){
                self.setFranchazi(anFranchaziId);
            });
        });
    }
    
    self.setFranchazi = function(aFaranchazi) {
        if (!aFaranchazi)
            self.close();
       /* try {!!!!!!!!! Так не работает !!!!!!!!!!!! Косяк !!!!! Автоматическое разрешение зависимостей косячит
            requery('FranchaziUsers', function(){
                //usersView = new FranchaziUsers();
            });
        } catch (e) {
            Logger.severe(self.session.msg[MSG_ERROR_NOT_UNDER_BROWSER]);
        }*/
        workShop = new FranchaziWorkShop();
        workShop.setFranchaziId(aFaranchazi);
        
        if (!self.browser) {
            usersView = new FranchaziUsers();
            usersView.setFranchaziId(aFaranchazi);
        }
    };
    
self.showFormAsInternal = function(aForm) {
    if(!guiUtils.showOpenedForm(aForm, form.desktop)){
        var frameRunner = aForm;
       // var lenCookie = guiUtils.beginLengthyOperation(this);
        try{
            frameRunner.desktop = form.desktop;
            frameRunner.showInternalFrame(form.desktop);
        }finally{
      //      lenCookie.end();
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
}
