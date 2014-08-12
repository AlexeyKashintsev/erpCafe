/**
 * 
 * @author stipjey
 * @module
 */ 
function ClientServerModule() {
    var self = this, model = this.model;
    //TODO Исправить под логику работы с клиентами
    
    
    self.createUser = function(anUserName, anEmail, aFirstName){
        model.qPersonalData.insert();
        model.qPersonalData.cursor.first_name = aFirstName;
        model.qPersonalData.cursor.phone = anUserName;
        model.qPersonalData.cursor.email = anEmail;
        model.qPersonalData.cursor.usr_name = anUserName;
        model.qPersonalData.cursor.reg_date = new Date();
        model.save();
    };   
}
