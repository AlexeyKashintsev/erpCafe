/**
 * 
 * @author Alexey
 */
function t1() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    self.form = form;
    
    form.
    
    self.show = function() {
        form.show();
    };
    
    model.requery(/*function(){}*/);
    
    
}
