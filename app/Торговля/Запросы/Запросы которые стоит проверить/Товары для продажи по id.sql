/**
 *
 * @author mike
 * @name qTradeItemsId
 * @public
 * @rolesallowed admin franchazi
 * TODO Найти альтернативу запросу
 */ 
Select * 
From wh_items t1
 Where :item_id = t1.wh_items_id