/**
 * 
 * @author minya92
 */
function BuyItemsForm() {
    var self = this, model = this.model, form = this;
    var billItemsModule = new ServerModule("BillItemsModule");
    var userSession = new ServerModule("UserSession");
    var list = null;
    var details = null;
    
     function createBill() {
        $('#order_details').hide();
	$('#thank_you').show();
        var billItems = list.getItems();
        var billDetails = details.getDetails();
        var billCreator = new Report('DetailedBill');
        //var bd = units.billApi.getSupplierDetails();
        for (var j in billDetails) {
            bd[j] = billDetails[j];
        }
        bd.billDate = new Date();
        bd.sum = list.getSum();
        bd.itemsNo = billItems.length;
        
        billCreator.bd = [bd];
        billCreator.billItems = billItems;
        try {
            billCreator.show();
        } catch (e) {
            Logger.warning(e);
        }
        //units.billApi.sendMessages(null, billDetails, billItems, bd.sum);
    }
    
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
        var AccountTypes = {
            1 : "Основной",
            2 : "Кредитный",
            3 : "Клиентский"
        };//Зачем захардкожено?
        model.qBillAccount.params.user_id = userSession.getFranchazi();
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
        $('.Items').hide();//TODO а так нельзя $('.Items', '#nextButton').hide(); ? )))
        $('#nextButton').hide();
        $("#prevButton").show();
        $("#doneButton").show();
        $('.Bills').html('');
        ListBills(document.getElementById("Bills"));
        $('.Bills').show();
    }
    
    function prevButtonClick() {
        $('.Items').show();
        $('#nextButton').show();
        $("#prevButton").hide();
        $("#doneButton").hide();
        $('.Bills').hide();
    }
    
    function doneButtonClick() {
        var account_id = $('input[name=bill_radio]:checked').val();
        var currnt_sum = $('input[name=bill_radio]:checked').attr('id');
        if(account_id){
            if(currnt_sum >= sum){
                
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
        $('.Bills').hide();
        var Items = document.getElementById("Items");
        list = new List(Items);
        cmn.createElement("div", "selection_result", aContainer);
        cmn.createElement("button", "next", aContainer, "nextButton");
        cmn.createElement("button", "prev", aContainer, "prevButton");
        cmn.createElement("button", "done", aContainer, "doneButton");
        $("#nextButton").html("Далее");
        $("#prevButton").html("Назад");
        $("#doneButton").html("Оплатить");
        $("#prevButton").hide();
        $("#doneButton").hide();
        $('.selection_result').html("Всего выбрано позиций <span class='positions_count'>0</span> на сумму <span class='bill_sum'>0 рублей</span><br>");
        document.getElementById('nextButton').onclick = nextButtonClick;
        document.getElementById('prevButton').onclick = prevButtonClick;
        document.getElementById('doneButton').onclick = doneButtonClick;
        //details = new Details();
    };
    
    
}
