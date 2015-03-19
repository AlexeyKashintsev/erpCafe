/**
 * 
 * @author Work
 */
function ItemCard() {
    var self = this, model = this.model, form = this;
    
    var imgH = 190;
    var imgW = 190;
    var OpenType = null;
    
    self.setItem = function(aItem){
        fillFields(aItem);
    };
    
    self.addNew = function(){
        model.qTradeItems.insert();
        model.qTradeItems.cursor.franchazi_id = session.franchaziId;
    };
    
    self.save = function(){
        model.save();
    };
    
    self.setOpenType = function(aType){
        OpenType = aType;
    };
    
    function searchInDataBase(anItemCode, successcallback, failcallback){
        model.qGetItem.params.barcode = anItemCode;
        model.qGetItem.requery(function(){
             if (model.qGetItem.length > 0){
                successcallback(model.qGetItem.cursor.item_name, model.qGetItem.cursor.items_catalog_id);
                //successcallback();
                return model.qGetItem.cursor.item_name;
            } else {
                failcallback();
                return false;
            }
        });
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
        form.close(true);
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

    }//GEN-LAST:event_qTradeItemsOnChanged

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close();
    }//GEN-LAST:event_btnCancelActionPerformed

    function paramsOnChanged(evt) {//GEN-FIRST:event_paramsOnChanged
    }//GEN-LAST:event_paramsOnChanged

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if (OpenType === "modal"){
            form.btnSave.visible = true;
            form.btnCancel.visible = true;
        } else if(OpenType === "no_barcode") {
            form.btnSave.visible = false;
            form.btnCancel.visible = false;
            form.tfBarCode.editable = false;
            form.tfBarCode.enabled = false;
            form.btnCheck.visible = false;
        } else {
            form.btnSave.visible = false;
            form.btnCancel.visible = false;
        }
    }//GEN-LAST:event_formWindowOpened

    function tfBarCodeKeyPressed(evt) {//GEN-FIRST:event_tfBarCodeKeyPressed
        if(evt.key == 13){
            tfBarCodeFocusLost();
        }
    }//GEN-LAST:event_tfBarCodeKeyPressed

    function tfBarCodeFocusLost(evt) {//GEN-FIRST:event_tfBarCodeFocusLost
        searchInDataBase(model.qTradeItems.cursor.bar_code, 
            function(aName, aId){
                model.qTradeItems.cursor.bar_code = null;
                var conf = confirm("Такой товар уже есть ("+aName+"), окрыть его карточку?");
                if(conf){
                    var itemset  = new ItemSettingsAndCost(aId, "no_barcode");
                    itemset.showModal();
                }
            }, 
            function(){
                if(!model.qTradeItems.cursor.item_name)
                    btnCheckActionPerformed();
            }
        );
    }//GEN-LAST:event_tfBarCodeFocusLost
}
