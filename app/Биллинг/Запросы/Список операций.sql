/**
 *
 * @public
 * @author minya92
 * @name qBillOperationsList
 * @writable bill_operations
 */ 
Select * 
From bill_operations t1
 Inner Join bill_operations_type t on t.bill_operations_type_id = t1.operation_type
 Where :operation_id = t1.bill_operations_id