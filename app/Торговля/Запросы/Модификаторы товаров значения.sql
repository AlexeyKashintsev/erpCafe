/**
 *
 * @author Alexey
 * @name qModValues
 * @public
 */ 
Select * 
From items_mods_values t1
 Where (:modifier = t1.modifier or :modifier is null)
 and (:franchazi_id = t1.franchazi_id or :franchazi_id is null or t1.franchazi_id is null)
order by t1.display_value