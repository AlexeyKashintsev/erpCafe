if (!platypus) {
	var platypus = {};
}
var units = {};

function nextButtonClick(){
	$('#order_items').hide();
	$('#order_details').show();
}

function prevButtonClick() {
	$('#order_details').hide();
	$('#order_items').show();
}

platypus.ready = function() {
	require(['ItemDetails', 'BillGenerator'], function(){
	    units.billGenerator = new BillGenerator();
	    $('#order_details').hide();
	});
};
