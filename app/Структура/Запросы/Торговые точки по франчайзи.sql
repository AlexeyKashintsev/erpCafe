/**
 *
 * @author mike
 * @name listTradePoints
 * @public
 * @manual
 * @writable org_trade_point
 */ 
Select * 
From org_trade_point t1
 Left Join org_cities t on t1.tp_city = t.org_cities_id
 Where (:franchazi_id = t1.franchazi_id or :franchazi_id is null)
 and (:trade_point = t1.org_trade_point_id or :trade_point is null)