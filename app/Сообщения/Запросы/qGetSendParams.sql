/**
 *
 * @author StipJey
 * @name qGetSendParams
 * @public
 */ 
Select * 
From msg_sms_types t1
 Inner Join msg_link_tags_and_types t on t.type_id = t1.sms_types_id
 Inner Join msg_tags t2 on t.tag_id = t2.msg_tags_id
 Where :eventType = t1.event_type or :eventType is null