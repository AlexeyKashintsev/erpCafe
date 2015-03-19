/**
 * @author mike
 * @name queryItemsInWH
 * @public
 */ 
Select * 
From items_on_tp t1
 Where :warehouse_id = t1.trade_point_id