if (!platypus) {
    var platypus = {};
}


platypus.ready = function() {
    require(['as_menu'], function() {
       menu = new as_menu();
    });
};
