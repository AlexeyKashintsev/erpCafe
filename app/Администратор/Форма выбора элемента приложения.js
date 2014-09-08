/**
 * @name 132134455025048
 */
function SelectElementAppView() {
    var self = this, model = self.model, form = P.loadForm(this.constructor.name, model);
    var parentStyle = new Style();
    var entitiesStyles = new Array();
    entitiesStyles[10] = new Style(parentStyle);
    entitiesStyles[10].leafIcon = Icons.load("connection.png");
    entitiesStyles[10].folderIcon = entitiesStyles[10].leafIcon;
    entitiesStyles[20] = new Style(parentStyle);
    entitiesStyles[20].leafIcon = Icons.load("module.png");
    entitiesStyles[20].folderIcon = entitiesStyles[20].leafIcon;
    entitiesStyles[30] = new Style(parentStyle);
    entitiesStyles[30].leafIcon = Icons.load("form.png");
    entitiesStyles[30].folderIcon = entitiesStyles[30].leafIcon;
    entitiesStyles[40] = new Style(parentStyle);
    entitiesStyles[40].leafIcon = Icons.load("report.png");
    entitiesStyles[40].folderIcon = entitiesStyles[40].leafIcon;
    entitiesStyles[50] = new Style(parentStyle);
    entitiesStyles[50].leafIcon = Icons.load("query.png");
    entitiesStyles[50].folderIcon = entitiesStyles[50].leafIcon;
    entitiesStyles[60] = new Style(parentStyle);
    entitiesStyles[60].leafIcon = Icons.load("dbScheme.png");
    entitiesStyles[60].folderIcon = entitiesStyles[60].leafIcon;
    entitiesStyles[70] = new Style(parentStyle);
    entitiesStyles[70].folderIcon = Icons.load("folder.png");
    entitiesStyles[70].openFolderIcon = Icons.load("folder-open.png");
    entitiesStyles[90] = new Style(parentStyle);
    entitiesStyles[90].leafIcon = Icons.load("form.png");
    entitiesStyles[90].folderIcon = entitiesStyles[90].leafIcon;

    var entityLocator = null;
    function createEntityLocator()
    {
        if (entityLocator == null)
            entityLocator = dsEntities.createLocator(dsEntities.schema.MDENT_ID);
    }

    function setParent(parentId)
    {
        form.params.PARENT = parentId;
    }

    function getValue()
    {
        return getEntityID();
    }

    function getSelected()
    {
        return getEntityID();
    }

    function getEntityID()
    {
        return model.dsEntities.MDENT_ID;
    }

function grdEntity_MDENT_NAME_calcCell(aRowId, aColumnId, aCell) {//GEN-FIRST:event_grdEntity_MDENT_NAME_calcCell
    var lRow = model.dsEntities.findById(aRowId);
    if (lRow) {
        aCell.style = entitiesStyles[lRow.MDENT_TYPE];
        return true;
    }
    return undefined;
}//GEN-LAST:event_grdEntity_MDENT_NAME_calcCell

function btnSelectedActionPerformed(evt) {//GEN-FIRST:event_btnSelectedActionPerformed
        model.modalResult = model.ok;
        form.close();	
}//GEN-LAST:event_btnSelectedActionPerformed

function btnCloseActionPerformed(evt) {//GEN-FIRST:event_btnCloseActionPerformed
        model.modalResult = model.cancel;
        form.close();
}//GEN-LAST:event_btnCloseActionPerformed

function grdEntityMouseClicked(evt) {//GEN-FIRST:event_grdEntityMouseClicked
        if (evt.clickCount > 1)
        {
            model.modalResult = model.ok;
            form.close();
        }        
}//GEN-LAST:event_grdEntityMouseClicked
}