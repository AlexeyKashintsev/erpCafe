/**
 *
 * @author mike
 * @name listTradePoints
 * @public
 * @manual
 */ 
Select * 
From org_trade_point t1
 Where (:franchazi_id = t1.franchazi_id or :franchazi_id is null) and
 (:trade_point = t1.org_trade_point_id or :trade_point is null)