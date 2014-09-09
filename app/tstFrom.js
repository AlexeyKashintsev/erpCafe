/**
 * 
 * @author Alexey
 */
function tstFrom() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    self.show = function() {
        form.show();
    };
    form.onWindowOpened = function(evt) {
        
    }
    form.button.onActionPerformed = function(event) {
        alert(P.principal.name);
        P.Logger.info(1);
    };

}
