/**
 * Начинает длительную операцию с показом курсора ожидания.
 * @name guiModule
 * @return Объект - операцию, которую впоследствии нужно завершить
 * @public
 * методом <code>end()</code>.
 * @param aView - Контейнер, в который нужно установить курсор ожидания.
 */

function guiModule() {


var self = this;

self.beginLengthyOperation = function(aView)
{
    var oldCursor = aView.cursor;
    aView.cursor = java.awt.Cursor.getPredefinedCursor(java.awt.Cursor.WAIT_CURSOR);
    return new Cookie(aView, oldCursor);
}

self.endLengthyOperation = function()
{
    this.form.cursor = this.cursor;
}

function Cookie(form, cursor)
{
    this.form = form;
    this.cursor = cursor;
    this.end = self.endLengthyOperation;
}

var FORM_ID_PROPERTY_NAME = "userFormProperty";

self.putUserFormProperty = function(aFrame, aFormId)
{
    if(aFrame != null && aFrame != undefined)
        aFrame.rootPane.putClientProperty(FORM_ID_PROPERTY_NAME, aFormId);
}

self.showOpenedForm = function(aFormId, aDesktop)
{
    var frames = null
    if(aDesktop != null)
    {
        frames = aDesktop.forms;
    }else
    {
        frames = javax.swing.JFrame.getFrames();
    }
    for(var i=0;i<frames.length;i++)
    {
        var frame = frames[i];
        if(frame instanceof javax.swing.JFrame || frame instanceof javax.swing.JInternalFrame)
        {
            if(frame.visible)
            {
                var prop = frame.rootPane.getClientProperty(FORM_ID_PROPERTY_NAME);
                if(prop != null && prop != undefined && prop == aFormId)
                {
                    if(frame instanceof javax.swing.JInternalFrame)
                        frame.setIcon(false);
                    else
                        frame.extendedState = javax.swing.JFrame.NORMAL;
                    frame.toFront();
                    return true;
                }
            }
        }
    }
    return false;
}

self.setFormSizeAsMin = function(aForm)
{
    var minSize = aForm.window.getSize();
    aForm.window.setMinimumSize(minSize);	
}
}