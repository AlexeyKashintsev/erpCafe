/**
 *
 * @author mike
 * @name listTradePoints
 */ 
Select * 
From org_trade_point t1
 Where :franchazi_id = t1.franchazi_id or :franchazi_id is null