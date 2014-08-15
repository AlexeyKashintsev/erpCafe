/**
 *
 * @author minya92
 * @name qAddService
 */ 
Select * 
From bill_services_accounts t1
where to_char(t1.payment_date, 'YY:MM:DD') = to_char(now(), 'YY:MM:DD')