/**
 * 
 * @author stipjey
 * @public
 */
function ClientServerModule() {
    Session.set('ClientServerModule', this);
    //TODO ak
    var self = this, model = this.model;
    var sender = new MessageSender();                                            
//    var userModule = Session.get('UserModule');
//    var adminFunctions = new AdminFunctions();
    var billModule = Session.get('BillModule');

    function ClientConstructor(aPhone) {
        model.qPersonalData.params.phone = aPhone;
        model.qPersonalData.execute();
        Logger.info(model.qPersonalData);
        this.phone = aPhone;
        this.clientId = model.qPersonalData.cursor.client_id;
        this.bonusBill = billModule.getBillAccountClient(model.qPersonalData.cursor.client_id);
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

//    function genPass() {
//        return Math.random().toString(36).slice(2, 8);
//    }

    self.createUser = function( aPhone, anEmail, aFirstName,
                                aMiddleName, aLastName, aBirthday,
                                anAddress, anUserName, aBonusCategory) {
        if (!anUserName) anUserName = aPhone;
        if (anEmail === "") anEmail = null;
        if (aPhone && !self.checkIfPhoneExist(aPhone) && !self.checkIfEmailExist(anEmail)){
//            Перестали создавать пользователей в mtd_users
//            var pass = genPass();
//            Logger.info("Пароль пользователя: " + pass);
//            userModule.createUser(anUserName, adminFunctions.MD5(pass), 'client', anEmail, aPhone);
//            model.qPersonalData.cursor.client_id = billModule.createBillAccount(billModule.ACCOUNT_TYPE_BONUS);
            model.qPersonalData.push({
                first_name  :   aFirstName,
                middle_name :   aMiddleName,
                last_name   :   aLastName,
                birthday    :   aBirthday,
                address     :   anAddress,
                phone       :   aPhone,
                email       :   anEmail,
                usr_name    :   anUserName,
                reg_date    :   new Date()
            });
            model.save();
            billModule.createBillAccount(billModule.ACCOUNT_TYPE_BONUS, null, model.qPersonalData.cursor.client_id);
            self.setBonusCategory(anUserName, aBonusCategory ? aBonusCategory : 1);
//            sender.sendMessage(sender.REGISTRATION_SUCCESS, {
//                phone: model.qPersonalData.cursor.phone,
//                username: model.qPersonalData.cursor.first_name,
//                email: model.qPersonalData.cursor.email,
//                password: pass
//            });
            sender.sendMessage(sender.REGISTRATION_SUCCESS, {
                phone: model.qPersonalData.cursor.phone,
                username: model.qPersonalData.cursor.first_name,
                email: model.qPersonalData.cursor.email
            });
            return model.qPersonalData.cursor.client_id;
        } else{
            Logger.warning("Регистрация этого клиента запрещена " + model.qPersonalData);
            return false;
        }
    };

    self.checkIfPhoneExist = function(aPhone) {
        if (aPhone === "") aPhone = null;
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
        if (anEmail === "") anEmail = null;
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
        model.qGetBonusBill.params.phone = aPhone;
        model.qGetBonusBill.execute();
        return model.qGetBonusBill.cursor.bill_accounts_id;
    };
    
    function fixphone(aPhone){
        var num = aPhone.replace(/\D+/g,"");
        num = "8" + num.slice(-10);
        return num;
    }
    
    self.clientInitialize2 = function(){
        model.qGetAllBills.requery();
        model.qGetAllBills.beforeFirst();
        while (model.qGetAllBills.next()){
            model.qPersonalData.params.id = model.qGetAllBills.cursor.bill_accounts_id;
            model.qPersonalData.requery();
            if (model.qPersonalData.length > 0){
                model.qGetAllBills.cursor.client_id = model.qPersonalData.cursor.client_id;
            }
        }
        model.save();
    };
    
    self.clientInitialize = function(){
        Logger.info('Начало ахтунга!!!');
        model.qGetPersonalDataOfAllClients.requery();
        model.qGetPersonalDataOfAllClients.beforeFirst();
        while(model.qGetPersonalDataOfAllClients.next()){
            model.qGetPersonalDataOfAllClients.cursor.phone = fixphone(model.qGetPersonalDataOfAllClients.cursor.phone);
            if (!model.qGetPersonalDataOfAllClients.cursor.usr_name){
                model.qGetPersonalDataOfAllClients.cursor.usr_name = model.qGetPersonalDataOfAllClients.cursor.phone;
            }
            if (!model.qGetPersonalDataOfAllClients.cursor.bonus_category){
                model.qGetPersonalDataOfAllClients.cursor.bonus_category = 1;
            }
            if (!model.qGetPersonalDataOfAllClients.cursor.reg_date){
                model.qGetPersonalDataOfAllClients.cursor.reg_date = new Date();
            }
            if (!model.qGetPersonalDataOfAllClients.cursor.bill_client_id){
                var bill_id = billModule.createBillAccount(billModule.ACCOUNT_TYPE_BONUS, null, model.qGetPersonalDataOfAllClients.cursor.client_id);
                if (model.qGetPersonalDataOfAllClients.cursor.address){
                    var bonuscount = Number(model.qGetPersonalDataOfAllClients.cursor.address);
                    if (!isNaN(bonuscount)) {
                        try {
                            billModule.addBillOperation(bill_id, billModule.OPERATION_ADD_BONUS, bonuscount);
                            model.qGetPersonalDataOfAllClients.cursor.address = null;
                        } catch (e){
                            Logger.warning(e);
                        }
                    }
                }
            }
        }
        model.save();
    };
}