/**
 *
 * @author Алексей
 * @name qIncomeBySessions
 */ 
Select org_session_id, user_name, trade_point, start_date, case when end_date is null then 0 else end_date end as end_date
, sum(Case  When t.operation_type = 0 Then t.operation_sum Else 0 End) AS recieved_cash
, sum(Case  When t.operation_type = 1 Then t.operation_sum else 0 End) AS recieved_bonuses
, sum(Case  When t.operation_type = 10 Then t.operation_sum else 0 End) AS recieved_by_card
, count(*) as operations_count
From org_session t1
 Left Join trade_cash_box_operation t on t1.org_session_id = t.session_id
 Where (to_timestamp(:start_date/1000) <= t1.end_date or t1.end_date is null)
 and to_timestamp(:end_date/1000) >= t1.start_date
 and (:trade_point = t1.trade_point or :trade_point is null)
 Group by org_session_id, user_name, trade_point, start_date, end_date