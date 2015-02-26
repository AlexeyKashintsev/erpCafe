/* 
 * @author ak
 */
var Keylistener = function() {
    this.actions = [];
    this.exclusive = null;
    Keylistener.prototype.append.bind(this)();
};

Keylistener.prototype.addAction = function(anAction, anExclusive) {
    if (anExclusive && !this.exclusive || !anExclusive) {
        var res = this.actions.length;
        this.actions.push(anAction);
        if (anExclusive) 
            this.exclusive = res;
    } else {
        res = false;
    }
    return res;
};

Keylistener.prototype.delAction = function(anActionID) {
    try {
        if (this.exclusive === anActionID)
            this.exclusive = null;
        delete this.actions[anActionID];
        return true;
    } catch(e) {
        return false;
    }
};

Keylistener.prototype.proceedActions = function(keyAction) {
    keyAction.char = this.getChar(keyAction);
    if (this.exclusive) {
        this.actions[this.exclusive](keyAction);
    } else {
        for (var j in this.actions)
            if (this.actions[j])
                this.actions[j](keyAction);
    }
};

Keylistener.prototype.getChar = function(event) {
    if (event.which == null) {  // IE
        if (event.keyCode < 32) return null; // спец. символ
        return String.fromCharCode(event.keyCode)
    }
    if (event.which!=0 && event.charCode!=0) { // все кроме IE
        if (event.which < 32) return null; // спец. символ
        return String.fromCharCode(event.which); // остальные
    }
    return null; // спец. символ
};


Keylistener.prototype.append = function() {
    document.getElementById('body').addEventListener('keypress', this.proceedActions.bind(this));
};

var kl = new Keylistener();

function BarCodeProcessor() {
    this.listen = true;
    this.ti = null;
    var keyBuffer = '';
    var lastpress = null;
    
    function processKey(evt) {
        if (this.listen) {
            if (evt.keyCode === 13) {
                if (this.ti)
                    this.ti.barCodeEnter(keyBuffer);
                keyBuffer = '';
            } else {
                var now = new Date();
                if (lastpress && now - lastpress < 1000) {
                    keyBuffer += evt.char;
                } else
                    keyBuffer = evt.char;
                lastpress = now;
            }
        }
    }
    kl.addAction(processKey.bind(this));
}

var bcp = new BarCodeProcessor();