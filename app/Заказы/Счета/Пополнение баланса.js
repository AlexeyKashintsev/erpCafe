/**
 * @module
 * @author minya92
 * @public
 */
function AddBalance(anAccountId) {
    var self = this, model = this.model, form = this;
    var userSession = new ServerModule("UserSession");
    var billModule  = new ServerModule("BillModule");
    units.billApi = new ServerModule('BillApi');
    
    function yandexSubmitOnClick(){
        var sum = $("#sum").val() * 1;
        if(!sum){
            alert("Некреектная сумма!");
            return false;
        }
        if($("#paymentType").prop("checked")){
            createBill(sum);
            return true;
        }
        var billOperation = billModule.addBillOperation(anAccountId, billModule.getSelfPropertyValue("OPERATION_ADD_CASH"), sum, billModule.getSelfPropertyValue("OP_YANDEX_CREATE"));
        if(billOperation){
            $("#billOperation").val(billOperation);
            $("#form").submit();
        } else
            alert("Не удалось провести операцию. Повторите запрос позже!");
    }
    
    self.manualShow = function (){
        if(anAccountId){
            var modal = new cmn.Modal("Пополнение лицевого счета");
            var modalBody = modal.getModalBody();
            var yandexForm = cmn.createElement("div", "yandexForm", modalBody, "yandexForm");
            $.get("/erpCafe/yandex.html", {}, function(data){
                yandexForm.innerHTML = " ";
                yandexForm.innerHTML = data;
                document.getElementById('submit').onclick = yandexSubmitOnClick;
                modal.show();
            });
        }
    };
        
    function createBill(aSum){
        try {
            model.listFranchazi.params.franchazi_id = userSession.getFranchazi();
            model.requery(function(){
                if(typeof aSum == "number" && aSum > 0){
                    var billCreator = new Report('DetailedBill');
                    var bd = units.billApi.getSupplierDetails();
                    var billItems = getItems(aSum);
                    bd.billDate = new Date();
                    bd.sum = aSum;
                    bd.itemsNo = billItems.length;
                    bd.consumerName =  model.listFranchazi.cursor.f_name;
                    bd.billNumber = model.billsCount.cnt;
                    billCreator.setDetails(bd, billItems);
                    billCreator.show();
                    billModule.addBillOperation(anAccountId, billModule.getSelfPropertyValue("OPERATION_ADD_CASH"), aSum, billModule.getSelfPropertyValue("OP_STATUS_BILL"));       
                    form.close(true);
                } else 
                    alert("Некорректная сумма!");

            });
        } catch (e) {
            Logger.warning(e);
            form.close(false);
        }
    }
    
     function getItems(aSum) {
        var res = [];
        res.push({
            num: (res.length + 1),
            itemName: "Пополнение лицевого счета №"+anAccountId,
            desc: "руб",
            count: "1",
            cost: aSum,
            sum: aSum
        });
        
        return res;
     }
}
