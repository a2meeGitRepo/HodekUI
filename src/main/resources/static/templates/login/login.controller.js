(function () {
	'use strict';

	angular
		.module('myApp.login')
		.controller('loginController', loginController);

	loginController.$inject = ['userService', '$rootScope', '$scope', '$stateParams', '$state', 'localStorageService', 'toastr', 'ApiEndpoint', 'loginFactory', '$location', '$window','genericFactory'];

	/* @ngInject */
	function loginController(userService, $rootScope, $stateParams, $scope, $state, localStorageService, toastr, ApiEndpoint, loginFactory, $location, $window,genericFactory) {
		var userUrl = staticUrl+"/access";
		var vm = angular.extend(this, {
			doLogin: doLogin,

		});

		(function activate() {
			$('.loading').hide();
		})();

		// ******************************************************
		function doLogin(login) {
			var url=userUrl+"/aunthentic";
			var msg=""
			//	console.log("login :: "+JSON.stringify(login))
			genericFactory.add(msg,url,login).then(function (response) {
			//	console.log("Responce  Id :: "+JSON.stringify(response.data.data.id))
				if (response.data.code == '200') {
					loginFactory.SetCredentials(login);
					if (response.data) {
					//	var permissionUrl=userUrl+"/getPermissionsByUser?userId="+response.data.data.id
					//	console.log("permissionUrl :: "+permissionUrl)
						userService.getPermissionsOf1User(response.data.data.id).then(function (data) {
							console.log(JSON.stringify(data));
							sessionStorage.setItem('permissions', JSON.stringify(data));
							localStorageService.set('permissions', data)
							$location.path('/main/home');
							toastr.success('Login....', 'Succesfully !!');
						});
					}
					localStorageService.set(ApiEndpoint.userKey, response.data.data);
					sessionStorage.setItem(ApiEndpoint.userKey, JSON.stringify(response.data.data));
					// $window.location.reload();
				}else {
					//console.log("EOOR")
					toastr.error(response.data.message);
				}
			});
		}
	}
})();
