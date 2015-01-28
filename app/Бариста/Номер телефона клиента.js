/**
 * 
 * @author Alexey
 */
function ClientPhoneSelector(aParent, aContainer) {
    var self = this, model = this.model, form = this;
    session.clientModule = new ServerModule("ClientServerModule");
    
    var client = false;
    var clientPane = null;
    var clientRegPane = null;
    var inpPhone = null;
    var clientReg = new ClientRegistrationByBarist();
    
    function clearClient() {
        client = false;
        inpPhone.value = "";
        checkIfClientPhoneExists();
    }
    
    function addClientToList(aClient){
        var clientPhoneDiv = cmn.getElement("div", '', clientPane, "clientPhoneDiv");
        var el = cmn.createElement("p", "list", clientPhoneDiv);
        el.innerHTML = aClient.phone + ' ' + aClient.firstName;
        el.phone = aClient.phone;
        el.onclick = function(){
            inpPhone.value = el.phone;
            checkIfClientPhoneExists();
        };
    }
    
    function checkIfClientPhoneExists() {
        clientPane.innerHTML = "";
        if (inpPhone.value !== "") {
            aParent.cashBackCalc.setBonusCount(0);
            $(".client-phone-reset").addClass("active");
            var response = session.clientModule.getClientsByFourDigits(inpPhone.value);
            if (response){
                $(inpPhone).removeClass("red");
                $(inpPhone).addClass("green");
                $(clientRegPane).hide();
                $(clientPane).show();
                if (response.length > 1){
                    for (var r in response){
                        new addClientToList(response[r]);
                    }
                } else {
                    inpPhone.value = response[0].phone;
                    client = response[0];
                    var clientPhoneDiv = cmn.getElement("div", '', clientPane, "clientPhoneDiv");
                    clientPhoneDiv.innerHTML = "Клиент: " + client.firstName;
                    var clientBonusDiv = cmn.getElement("div", '', clientPane, "clientBonusDiv");
                    clientBonusDiv.innerHTML = "На счету: <b>" + client.bonusCount + "</b> бонусов";
                    aParent.cashBackCalc.setBonusCount(client.bonusCount);
                }
             } else {
                 client = false;
                 $(inpPhone).removeClass("green");
                 $(inpPhone).addClass("red");
                 $(clientPane).hide();
                 $(clientRegPane).show();
                 clientRegPane.innerHTML = "Клиент не найден<br>";
                 var btnRegister = cmn.getElement("button", 'btnRegister', clientRegPane, "btnRegister");
                 btnRegister.innerHTML = "Зарегистрировать";
                 btnRegister.onclick = function() {
                     clientReg.setPhone(inpPhone.value);
                     clientReg.showModal(function(aPhone) {
                         if (inpPhone.value === aPhone) {
                             checkIfClientPhoneExists();
                         } else {
                             inpPhone.value = aPhone;
                         }
                     });
                 };
             }
         } else {
             $(".client-phone-reset").removeClass("active");
             $(inpPhone).removeClass("green");
             $(inpPhone).removeClass("red");
             $(clientPane).hide();
             $(clientRegPane).hide();
         }
    }

    function createClientSelectPane(aContainer) {
        var dockElement = cmn.createElement("div", 'baristaOrder panel panel-primary', aContainer);
        var clientLabel = cmn.createElement("h4", 'clientLabel', dockElement, 'clientLabel');
        clientLabel.innerHTML = "Введите номер телефона клиента";
        inpPhone = cmn.createElement("input", "client-phone-input", dockElement);
        inpPhone.onchange = checkIfClientPhoneExists;
        var btnDeletePhone = cmn.createElement("button", "client-phone-reset", dockElement);
        btnDeletePhone.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
        btnDeletePhone.onclick = clearClient;
        clientPane = cmn.createElement("div", 'clientInfo', dockElement, "clientPane");
        clientRegPane = cmn.createElement("div", 'clientInfo', dockElement, "clientRegPane");
        $(clientPane).hide();
        $(clientRegPane).hide();
    }
    
    self.show = function(aContainer) {
        createClientSelectPane(aContainer ? aContainer : "actionPanel");
    };
    
    self.getClient = function() {
        return client;
    };
    
    self.clearClient = function() {
        clearClient();
    };
    
    self.show(aContainer);
}
