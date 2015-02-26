/**
 *
 * @author mike
 * @name qContentsOnTp
 * @public
 * @rolesallowed admin franchazi
 * @writable trade_items_contents
 */ 
Select t1.trade_item, t1.wh_item, t1.usage_quantity 
From trade_items_contents t1
 Inner Join trade_items_on_tp t2 on t2.item_id = t1.trade_item
 Where :trade_point_id = t2.trade_point_id