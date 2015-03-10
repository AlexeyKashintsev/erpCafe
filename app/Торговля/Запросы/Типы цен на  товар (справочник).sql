/**
 *
 * @author Work
 * @name qTradePriceTypes
 * @public
 */ 
Select * 
From trade_price_types t1
 Where :franchazi_id = t1.franchazi_id
 or t1.franchazi_id is null