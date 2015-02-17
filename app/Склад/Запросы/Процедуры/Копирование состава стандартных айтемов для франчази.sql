/**
 *
 * @author Alexey
 * @name qInsertDefaultItemsContents
 * @manual 
 */ 
Select nextval('def_sequence') AS trade_item_contents_id, t.wh_items_id AS trade_item
, t4.wh_items_id as wh_item, t1.usage_quantity 
From trade_items_contents t1
 Inner Join wh_items t2 on t.item_name = t2.item_name
 Inner Join wh_items t on t2.wh_items_id = t1.trade_item
 Inner Join wh_items t3 on t1.wh_item = t3.wh_items_id
 Inner Join wh_items t4 on t3.item_name = t4.item_name
 Where t.franchazi_id = :franchazi_id
 and :franchazi_id = t4.franchazi_id