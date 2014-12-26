/**
 * 
 * @author Alexey
 */
function ItemCard() {
    var self = this, model = this.model, form = this;
    
    // TODO : place your code here

    function tbYellowActionPerformed(evt) {//GEN-FIRST:event_tbYellowActionPerformed
    colSelected = true;
    self.model.params.parColor = 'Yellow';
    loadImages();
    }//GEN-LAST:event_tbYellowActionPerformed

    function tbRedActionPerformed(evt) {//GEN-FIRST:event_tbRedActionPerformed
    colSelected = true;
    self.model.params.parColor = 'Red';
    loadImages();
    }//GEN-LAST:event_tbRedActionPerformed

    function tbBlackActionPerformed(evt) {//GEN-FIRST:event_tbBlackActionPerformed
    colSelected = true;
    self.model.params.parColor = 'Black';
    loadImages();
    }//GEN-LAST:event_tbBlackActionPerformed

    function tbGreenActionPerformed(evt) {//GEN-FIRST:event_tbGreenActionPerformed
    colSelected = true;
    self.model.params.parColor = 'Green';
    loadImages();
    }//GEN-LAST:event_tbGreenActionPerformed

    function tbGreyActionPerformed(evt) {//GEN-FIRST:event_tbGreyActionPerformed
    colSelected = true;
    self.model.params.parColor = 'Grey';
    loadImages();
    }//GEN-LAST:event_tbGreyActionPerformed

    function tbBlueActionPerformed(evt) {//GEN-FIRST:event_tbBlueActionPerformed
    colSelected = true;
    self.model.params.parColor = 'Blue';
    loadImages();
    }//GEN-LAST:event_tbBlueActionPerformed
}
