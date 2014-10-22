/**
 * @author minya92
 * @name qBillAccountServer
 */ 
Select * 
From bill_accounts t1
 Where ((:franchazi_id = t1.franchazi_id or :franchazi_id is null) and t1.active = true)
 and ((:account_id = t1.bill_accounts_id or :account_id is null) and t1.active = true)
 and ((:type = t1.account_type or :type is null) and t1.active = true)