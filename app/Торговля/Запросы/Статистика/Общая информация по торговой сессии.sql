/**
 *
 * @author Alexey
 * @name tradeSessionDetails
 * @public
 */ 
Select t1.org_session_id, t4.tp_name as trade_point, t1.user_name
, to_char(t1.start_date, 'HH24:MM DD-MM-YYYY') as start_date
, to_char(t1.end_date, 'HH24:MM DD-MM-YYYY') as end_date
, t.start_value
, t.end_value, sum(t2.operation_sum) AS operationsSum, count(t2.operation_sum) AS operationsCount
From org_session t1
 Left Join trade_cash_box_balance t on t.session_id = t1.org_session_id
 Left Join trade_cash_box_operation t2 on t2.session_id = t1.org_session_id
 Inner Join org_trade_point t4 on t1.trade_point = t4.org_trade_point_id
 Where :session_id = t1.org_session_id
 and (:trade_point_id = t1.trade_point or :trade_point_id is null)
 Group by t1.org_session_id, t4.tp_name, t1.user_name, t1.start_date, t1.end_date, t.start_value, t.end_value