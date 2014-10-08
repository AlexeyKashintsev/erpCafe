/**
 *
 * @author Алексей
 * @name qTradeSessionsInPeriod
 * @public
 */ 
Select * 
From #qIncomeBySessions q
 Left Join trade_cash_box_balance t2 on t2.session_id = q.org_session_id
order by session_id