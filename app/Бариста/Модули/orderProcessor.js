/**
 * 
 * @author Alexey
 * @module
 */ 
function OrderProcessor() {
    var self = this, model = this.model;
    
    var logs = {
        sending : "Отправка данных заказа на сервер попытка №"
    };
    
    var alerts = {
        tryAgain    :   "<h4>Нажмите, чтобы отправить снова</h4>Не обработано заказов: ",
        sending     :   "<h4>Обработка заказа</h4>Попытка № ",
        success     :   "<h4>Заказ успешно проведен</h4>Сумма заказа: <strong>",
        successEnding   :   " рублей</strong>",
        failure     :   "<h4>Заказ не проведен</h4>Проверьте связь с сервером"
    };
    
    
    function UnprocessedOrders() {
        var orders = [];
        var divEl = null;

        function processOrders() {
            for (var j in orders) {
                processOrder(orders[j]);
            }
            orders = [];
            new Alerter(divEl, false, "", false, 1);
            divEl = null;
        }

        this.addOrder = function(anOrderDetails) {
            orders.push(anOrderDetails);
            divEl = new Alerter(divEl, "alert-warning", alerts.tryAgain + orders.length, false, false, false, processOrders);
        };
    }

    var unprocessedOrders = new UnprocessedOrders();

    self.processOrder = function(anOrderDetails, anAlert, anAttempt) {
        var attempt = anAttempt ? anAttempt : 0;
        attempt++;
        Logger.info(logs.sending + attempt);
        var alert = new Alerter(anAlert, "alert-info", alerts.sending + attempt, false);
        session.tradeSession.processOrder(anOrderDetails, function() {
                new Alerter(alert, "alert-success", alerts.success
                        + anOrderDetails.orderSum + alerts.successEnding, true, 15000);
            }, function() {
                if (attempt < 5)
                    processOrder(anOrderDetails, alert, attempt);
                else {
                    new Alerter(alert, "alert-danger", alerts.failure, true, 15000);
                    unprocessedOrders.addOrder(anOrderDetails);
                }
            });
    };
}
