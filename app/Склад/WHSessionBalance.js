/**
 * 
 * @author Alexey
 * @module
 */
function WHSessionBalance() {
    var self = this, model = this.model;
    var items = [];
    /* var item = {
     item_name    :   '',
     item_id      :   0,
     item_measure :  '',
     startV  :   0,
     usedV   :   0,
     finalV  :   0,
     endV    :   0
     };*/
    function Item(anItemData) {
        var tItem = this;
        tItem.item_id = anItemData.item_id;
        tItem.item_name = anItemData.item_name;
        tItem.item_measure = anItemData.item_measure;

        tItem.setData = function(aData) {
            var changed = false;
            if (!!aData.start_value && tItem.startV !== aData.start_value) {
                tItem.startV = aData.start_value;
                changed = true;
            }
            if (!!aData.used_value && tItem.usedV !== aData.used_value) {
                tItem.usedV = aData.used_value;
                changed = true;
            }
            if (!!aData.end_value && tItem.endV !== aData.end_value) {
                tItem.endV = aData.end_value;
                changed = true;
            }
            if (!!aData.final_value && tItem.finalV !== aData.final_value) {
                tItem.finalV = aData.final_value;
                changed = true;
            }
            if (changed) {}
        };
    }

    self.setWarehouse = function(aWarehouse) {
        model.params.trade_point_id = aWarehouse;
    };

    self.setTradePoint = self.setWarehouse;

    self.setSession = function(aSession) {
        model.qWHSessionBalance.params.session_id = aSession;
        self.updateSessionData();
    };
    
    self.updateSessionData = function() {
        model.qWHSessionBalance.execute(function() {
            model.qWHSessionBalance.beforeFirst();
            while (model.qWHSessionBalance.next()) {
                items[model.qWHSessionBalance.cursor.item_id].setData(model.qWHSessionBalance.cursor);
            }
        });
    };
    
    self.getCurrentBalance = function(aWarehouse) {
        if (aWarehouse)
            self.setWarehouse(aWarehouse);
        model.queryOpenedSession.requery(function(){proceedLast();});
        model.qLastSessionOnTradePoint.requery(function(){proceedLast();});
        
        var pLEC = 0;
        function proceedLast() {
            pLEC++;
            if (model.queryOpenedSession.length > 0) {
                self.setSession(model.queryOpenedSession.cursor.org_session_id);
            } else if (pLEC === 2 && model.qLastSessionOnTradePoint.length > 0) {
                self.setSession(model.qLastSessionOnTradePoint.cursor.org_session_id);
            }
        }
    };

    function itemsByTPOnRequeried(evt) {//GEN-FIRST:event_itemsByTPOnRequeried
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()) {
            if (!items[model.itemsByTP.cursor.item_id])
                items[model.itemsByTP.cursor.item_id] = new Item(model.itemsByTP.cursor);
        }
    }//GEN-LAST:event_itemsByTPOnRequeried
}
