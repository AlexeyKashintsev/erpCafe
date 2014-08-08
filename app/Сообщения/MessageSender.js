/**
 * Was resident!!!
 * @name MessageSender
 * @author Алексей
 * @module 
 * @public
 */
function MessageSender() {
    var self = this;
    var email = null;
    var phone = null;
    var smsSender = new SmsSender();
    var emailSender = new Mailer();
            
    function sendSMS(aMsg, aPhone){
        smsSender.sendSms(aPhone, aMsg, 'Corvus');
    };
    
    function sendMail(aSubj, aMsg, aEmail){
        emailSender.sendEmail('rcCoffee', aEmail, aSubj, aMsg);
    };
    
    function send2Screen(aMsg){
        
    }
    
    self.sentNotificationByEvent = function(anEventType, aParams, anUserName){
        var event_settings = self.notification_settings.findById(anEventType);
        var event_notification = self.eventTypes.findById(anEventType);
        var phoneNumber = anUserName?{}:phone;
        var e_mail = anUserName?{}:email;
        var msg_str = '';
        if (event_settings.send_to_screen) {
            if (!anUserName)
                send2Screen();
        }
        if (event_settings.send_sms) {
            msg_str = java.lang.String.format(event_notification.sms_text, aParams);
            sendSMS(msg_str, phoneNumber);
        }
        if (event_settings.send_email) {
            msg_str = java.lang.String.format(event_notification.email_text, aParams);
            sendMail(event_notification.email_header, msg_str, e_mail);
        }
    };
    
    self.initUserSettings = function(){
        if (self.notification_settings.empty){
            self.eventTypes.beforeFirst();
            while (self.eventTypes.next()){
                self.notification_settings.insert({
                    username: self.principal.name,
                    event_type: self.eventTypes.cursor.tr_tracking_event_types_id,
                    send_to_screen: 1,
                    send_sms: 0,
                    send_email: 0
                });
            }
            self.model.save();
        }
    };
}
