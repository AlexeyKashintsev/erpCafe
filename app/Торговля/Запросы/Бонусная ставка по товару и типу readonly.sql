/**
 * @public
 * @author minya92
 * @name qBonusCountForTradeItemReadonly
 * @readonly
 */ 
Select * 
From bonus_rate_for_trade_items t1
 Where (:trade_item = t1.trade_item or :trade_item is null)
 and (:trade_type = t1.type_id or :trade_type is null)