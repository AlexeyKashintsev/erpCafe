/**
 *
 * @author Alexey
 * @name qIncomePlan
 * @public
 */ 
Select * 
From rep_income_plan t1
 Where :trade_point_group = t1.trade_point_group
 or (:trade_point_group is null and t1.trade_point_group is null)