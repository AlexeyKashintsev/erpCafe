/**
 * @name 132137120593719
*/
var   ROLE_USER_UCH = 132135001843723;
var locUsers = null;
var userForm = new Form("132134435407827");
var fmAppElS = new Form("132134455025048");

function setControlsEnabled()
{
    btnSave.enabled = model.modified;
}

function refreshUsers()
{
    var cur = dsMtdUsers.usr_id;
    if (model.modified && confirm('Сохранить изменения?', title))
        model.save();
    model.requery();	
    if (locUsers.find(cur))
    {
        locUsers.first()
        grdUsers.makeVisible(cur);
    }			
}

function grdUsers_USR_PASSWD_selectValue() {//GEN-FIRST:event_grdUsers_USR_PASSWD_selectValue
    userForm.parUser = dsMtdUsers.usr_id;
    if (userForm.showModal() == ok)
        refreshUsers();
}//GEN-LAST:event_grdUsers_USR_PASSWD_selectValue

function btnCloseActionPerformed(evt) {//GEN-FIRST:event_btnCloseActionPerformed
    close();
}//GEN-LAST:event_btnCloseActionPerformed

function btnCreateUserActionPerformed(evt) {//GEN-FIRST:event_btnCreateUserActionPerformed
    dsMtdUsers.insert();
    dsMtdUsers.userrole = ROLE_USER_UCH;
    dsMtdUsers.usr_form = dsRole.defaultform;
}//GEN-LAST:event_btnCreateUserActionPerformed

function btnDeleteUserActionPerformed(evt) {//GEN-FIRST:event_btnDeleteUserActionPerformed
    dsMtdUsers.deleteRow();
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
    locUsers = dsMtdUsers.createLocator(dsMtdUsers.md.usr_id);
    parUserRole = ROLE_USER_UCH;
    setControlsEnabled();
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if(model.modified && confirm("Сохранить?", title))
        model.save();
}//GEN-LAST:event_formWindowClosing

function usr_formSelectValue() {//GEN-FIRST:event_usr_formSelectValue
    if(fmAppElS.showModal() == ok)
        return fmAppElS.getSelected();
}//GEN-LAST:event_usr_formSelectValue
