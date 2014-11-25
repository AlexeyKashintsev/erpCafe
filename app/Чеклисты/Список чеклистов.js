/**
 * 
 * @author minya92
 */
function CheklistForm() {
    var self = this, model = this.model, form = this;
    var userSession = new ServerModule("UserSession");
    var franchazi_id = null;
    model.params.type = null;

    self.setCheklistType = function(aType) {
        model.params.type = aType;
    };
    
    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        model.qListCheklist.insert(model.qListCheklist.schema.franchazi_id, franchazi_id,
                model.qListCheklist.schema.cheklist_type, model.params.type
                );
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
    }//GEN-LAST:event_btnItemEditContentActionPerformed

    function btnItemCreateDoubleActionPerformed(evt) {//GEN-FIRST:event_btnItemCreateDoubleActionPerformed
        model.qListCheklist.insert(
                model.qListCheklist.schema.cheklist_title, model.qListCheklist.cursor.cheklist_title + ' - копия',
                model.qListCheklist.schema.cheklist_text, model.qListCheklist.cursor.cheklist_text,
                model.qListCheklist.schema.franchazi_id, franchazi_id,
                model.qListCheklist.schema.cheklist_type, model.qListCheklist.cursor.cheklist_type
                );
    }//GEN-LAST:event_btnItemCreateDoubleActionPerformed

    function rbAllActionPerformed(evt) {//GEN-FIRST:event_rbAllActionPerformed
        model.params.franchazi_id = null;
    }//GEN-LAST:event_rbAllActionPerformed

    function rbMyActionPerformed(evt) {//GEN-FIRST:event_rbMyActionPerformed
        model.params.franchazi_id = franchazi_id;
    }//GEN-LAST:event_rbMyActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if (session.userRole !== 'admin') {
            franchazi_id = userSession.getFranchazi();
        } else {
            form.btnSelect.visible = false;
        }
    }//GEN-LAST:event_formWindowOpened

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
  
    }//GEN-LAST:event_modelGridMouseClicked
    
    var flag = 0;
    function qListCheklistOnChanged(evt) {//GEN-FIRST:event_qListCheklistOnChanged
        if (franchazi_id) {
            if (evt.object.franchazi_id !== franchazi_id) {
                if (flag === 0) {
                    flag = 1;
                    model.qListCheklist.insert(
                            model.qListCheklist.schema.cheklist_text, evt.source.cheklist_text,
                            model.qListCheklist.schema.cheklist_title, evt.source.cheklist_title + ' - копия',
                            model.qListCheklist.schema.cheklist_type, evt.source.cheklist_type,
                            model.qListCheklist.schema.franchazi_id, franchazi_id
                            );
                    var lst = model.qListCheklist.find(model.qListCheklist.schema.cheklist_data_id, evt.source.cheklist_data_id);
                    if (lst.length > 0 && model.qListCheklist.scrollTo(lst[0])) {
                        if (evt.source.cheklist_text === evt.newValue) {
                            model.qListCheklist.cursor.cheklist_text = evt.oldValue;
                        }
                        if (evt.source.cheklist_title === evt.newValue) {
                            model.qListCheklist.cursor.cheklist_title = evt.oldValue;
                        }
                        if (evt.source.cheklist_type === evt.newValue) {
                            model.qListCheklist.cursor.cheklist_type = evt.oldValue;
                        }
                    }   
                    flag = 0;
                }
            }
        }
        
    }//GEN-LAST:event_qListCheklistOnChanged

    function qListCheklistOnRequeried(evt) {//GEN-FIRST:event_qListCheklistOnRequeried
        form.taContent.text = model.qListCheklist.cursor.cheklist_text;
    }//GEN-LAST:event_qListCheklistOnRequeried

    function qListCheklistOnScrolled(evt) {//GEN-FIRST:event_qListCheklistOnScrolled
        form.taContent.text = model.qListCheklist.cursor.cheklist_text;
    }//GEN-LAST:event_qListCheklistOnScrolled

    function taContentFocusLost(evt) {//GEN-FIRST:event_taContentFocusLost
       
    }//GEN-LAST:event_taContentFocusLost

    function taContentMouseExited(evt) {//GEN-FIRST:event_taContentMouseExited
        model.qListCheklist.cursor.cheklist_text = form.taContent.text;
    }//GEN-LAST:event_taContentMouseExited

    function formWindowClosed(evt) {//GEN-FIRST:event_formWindowClosed

    }//GEN-LAST:event_formWindowClosed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (model.modified&&confirm('Сохранить изменения?')){
            model.save();
        }
    }//GEN-LAST:event_formWindowClosing

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        form.close(model.qListCheklist.cursor);
    }//GEN-LAST:event_btnSelectActionPerformed
}
