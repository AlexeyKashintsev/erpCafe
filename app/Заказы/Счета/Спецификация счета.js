/**
 * 
 * @name BillSpecification
 * @author Alexey
 * @public
 * 
 */
function BillSpecification() {
    var self = this, model = this.model, form = this;
    
    var supplierDetails = {
            supplierName    :   'ИП ПИКОВ АРТУР ВЯЧЕСЛАВОВИЧ',
            supplierINN     :   '183311228293',
            supplierKPP     :   '',
            supplierAddress :   '426000, г. Ижевск, ул. Удмуртская, д.304,H,  ТЦ «Авеню»,  тел. 89199191155',
            bankName        :   'Филиал «Пермский» ОАО УБРиР',
            accountNumber   :   '40802810264570000048',
            bik             :   '045773883',
            corAccount      :   '30101810500000000883'
        };
    model.params.billDate = new Date();
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.accountDetailList.push({
            pNumb   :   model.accountDetailList.length + 1,
            pName   :   "Черный кофе",
            pPrice  :   200,
            pDef    :   "кг",
            pCount  :   0,
            pCost   :   0
        });
    }//GEN-LAST:event_buttonActionPerformed

    function accountDetailListOnChanged(evt) {//GEN-FIRST:event_accountDetailListOnChanged
       // if (evt.propertyName === "pCount" || evt.field === "pCount")
            model.accountDetailList.pCost = model.accountDetailList.pCount * model.accountDetailList.pPrice;
            var sum = 0;
            model.accountDetailList.beforeFirst();
            while (model.accountDetailList.next())
                sum += model.accountDetailList.pCost;
            model.params.bSum = sum;
            form.lbSum.text = sum + ' р.';
    }//GEN-LAST:event_accountDetailListOnChanged

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        form.lbSupplierName.text = supplierDetails.supplierName;
    }//GEN-LAST:event_formWindowOpened

    function btnCreateBillActionPerformed(evt) {//GEN-FIRST:event_btnCreateBillActionPerformed
        var bd = supplierDetails;
        var billItems = [];
        model.accountDetailList.beforeFirst();
        while (model.accountDetailList.next())
            billItems.push({
                num: model.accountDetailList.pNumb,
                itemName: model.accountDetailList.pName,
                desc: model.accountDetailList.pDef,
                count: model.accountDetailList.pCount,
                cost: model.accountDetailList.pPrice,
                sum: model.accountDetailList.pCost
            });
        bd.consumerName = form.tfCostumerName.text;
        bd.itemsNo = billItems.length;
        bd.sum = model.params.bSum;
        bd.billDate = model.params.billDate;
        
        var billCreator = new Report('DetailedBill');
        billCreator.bd = bd;
        billCreator.billItems = billItems;
        billCreator.show();
    }//GEN-LAST:event_btnCreateBillActionPerformed
}
