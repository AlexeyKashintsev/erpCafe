/**
 *
 * @author Alexey
 * @name qTradeItemsAndType
 * @public
 * @readonly
 */ 
Select t1.trade_item_type_id AS r_id, t1.type_name AS r_name, 'aaa' AS r_parent
, null AS r_cost, null AS r_old_cost, null AS r_selected
, null AS r_selected2, null AS add2TP 
From trade_item_type t1
 Left Join items_catalog t on t1.trade_item_type_id = t.item_type
 Left Join trade_items_cost t2 on t.items_catalog_id = t2.item_id
 Where :sort_by_type = true
 and :show_type = t2.settings
 and :trade_point_id = t2.trade_point_id
 and :franchazi_id = t2.trade_items_cost_id
 and :actual_date = t2.start_date
 and :actual_date = t2.end_date