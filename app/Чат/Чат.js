/**
 * @public
 * @author minya92
 * @module
 */ 
function MyChat(aContainer) {
    var self = this, model = this.model, form = this;
    var sendChatMsg = new ServerModule("SendChatMsg");
    var userSession = Session.get("UserSession");
   
    var chat = cmn.createElement('div', 'chat', aContainer);
    var msgArea = cmn.createElement('div', 'chat-msgarea', chat, 'chat-msgarea');
    var inputText = cmn.createElement('textarea', 'chat-input', chat, "chat-input");
    var btnSubmit = cmn.createElement('button', 'chat-btn', chat);
    
    $("#chat-input").attr('placeholder', 'Сообщение');
    
    var onlineDiv = cmn.createElement('div', 'chat-online', chat);
    var btnOnline = cmn.createElement('a', 'chat-btnonline', onlineDiv, 'chat-btnonline');
    var onlineCount = cmn.createElement('span', 'chat-onlinecount', onlineDiv);
    var usersOnline = cmn.createElement('span', 'chat-usersonline', onlineDiv, 'chat-usersonline');
    
    function btnOnlineShow(){
        $("#chat-usersonline").show();
        btnOnline.onclick = btnOnlineHide;
        sendChatMsg.pusher(JSON.stringify({
            joinUser   :   userSession.getUserName()
        }));
    }
    
    function btnOnlineHide(){
        $("#chat-usersonline").hide();
        btnOnline.onclick = btnOnlineShow;
    }
    
    $("#chat-btnonline").attr('href', '#');
    btnOnline.innerHTML = "Баристы онлайн:";
    btnOnline.onclick = btnOnlineShow;
    btnOnlineHide();
    
    
    
    
    
    function btnSubmitOnClick(){
        var text = $("#chat-input").val();
        if(!text || text == "\n"){
            $("#chat-input").val("");
            return false;
        }
        sendChatMsg.pusher(JSON.stringify({
            user_name   :   userSession.getUserName(),
            text        :   text    
        }));
        $("#chat-input").val("");
    }
    
    btnSubmit.innerHTML = "Отправить";
    btnSubmit.onclick = btnSubmitOnClick;
    
    function addMessage(aUserName, aMsg){
        var msg = cmn.createElement('div', 'msg', msgArea);
        msg.innerHTML = '<span class="chat-username">' + aUserName + ':</span> ' +
                        '<span class="chat-msg">' + aMsg + '</span>';
        document.getElementById('chat-msgarea').scrollTop += 300;
    }
    
    $("#chat-input").keyup(function(event){
        if(event.keyCode == 13) {
            btnSubmitOnClick();
        }
    });
    
    function setUsersOnline(aUsers, aCount){
        //alert(aCount);
        onlineCount.innerHTML = " " + aCount + "<br>";
        usersOnline.innerHTML = " ";
        for(var i in aUsers){
            if(aUsers[i])
                $("#chat-usersonline").append(aUsers[i] + ((i == aUsers.length-1) ? "" : ", "));
        }
    }
        
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
                 setUsersOnline(msg.users, msg.count);
        };
        
        webSocket.onclose = function() {
            sendChatMsg.pusher(JSON.stringify({
                lostUser   :   userSession.getUserName()
            }));
        };
    }
    
    self.initChat = function(){
        messageSender();
        
        msgArea.innerHTML = " ";
        model.qLastMessages.requery(function(){
            model.qLastMessages.afterLast();
            while(model.qLastMessages.prev()){
               addMessage(model.qLastMessages.cursor.user_name, model.qLastMessages.cursor.msg_text);
            }
       });
       
       sendChatMsg.pusher(JSON.stringify({
            joinUser   :   userSession.getUserName()
        }));
    };
    
    window.onbeforeunload = function () { 
        webSocket.close();
    };
}
