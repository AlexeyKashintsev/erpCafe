/**
 * 
 * @author Work
 * @module 
 */
function PrintModule() {
    var self = this, model = this.model;
    
    self.print = function(aData){
        var iframe = $('<iframe id="print_frame">');
        $('body').append(iframe);
        var doc = $('#print_frame')[0].contentDocument || $('#print_frame')[0].contentWindow.document;
        var win = $('#print_frame')[0].contentWindow || $('#print_frame')[0];
        doc.getElementsByTagName('body')[0].innerHTML = createCheck(0, aData);
        win.print();
        $('iframe').remove();
    };
    
    var basic = {};
    basic.caption = '4REAL-POS CUSTOM';
    basic.customInfo = {};
    basic.customInfo.kkm = 321321455;
    basic.customInfo.inn = 21321321213121;
    basic.customInfo.eklz = 1321154549875;
    
    self.setBasicInfo = function(aInfo){
        basic = aInfo;
    }
    
    function createCheck(aNumber, aData) {
        var html =  '<style media=print></style>';
        html +=     '<div class=p_container"><div class="p_head">' + basic.caption + '</div>';
        html +=     '<div class="p_custom_info"><p>ККМ ' + basic.customInfo.kkm + '</p>';
        html +=     '<p>ИНН ' + basic.customInfo.inn + '</p>';
        html +=     '<p>ЭКЛЗ ' + basic.customInfo.eklz + '</p></div>';
        html +=     '<div class="p_order_info"><p>Дата ' + new Date().toLocaleString(); + '</p>';
        html +=     '<p>Продавец ' + 'TODO имя продавца' + '</p>';
        html +=     '<p>№ чека ' + aNumber + '</p></div>';
        html +=     '<div class="p_order">';
        for (var i in aData.orderItems) {
            html += '<p>' + aData.orderItems[i].item_name + ' ' + aData.orderItems[i].quantity + '</p>';
            //sessionItems[aData.orderItems[i].tradeId].cost //цена товара
        }
        html +=     '</div>';
        html +=     '<div class="p_order_after"><p> Способ оплаты: ' + aData.methodOfPayment ? "Бонусы" : "Наличные";
        html +=     '</p><p class="p_summ"> СУММА: ' + aData.orderSum + '</p></div>';
        html +=     '</div>';
        return html;
    }
}
