/**
 *
 * @author Work
 * @name qGetBonusBill
 */ 
Select bill_accounts_id 
From bill_accounts t1
 Inner Join client_personal_data t on t1.client_id = t.client_id
 Where :phone = t.phone