/**
 * 
 * @author Work
 */
function ClientStartForm() {
    var self = this, model = this.model, form = this;
      
    self.actionList = {
        common   :   {
            display     :   "Общая информация",
            dispForm    :   "clientDesktop"
        },
        blabla  :   {
            display     :   "Настройка СМС",
            dispForm    :   "messengerSettings"
        }
    };
    
   
    self.actionListDisplay = new cmn.ActionList(self.actionList, document.getElementById("actionPanel"));
    cmn.addTopRightControl("Выход", "log-out", logout);

}
