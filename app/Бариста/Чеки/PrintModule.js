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
        setTimeout(function() {
            win.print();
            $('iframe').remove();
        }, 500);
        
    };
    
    var basic = {};
    basic.caption = '4REAL-POS CUSTOM BIG II SAPMLE PRINT';
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
        html +=     '<img src="img/header_logo_4r.png"></img>';
        html +=     '</p><h1 class="p_summ"> СУММА: ' + aData.orderSum + '</h1></div>';
        html +=     '</div>';
        return html;
    }
}
