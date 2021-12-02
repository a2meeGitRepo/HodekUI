(function() {
	'use strict';
	angular.module('myApp.poBatch', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.poBatch', {
//			abstract : true,
			url : "/poBatch",
			views : {
				"sub" : {
					templateUrl: 'templates/poBatch/poBatch.html',
					controller : "PoBatchController as vm"
				}
			}
		})
	});
})();