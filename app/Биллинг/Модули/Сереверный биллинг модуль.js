/**
 * 
 * @author minya92
 * @module
 */ 
function BillServerModule() {
    var self = this, model = this.model;
    var eventProcessor = new ServerModule("EventProcessor");
    self.paymentForServices = function(){
        var services_id = [];        
        model.qAddService.requery(function(){
            if(model.qAddService.length > 0){
                var i = 0;
                model.qAddService.beforeFirst();
                while(model.qAddService.next()){
                    model.params.service_id = model.qAddService.cursor.service_id;
                    model.qServiceList.requery(function(){
                        var pDate = new Date();
                        if(model.qServiceList.cursor.service_month){
                            pDate.setMonth(pDate.getMonth() + 1);
                        } else {
                            pDate.setDate(pDate.getDate() + model.qServiceList.cursor.service_days);
                        }
                        model.qAddService.cursor.payment_date = pDate;
                        self.addBillOperation(model.qAddService.cursor.account_id, self.OPERATION_DEL_SERVICE, model.qServiceList.cursor.service_sum, self.OP_STATUS_SUCCESS);               
                        services_id[i]=model.qAddService.cursor.bill_services_accounts_id;
                        i++;
                    });
                }
                Logger.info("Количество обратонных счетов: " + i);
                model.save();
            }
            eventProcessor.addEvent('paymentForServices', {
                date: new Date(),
                services_id: services_id
            });
        });
    };
}
