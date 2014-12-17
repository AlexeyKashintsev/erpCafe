/**
 * 
 * @author Work
 * @public
 * @module 
 */
function UploadModule() {
    var self = this, model = this.model;
    
    
    self.uploadFile = function(aFile){
        aFile.upload(function(info){
            Logger.info(info);
        });
    };
}
