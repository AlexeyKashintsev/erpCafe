/**
 * 
 * @name messengerTest
 * @author Alexey
 */
function messengerTest() {
    var self = this;
    
    var msgM = new P.ServerModule('MessageSender');
    var admUnit = new P.ServerModule("AdminUtils");
    var eventsUtils = new P.ServerModule("EventUtils");
    self.model.params.aEqu = 136421761575190;
    self.model.params.date = new Date();
    admUnit.loggedInAgent(function(aAgent) {
            self.params.agent = aAgent;
           P.Logger.severe('ok');
            self.model.requery();
        });
        
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        msgM.sendMail('test header','test message');
    }//GEN-LAST:event_buttonActionPerformed

    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        msgM.sendSMS('Test');
    }//GEN-LAST:event_button1ActionPerformed

    function button2ActionPerformed(evt) {//GEN-FIRST:event_button2ActionPerformed
    self.model.params.date = new Date();
    admUnit.loggedInAgent(function(aAgent) {
            self.params.agent = aAgent;
           P.Logger.severe('ok');
            self.model.requery();
        });
    }//GEN-LAST:event_button2ActionPerformed

    function button3ActionPerformed(evt) {//GEN-FIRST:event_button3ActionPerformed
        eventsUtils.addSOSEvent(139220357634300, new Date(), new Date()
            , null, "", 0, 0
            , self.model.equ.cursor.usr_context);
//        eventsUtils.addSOSEvent(aDevice, aTime, aTimeTo, aPoint, aDescription, aValue, aValueTo, aUsrContext)    
    }//GEN-LAST:event_button3ActionPerformed
}
