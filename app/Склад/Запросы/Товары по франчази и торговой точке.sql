/**
 * 
 * @author mike
 * @name itemsByTP
 * @public
 * @readonly
 */ 
Select t.trade_items_on_tp_id, t.trade_point_id, t.item_id, t2.item_name, t2.item_type, t2.franchazi_id, 
case when t2.item_measure is not null then t2.item_measure else null end as item_measure,
 null AS start_value, null as end_value
From trade_items_on_tp t
 Inner Join wh_items t2 on t.item_id = t2.wh_items_id
 Inner Join wh_item_types t1 on t2.item_type = t1.wh_item_types_id
 Where :trade_point_id = t.trade_point_id
 and (:franchazi_id is null or :franchazi_id = t2.franchazi_id)
 and t.wh_item = true
order by t2.item_name