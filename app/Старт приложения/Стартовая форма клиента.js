/**
 * 
 * @author Work
 */
function ClientStartForm() {
    var self = this, model = this.model, form = this;
    
    //Определяем как запущена программа
    self.browser = null;
    try {
        (function(){
            self.browser = false;
            self.session.login();
        }).invokeBackground();
    } catch (e) {
        Logger.info('browser');
        self.browser = true;
    }
    
    self.actionList = {
        common   :   {
            display     :   "Общая информация",
            dispForm    :   "clientDesktop"
        }
    };
    
    if (self.browser) {
        self.actionListDisplay = new cmn.ActionList(self.actionList, document.getElementById("actionPanel"));
        cmn.addTopRightControl("Выход", "log-out", logout);
    }
}
