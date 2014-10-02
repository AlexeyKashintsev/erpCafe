if (!platypus) {
    var platypus = {};
}

platypus.ready = function() {
    require(['testMain'], function() {
        var tst = new testMain();
    });
}