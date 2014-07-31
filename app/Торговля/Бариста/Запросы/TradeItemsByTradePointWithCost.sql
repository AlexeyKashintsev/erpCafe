/**
 *
 * @manual 
 * @author Alexey
 * @name TradeItemsByTradePointWithCost
 * @readonly
 */ 
Select t1.item_id, t1.item_cost, t.item_name, t2.type_name
From trade_items_cost t1
 Inner Join trade_items t on t1.item_id = t.trade_items_id
 Inner Join trade_item_type t2 on t.item_type = t2.trade_item_type_id
 Left Join trade_item_settings t3 on t1.franchazi_id = t3.franchazi
 and (t1.settings = t3.trade_item_settings_id or t2.settings = t3.trade_item_settings_id)
 Where :franchazi_id = t1.franchazi_id
 and :trade_point_id = t1.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date = t1.end_date or t1.end_date is null)