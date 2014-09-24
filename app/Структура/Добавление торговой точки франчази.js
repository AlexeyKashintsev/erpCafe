/**
 * 
 * @author Alexey
 * @rolesAllowed admin
 */
function AddTradePoint2Franchazi() {
    var self = this, model = this.model, form = this;
    
    self.setFranchazi = function(aFranchazi) {
        model.params.franchazi_id = aFranchazi;
    };

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.listTradePoints.requery(function() {
            model.listTradePoints.insert(
                    model.listTradePoints.schema.franchazi_id, model.params.franchazi_id,
                    model.listTradePoints.schema.tp_active, true
            );
        });
    }//GEN-LAST:event_formWindowOpened

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if (model.listTradePoints.cursor.tp_address !== "" &&
                model.listTradePoints.cursor.tp_name !== "") {
            model.save(function() {
                form.close(true);
            });
        } else {
            alert("Не заполнены все поля!");
        }
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (model.modified && confirm("Создать новую торговую точку?"))
            buttonActionPerformedbuttonActionPerformed(evt);
    }//GEN-LAST:event_formWindowClosing
}
