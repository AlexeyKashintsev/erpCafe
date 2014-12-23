/**
 * 
 * @author Work
 */
function addItem() {
    var self = this, model = this.model, form = this;
    
    var imgH = 190;
    var imgW = 190;
    
  
    self.setItem = function(aItem){
        fillFields(aItem);
    };
    
    self.addNew = function(){
        model.qTradeItems.insert();
    }
    
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
    
        
       
    function validateTF(anBarCode){
        anBarCode += "";
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
                if (anItem){
                    model.qTradeItems.cursor.item_name = anItem.name;
                    model.qTradeItems.cursor.item_description = anItem.desc;
                    model.qTradeItems.cursor.item_picture = anItem.pic;
                    form.lblImageArea.text = "<html><img src='" + anItem.pic + "' style='max-width: " + imgW +"px; max-height: " + imgH +"px;'></html>";
                }
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
                form.lblImageArea.text = "<html><img src='" + url + "' style='max-width: " + imgW +"px; max-height: " + imgH +"px;'></html>";
            });
        });
    }//GEN-LAST:event_buttonActionPerformed

    function fillFields(anItem){
        model.qTradeItems.params.item_id = anItem;
        model.qTradeItems.requery(function(){
            if (model.qTradeItems.cursor.item_picture)
                form.lblImageArea.text = "<html><img src='" + model.qTradeItems.cursor.item_picture + "' style='max-width: " + imgW +"px; max-height: " + imgH +"px;'></html>";
            else 
                form.lblImageArea.text = "Изображение отсутствует!";
        });
        
    }
    
    


    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        model.qTradeItems.cursor.item_picture = confirm("Введите URL картинки");
        
    }//GEN-LAST:event_button1ActionPerformed

    function qTradeItemsOnChanged(evt) {//GEN-FIRST:event_qTradeItemsOnChanged
        if (model.qTradeItems.cursor.item_picture)
            form.lblImageArea.text = "<html><img src='" + model.qTradeItems.cursor.item_picture + "' style='max-width: " + imgW +"px; max-height: " + imgH +"px;'></html>";
        else 
            form.lblImageArea.text = "Изображение отсутствует!";
    }//GEN-LAST:event_qTradeItemsOnChanged

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close();
    }//GEN-LAST:event_btnCancelActionPerformed
}
