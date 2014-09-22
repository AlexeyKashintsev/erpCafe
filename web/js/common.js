var units = {};
var cmn = {};
var session = {};
var sessionTimeout = 15 * 60 * 1000;

var Logout = function() {
    logout();
    setTimeout(location.reload, 1000);
}

var keepSession = function(aCallBack) {
    Logger.info('Проверка сессии...');
    session.keepAlive(session.userName, function(aResult) {
        if (!aResult) {    
            if (aCallBack)
                aCallBack(1)
            else {
                alert('Сессия истекла!');
                location.reload();
            }
        } else {
            Logger.info('Ok!');
            if (aCallBack) aCallBack(0);
        }
    }, function(){
        Logger.severe('Нет связи с сервером!');
        if (aCallBack)
                aCallBack(2)
            else {
                alert('Нет связи с сервером!');
                location.reload();
            }
        });
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
    this.dockDiv = document.createElement('div');
    this.dockDiv.classname = 'list-group';
    aParentContainer.appendChild(this.dockDiv);
    
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

if (!platypus) {
    var platypus = {};
}

platypus.ready = function() {
    require(['getUserSession'], function(){
        session = getUserSession();
        session.login(function(anUserRole){
                session.userRole = anUserRole;
                session.userName = session.getUserName();
                setInterval(keepSession, sessionTimeout);
                switch (anUserRole) {
                    case 'admin':
                        require(['StartMasterAdminForm'], function() {
                            units.asf = new StartMasterAdminForm();
                        });
                        break;
                    case 'franchazi':
                        session.franchaziId = session.getFranchazi();
                        require(['AdminStartForm'], function() {
                            units.asf = new AdminStartForm();
                        });
                        break;
                    case 'barista':
                        session.franchaziId = session.getFranchazi();
                        require(['BaristaDesktop'], function(){
                            units.bd = new BaristaDesktop();
                        });
                        break;
                    case 'client':
                        require(['ClientStartForm'], function(){
                            units.csf = new ClientStartForm();
                        });
                        break;
                    
                }
            });
        });

Highcharts.setOptions({
            lang: {
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
            },
            global: {
                useUTC: true
            }
    });
};