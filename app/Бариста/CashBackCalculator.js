/**
 * 
 * @author Alexey
 */
function CashBackCalculator() {
    var self = this, model = this.model, form = this;
    
    var container = cmn.createElement('div', 'cash_calculator', 'mainArea');
    
    var topHead = cmn.createElement('div', 'top_head', container);
    cmn.createElement('div', 'label money_get', topHead).innerHTML = 'получено';
    cmn.createElement('div', 'label cashback', topHead).innerHTML = 'сдача';
    var cashback = cmn.createElement('div', 'cash cash_back', topHead);
    var cash = cmn.createElement('div', 'cash', topHead);
    var topHeadGlass = cmn.createElement('div', 'top_head glass', container);
    
    var selectedMethod = 0;
    var spmBtnGrp = null;
    function selectPaymentMethod(aMethod) {
        selectedMethod = aMethod;
    }
    
    var paymentMethodDiv = cmn.createElement('div', 'btn_block', container);
    model.tradeOperationTypes.params.only_input = true;
    
    function preDefClick(aSum) {
        if (aSum < 10)
            cash.innerHTML += aSum;
        else 
            if (aSum == 'C' || aSum == 'CE')
                cash.innerHTML = '';
        else
            cash.innerHTML = aSum;
    }
    
    function createButton(aClass, aContainer, aText, aValue, aTitle) {
        var btn = cmn.createElement("div", aClass, aContainer);
        btn.innerHTML = aText;
        btn.value = aValue;
        if (!!aTitle) btn.title = aTitle;
        btn.onclick = function() {
            preDefClick(this.value);
        };
    }
    
    var manualSumInput = cmn.createElement('div', 'btn_block manual', container);
    for (var j = 1; j<10; j++) {
        createButton('calc_button', manualSumInput, j, j);
    }
    createButton('calc_button', manualSumInput, 0, 0);
    createButton('calc_button backspace', manualSumInput, 'C', 'C','Удалить последний символ');
    createButton('calc_button clear', manualSumInput, 'CE', 'CE', 'Очистить');
    
    var preDefinedSums = [50, 100, 500, 1000, 5000]; var pdBtns = [];
    var predefInput = cmn.createElement('div', 'btn_block predefined', container);
    for (var j in preDefinedSums) {
        createButton('calc_button', predefInput, preDefinedSums[j], preDefinedSums[j]);
    }
    createButton('calc_button calc', predefInput, '=', '=', 'Посчитать');
    $('.calc').hide();
    

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
}
