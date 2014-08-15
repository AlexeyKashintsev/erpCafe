/**
 *
 * @author minya92
 * @name qBillAccount
 */ 
Select * 
From bill_accounts t1
 Where ((:user_id = t1.user_id or :user_id is null) and t1.active = true)
 and ((:account_id = t1.bill_accounts_id or :account_id is null) and t1.active = true)