/**
 * 
 * @author Andrew
 * @name StringUtils
 */

function StringUtils() {


var self = this;



self.format = function(aObj, aArguments) {
    var formatted = aObj;
    for (var arg in aArguments) {
        formatted = formatted.replace("{" + arg + "}", aArguments[arg]);
    }
    return formatted;
};
}