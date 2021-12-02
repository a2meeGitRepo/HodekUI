/**
 * @author : Dattatray Bodhale
 * @name : ComponentMstController
 * @date : 10/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.componentMst').controller('ComponentMstController', ComponentMstController);
	ComponentMstController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope' ];

	/* @ngInject */
	function ComponentMstController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope) {
		
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var componentURL = staticUrl + '/component';
		var tempEmpId = 0;
		
		var vm = angular.extend(this, {
			selectAllChk: false,
	
		});
		/**
		 * @author : Dattatray Bodhale
		 * @name : Load Components List
		 * @date : 10/12/2020
		 */
		$scope.loadComponents = function() {
			var msg = "Component list Loaded....', 'Successful !!";
            var url = componentURL+"/getAllComponents";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.components = response.data;
                    console.log("components:: "+JSON.stringify($scope.components))
                   
            });
		}
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Open Add Form 
		 * @date : 08/12/2020
		 */
		$scope.add = function() {
			$scope.addNewTab=true;
			$scope.newAdd=true;
			
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Close Form 
		 * @date : 08/12/2020
		 */
		$scope.cancelAdd = function() {
			$scope.addNewTab=false;
			$scope.component={}
			
		}
		
		
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : Change Status of Packing Box
		 * @date : 09/12/2020
		 */
		$scope.changeStatus = function(arr) {
			var msg=""
				var url=componentURL+"/changeStatusComponent"
			genericFactory.add(msg,url,arr).then(function(response){
				
				$rootScope.loader=false;
				$scope.loadComponents();
				if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
				}
	    		
	    	});
			
			
		}
		$scope.deleteCom=function (arr){
			
			var msg = "";
            var url = componentURL+"/DeletComponent";
            genericFactory.add(msg,url,arr).then(function(response) {
            	if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
				}
            	$scope.loadComponents();
                
            });
		}
		$scope.edit=function (arr){
			$scope.addNewTab=true;
			$scope.component=arr
			$scope.newAdd=false;


		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : save packing
		 * @date : 09/12/2020
		 */
		$scope.save = function(component) {
			var cotaint={}
			cotaint.title="Alert"
				
			console.log("Part No : "+JSON.stringify(component.partNo))
			console.log("Part No : "+JSON.stringify(component.printSize))
			
			if(component.partNo==""||component.partNo==undefined){
				$scope.partNoErr=true
				return;
			}else{
				$scope.partNoErr=false
			}
			
			if(component.componentName==""||component.componentName==undefined){
				$scope.componentNameErr=true
				return;
			}else{
				$scope.componentNameErr=false
			}
			if(component.printType=="" ||component.printType==undefined){
				$scope.printTypeErr=true;
				return;
			}else{
				$scope.printTypeErr=false
			}
			if(component.qrType=="" ||component.qrType==undefined){
				$scope.qrTypeErr=true;
				return;
			}else{
				$scope.qrTypeErr=false
				
				if(component.qrType=="Variable"){
					if(component.variableType=="" ||component.variableType==undefined){
						$scope.variableTypeErr=true;
						return;
					}else{
						$scope.variableTypeErr=false;
					}
				}
			}
			
			
			
			
			if(component.constantQrCode=="" ||component.constantQrCode==undefined){
				$scope.contantqrErr=true;
				return;
			}else{
				$scope.contantqrErr=false
			}	
			if(component.printSize=="" ||component.printSize==undefined){
				$scope.printSizeErr=true;
				return;
			}else{
				$scope.printSizeErr=false
			}
			
			if(component.format=="" ||component.format==undefined){
				$scope.formatErr=true;
				return;
			}else{
				$scope.formatErr=false
			}
			component.addedby=loginUser.firstName+"  "+loginUser.lastName
			component.print_size=component.printSize
			console.log("component :: "+JSON.stringify(component))
			
			$rootScope.loader=true;
			var msg=""
				var url
				if($scope.newAdd){
					 url=componentURL+"/addComponent"

				}else{
					 url=componentURL+"/editComponent"

				}
				
			genericFactory.add(msg,url,component).then(function(response){
				
				$scope.component={}
				$scope.addNewTab=false;
				$rootScope.loader=false;
				$scope.loadComponents();
				if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
				}
	    		
	    	});
			

		}		
		
		
		var init = function() {
			$scope.loadComponents();
			$scope.printrd=[]
			
		}
		init();

		
	}
})();
