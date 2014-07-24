/**
 * @name queryUsers
 * @public
*/
Select *,
(case 
    when t.usr_passwd is null
    then 'Не установлен'     
    else '•••••••••••••' 
end) as pswSet,
(case 
    when t.usr_passwd = 'false'
    then true     
    else false 
end) as usrBlock
From MTD_USERS t
