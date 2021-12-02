(function() {
	'use strict';
	angular.module('myApp.componentMst', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.componentMst', {
//			abstract : true,
			url : "/componentMst",
			views : {
				"sub" : {
					templateUrl: 'templates/componentMst/componentMst.html',
					controller : "ComponentMstController as vm"
				}
			}
		})
	});
})();