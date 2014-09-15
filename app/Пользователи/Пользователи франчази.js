/**
 * 
 * @author Алексей
 * @name FranchaziUsers
 * @rolesAllowed franchazi admin
 * @public
 */

function FranchaziUsers() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    self.isSelectForm = false;
    
    //var tradePointsForm = new TradePoints();
    var createFrancahziUser = new UserCreateAndEditForm();
    var baristaTP = new TradePointsbaristForm();
    
    model.params.franchazi_id = null;
    model.params.trade_point_id = null;
    
    
    self.setFranchazi = function(aFranchaziId) {
        model.params.franchazi_id = aFranchaziId;
    };

    self.setTradePointId = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
    };
    
    self.setFranchazi(1);

    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
        self.model.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        self.model.save();
    };//GEN-LAST:event_btnSaveActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
            form.pnlSelLock.visible = self.isSelectForm;
    };//GEN-LAST:event_formWindowOpened

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
    };//GEN-LAST:event_formWindowClosing

    form.btnSelect.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        form.close(model.listTradePointUsers.usr_name);
    };//GEN-LAST:event_btnSelectActionPerformed

    form.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        createFrancahziUser.setFranchazi(model.params.franchazi_id);
        createFrancahziUser.setUserName(undefined);
        createFrancahziUser.showModal(function(){
                model.requery();
            });
    };//GEN-LAST:event_btnAddActionPerformed

    form.modelGrid.onMouseClicked = function(evt) {//GEN-FIRST:event_modelGridMouseClicked
        if (evt.clickCount === 2) {
            createFrancahziUser.setFranchazi(model.params.franchazi_id);
            createFrancahziUser.setUserName(model.listTradePointUsers.usr_name);
            createFrancahziUser.showModal(function(){
                    model.requery();
                });
        }
        form.btnSetPoints.enabled = 
                (model.listTradePointUsers.group_name == 'barista');
    };//GEN-LAST:event_modelGridMouseClicked

    form.btnSetPoints.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSetPointsActionPerformed
        baristaTP.setFranchazi(model.params.franchazi_id);
        baristaTP.setUserName(model.listTradePointUsers.usr_name);
        baristaTP.showModal(function(){});
    };//GEN-LAST:event_btnSetPointsActionPerformed

    self.show = function() {
        form.show();
    };
        
    self.getView = function(){
      return form.view;  
    };
}