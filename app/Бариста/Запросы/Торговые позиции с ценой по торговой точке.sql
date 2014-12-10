/**
 *
 * @manual 
 * @author Alexey
 * @name TradeItemsByTradePointWithCost
 * @readonly
 * @public
TODO trade_item_type_id
 */ 
Select t1.item_id, t1.item_cost, t.item_name, t2.type_name, t2.trade_item_type_id
, case when t3.classtag is not null then t3.classtag else t4.classtag end as classtag
From trade_items_cost t1
 Inner Join wh_items t on t1.item_id = t.wh_items_id
 Inner Join trade_item_type t2 on t.item_type = t2.trade_item_type_id
 Left Join trade_item_settings t3 on t1.franchazi_id = t3.franchazi
                                and t1.settings = t3.trade_item_settings_id
 Left Join trade_item_settings t4 on t1.franchazi_id = t4.franchazi
                                and t2.settings = t4.trade_item_settings_id
 Where :franchazi_id = t1.franchazi_id
 and :trade_point_id = t1.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date <= t1.end_date or t1.end_date is null)