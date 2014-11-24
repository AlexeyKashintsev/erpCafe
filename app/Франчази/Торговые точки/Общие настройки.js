/**
 * 
 * @author Work
 */
function TPCommonSettings() {
    var self = this, model = this.model, form = this;
    var cheklistForm = new CheklistForm();
    var settings = new ServerModule("Settings");
    var cheklistOpen = {};
    var cheklistClose = {};
    var settingOpen = {};
    var settingClose = {};
    
    self.setFranchazi = function(aFranchaziId) {
        model.params.franchazi_id = aFranchaziId;
    };

    self.setTradePoint = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
        getSettings();
    };

    function getSettings(){
        settings.getSettings(false, model.params.trade_point_id);
        settingOpen = settings.getSettingByName("cheklist_open");
        settingClose = settings.getSettingByName("cheklist_close");
        
        if(settingOpen)
              form.lbOpen.text = settingOpen.title;
        else  form.lbOpen.text = "Не задано";
        
        if(settingClose)
              form.lbClose.text = settingClose.title;
        else  form.lbClose.text = "Не задано";
    }
    
    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        getSettings();
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnOpenChooseActionPerformed(evt) {//GEN-FIRST:event_btnOpenChooseActionPerformed
        cheklistForm.setCheklistType(1);
        cheklistForm.showModal(function(aCheklist){
            if(aCheklist){
                form.lbOpen.text =aCheklist.cheklist_title;
                cheklistOpen = {
                    id:    aCheklist.cheklist_data_id,
                    title: aCheklist.cheklist_title
                };
                 settings.setSettings("cheklist_open", cheklistOpen, null, model.params.trade_point_id, model.params.franchazi_id);
            }
        });
    }//GEN-LAST:event_btnOpenChooseActionPerformed

    function btnCloseChooseActionPerformed(evt) {//GEN-FIRST:event_btnCloseChooseActionPerformed
        cheklistForm.setCheklistType(2);
        cheklistForm.showModal(function(aCheklist){
            if(aCheklist){
                form.lbClose.text = aCheklist.cheklist_title;
                cheklistClose = {
                    id:    aCheklist.cheklist_data_id,
                    title: aCheklist.cheklist_title
                };
                settings.setSettings("cheklist_close", cheklistClose, null, model.params.trade_point_id, model.params.franchazi_id);
            }
        });
    }//GEN-LAST:event_btnCloseChooseActionPerformed
}
