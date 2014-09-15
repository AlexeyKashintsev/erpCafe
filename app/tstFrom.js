/**
 * 
 * @author Alexey
 */
function tstFrom() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
 //   var a = new P.ServerModule('testServM');
 //   var billItems = new BillItems();
    
 //   a.login();
    
 //   alert(P.principal.name);
    
 //   P.Logger.info();
    
    self.show = function() {
        form.show();
    };
    
    self.showOn = function() {
        form.showOn();
    };
    
    self.getView = function(){
      return form.view;  
    };
    
    form.button.onActionPerformed = function(event) {
        var b = new P.DesktopPane();
        b.set_height = "200px";
        b.width = 200;
        b.showOn("test_div");
        var c = new t1();
        //c.form.undecorated = true;
        var v = c.form.getView();
        //b.add(c.form, new P.Anchors(0, '500px', null, 0, '500px', null));
        c.form.showInternalFrame(b);
    };
}
