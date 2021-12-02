/**
 * @author : Dattatray Bodhale
 * @name : PackingBoxMstController
 * @date : 08/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.packingBoxMst').controller('PackingBoxMstController', PackingBoxMstController);
	PackingBoxMstController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope' ];

	/* @ngInject */
	function PackingBoxMstController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope) {
		
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var packingBoxURL = staticUrl + '/packingBox';
		var tempEmpId = 0;
	
		$scope.editButton=false
		$scope.saveButton=true
		
		
		
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Load Packing Box List
		 * @date : 08/12/2020
		 */

		$scope.loadPackingBoxes= function() {
			var msg = "Packing Box Loaded....', 'Successful !!";
            var url = packingBoxURL+"/getAllPackingBoxes";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.packingBoxes = response.data;
                //    console.log("ASSSSS :: "+JSON.stringify($scope.packingBoxes))
                   
            });
		}
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Open Add Form 
		 * @date : 08/12/2020
		 */
		$scope.add = function() {
			$scope.addNewPackingBoxTab=true;
			$scope.layerLists=[]
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Close Form 
		 * @date : 08/12/2020
		 */
		$scope.cancelAdd = function() {
			$scope.addNewPackingBoxTab=false;
			$scope.layerListViewTab=false;
			$scope.packingBox=""
				$scope.layerLists=[]
		}
		$scope.edit=function (arr){
			$scope.addNewPackingBoxTab=true;
			$scope.packingBox=arr
			$scope.editButton=true
			$scope.saveButton=false
				var msg=""
					var url=packingBoxURL+"/getlayersByPackingBox?packingBoxId="+arr.packing_box_id
				genericFactory.getAll(msg,url).then(function(response){
					$scope.layerLists=response.data;
	                 console.log("layerLists :: "+JSON.stringify($scope.layerLists))
					
	                 //$scope.layerListViewTab=true
		    		
		    	});		
			
			
		}

		$scope.deleteBox=function (arr){
			
			var msg = "Packing Box Loaded....', 'Successful !!";
            var url = packingBoxURL+"/DeletPackingBox";
            genericFactory.add(msg,url,arr).then(function(response) {
            	if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
				}
            	$scope.loadPackingBoxes();
                
            });
		}
			
		/**
		 * @author : Dattatray Bodhale
		 * @description : add layers
		 * @date : 09/12/2020
		 */
		$scope.addlayers = function(count) {
			$scope.layersListTab=true;
			$scope.layerListViewTab=false;
			console.log("count :: "+count)
			$scope.layerLists=[]
			for(var i=1;i<=count;i++){
				var layersList={}				
				layersList.layerName="Layer-"+i;
				layersList.layerSize=0
				layersList.layerNameERR=false
				layersList.layerSizeERR=false
				$scope.layerLists.push(layersList);
			}
			
			

		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : Remove layer row
		 * @date : 09/12/2020
		 */
		$scope.removelayers = function(index,arr) {
			
			
			$scope.layerLists.splice(index, 1);
			$scope.packingBox.boxLayer=$scope.packingBox.boxLayer-1
		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : Change Status of Packing Box
		 * @date : 09/12/2020
		 */
		$scope.changeStatus = function(arr) {
			var msg=""
				var url=packingBoxURL+"/changeStatusPackingBox"
			genericFactory.add(msg,url,arr).then(function(response){
				
				$rootScope.loader=false;
				$scope.loadPackingBoxes();
				if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
				}
	    		
	    	});
			
			
		}
		/**
		 * @author : Dattatray Bodhale
		 * @description : View and Load Layer by packing 
		 * @date : 09/12/2020
		 */
		$scope.viewLayer = function(arr) {
			var msg=""
				var url=packingBoxURL+"/getlayersByPackingBox?packingBoxId="+arr.packing_box_id
			genericFactory.getAll(msg,url).then(function(response){
				 $scope.packingBoxeLayers = response.data;
                 console.log("packingBoxeLayers :: "+JSON.stringify($scope.packingBoxeLayers))
				
                 $scope.layerListViewTab=true
	    		
	    	});
			
			
		}
		/**
		 * @author : Dattatray Bodhale
		 * @description : Close Layer List View 
		 * @date : 10/12/2020
		 */
		$scope.closeLayerList = function() {
			$scope.layerListViewTab=false
			 
			
			
		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : save packing
		 * @date : 09/12/2020
		 */
		$scope.save = function(packingBox) {
			var cotaint={}
			cotaint.title="Alert"
				console.log("PacckingBOX ::"+JSON.stringify(packingBox))
			
			
			if(packingBox.boxName==""){
				$scope.boxNameErr=true
				return;
			}else{
				$scope.boxNameErr=false
			}
			
			if(packingBox.boxSize==0 ||packingBox.boxSize==""){
				$scope.boxSizeErr=true
				return;
			}else{
				$scope.boxSizeErr=false
			}
			if(packingBox.boxLayer=="" || packingBox.boxLayer==0){
				$scope.boxLayerErr=true;
				return;
			}else{
				$scope.boxLayerErr=false
			}
			var layerSizeCount=0;
			
			for(var j=0;j<$scope.layerLists.length;j++){
				
				
				if($scope.layerLists[j].layerName==""){
					console.log("LayerName EMpty ")
					$scope.layerLists[j].layerNameERR=true;
					cotaint.massage="Layer Name Required for Layer "+$scope.layerLists[j].layerNo
						genericFactory.showAlert(cotaint);
					return;
				}else{
					$scope.layerLists[j].layerNameERR=false;

				}
				if($scope.layerLists[j].layerSize==0){
					$scope.layerLists[j].layerSizeERR=true;
					cotaint.massage="Layer Size Required for Layer "+$scope.layerLists[j].layerNo
					genericFactory.showAlert(cotaint);
					return;
				}else{
					$scope.layerLists[j].layerSizeERR=false;
				}
				layerSizeCount+=$scope.layerLists[j].layerSize
				
				
				
				$scope.layerLists[j].addedBy=loginUser.firstName+"  "+loginUser.lastName
				
				
				
			}
			
			
			
			
			if(layerSizeCount!=packingBox.boxSize){
				cotaint.massage="Total layer size and box size must be same"
				genericFactory.showAlert(cotaint);
				return;
			}
			var packingBoxReqiestDTO={}
			packingBox.addedBy=loginUser.firstName+"  "+loginUser.lastName
			packingBox.userId=loginUser.id
			packingBoxReqiestDTO.packingBox=packingBox;
			packingBoxReqiestDTO.boxLayers=$scope.layerLists
			
			console.log("SAVE :: "+JSON.stringify(packingBoxReqiestDTO))
			$rootScope.loader=true;
			var msg=""
				var url=packingBoxURL+"/addPackingBox"
				console.log("URL :: "+url)
			genericFactory.add(msg,url,packingBoxReqiestDTO).then(function(response){
				//console.log("RESPONCE :: "+JSON.stringify(packingBoxReqiestDTO))
				
				if(response.data.code==200){
					toastr.success(response.data.message);
					$scope.layerLists=[],
					$scope.packingBox=""
						$scope.addNewPackingBoxTab=false;
					$rootScope.loader=false;
					$scope.loadPackingBoxes();
				}else{
					toastr.error(response.data.message);
				}
	    		
	    	});
			

		}		
	/***************************edit funtion*****************************************/	
		$scope.editSave=function(packingBox){
			
			var cotaint={}
			cotaint.title="Alert"
				console.log("edited PacckingBOX ::"+JSON.stringify(packingBox))
			
			
			if(packingBox.boxName==""){
				$scope.boxNameErr=true
				return;
			}else{
				$scope.boxNameErr=false
			}
			
			if(packingBox.boxSize==0 ||packingBox.boxSize==""){
				$scope.boxSizeErr=true
				return;
			}else{
				$scope.boxSizeErr=false
			}
			if(packingBox.boxLayer=="" || packingBox.boxLayer==0){
				$scope.boxLayerErr=true;
				return;
			}else{
				$scope.boxLayerErr=false
			}
			var layerSizeCount=0;
			
			for(var j=0;j<$scope.layerLists.length;j++){
				
				
				if($scope.layerLists[j].layerName==""){
					console.log("LayerName EMpty ")
					$scope.layerLists[j].layerNameERR=true;
					cotaint.massage="Layer Name Required for Layer "+$scope.layerLists[j].layerNo
						genericFactory.showAlert(cotaint);
					return;
				}else{
					$scope.layerLists[j].layerNameERR=false;

				}
				if($scope.layerLists[j].layerSize==0){
					$scope.layerLists[j].layerSizeERR=true;
					cotaint.massage="Layer Size Required for Layer "+$scope.layerLists[j].layerNo
					genericFactory.showAlert(cotaint);
					return;
				}else{
					$scope.layerLists[j].layerSizeERR=false;
				}
				layerSizeCount+=$scope.layerLists[j].layerSize
				
				
				
				$scope.layerLists[j].addedBy=loginUser.firstName+"  "+loginUser.lastName
				
				
				
			}
			
			
			
			
			if(layerSizeCount!=packingBox.boxSize){
				cotaint.massage="Total layer size and box size must be same"
				genericFactory.showAlert(cotaint);
				return;
			}
			var packingBoxReqiestDTO={}
			packingBox.addedBy=loginUser.firstName+"  "+loginUser.lastName
			packingBox.userId=loginUser.id
			packingBoxReqiestDTO.packingBox=packingBox;
			packingBoxReqiestDTO.boxLayers=$scope.layerLists
			
			console.log("SAVE :: "+JSON.stringify(packingBoxReqiestDTO))
			$rootScope.loader=true;
			var msg=""
				var url=packingBoxURL+"/editPackingBox"
				console.log("URL :: "+url)
			genericFactory.add(msg,url,packingBoxReqiestDTO).then(function(response){
				//console.log("RESPONCE :: "+JSON.stringify(packingBoxReqiestDTO))
				console.log("Response :: "+JSON.stringify(response))
				if(response.data.code==200){
					toastr.success(response.data.message);
					$scope.layerLists=[],
					$scope.packingBox=""
						$scope.addNewPackingBoxTab=false;
					$rootScope.loader=false;
					$scope.loadPackingBoxes();
				}else{
					toastr.error(response.data.message);
					$rootScope.loader=false;
				}
	    		
	    	});
			
		}
	/*******************************************************************************/		
		
		var init = function() {
			$scope.loadPackingBoxes();
			$scope.packingBox={}
			$scope.packingBox.boxName=""
			$scope.packingBox.boxSize=0
			$scope.packingBox.boxLayer=0
			$scope.layerListViewTab=false
			 $scope.layerListViewTab=false
			
		}
		init();

	}
})();
