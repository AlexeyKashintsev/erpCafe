/**
 * 
 * @author minya92
 */
function CheklistForm() {
    var self = this, model = this.model, form = this;
    var cheklistContent = new CheklistContent();
    var userSession = new ServerModule("UserSession");
    var franchazi_id = null;
    
    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.qListCheklist.insert(model.qListCheklist.schema.franchazi_id, franchazi_id);
        model.save();
        cheklistContent.setCheklistId(model.qListCheklist.cursor.cheklist_data_id);
        cheklistContent.showModal(function(){
            model.qListCheklist.requery();
        });
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        if (model.qListCheklist.cursor.franchazi_id == franchazi_id || session.userRole === 'admin') {
            if (confirm('Вы уверены что хотите удалить чеклист?'))
                model.qListCheklist.deleteRow();
        } else {
            alert('Данная операция доступна только администратору!');
        }
    }//GEN-LAST:event_btnDelActionPerformed

    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (model.modified && confirm('Сохранить изменения?')) {
            model.save();
        }
        model.qListCheklist.requery();
    }//GEN-LAST:event_btnReqActionPerformed

    function btnItemEditContentActionPerformed(evt) {//GEN-FIRST:event_btnItemEditContentActionPerformed
        model.save();
        cheklistContent.setCheklistId(model.qListCheklist.cursor.cheklist_data_id);
        cheklistContent.showModal(function(){
            model.qListCheklist.requery();
        });
    }//GEN-LAST:event_btnItemEditContentActionPerformed

    function btnItemCreateDoubleActionPerformed(evt) {//GEN-FIRST:event_btnItemCreateDoubleActionPerformed
        model.qListCheklist.insert(
                model.qListCheklist.schema.cheklist_title, model.qListCheklist.cursor.cheklist_title,
                model.qListCheklist.schema.cheklist_text, model.qListCheklist.cursor.cheklist_text,
                model.qListCheklist.schema.franchazi_id, franchazi_id
        );
    }//GEN-LAST:event_btnItemCreateDoubleActionPerformed

    function rbAllActionPerformed(evt) {//GEN-FIRST:event_rbAllActionPerformed
        model.params.show_type = 0;
    }//GEN-LAST:event_rbAllActionPerformed

    function rbMyActionPerformed(evt) {//GEN-FIRST:event_rbMyActionPerformed
        model.params.show_type = 2;
    }//GEN-LAST:event_rbMyActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
       if(session.userRole !== 'admin')
           franchazi_id = userSession.getFranchazi();
    }//GEN-LAST:event_formWindowOpened

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.save();
    }//GEN-LAST:event_buttonActionPerformed

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
        if(evt.clickCount === 2){
           // prompt("213",model.qListCheklist.cursor.cheklist_data_id);
            model.save();
            cheklistContent.setCheklistId(model.qListCheklist.cursor.cheklist_data_id);
            cheklistContent.showModal(function(){
                model.qListCheklist.requery();
            });
        }
    }//GEN-LAST:event_modelGridMouseClicked
}
