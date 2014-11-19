var units = {};
var cmn = {};
var session = {/*
    userRole
    userName
    activeSession
    tradePoint
    franchaziId*/};
var Session = new (function() {
        var servModules = {};
        this.get = function(aModuleName) {
            if (!servModules[aModuleName]) {
                servModules[aModuleName] = new ServerModule(aModuleName);
            }
            return servModules[aModuleName];
        };
    })();


var Logout = function() {
    logout();
    setTimeout(location.reload, 1000);
};

cmn.Modal = function(aTitle) {
    var modalBody = document.getElementById("modal-body-window");
    $('#modal-title').html(aTitle);
    
    this.show = function() {
        $('#modalForm').modal('toggle');
    };
    
    this.getModalBody = function() {
        return modalBody;
    }
}

cmn.showModal = function(aForm, aCallback) {
    aForm.showOnPanel('modalFormContent');
    aForm.onClose = aCallback;
    $('#modalForm').modal({});
}
/*
 { d_name  : "День",
   d_title : "День",
   active  : true/false}
*/
cmn.ButtonGroup = function(aButtons, aContainer, aBtnClass, aFunction, aClass) {
    var buttons = [];
    var divBtnGroup = cmn.createElement("div", aClass ? aClass : "btn-group btn-group-xs", aContainer);
    divBtnGroup.role = "toolbar";
    
    function setActiveButton(aBtn) {
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
        buttons[j] = cmn.createElement("button", aBtnClass, divBtnGroup);
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
}

cmn.pFrameRunner = new function() {
    var frames = {};
    var activeFrame = null;
    
    function setActiveFrame(aFormName) {
        $('#' + activeFrame).hide();
        $('#' + aFormName).show();
        activeFrame = aFormName;
    }
    
    this.show = function(aFormName, aCaption) {
        if (!frames[aFormName]) {
            frames[aFormName] = {};
            frames[aFormName].div = cmn.createElement('div', 'formContainer', 'mainArea', aFormName);
            if (aCaption) {
                var header = cmn.createElement('div', 'navbar navbar-default navbar-static-top', frames[aFormName].div, '');
                header.innerHTML = '<div class="container"><h2>' + aCaption + '</h2></div>';
            }
            var Loading = cmn.createElement('blockquote', '', frames[aFormName].div, '');
            Loading.innerHTML = '<p>Загрузка...</p>';
            setActiveFrame(aFormName);
            require([aFormName], function(){
                frames[aFormName].form = new Form(aFormName);
                try {
                    frames[aFormName].form.setFranchazi(session.franchaziId);
                } catch (e) {
                    Logger.warning('Невозможно задать ID франчази для '+ aFormName);
                }
                frames[aFormName].div.removeChild(Loading);
                if (!frames[aFormName].form.manualShow) {
                    frames[aFormName].form.showOnPanel(frames[aFormName].div);
                } else {
                    frames[aFormName].form.manualShow(frames[aFormName].div);
                }
                return frames[aFormName].form;
            });
        }
        else
            setActiveFrame(aFormName);
    }
}

cmn.createElement = function(aType, aClass, aContainer, aID, aBeforeContainer) {
        var el = document.createElement(aType);
        if (!!aClass) el.className = aClass;
        if (!!aID) el.id = aID;
        
        function appendChild() {
            if (typeof aContainer !== 'string') {
                aContainer.appendChild(el);
            } else {
                document.getElementById(aContainer).appendChild(el);
            }
        }
        
        function appendChildBefore() {
            if (typeof aContainer !== 'string') {
                aContainer.insertBefore(el, aBeforeContainer);
            } else {
                document.getElementById(aContainer).insertBefore(el, aBeforeContainer);
            }
        }
        
        if (aContainer) {
            if (!aBeforeContainer)
                appendChild();
            else 
                appendChildBefore();
        }
        
        return el;
    }
    
cmn.getElement = function(aType, aClass, aContainer, aID, aBeforeContainer) {
    var d = document.getElementById(aID)
    if (d) {
        return d
    } else
        return cmn.createElement(aType, aClass, aContainer, aID, aBeforeContainer)
}

cmn.ActionList = function(anActions, aParentContainer) {
   /* var acExample = {
        actionName : {
                display     :   'someName',
                dispForm    :   'someFormName',
                selfGeneration  :   false,
                inner   :   {}
            }
        }*/
        
    function ActionListElement(anAction, dock) {
        this.element = document.createElement('a');
        this.element.className = 'list-group-item';
        this.element.innerHTML = '<h4 class="list-group-item-heading">'
            + (anAction.glyph ? '<span class="' + anAction.glyph + '"></span> ' : '')
            + anAction.display + '</h4>';
        var ale = this.element;
        this.element.onclick = function() {
            cmn.pFrameRunner.show(anAction.dispForm, anAction.display);
            $('.list-group-item').removeClass('active');
            ale.className += ' active';
        }
        dock.appendChild(this.element);
    }
    
    this.actionList = {};
    this.dockDiv = cmn.createElement('div', 'list-group', aParentContainer);
    
    for (var j in anActions) {
        this.actionList[j] = new ActionListElement(anActions[j], this.dockDiv)
    }
}

cmn.addTopRightControl = function(aText, anIcon, aFunction, aHref) {
    //<li><a id="whAdd" href="#"><span class="glyphicon glyphicon-plus-sign"></span>  Прием товара</a></li>
    var li = document.createElement('li');
    li.onclick = aFunction;
    li.innerHTML = '<a id="whAdd" href="' + (aHref ? aHref : '#') + '"><span class="glyphicon glyphicon-' + anIcon +
                    '"></span>   ' + aText + '</a>';
    document.getElementById('logActionNav').appendChild(li);
}

cmn.addHeaderLeft = function(aText, anIcon, aFunction, aHref) {
    //<li><a href="#"><span class="glyphicon glyphicon-plus-sign"></span>  Прием товара</a></li>
    var li = document.createElement('li');
    if (aFunction) li.onclick = aFunction;
    li.innerHTML = '<a href="' + (aHref ? aHref : '#') + '"><span class="glyphicon glyphicon-' + anIcon +
                    '"></span>   ' + aText + '</a>';
    document.getElementById('leftActionNav').appendChild(li);
}

cmn.locale = {
                loading: 'Загрузка...',
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                shortMonths: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'],
                exportButtonTitle: "Экспорт",
                printButtonTitle: "Печать",
                rangeSelectorFrom: "С",
                rangeSelectorTo: "По",
                rangeSelectorZoom: "Период",
                downloadPNG: 'Скачать PNG',
                downloadJPEG: 'Скачать JPEG',
                downloadPDF: 'Скачать PDF',
                downloadSVG: 'Скачать SVG',
                printChart: 'Напечатать график'
            };

cmn.getTimeString = function(aDate) {
    try {
        var HH = aDate.getHours();
        var MM = aDate.getMinutes();
        if (MM < 10) MM = '0' + MM;
        return HH + ":" + MM;
    } catch(e) {
        return '--:--';
    }
};


