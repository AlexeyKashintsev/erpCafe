/**
 * @author Alexey
 * @name DetailedBill
 * @public
 */
function DetailedBill() {
    var self = this, model = P.loadModel(this.constructor.name);
    var billApi = new BillApi();
    self.bd = null;
    self.billItems = null;
    /*self.bd = {
        supplierName: '',
        supplierINN: '',
        supplierKPP: '',
        supplierAddress: '',
        bankName: '',
        accountNumber: '',
        bik: '',
        corAccount: '',
        consumerName: '',
        billDate: '',
        itemsNo: 0,
        sum: 0,
        sumDesk: ''
    };
    
    self.billItems = [
            {
                num: 0,
                itemName: '',
                desc: '',
                count: 0,
                cost: 0,
                sum: 0
            }
        ];*/
    
    //var bd = {};
    //var billItems = [];
    
    self.setDetails = function(aBillDetails, anItems) {
        self.bd = aBillDetails;
        self.billItems = anItems;
    };


    function number_to_string(_number) {
        var _arr_numbers = new Array();
        _arr_numbers[1] = new Array('', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать');
        _arr_numbers[2] = new Array('', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто');
        _arr_numbers[3] = new Array('', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот');
        function number_parser(_num, _desc) {
            var _string = '';
            var _num_hundred = '';
            if (_num.length == 3) {
                _num_hundred = _num.substr(0, 1);
                _num = _num.substr(1, 3);
                _string = _arr_numbers[3][_num_hundred] + ' ';
            }
            if (_num < 20)
                _string += _arr_numbers[1][parseFloat(_num)] + ' ';
            else {
                var _first_num = _num.substr(0, 1);
                var _second_num = _num.substr(1, 2);
                _string += _arr_numbers[2][_first_num] + ' ' + _arr_numbers[1][_second_num] + ' ';
            }

            switch (_desc) {
                case 0:
                    var _last_num = parseFloat(_num.substr(-1));
                    if (_last_num == 1)
                        _string += 'рубль';
                    else if (_last_num > 1 && _last_num < 5)
                        _string += 'рубля';
                    else
                        _string += 'рублей';
                    break;
                case 1:
                    var _last_num = parseFloat(_num.substr(-1));
                    if (_last_num == 1)
                        _string += 'тысяча ';
                    else if (_last_num > 1 && _last_num < 5)
                        _string += 'тысячи ';
                    else
                        _string += 'тысяч ';
                    _string = _string.replace('один ', 'одна ');
                    _string = _string.replace('два ', 'две ');
                    break;
                case 2:
                    var _last_num = parseFloat(_num.substr(-1));
                    if (_last_num == 1)
                        _string += 'миллион ';
                    else if (_last_num > 1 && _last_num < 5)
                        _string += 'миллиона ';
                    else
                        _string += 'миллионов ';
                    break;
                case 3:
                    var _last_num = parseFloat(_num.substr(-1));
                    if (_last_num == 1)
                        _string += 'миллиард ';
                    else if (_last_num > 1 && _last_num < 5)
                        _string += 'миллиарда ';
                    else
                        _string += 'миллиардов ';
                    break;
            }
            _string = _string.replace('  ', ' ');
            return _string;
        }

        function decimals_parser(_num) {
            var _first_num = _num.substr(0, 1);
            var _second_num = parseFloat(_num.substr(1, 2));
            var _string = ' ' + _first_num + _second_num;
            if (_second_num == 1)
                _string += ' копейка';
            else if (_second_num > 1 && _second_num < 5)
                _string += ' копейки';
            else
                _string += ' копеек';
            return _string;
        }

        if (!_number || _number == 0)
            return false;

        if (typeof _number !== 'number') {
            _number = _number.replace(',', '.');
            _number = parseFloat(_number);
            if (isNaN(_number))
                return false;
        }
        _number = _number.toFixed(2);
        if (_number.indexOf('.') != -1) {
            var _number_arr = _number.split('.');
            var _number = _number_arr[0];
            var _number_decimals = _number_arr[1];
        }
        var _number_length = _number.length;
        var _string = '';
        var _num_parser = '';
        var _count = 0;
        for (var _p = (_number_length - 1); _p >= 0; _p--) {
            var _num_digit = _number.substr(_p, 1);
            _num_parser = _num_digit + _num_parser;
            if ((_num_parser.length == 3 || _p == 0) && !isNaN(parseFloat(_num_parser))) {
                _string = number_parser(_num_parser, _count) + _string;
                _num_parser = '';
                _count++;
            }
        }
        if (_number_decimals)
            _string += decimals_parser(_number_decimals);
        return _string;
    }

    function saveBillInfo(aBillNumber, aBillDetails, aBillItems) {
        model.qBillById.push({
            bill_num        :   aBillNumber,
            bill_details    :   JSON.stringify(aBillDetails),
            bill_items      :   JSON.stringify(aBillItems)
        });
        model.save();
    }
    
    /**
     * Report's before render event handler.
     * @param evt Event object.
     */
    function onBeforeRender(evt){//GEN-FIRST:event_onBeforeRender
       // self.bd = self.bd[0];//где-то здесь зло!
        var supplier = billApi.getSupplierDetails;
        for (var j in supplier) {
            self.bd[j] = supplier[j];
        }
        
        self.bd.sumDesk = number_to_string(self.bd.sum);
        self.bd.billNumber = model.billsCount.cnt;
        var d = new Date(self.bd.billDate);
        var month = (d.getMonth() + 1).toString();
        month = month.length === 1 ? '0' + month : month;
        self.bd.billDate = d.getDate() + '-' + month + '-' + d.getFullYear();
        (function(){saveBillInfo(self.bd.billNumber, self.bd, self.billItems)}).invokeBackground();
    }//GEN-LAST:event_onBeforeRender

}
