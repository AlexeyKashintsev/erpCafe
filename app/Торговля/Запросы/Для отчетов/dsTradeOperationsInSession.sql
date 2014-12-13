/**
 *
 * @author Alexey
 * @name dsTradeOperationsInSession
 * @public
 * @readonly
 */ 
Select t1.trade_cash_box_operation_id, t1.user_name, t1.operation_date
, t1.operation_sum, t2.type_name, t3.item_name
, t.items_quantity, t3.item_measure 
From trade_cash_box_operation t1
 Inner Join trade_cash_box_operation_types t2 on t1.operation_type = t2.trade_cash_box_operation_types_id
 Inner Join trade_operations t on t.cash_box_operation = t1.trade_cash_box_operation_id
 Inner Join wh_items t3 on t.trade_item = t3.wh_items_id
 Where :session_id = t1.session_id