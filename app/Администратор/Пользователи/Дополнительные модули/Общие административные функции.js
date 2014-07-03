/**
 * Platypus module script.
 * @name 132134448146809
 * Script may be used as library, form or report module, server module and etc.
 */

/**
 * Общие административные функции.js
 *
 * Created on 14.09.2011, 15:33:24
 */

/**
 *
 * @author mg
 */

/**
 * Возвращает сотрудника, к которому прикреплен пользователь, от имени которого прооисходит работа приложения.
 */

function loggedInEmployee()
{
    parUserName = model.client.loginPrincipal.name;
    if(!dsEployees.isEmpty())
        return dsEployees.TR_STAFF_ID;
    else
    {
        Logger.severe("No employee for logged in user: "+parUserName);
        return null;
    }
}

/**
 * Возвращает подразделение(контрагента), к которому принадлежит сотрудник, к которому прикреплен пользователь,
 * от имени которого прооисходит работа приложения.
 */
function loggedInAgent()
{
    parUserName = model.client.loginPrincipal.name;
    if(!dsEployees.isEmpty())
        return dsEployees.AGENT;
    else
    {
        Logger.severe("No employee for logged in user: "+parUserName);
        return null;
    }
}

function canSwapFrames(formId){
    var date = new Date();
    if (date > Date.parse("30 Dec 2012 10:12")){
        return true;
    }
    return false;
}

