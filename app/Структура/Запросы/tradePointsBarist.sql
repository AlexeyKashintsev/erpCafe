/**
 *
 * @author mike
 * @name tradePointsBarist
 */ 
Select * ,
case 
    when trade_point_id = org_trade_point_id
    then true    
    else false
end as onPoint,
case 
    when trade_point_id = org_trade_point_id
    then true    
    else false
end as onPointHidden
From org_trade_point t1
 Left Join org_tp_users t on (t.trade_point_id = t1.org_trade_point_id and t.user_name = :usr_name)
 Where :franchazi_id = t1.franchazi_id 