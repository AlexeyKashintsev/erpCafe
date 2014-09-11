var units = {};
var session = {};
var cmn = {};

cmn.showModal = function(aForm, aCallback) {
    aForm.showOnPanel('modalFormContent');
    aForm.onClose = aCallback;
    $('#modalForm').modal({});
}

cmn.pFrameRunner = new function() {
    var frames = {};
    var activeFrame = null;
    
    function setActiveFrame(aFormName) {
        $('#' + activeFrame).hide();
        $('#' + aFormName).show();
        activeFrame = aFormName;
    }
    
    this.show = function(aFormName, aCaption, aSelfGeneration) {
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
                    frames[aFormName].form.setFranchazi(units.userSession.franchaziId);
                } catch (e) {
                    Logger.warning('Невозможно задать ID франчази для '+ aFormName);
                }
                frames[aFormName].div.removeChild(Loading);
                if (!aSelfGeneration) {
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
        this.element.innerHTML = '<h4 class="list-group-item-heading">' + anAction.display + '</h4>';
        var ale = this.element;
        this.element.onclick = function() {
            cmn.pFrameRunner.show(anAction.dispForm, anAction.display, anAction.selfGeneration);
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


var global = window;
if(!global.P){
    var oldP = global.P;
    global.P = {};
    global.P.restore = function() {
        var ns = global.P;
        global.P = oldP;
        return ns;
    };
}
var P = window.P;

P.ready = function() {
    P.require(['getUserSession'], function(){
        session = getUserSession();        
        session.login(function(anUserRole){
                //units.userSession.userRole = anUserRole;
                //units.userSession.franchaziId = units.userSession.getFranchazi();
                switch (anUserRole) {
                    case 'admin':
                        P.require(['StartMasterAdminForm'], function() {
                            units.asf = new StartMasterAdminForm();
                        })
                        break;
                    case 'franchazi':
                        P.require(['AdminStartForm'], function() {
                            units.asf = new AdminStartForm();
                        })
                        break;
                    case 'barista':
                        P.require(['BaristaDesktop'], function(){
                            units.bd = new BaristaDesktop();
                        });
                        break;
                }
            });
        });
};