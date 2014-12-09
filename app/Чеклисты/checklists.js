/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function CheckLists() {
    var self = this, model = this.model;
    self.getCheckList = function(aCheckListId, aCallBack) {
        model.params.cheklist_id = aCheckListId;
        model.qListCheklist.requery(function(){
            aCallBack({
                title   :   model.qListCheklist.cursor.cheklist_title,
                text    :   model.qListCheklist.cursor.cheklist_text
            });
        });
    };
    
    self.showCheklist = function(aCheckListId) {
        if (!!aCheckListId) {
            self.getCheckList(aCheckListId, function(checkList){
                var modal = new cmn.Modal(checkList.title);
                var modalBody = modal.getModalBody();

                var checkListText = cmn.createElement('div', null, modalBody);
                checkListText.innerHTML = checkList.text.replace(new RegExp("\n",'g'),"<br>");
                
                modal.show();
            });
        }
    };
    
    self.openCheckList = function() {};
    
    self.closeCheckList = function() {};
}
