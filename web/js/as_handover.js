if (!platypus) {
    var platypus = {};
}


platypus.ready = function() {
    require(['as_handover'], function() {
       menu = new as_handover();
    });
};
