/**
 * 
 * @author Alexey
 * @module
 */ 
function VideoFromTP(aTradePoint, aContainer) {
    var self = this, model = this.model;
    self.container = cmn.createElement("div", "", aContainer);
    if (aTradePoint === 23) {
        self.container.innerHTML = '<iframe src="http://192.168.10.31:8081" width="640" height="480" align="left"></iframe>'
    } else {
        self.container.innerHTML = 'Трансляция не доступна';
    }
}
