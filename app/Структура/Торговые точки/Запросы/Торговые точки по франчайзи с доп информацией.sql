/**
 *
 * @author mike
 * @name listTPwAdI
 * @manual 
 * @public
 * @readonly
 * @rolesAllowed admin, franchazi
 */ 
Select q.tp_name, q.tp_address, q.start_date, q.end_date, q.user_name
, t.start_value, t.end_value, sum(t2.operation_sum) AS operationsSum
, count(t2.operation_sum) AS operationsCount, sum(t3.items_quantity) AS soldItemsQuantity 
From #qOpenedOrLastSessionFranchazi q
 Left Join trade_cash_box_balance t on t.session_id = q.org_session_id
 Left Join trade_cash_box_operation t2 on t2.session_id = q.org_session_id 
 Left Join trade_operations t3 on t3.cash_box_operation = t2.trade_cash_box_operation_id
 and t.session_id = q.org_session_id
 Group by q.tp_name, q.tp_address, q.start_date, q.end_date, q.user_name, t.start_value, t.end_value