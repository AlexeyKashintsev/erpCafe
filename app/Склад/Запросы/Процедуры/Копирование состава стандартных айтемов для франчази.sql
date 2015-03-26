/**
 *
 * @author Alexey
 * @name qInsertDefaultItemsContents
 * @manual 
 */ 
Select nextval('def_sequence') AS trade_items_contents_id, t.items_catalog_id AS trade_item
, t4.items_catalog_id as wh_item, t1.usage_quantity 
From trade_items_contents t1
 Inner Join items_catalog t2 on t.item_name = t2.item_name
 Inner Join items_catalog t on t2.items_catalog_id = t1.trade_item and t2.franchazi_id is null
    and (t2.franchize_id = :franchize_id or :franchize_id is null)
 Inner Join items_catalog t3 on t1.wh_item = t3.items_catalog_id
 Inner Join items_catalog t4 on t3.item_name = t4.item_name
 Where t.franchazi_id = :franchazi_id
 and :franchazi_id = t4.franchazi_id