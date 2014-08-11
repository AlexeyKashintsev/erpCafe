/**
 *
 * @author Alexey
 * @name tradeSessionDetails
 * @public
 */ 
Select t1.org_session_id, t1.trade_point, t1.user_name, t1.start_date, t1.end_date
, t.start_value, t.end_value
, sum(t2.operation_sum) as operationsSum
, count(t2.operation_sum) as operationsCount
, count(t3.items_quantity) as soldItemsQuantity
From org_session t1
 Inner Join trade_cash_box_balance t on t.session_id = t1.org_session_id
 Inner Join trade_cash_box_operation t2 on t2.session_id = t1.org_session_id
 Inner Join trade_operations t3 on t3.cash_box_operation = t2.trade_cash_box_operation_id
 Where :session_id = t1.org_session_id
 or :trade_point_id = t1.trade_point
Group by t1.org_session_id, t1.trade_point, t1.user_name, t1.start_date, t1.end_date
, t.start_value, t.end_value