/**
 * @author minya92
 * @rolesAllowed admin
 */
function MyChat() {
    var self = this, model = this.model, form = this;
    var sendChatMsg = new ServerModule("SendChatMsg");
    var userSession = Session.get("UserSession");
    
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
        //console.log(webSocket);
        
        webSocket.onopen = function() {
            webSocket.send("default");
        };

        webSocket.onerror = function(aError) {
            //Logger.info("onError");
            //Logger.info(aError);
        };
        
        //Вот тут прилетает сообщение
        webSocket.onmessage = function(aEventData) {
            var msg = JSON.parse(aEventData.data);
            console.log(msg);
            //alert(aEventData.data);
            form.textArea.text += msg.user_name + ": "+ msg.text +"\n";
        };
        
        webSocket.onclose = function() {
            //Logger.info("onClose");
        };
    }

    function btnUpActionPerformed(evt) {//GEN-FIRST:event_btnUpActionPerformed
        sendChatMsg.pusher(JSON.stringify({
            user_name: userSession.getUserName(),
            text:      form.textField.text
        }));
        form.textField.text = "";
    }//GEN-LAST:event_btnUpActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
       model.qLastMessages.requery(function(){
            model.qLastMessages.beforeFirst();
            while(model.qLastMessages.next()){
                form.textArea.text += model.qLastMessages.cursor.user_name + ": "+ model.qLastMessages.cursor.msg_text +"\n";
            }
       });
    }//GEN-LAST:event_formWindowOpened
}
