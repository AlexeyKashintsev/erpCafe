/**
 * 
 * @author minya92
 * @module
 */ 
function BillServerModule() {
    var self = this, model = P.loadModel(this.constructor.name);
    var eventProcessor = new ServerModule("EventProcessor");
    var billModule = new ServerModule("BillModule");
    /*
     * Списание абонентской платы 
     */
    self.paymentForServices = function(){
        var services_id = [];        
        model.qPaymentService.requery(function(){
            if(model.qPaymentService.length > 0){
                var i = 0;
                model.qPaymentService.beforeFirst();
                while(model.qPaymentService.next()){
                    model.params.service_id = model.qPaymentService.cursor.service_id;
                    model.qServiceList.requery(function(){
                        var pDate = new Date();
                        if(model.qServiceList.cursor.service_month){
                            pDate.setMonth(pDate.getMonth() + 1);
                        } else {
                            pDate.setDate(pDate.getDate() + model.qServiceList.cursor.service_days);
                        }
                        model.qPaymentService.cursor.payment_date = pDate;
                        billModule.addBillOperation(model.qPaymentService.cursor.account_id, billModule.OPERATION_DEL_SERVICE, model.qServiceList.cursor.service_sum, billModule.OP_STATUS_SUCCESS);               
                        services_id[i]=model.qPaymentService.cursor.bill_services_accounts_id;
                        i++;
                    });
                }
                Logger.info("Количество обработанных счетов: " + i);
                model.save();
            }
            eventProcessor.addEvent('paymentForServices', {
                date: new Date(),
                services_id: services_id
            });
        });
    };
}
