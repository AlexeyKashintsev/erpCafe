/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function CheckLists() {
    var self = this, model = this.model;
    
    self.getCheckList = function(aCheckListId) {
        model.qListCheklist.params.checklist_id = aCheckListId;
        model.qListCheklist.requery();
        return {
            title   :   model.qListCheklist.cursor.cheklist_title,
            text    :   model.qListCheklist.cursor.cheklist_text
        };
    };
    
    self.showCheklist = function(aCheckListId) {
        if (!!aCheckListId) {
            var checkList = self.getCheckList(aCheckListId);
            var modal = new cmn.Modal(checkList.title);
            var modalBody = modal.getModalBody();

            var checkListText = cmn.createElement('div', null, modalBody);
            checkListText.innerHTML = checkList.text;

            modal.show();
        }
    };
    
    self.openCheckList = function() {};
    
    self.closeCheckList = function() {};
}
