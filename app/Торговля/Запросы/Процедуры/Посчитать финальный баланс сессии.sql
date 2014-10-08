/**
 *
 * @author Алексей
 * @name prSetFinalBalance4CashBox
 * @manual
 */ 
Select * 
From trade_cash_box_balance
, #qCalculateCashForSession q
 Where :session_id = session_id
 and :session_id = trade_cash_box_balance.session_id