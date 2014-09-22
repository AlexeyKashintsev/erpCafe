/**
 *
 * @author StipJey
 * @name qGetSendParams
 */ 
Select * 
From sms_types t1
 Where :eventType = t1.event_type