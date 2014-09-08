/**
 * @name BillApi
 * @author Alexey
 * @public
 * @module
 */
function BillApi() {
    var self = this, model = P.loadModel(this.constructor.name);
    
    self.getItemsForBill = function() {
        return [
            {
                pId         :   "1", 
                pName       :   "Стакан кофейный белый 200 мл (упаковка 100 шт)", 
                pDef        :   "шт", 
                pCost      :   309
            },
            {
                pId         :   "2", 
                pName       :   "Стакан кофейный белый 300 мл (упаковка 100 шт)", 
                pDef        :   "шт", 
                pCost      :   350
            },
            {
                pId         :   "3", 
                pName       :   "Стакан кофейный белый 400 мл (упаковка 100 шт)", 
                pDef        :   "шт", 
                pCost      :   450
            },
                        {
                pId         :   "4", 
                pName       :   "Стакан пластиковый коктельный 300 мл (упаковка 100 шт)", 
                pDef        :   "шт", 
                pCost      :   220
            },
            {
                pId         :   "5", 
                pName       :   "Стакан пластиковый коктельный 500 мл (упаковка 100 шт)", 
                pDef        :   "шт", 
                pCost      :   190
            },
            {
                pId         :   "6", 
                pName       :   "Капхолдер (упаковка 1200 шт)", 
                pDef        :   "шт", 
                pCost      :   3000
            },
            {
                pId         :   "7", 
                pName       :   "Кофе смесь White (мягкая) Арабика 100%", 
                pDef        :   "кг", 
                pCost      :   670
            },
            {
                pId         :   "8", 
                pName       :   "Кофе смесь Black (крепкая) Арабика 80% + Робуста 20%", 
                pDef        :   "кг", 
                pCost      :   630
            },
            {
                pId         :   "9", 
                pName       :   "Крышка для стаканчика черная на 200 мл (упаковка 100 шт)", 
                pDef        :   "шт", 
                pCost      :   222
            },
            {
                pId         :   "10", 
                pName       :   "Крышка для стаканчика черная на 300/400 мл (упаковка 100 шт)", 
                pDef        :   "шт", 
                pCost      :   242
            }
        ];
    };
    
    self.getSupplierDetails = function() {
        return {
            supplierName    :   'ИП ПИКОВ АРТУР ВЯЧЕСЛАВОВИЧ',
            supplierINN     :   '183311228293',
            supplierKPP     :   '',
            supplierAddress :   '426000, г. Ижевск, ул. Удмуртская, д.304,H,  ТЦ «Авеню»,  тел. 89199191155',
            bankName        :   'Филиал «Пермский» ОАО УБРиР',
            accountNumber   :   '40802810264570000048',
            bik             :   '045773883',
            corAccount      :   '30101810500000000883'
        };
    };
    
    self.getAskedFields = function() {
        return [
            {
                name    :   "consumerName",
                text    :   "Наименование покупателя",
                requied :   true
            },
            {
                name    :   "e_mail",
                text    :   "Ваш e-mail",
                requied :   true
            },
            {
                name    :   "address",
                text    :   "Адрес доставки",
                requied :   true
            },
            {
                name    :   "phone",
                text    :   "Телефон",
                requied :   true
            }
        ];
    };
    
    self.sendMessages = function(aBillId, aBillDetails, anItems, aSum) {
        var mailer = new Mailer;
        var msg = "Запрошен новый счет:\n\
Покупатель: " + aBillDetails.consumerName + " e-mail: " + aBillDetails.e_mail + "\n\
Телефон: " + aBillDetails.phone + " Адрес: " + aBillDetails.address + "\n\
Сумма заказа: " + aSum + " рублей\n\
Детали заказа: ";
        var items = ""
        anItems.forEach(function(anItem){
            items += "\n" + anItem.num + ". " + anItem.itemName + " " + anItem.count + " " +
                    anItem.desc + " на сумму " + anItem.sum + " рублей";
        });
        msg += items;
        mailer.sendEmail("rcCoffee", "pikov_a@inbox.ru", "Новый счет", msg);
        msg = "Спасибо за Ваш заказ!\n\nВыбранные позиции:\n";
        msg += items;
        msg += "\n\nОтгрузка производится строго после оплаты счета, каждый понедельник.\n\
Доставка кофе от 10 кг бесплатно.\n\
С транспортной компании в Вашем городе отгрузка совершается самостоятельно.";
        mailer.sendEmail("rcCoffee", aBillDetails.e_mail, "Заказ в RC Coffee", msg);
    };
    
    self.createBill = function(aBillDetails, anItems) {
        var billCreator = new Report('DetailedBill');
        var bd = aBillDetails;//getSupplierDetails();
        //for (var j in aBillDetails) {
        //    bd[j] = aBillDetails[j];
        //}
        bd.billDate = new Date();
        billCreator.bd = bd;
        billCreator.billItems = anItems;
        billCreator.show();
        sendMessages(null, aBillDetails, anItems);        
    };
}
