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
        
        var Pusher = com.eas.server.websocket.TaggedFeedEndPoint;
        Pusher.broadcast(aTag, aMsg);
        
        if(msg.lostUser){
            for(var i in Session.chat.users){
                if(Session.chat.users[i] == msg.lostUser){
                    delete(Session.chat.users[i]);
                    Session.chat.count--;
                }
            }
            aMsg = JSON.stringify({
                users   :   Session.chat.users,
                count   :   Session.chat.count
            });
            Pusher.broadcast(aTag, aMsg);
        }
        
        //Если пришло сообщение, записать в БД
        if(msg.text && msg.user_name){       
            model.qLastMessages.push({
                msg_text:   msg.text,
                user_name:  msg.user_name,
                msg_time:   new Date()
            });
            model.save();
            
            for(var i in Session.chat.users){
                if(Session.chat.users[i] == msg.user_name)
                    return true;    
            }
            Session.chat.users[Session.chat.users.length++] = msg.user_name;
            Session.chat.count++;
            aMsg = JSON.stringify({
                users   :   Session.chat.users,
                count   :   Session.chat.count
            });
            Pusher.broadcast(aTag, aMsg);
        }
        
    };
}
