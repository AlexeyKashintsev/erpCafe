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
        setChecklistTitles();
    };
    
    function getChecklistTitle(aName){
        settings.getSettings(false, model.params.trade_point_id);
        var checklist = settings.getSettingByName(aName);
        var lst = model.qListCheklist.find(model.qListCheklist.schema.cheklist_data_id, checklist.id);
        if (lst.length > 0 && model.qListCheklist.scrollTo(lst[0])) {
               return model.qListCheklist.cursor.cheklist_title;
        } else return "Не задан";
    }
    
    function setChecklistTitles(){
        form.lbOpen.text = getChecklistTitle("cheklist_open");
        form.lbClose.text = getChecklistTitle("cheklist_close");
    }
    
    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        setChecklistTitles();
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnOpenChooseActionPerformed(evt) {//GEN-FIRST:event_btnOpenChooseActionPerformed
        cheklistForm.setCheklistType(1);
        cheklistForm.showModal(function(aCheklist){
            if(aCheklist){
                form.lbOpen.text =aCheklist.cheklist_title;
                cheklistOpen = {
                    id:    aCheklist.cheklist_data_id
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
                    id:    aCheklist.cheklist_data_id
                };
                settings.setSettings("cheklist_close", cheklistClose, null, model.params.trade_point_id, model.params.franchazi_id);
            }
        });
    }//GEN-LAST:event_btnCloseChooseActionPerformed

    function btnCancelOpenActionPerformed(evt) {//GEN-FIRST:event_btnCancelOpenActionPerformed
        settings.setSettings("cheklist_open", null, null, model.params.trade_point_id, model.params.franchazi_id, true);
        form.lbOpen.text = "Не задан";
    }//GEN-LAST:event_btnCancelOpenActionPerformed

    function btnCancelCloseActionPerformed(evt) {//GEN-FIRST:event_btnCancelCloseActionPerformed
        settings.setSettings("cheklist_close", null, null, model.params.trade_point_id, model.params.franchazi_id, true);
        form.lbClose.text = "Не задан";
    }//GEN-LAST:event_btnCancelCloseActionPerformed

    function btnSetMarkerActionPerformed(evt) {//GEN-FIRST:event_btnSetMarkerActionPerformed
        model.save(function() {
            var tMap = new tpMap();
            tMap.showModal(model.params.trade_point_id);
            //tMap.setTradePoint(model.params.trade_point_id);
        });
        
    }//GEN-LAST:event_btnSetMarkerActionPerformed
}
