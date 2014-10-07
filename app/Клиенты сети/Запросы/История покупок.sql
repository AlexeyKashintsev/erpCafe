/**
 *
 * @author Work
 * @name qGetSumAndBonusesFromTradeOperation
 * @public
 * @readonly
 */ 
Select t1.operation_sum * t3.multiplier AS bonusCount, t.operation_sum * t4.cash_multiplier AS moneyCount, t.operation_date AS opDate 
From bill_operation_trade_operations_connect t2
 Inner Join bill_operations t1 on t2.bill_operation = t1.bill_operations_id
 Inner Join trade_cash_box_operation t on t2.trade_cashbox_operation = t.trade_cash_box_operation_id
 Inner Join bill_operations_type t3 on t3.bill_operations_type_id = t1.operation_type
 Inner Join trade_cash_box_operation_types t4 on t4.trade_cash_box_operation_types_id = t.operation_type
 Where t1.account_id = :account_id