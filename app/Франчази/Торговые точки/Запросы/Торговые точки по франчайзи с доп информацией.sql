/**
 *
 * @author ak, mike
 * @name listTPwAdI
 * @manual 
 * @public
 * @readonly
 * @rolesAllowed admin, franchazi
 */ 
Select q.org_trade_point_id, q.tp_name, q.tp_address
, q.start_date, q.end_date, q.user_name, q.org_session_id
, t.start_value, t.end_value, sum(t2.operation_sum * t1.cash_multiplier) AS operationsSum
, sum(t2.operation_sum * t1.income_multiplier) AS incomeSum
, count(t2.operation_sum) AS operationsCount 
From #qOpenedOrLastSessionFranchazi q
 Left Join trade_cash_box_balance t on t.session_id = q.org_session_id
 Left Join trade_cash_box_operation t2 on t2.session_id = q.org_session_id
    and t.session_id = q.org_session_id
 Left Join trade_cash_box_operation_types t1 on t2.operation_type = t1.trade_cash_box_operation_types_id
 Group by q.org_trade_point_id, q.tp_name, q.tp_address, q.start_date, q.end_date, q.user_name, t.start_value, t.end_value, q.org_session_id