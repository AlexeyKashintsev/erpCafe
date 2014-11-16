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
        var modalBody = document.getElementById("modal-body-window");
        var btnGroup = cmn.createElement('div', null, modalBody);
        var sessionData = cmn.createElement('div', null, modalBody);
        $('#modalForm').modal('toggle');
        $('#modal-title').html('Данные торговой сессии');
        panels.wharH.display = new WHSessionBalance(sessionData);
        panels.tradeOp.display = new commonSessionInfo(sessionData);
        self.setTradePoint(aSessionData.trade_point);
        self.setSession(aSessionData.org_session_id);
        buttonsSelector = new cmn.ButtonGroup(panels, btnGroup, "btn btn-info btn-xs", showPanel);
    };
}
