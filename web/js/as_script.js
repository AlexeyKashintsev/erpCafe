if (!platypus) {
    var platypus = {};
}


platypus.ready = function() {
    require(['as_script'], function() {
       menu = new as_script();
    });
};
