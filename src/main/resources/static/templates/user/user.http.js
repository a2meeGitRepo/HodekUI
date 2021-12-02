(function () {
	'use strict';

	angular
		.module('myApp.user')
		.factory('userHttpService', userHttpService);

	userHttpService.$inject = ['$http', '$q', '_', 'localStorageService', 'ApiEndpoint'];

	/* @ngInject */
	function userHttpService($http, $q, _, localStorageService, ApiEndpoint) {
		
		var user = localStorageService.get(ApiEndpoint.userKey);
		var userUrl = ApiEndpoint.url+"user";   // User Url
		var u = staticUrl + '/access';
	
		
		// Variables
		var users = {};

		var service = {
			getUsers : getUsers,
			getEmployees: getEmployees,
			deleteUser : deleteUser,
			createUser : createUser,
			editUser : editUser,
			getRoleOfUser : getRoleOfUser,
			assignRolesTo1User : assignRolesTo1User,
			deleteRolesOf1User : deleteRolesOf1User,
			getPermissionsOf1User : getPermissionsOf1User,
			checkExistingUserId : checkExistingUserId
		};

		return service;
	
		function createUser(user){
			return $http.post(u + '/addNewUser', user, {timeout: 5000});
		}
		
		function getUsers(){
//			localhost:8091/user/alluser
			return $http.get(u + '/getAllUser2');
		}
		
		function deleteUser(user){
//			localhost:8091/user/{id}
			console.log("USER ID FOR DELET "+user.id)
			return $http.get(u + '/deteUser?userId=' +user.id);
		}
		
		function editUser(iObj){
			console.log("EDIT")
//			localhost:8091/user/edit
			return $http.post( u + '/edit', iObj);
		}
		
		function getRoleOfUser(id){
//			localhost:8091/user/userroles/{id}
			return $http.get(u + '/getUserRoles/' + id);
		}
		
		function assignRolesTo1User(iObj){
//			localhost:8091/user/assignroles
			return $http.post(u + '/assignRoles' , iObj);
		}
		
		function deleteRolesOf1User(iObj){
//			localhost:8091/user/assignroles
			return $http.post(u + '/deleteRoles' , iObj);
		}
		
		function getPermissionsOf1User(id){
			//user/permissions/{userid} - get
			return $http.get(u + '/getPermissionsByUser?userId=' + id);
		}
		
		function checkExistingUserId(id){
			//user/usercheck/{userid} - get
			return $http.get(u + '/usercheck/' + id);
		}
		
		function getEmployees(){
			return $http.get(e + '/employeesList');
		}
		
	}
})();
