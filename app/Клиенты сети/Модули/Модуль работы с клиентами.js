/**
 * 
 * @author stipjey
 * @module
 */ 
function ClientServerModule() {
    var self = this, model = this.model;
    var smsSender = new ServerModule("SmsSender");
    var userModule = new ServerModule("UserModule");
    var adminFunctions = new ServerModule("AdminFunctions");
    var pass = null;
    
    function genPass(){
        return Math.random().toString(36).slice(2,8);
    }
    
    self.setPass = function (aPass){
        pass = aPass;
    }
    
    
    self.createUser = function(anUserName, anEmail, aFirstName, aRoleName){
        //У клиентов в качестве username используется номер телефона
        model.qPersonalData.insert();
        model.qPersonalData.cursor.first_name = aFirstName;
        model.qPersonalData.cursor.phone = anUserName;
        model.qPersonalData.cursor.email = anEmail;
        model.qPersonalData.cursor.usr_name = anUserName;
        model.qPersonalData.cursor.reg_date = new Date();
        model.save();
        self.setPass(genPass()); //Генерим пароль в переменную pass
        userModule.createUser(anUserName, adminFunctions.MD5(pass), aRoleName, anEmail, anUserName);
        sendSMS(aFirstName, anUserName, pass);
    };
    
    function sendSMS(aName, aPhone, aPass){
        var Msg = "Уважаемый " + aName + "! Для входа в личный кабинет кофейни пройдите по ссылке: http://www.ru/ Ваш логин: "
        + aPhone + ", Ваш пароль: " + aPass;
        smsSender.sendSms(aPhone, Msg, null);
    }
}
