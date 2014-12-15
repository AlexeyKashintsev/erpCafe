/**
 * 
 * @author Work
 * @public
 * @module 
 */
function uploadModule() {
    var self = this, model = this.model;
    
    self.uploadFile = function(aFile){
        upload(function(info){
            Logger.info(info);
        })
    };
}
