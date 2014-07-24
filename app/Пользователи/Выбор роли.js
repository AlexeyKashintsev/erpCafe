/**
 * name RolesForm
 * @author mike
 */
function RolesForm() {
    var self = this, model = this.model, form = this;
    
    self.setUserName = function(aUserName){
        model.params.usr_name = aUserName;
    };
    

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var user = {
            usr_role:model.queryRoles.cursor.role_name,
            usr_form:model.queryRoles.cursor.role_form
        };
        form.close(user);
    }//GEN-LAST:event_buttonActionPerformed
}
