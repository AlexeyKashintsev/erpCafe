/**
 * 
 * @name EventProcessor
 * @author Alexey
 * @module
 */ 
function EventProcessor() {
    var self = this, model = P.loadModel(this.constructor.name);
    
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
        model.eventById.push({
            event_type  :   aEventType,
            event_user  :   P.principal.name,
            event_data  :   JSON.stringify(aEventData),
            event_date  :   new Date()
        });
        model.save();
    };
}
