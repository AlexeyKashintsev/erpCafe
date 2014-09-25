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
        var evt = JSON.stringify(aEventData);
        model.eventById.push({
            event_type  :   aEventType,
            event_user  :   self.principal.name,
            event_data  :   evt,
            event_date  :   new Date()
        });
        model.save();
        Logger.info(evt);
    };
}
