/**
 * 
 * @author Alexey
 * @name qInsertDefaultBonusRates
 * @manual
 */
Select nextval('def_sequence') AS bonus_rate_for_trade_items_id, t.wh_items_id AS trade_item
, t1.client_bonus_category, t1.bonus_rate, t1.type_id
From bonus_rate_for_trade_items t1
 Inner Join wh_items t2 on t2.wh_items_id = t1.trade_item
 Inner Join wh_items t on t.item_name = t2.item_name and t2.franchazi_id is null
    and (t2.franchize_id = :franchize_id or :franchize_id is null)
 Where t.franchazi_id = :franchazi_id