if (!platypus) {
    var platypus = {};
}


platypus.ready = function() {
    require(['menuMain'], function() {
       menu = new menuMain();
    });
};
