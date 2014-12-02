/**
 * 
 * @author Alexey
 */
function CashBackCalculator(aParent) {
    var self = this, model = this.model, form = this;
    var cashBackSum = 0;
    var purchaseSum = 0;
    var prevSum = 0;
    var bonusCount = 0;
    var canSell = false;
    var btnsSumEnabled = true;
    self.shown = false;
    
    var container = cmn.createElement('div', 'cash_calculator', 'mainArea');
    $( ".cash_calculator" ).disableSelection();
    
    
    var cashback, cash, paymentMethodDiv, PayBtn;
    function render() {
        var topHead = cmn.createElement('div', 'top_head', container);
        cmn.createElement('div', 'label money_get', topHead).innerHTML = 'получено';
        cmn.createElement('div', 'label cashback', topHead).innerHTML = 'сдача';
        cashback = cmn.createElement('div', 'cash cash_back', topHead);
        cash = cmn.createElement('div', 'cash', topHead);
        var topHeadGlass = cmn.createElement('div', 'top_head glass', container);
        var btnContainer = cmn.createElement('div', 'button_area', container);
        paymentMethodDiv = cmn.createElement('div', 'btn_block', btnContainer);
        var manualSumInput = cmn.createElement('div', 'btn_block manual', btnContainer);
        
        for (var j = 1; j<10; j++) {
            createButton('calc_button', manualSumInput, j, j);
        }
        createButton('calc_button', manualSumInput, 0, 0);
        createButton('calc_button backspace', manualSumInput, 'C', 'C','Удалить последний символ');
        createButton('calc_button clear', manualSumInput, 'CE', 'CE', 'Очистить');

        var preDefinedSums = [10, 50, 100, 500, 1000, 5000]; var pdBtns = [];
        var predefInput = cmn.createElement('div', 'btn_block predefined', btnContainer);
        for (var j in preDefinedSums) {
            createButton('calc_button', predefInput, preDefinedSums[j], preDefinedSums[j]);
        }
        PayBtn = createButton('calc_button calc', predefInput, 'Оплатить', 'Оплата', 'Оплатить');
    }
    render();
    
    self.show = function() {
        $('.calc').removeClass('disabled');
        $( ".cash_calculator" ).show();
        canSell = true;
        self.shown = true;
    };
    
    self.hide = function() {
        cashBackSum = 0;
        purchaseSum = 0;
        prevSum = 0;
        bonusCount = 0;
        cash.innerHTML = '0';
        canSell = false;
        selectedMethod = 0;
        spmBtnGrp.setActiveButton(selectedMethod);
        self.shown = false;
        $( ".cash_calculator" ).hide();
    };
    
    var selectedMethod = 0;
    var spmBtnGrp = null;
    function selectPaymentMethod(aMethod) {
        selectedMethod = parseInt(aMethod);
        calculateCashBack();
    }
    
    function sellAllowed(anAllowed) {
        canSell = anAllowed;
        if (canSell)
            $('.calc').removeClass('disabled');
        else
            $('.calc').addClass('disabled');
    }
    
    function disableButtons() {
        $('.btn_block.manual').addClass('disabled');
        $('.btn_block.predefined').addClass('disabled');
        btnsSumEnabled = false;
    }
    
    function enableButtons() {
        $('.btn_block.manual').removeClass('disabled');
        $('.btn_block.predefined').removeClass('disabled');
        btnsSumEnabled = true;
    }
    
    model.tradeOperationTypes.params.only_input = true;
    
    function calculateCashBack() {
        switch (selectedMethod) {
            case 0: {
                var inpSum = prevSum !== 0 ? prevSum : cash.innerHTML;
                cashBackSum = inpSum - purchaseSum;
                if (cashBackSum >= 0 && purchaseSum > 0) {
                    sellAllowed(true);
                    cashback.innerHTML = cashBackSum;
                } else {
                    cashback.innerHTML = 0;
                    sellAllowed(false);
                }
                enableButtons();
                break;
            }
            case 1: {
                    var enougthBonuses = (bonusCount >= purchaseSum);
                    disableButtons();
                    sellAllowed(enougthBonuses);
                    if (!enougthBonuses) {
                        cashback.innerHTML = "Не хватает бонусов!";
                        cash.innerHTML = "";
                    } else {
                        cashback.innerHTML = "К списанию бонусов:";
                        cash.innerHTML = purchaseSum;
                    }
                    break;
            }
            case 10: {
                    sellAllowed(true);
                    disableButtons();
                    cashback.innerHTML = "Платеж картой";
                    cash.innerHTML = purchaseSum;
                    break;
            }
        }
    }
    
    function buttonClick(aSum) {
        if ( cash.innerHTML === '0')
             cash.innerHTML = '';
        
        if (btnsSumEnabled)
            switch (true) {
                case aSum < 10: {
                    cash.innerHTML += aSum;
                    prevSum = 0;
                    break;
                }
                case aSum >= 10: {
                    prevSum += aSum;
                    cash.innerHTML = prevSum;
                    break;
                }
                case (aSum === 'C' || aSum === 'CE'): {
                    cash.innerHTML = '0';
                    prevSum = 0;
                    break;
                };
            }
        if (aSum === 'Оплата') {
                if (!$('.calc').hasClass('disabled'))
                    aParent.orderList.acceptOrder();
            }
        calculateCashBack();
    }
    
    function createButton(aClass, aContainer, aText, aValue, aTitle) {
        var btn = cmn.createElement("div", aClass, aContainer);
        btn.innerHTML = aText;
        btn.value = aValue;
        if (!!aTitle) btn.title = aTitle;
        btn.onclick = function() {
            buttonClick(this.value);
        };
    }    

    function tradeOperationTypesOnRequeried(evt) {//GEN-FIRST:event_tradeOperationTypesOnRequeried
        model.tradeOperationTypes.beforeFirst();
        var buttons = [];
        while (model.tradeOperationTypes.next()) {
            buttons[model.tradeOperationTypes.cursor.trade_cash_box_operation_types_id] = {};
            buttons[model.tradeOperationTypes.cursor.trade_cash_box_operation_types_id].d_name =
                buttons[model.tradeOperationTypes.cursor.trade_cash_box_operation_types_id].d_name =
                    model.tradeOperationTypes.cursor.type_name;
        }
        buttons[0].active = true;
        spmBtnGrp = new cmn.ButtonGroup(buttons, paymentMethodDiv, 'btn btn-info payType',
                                        selectPaymentMethod, 'btn-group-vertical btn-group-md');
        self.hide();
    }//GEN-LAST:event_tradeOperationTypesOnRequeried

    self.setBonusCount = function(aBonuses) {
        bonusCount = aBonuses;
        calculateCashBack();
    };

    self.setPurchaseSum = function(aSum) {
        purchaseSum = aSum;
        calculateCashBack();
    };

    self.getPaymentMethod = function() {
        return canSell ? {
            paymentMethod   :   selectedMethod,
            additionalBonus :   0
        } : false;
    };
}
