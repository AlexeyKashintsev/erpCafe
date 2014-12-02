/**
 * 
 * @author Work
 * @module 
 */
function AdditionalScreen() {
    var self = this, model = this.model;
    var cached = null;
    adPublicInterface = self;
    
    self.openWin = function (){
        MenuWindow = window.open("as_welcome.html","menu",'width=550,height=650');
    };
    
    self.cancelOrder = function (){
        if (checkWindow()){
            goWelcome();
        }
    };
    
    self.processCache = function() {
        if (cached) {
            MenuWindow.setOrder(cached[0], cached[1]);
            cached = null;
        }
    };
    
    self.updateOrder = function (order, orderSum){
        if (checkWindow()){
            if (MenuWindow.location.pathname !== "/erpCafe/as_order.html") {
                goOrder();
                cached = [order, orderSum];
            } else {
                MenuWindow.setOrder(order, orderSum);
            }
        }
    };
    
    function checkWindow(){
        try {
            return (!!MenuWindow);
        } catch (e) {
            return false;
        }
            
    }
    
    function goWelcome(){
            MenuWindow.location = "as_welcome.html";
    };
    
    function goOrder(){
            MenuWindow.location = "as_order.html";
    };
    
    
}
