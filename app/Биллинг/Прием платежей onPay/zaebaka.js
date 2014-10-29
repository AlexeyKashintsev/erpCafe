/**
 * 
 * @author ml
 * @module
 */ 
function zaebaka() {
    var self = this, model = this.model;
    var paymentsImportUtils = new ServerModule("PaymentsImportUtils");
    paymentsImportUtils.importFrom1cFormat("/home/ml/temp/kl_to_1c.txt");
}
