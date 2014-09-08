/**
 * 
 * @name billItems
 * @author Alexey
 */
function billItems() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    var items = [];
    var itemsIdCounter = 0;
    
    function addItem(aName, aDesc, aCost, aQuantity) {
        var item = new itemDetails(aName, aDesc, aCost, aQuantity, ++itemsIdCounter);
        items.push(item);
        item.height = 28;
        var pnl = new AnchorsPane();
        pnl.heigth = 28;
        item.showOnPanel(pnl);
        form.pnlDetails.add(pnl);
    }
    
    self.recalc = function() {
        var sum = 0;
        for (var j in items) {
            sum += items[j].model.params.sum;
        }
        form.lbDetails.text = "Итого " + j + " позиций на сумму " + sum + " рублей";
    };

    function items4selectListOnRequeried(evt) {//GEN-FIRST:event_items4selectListOnRequeried
        model.items4selectList.push({
            pId         :   "0", 
            pName       :   "Кофе зерновой", 
            pDef        :   "кг", 
            pPrice      :   450,
            selectable  :   false,
            pParent     :   null
        },
        {
            pId         :   "01", 
            pName       :   "Черный кофе", 
            pDef        :   "кг", 
            pPrice      :   450,
            selectable  :   true,
            pParent     :   "0"
        },
        {
            pId         :   "02", 
            pName       :   "Белый кофе :)", 
            pDef        :   "кг", 
            pPrice      :   650,
            selectable  :   true,
            pParent     :   "0"
        },
        {
            pId         :   "1", 
            pName       :   "Аксесуары", 
            pDef        :   "шт", 
            pPrice      :   0,
            selectable  :   true,
            pParent     :   null
        },
        {
            pId         :   "11", 
            pName       :   "Стаканчик", 
            pDef        :   "шт", 
            pPrice      :   1,
            selectable  :   true,
            pParent     :   "1"
        });
    }//GEN-LAST:event_items4selectListOnRequeried

    function mgSelectListMouseClicked(evt) {//GEN-FIRST:event_mgSelectListMouseClicked
        if (evt.clickCount > 1) {
            addItem(model.items4selectList.pName, model.items4selectList.pDef,
                    model.items4selectList.pPrice, 0);
        }
    }//GEN-LAST:event_mgSelectListMouseClicked

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        addItem(model.items4selectList.pName, model.items4selectList.pDef,
                    model.items4selectList.pPrice, 0);
    }//GEN-LAST:event_btnAddActionPerformed
}
