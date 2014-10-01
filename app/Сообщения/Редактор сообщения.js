/**
 * 
 * @author StipJey
 */
function editMessageForm() {
    var self = this, model = this.model, form = this;
    var SMSType = null;
    
    self.setSmsType = function(aSmsType){
       SMSType = aSmsType;
    };

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if (SMSType){
            model.qGetSendParams.params.eventType = SMSType;
            model.requery();
        } else {
            form.close("error");
        }
    }//GEN-LAST:event_formWindowOpened

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);
    }//GEN-LAST:event_btnCancelActionPerformed

    function btnAddUsernameActionPerformed(evt) {//GEN-FIRST:event_btnAddUsernameActionPerformed
        model.qGetSendParams.cursor.message += "%username%"; 
    }//GEN-LAST:event_btnAddUsernameActionPerformed

    function btnAddCountActionPerformed(evt) {//GEN-FIRST:event_btnAddCountActionPerformed
        model.qGetSendParams.cursor.message += "%count%"; 
    }//GEN-LAST:event_btnAddCountActionPerformed

    function btnAddPasswordActionPerformed(evt) {//GEN-FIRST:event_btnAddPasswordActionPerformed
        model.qGetSendParams.cursor.message += "%password%"; 
    }//GEN-LAST:event_btnAddPasswordActionPerformed

    self.manualShow = function(aContainer) {
        cmn.createElement("div", "Items", aContainer, "Items");
        cmn.createElement("div", "Bills", aContainer, "Bills");
        cmn.createElement("div", "Thanks", aContainer, "Thanks");
        var Items = document.getElementById("Items");
        list = new List(Items);
        cmn.createElement("div", "selection_result", aContainer);
        cmn.createElement("button", "next", aContainer, "nextButton");
        cmn.createElement("button", "prev", aContainer, "prevButton");
        cmn.createElement("button", "done", aContainer, "doneButton");
        cmn.createElement("button", "home", aContainer, "homeButton");
        $("#nextButton").html("Далее");
        $("#prevButton").html("Назад");
        $("#doneButton").html("Оплатить");
        $("#homeButton").html("Завершить");
        $('#prevButton , #doneButton, #homeButton, .Bills, .Thanks').hide();
        $('.selection_result').html("Всего выбрано позиций <span class='positions_count'>0</span> на сумму <span class='bill_sum'>0 рублей</span><br>");
        document.getElementById('nextButton').onclick = nextButtonClick;
        document.getElementById('prevButton').onclick = prevButtonClick;
        document.getElementById('doneButton').onclick = doneButtonClick;
        document.getElementById('homeButton').onclick = homeButtonClick;
    };

}
