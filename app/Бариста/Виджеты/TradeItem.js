/**
 * 
 * @author Alexey
 * @module
 */ 
function TradeItem(anItemData, aParent, aContainer) {
    var self = this, model = this.model;
    
    var costs = [];
    var priceTypeSel = null;
    this.data = anItemData;

    this.setCost = function(aPriceType, aCost) {
        if (!!aCost)
            costs[aPriceType] = aCost;
        else
            delete costs[aPriceType];
    };

    this.setActivePriceType = function(aPriceType) {
        if (costs[aPriceType]) 
            this.setDisplayedPrice(costs[aPriceType] + 'р.');
        else 
            this.setDisplayedPrice('---');
        priceTypeSel = aPriceType;
     };

    this.setAdditionalData = function(aData) {
        this.setCost(aData.price_type, aData.item_cost);
    };
    
    function addToOrder() {
        if (costs[priceTypeSel]) {
            if (!this.data.item_measure || this.data.item_measure == 'шт' || this.data.item_measure == '-') {
                orderList.addItem(this.data, priceTypeSel, costs[priceTypeSel]);
            } else {
                var data = this.data;
                balanceMeter.getWeight(this.data, function(anQuantity) {
                    orderList.addItem(data, priceTypeSel, costs[priceTypeSel], anQuantity);
                });
            }
        } else {
            //TODO Ошибка - данный товар проверять нельзя по выбранной цене
        }
    }
    this.addToOrder = addToOrder;
    
    function settingsShow() {
        aParent.itemSettingsAndCost.setTradeItem(this.data.item_id);
        aParent.itemSettingsAndCost.showModal(aParent.reloadItems);
    }

    this.click = (function() {
        switch (aParent.mode) {
            case 0  :   {
                    addToOrder.bind(this)();
                    break;
            }
            case 1  :   {
                    settingsShow.bind(this)();
                    break;
            }
        }

    }).bind(this);

    wf.TradeItem.bind(this)(aContainer);
    this.setAdditionalData(anItemData);
}
