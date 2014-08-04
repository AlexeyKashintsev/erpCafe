/**
 *
 * @author Alexey
 * @name qTradeSessionBalance
 */ 
Select * 
From trade_cash_box_balance t1
 Where :trade_session = t1.session_id