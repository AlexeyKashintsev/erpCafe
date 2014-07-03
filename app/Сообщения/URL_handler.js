/**
 * 
 * @name URL_handler
 * @author Alexey
 * @module 
 */
function URL_handler() {
    var self = this;
    var HTTP_METHOD_GET = "GET";
    var HTTP_METHOD_POST = "POST";
    var CONTENT_TYPE_HEADER_NAME = "Content-Type";
    var BASIC_AUTH_HEADER_NAME = "Authorization";
    var JSON_CONTENT_TYPE = "application/json; charset=utf-8";
    var FORM_URLENCODED_CONTENT_TYPE = "application/x-www-form-urlencoded";
    
    /*
     * Creates an URL connection
     * Basic authorisation if auth params is specified
     */
    self.UrlConnection = function(aURL, aParams, aMethod, anUserName, aPassword){
        var urlStr = self.getUrlString(aURL, aParams);
        var urlObj = new java.net.URL(urlStr);
        var con = urlObj.openConnection();
        
        con.setRequestMethod(aMethod?aMethod:HTTP_METHOD_GET);
        if (anUserName) con.setRequestProperty(BASIC_AUTH_HEADER_NAME, getBasicAuthHeaderValue(anUserName, aPassword));
        var responseCode = con.getResponseCode();
        Logger.fine("Response code: " + responseCode);
        return con;
    };
    
    self.getUrlString = function(aURL, aParams){
        return aParams ? 
                    aURL + (aURL[aURL.length-1] === '/' ? '' : '/') 
                    + '?' + serializeUrlEncoded(aParams)
                :
                    aURL;
    };
    
    function getBasicAuthHeaderValue(anUserName, aPassword) {
        var userPass = new java.lang.String(anUserName + ":" + aPassword);
        return "Basic " + javax.xml.bind.DatatypeConverter.printBase64Binary(userPass.getBytes());   
    }

    function serializeUrlEncoded(obj, prefix) {
        var str = [];
        for (var p in obj) {
            var k = prefix ? prefix + "[]" : p, v = obj[p];
            str.push(typeof v === "object" ?
                    serializeUrlEncoded(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
        return str.join("&");
    }

    function unserialize(str) {
        var obj;
        try {
            obj = JSON.parse(str);
        } catch (ex) {
            obj = str;
        }
        return obj;
    }
}
