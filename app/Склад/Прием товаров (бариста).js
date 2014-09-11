/**
 * 
 * @author Алексей
 * @name GetItemsByBaristaForm
 * @public
 */

function WHSetAddMovement() {
    var MSG_SESSION_CLOSED_ERROR = "Сначала нужно открыть смену!";
    var MSG_SET_MOVEMENTS_ERROR  = "Произошла ошибка при добавлении товара!";

    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);

    var whSessionModule = new P.ServerModule("WhSessionModule");

    self.setTradePointId = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
        whSessionModule.setTradePoint(model.params.trade_point_id);
        model.params.session_id = whSessionModule.getCurrentSession();
    };

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        //form.btnCloseSession.enabled = true;
        if(!model.params.session_id) {
            alert(MSG_SESSION_CLOSED_ERROR);
            form.close();
        }
    };
    
    self.show = function() {
        form.show();
    };

    /*form.btnProceed.onActionPerformed = function(event) {
        var items = {};
        model.itemsByTP.beforeFirst();
        while(model.itemsByTP.next()){
            if(model.itemsByTP.cursor.start_value != null) {
                items[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.start_value;
            }
        }
        if (whSessionModule.whMovement(items, whSessionModule.WH_ADD_ITEMS)) 
           form.close();
        else
            alert(MSG_SET_MOVEMENTS_ERROR);
    };*/
}