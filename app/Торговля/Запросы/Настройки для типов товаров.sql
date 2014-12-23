/**
 *
 * @author Alexey
 * @name qTradeItemOrTypeSettings
 * @readonly
 */ 
Select t1.item_id, t1.classtag, t1.style_prop
From trade_item_settings t1
left join org_trade_point t on t.franchazi_id = t1.franchazi_id
    and :trade_point_id = t.org_trade_point_id
 Where (:franchazi_id = t1.franchazi_id or t1.franchazi_id is null or t.franchazi_id = t1.franchazi_id)
 and (:type_id = t1.type_id or :item_id = t1.item_id or (:item_id is null and :type_id is null))
 Order by t1.franchazi_id, item_id desc
 Limit 1