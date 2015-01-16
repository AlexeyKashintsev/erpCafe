/**
 *
 * @author mike
 * @name qTradeItemsId
 * @public
 * @rolesallowed admin franchazi
 */ 
Select * 
From wh_items t1
 Where  (:item_id = t1.wh_items_id or :item_id is null)
 and    (:item_type = t1.item_type or :item_type is null)