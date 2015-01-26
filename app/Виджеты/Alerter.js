/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function Alerter(anAlert, aType, aText, aCloseable, aCloseTimeOut, aContainer, onClick) {
    var self = this, model = this.model;
    if (!lastAlert) lastAlert;
    if (!anAlert) {
        var divEl = cmn.createElement("div", "alert " + aType, 
                                      aContainer ? aContainer : "actionPanel",
                                      null, lastAlert ? lastAlert : false);
        divEl.role = "alert";
        lastAlert = divEl;
    } else {
        divEl = anAlert;
        if (aType)
            divEl.className = "alert " + aType;
    }

    divEl.innerHTML = aText;

    function closeIt() {
        divEl.parentNode.removeChild(divEl);
        if (lastAlert === divEl)
            lastAlert = null;
    }

    divEl.onclick = onClick ? onClick : (aCloseable ? closeIt : null);

    if (aCloseTimeOut)
        setTimeout(closeIt, aCloseTimeOut);

    return divEl;
}
