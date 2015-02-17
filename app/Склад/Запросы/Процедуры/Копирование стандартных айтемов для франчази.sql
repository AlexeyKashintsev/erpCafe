/**
 * @author minya92
 * @name qInsertDefaultItems
 * @manual
 */
Select nextval('def_sequence') as wh_item_id, item_name, item_type
, :franchazi_id as franchazi_id, item_measure, franchize_id, bar_code
, item_description, item_picture
 from wh_items
 where franchazi_id is null