/**
 * @name queryUsers
*/
Select t.usr_name, t.usr_form, t.usr_context, t.usr_roles, t.usr_phone, t.usr_email,
case when t.usr_passwd is null then 'Не установлен' else '***' end as usr_passwd
From MTD_USERS t