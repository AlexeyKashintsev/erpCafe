/**
 *
 * @author Alexey
 * @name tradeTypes4TP
 * @public
 */ 
Select t.type_name, t.trade_item_type_id, t.settings, t.parent_type, t3.classtag
From trade_items_cost t1
 Inner Join trade_items t2 on t2.trade_items_id = t1.item_id
 Inner Join trade_item_type t on t.trade_item_type_id = t2.item_type
 Left Join trade_item_settings t3 on t.settings = t3.trade_item_settings_id
 Where :franchazi_id = t1.franchazi_id
 and :trade_point_id = t1.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date <= t1.end_date or t1.end_date is null)
 and (:franchazi_id = t3.franchazi or t3.franchazi is null)
 Group by t.parent_type, t.settings, t.trade_item_type_id, t.type_name, t3.classtag