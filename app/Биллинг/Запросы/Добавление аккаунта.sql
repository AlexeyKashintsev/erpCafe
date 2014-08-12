/**
 *
 * @author minya92
 * @name qAddBillAccount
 */ 
Select * 
From bill_accounts t1
 Where (:franchazi_id = t1.franchazi_id or :franchazi_id is null)
 and (:account_type = t1.account_type or :account_type is null)