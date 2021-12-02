/**
 * @author : Dattatray Bodhale
 * @name : ComponentMstController
 * @date : 28/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.activityLog').controller('ActivityLogController', ActivityLogController);
	ActivityLogController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope' ];

	/* @ngInject */
	function ActivityLogController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope) {
		
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var componentURL = staticUrl + '/component';
		var activityURL = staticUrl + '/activity';
		var accessURL = staticUrl + '/access';
	
	
		
		var init = function() {
			
			
		}
		$scope.generate=function (log){
			var url=""
			console.log("LOG "+JSON.stringify(log))
			if(log.logBy==""||log.logBy==null){
				$scope.logByErr=true;
				return;
			}else{
				$scope.logByErr=false;
			}
			if(log.logBy=="Activity"){
				if(log.activity==""||log.activity==null){
					$scope.activityErr=true;
					
					return;
				}else{
					$scope.activityErr=false;
					url=activityURL+"/getActivityLogsByACtivity?activity="+log.activity
				}
				
			}else if(log.logBy=="Date"){
				if(log.date==""||log.date==null){
					$scope.dateErr=true;
					return;
				}else{
					$scope.dateErr=false;
					
				}
			}else if(log.logBy=="User"){
				if(log.userId==""||log.userId==null){
					$scope.userErr=true;
					return;
				}else{
					$scope.userErr=false;
					url=activityURL+"/getActivityLogsByUser?userId="+log.userId
				}
			}else if(log.logBy=="Shift"){
				if(log.shift==""||log.shift==null){
					$scope.shiftErr=true;
					return;
				}else{
					$scope.shiftErr=false;
					url=activityURL+"/getActivityLogsByShift?shift="+log.shift
				}
			}
			
			
			
			
			var msg = "Activity Log Loaded....', 'Successful !!";
			console.log("URL :: "+url)
			if(log.logBy=="Activity"||log.logBy=="User"||log.logBy=="Shift"){
				genericFactory.getAll(msg,url).then(function(response) {
	                 $scope.activities = response.data;
	                 console.log("activities:: "+JSON.stringify($scope.activities))
	                
	         });
			}else{
				var url=activityURL+"/getActivityLogsByDate"
				var obj={}
				obj.date=log.date
				genericFactory.add(msg,url,obj).then(function(response) {
	                 $scope.activities = response.data;
	                 console.log("activities:: "+JSON.stringify($scope.activities))
	                
	         });
			}
			 
		}
		init();
		$scope.callUsers=function (logBy){
			if(logBy=="User"){
				var msg = "USER list Loaded....', 'Successful !!";
	            var url = accessURL+"/getAllUser";
	            genericFactory.getAll(msg,url).then(function(response) {
	                    $scope.users = response.data;
	                    console.log("users:: "+JSON.stringify($scope.users))
	                   
	            });
			}
		}
	}
})();
