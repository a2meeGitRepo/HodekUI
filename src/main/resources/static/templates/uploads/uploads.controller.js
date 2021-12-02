/**
 * @name : uploadsController
 * @description : controller for uploading files
 * @date : 30/05/2019
 */

(function () {
	'use strict';

	angular.module('myApp.uploads').controller('uploadsController', uploadsController);

	uploadsController.$inject = ['$state', '$scope', 'toastr', 'genericFactory', '$filter', '$http', '$rootScope','$uibModal', '$window','localStorageService','ApiEndpoint'];

	/* @ngInject */
	function uploadsController($state, $scope, toastr, genericFactory, $filter, $http, $rootScope, $uibModal, $window,localStorageService,ApiEndpoint) {
		var loginUser = localStorageService.get(ApiEndpoint.userKey);				
		var uploadsUrl = staticUrl + '/uploadController';
		console.log("loginUser"+JSON.stringify(loginUser))
		
		var vm = angular.extend(this, {
			uploadComponent: uploadComponent,
			uploadPacking: uploadPacking,			

		});		



		/**
		 * @author : Dattatray Bodhale
		 * @Description : Upload Components Master
		 * @date : 11/12/2020
		 */
		function uploadComponent() {
			var file = document.getElementById('uploadComponent').files[0];
			
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please Select a xlsx File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";
			var extension1 = ".xls";
			console.log("Format  "+fileName.includes(extension))

			console.log("Format 1 "+fileName.includes(extension1))
			if(!fileName.includes(extension1)){
				toastr.error('Selected File is not a xlsx or xls');
				return;
			}			
			var addedBy=loginUser.firstName+" "+loginUser.lastName
			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var url = uploadsUrl + "/uploadComponent?addedBy="+addedBy;
			console.log("URL :: "+url)
			$http.post(url, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				
				$('.loading').hide();
				//window.alert("File uploaded successfully!");
			
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });					
				
			}, function errorCallback(response) {
		    	$('.loading').hide();
				//window.alert("File upload - unsuccessfull!");
				//init();
				toastr.error('Upload....', 'UnSuccesful !!');
					    });

			angular.element("input[type='file']").val(null);
		}

		/**
		 * @author : Dattatray Bodhale
		 * @Description : Upload Packing Box Master
		 * @date : 11/12/2020
		 */
		function uploadPacking() {
			var file = document.getElementById('filePackingBox').files[0];
			
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please Select a xlsx File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if(!fileName.includes(extension)){
				toastr.error('Selected File is not a xlsx');
				return;
			}			
			var addedBy=loginUser.firstName+" "+loginUser.lastName
			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var url = uploadsUrl + "/uploadpackingBox?addedBy="+addedBy;
			console.log("URL "+url)
			$http.post(url, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				
				$('.loading').hide();
				//window.alert("File uploaded successfully!");
				
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });					
				// $window.location.reload();
			}, function errorCallback(response) {
		    	$('.loading').hide();
				//window.alert("File upload - unsuccessfull!");
				
				toastr.error('UnSuccesful....', ' Upload');
				// $window.location.reload();
		    });

			angular.element("input[type='file']").val(null);
		}


	}
})();
