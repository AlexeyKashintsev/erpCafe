/**
 *
 * @author Alexey
 * @name qItemsModifiersTypes
 * @public
 */ 
Select * 
From items_modifiers t1
 Where (:franchize_id = t1.franchize_id or :franchize_id is null or t1.franchize_id is null)
 and (:franchazi_id = t1.franchazi_id or :franchazi_id is null or t1.franchazi_id is null)
order by t1.modifier_name