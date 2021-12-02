(function() {
	'use strict';
	angular.module('myApp.packedQrReport', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.packedQrReport', {
//			abstract : true,
			url : "/packedQrReport",
			views : {
				"sub" : {
					templateUrl: 'templates/packed_QRcode_Report/packed_qrReport.html',
					controller : "PackedQrReportController as vm"
				}
			}
		})
	});
})();