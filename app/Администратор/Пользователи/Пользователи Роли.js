/**
 * @name 132134981360925
*/
var locUsersRoles = null;
var userForm = new Form("132134435407827");
var appForm = new Form("132134455025048");

function setControlsEnabled()
{
    btnSave.enabled = model.modified;
}

function refreshUsers()
{
    var cur = dsRoles.agtiprof_user_roles_id;
    if (model.modified && confirm('Сохранить изменения?', title))
        model.save();
    model.requery();	
    if (locUsersRoles.find(cur))
    {
        locUsersRoles.first()
        grdUsers.makeVisible(cur);
    }			
}

function USR_FORM_selectValue() {//GEN-FIRST:event_USR_FORM_selectValue
    if(appForm.showModal() == ok)
        return appForm.getSelected();
}//GEN-LAST:event_USR_FORM_selectValue

function btnCloseActionPerformed(evt) {//GEN-FIRST:event_btnCloseActionPerformed
    close();
}//GEN-LAST:event_btnCloseActionPerformed

function btnCreateUserActionPerformed(evt) {//GEN-FIRST:event_btnCreateUserActionPerformed
    dsRoles.insert();
}//GEN-LAST:event_btnCreateUserActionPerformed

function btnDeleteUserActionPerformed(evt) {//GEN-FIRST:event_btnDeleteUserActionPerformed
    dsRoles.deleteRow();
}//GEN-LAST:event_btnDeleteUserActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    model.save();
    setControlsEnabled();	
}//GEN-LAST:event_btnSaveActionPerformed

function btnRefreshActionPerformed(evt) {//GEN-FIRST:event_btnRefreshActionPerformed
    refreshUsers();
    setControlsEnabled();	
}//GEN-LAST:event_btnRefreshActionPerformed

function btnFindActionPerformed(evt) {//GEN-FIRST:event_btnFindActionPerformed
    grdUsers.findSomething();
}//GEN-LAST:event_btnFindActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    locUsers = dsRoles.createLocator(dsRoles.md.agtiprof_user_roles_id);
    setControlsEnabled();
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if(model.modified && confirm("Сохранить?", title))
        model.save();
}//GEN-LAST:event_formWindowClosing
