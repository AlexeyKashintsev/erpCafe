/**
 * @author minya92
 * @public
 */
function MyChat(aContainer) {
    var self = this, model = this.model, form = this;
    var sendChatMsg = new ServerModule("SendChatMsg");
    var userSession = Session.get("UserSession");
   
    var chat = cmn.createElement('div', 'chat', aContainer);
    var onlineDiv = cmn.createElement('div', 'chat-online', chat);
    var whoOnline = cmn.createElement('span', 'chat-whoonline', onlineDiv);
    whoOnline.innerHTML = "Кто онлайн:";
    var onlineCount = cmn.createElement('span', 'chat-onlinecount', onlineDiv);
    var msgArea = cmn.createElement('div', 'chat-msgarea', chat);
    var inputText = cmn.createElement('textarea', 'chat-input', chat, "chat-input");
    var btnSubmit = cmn.createElement('button', 'chat-btn', chat);
    
    
    var webSocket = null;
    
    function messageSender() {
        
        if (webSocket) {
            webSocket.close();
            webSocket = null;
        }
        
        var wsProtocol = "ws:";
        if (window.location.protocol == 'https:')
            wsProtocol = "wss:";
        
        webSocket = new WebSocket(wsProtocol + "//" + window.location.host + window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/")) + "/taggedfeed");
        
        webSocket.onopen = function() {
            webSocket.send("default");
        };

        webSocket.onerror = function(aError) {};
        
        webSocket.onmessage = function(aEventData) {
            var msg = JSON.parse(aEventData.data);
            
            if(msg.user_name && msg.text) // пришло сообщение
                addMessage(msg.user_name, msg.text);
            else if(msg.users && msg.count)                        //Пришло кол-во людей
                 onlineCount.innerHTML = msg.count;
        };
        
        webSocket.onclose = function() {
            sendChatMsg.pusher(JSON.stringify({
                lostUser   :   userSession.getUserName()
            }));
        };
    }
    messageSender();
    
    window.onbeforeunload = function () { 
        webSocket.close();
    };
    
    function btnSubmitOnClick(){
        var text = $("#chat-input").val();
        if(!text)
            return false;
        sendChatMsg.pusher(JSON.stringify({
            user_name   :   userSession.getUserName(),
            text        :   text    
        }));
        $("#chat-input").val("");
    }
    
    btnSubmit.innerHTML = "Отправить";
    btnSubmit.onclick = btnSubmitOnClick;
    
    self.loadMessages = function(){
        msgArea.innerHTML = " ";
        model.qLastMessages.requery(function(){
            model.qLastMessages.afterLast();
            while(model.qLastMessages.prev()){
               addMessage(model.qLastMessages.cursor.user_name, model.qLastMessages.cursor.msg_text);
            }
       });
    };
    
    function addMessage(aUserName, aMsg){
        var msg = cmn.createElement('div', 'msg', msgArea);
        msg.innerHTML = '<span class="chat-username">' + aUserName + ':</span> ' +
                        '<span class="chat-msg">' + aMsg + '</span>';
    }
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
       
    }//GEN-LAST:event_formWindowOpened
}
