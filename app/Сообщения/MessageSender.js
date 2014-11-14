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
        if (typeof (aClient) !== "object"){
            model.usersByName.params.usr_name = aClient;
            model.usersByName.requery();
            if (model.usersByName.length === 0) return "error";
            aClient = {};
            aClient.phone = model.usersByName.cursor.usr_phone;
            aClient.email = model.usersByName.cursor.usr_email;
            aClient.username = model.usersByName.cursor.usr_name;
        }
        aClient.phone = fixphone(aClient.phone);
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
    
    function fixphone(aPhone){
        var num = aPhone.replace(/\D+/g,"");
        if (num.length >= 10){
            num = "8" + num.slice(-10);
            return num;
        } else return null;
    }
    
    function getFranchaziPhones(){
        var mass = [];
        model.qGetFranchaziPhones.requery();
        model.qGetFranchaziPhones.beforeFirst();
        while (model.qGetFranchaziPhones.next()){
            mass[mass.length] = model.qGetFranchaziPhones.cursor.usr_phone;
        }
        return mass;
    }
    
    function getBaristaPhones(){
        var mass = [];
        model.qGetBaristaPhones.requery();
        model.qGetBaristaPhones.beforeFirst();
        while (model.qGetBaristaPhones.next()){
            mass[mass.length] = model.qGetBaristaPhones.cursor.usr_phone;
        }
        return mass;
    }
    
    function getClientPhones(city_id){
        var mass = [];
        if (city_id) model.qGetClientPhones.params.city_id = city_id;
        model.qGetClientPhones.requery();
        model.qGetClientPhones.beforeFirst();
        while (model.qGetClientPhones.next()){
            mass[mass.length] = model.qGetClientPhones.cursor.phone;
        }
        return mass;
    }
    
    function createListPhones(userType, city_id){
        var listPhones = [];
        switch (userType){
            case "franchazi" :
                listPhones = listPhones.concat(getFranchaziPhones());
                break;
            case "barista" : 
                listPhones = listPhones.concat(getBaristaPhones());
                break;
            case "client" :
                listPhones = listPhones.concat(getClientPhones());
                break;
            default :
                listPhones = listPhones.concat(getFranchaziPhones(), getBaristaPhones(), getClientPhones(city_id)); 
                break;
        }
        return listPhones;
    }
    
    function massSendSMS(listPhones, text){
        for (var phone in listPhones){
            listPhones[phone] = fixphone(listPhones[phone]);
            if (listPhones[phone])
                smsSender.sendSms(listPhones[phone], text);
        }
    }
    
    self.massSending = function(text, userType, city_id){
        var list = createListPhones(userType, city_id);
        massSendSMS(list, text);
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
