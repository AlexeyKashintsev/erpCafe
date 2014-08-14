/**
 *
 * @author minya92
 * @name qAddBillOperations
 */ 
Select * 
From bill_operations t1
 Where :account_id = t1.account_id or :account_id is null