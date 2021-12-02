/**
 * @author : Dattatray Bodhale
 * @name : ComponentMstController
 * @date : 28/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.reportQRCode').controller('ReportQRCodeController', ReportQRCodeController);
	ReportQRCodeController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope' ];

	/* @ngInject */
	function ReportQRCodeController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope) {
		
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var componentURL = staticUrl + '/component';
		var activityURL = staticUrl + '/activity';
		var reportURL = staticUrl + '/report';
	
		$scope.generate=function (log){
			if(log==undefined||log.date==""||log.date==undefined){
				$scope.dateErr=true;
				return;
			}else{
				$scope.dateErr=false;
				
			}
			var obj={}
			obj.date=log.date
			var msg = "";
			var url=reportURL+"/getQRCodeReport"

			console.log("URL :: "+url)
						console.log("obj "+JSON.stringify(obj))

				genericFactory.add(msg,url,obj).then(function(response) {
	                 $scope.reports = response.data;
	                 console.log("reports:: "+JSON.stringify($scope.reports))
	                
	         });
			
			 
		}
		
	}
})();
