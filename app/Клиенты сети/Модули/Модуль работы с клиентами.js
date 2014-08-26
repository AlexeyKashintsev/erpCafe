/**
 * 
 * @author stipjey
 * @module
 */ 
function ClientServerModule() {
    var self = this, model = this.model;
    var smsSender = new ServerModule("SmsSender");
    var userModule = new UserModule();
    var adminFunctions = new ServerModule("AdminFunctions");
    var billModule = new BillModule();
    var pass = null;
    
    function genPass(){
        return Math.random().toString(36).slice(2,8);
    }
    
    self.setPass = function (aPass){
        pass = aPass;
    };
    
    
    self.createUser = function(anUserName, anEmail, aFirstName, aRoleName){
        //У клиентов в качестве username используется номер телефона
        
        
        self.setPass(genPass());
        alert(pass);//Генерим пароль в переменную pass
        userModule.createUser(anUserName, adminFunctions.MD5(pass), aRoleName, anEmail, anUserName);
        model.qPersonalData.insert();
        model.qPersonalData.cursor.client_id = billModule.createBillAccount(anUserName, billModule.ACCOUNT_TYPE_CLIENT, null);
        model.qPersonalData.cursor.first_name = aFirstName;
        model.qPersonalData.cursor.phone = anUserName;
        model.qPersonalData.cursor.email = anEmail;
        model.qPersonalData.cursor.usr_name = anUserName;
        model.qPersonalData.cursor.reg_date = new Date();
        model.save();
        self.setBonusCategory(anUserName, 1);
        sendSMS(aFirstName, anUserName, pass);
    };
    
    function sendSMS(aName, aPhone, aPass){
        var Msg = "Уважаемый " + aName + "! Для входа в личный кабинет кофейни пройдите по ссылке: http://www.ru/ Ваш логин: "
        + aPhone + ", Ваш пароль: " + aPass;
        smsSender.sendSms(aPhone, Msg, null);
    }
    
     self.checkIfPhoneExist = function(aPhone){
        model.qPersonalData.params.phone = aPhone;
        model.qPersonalData.params.email = null;
        model.qPersonalData.params.user_name = aPhone;
        model.qPersonalData.requery();
        if (model.qPersonalData.length > 0){
            return true;
        } else return false;
    };
    
    self.checkIfEmailExist = function(anEmail){
        model.qPersonalData.params.phone = null;
        model.qPersonalData.params.email = anEmail;
        model.qPersonalData.params.user_name = null;
        model.qPersonalData.requery();
        if (model.qPersonalData.length > 0){
            return true;
        } else return false;
    };
    
    self.getClientId = function(anUserName){
        model.qPersonalData.params.user_name = anUserName;
        return model.qPersonalData.cursor.client_id;
    };
    
    self.setBonusCategory = function(anUserName, aCategoryId){
        model.qPersonalData.params.user_name = anUserName;
        model.qPersonalData.requery();
        model.qPersonalData.cursor.bonus_category = aCategoryId;
        model.save();
    };
    
    self.getBonusCategory = function(anUserName){
        model.qPersonalData.params.user_name = anUserName;
        model.qPersonalData.requery();
        return model.qPersonalData.cursor.bonus_category;
    };
    
    self.getBonusBill = function(aPhone){
        model.qPersonalData.params.phone = aPhone;
        model.qPersonalData.requery();
        return model.qPersonalData.cursor.client_id;
    };
    
    self.getBonusCount = function(aPhone){
        return billModule.getSumFromUserId(aPhone);
    }
}
