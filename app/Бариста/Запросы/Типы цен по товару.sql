/**
 *
 * @author StipJey
 * @name qPriceTypeForTradeItem
 * @public 
 * @readonly
*/ 
Select * 
From trade_price_types t2
 Left Join #qTradeItemCostsOnTradePoint t1 on t1.price_type = t2.trade_price_types_id