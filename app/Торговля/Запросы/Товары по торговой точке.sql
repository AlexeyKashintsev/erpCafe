/**
 *
 * @author Alexey
 * @name tradeItemsByTP
 * @manual
 * @public
 * @rolesallowed admin franchazi barista
 * @writable trade_items_cost
 */ 
Select * 
From trade_items_on_tp tp
 Inner Join trade_items_cost t1 on t1.item_on_tp = tp.trade_items_on_tp_id
 Where (:item_id = tp.item_id or :item_id is null)
 and (:trade_point_id = tp.trade_point_id or (:trade_point_id is null and tp.trade_point_id is null))
 and (:actual_date >= t1.start_date)
 and (:actual_date < t1.end_date or t1.end_date is null)