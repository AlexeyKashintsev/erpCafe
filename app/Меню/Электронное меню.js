/**
 * 
 * @author Алексей
 * @module
 * @param {DOM Element} aContainer
 * @param {objid : {cost, name}} aData
 * @returns none
 */
function WebMenu(aContainer, aData) {
    var self = this, model = this.model;
    var items = [];

    function MenuItem(anItemData, aContainer) {
        this.container = cmn.createElement("div", "menu-item", aContainer);
        this.itemName = cmn.crateElement("h1", "menu-item-name", this.container);
        this.itemName.innerHTML = anItemData.name;
        this.itemName = cmn.crateElement("h1", "menu-item-cost", this.container);
        this.itemName.innerHTML = anItemData.cost;
    }
    
    for (var j in aData) {
        items[items.length] = new MenuItem(aData[j], aContainer);
        items[items.length].id = j;
    }
}
