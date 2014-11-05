/**
 * 
 * @author Алексей
 * @name TradePointsBaristForm
 * @public
 * @rolesAllowed admin franchazi
 */

function TradePointsbaristForm() {
var self = this, model = this.model, form = this;

model.params.franchazi_id = 1;
model.params.usr_name = "barista";

self.setFranchazi = function(aFranchaziId){
    model.params.franchazi_id = aFranchaziId;
};

self.setUserName = function(aUserName){
    model.params.usr_name = aUserName;
};

function saveModel(){
    model.tradePointsBarist.beforeFirst();
    while(model.tradePointsBarist.next()){
        if(model.tradePointsBarist.onPointHidden != model.tradePointsBarist.onPoint){
            if(model.tradePointsBarist.onPoint){
                var createBarist = {
                    trade_point_id: model.tradePointsBarist.org_trade_point_id,
                    user_name: model.params.usr_name 
                };
                model.createTradePointUser.push(createBarist);
                model.save();
            } else {
                model.deleteUserFromTradePoint.params.trade_point_id = model.tradePointsBarist.org_trade_point_id;
                model.deleteUserFromTradePoint.params.user_name = model.params.usr_name;
                model.deleteUserFromTradePoint.executeUpdate();
            }
        }
    }
}

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    form.lblNameBarista.text = model.params.usr_name;
    model.tradePointsBarist.requery();
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
//    if (self.model.modified && confirm('Сохранить изменения?')){
//        saveModel();
//    }
}//GEN-LAST:event_formWindowClosing

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        saveModel();
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        model.revert();
        form.close();
    }//GEN-LAST:event_btnCancelActionPerformed
}