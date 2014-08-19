/**
 *
 * @author stipjey
 * @name qBonusRateForItemsEdit
 * @writable bonus_rate_for_trade_items
 */ 
Select t.bonus_rate_for_trade_items_id, t2.category_description, t.bonus_rate
, t1.item_name, t.trade_item, t.client_bonus_category 
From trade_items t1
 Inner Join bonus_rate_for_trade_items t on t.trade_item = t1.trade_items_id
 Inner Join client_bonus_category t2 on t.client_bonus_category = t2.client_bonus_category_id
 Where (:item_id = t.trade_item or :item_id is null)
 and (:bonus_category = t.client_bonus_category or :bonus_category is null)
 and t.bonus_rate is not null