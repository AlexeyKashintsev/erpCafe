/**
 *
 * @author Alexey
 * @name tradeItemsCostByTP
 * @manual
 * @readonly
 * @public
 */ 
Select * 
From trade_items_cost t1
 Where (:item_id = t1.item_id or :item_id is null)
 and :trade_point_id = t1.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date < t1.end_date or t1.end_date is null)