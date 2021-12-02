(function() {
	'use strict';
	angular.module('myApp.reprintQrCode', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.reprintQrCode', {
//			abstract : true,
			url : "/reprintQrCode",
			views : {
				"sub" : {
					templateUrl: 'templates/reprintQrCode/reprintQrCode.html',
					controller : "ReprintQrCodeController as vm"
				}
			}
		})
	});
})();