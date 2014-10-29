/**
 * 
 * @author minya92
 */
function YandexMoneyForm() {
    var self = this, model = this.model, form = this;
    var userSession = new ServerModule("UserSession");
    var сontainer = null;
    
    self.manualShow = function(aContainer) {
        сontainer = aContainer;
        cmn.createElement("div", "YandexForm", сontainer, "YandexForm");
        var YandexForm = document.getElementById("YandexForm");
        $("#YandexForm").html("<form action='https://money.yandex.ru/eshop.xml' method='post'> ");
        $("#YandexForm").html("<form action='https://money.yandex.ru/eshop.xml' method='post'> ");
        cmn.createElement("form", "Bills", сontainer, "Bills");
        cmn.createElement("div", "Thanks", сontainer, "Thanks");
        var Items = document.getElementById("Items");
        list = new List(Items);
        cmn.createElement("div", "selection_result", сontainer);
        cmn.createElement("button", "next", сontainer, "nextButton");
        cmn.createElement("button", "prev", сontainer, "prevButton");
        cmn.createElement("button", "done", сontainer, "doneButton");
        cmn.createElement("button", "home", сontainer, "homeButton");
        $("#nextButton").html("Далее");
        $('#prevButton , #doneButton, #homeButton, .Bills, .Thanks').hide();
        document.getElementById('nextButton').onclick = nextButtonClick;

    };
}
