var wf = {};

wf.proto = function() {
    this.dockElement = cmn.createElement(this.elType, this.elClass, this.container);
    this.hide = (function(){$(this.dockElement).hide()}).bind(this);
    this.show = (function(){$(this.dockElement).show()}).bind(this);
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

    var oliContainer = cmn.createElement("div", "", oPanel, 'orderItems');//document.getElementById('orderItems');
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
    /**
     * 
     * @param {type} aObject
     * @param {type} aContainer
     * @returns {undefined}
     */
    this.orderItem = function(aObject, aContainer) {
        var container = aContainer ? aContainer : oliContainer;
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
}

wf.TradeItem = function(aContainer) {
    this.elType = "div";
    this.elClass = "Sortable itemDescription tt_" + this.data.trade_item_type_id + (this.data.classtag ? " " + this.data.classtag : "");
    this.container = aContainer;
    this.ID = "tt_" + this.data.item_id;
    
    wf.proto.bind(this)();
    var itemContainer = this.dockElement;
    
    var itemPanel = cmn.createElement("div", "panel panel-primary " + this.data.color , itemContainer);
    
    var itemContent = cmn.createElement("div", "panel-body", itemPanel);
    var itemDesc = cmn.createElement("h3", "itemDesc", itemContent);
    var itemCost = cmn.createElement("h1", "itemCost", itemContent);
    
    itemDesc.innerHTML = this.data.item_name;
    
    this.setDisplayedPrice = function(aPrice) {
        itemCost.innerHTML = aPrice;
    };
    
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
    
    function setData(aData, aFields) {
        function applyDataToCell(aData, aContainer) {
            th = cmn.createElement('th', 'table-body', aContainer);
            
            if ($.isArray(aData) || typeof aData == 'Object') {
                $(th).addClass('table-container');
                createTable(th, aData)
            } else {
                th.innerHTML = aData;
            }
        }
        
        $(tbody).remove();
        
        function createTable(aContainer, aDataArray) {
            var tBody = cmn.createElement('tbody', null, aContainer, aBodyClass);
            aDataArray.forEach(function(aCursor) {
                addTableRow(aCursor, tBody);
            });
            return tBody;
        }
        
        function addTableRow(aCursor, aContainer) {
            var tr = cmn.createElement('tr', aCursor.onclick ? 'clickable' : null, aContainer, null);
            if (aCursor.onclick) {
                tr.onclick = aCursor.onclick;
            }
            
            if (!aFields)
                for (var j = 0; j < aCursor.length; j++)
                    applyDataToCell(aCursor[j], tr);
            else
                for (var j in aFields)
                    applyDataToCell(aCursor[j], tr);
        }
        
        tbody = createTable(this.dockElement, aData);
    }
    
    function loadShow() {
        $(tbody).remove();
        tbody = cmn.createElement('div', 'loadDiv', this.dockElement);
    }
    
    if (aData)
        setData(aData)
    else
        loadShow();
    
    this.setData = setData;
    this.prepare = loadShow;
}

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

wf.ActionList = function(anActions, aContainer) {
    this.elType = "div";
    this.elClass = "list-group";
    this.container = aContainer;
 
    wf.proto.bind(this)();
   
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
    this.activeElement = null;
    
    function ActionListElement(anAction, aParent) {
        function elClick() {
            if (!anAction.doNotActivate) {
                aParent.activeElement = this;
                $('.list-group-item').removeClass('active');
                this.element.className += ' active';
            }
            if (anAction.dispForm) {            
                cmn.pFrameRunner.show(anAction.dispForm, anAction.display);
            }
            if (anAction.onClick) {
                anAction.onClick();
            }
        }
        this.activate = elClick.bind(this);
        this.element = cmn.createElement('a', 'list-group-item', aParent.dockElement);
        this.element.innerHTML = '<h4 class="list-group-item-heading">'
            + (anAction.glyph ? '<span class="' + anAction.glyph + '"></span> ' : '')
            + anAction.display + '</h4>';
        //var ale = this.element;
        this.element.onclick = elClick.bind(this);
        if (anAction.defEnabled) elClick.bind(this)();
    }
    
    this.actionList = {};
    
    for (var j in anActions) {
        this.actionList[j] = new ActionListElement(anActions[j], this);
    }
    
    this.activate = function() {
        if (this.activeElement) {
            this.activeElement.activate();
        }
    }
    
    this.show = (function() {
        $(this.dockElement).show();
        this.activate();
    }).bind(this);
}

wf.ButtonGroup = function(aButtons, aContainer, aBtnClass, aFunction, aClass) {
    this.elType = "div";
    this.elClass = aClass ? aClass : "btn-group btn-group-xs";
    this.container = aContainer;
    
    wf.proto.bind(this)();
    this.dockElement.role = "toolbar";
    var buttons = [];
    
    function setActiveButton(aBtn) {
        if (typeof(aBtn) !== 'object') {
            for (var j in buttons) 
                if (buttons[j].fParam == aBtn) aBtn = buttons[j];
        }
        for (var j in buttons) {
            $(buttons[j]).removeClass('active');
        }
        $(aBtn).addClass('active');
    }
    
    function btnClick() {
        setActiveButton(this);
        aFunction(this.fParam);
    }
    
    for (var j in aButtons) {
        buttons[j] = cmn.createElement("button", aBtnClass + (aButtons[j].special_class ? ' ' + aButtons[j].special_class : '')
                                       , this.dockElement);
        buttons[j].innerHTML = aButtons[j].d_name;
        buttons[j].title = aButtons[j].d_title;
        buttons[j].fParam = j;
        buttons[j].onclick = btnClick;
        
        if (aButtons[j].active) {
            var active = j; 
        }
    }
    if (active) {
        setActiveButton(buttons[active]);
        aFunction(buttons[active].fParam);
    }
    this.setActiveButton = setActiveButton;
}