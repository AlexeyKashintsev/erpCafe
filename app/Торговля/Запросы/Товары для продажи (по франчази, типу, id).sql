/**
 *
 * @author mike
 * @name qTradeItems
 * @public
 * @rolesallowed admin franchazi
 */ 
Select * 
From wh_items t1
 Where (:franchazi_id = t1.franchazi_id or t1.franchazi_id is null)
 and (:item_type = t1.item_type or :item_type is null or :item_type = 0)
 and (:item_id = t1.wh_items_id or :item_id is null)