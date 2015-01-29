/**
 * @author minya92
 * @public
 * @stateless
 */
function SendChatMsg() {
    var self = this; var model = this.model;
    
    self.pusher = function(aMsg, aTag) {
        if(!aTag) aTag = "default";
        var msg = JSON.parse(aMsg);
        
        if(msg.online){
            if(msg.online < 0)
                Session.chat.usersCount--;
            else
                Session.chat.usersCount++;
            aMsg = JSON.stringify({
                online   :   Session.chat.usersCount
            });
        }
        
        var Pusher = com.eas.server.websocket.TaggedFeedEndPoint;
        Pusher.broadcast(aTag, aMsg);
        
        //Если пришло сообщение, записать в БД
        if(msg.text && msg.user_name){
            model.qLastMessages.push({
                msg_text:   msg.text,
                user_name:  msg.user_name,
                msg_time:   new Date()
            });
            model.save();
        }
        
    };
}
