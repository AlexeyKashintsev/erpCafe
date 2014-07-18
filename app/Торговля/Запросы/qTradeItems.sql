/**
 *
 * @author mike
 * @name qTradeItems
 */ 
Select *,
' ' as contents
From trade_items t1
 Where (:franchazi_id = t1.franchazi_id or :franchazi_id is null) and 
 (:item_type = t1.item_type or :item_type = 0)