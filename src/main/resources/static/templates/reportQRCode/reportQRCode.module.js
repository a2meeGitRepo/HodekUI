(function() {
	'use strict';
	angular.module('myApp.reportQRCode', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.reportQRCode', {
//			abstract : true,
			url : "/reportQRCode",
			views : {
				"sub" : {
					templateUrl: 'templates/reportQRCode/reportQRCode.html',
					controller : "ReportQRCodeController as vm"
				}
			}
		})
	});
})();