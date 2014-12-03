/**
 * @public
 * @author minya92
 * @name qListCheklist
 */ 
Select * 
From cheklist_data t1
 Where (:checklist_id = t1.cheklist_data_id or :checklist_id is null)
 and (:type = t1.cheklist_type or :type is null)
 and (:franchazi_id = t1.franchazi_id or :franchazi_id is null)