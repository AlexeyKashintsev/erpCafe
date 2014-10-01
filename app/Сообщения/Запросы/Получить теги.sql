/**
 *
 * @author Work
 * @name qGetTagsForEvent
 */ 
Select t2.tag, t2.tag_description
From msg_link_tags_and_types t1
 Inner Join msg_sms_types t on t1.type_id = t.sms_types_id
 Inner Join msg_tags t2 on t1.tag_id = t2.msg_tags_id
 Where :event = t.event_type