/**
 * @author minya92
 * @authorizer
 * @stateless
 */ 
function authorizer() {
    var self = this, model = this.model;

    /**
     * Проверяет, обладает ли пользователь указанной ролью.
     * Эта функция обязательна для модуля с аннотацией "authorizer".
     * @param {String} aUser Пользователь
     * @param {String} aRole Роль
     */
    self.isUserInRole = function(aUser, aRole){
        //WebSocket на котором чат висит
        if(aRole === "default")
            return true;
    };
}