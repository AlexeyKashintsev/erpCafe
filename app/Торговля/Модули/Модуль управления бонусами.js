/**
 * @public
 * @author minya92
 * @module
 */ 
function BonusModule() {
    var self = this, model = this.model;
    var session = Modules.get("UserSession");
    
    self.setBonusRate = function(anItemId, aTypeId, aBonusRate){
        model.qTradeItemsId.params.item_id = anItemId;
        //model.qTradeItemsId.params.franchazi_id = (session.getUserRole() === "admin") ? null : session.getFranchazi();
        model.requery();
        if(!model.qTradeItemsId.empty && !aTypeId){
            if(model.qTradeItemsId.cursor.franchazi_id == session.getFranchazi() ||  session.getUserRole() === "admin"){
                model.qBonusCountForTradeItem.push({
                        bonus_rate : aBonusRate,
                        trade_item : model.qTradeItemsId.cursor.trade_items_id
                    });
            }
        } else {
            if(session.getUserRole() === "admin"){
                model.qBonusCountForTradeItem.push({
                        bonus_rate : aBonusRate,
                        type_id : aTypeId
                    });
            }
        }
        model.save();    
    };
    
    self.clearBonusRate = function(anItemId, aTypeId){
        model.qBonusCountForTradeItem.params.trade_item = anItemId;
        model.qBonusCountForTradeItem.params.trade_type = aTypeId;
        model.qTradeItemsId.params.item_id = anItemId;
        model.requery();
        if(!model.qTradeItemsId.empty && !aTypeId && !model.qBonusCountForTradeItem.empty){
            if(model.qTradeItemsId.cursor.franchazi_id == session.getFranchazi() ||  session.getUserRole() === "admin"){
                model.qBonusCountForTradeItem.deleteRow();
            }
        } else {
            if(session.getUserRole() === "admin" && !model.qBonusCountForTradeItem.empty){
                model.qBonusCountForTradeItem.deleteRow();
            }
        }
        model.save();  
    };
    
}
