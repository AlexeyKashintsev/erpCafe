/**
 *
 * @author minya92
 * @name qPaymentService
 */ 
Select * 
From bill_services_accounts t1
 Inner Join bill_item_cost t on t1.service_cost_id = t.bill_item_cost_id
 Where to_char(t1.payment_date, 'YY:MM:DD') = to_char(now(), 'YY:MM:DD')