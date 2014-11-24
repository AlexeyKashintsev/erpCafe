/**
 * 
 * @author Alexey
 * @module
 */ 
function OrderProcessor() {
    var self = this, model = this.model;
    
    function UnprocessedOrders() {
        var orders = [];
        var divEl = null;

        function processOrders() {
            for (var j in orders) {
                processOrder(orders[j]);
            }
            orders = [];
            widgetCreator.Alerter(divEl, false, "", false, 1);
            divEl = null;
        }

        this.addOrder = function(anOrderDetails) {
            orders.push(anOrderDetails);
            divEl = widgetCreator.Alerter(divEl, "alert-warning", "<h4>Нажмите, чтобы отправить снова</h4>Не обработано заказов: " + orders.length, false, false);
            divEl.onclick = processOrders;
        };
    }

    var unprocessedOrders = new UnprocessedOrders();

    self.processOrder = function(anOrderDetails, anAlert, anAttempt) {
        var attempt = anAttempt ? anAttempt : 0;
        attempt++;
        Logger.info("Отправка данных заказа на сервер попытка №" + attempt);
        var alert = widgetCreator.Alerter(anAlert, "alert-info", "<h4>Обработка заказа</h4>Попытка № " + attempt, false);
        session.tradeSession.processOrder(anOrderDetails, function() {
                widgetCreator.Alerter(alert, "alert-success", "<h4>Заказ успешно проведен</h4>Сумма заказа: <strong>"
                        + anOrderDetails.orderSum + " рублей </strong>", true, 15000);
            }, function() {
                if (attempt < 5)
                    processOrder(anOrderDetails, alert, attempt);
                else {
                    widgetCreator.Alerter(alert, "alert-danger", "<h4>Заказ не проведен</h4>Проверьте связь с сервером", true, 15000);
                    unprocessedOrders.addOrder(anOrderDetails);
                }
            });
    }
}
