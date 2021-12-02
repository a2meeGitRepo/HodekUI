(function() {
	'use strict';
	angular.module('myApp.qrCodeGeneration', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.qrCodeGeneration', {
//			abstract : true,
			url : "/qrCodeGeneration",
			views : {
				"sub" : {
					templateUrl: 'templates/qrCodeGeneration/qrCodeGeneration.html',
					controller : "QrCodeGenerationController as vm"
				}
			}
		})
	});
})();