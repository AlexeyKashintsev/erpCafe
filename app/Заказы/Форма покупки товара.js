/**
 * 
 * @author minya92
 */
function BuyItemsForm() {
    var self = this, model = this.model, form = this;
    var billItemsModule = new ServerModule("BillItemsModule");
    var userSession = new ServerModule("UserSession");

    var list = null;  
    var sum;
    
    function List(aContainer) {
        var listItems = billItemsModule.getItemsForBill();
        sum = 0;
        listItems.forEach(addItemToList);
 
        function addItemToList(anItem, anItemindex) {
            anItemindex = anItemindex ? anItemindex : 0;
            var newItem = '<div id="listItem' + anItemindex + '" class="listItem"></div>';
            $(aContainer).append(newItem);
            var itemForm = new ItemDetails(anItem.pName, anItem.pDef, anItem.pCost, 0, anItemindex);
            itemForm.setQuantity = setItemsQuantity;
            itemForm.showOnPanel("listItem" + anItemindex);
        }
        //
        function setItemsQuantity(aId, aQuantity) {
            if (listItems[aId].quantity !== aQuantity) {
                listItems[aId].quantity = aQuantity;
                recalc();
            }
        }
        function recalc() {
            var ic = 0;
            var is = 0;
            for (var j in listItems) {
                if (listItems[j].quantity) {
                    ic++;
                    is += listItems[j].quantity * listItems[j].pCost;
                }
            }
            sum = is;
            $('.positions_count').html(ic);
            $('.bill_sum').html(sum + ' рублей');
            if (ic) {
                if (!$('.next').hasClass('active')) {
                    $('.next').addClass('active');
                    document.getElementById('nextButton').onclick = nextButtonClick;
                }
            } else if ($('.next').hasClass('active')) {
                $('.next').removeClass('active');
                document.getElementById('nextButton').onclick = null;
            }
        }
        this.getItems = function() {
            var res = [];
            for (var j in listItems)
                if (listItems[j].quantity) {
                    res.push({
                        num: (res.length + 1),
                        itemName: listItems[j].pName,
                        desc: listItems[j].pDef,
                        count: listItems[j].quantity,
                        cost: listItems[j].pCost,
                        itemId: listItems[j].pItemId,
                        sum: listItems[j].pCost * listItems[j].quantity
                    });
                }
            return res;
        };
        this.getSum = function() {
            return sum;
        };
    }
    
    function ListBills(aContainer){
        var AccountTypes = { };
        model.qAccountType.beforeFirst();
        while(model.qAccountType.next()){
            AccountTypes[model.qAccountType.cursor.bill_account_types_id] = model.qAccountType.cursor.type_name;
        }
        model.qBillAccount.params.franchazi_id = userSession.getFranchazi();
        model.qBillAccount.requery(function(){
            model.qBillAccount.beforeFirst();
            var i = 1, selected = '';
            while(model.qBillAccount.next()){
                if(i === 1) selected = 'checked'; else selected = '';
                cmn.createElement("div", "bill"+i, aContainer);
                $(".bill"+i).html('<p><input type="radio" \n\
                     name="bill_radio" id="'+model.qBillAccount.cursor.currnt_sum+'"\n\
                     value="'+ model.qBillAccount.cursor.bill_accounts_id +'" '+selected+'>'
                        +AccountTypes[model.qBillAccount.cursor.account_type]+
                        '   '+model.qBillAccount.cursor.currnt_sum+' руб.</p>');
                i++;
            }
        });
    }
    
    function nextButtonClick() {
        $('.Items, #nextButton').hide();
        $("#prevButton, #doneButton, .Bills").show();
        $('.Bills').html('');
        ListBills(document.getElementById("Bills"));
       // $("#yandexModal").modal('show');
    }
    
    function prevButtonClick() {
        $(".Items, #nextButton").show();
        $("#prevButton, #doneButton, .Bills").hide();
    }
    
    function homeButtonClick() {
        list = null;
        $(".Items").html(" ");
        list = new List(document.getElementById("Items"));
        $(".Items, #nextButton, .selection_result").show();
        $("#prevButton, #doneButton, #homeButton, .Bills, .Thanks").hide();
    }
    
    function doneButtonClick() {
        var account_id = $('input[name=bill_radio]:checked').val();
        var currnt_sum = $('input[name=bill_radio]:checked').attr('id');
        var operation_id = billItemsModule.createOperation(list.getItems(),account_id);
        if(account_id){
            if(currnt_sum >= sum){
                billItemsModule.buyItems(operation_id);
                $(".Thanks").html("<p>Спасибо за заказ!</p>");
                $("#prevButton, #doneButton, .Bills, .Items, .selection_result").hide();
                $("#homeButton, .Thanks").show();
                
            } else {
                if(confirm("У Вас недостаточно денег!\nПерейти к странице пополнения баланса?")){
                    var addBalance = new AddBalance(account_id);
                    addBalance.showModal(function(){});
                }
            }
        } 
        else alert("Вы ничего не выбрали!"); 
    }
    
    self.manualShow = function(aContainer) {
        cmn.createElement("div", "Items", aContainer, "Items");
        cmn.createElement("div", "Bills", aContainer, "Bills");
        cmn.createElement("div", "Thanks", aContainer, "Thanks");
        var Items = document.getElementById("Items");
        list = new List(Items);
        cmn.createElement("div", "selection_result", aContainer);
        cmn.createElement("button", "next", aContainer, "nextButton");
        cmn.createElement("button", "prev", aContainer, "prevButton");
        cmn.createElement("button", "done", aContainer, "doneButton");
        cmn.createElement("button", "home", aContainer, "homeButton");
        $("#nextButton").html("Далее");
        $("#prevButton").html("Назад");
        $("#doneButton").html("Оплатить");
        $("#homeButton").html("Завершить");
        $('#prevButton , #doneButton, #homeButton, .Bills, .Thanks').hide();
        $('.selection_result').html("Всего выбрано позиций <span class='positions_count'>0</span> на сумму <span class='bill_sum'>0 рублей</span><br>");
        document.getElementById('nextButton').onclick = nextButtonClick;
        document.getElementById('prevButton').onclick = prevButtonClick;
        document.getElementById('doneButton').onclick = doneButtonClick;
        document.getElementById('homeButton').onclick = homeButtonClick;
        
        //Yandex Form Modal
        cmn.createElement("div", "yandex", aContainer, "yandex");
        $("#yandex").html('<div class="modal fade" id="yandexModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                                '<div class="modal-dialog">'+
                                 ' <div class="modal-content">'+
                                    '<div class="modal-header">'+
                                      '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
                                      '<h4 class="modal-title" id="myModalLabel">Modal title</h4>'+
                                    '</div>'+
                                    '<div class="modal-body">'+
                                     ' ... '+
                                   ' </div>'+
                                    '<div class="modal-footer">'+
                                      '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                                      '<button type="button" class="btn btn-primary">Save changes</button>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'
        );
    };
}
