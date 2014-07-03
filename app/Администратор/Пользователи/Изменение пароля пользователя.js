/**
 * @name 132134435407827
*/
function clearData()
{
    edNewPswd1.text = '';
    edNewPswd2.text = '';
    model.requery();
}

function btnOkActionPerformed(evt) {//GEN-FIRST:event_btnOkActionPerformed
    if (edNewPswd1.text != edNewPswd2.text)
    {
        warn('Необходимо ввести одинаковые пароли!', 'Предупреждение');
        return;
    }
    dsUser.usr_passwd = MD5Generator.generate(edNewPswd1.text);
    model.save();
    //dsUser.save();
    modalResult = ok;
    close();	
}//GEN-LAST:event_btnOkActionPerformed

function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
    close();	
}//GEN-LAST:event_btnCancelActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    clearData();
}//GEN-LAST:event_formWindowOpened
