/**
 * 
 * @author stipjey
 * @public
 */ 
function ClientServerModule() {
    var self = this, model = this.model;
    var smsSender = new SmsSender(); 
                                                 
    var userModule = new UserModule();
    var adminFunctions = new AdminFunctions();
    var billModule = new BillModule();
    var pass = null;
    
    function ClientConstructor(aPhone){
        model.qPersonalData.params.phone = aPhone;
        model.qPersonalData.execute();
        Logger.info(model.qPersonalData);
        this.phone = aPhone;
        this.bonusBill = model.qPersonalData.cursor.client_id;
        this.firstName = model.qPersonalData.cursor.first_name;
        this.middleName = model.qPersonalData.cursor.middle_name;
        this.lastName = model.qPersonalData.cursor.last_name;
        this.birthday = model.qPersonalData.cursor.birthday;
        this.email = model.qPersonalData.cursor.email;
        this.registrationDate = model.qPersonalData.cursor.reg_date;
        this.bonusCategory = model.qPersonalData.cursor.bonus_category;
        this.bonusCount = billModule.getQuickSumFromAccountId(this.bonusBill);
        Logger.info(billModule.getQuickSumFromAccountId(this.bonusBill));
    };
    
    self.getClientDataByPhone = function(aPhone) {
        return new ClientConstructor(aPhone);
    };
    
    self.getClientData = function() {
        return new ClientConstructor(self.principal.name);
    };
    
    /*
     * @rolesallowed admin franchazi
     */
    self.getClientDataByPhone = function(aPhone) {
        return new ClientConstructor(aPhone);
    };
    
    function genPass(){
        return Math.random().toString(36).slice(2,8);
    }
    
    self.setPass = function (aPass){
        pass = aPass;
    };
    
    
    self.createUser = function(anUserName, anEmail, aFirstName, aRoleName){
        //У клиентов в качестве username используется номер телефона
        
        
        self.setPass(genPass());
        Logger.finest("Пароль пользователя: " + pass);//Генерим пароль в переменную pass
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
        //TODO Текст СМС сообщений должен генериться в SMS сендере, он так же должен там настраиваться
        //Уважаемый  %ClientName%! Для входа в личный кабинет кофейни пройдите по ссылке: http://www.ru/ Ваш логин: %ClientLogin%
        //И передавать объект вида {ClientName : "Вася", ClientLogin : "12345", ...}
        //Потом аккуратненько поменять ;)
        //+ aPhone + ", Ваш пароль: " + aPass;
        var Msg = "Уважаемый " + aName + "! Для входа в личный кабинет кофейни пройдите по ссылке: http://www.ru/ Ваш логин: "
        + aPhone + ", Ваш пароль: " + aPass;
        smsSender.sendSms(aPhone, Msg, null);
    }
    
     self.checkIfPhoneExist = function(aPhone){
        model.qPersonalData.params.phone = aPhone;
        model.qPersonalData.params.email = null;
        model.qPersonalData.params.user_name = aPhone;
        model.qPersonalData.execute();
        if (model.qPersonalData.length > 0){
            return true;
        } else return false;
    };
    
    self.checkIfEmailExist = function(anEmail){
        model.qPersonalData.params.phone = null;
        model.qPersonalData.params.email = anEmail;
        model.qPersonalData.params.user_name = null;
        model.qPersonalData.execute();
        if (model.qPersonalData.length > 0){
            return true;
        } else return false;
    };
    
    self.setBonusCategory = function(anUserName, aCategoryId){
        model.qPersonalData.params.user_name = anUserName;
        model.qPersonalData.execute();
        model.qPersonalData.cursor.bonus_category = aCategoryId;
        model.save();
    };
    
    self.getBonusCategory = function(anUserName){
        model.qPersonalData.params.user_name = anUserName;
        model.qPersonalData.execute();
        return model.qPersonalData.cursor.bonus_category;
    };
    
    self.getBonusBill = function(aPhone){
        if (!aPhone) return 0;
        model.qPersonalData.params.phone = aPhone;
        model.qPersonalData.execute();
        return model.qPersonalData.cursor.client_id;
    };
    
    
}
