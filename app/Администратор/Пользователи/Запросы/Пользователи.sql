/**
 * @name queryUsers
 * @public
*/
Select *,
case when t.usr_passwd is null then 'Не установлен' else '•••••••••••••' end as pswSet
From MTD_USERS t