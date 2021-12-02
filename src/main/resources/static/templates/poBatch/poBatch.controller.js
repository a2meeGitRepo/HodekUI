/**
 * @author : Dattatray Bodhale
 * @name : PoBatchController
 * @date : 16/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.poBatch').controller('PoBatchController', PoBatchController);
	PoBatchController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope' ];

	/* @ngInject */
	function PoBatchController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope) {
		
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var poBatchURL = staticUrl + '/poBatch';
		var componentURL=staticUrl+'/component';
		var tempEmpId = 0;
	
		$scope.totalBatchQty=0
		$scope.remBatchQty=0
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Load PO List
		 * @date : 16/12/2020
		 */
		$scope.loadPO = function() {
			var msg = "Component list Loaded....', 'Successful !!";
            var url = poBatchURL+"/getAllPos";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.pos = response.data;
                    console.log("pos:: "+JSON.stringify($scope.pos))
                   
            });
		}
		
		$scope.closeBatch=function (){
			$scope.batchListTab=false;
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Open PO Add Form 
		 * @date : 16/12/2020
		 */
		$scope.add = function() {
			$scope.addNewTab=true;
			$scope.batchListTab=false
			$scope.addNewBatchTab=false;
			$scope.loadComponent();
			
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Open Batch Add Form 
		 * @date : 16/12/2020
		 */
		
		$scope.addBatch = function() {
			$scope.addNewBatchTab=true;
			$scope.addNewTab=false;
			$scope.ValidQuant=true
			$scope.overQuantErr=false
			$scope.batch_quantErr=false
			
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Close PO Form 
		 * @date : 16 /12/2020
		 */
		$scope.cancelAdd = function() {
			$scope.addNewTab=false;
			$scope.component={}
			$scope.batchListTab=false
			
		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Close Batch Form 
		 * @date : 16/12/2020
		 */
		$scope.cancelBatch = function() {
			$scope.addNewBatchTab=false;
			
		}
		
		/*****************component list *******************/
		$scope.loadComponent = function() {
			var msg = "Packing ....', 'Successful !!";
            var url = componentURL+"/getAllActiveComponents";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.components= response.data;
                    console.log("components:: "+JSON.stringify($scope.components))
                   
            });
		}
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : Change Status of PO
		 * @date : 16/12/2020
		 */
		$scope.changeStatus = function(arr) {
			var msg=""
				var url=poBatchURL+"/changeStatusPO"
			genericFactory.add(msg,url,arr).then(function(response){
				
				$rootScope.loader=false;
				$scope.loadPO();
				if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
				}
	    		
	    	});
			
			
		}
		/**
		 * @author : Dattatray Bodhale
		 * @description : Change Status of Batch
		 * @date : 16/12/2020
		 */
		$scope.changeStatusBatch = function(arr) {
		    console.log(" status arr :: "+JSON.stringify(arr))
			var msg=""
				var url=poBatchURL+"/changeStatusBatch"
			genericFactory.add(msg,url,arr).then(function(response){
				
				$rootScope.loader=false;
				$scope.viewBatches($scope.selPo);
				if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
				}
	    		
	    	});
			
			
		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : For view batches List
		 * @date : 16/12/2020
		 */
		$scope.viewBatches = function(arr) {
			$scope.addNewTab=false;
			$scope.selPo=arr
			$scope.totalBatchQty=0
			$scope.remBatchQty=0
			var msg = "Component list Loaded....', 'Successful !!";
            var url = poBatchURL+"/getAllBatchesByPo?poId="+arr.poId;
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.batches = response.data;   
                    
                    $scope.batchListTab=true
                    angular.forEach($scope.batches, function(batch) {
                    	$scope.totalBatchQty+=batch.batch_quant
                    	});
                    if($scope.totalBatchQty==$scope.selPo.po_quantity){
                    	$scope.remBatchQty=0
                    }else{
                    	$scope.remBatchQty=$scope.selPo.po_quantity-$scope.totalBatchQty
                    }
                    console.log("totalBatchQty:: "+JSON.stringify($scope.totalBatchQty))
                   
            });
			
		}
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : save PO
		 * @date : 16/12/2020
		 */
		$scope.save = function(po) {
			var cotaint={}
			cotaint.title="Alert"
				
			
			
			if( po==undefined||po.poNo==""){
				$scope.poNoErr=true
				return;
			}else{
				$scope.poNoErr=false
			}
			
			if(po.poDate==undefined||po.poDate==""){
				$scope.poDateErr=true
				return;
			}else{
				$scope.poDateErr=false
			}
			
			
			if(po.po_quantity==undefined||po.po_quantity==""){
				$scope.poQuantErr=true
				return;
			}else{
				$scope.poQuantErr=false
			}
			
			if(po.component==undefined||po.component==""){
				$scope.componentPoErr=true
				return;
			}else{
				$scope.componentPoErr=false
			}
			
			po.createdBy=loginUser.firstName+"  "+loginUser.lastName
			console.log("component :: "+JSON.stringify(po))
			
			$rootScope.loader=true;
			var msg=""
				var url=poBatchURL+"/addPO"
				
			genericFactory.add(msg,url,po).then(function(response){
				
				$scope.po={}
				$scope.addNewTab=false;
				$rootScope.loader=false;
				$scope.loadPO();
				if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
				}
	    		
	    	});
			

		}		
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : save Batch
		 * @date : 16/12/2020
		 */
		$scope.saveBatch = function(batch) {
			var cotaint={}
			cotaint.title="Alert"
				
			
			
			if(batch==undefined||batch.batchName==""){
				$scope.batchNameErr=true
				return;
			}else{
				$scope.batchNameErr=false
			}
			
			if(batch.batch_quant==undefined||batch.batch_quant==""){
				$scope.batch_quantErr=true
				return;
			}else{
				$scope.batch_quantErr=false
			}
			
			
			batch.po=$scope.selPo
			var rem=$scope.selPo.po_quantity-$scope.totalBatchQty
			if(batch.batch_quant > rem){
				$scope.overQuantErr=true
				$scope.ValidQuant=false
			}else{
				$scope.overQuantErr=false
				$scope.ValidQuant=true
				
				batch.createdBy=loginUser.firstName+"  "+loginUser.lastName
				console.log("component :: "+JSON.stringify(batch))
				
				$rootScope.loader=true;
				var msg=""
					var url=poBatchURL+"/addBatch"
					
				genericFactory.add(msg,url,batch).then(function(response){
					
					$scope.batch={}
					$scope.addNewBatchTab=false;
					$rootScope.loader=false;
					$scope.viewBatches($scope.selPo);
					if(response.data.code==200){
						toastr.success(response.data.message);
					}else{
						toastr.error(response.data.message);
					}
		    		
		    	});
			}
			
			
			

		}		
		
		
		var init = function() {
			$scope.loadPO();
			
		}
		init();

	}
})();
