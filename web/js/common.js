var units = {};
var cmn = {};
var session = {};

var Logout = function() {
    logout();
    location.reload();
}

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
                session.franchaziId = session.getFranchazi();
                switch (anUserRole) {
                    case 'admin':
                        require(['StartMasterAdminForm'], function() {
                            units.asf = new StartMasterAdminForm();
                        });
                        break;
                    case 'franchazi':
                        require(['AdminStartForm'], function() {
                            units.asf = new AdminStartForm();
                        });
                        break;
                    case 'barista':
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

   /* Highcharts.setOptions({
	global: {
		useUTC: false
	}
    });
    
    Highcharts.setOptions({
	lang: {
		months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
		weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
	}
    });*/
};