/**
 * @author mike
 * @public
 * @rolesAllowed admin franchazi
 * @name deleteUserFromTradePoint
 */
Select * 
From org_tp_users
where :user_name = org_tp_users.user_name 
