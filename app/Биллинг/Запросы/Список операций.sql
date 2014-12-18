/**
 * @public
 * @author minya92
 * @name qBillOperationsList
 * @readonly
 * @public
 * @manual
 */ 
Select * 
From bill_operations t1
 Inner Join bill_operations_type t on t.bill_operations_type_id = t1.operation_type
 Inner Join bill_operations_status t2 on t2.bill_operations_status_id = t1.operation_status
 Inner Join bill_accounts t3 on t1.account_id = t3.bill_accounts_id
 Inner Join org_franchazi t4 on t3.franchazi_id = t4.org_franchazi_id
 Where (:operation_id = t1.bill_operations_id or :operation_id is null)
 and (:account_id = t1.account_id or :account_id is null)
 and (:status = t1.operation_status or :status is null or :status = 0)