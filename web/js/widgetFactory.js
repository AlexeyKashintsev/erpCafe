var wf = {};

wf.proto = function() {
    this.dockElement = cmn.createElement(this.elType, this.elClass, this.container, this.ID);
    this.hide = (function(){
        if (this.onhide)
            this.onhide();
        $(this.dockElement).hide();
    }).bind(this);
    this.show = (function(){
        if (this.onshow)
            this.onshow();
        $(this.dockElement).show();
    }).bind(this);
    this.destroy = (function() {
        cmn.deleteElement(this.dockElement);
        delete this;
    }).bind(this);
};

wf.DeviceSettings = function(aContainer) {
    var obj = this;
    this.elType = "div";
    this.elClass = "panel panel-primary settings";
    this.container = aContainer;
    wf.proto.bind(this)();
    
    this.selectedDriver = null;
    
    this.caption = cmn.createElement("h3", "", this.dockElement);
    this.caption.innerHTML = this.data.display;
    this.selector = cmn.createElement("div", "", this.dockElement);
    this.selectorCaption = cmn.createElement("p", "", this.selector);
    this.selectorCaption.innerHTML = "Выбор драйвера";
    this.selectorList = new wf.Selector(this.selector, this.data.values, this.selectDevice.bind(this));
    this.settingsPane = cmn.createElement("div", "settings-pane", this.dockElement);
};

wf.DevSetting = function(aContainer) {
    this.elType = "div";
    this.elClass = "panel setting-pane";
    this.container = aContainer;
    wf.proto.bind(this)();
    
    this.caption = cmn.createElement("h3", "", this.dockElement);
    this.caption.innerHTML = this.data.display;
    this.selectorList = new wf.Selector(this.dockElement, this.data.values, this.selectOption.bind(this));
};

wf.DevActions = function(aContainer) {
    this.elType = "div";
    this.elClass = "panel setting-pane";
    this.container = aContainer;
    wf.proto.bind(this)();
    
};

wf.Selector = function(aContainer, aValues, anAction) {
    this.elType = "select";
    this.elClass = "";
    this.container = aContainer;
    wf.proto.bind(this)();
    
    for (var j in aValues) {
        var aData = aValues[j];
        var opt = cmn.createElement("option", "", this.dockElement);
        opt.innerHTML = aData.display ? aData.display : (aData.name ? aData.name : aData);
        opt.value = aData.name ? aData.name : aData;
    }
    
    var processChange = function() {
        anAction(this.options[this.selectedIndex].value);
    }.bind(this.dockElement);
    
    this.setSelection = function(aSelection) {
        this.dockElement.value = aSelection;
        processChange();
    };
    
    this.dockElement.onchange = processChange;
};

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
};
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
        itemCount.innerHTML = aObject.orderQuantity + ' '
                + (aObject.measure ? aObject.measure : 'шт')
                +' ' + aObject.orderSum.toFixed(2) + " р.";
    };

    this.stop = false;

    this.delete = function() {
        container.removeChild(divEl);
    };

    divEl.onclick = function(evt) {
        var target = evt.target ? evt.target : evt.srcElement;
        if (!$(target).is('.glyphicon'))
            aObject.increase();
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
    this.elClass = "Sortable itemDescription";
    this.container = aContainer;
    this.ID = "ti_" + this.data.item_id;
    
    wf.proto.bind(this)();
    var itemContainer = this.dockElement;
    
    var itemPanel = cmn.createElement("div", "panel panel-primary " + (this.data.color ? " color " + this.data.color : ""), itemContainer);
    
    var itemContent = cmn.createElement("div", "panel-body", itemPanel);
    var itemDesc = cmn.createElement("h3", "item-desc", itemContent);
    var itemMods = cmn.createElement("h3", "item-modifiers", itemContent);
    var itemCost = cmn.createElement("h1", "item-cost", itemContent);
    var limit = cmn.createElement("div", "item-limit", itemContent);
    this.setDisplayedPrice = function(aPrice) {
        itemCost.innerHTML = aPrice;
    };
    
    this.addType = function(aType) {
        $(this.dockElement).addClass("tt_" + aType);
    }.bind(this);
    
    this.updateLimit = function() {
        var whIcon = "<span class='glyphicon glyphicon-align-justify'></>";
        if (this.limit > 10) {
            limit.innerHTML = whIcon;
            if (this.limit < 40)
                $(limit).addClass("small");
            else if (this.limit >= 40)
                $(limit).addClass("good");
        } else {
            if (this.limit > 0)
                limit.innerHTML = this.limit;
            else {
                limit.innerHTML = whIcon;
            }
            $(limit).addClass("bad");
        }
    }.bind(this);
    
    itemDesc.innerHTML = this.data.item_name;
    itemMods.innerHTML = this.data.short_string;
    
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
};

wf.BalanceMeter = function() {
    var view = this;
    this.elType = "div";
    this.elClass = "weight_calculator";
    this.container = document.getElementById('body');
    
    wf.proto.bind(this)();
    
    var infoPane = cmn.createElement("div", "balance-meter weigth_info", this.dockElement);
    var itemName = cmn.createElement("h1", "balance-meter item-name", infoPane);
    var weight = cmn.createElement("h1", "balance-meter weight", infoPane);
    var btnRefresh = cmn.createElement("button", "balance-meter btnRefresh color belize-hole", infoPane);
    btnRefresh.innerHTML = '<span class="glyphicon glyphicon-refresh"></span><br>Обновить';
    btnRefresh.onclick = this.askScales;
    //var cost = cmn.createElement("h1", "balance-meter cost", infoPane);
    var btnPane = cmn.createElement("div", "balance-meter btn_pane", this.dockElement);
    var btnOk = cmn.createElement("button", "balance-meter btnOk", btnPane);
    var btnCancel = cmn.createElement("button", "balance-meter btnCancel", btnPane);
    
    btnOk.innerHTML = 'Принять';
    btnCancel.innerHTML = 'Отмена';
    
    this.updateView = function() {
        var cost = (this.weight * this.itemData.item_cost).toFixed(2);
        itemName.innerHTML = this.itemData.item_name;
        weight.innerHTML = this.weight + ' ' + this.itemData.item_measure + ' | '
        + cost + ' р.';
    }.bind(this);
    
    btnOk.onclick = this.accept;
    btnCancel.onclick = function() {
        view.hide();
    };
    
    this.onshow = function() {
        this.weight = 0;
        this.updateView();
    };
    
    this.hide();
};

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
            
            if (aData) {
                if (aData.editable) {
                    new (function(){
                        var input = cmn.createElement('input', null, th);
                        input.value = aData.value;
                        input.onchange = function() {
                                aData.value = input.value;
                                aData.onchange(aData);
                            };
                    })();
                } else {
                    if ($.isArray(aData) || typeof aData == 'Object') {
                        $(th).addClass('table-container');
                        createTable(th, aData);
                    } else {
                        th.innerHTML = aData;
                    }
                }
            }
        }
        
        function createTable(aContainer, aDataArray) {
            var prevBody = tbody;
            tbody = cmn.createElement('tbody', null, aContainer, aBodyClass);
            aDataArray.forEach(function(aCursor) {
                addTableRow(aCursor, tbody);
            });
            if (prevBody !== null)
                tbody = prevBody;
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
        
        $(tbody).remove();
        tbody = null;
        $(loadDiv).remove();
        createTable(this.dockElement, aData);
    }
    
    function loadShow() {
        $(tbody).remove();
        tbody = null;
        loadDiv = cmn.createElement('div', 'loadDiv', this.dockElement);
    }
    
    if (aData)
        setData(aData);
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
};

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
    this.setActiveButton = function(anActive) {this.setActive(this.widgList[anActive]);}.bind(this);
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
