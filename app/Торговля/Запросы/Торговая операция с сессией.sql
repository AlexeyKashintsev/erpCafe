/**
 *
 * @author stipjey
 * @name qTradeOperationBySession
 */ 
Select * 
From trade_cash_box_operation t1
 Where :session_id = t1.session_id