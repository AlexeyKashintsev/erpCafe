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

self.setFranchaziId = function(aFranchaziId){
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
            } else {
                model.deleteUserFromTradePoint.params.trade_point_id = model.tradePointsBarist.org_trade_point_id;
                model.deleteUserFromTradePoint.params.user_name = model.params.usr_name;
                model.deleteUserFromTradePoint.executeUpdate();
            }
        }
    }
    model.save();
}

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        saveModel();
    }
}//GEN-LAST:event_formWindowClosing


    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        saveModel();
        close();
    }//GEN-LAST:event_btnSelectActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.revert();
        close();
    }//GEN-LAST:event_buttonActionPerformed
}