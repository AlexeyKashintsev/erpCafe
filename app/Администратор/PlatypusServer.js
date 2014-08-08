/**
 * <p>
 * Versalite support module to enable remote invokation of sever methods by HTTP protocol.
 * This module can be used in a Platypus Server or Platypus Client running under JVM or in a browser HTML page.
 * Syncronyous as well asyncronyous calls allowed.
 * </p>
 * <p>
 * Generally you should create an instance of proxy stub of a server module using 
 * <code>getModule</code> method and use this object to run RPC calls etc.
 * </p>
 * <p>
 * Syncronyous example for a Platypus Server or Platypus Client:
 * </p>
 * <pre>
 *   var server = new PlatypusServer("http://localhost:8080");
 *   server.setCredentials("admin", "masterkey");
 *   var serverModule = server.getModule("ServerTest");
 *   alert(serverModule.test());
 * </pre>
 * <p>
 * To use asyncronyous syntax provide as a last parameter a funciton handler wich takes as a parameter the result:
 * </p>
 * <pre>
 *   var server = new PlatypusServer();
 *   server.getModule("ServerTest", function(serverModule) { sm.test(function(result) {alert(result)}); });
 * </pre>
 * <p>
 * A bundle of low-level API methods is also provided for logging out, managing server module instace, module invocaiton etc.
 * </p>
 * 
 * @author Vadim Vashkevich
 * @module
 * @public
 */
function PlatypusServer() {

    var self = this;

    var serverUrl = arguments[0],
            userName,
            psswrd;

    var API_PATH = "/application/api",
            HTTP_METHOD_GET = "GET",
            HTTP_METHOD_POST = "POST",
            CONTENT_TYPE_HEADER_NAME = "Content-Type",
            BASIC_AUTH_HEADER_NAME = "Authorization",
            FORM_URLENCODED_CONTENT_TYPE = "application/x-www-form-urlencoded";

    /**
     * HTTP request query string parameters
     */
    var TYPE = "__type",
            MODULE_NAME = "__moduleName",
            METHOD_NAME = "__methodName",
            PARAMETER = "__param";

    /**
     * Specific request types
     */
    var RQ_CREATE_SERVER_MODUlE = 12,
            RQ_DISPOSE_SERVER_MODULE = 13,
            RQ_EXECUTE_SERVER_MODULE_METHOD = 14,
            RQ_IS_USER_IN_ROLE = 17,
            RQ_LOGOUT = 18,
            RQ_EXECUTE_REPORT = 19;

    /**
     * Gets the application server URL
     * @returns {string} a server web application URL
     */
    this.getServerUrl = function() {
        if (serverUrl)
            return serverUrl;
        else
            return "";
    };

    /**
     * Sets the application server URL
     * @param {string} anUrl the server URL
     * @returns {PlatypusServer} an instance of module to allow calls chaining
     */
    this.setServerUrl = function(anUrl) {
        serverUrl = anUrl;
        return self;
    };

    /**
     * Sets the username and the password to access the web application.
     * Currently only BASIC auth type supported.
     * To be used in non-browser configurations.
     * @param {string} anUserName
     * @param {string} aPassword
     * @returns {PlatypusServer} an instance of module to allow calls chaining
     */
    this.setCredentials = function(anUserName, aPassword) {
        userName = anUserName;
        psswrd = aPassword;
        return self;
    };

    /**
     * Gets the proxy stub for the server module.
     * @param {string} moduleName the name of the module
     * @param {Function} callback an optional function handler for async syntax, takes as the parameter a module proxy
     * @returns {object} a module proxy
     */
    this.getModule = function(moduleName, callback) {
        var data = self.createServerModule(moduleName, callback ? function(data) {
            createProxyObject(moduleName, data, callback);
        } : null)
        if (!callback)
            return createProxyObject(moduleName, data);
    }

    function createProxyObject(moduleName, data, callback) {
        var sm = {};
        if (data.functions) {
            for (var i = 0; i < data.functions.length; i++) {
                sm[data.functions[i]] = function(functionName) {
                    return function() {
                        var params = [], paramsLength = arguments.length, executeCallback;
                        if (arguments.length > 0 && typeof (arguments[arguments.length - 1]) === "function") {
                            executeCallback = arguments[arguments.length - 1];
                            paramsLength--;
                        }
                        for (var j = 0; j < paramsLength; j++) {
                            params[j] = arguments[j];
                        }
                        return self.executeServerModuleMethod(moduleName,
                                functionName,
                                params,
                                executeCallback ? function(data) {
                                    executeCallback(data);
                                } : null);
                    }
                }(data.functions[i]);
            }
        }
        if (data.isReport && !isJavaEnvironment()) {
            sm.show = function() {
                self.executeServerReport(moduleName);
            };
            sm.print = function() {
                self.executeServerReport(moduleName);
            };
        }
        if (callback) {
            callback(sm);
        }
        return sm;
    }

//Low level web API methods

    /**
     * Logs out for a current user at the server.
     */
    this.logout = function(callback) {
        sendPlatypusRequest(HTTP_METHOD_GET, RQ_LOGOUT, callback);
    };

    /**
     * Disposes the stateful module at the server in the user's session.
     * @param {string} moduleName the module name to dispose
     * @param {Function} callback an optional function handler for async syntax
     */
    this.disposeServerModule = function(moduleName, callback) {
        var params = {};
        params[MODULE_NAME] = moduleName;
        sendPlatypusRequest(HTTP_METHOD_GET, RQ_DISPOSE_SERVER_MODULE, params, callback);
    };

    /**
     * Creates the stateful module at the server in the user's session.
     * @param {string} moduleName the module name to create
     * @param {Function} callback an optional function handler for async syntax, takes as the parameter the invokation result
     * @returns {string} an invokation result
     */
    this.createServerModule = function(moduleName, callback) {
        var params = {};
        params[MODULE_NAME] = moduleName;
        return sendPlatypusRequest(HTTP_METHOD_GET, RQ_CREATE_SERVER_MODUlE, params, callback);
    };

    /**
     * Executes the method on the server.
     * @param {string} aModuleName the module name
     * @param {string} aMethodName the method names
     * @param {Array} aMethodParams the method's parameters
     * @return {object} the unserialized method's result
     */
    this.executeServerModuleMethod = function(aModuleName, aMethodName, aMethodParams, callback) {
        var params = {};
        params[MODULE_NAME] = aModuleName;
        params[METHOD_NAME] = aMethodName;
        var jsonMethodParams = [];
        for (var i = 0; i < aMethodParams.length; i++) {
            jsonMethodParams.push(JSON.stringify(aMethodParams[i]));
        }
        params[PARAMETER] = jsonMethodParams;
        return sendPlatypusRequest(HTTP_METHOD_POST, RQ_EXECUTE_SERVER_MODULE_METHOD, params, callback);
    };

    this.executeServerReport = function(aModuleName) {
        var params = {};
        params[MODULE_NAME] = aModuleName;
        sendDownloadRequest(HTTP_METHOD_POST, RQ_EXECUTE_REPORT, params);
    };

//End low level web API methods

    function sendPlatypusRequest(httpMethod, rqId, params, callback) {
        var data = params ? serializeUrlEncoded(params) : null;
        if (isJavaEnvironment()) {
            Logger.fine("Send data= " + data);
        } else {
            console.log("Send data= " + data);
        }
        var urlStr = httpMethod === HTTP_METHOD_POST ? getFullUrl(rqId) : appendParams(getFullUrl(rqId), params);
        var contentType = httpMethod === HTTP_METHOD_POST ? FORM_URLENCODED_CONTENT_TYPE : null;
        if (isJavaEnvironment()) {
            var result = unserialize(executeHttpRequestSync(urlStr,
                    httpMethod,
                    data,
                    contentType));
            if (callback) {
                callback(result);
            }
            return result;
        } else {
            if (callback) {
                executeAjaxRequestAsync(urlStr,
                        httpMethod,
                        data,
                        contentType,
                        function(resultData) {
                            callback(unserialize(resultData))
                        })
            } else {
                return unserialize(executeAjaxRequestSync(urlStr, httpMethod, data, contentType));
            }
        }
    }

    function appendParams(urlStr, params) {
        return params ? urlStr + "&" + serializeUrlEncoded(params) : urlStr;
    }

    function executeHttpRequestSync(urlStr, httpMethod, data, contentType) {
        var urlObj = new java.net.URL(urlStr);
        var con = urlObj.openConnection();
        con.setRequestMethod(httpMethod);
        if (contentType) {
            con.setRequestProperty(CONTENT_TYPE_HEADER_NAME, contentType);
        }
        if (userName && psswrd) {
            con.setRequestProperty(BASIC_AUTH_HEADER_NAME, getBasicAuthHeaderValue());
        }
        if (httpMethod === HTTP_METHOD_POST && data) {
            con.setDoOutput(true);
            var wr = new java.io.DataOutputStream(con.getOutputStream());
            try {
                wr.writeBytes(data);
                wr.flush();
            } finally {
                wr.close();
            }
        }

        var responseCode = con.getResponseCode();
        Logger.fine("Response code: " + responseCode);
        var response = new java.lang.StringBuilder();
        var reader = new java.io.BufferedReader(new java.io.InputStreamReader(con.getInputStream()));
        try {
            var inputLine;
            while (true) {
                inputLine = reader.readLine();
                if (inputLine === null) {
                    break;
                }
                response.append(inputLine + "\n");
            }
        } finally {
            reader.close();
        }
        Logger.fine("Response: " + response);
        return response;
    }


    function executeAjaxRequestAsync(urlStr, httpMethod, data, contentType, successCallback, errorCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open(httpMethod, urlStr, true);
        if (contentType) {
            xhr.setRequestHeader(CONTENT_TYPE_HEADER_NAME, contentType);
        }
        xhr.onload = function() {
            successCallback(xhr.responseText);
        };
        xhr.onerror = xhr.onabort = xhr.ontimeout = errorCallback;
        xhr.send(data);
    }

    function executeAjaxRequestSync(urlStr, httpMethod, data, contentType) {
        var xhr = new XMLHttpRequest();
        xhr.open(httpMethod, urlStr, false);
        if (contentType) {
            xhr.setRequestHeader(CONTENT_TYPE_HEADER_NAME, contentType);
        }
        xhr.send(data);
        return xhr.responseText;
    }

    function sendDownloadRequest(httpMethod, rqId, params) {
        if (!self.serverUrl) {
            throw self.URL_NOT_DEFINED_ERROR;
        } else {
            var uri = removeEndSlash(self.serverUrl) + self.API_PATH;
            var form = document.createElement("form");
            form.setAttribute("method", httpMethod);
            form.setAttribute("action", uri);

            appendHiddenField(form, self.TYPE, rqId);
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    appendHiddenField(form, key, params[key]);
                }
            }
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    }

    function getFullUrl(rqId) {
        return removeEndSlash(self.getServerUrl()) + API_PATH + "?" + TYPE + "=" + rqId;
    }

    function getBasicAuthHeaderValue() {
        var userPass = new java.lang.String(userName + ":" + psswrd);
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

    function removeEndSlash(target) {
        var l = target.length - 1;
        if (target.lastIndexOf('/') === l) {
            target = target.substring(0, l);
        }
        return target;
    }

    function isJavaEnvironment() {
        return typeof java !== 'undefined';
    }
}