/**
 * Do not edit this file manualy, it will be overwritten by Platypus Application Designer.
 */
(function() {
     // this === global;
    var global = window;
    if(!global.P){
        var oldP = global.P;
        global.P = {};
        global.P.restore = function() {
            var ns = global.P;
            global.P = oldP;
            return ns;
        };
         //global.P = this; // global scope of api - for legacy applications
         //global.P.restore = function() {
         //throw 'Legacy API can not restore the global namespace.';
         //};
    }
})();
window.P.ready = function() {
    window.P.require(['tstFrom'], function(){
        var f = new tstFrom();
        f.show();
    });
};
