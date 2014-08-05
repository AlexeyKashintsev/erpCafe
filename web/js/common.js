var units = {};
var common = {};

common.showModal = function(aForm, aCallback) {
    aForm.showOnPanel('modalFormContent');
    aForm.onClose = aCallback;
    $('#modalForm').modal({});
}

common.pFrameRunner = new function() {
    var frames = {};
    var activeFrame = null;
    
    function setActiveFrame(aFormName) {
        $('#' + activeFrame).hide();
        $('#' + aFormName).show();
        activeFrame = aFormName;
    }
    
    this.show = function(aFormName) {
        if (!frames[aFormName]) {
            frames[aFormName] = {};
            frames[aFormName].div = document.createElement('div');
            frames[aFormName].div.innerHTML = 'Загрузка...';
            document.getElementById('mainArea').appendChild(frames[aFormName].div);
            setActiveFrame(aFormName);
            require([aFormName], function(){
                frames[aFormName].form = new Form(aFormName);
                frames[aFormName].div.id = aFormName;
                frames[aFormName].div.classname = 'formContainer';
                frames[aFormName].div.innerHTML = '';
                frames[aFormName].form.showOnPanel(frames[aFormName].div);/********************/
                return frames[aFormName].form;
            });
        }
        else
            setActiveFrame(aFormName);
    }
}

common.ActionList = function(anActions, aParentContainer) {
   /* var acExample = {
        actionName : {
                display     :   'someName',
                dispForm    :   'someFormName',
                inner   :   {}
            }
        }*/
        
    function ActionListElement(anAction, dock) {
        this.element = document.createElement('a');
        this.element.className = 'list-group-item';
        this.element.innerHTML = '<h4 class="list-group-item-heading">' + anAction.display + '</h4>';
        var ale = this.element;
        this.element.onclick = function() {
            common.pFrameRunner.show(anAction.dispForm);
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

common.addTopRightControl = function(aText, anIcon, aFunction) {
    //<li><a id="whAdd" href="#"><span class="glyphicon glyphicon-plus-sign"></span>  Прием товара</a></li>
    var li = document.createElement('li');
    li.onclick = aFunction;
    li.innerHTML = '<a id="whAdd" href="#"><span class="glyphicon glyphicon-' + anIcon +
                    '"></span>   ' + aText + '</a>';
    document.getElementById('logActionNav').appendChild(li);
}

if (!platypus) {
    var platypus = {};
}

platypus.ready = function() {
    require(['getUserSession'], function(){
        units.userSession = getUserSession();
        units.userSession.login(function(anUserRole){
                switch (anUserRole) {
                    case 'admin':
                        break;
                    case 'franchazi':
                        require(['AdminStartForm'], function(){
                            units.asf = new AdminStartForm();
                        })
                        break;
                    case 'barista':
                        require(['BaristaDesktop'], function(){
                                units.bd = new BaristaDesktop();
                            });
                        break;
                }
            });
        });
};