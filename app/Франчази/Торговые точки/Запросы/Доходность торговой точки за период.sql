/**
 *
 * @author Alexey
 * @name qTradePointIncomeByPeriod
 * @public
 * @manual
 */ 
Select null AS d_value, null AS period_v, q.operation_sum AS sm 
From trade_cash_box_operation t
 Inner Join org_session t2 on t2.org_session_id = t.session_id
 Where t.operation_sum = q.operation_sum
 and :begDate = t.operation_date
 and :g_value = t2.user_name
 and :trade_point_id = t2.trade_point