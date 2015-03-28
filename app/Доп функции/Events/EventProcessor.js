/**
 * 
 * @name EventProcessor
 * @author Alexey
 * @module
 * TODO Почистить события
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
            if (model.eventTypes.findById(aEventType)) {
                var evt = JSON.stringify(aEventData); //BUG Ошибка при добавлении ошибки failure ;)
                model.eventById.push({
                    event_type  :   aEventType,
                    event_user  :   self.principal.name,
                    event_data  :   evt,
                    event_date  :   new Date()
                });
                model.save();
                Logger.warning(evt);
            } else {
                Logger.warning('Неизвестный event-type ' + aEventType + '\nevtData: ' + aEventData);
            }
        } catch (e) {
            model.revert();
            Logger.warning(e);
        }
    };
}
