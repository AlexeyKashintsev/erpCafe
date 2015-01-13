/**
 *
 * @author StipJey
 * @name qPriceTypeForTradeItem
 * @public 
 * @readonly
*/ 
Select * 
From trade_price_types t2
 Left Join trade_items_cost t1 on t1.price_type = t2.trade_price_types_id 
                                    and :actual_date >= t1.start_date
                                    and (:actual_date <= t1.end_date or t1.end_date is null)
 Left Join trade_items_on_tp t on t1.item_on_tp = t.trade_items_on_tp_id
                                    and :item_id = t.item_id
                                    and :trade_point = t.trade_point_id