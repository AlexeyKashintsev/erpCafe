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
        var clientListDiv = cmn.getElement("ul", "clientListDiv", clientPane, '');
        var el = cmn.createElement("li", "list", clientListDiv);
        el.innerHTML = '<span>' + aClient.phone + ' ' + aClient.firstName + '</span><span class="right-span">' + aClient.city + '</span>';
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
        wf.ClientPhoneSelector.bind(self)(aContainer);
        var clientLabel = cmn.createElement("h4", 'clientLabel', self.dockElement, 'clientLabel');
        clientLabel.innerHTML = "Введите номер телефона клиента";
        inpPhone = cmn.createElement("input", "client-phone-input", self.dockElement);
        inpPhone.onchange = checkIfClientPhoneExists;
        var btnDeletePhone = cmn.createElement("button", "client-phone-reset", self.dockElement);
        btnDeletePhone.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
        btnDeletePhone.onclick = clearClient;
        clientPane = cmn.createElement("div", 'clientInfo', self.dockElement, "clientPane");
        clientRegPane = cmn.createElement("div", 'clientInfo', self.dockElement, "clientRegPane");
        $(clientPane).hide();
        $(clientRegPane).hide();
    }
    
    self.show = function(aContainer) {
        if (!self.dockElement)
            createClientSelectPane(aContainer ? aContainer : "actionPanel");
        else
            $(self.dockElement).show();
    };
    
    self.hide = $(self.dockElement).hide;
    
    self.getClient = function() {
        return client;
    };
    
    self.clearClient = function() {
        clearClient();
    };
    
    self.show(aContainer);
}
