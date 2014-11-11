/**
 * @author minya92
 * @name qBillOperationsListServer
 * @writable bill_operations
 * @manual
 */ 
Select * 
From bill_operations t1
 Inner Join bill_operations_type t on t.bill_operations_type_id = t1.operation_type
 Inner Join bill_operations_status t2 on t2.bill_operations_status_id = t1.operation_status
 Where (:operation_id = t1.bill_operations_id or :operation_id is null)
 and (:account_id = t1.account_id or :account_id is null)
 and (:status = t1.operation_status or :status is null)
 and (:operation_id is not null or :account_id is not null or :status is not null)