/**
 * 
 * @author Alexey
 */
function tstFrom() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    var a = new P.ServerModule('UserSession');
    
    a.login();
    
    alert(P.principal.name);
    
    P.Logger.info();
    
    self.show = function() {
        form.show();
    };
    
}
