/**
 * 
 * @author mike
 * @name qWhItemsOnTP
 * @public
 * @readonly
 */ 
Select t.items_on_tp_id, t.trade_point_id, t.item_id, t2.item_name, t.short_string
, t2.item_name || ' ' || t.short_string as full_string
, t2.item_type, t2.franchazi_id, t.trade_item, t.wh_item, t.wh_content
, case when t2.item_measure is not null then t2.item_measure else null end as item_measure
, null AS start_value, null as end_value
From items_on_tp t
 Inner Join items_catalog t2 on t.item_id = t2.items_catalog_id
 Inner Join items_types t1 on t2.item_type = t1.items_types_id
 Where :trade_point_id = t.trade_point_id
 and (:franchazi_id is null or :franchazi_id = t2.franchazi_id)
 and t.wh_item = true
order by t2.item_name