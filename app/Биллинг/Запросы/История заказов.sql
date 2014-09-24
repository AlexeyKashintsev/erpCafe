/**
 * @author minya92
 * @name qHistoryOrders
 * @readonly
 * @public
 */ 
Select * 
From bill_operations t1
 Inner Join bill_operations_status t2 on t2.bill_operations_status_id = t1.operation_status
 Inner Join bill_accounts t on t.bill_accounts_id = t1.account_id
 Where ((:status = t1.operation_status) or (:status is null and (t1.operation_status = 4 or t1.operation_status = 5 or t1.operation_status = 6)))
 and (:franchazi_id = t.user_id or :franchazi_id is null)