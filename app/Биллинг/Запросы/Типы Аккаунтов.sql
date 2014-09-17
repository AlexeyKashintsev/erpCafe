/**
 *
 * @author minya92
 * @name qAccountType
 * @public
 */ 
Select * 
From bill_account_types t1
 Where :type_id = t1.bill_account_types_id or :type_id is null