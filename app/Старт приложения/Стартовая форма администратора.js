/**
 * 
 * @author mike
 * @rolesAllowed franchazi
 */
function AdminStartForm() {
    var self = this, model = this.model, form = this;
    var MSG_ERROR_INACTIVE_USER = 'Ваша учетная запись неактивна!\nОбратитесь к администратору';
    
    var ep = new ServerModule('EventProcessor');
    var guiUtils = new guiModule();
    var usersView = new FranchaziUsers();
    var tradePoints = new TradePoints();
    
    model.params.userName = self.principal.name;
    ep.addEvent('userLogin', {username : model.params.userName});
    
    function qFrancByUserNameOnRequeried(evt) {//GEN-FIRST:event_qFrancByUserNameOnRequeried
        if (model.qFrancByUserName.cursor.franc_users_active){
            model.params.franchaziId = model.qFrancByUserName.franchazi_id;
            usersView.setFranchaziId(model.params.franchaziId);
            tradePoints.setFranchaziId(model.params.franchaziId);
            
        } else {
            alert(MSG_ERROR_INACTIVE_USER);
            ep.addEvent('userNotActive', {username : model.params.userName});
        }
    }//GEN-LAST:event_qFrancByUserNameOnRequeried

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
        self.showFormAsInternal(tradePoints);
    }//GEN-LAST:event_button2ActionPerformed
}
