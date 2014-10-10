/**
 *
 * @author Алексей
 * @name qIncomeBySessions
 */ 
Select org_session_id, q.user_name, trade_point
, start_date, end_date, sum() AS recieved_cash
, sum() AS recieved_bonuses, sum() AS recieved_by_card, count(*) AS operations_count 
From trade_cash_box_operation t
 Left Join #qSessionsInPeriod q on q.org_session_id = t.session_id
 Where (:trade_point is null)
 Group by org_session_id, q.user_name, trade_point, start_date, end_date