/**
 * 
 * @name SmsSender
 * @author Алексей
 * @module 
 */
function SmsSender(anEmail, aPassword) {
    var self = this;
    var urlHandler = new URL_handler();
    var defUrl = 'https://api.sms24x7.ru/';
    var sid = null;
    var defSign = 'APMA';
    var sessionBalance = 0;
    
    self.smsAuth = function(anEmail, aPassword){
        var params = {
            method   : 'login',
            format   : 'JSON',
            api_v    : '1.1',
            email    : anEmail   ? anEmail   : 'akashintsev@yandex.ru',
            password : aPassword ? aPassword : '41XGMNM'
        };
        
        Logger.finest('Авторизация на сервере ' + defUrl+', с логином '+params.email+' и паролем '+params.password);
        var response = sendRequest(params);
        
        if (response.msg.err_code === 0) {
            sid = response.data.sid;
            Logger.finest('Авторизация успешна. SID: ' + sid + ' Ответ: ' + response.msg.text);
        } else {
            sid = null;
            Logger.warning('Не удалось авторизироваться на сервисе отправки СМС. Код ошибки: ' + response.msg.err_code + ' ( ' + response.msg.text + ')');
        }
    };
    self.smsAuth(anEmail, aPassword);
    
    self.smsLogout = function(){
        var params = {
            format   : 'JSON',
            api_v    : '1.1',
            method   : 'logout'
        };
        Logger.finest('Logging out...');
        var response = sendRequest(params);
        if (response.msg.err_code === 0) {
            sid = null;
            Logger.finest('Выход из сервиса СМС рассылки - успешно' + ' Ответ: ' + response.msg.text);
        } else {
            Logger.warning('Ошибка при выходе из сервиса СМС рассылки! Код ошибки: ' + response.msg.err_code + ' ( ' + response.msg.text + ')');
        }
    };
    
    self.sendSms = function(aNumber, aMsg, aSign){
        if (!sid) {
            Logger.warning('Невозможно отправить СМС! Сервис не авторизирован');
            return false;
        } else {
            var params = {
                method     : 'push_msg',
                format     : 'JSON',
                api_v      : '1.1',
                sid        : sid,
                text       : aMsg,
                sender_name: aSign ? aSign : defSign
            };
            if (typeof aNumber == 'number')
                params.phone = aNumber;
            else
                params.phones = aNumber;
            var response = sendRequest(params);
            if (response.msg.err_code === 0) {
                Logger.finest('СМС отправлено успешно, ID СМС: ' + response.data.id + ' Ответ: ' + response.msg.text);
                sessionBalance += response.data.credits * response.data.n_raw_sms;
                return response.data.id;
            } else {
                Logger.warning('СМС не отправлено: Код ошибки: ' + response.msg.err_code + ' ( ' + response.msg.text + ')');
                return false;
            }
        };
    };
    
    self.getSmsStatus = function(aSmsId){
        if (!sid) {
            Logger.warning('Невозможно проверить статус СМС! Сервис не авторизирован');
            return false;
        } else {
            var params = {
                method     : 'get_msg_report',
                format     : 'JSON',
                api_v      : '1.1',
                sid        : sid,
                id         : aSmsId
            };

            var response = sendRequest(params);
            if (response.msg.err_code === 0) {
                Logger.finest('Статус СМС получен успешно, номер: ' + response.data.phone
                            + ', текст: \"' + response.data.text + '\", статус: ' + response.data.state + ' Ответ: ' + response.msg.text);
                return response.data.state;
            } else {
                Logger.warning('Не удалось получить статус СМС , код ошибки: ' + response.msg.err_code + ' ( ' + response.msg.text + ')');
                return false;
            }
        };       
    };
    
    function sendRequest(aParams){
        var fullUrl = urlHandler.getUrlString(defUrl, aParams);
        var resp = Resource.loadText(fullUrl);
        return JSON.parse(resp).response;
    }
    
    self.getStateDescription = function(aCode){
        return smsStates[aCode];
    };
    
    var smsStates = {
        0 : 'Ожидает отправки',
        1 : 'Доставлено',
        2 : 'Не доставлено',
        4 : 'Принято оператором',
        8 : 'Принято СМС-центром',
        16 : 'Не принято СМС-центром',
        32 : 'Невозможно доставить'
    };
}
