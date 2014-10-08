/**
 *
 * @author Алексей
 * @name qCalculateCashForSession
 */ 
Select sum(t1.operation_sum * t.cash_multiplier) as operation_sum
From trade_cash_box_operation t1
 Inner Join trade_cash_box_operation_types t on t1.operation_type = t.trade_cash_box_operation_types_id
 Where :session_id = t1.session_id