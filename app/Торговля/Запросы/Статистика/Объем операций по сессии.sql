/**
 *
 * @author Alexey
 * @name Объем_операций_по_сессии
 */ 
Select t1.session_id,
sum(case when t1.operation_type = 0 then t1.operation_sum else 0 end) as cash_sum,
sum(case when t1.operation_type = 1 then t1.operation_sum else 0 end) as bonus_sum,
sum(case when t1.operation_type = 10 then t1.operation_sum else 0 end) as bank_sum,
sum(case when t1.operation_type = 101 then t1.operation_sum else 0 end) as takeback_sum,
sum(t1.operation_sum * t.cash_multiplier) as cash_balance
From trade_cash_box_operation t1
 Inner Join trade_cash_box_operation_types t on t1.operation_type = t.trade_cash_box_operation_types_id
 Where :session_id = t1.session_id
group by t1.session_id