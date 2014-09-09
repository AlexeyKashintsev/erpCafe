/**
 * name RolesForm
 * @author mike
 */
function RolesForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    self.setUserName = function(aUserName){
        model.params.usr_name = aUserName;
    };
    

    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        var user = {
            usr_role:model.queryRoles.cursor.role_name,
            usr_form:model.queryRoles.cursor.role_form
        };
        form.close(user);
    };//GEN-LAST:event_buttonActionPerformed
    
    self.show = function() {
        form.show();
    };
}
