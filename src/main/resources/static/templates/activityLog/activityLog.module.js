(function() {
	'use strict';
	angular.module('myApp.activityLog', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.activityLog', {
//			abstract : true,
			url : "/activityLog",
			views : {
				"sub" : {
					templateUrl: 'templates/activityLog/activityLog.html',
					controller : "ActivityLogController as vm"
				}
			}
		})
	});
})();