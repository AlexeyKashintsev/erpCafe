/**
 * @author minya92
 * @name qOrederItems
 * @readonly
 * @public
 */ 
Select * 
From bill_operations t1
 Inner Join bill_operations_status t2 on t2.bill_operations_status_id = t1.operation_status
 Inner Join bill_accounts t on t.bill_accounts_id = t1.account_id
 Inner Join org_franchazi t3 on t.franchazi_id = t3.org_franchazi_id
 Where ((:status = t1.operation_status) or (:status is null
 and (t1.operation_status is not null
 and t1.operation_status <> 1
 and t1.operation_status <> 2
 and t1.operation_status <> 3
 and t1.operation_status <> 8
 and t1.operation_status <> 9)))
 and (:franchazi_id = t.franchazi_id or :franchazi_id is null)