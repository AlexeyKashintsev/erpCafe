/**
 * @name UsersRolesView
*/
function UsersRolesView(){
    
var self = this;
var locUsersRoles = null;
//var userForm = new Form("132134435407827");
//var appForm = new Form("132134455025048");

function setControlsEnabled()
{
    self.btnSave.enabled = self.model.modified;
}

function refreshUsers()
{
    var cur = self.dsRoles.adm_roles_id;
    if (self.model.modified && confirm('Сохранить изменения?', self.title))
        self.model.save();
    self.model.requery();	
    if (locUsersRoles.find(cur))
    {
        locUsersRoles.first();
        self.grdUsers.makeVisible(cur);
    }			
}

function USR_FORM_selectValue() {//GEN-FIRST:event_USR_FORM_selectValue
    if(self.appForm.showModal() == self.ok)
        return self.appForm.getSelected();
}//GEN-LAST:event_USR_FORM_selectValue

function btnCloseActionPerformed(evt) {//GEN-FIRST:event_btnCloseActionPerformed
    self.close();
}//GEN-LAST:event_btnCloseActionPerformed

function btnCreateUserActionPerformed(evt) {//GEN-FIRST:event_btnCreateUserActionPerformed
    self.dsRoles.insert();
    setControlsEnabled();
}//GEN-LAST:event_btnCreateUserActionPerformed

function btnDeleteUserActionPerformed(evt) {//GEN-FIRST:event_btnDeleteUserActionPerformed
    self.dsRoles.deleteRow();
    setControlsEnabled();
}//GEN-LAST:event_btnDeleteUserActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    self.model.save();
    setControlsEnabled();	
}//GEN-LAST:event_btnSaveActionPerformed

function btnRefreshActionPerformed(evt) {//GEN-FIRST:event_btnRefreshActionPerformed
    refreshUsers();
    setControlsEnabled();	
}//GEN-LAST:event_btnRefreshActionPerformed

function btnFindActionPerformed(evt) {//GEN-FIRST:event_btnFindActionPerformed
    self.grdUsers.findSomething();
}//GEN-LAST:event_btnFindActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    locUsers = self.dsRoles.createLocator(self.dsRoles.md.adm_roles_id);
    setControlsEnabled();
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if(self.model.modified && confirm("Сохранить?", self.title))
        self.model.save();
}//GEN-LAST:event_formWindowClosing
}