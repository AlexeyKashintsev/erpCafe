/**
 * 
 * @author Alexey
 * @module
 */ 
function mSessionData() {
    var self = this, model = this.model;
    
    self.show = function(aSessionId) {
        model.params.session_id = aSessionId;
        $('#modalForm').modal('toggle');
    };
}
