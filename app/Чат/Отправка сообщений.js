/**
 * @author minya92
 * @public
 * @stateless
 */
function SendChatMsg() {
    var self = this; var model = this.model;
    
    self.pusher = function(aMsg, aTag) {
        if(!aTag) aTag = "default";
        var Pusher = com.eas.server.websocket.TaggedFeedEndPoint;
        var msg = JSON.parse(aMsg);
        msg.time = new Date();
        
        //Если пришло сообщение, записать в БД
        if(msg.text && msg.user_name){    
            model.qLastMessages.push({
                msg_text:   msg.text,
                user_name:  msg.user_name,
                msg_time:   msg.time
            });
            model.save();
            Pusher.broadcast(aTag, JSON.stringify(msg));
        }
        
        if(msg.lostUser){
            for(var i in Session.chat.users){
                if(Session.chat.users[i] == msg.lostUser){
                   // Session.chat.users[i] = undefined;
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
        
        if(msg.joinUser){
            for(var i in Session.chat.users){
                if(Session.chat.users[i] == msg.joinUser){
                    pushUsersOnline();
                    return true; 
                }
            }
            Session.chat.users[Session.chat.users.length++] = msg.joinUser;
            Session.chat.count++;
            aMsg = JSON.stringify({
                users   :   Session.chat.users,
                count   :   Session.chat.count
            });
            Pusher.broadcast(aTag, aMsg);
        }
        
        function pushUsersOnline(){
            aMsg = JSON.stringify({
                users   :   Session.chat.users,
                count   :   Session.chat.count
            });
            Pusher.broadcast(aTag, aMsg);
        }
        
    };
}
