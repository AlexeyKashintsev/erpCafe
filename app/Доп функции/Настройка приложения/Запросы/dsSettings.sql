/**
 *
 * @author Alexey
 * @name dsSettings
 * @manual
 */ 
Select * 
From adm_settings t1
 Where (:franchazi_id = t1.franchazi_id or t1.franchazi_id is null or :franchazi_id is null)
 and (:trade_point_id = t1.trade_point_id or :trade_point_id is null or t1.trade_point_id is null)
 and (:usr_name = t1.usr_name or :usr_name is null or t1.usr_name is null)