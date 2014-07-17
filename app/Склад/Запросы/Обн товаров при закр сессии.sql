/**
 *
 * @author mike
 * @name updateItems
 * @manual
 */ 
select * from
 wh_session_balance w

  Inner Join #countItems q1
    on w.item_id = q1.item_id
    Where :session_id = w.session_id
