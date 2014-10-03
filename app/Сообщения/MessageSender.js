 /**
 * @name MessageSender
 * @author Алексей, Женя
 * @public
 */
function MessageSender() {
    var self = this;
    var model = this.model;
    var email = null;
    var phone = null;
    var smsSender = new SmsSender();
    var emailSender = new Mailer();
    
    /*
     * Типы отправляемых сообщений.
     */
    self.REGISTRATION_SUCCESS = 1;
    self.BONUS_ADD = 2;
    self.BONUS_REMOVE = 3;
    
    self.sendMessage = function(anEventType, aClient, aParams){
        if (!aParams) aParams = {};
        if (typeof (aClient) != "object"){
            model.usersByName.params.usr_name = aClient;
            model.usersByName.requery();
            if (model.usersByName.length === 0) return "error";
            aClient = {};
            aClient.phone = model.usersByName.cursor.usr_phone;
            aClient.email = model.usersByName.cursor.usr_email;
            aClient.username = model.usersByName.cursor.usr_name;
        }
        model.qGetSendParams.params.eventType = anEventType;
        model.qGetSendParams.requery();
        var textMessage = model.qGetSendParams.cursor.message;
        for (param in aClient){
            aParams[param] = aClient[param];
        }
        for (param in aParams){
           textMessage = textMessage.replace(new RegExp("%" + param + "%",'g'), aParams[param]);
        }
        
        if (model.qGetSendParams.cursor.sms){
            if (aParams.phone){
                smsSender.sendSms(aParams.phone, textMessage, aParams.sign);
            }
        }
        if (model.qGetSendParams.cursor.email){
            if (aParams.email){
                if (!aParams.subject) aParams.subject = "Информационное сообщение сети кафе ЕРП";
                emailSender.sendEmail("rcCoffee", aParams.email, aParams.subject, textMessage);
            }
        }
        if (model.qGetSendParams.cursor.display){
            //TODO Сделать показ сообщения на экран
        }
    };
    
//Рудимент ------------------------------------------------------------------------------- 
//TODO Удалить перед релизом
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
