if (!platypus) {
    var platypus = {};
}

platypus.ready = function() {
    require(['menuMain'], function() {
        var menu = new menuMain();
    });
}