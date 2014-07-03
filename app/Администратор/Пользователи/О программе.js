/**
 * 
 * @author Алексей
 * @name О_программе
 */

function dsAppVersionRequeried(evt) {//GEN-FIRST:event_dsAppVersionRequeried
	// TODO Добавьте здесь свой код:
}//GEN-LAST:event_dsAppVersionRequeried

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    label1.text = 'Версия ПО: ' + dsAppVersion.version_num;
}//GEN-LAST:event_formWindowOpened

function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
    close();
}//GEN-LAST:event_buttonActionPerformed
