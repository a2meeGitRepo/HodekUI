/**
 * @author : Dattatray Bodhale
 * @name : ComponentMstController
 * @date : 28/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.packedQrReport').controller('PackedQrReportController', PackedQrReportController);
	PackedQrReportController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope' ];

	/* @ngInject */
	function PackedQrReportController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope) {
		
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var componentURL = staticUrl + '/component';
		var activityURL = staticUrl + '/activity';
		var accessURL = staticUrl + '/access';
		var usersURL = staticUrl + '/access';
		var packingURL = staticUrl + '/packing';
	
		var vm = angular.extend(this, {
			
	
		});
		(function activate() {
			loadAllUsers();
		})();
		
		
		function loadAllUsers(){
			var msg=""
				var url=usersURL+'/getAllUser';
			genericFactory.getAll(msg,url).then(function(response){				
				$scope.users=response.data;
				console.log("usrs list ::"+JSON.stringify($scope.users))
				
			});
			
		}
		
		var init = function() {
			
			
		}
		
		$scope.generate=function (pckdReprt){
			
			console.log("report for "+JSON.stringify(pckdReprt))
			
			if(pckdReprt==undefined||pckdReprt.forDate==undefined){
				$scope.dateErr=true;
				return;
			}else{
				$scope.dateErr=false;
			}	
			
			
			if(pckdReprt.packed_by==""||pckdReprt.packed_by==null){
				$scope.packedByErr=true;
				return;
			}else{
				$scope.packedByErr=false;
			}	
			
			var pckedObj={}
			pckedObj.forDate=pckdReprt.forDate;
			pckedObj.userDetails=pckdReprt.packed_by;
				var msg="";
				var url=packingURL+"/reportForPackedQRCOde"
				genericFactory.add(msg,url,pckedObj).then(function(response) {
	                 $scope.reportsQr= response.data;
	                 console.log("response:: "+JSON.stringify(response))
	                 console.log("packed qr report:: "+JSON.stringify($scope.reportsQr))
	                 if( $scope.reportsQr!=null){	                	
	                	 toastr.success("Data found");
	                 }else{
	                	 toastr.error("NO data found");
	                 }
	                
	         });			 
		}
		
	
		$scope.cancel=function(){
			pckdReprt={}
			
		}
		init();

	}
})();
