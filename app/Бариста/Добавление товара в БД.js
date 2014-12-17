/**
 * 
 * @author Work
 */
function addItem() {
    var self = this, model = this.model, form = this;
    
    var Item = null;
    
    self.setItem = function(aItem){
        Item = aItem;
        fillFields();
    };
    
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
    
    function addToDataBase(anItemCode, anItemName, anItemPicture, anItemDescription, anItemType, anItemMeasure, aFranchaziId, aFranchizeId){
        model.qGetItemByBarCode.push({
            item_name           :   anItemName,
            bar_code            :   anItemCode,
            item_description    :   anItemDescription,
            item_picture        :   anItemPicture,
            item_type           :   anItemType,
            item_measure        :   anItemMeasure,
            franchazi_id        :   aFranchaziId,
            franchize_id        :   aFranchizeId
        });
    }
    
    function UpdateInDataBase(anItemCode, anItemName, anItemPicture, anItemDescription, anItemType, anItemMeasure, aFranchaziId, aFranchizeId){
        model.qGetItemByBarCode.params.barcode = anItemCode;
        model.qGetItemByBarCode.execute(function(){
            
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
        var BarCode = validateTF(model.qTradeItems.cursor.bar_code);
        if (BarCode){
            model.qTradeItems.cursor.bar_code = BarCode;
            searchInInternetResource(BarCode, function(anItem){
                item = anItem;
                model.qTradeItems.cursor.item_name = item.name;
                model.qTradeItems.cursor.item_description = item.desc;
                model.qTradeItems.cursor.item_picture = item.pic;
                form.lblImageArea.text = "<html><img src='" + item.pic + "' style='max-width: 450px; max-height: 200px;'></html>";
            });            
 
        }
    }//GEN-LAST:event_btnCheckActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
    }//GEN-LAST:event_btnSaveActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        selectFile(function(aFile){
            Resource.upload(aFile, function(url) {
                model.qTradeItems.cursor.item_picture = url;
                form.lblImageArea.text = "<html><img src='" + url + "' style='max-width: 250px; max-height: 250px;'></html>";
            });
        });
    }//GEN-LAST:event_buttonActionPerformed

    function fillFields(){
        model.qTradeItems.params.item_id = Item;
        model.qTradeItems.requery();
    }
    
    

}
