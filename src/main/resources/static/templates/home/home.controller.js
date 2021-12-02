(function() {
	'use strict';

	angular.module('myApp.home').controller('HomeController', HomeController);
	
	HomeController.$inject = ['$scope', 'ApiEndpoint','$state','genericFactory','localStorageService'];


	function HomeController($scope, ApiEndpoint, $state,genericFactory,localStorageService) {
		var dashboardURL = staticUrl + '/dashboard';
		var componentURL=staticUrl+'/component';
		var packingURL = staticUrl + '/packing';
		var qrCodeURL=staticUrl+'/qrCode'
		var vm = angular.extend(this, {
			

		});

		(function activate() {
			loadDashboard()
			
			loadPackedDataByComponentId()
			loadPackedQrDataByComponent()
			$scope.userPermissionDetails  = localStorageService.get('permissions');
			
			 $scope.userPermissionsObj = $scope.userPermissionDetails;
			 $scope.userPermissions = $scope.userPermissionsObj.permissions;
			 givePermissions();
		})();
		
		function loadDashboard(){
			var msg=""
				var url=dashboardURL+"/getDashboardDate"
			genericFactory.getAll(msg,url).then(function(response){
				 $scope.dashboardData = response.data;
                 console.log("dashboardData :: "+JSON.stringify($scope.dashboardData))
				
               
	    		
	    	});
		}
		
		/***************** get count of component packed overall and for todays as well *******************/
		function loadPackedDataByComponentId() {		
			var msg = "";
            var url = packingURL+"/dashBoardPackedComponentData";
            genericFactory.getAll(msg,url).then(function(response) {
                    vm.packedData= response.data;
                    console.log("components:: "+JSON.stringify(vm.packedData))
                   
            });
		}
		
		/***************** get count of component QR code packed for  overall and for todays as well *******************/
		function loadPackedQrDataByComponent() {		
			var msg = "";
            var url = qrCodeURL+"/qRCodesCountByComponents";
            genericFactory.getAll(msg,url).then(function(response) {
                    vm.packedQrData= response.data;
                    console.log("components:: "+JSON.stringify(vm.packedQrData))
                   
            });
		}
		
		function givePermissions(){
			console.log("HOME Page Permission ")

			for(var i = 0; i < $scope.userPermissions.length; i++){

				if($scope.userPermissions[i].permissionValue == "dashboard"){
					$scope.showDashboard = true;
					console.log("Has a Dashboard ")
				}
					
					
			
				
			}

			$('.loading').hide();
		}
	}
})();
