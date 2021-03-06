(function() {
	'use strict';

	angular.module('myApp.user').controller('UserController', UserController);
	UserController.$inject = [ '$state', 'userService', '$uibModal', '$log', '$scope', 'toastr','genericFactory'];

	/* @ngInject */
	function UserController($state, userService, $uibModal, $log, $scope, toastr,genericFactory) {
		var accessURL = staticUrl + '/access';

		var vm = angular.extend(this, {
			users : [],
			employees: [],
			deleteUser : deleteUser,
			editUser	:	editUser,
			addNewUser	:	addNewUser,
			validateUserId : validateUserId,
			createEditUser : createEditUser,
			clear:clear,
			add:add,
			
		});

		(function activate() {
			$scope.user = {};
			$scope.user.gender = 'selectGender';
			$scope.isEdit=false;
			$scope.error = false;
			
			loadUsers();
			
		})();

		// ******************************************************
		
		function validateUserId(id){
			if(!id || id=="")
				return;
			userService.checkExistingUserId(id).then(function(data){
				if(data == 'error'){
					$scope.error = true;
					document.getElementById('employeeid').focus();
				}else{
					$scope.error = false;
				}
			});
		}
		
		function addNewUser(){
			$scope.disableEmployeeId = false;
			$scope.isEdit = false;
			$scope.user = {};
			$scope.user.gender = 'selectGender';
			$scope.error = false;
		}

		function loadUsers() {
			/*userService.getUsers().then(function(data) {
				
				
			});*/
			
			var msg = "Packing ....', 'Successful !!";
            var url = accessURL+"/getAllUser2";
			console.log("url :: "+url);

            genericFactory.getAll(msg,url).then(function(response) {
            	vm.users = response.data;
				console.log("users :: "+JSON.stringify(vm.users));

				angular.forEach(vm.users , function(item) {
					
					console.log("item :: "+JSON.stringify(item));

					});
            });

		}

		function loadEmployees() {
			userService.getEmployees().then(function(data) {
				vm.employees = data;	
				console.log(JSON.stringify(data));			
				
			});
		}

		function deleteUser(user) {
			$scope.disableEmployeeId = false;
			$scope.user = {};
			$scope.user.gender = 'selectGender';
			$scope.isEdit = false;
			console.log(JSON.stringify(user));
			userService.deleteUser(user).then(function() {
				loadUsers();
			});
		}
		
		function validations(){
			if(!$scope.user.firstName || $scope.user.firstName == ''){
				toastr.error('Please enter first name');
				document.getElementById('firstname').focus();
				return true;
			}
			if(!$scope.user.lastName || $scope.user.lastName == ''){
				toastr.error('Please enter last name');
				document.getElementById('lastname').focus();
				return true;
			}
			if(!$scope.user.emailId || $scope.user.emailId == ''){
				toastr.error('Please enter email id');
				document.getElementById('emailid').focus();
				return true;
			}
			
			if(!$scope.user.password || $scope.user.password == ''){
				toastr.error('Please enter password');
				document.getElementById('password').focus();
				return true;
			}
			if(!$scope.user.contactNo || $scope.user.contactNo == ''){
				toastr.error('Please enter contact No');
				document.getElementById('contactno').focus();
				return true;
			}else{
				if($scope.user.contactNo.length<10){
					toastr.error('Please enter 10 Digit only ');
					return true;
				}
			}
			
			return false;
		}

		function createEditUser(iObj){
			if($scope.isEdit){
				if(validations())
				return;
			
				var createObj = Object.assign({}, $scope.user);
				userService.editUser(createObj).then(function(data) {
					if(data.code==200){
						toastr.success(data.message);
					}else{
						toastr.error(data.message);
						return;
					}
					$scope.user = {};
					$scope.user.gender = 'selectGender';
					loadUsers();
					$scope.addnew=false
					$scope.isEdit = false;
					console.log("DATA :: "+JSON.stringify(data))
					
					
				});
			}else{
				if(validations())
				return;
			
				$scope.user.roles = [];
			
				var createObj = Object.assign({}, $scope.user);
				userService.createUser(createObj).then(function(data) {
					if(data.code==200){
						toastr.success(data.message);
					}else{
						toastr.error(data.message);
						return
					}
					$scope.user = {};
					$scope.addnew=false
					loadUsers();
					$scope.isEdit = false;
					console.log("DATA :: "+JSON.stringify(data))
					//$scope.addnew=true
					
				});
			}
		}
		
		function editUser(iObj){			
			$scope.error = false;
			$scope.user = iObj;
			$scope.disableEmployeeId = true;
			$scope.isEdit = true;
			$scope.addnew=true
		}
		function add(){
			$scope.addnew=true
		}
		function clear(){			
		
			$scope.user = "";
		
		
			$scope.addnew=false
		}
		$scope.empSelected = function(id){
			for(var i = 0;i<vm.employees.length;i++){
				if(vm.employees[i].empCode==id){
					$scope.user.firstName = vm.employees[i].firstName;
					$scope.user.lastName = vm.employees[i].lastName;
					$scope.user.emailId = vm.employees[i].emailId;
					$scope.user.gender = vm.employees[i].gender;
					$scope.user.contactNo = vm.employees[i].contactNo;
				}
			}
		}

	}

})();
