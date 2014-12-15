/**
 * 
 * @author Work
 */
function addItem() {
    var self = this, model = this.model, form = this;
    
    
    function searchInDataBase(anItemCode){
        model.qGetItemByBarCode.params.barcode = anItemCode;
        model.qGetItemByBarCode.requery();
        if (model.qGetItemByBarCode.length > 0) 
            return model.qGetItemByBarCode.cursor.item_name;
        else
            return false;
    }
    
    function searchInInternetResource(anItemCode, callback){
        var item = {};
        $.get("http://files.lapshina.net/parser.php?"+
                "url="+
                encodeURIComponent("http://goodsmatrix.ru/mobile/" + anItemCode + ".html"),
        function(html){
            if(html){
                item.name = $(html).find("span#GoodsName").text();
                item.pic = "http://goodsmatrix.ru/BigImages/" + anItemCode + ".jpg";
                item.desc = $(html).find("span#Comment").text();
                callback(item);
            } else {
                return false;
            }
        });
    }
    
    function addToDataBase(anItemCode, anItemName, anItemPicture, anItemDescription){
        model.qGetItemByBarCode.push({
            item_name   :   anItemName,
            bar_code    :   anItemCode,
            item_description    :   anItemDescription,
            item_picture    :   anItemPicture
        });
    }
    
    function validateTF(anBarCode){
        anBarCode = anBarCode.replace(/\D+/g,"");
        if (anBarCode.length === 13)
            return anBarCode;
        else 
            return false;
    }

    function btnCheckActionPerformed(evt) {//GEN-FIRST:event_btnCheckActionPerformed
        var BarCode = validateTF(form.tfBarcode.text);
        if (BarCode){
            form.tfBarcode.text = BarCode;
            var item = searchInDataBase(BarCode);
            if (item) {
                form.tfName.text = item.name;
                form.tfDesc.text = item.desc;
                form.tfImage.text = item.pic;
            } else {
                searchInInternetResource(BarCode, function(anItem){
                    item = anItem;
                    form.tfName.text = item.name;
                    form.tfDesc.text = item.desc;
                    form.tfImage.text = item.pic;
                    form.htmlArea.text = "<img src='" + item.pic + "'>";
                });            
            };
        }
    }//GEN-LAST:event_btnCheckActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        addToDataBase(form.tfBarcode.text, form.tfName.text, form.tfImage.text, form.tfDesc.text);
    }//GEN-LAST:event_btnSaveActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        selectFile(function(data){
            var UP = new ServerModule("uploadModule");
            UP.uploadFile(data);
        });        // TODO Добавьте свой код:
    }//GEN-LAST:event_buttonActionPerformed
}
