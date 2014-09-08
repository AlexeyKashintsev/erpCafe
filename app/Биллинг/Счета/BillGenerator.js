3/**
 * @name BillGenerator
 * @author Alexey
 * @public
 */
function BillGenerator() {
    var self = this, model = P.loadModel(this.constructor.name);

    units.billApi = new ServerModule('BillApi');
    function createBill() {
        $('#order_details').hide();
	$('#thank_you').show();
        var billItems = list.getItems();
        var billDetails = details.getDetails();
        var billCreator = new Report('DetailedBill');
        var bd = units.billApi.getSupplierDetails();
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
        units.billApi.sendMessages(null, billDetails, billItems, bd.sum);
    }

    function List() {
        var listItems = units.billApi.getItemsForBill();
        var sum = 0;
        listItems.forEach(addItemToList);
            
        function addItemToList(anItem, anItemindex) {
            anItemindex = anItemindex ? anItemindex : 0;
            var newItem = '<div id="listItem' + anItemindex + '" class="listItem"></div>';
            $('.items_4add').append(newItem);
            var itemForm = new ItemDetails(anItem.pName, anItem.pDef, anItem.pCost, 0, anItemindex);
            itemForm.setQuantity = setItemsQuantity;
            itemForm.showOnPanel("listItem" + anItemindex);
        }

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

    function Details() {
        var questions = units.billApi.getAskedFields();
        questions.forEach(addQuestion);

        function addQuestion(aQuestion, aId) {
            $('.questions').append('<div id="' + aQuestion.name + aId + '" class = "question"></div>');
            $('#' + aQuestion.name + aId).append('<div><span>' + aQuestion.text + '</span></div><div><input id = "' + aQuestion.name + '" class = "question"></div>');
            document.getElementById(aQuestion.name).onchange = validate;
        }

        function validate() {
            var ok = true;
            for (var j in questions) {
                try {
                    var val = document.getElementById(questions[j].name).value;
                    if (!val) {
                        if (questions[j].requied)
                            ok = false;
                        questions[j].value = '';
                    } else {
                        questions[j].value = val;
                    }
                } catch (e) {
                    ok = false;
                }
            }
            if (ok) {
                if (!$('.formBill').hasClass('active')) {
                    $('.formBill').addClass('active');
                    document.getElementById('getBillButton').onclick = createBill;
                }
            } else if ($('.formBill').hasClass('active')) {
                $('.formBill').removeClass('active');
                document.getElementById('getBillButton').onclick = null;
            }
        }
        
        this.getDetails = function() {
            var res = {};
            for (var j in questions)
                res[questions[j].name] = questions[j].value;
            return res;
        };
    }
    
    var list = new List();
    var details = new Details();
}
