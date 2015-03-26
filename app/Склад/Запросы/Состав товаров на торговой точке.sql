/**
 *
 * @author mike
 * @name qContentsOnTp
 * @public
 * @rolesallowed admin franchazi
 * @writable trade_items_contents
 */ 
Select t2.items_on_tp_id as item_on_tp_id, t1.trade_item, t1.wh_item
, t3.items_on_tp_id as content_item_id, t1.usage_quantity 
From trade_items_contents t1
 Inner Join items_on_tp t2 on t2.item_id = t1.trade_item
 Left Join items_on_tp t3 on t3.item_id = t1.wh_item
 Where :trade_point_id = t2.trade_point_id