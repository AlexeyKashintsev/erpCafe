/**
 * @author minya92
 * @name qLastMessages
 * @public
 */ 
Select * 
From chat_messages t1
 Order by msg_time desc
 Limit 15