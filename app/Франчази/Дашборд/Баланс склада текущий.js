/**
 * 
 * @author Alexey
 * @public
 */
function WHBalance(aWarehouse, aContainer) {
    var self = this, model = this.model;
    var items = [];
    var shown = false;
    var header = ["Наименование", "Текущий остаток", "Прогноз"];

    /* var item = {
     item_name    :  '',
     item_id      :  0,
     item_measure :  '',
     startV  :   0,
     usedV   :   0,
     finalV  :   0,
     endV    :   0
     };*/
    

    self.setWarehouse = function(aWarehouse) {
        model.params.trade_point_id = aWarehouse;
        getCurrentSession();
    };

    self.setTradePoint = self.setWarehouse;

    self.setSession = function(aSession) {
        model.qWHSessionBalance.params.session_id = aSession;
        model.qWHSessionBalance.requery();
    };
    
    /**
     * 
     * @param {type} aWarehouse - TradePoint ID
     * @returns none
     */
    function getCurrentSession() {
        Logger.info("Получение сессии для склада: " + model.params.trade_point_id);
        model.queryOpenedSession.requery(function(){proceedLast();});
        model.qLastClosedSessionOnTradePoint.requery(function(){proceedLast();});
        
        var pLEC = 0;//Счетчик запусков для определения последней сессии
        function proceedLast() {
            pLEC++;
            if (model.queryOpenedSession.length > 0 && pLEC < 3) {
                self.setSession(model.queryOpenedSession.cursor.org_session_id);
                pLEC = 10;
            } else if (pLEC === 2 && model.qLastClosedSessionOnTradePoint.length > 0) {
                self.setSession(model.qLastClosedSessionOnTradePoint.cursor.org_session_id);
            }
        }
    };
    
    self.container = cmn.createElement("div", "", aContainer);
    var grid = new wf.Table(self.container, header);
    
    if (aWarehouse)
        self.setWarehouse(aWarehouse);

    function qWHSessionBalanceOnRequeried(evt) {//GEN-FIRST:event_qWHSessionBalanceOnRequeried
        model.qWHSessionBalance.beforeFirst();
        var data = [];
        
        model.qWHSessionBalance.forEach(function (md) {
                //var md = model.qWHSessionBalance.cursor;
                data.push([md.item_name + (md.short_string ? ' ' + md.short_string : '')
                    , md.final_value ? md.final_value + (md.item_measure ? ' ' + md.item_measure : '') : "Нет данных"
                    , "Нет данных"]);
            });
        
        grid.setData(data);
    }//GEN-LAST:event_qWHSessionBalanceOnRequeried
}