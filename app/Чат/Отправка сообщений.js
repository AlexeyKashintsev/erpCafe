/**
 * @author minya92
 * @public
 * @stateless
 */
function SendChatMsg() {
    var self = this; var model = this.model;
    self.pusher = function(aMsg, aTag) {
        if(!aTag) aTag = "MyTag";
        var pusher = com.eas.server.websocket.TaggedFeedEndPoint;
        pusher.broadcast(aTag, aMsg);
        model.qLastMessages.push({
            msg_text:   aMsg,
            user_name:  principal.name,
            msg_time:   new Date()
        });
        model.save();
    };
}
