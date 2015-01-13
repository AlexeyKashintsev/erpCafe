/**
 *
 * @author minya92
 * @name qPriceTypeForTradeItem
 */ 
Select * 
From trade_items_on_tp t1
 Inner Join trade_items_cost t on t1.trade_items_on_tp_id = t.item_on_tp
 Inner Join trade_price_types t2 on t.price_type = t2.trade_price_types_id
 Where (:item_id = t1.item_id)
 and :actual_date >= t.start_date
 and (:actual_date < t.end_date or t.end_date is null)