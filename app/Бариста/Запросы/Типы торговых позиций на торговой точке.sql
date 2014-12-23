/**
 *
 * @author Alexey
 * @name tradeTypes4TP
 * @manual
 */ 
Select q1.item_type
From #tradeItemsCostByTP q1
group by q1.item_type