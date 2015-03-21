/**
 *
 * @author mike
 * @name updateItems
 * @manual
 */ 
select * from
 wh_session_balance w

  Inner Join #countItems q1
    on wh_session_balance.item_on_tp_id = q1.items_on_tp_id
    Where :session_id = w.session_id
