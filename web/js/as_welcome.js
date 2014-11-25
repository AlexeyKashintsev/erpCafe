if (!platypus) {
    var platypus = {};
}


platypus.ready = function() {
    require(['as_welcome'], function() {
       menu = new as_welcome();
    });
};
