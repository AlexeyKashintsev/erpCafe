/**
 *
 * @author StipJey
 * @name qPriceTypeForTradeItem
 * @public 
 * @readonly
*/ 
Select *
From trade_price_types t2
 Left Join #qTradeItemCostsOnTradePoint q on q.price_type = t2.trade_price_types_id