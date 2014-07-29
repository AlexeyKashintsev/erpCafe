var units = {};

if (!platypus) {
    var platypus = {};
}

function resizeMainFrame() {
    Logger.info(units.masterForm.height);
    Logger.info(document.getElementById('mainFrame').offsetHeight);
    
    //units.masterForm.height = document.getElementById('mainFrame').clientHeight;
    //units.masterForm.width = document.getElementById('mainFrame').offsetWidth;
}

platypus.ready = function() {
    require(['StartMasterAdminForm'], function(){
        units.masterForm = new StartMasterAdminForm();
        //resizeMainFrame();
        units.masterForm.showOnPanel('mainFrame');
        units.masterForm.maximize();
        //window.onresize = resizeMainFrame;
    })
};