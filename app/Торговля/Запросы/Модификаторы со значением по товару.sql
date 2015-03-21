/**
 * 
 * @author Alexey
 * @name qItemsOnTpModifiersWithValues
 */ 
Select t.items_mods_id, t.show, t1.items_mods_values_id, t1.mod_value
, t1.display_value
From items_mods t
 Inner Join items_mods_values t1 on t.mod_value = t1.items_mods_values_id
 Where :item_on_tp = t.item_on_tp