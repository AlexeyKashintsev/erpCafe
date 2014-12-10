/**
 * @author minya92
 * @rolesAllowed admin
 */
function MyChat() {
    var self = this, model = this.model, form = this;
    var sendChatMsg = new ServerModule("SendChatMsg");
    
    var webSocket = null;
    addEventsListener();

    function addEventsListener() {
        Logger.info("adding listener");

        if (webSocket) {
            webSocket.close();
            webSocket = null;
        }
        var wsProtocol = "ws:";
        if (window.location.protocol == 'https:')
            wsProtocol = "wss:";
        webSocket = new WebSocket(wsProtocol + "//" + window.location.host + window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/")) + "/taggedfeed");
        console.log(webSocket);
        var test = webSocket;
        webSocket.onopen = function() {
            webSocket.send("default");
        };

        webSocket.onerror = function(aError) {
            Logger.info("onError");
            Logger.info(aError);
        };

        webSocket.onmessage = function(aEventData) {
            Logger.info("onMessage here");
            alert(aEventData.data);
        };
        webSocket.onclose = function() {
            Logger.info("onClose");
        };
    }

    function btnUpActionPerformed(evt) {//GEN-FIRST:event_btnUpActionPerformed
        sendChatMsg.pusher(form.textField.text);
    }//GEN-LAST:event_btnUpActionPerformed
}
