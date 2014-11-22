/**
 * 
 * @author minya92
 */
function CheklistContent() {
    var self = this, model = this.model, form = this;
    self.cheklistId = null;
    self.setCheklistId = function(aId) {
        self.cheklistId = aId;
    };
    // TODO : place your code here

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if(self.cheklistId){
            model.qListCheklist.params.checklist_id = self.cheklistId;
            model.requery();
        } else form.close(true);
    }//GEN-LAST:event_formWindowOpened

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
//        if (model.modified&&confirm('Сохранить изменения?')){
//            model.save();
//        }
    }//GEN-LAST:event_formWindowClosing

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.save();
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed
}
