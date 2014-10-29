/**
 * Модуль, содержащий функции обработки данных о платежах, приходящих от внешних систем.
 * @author ml
 * @module
 */ 
function PaymentsUtils() {
    var self = this, model = this.model;
    model.dsSubscriber.manual = true;
    model.dsExistingOperationByPayment.manual = true;
    model.dsSubscriberByInn.manual = true;
    
    /**
     * Проверяет, существует ли абонент с идентификатором aSubscriber.
     * @param {Number} aSubscriber Идентификатор абонента.
     * @return {Boolean} <code>true</code> - если абонент с указанным идентификатором существует, 
     * иначе - <code>false</code>.
     */
    this.isSubscriberExist = function(aSubscriber) {
        model.dsSubscriber.params.subscriber = aSubscriber;
        model.dsSubscriber.requery();
        return !model.dsSubscriber.empty;
    };
    
    /**
     * Ищет в истории платежных операций запись о зачислении, созданную ранее на основе
     * полученной от внешней системы информации о платеже.
     * @param {Number} aSubscriber Идентификатор абонента.
     * @param {Number} aSystem Идентификатор внешней системы - источника информации о платеже.
     * @param {String} anId Идентификатор платежа во внешней системе.
     * @param {Date|null} aDate Дата получения платежа внешней системой.
     * @return {Number|null} Идентификатор платежной операции в нашем сервисе, если операция найдена,
     *  иначе - <i>null</i>.
     */
    this.findOperationByPayment = function(aSubscriber, aSystem, anId, aDate) {
        var lDs = model.dsExistingOperationByPayment;
        lDs.params.subscriber = aSubscriber;
        lDs.params.payment_system = aSystem;
        lDs.params.payment_id = anId;
        lDs.params.payment_date = aDate;
        lDs.requery();
        return !lDs.empty ? lDs.cursor.tr_payment_operations_id : null;
    }; 
    
    /**
     * Определяет, является ли абонент юридическим лицом.
     * @param {Number} aSubscriber Идентификатор абонента.
     * @returns {Boolean} <code>true</code>, если абонент 
     * является юридическим лицом, иначе <code>false</code>.
     */
    this.isJuridicalPerson = function(aSubscriber){
        model.dsSubscriber.params.subscriber = aSubscriber;
        model.dsSubscriber.requery();
        return !!(model.dsSubscriber.cursor && model.dsSubscriber.cursor.inn);        
    };
    
    /**
     * Получает иденттификатор абонента по ИНН.
     * @param {String} anINN ИНН абонента.
     * @returns {Number|null} Идентификатор абонента, которому пренадлежит ИНН.
     * Если абонент не найден, то - <code>null</code>.
     */
    this.getSubscriberByINN = function(anINN){
        model.dsSubscriberByInn.params.inn = anINN;
        model.dsSubscriberByInn.requery();
        return !model.dsSubscriberByInn.empty ? model.dsSubscriberByInn.cursor.tr_agents_id : null;
    };    
    
}
