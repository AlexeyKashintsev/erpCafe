/**
 * 
 * @name SupplierDetailsForm
 * @author Alexey
 */
function SupplierDetailsForm() {
    var self = this, model = this.model, form = this;
    
    self.setSupplierDetails = function(aDetails) {
        form.tfSupplierName = aDetails.supplierName;
        form.tfSupplierINN = aDetails.supplierINN;
        form.tfSupplierKPP = aDetails.supplierKPP;
        form.tfSupplierAddress = aDetails.supplierAddress;
        form.tfBankName = aDetails.bankName;
        form.tfAccountNumber = aDetails.accountNumber;
        form.tfBIK = aDetails.bik;
        form.tfCorAccountNumber = aDetails.corAccount;
    };

    function btnCreateBillActionPerformed(evt) {//GEN-FIRST:event_btnCreateBillActionPerformed
        return {
            supplierName    :   form.tfSupplierName,
            supplierINN     :   form.tfSupplierINN,
            supplierKPP     :   form.tfSupplierKPP,
            supplierAddress :   form.tfSupplierAddress,
            bankName        :   form.tfBankName,
            accountNumber   :   form.tfAccountNumber,
            bik             :   form.tfBIK,
            corAccount      :   form.tfCorAccountNumber
        };
    }//GEN-LAST:event_btnCreateBillActionPerformed
}
