/**
 *
 * @author Alexey
 * @name trade_operation_types
 * @public
 */ 
Select * 
From trade_cash_box_operation_types t1
where :only_input = t1.cash_multiplier;