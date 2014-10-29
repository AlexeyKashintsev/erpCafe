/**
 * 
 * @author stipjey
 * @public
 */
function ClientServerModule() {
    Session.set('ClientServerModule', this);
    //TODO Проверить запросить из сессии
    var self = this, model = this.model;
    var sender = new MessageSender();                                            
    var userModule = new UserModule();
    var adminFunctions = new AdminFunctions();
    var billModule = Session.get('BillModule');

    function ClientConstructor(aPhone) {
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
     * TODO зачем две одинаковые функции?
     self.getClientDataByPhone = function(aPhone) {
     return new ClientConstructor(aPhone);
     };*/

    function genPass() {
        return Math.random().toString(36).slice(2, 8);
    }

    self.createUser = function(aPhone, anEmail, aFirstName,
            aMiddleName, aLastName, aBirthday,
            anAddress, anUserName, aBonusCategory) {
        if (!anUserName) {
            anUserName = aPhone;
        }
        if (!self.checkIfPhoneExist(aPhone) && !self.checkIfEmailExist(anEmail)){
            var pass = genPass();
            Logger.info("Пароль пользователя: " + pass);
            userModule.createUser(anUserName, adminFunctions.MD5(pass), 'client', anEmail, aPhone);
            model.qPersonalData.insert();
            model.qPersonalData.cursor.client_id = billModule.createBillAccount(billModule.ACCOUNT_TYPE_CLIENT);
            model.qPersonalData.cursor.first_name = aFirstName;
            model.qPersonalData.cursor.middle_name = aMiddleName;
            model.qPersonalData.cursor.last_name = aLastName;
            model.qPersonalData.cursor.birthday = aBirthday;
            model.qPersonalData.cursor.address = anAddress;
            model.qPersonalData.cursor.phone = aPhone;
            model.qPersonalData.cursor.email = anEmail;
            model.qPersonalData.cursor.usr_name = anUserName;
            model.qPersonalData.cursor.reg_date = new Date();
            model.save();
            self.setBonusCategory(anUserName, aBonusCategory ? aBonusCategory : 1);
            sender.sendMessage(sender.REGISTRATION_SUCCESS, {
                phone: model.qPersonalData.cursor.phone,
                username: model.qPersonalData.cursor.first_name,
                email: model.qPersonalData.cursor.email,
                password: pass
            });
            return model.qPersonalData.cursor.client_id;
        } else return false;
    };

    self.checkIfPhoneExist = function(aPhone) {
        model.qPersonalData.params.phone = aPhone;
        model.qPersonalData.params.email = null;
        model.qPersonalData.params.user_name = aPhone;
        model.qPersonalData.execute();
        if (model.qPersonalData.length > 0) {
            return true;
        } else
            return false;
    };

    self.getClientsByFourDigits = function(aDigits) {
        model.qGetPhoneByFourDigit.params.digits = aDigits;
        model.qGetPhoneByFourDigit.requery();
        if (model.qGetPhoneByFourDigit.length > 0) {
            var obj = {};
            var i = 0;
            model.qGetPhoneByFourDigit.beforeFirst();
            while (model.qGetPhoneByFourDigit.next()) {
                obj[i] = self.getClientDataByPhone(model.qGetPhoneByFourDigit.cursor.phone);
                i++;
            }
            obj.count = i;
            return obj;
        } else
            return false;
    };

    self.checkIfEmailExist = function(anEmail) {
        model.qPersonalData.params.phone = null;
        model.qPersonalData.params.email = anEmail;
        model.qPersonalData.params.user_name = null;
        model.qPersonalData.execute();
        if (model.qPersonalData.length > 0) {
            return true;
        } else
            return false;
    };

    self.setBonusCategory = function(anUserName, aCategoryId) {
        model.qPersonalData.params.user_name = anUserName;
        model.qPersonalData.execute();
        model.qPersonalData.cursor.bonus_category = aCategoryId;
        model.save();
    };

    self.getBonusCategory = function(anUserName) {
        model.qPersonalData.params.user_name = anUserName;
        model.qPersonalData.execute();
        return model.qPersonalData.cursor.bonus_category;
    };

    self.getBonusBill = function(aPhone) {
        if (!aPhone)
            return 0;
        model.qPersonalData.params.phone = aPhone;
        model.qPersonalData.execute();
        return model.qPersonalData.cursor.client_id;
    };
    
    self.clientInitialize = function(){
        model.qGetPersonalDataOfAllClients.requery();
        model.qGetPersonalDataOfAllClients.beforeFirst();
        while(model.qGetPersonalDataOfAllClients.next()){
            var clientphone = model.qGetPersonalDataOfAllClients.cursor.phone;
            if (!model.qGetPersonalDataOfAllClients.cursor.usr_name){
                model.qGetPersonalDataOfAllClients.cursor.usr_name = model.qGetPersonalDataOfAllClients.cursor.phone;
            }
            var clientusername = model.qGetPersonalDataOfAllClients.cursor.usr_name;
            if (!model.qGetPersonalDataOfAllClients.cursor.bonus_category){
                model.qGetPersonalDataOfAllClients.cursor.bonus_category = 1;
            }
            if (!userModule.checkIfPhoneExists(clientphone) && !userModule.checkIfLoginExists(clientusername)){
                userModule.createUser(model.qGetPersonalDataOfAllClients.cursor.usr_name ? 
                                        model.qGetPersonalDataOfAllClients.cursor.usr_name : 
                                        model.qGetPersonalDataOfAllClients.cursor.phone, 
                                        adminFunctions.MD5("password"), 
                                        'client', 
                                        model.qGetPersonalDataOfAllClients.cursor.email, 
                                        model.qGetPersonalDataOfAllClients.cursor.phone);
                var clientID = billModule.createBillAccount(billModule.ACCOUNT_TYPE_CLIENT);
                model.qGetPersonalDataOfAllClients.cursor.client_id = clientID;
            }
        }
        model.save();
    };
}