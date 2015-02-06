/**
 *
 * @author Alexey
 * @name tradeSessionDetails
 * @public
 */ 
Select t1.org_session_id, t4.tp_name AS trade_point, t1.user_name
, to_char(t1.start_date, 'HH24:MM DD-MM-YYYY') AS start_date, to_char(t1.end_date, 'HH24:MM DD-MM-YYYY') AS end_date
, t.start_value, t.end_value, q.cash_sum, q.bonus_sum, q.bank_sum, q.takeback_sum
, q.cash_balance, q.cash_balance + t.start_value as current_cash
From org_session t1
 Left Join trade_cash_box_balance t on t.session_id = t1.org_session_id
 Inner Join org_trade_point t4 on t1.trade_point = t4.org_trade_point_id
 Inner Join #Объем_операций_по_сессии q on q.session_id = t1.org_session_id
 Where :session_id = t1.org_session_id
 and (:trade_point_id = t1.trade_point or :trade_point_id is null)