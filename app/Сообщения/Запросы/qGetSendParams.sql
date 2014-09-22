/**
 *
 * @author StipJey
 * @name qGetSendParams
 * @public
 */ 
Select * 
From sms_types t1
 Where :eventType = t1.event_type or :eventType is null