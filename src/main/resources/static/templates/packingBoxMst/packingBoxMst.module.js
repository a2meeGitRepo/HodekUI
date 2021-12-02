(function() {
	'use strict';
	angular.module('myApp.packingBoxMst', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.packingBoxMst', {
//			abstract : true,
			url : "/packingBoxMst",
			views : {
				"sub" : {
					templateUrl: 'templates/packingBoxMst/packingBoxMst.html',
					controller : "PackingBoxMstController as vm"
				}
			}
		})
	});
})();