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

    if (!units.whSession)
        units.whSession = new P.ServerModule("WhSessionModule");

    self.setTradePointId = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
        //units.whSession.setTradePoint(model.params.trade_point_id);
        //model.params.session_id = units.whSession.getCurrentSession();
    };

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.session_id = 
        units.whSession.getCurrentSession(function(aSession){
            if (!aSession) {
                alert(MSG_SESSION_CLOSED_ERROR);
                form.close();
            } else {
                model.params.session_id = aSession;
                units.whSession.getTradePoint(function(aTP){
                    self.setTradePointId(aTP);
                });
            }
        });
    };
    
    self.show = function() {
        form.show();
    };

    form.btnSave.onActionPerformed = function(event) {
        var items = {};
        model.itemsByTP.beforeFirst();
        while(model.itemsByTP.next()){
            if(model.itemsByTP.cursor.start_value != null) {
                items[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.start_value;
            }
        }
        if (units.whSession.whMovement(items, units.whSession.WH_ADD_ITEMS)) 
           form.close();
        else
            alert(MSG_SET_MOVEMENTS_ERROR);
    };
}