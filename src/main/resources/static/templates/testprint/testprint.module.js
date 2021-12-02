(function() {
	'use strict';
	angular.module('myApp.testprint', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.testprint', {
//			abstract : true,
			url : "/testprint",
			views : {
				"sub" : {
					templateUrl: 'templates/testprint/testprint.html',
					controller : "TestprintController as vm"
				}
			}
		})
	});
})();