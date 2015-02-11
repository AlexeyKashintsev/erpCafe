var wf = {};

wf.proto = function() {
    this.dockElement = cmn.createElement(this.elType, this.elClass, this.container, this.ID);
    this.hide = (function(){$(this.dockElement).hide()}).bind(this);
    this.show = (function(){$(this.dockElement).show()}).bind(this);
    this.destroy = (function() {
        
    })
}

wf.OrderListPane = function(aContainer) {
    this.elType = "div";
    this.elClass = "baristaOrder panel panel-primary";
    this.container = aContainer;
    
    wf.proto.bind(this)();

    var oPanel = cmn.createElement("div", "", this.dockElement);
    oPanel.innerHTML =
            "\
            <div class='panel-heading'>\
                <h3 class='panel-title'>Заказ</h3>\n\
            </div>";

    this.oliContainer = cmn.createElement("div", "", oPanel, 'orderItems');//document.getElementById('orderItems');
    var oDetails = cmn.createElement("div", "panel-body", oPanel, 'orderDetails');
    var ordSum = cmn.createElement("div", "", oDetails, 'orderSum');

    var btnCancel = cmn.createElement("button", "btnCancel", this.dockElement);
    btnCancel.innerHTML = 'Отменить';
    btnCancel.onclick = this.deleteOrder;//aDeleteOrder;

    var btnAcceptOrder = cmn.createElement("button", "btnOk", this.dockElement);
    btnAcceptOrder.innerHTML = 'Оплатить';
    btnAcceptOrder.onclick = this.acceptOrder;//anAcceptOrder;

    this.updateOrderSum = function(aOrdSum) {
        ordSum.innerHTML = '<h3>Итого: <b>' + aOrdSum + '</b> рублей</h3>';
    };

    this.updateOrderSum(0);
}
    /**
     * 
     * @param {type} aObject
     * @param {type} aContainer
     * @returns {undefined}
     */
wf.OrderItem = function(aObject, aContainer) {
    var container = aContainer ? aContainer : orderList.oliContainer;
    var divEl = cmn.createElement("div", "orderItem", container);
    var itemName = cmn.createElement("h4", "itemName", divEl);
    var itemCount = cmn.createElement("h4", "itemCount", divEl);

    var btnRemove = cmn.createElement("button", "removeBtn", divEl);
    btnRemove.innerHTML = '<span class="glyphicon glyphicon-minus"></span>';
    btnRemove.className = "removeBtn";

    var btnDelete = cmn.createElement("button", "deleteBtn", divEl);
    btnDelete.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';

    this.updateText = this.show = function() {
        itemName.innerHTML = aObject.itemName;
        itemCount.innerHTML = aObject.orderQuantity + ' шт. ' + aObject.orderSum + " р.";
    };

    this.stop = false;

    this.delete = function() {
        container.removeChild(divEl);
    };

    divEl.onclick = function() {
        if (!this.stop)
            aObject.increase();
        else
            this.stop = false;
    };

    btnRemove.onclick = function() {
        aObject.decrease();
        this.stop = true;
    };

    btnDelete.onclick = aObject.delete;

    this.show();
};

wf.TradeItem = function(aContainer) {
    this.elType = "div";
    this.elClass = "Sortable itemDescription tt_" + this.data.trade_item_type_id;
    this.container = aContainer;
    this.ID = "ti_" + this.data.item_id;
    
    wf.proto.bind(this)();
    var itemContainer = this.dockElement;
    
    var itemPanel = cmn.createElement("div", "panel panel-primary " + (this.data.color ? " color " + this.data.color : ""), itemContainer);
    
    var itemContent = cmn.createElement("div", "panel-body", itemPanel);
    var itemDesc = cmn.createElement("h3", "itemDesc", itemContent);
    var itemCost = cmn.createElement("h1", "itemCost", itemContent);
    this.setDisplayedPrice = function(aPrice) {
        itemCost.innerHTML = aPrice;
    };
    
    
    itemDesc.innerHTML = this.data.item_name;
    
    itemPanel.onclick = this.click;
};

wf.TradeItemAdd = function(aContainer) {
    this.elType = "div";
    this.elClass = "itemDescription add-trade-item";
    this.container = aContainer;
    
    wf.proto.bind(this)();

    var itemPanel = cmn.createElement("div", "panel panel-primary", this.dockElement);
    var itemContent = cmn.createElement("div", "panel-body", itemPanel);
    var itemDesc = cmn.createElement("h3", "item-add-text", itemContent);
    var plus = cmn.createElement("h1", "item-add", itemContent);
    
    
    itemDesc.innerHTML = 'Добавить товар';
    plus.innerHTML = '+';
    
    itemPanel.onclick = this.click;
};

wf.ClientSelector = function(aContainer) {
    this.elType = "div";
    this.elClass = "baristaOrder panel panel-primary";
    this.container = aContainer;
    
    wf.proto.bind(this)();
}

wf.Table = function(aContainer, aHeader, aData, aTableClass, aHeaderClass, aBodyClass) {
    this.elType = "table";
    this.elClass = "table table-hover " + aTableClass;
    this.container = aContainer;
    
    wf.proto.bind(this)();
    
    //var content = cmn.createElement("table", "table table-hover " + aTableClass, aContainer);
    var thead = cmn.createElement('thead', null, this.dockElement, aHeaderClass);
    var tr = cmn.createElement('tr', null, thead);
    for (var j in aHeader) {
        var th = cmn.createElement('th', 'table-title', tr);
        th.innerHTML = aHeader[j];
    }
    var tbody = null;
    var loadDiv = null;
    
    function setData(aData, aFields) {
        function applyDataToCell(aData, aContainer, aCellNumber) {
            th = cmn.createElement('th', 'table-body', aContainer);
            
            if (aData.editable) {
                new (function(){
                    var input = cmn.createElement('input', null, th);
                    input.value = aData.value;
                    input.onchange = function() {
                            aData.value = input.value;
                            aData.onchange(aData)
                        };
                })();
            } else {
                if ($.isArray(aData) || typeof aData == 'Object') {
                    $(th).addClass('table-container');
                    createTable(th, aData)
                } else {
                    th.innerHTML = aData;
                }
            }
        }
        
        function createTable(aContainer, aDataArray) {
            tbody = cmn.createElement('tbody', null, aContainer, aBodyClass);
            aDataArray.forEach(function(aCursor) {
                addTableRow(aCursor, tbody);
            });
        }
        
        function addTableRow(aCursor, aContainer) {
            var tr = cmn.createElement('tr', aCursor.onclick ? 'clickable' : null, aContainer, null);
            if (aCursor.onclick) {
                tr.onclick = aCursor.onclick;
            }
            
            if (!aFields)
                for (var j in aCursor)
                    if (j !== 'onclick')
                        applyDataToCell(aCursor[j], tr, j);
            else
                for (var j in aFields)
                    if (j !== 'onclick')
                        applyDataToCell(aCursor[j], tr, j);
        }
        if (tbody)
            tbody.innerHTML = '';
        $(loadDiv).remove();
        createTable(this.dockElement, aData);
    }
    
    function loadShow() {
        $(tbody).remove();
        loadDiv = cmn.createElement('div', 'loadDiv', this.dockElement);
    }
    
    if (aData)
        setData(aData)
    else
        loadShow();
    
    this.setData = setData;
    this.prepare = loadShow;
};

wf.DateTimePeriodPicker = function(aContainer, aSetPeriodFunction) {
    var dtPContainer = cmn.createElement('div', 'input-prepend input-group', aContainer);
    var clnd = cmn.createElement('span','add-on input-group-addon', dtPContainer);
    cmn.createElement('i','glyphicon glyphicon-calendar fa fa-calendar', clnd);
    var dtP = cmn.createElement('input', 'form-control', dtPContainer, 'dateTimePicker');

    function setPeriod(start, end) {
        aSetPeriodFunction(start, end);
    };

    function dateToString(aDate) {
        var DD = aDate.getDate();
        var MM = aDate.getMonth() + 1;
        var YYYY = aDate.getFullYear();
        return YYYY + '/' + MM + '/' + DD;
    }
    
    this.dateToString = dateToString;
    
    function initDatePicker(aStart, aEnd) {
        dtP.value = aStart + ' - ' + aEnd;
        $(dtP).daterangepicker(
            { 
              format: 'YYYY-MM-DD',
              startDate: aStart,
              endDate: aEnd
            },
            function(start, end) {
                setPeriod(new Date(start), new Date(end));
            });
    }

    
    this.init = function(aDaysCount) {
        var iEnd = new Date();
        var iStart = new Date();
        iStart.setDate(iStart.getDate() - aDaysCount ? aDaysCount : 7);
        var sStart = dateToString(iStart);
        var sEnd = dateToString(iEnd);
        
        try {
            initDatePicker(sStart, sEnd);
        } catch (e) {
            $.getScript("js/moment.min.js", function(){
                $.getScript("js/daterangepicker.js", function() {
                    initDatePicker(sStart, sEnd);
                });
            });
        }
        setPeriod(iStart, iEnd);
    };
}

wf.WidgetList = function(aContainer, aListData, aWidgetConstructor) {
    this.elType = this.elType ? this.elType : "div";
    this.container = aContainer ? aContainer : this.container;
    wf.proto.bind(this)();
        
    this.setActive = (function(anActive) {
        $(this.dockElement).children().removeClass('active');
        this.activeElement = anActive;
        $(anActive.dockElement).addClass('active');
    }).bind(this);
    
    this.activate = (function() {
        if (this.activeElement) {
            this.setActive(this.activeElement);
            this.activeElement.activate();
        }
    }).bind(this);
    
    this.show = (function() {
        $(this.dockElement).show();
        this.activate();
    }).bind(this);
    
    this.activeElement = null;
    this.widgList = [];
    for (var j in aListData) {
        this.widgList[j] = new aWidgetConstructor(aListData[j], this);
    }
}

wf.ActionList = function(anActions, aContainer) {
    var al = this;
    this.elType = "div";
    this.elClass = "list-group";
    this.container = aContainer;
    
    wf.WidgetList.bind(this)(null, anActions, ActionListElement);
   
   /* var acExample = {
        actionName : {
                display     :   'someName',
                dispForm    :   'someFormName',
                onClick     :   someFunction,
                selfGeneration  :   false,
                inner   :   {}
                defEnabled  :   true/false,
                doNotActivate   :   true/false
            }
        }*/
    
    function ActionListElement(anAction, aParent) {
        this.elType = "a";
        this.elClass = "list-group-item";
        this.container = aParent.dockElement;
        wf.proto.bind(this)();
        var ale = this;
        
        function doWork() {
            if (anAction.dispForm) {            
                cmn.pFrameRunner.show(anAction.dispForm, anAction.display);
            }
            if (anAction.onClick) {
                anAction.onClick();
            }
        }
        
        function elClick() {
            if (!anAction.doNotActivate) {
                aParent.setActive(ale);
            }
            doWork();
        }
        //this.element = cmn.createElement('a', 'list-group-item', al.dockElement);
        this.dockElement.innerHTML = '<h4 class="list-group-item-heading">'
            + (anAction.glyph ? '<span class="' + anAction.glyph + '"></span> ' : '')
            + anAction.display + '</h4>';
        this.activate = doWork;
        this.dockElement.onclick = elClick;
        if (anAction.defEnabled) elClick();
    }
}

wf.ButtonGroup = function(aButtons, aContainer, aBtnClass, aFunction, aClass) {
    for (var j in aButtons)
        aButtons[j].j = j;
    var bg = this;
    this.elClass = aClass ? aClass : "btn-group btn-group-xs";
    
    function Button(aButton, aParent) {
        this.elType = "button";
        this.elClass = aBtnClass + (aButton.special_class ? ' ' + aButton.special_class : '');
        this.container = aParent.dockElement;
        wf.proto.bind(this)();

        this.dockElement.innerHTML = aButton.d_name;
        this.title = aButton.d_title;
        this.fParam = aButton.j;
        
        function doWork() {
            aFunction(aButton.j);
        }
        
        function elClick() {
            aParent.setActive(this);
            doWork();
        }
        
        this.activate = doWork.bind(this);
        this.dockElement.onclick = elClick.bind(this);
        if (aButton.active) elClick.bind(this)();
    }
    
    wf.WidgetList.bind(this)(aContainer, aButtons, Button);
    this.dockElement.role = "toolbar";
    this.setActiveButton = this.setActive;
}

/**
 * Обертка любой формы в виджет
 * @pForm - собственно платипусная форма
 * @aTempDiv - временный контейнер, использованный для создания формы
 * @aContainer - контейнер
 Пока не работает
 */
wf.selfGeneratedForm = function(pForm, aTempDiv, aContainer) {
    pForm.elType = "div";
    pForm.elClass = "list-group-item";
    pForm.container = aContainer;
    wf.proto.bind(pForm)();
    pForm.dockElement.appendChild(aTempDiv);
}

wf.getSelfGeneratedFormAsWidget = function(aFormConstructor, aContainer) {
    pForm.elType = "div";
    pForm.elClass = "list-group-item";
    pForm.container = aContainer;
    wf.proto.bind(pForm)();    
}
