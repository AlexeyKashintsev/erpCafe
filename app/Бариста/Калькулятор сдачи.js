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
    };
    
    self.hide = function() {
        cashBackSum = 0;
        purchaseSum = 0;
        prevSum = 0;
        bonusCount = 0;
        $( ".cash_calculator" ).hide();
    };
    self.hide();
    
    var selectedMethod = 0;
    var spmBtnGrp = null;
    function selectPaymentMethod(aMethod) {
        selectedMethod = aMethod;
    }
    
    model.tradeOperationTypes.params.only_input = true;
    
    function calculateCashBack() {
        var inpSum = prevSum !== 0 ? prevSum : cash.innerHTML;
        cashBackSum = inpSum - purchaseSum;
        if (cashBackSum > 0) {
            $('.calc').removeClass('disabled');
            cashback.innerHTML = cashBackSum;
        } else {
            $('.calc').addClass('disabled');
            cashback.innerHTML = 0;
        }
    }
    
    function buttonClick(aSum) {
        if ( cash.innerHTML === '0')
             cash.innerHTML = '';
         
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
            }
            case (aSum === 'Оплата') : {
                if (!$('.calc').hasClass('disabled'))
                    aParent.orderList.acceptOrder();
            }
        };
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
    }//GEN-LAST:event_tradeOperationTypesOnRequeried

    self.setBonusCount = function(aBonuses) {
        
    };

    self.setPurchaseSum = function(aSum) {
        purchaseSum = aSum;
    };

    self.getPaymentMethod = function() {
        return {
            paymentMethod   :   selectedMethod,
            additionalBonus :   0
        };
    };
}
