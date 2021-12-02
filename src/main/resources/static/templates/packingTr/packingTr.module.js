(function() {
	'use strict';
	angular.module('myApp.packingTr', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.packingTr', {
//			abstract : true,
			url : "/packingTr",
			views : {
				"sub" : {
					templateUrl: 'templates/packingTr/packingTr.html',
					controller : "PackingTrController as vm"
				}
			}
		})
			$stateProvider.state('main.packing/:packngId', {
//			abstract : true,
			url : "/packing/:packngId",
			views : {
				"sub" : {
					templateUrl: 'templates/packingTr/packing.html',
					controller : "PackingController as vm"
				}
			}
		})
	});
})();