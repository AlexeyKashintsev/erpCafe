/**
 * @author minya92
 * @public
 * @stateless
 */
function SendChatMsg() {
    var self = this; var model = this.model;
    self.pusher = function(aMsg, aTag) {
        if(!aTag) aTag = "default";
        var pusher = com.eas.server.websocket.TaggedFeedEndPoint;
        pusher.broadcast(aTag, aMsg);
        var msg = JSON.parse(aMsg);
        model.qLastMessages.push({
            msg_text:   msg.text,
            user_name:  msg.user_name,
            msg_time:   new Date()
        });
        model.save();
    };
}
