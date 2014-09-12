/**
 * 
 * @author Alexey
 */
function tstFrom() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    var a = new P.ServerModule('testServM');
    var billItems = new BillItems();
    
    a.login();
    
 //   alert(P.principal.name);
    
 //   P.Logger.info();
    
    self.show = function() {
        form.show();
    };
    
    form.button.onActionPerformed = function(event) {
        var d = {a  : 10, b : 'aaa'};
        a.test(d);
        billItems.showModal(function(){});
    };
}
