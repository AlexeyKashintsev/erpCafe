/**
 * 
 * @author Alexey
 * @module
 */ 
function mSessionData() {
    var self = this, model = this.model;
    var buttonsSelector = null;
    
    var panels = {
        tradeOp :   {
            d_name  :   '<span class="glyphicon glyphicon-inbox"></span> Касса',
            d_title :   'Касса',
            active  :   true
        },
        trOperations    :   {
            d_name  :   '<span class="glyphicon glyphicon-inbox"></span> Операции',
            d_title :   'Операции'
        },
        wharH   :   {
            d_name  :   '<span class="glyphicon glyphicon-book"></span> Склад',
            d_title :   'Склад'
        }
    };
    
    self.setSession = function(aSessionId) {
        model.params.session_id = aSessionId;
        panels.wharH.display.setSession(aSessionId);
        panels.tradeOp.display.setSession(aSessionId);
    };
    
    self.setTradePoint = function(aTradePointID) {
        model.params.trade_point_id = aTradePointID;
        panels.wharH.display.setWarehouse(aTradePointID);
    };
    
    function showPanel(aPanelName) {
        $(panels[aPanelName].display.container).show();
        for (var j in panels) {
            if (j !== aPanelName)
                $(panels[j].display.container).hide();
        }
        if (panels[aPanelName].display.showData)
            panels[aPanelName].display.showData();
    }
    
    self.show = function(aSessionData) {
        var modal = new cmn.Modal('Данные торговой сессии');
        var modalBody = modal.getModalBody();
        
        var btnGroup = cmn.createElement('div', null, modalBody);
        var sessionData = cmn.createElement('div', null, modalBody);
        panels.wharH.display = new WHSessionBalance(sessionData);
        panels.trOperations.display = new TradeOperationsInSession(sessionData, aSessionData.org_session_id);
        panels.tradeOp.display = new commonSessionInfo(sessionData);
        self.setTradePoint(aSessionData.trade_point);
        self.setSession(aSessionData.org_session_id);
        buttonsSelector = new wf.ButtonGroup(panels, btnGroup, "btn btn-info btn-xs", showPanel);
        
        modal.show();
    };
}
