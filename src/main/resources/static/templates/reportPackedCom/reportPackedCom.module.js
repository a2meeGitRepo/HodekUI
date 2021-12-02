(function() {
	'use strict';
	angular.module('myApp.reportPackedCom', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.reportPackedCom', {
//			abstract : true,
			url : "/reportPackedCom",
			views : {
				"sub" : {
					templateUrl: 'templates/reportPackedCom/reportPackedCom.html',
					controller : "ReportPackedComController as vm"
				}
			}
		})
	});
})();