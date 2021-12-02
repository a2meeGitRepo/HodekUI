(function() {
	'use strict';

	angular
		.module('myApp.main')
		.controller('mainController', mainController);

		mainController.$inject = ['localStorageService', 'ApiEndpoint', '$state','loginFactory','$rootScope',"$scope",'genericFactory'];

	/* @ngInject */
	function mainController(localStorageService, ApiEndpoint, $state,loginFactory,$rootScope,$scope,genericFactory) {
		var userDetail = localStorageService.get(ApiEndpoint.userKey);
		var accessURL = staticUrl + '/access';
		console.log(JSON.stringify(userDetail));
		var vm = angular.extend(this, {
			doLogout : doLogout,
			user : userDetail,
		});

		(function activate() {
			console.log("userDetail "+JSON.stringify(userDetail))
			$('.loading').show();
			$rootScope.loader=false;
			$scope.userPermissionDetails  = localStorageService.get('permissions');
			
			 $scope.userPermissionsObj = $scope.userPermissionDetails;
			 $scope.userPermissions = $scope.userPermissionsObj.permissions;
			 console.log(JSON.stringify($scope.userPermissions));
			 givePermissions();
			// giveuserDetails();
			 
		})();

		// ******************************************************

		function doLogout (){
			loginFactory.ClearCredentials();
			$state.go('login');
			localStorageService.remove(ApiEndpoint.userKey);
			localStorageService.remove('permissions')
		}
		

		function givePermissions(){

			for(var i = 0; i < $scope.userPermissions.length; i++){

				if($scope.userPermissions[i].permissionValue == "packingMst")
					$scope.showPackingMst = true;
					
				if($scope.userPermissions[i].permissionValue == "componentMst")
					$scope.showComponentMst = true;
				
				
				if($scope.userPermissions[i].permissionValue == "poBtach")
					$scope.showPOBatch = true;

				if($scope.userPermissions[i].permissionValue == "uploads")
					$scope.showUpload = true;
				
				if($scope.userPermissions[i].permissionValue == "packing")
					$scope.showPacking = true;
				
				if($scope.userPermissions[i].permissionValue == "qrCodeGenerator")
					$scope.showQrCodeGenerator = true;
				
				if($scope.userPermissions[i].permissionValue == "reprint")
					$scope.showReprint = true;
				
				if($scope.userPermissions[i].permissionValue == "testPrint")
					$scope.showTestPrint = true;
				
				if($scope.userPermissions[i].permissionValue == "reports")
					$scope.showReports = true;
				
				if($scope.userPermissions[i].permissionValue == "user")
					$scope.showUser = true;
				
			}

			$('.loading').hide();
		}

	}
})();