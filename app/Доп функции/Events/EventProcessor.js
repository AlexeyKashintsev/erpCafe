/**
 * 
 * @name EventProcessor
 * @author Alexey
 * @module
 */ 
function EventProcessor() {
    var self = this, model = this.model;
    
    function success(aEventType, aEventData) {
        
    }
    
    function failure(aEvt, aEventType, aEventData) {
        self.addEvent('Error', {
            event_type  :   aEventType,
            event_data  :   aEventData,
            error       :   aEvt
        });
    }
    
    self.addEvent = function(aEventType, aEventData){
        try {
            var evt = JSON.stringify(aEventData); //BUG Ошибка при добавлении ошибки failure ;)
            model.eventById.push({
                event_type  :   aEventType,
                event_user  :   self.principal.name,
                event_data  :   evt,
                event_date  :   new Date()
            });
            model.save();
            Logger.info(evt);
        } catch (e) {
            model.revert();
          //  failure(e, aEventType, aEventData);
            Logger.warning(e);
        }
    };
}
