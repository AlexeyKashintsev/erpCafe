/**
 *
 * @author Alexey
 * @name qTradeTypesByItemId
 * @public
 */ 
Select * 
From trade_items_display_types t1
 Where :item_id = t1.trade_item