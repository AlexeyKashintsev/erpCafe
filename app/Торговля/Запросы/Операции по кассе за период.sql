/**
 *
 * @author Alexey
 * @name qCashBoxOperationsByPeriod
 */ 
Select * 
From trade_cash_box_operation t1
 Inner Join org_session t on t1.session_id = t.org_session_id
 Where (:tradePointId = t.trade_point 
 and :startDate > t1.operation_date
 and :endDate <= t1.operation_date)
 or :sessionId = t.org_session_id
 