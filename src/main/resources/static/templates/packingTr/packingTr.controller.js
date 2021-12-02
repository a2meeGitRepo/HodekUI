/**
 * @author : Dattatray Bodhale
 * @name : PackingBoxMstController
 * @date : 08/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.packingTr').controller('PackingTrController', PackingTrController);
	PackingTrController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope','$stateParams','$location' ];

	/* @ngInject */
	function PackingTrController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope,$stateParams,$location) {
		
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var packingURL = staticUrl + '/packing';
		var componentURL = staticUrl + '/component';
		var packingBoxURL = staticUrl + '/packingBox';
		var poBatchURL = staticUrl + '/poBatch';
		var tempEmpId = 0;
	
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Load Packing 
		 * @date : 10/12/2020
		 */
		$scope.loadPacking = function() {
			var msg = "Packing ....', 'Successful !!";
            var url = packingURL+"/getAllPackings";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.packings= response.data;
                  //  //console.log("packings :: "+JSON.stringify($scope.packings))
                   
            });
		}
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Open Add Form 
		 * @date : 10/12/2020
		 */
		$scope.add = function() {
			$scope.addNewPackingBoxTab=true;
			$scope.loadComponent();
			$scope.loadPackingBox ();
			$scope.loadActivePO ();
			$scope.defPO=true;
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Close Form 
		 * @date : 10/12/2020
		 */
		$scope.cancelAdd = function() {
			$scope.addNewPackingBoxTab=false;
			$scope.packingBox=""
				$scope.layerLists=[]
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Open Add Form 
		 * @date : 10/12/2020
		 */
		$scope.changePO = function() {
			
			$scope.defPO=false;
			  //console.log("CHANGE PO")
			  $scope.loadActivePO ;
		}
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Load Components 
		 * @date : 10/12/2020
		 */
		$scope.loadComponent = function() {
			var msg = "Packing ....', 'Successful !!";
            var url = componentURL+"/getAllActiveComponents";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.components= response.data;
                   // console.log("components:: "+JSON.stringify($scope.components))
                   
            });
		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Load Active PO 
		 * @date : 17/12/2020
		 */
		$scope.loadActivePO = function() {
			var msg = "Packing ....', 'Successful !!";
            var url = poBatchURL+"/getAllActivePos";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.activePOs= response.data;
                    $scope.loadBatches($scope.activePOs[0]);
                    $scope.packing.po=$scope.activePOs[0];
                    //console.log("activePOs:: "+JSON.stringify($scope.activePOs[0]))
                   
            });
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Load Batches by PO
		 * @date : 10/12/2020
		 */
		$scope.loadBatches= function(po) {
			var msg = "Packing ....', 'Successful !!";
            var url = poBatchURL+"/getActiveBatchesByPo?poId="+po.poId;
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.batches= response.data;
                    //console.log("batches:: "+JSON.stringify($scope.batches))
                   
            });
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Load Packing Box 
		 * @date : 10/12/2020
		 */
		$scope.loadPackingBox = function() {
			var msg = "Packing ....', 'Successful !!";
            var url = packingBoxURL+"/getAllActivePackingBoxes";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.packingBoxes= response.data;
                  //  console.log("packingBoxes:: "+JSON.stringify($scope.packingBoxes))
                   
            });
		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : View QR
		 * @date : 10/12/2020
		 */
		$scope.viewQR = function(packing) {
			$scope.viewQRTabs=true;
			//console.log("packing  "+JSON.stringify(packing))
			var msg = "QR Loaded ....', 'Successful !!";
            var url = componentURL+"/getQRCodeByPacking?packingCode="+packing.packingCode;
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.qrCodes= response.data;
                   // console.log("qrCodes :: "+JSON.stringify($scope.qrCodes))
                   
            });
		}
		
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : save packing
		 * @date : 09/12/2020
		 */
		$scope.save = function(packing) {
			var cotaint={}
			cotaint.title="Alert"
				
			//	console.log("packing :: "+JSON.stringify(packing))
				if(packing.po==""||packing.po==null ||packing.po==undefined){
					packing.po= $scope.activePOs[0]
				}
			
			//console.log("packing 2:: "+JSON.stringify(packing))
				
			
			if(packing.componentMst==""||packing.componentMst==null){
				$scope.componentErr=true
				return;
			}else{
				$scope.componentErr=false
			}
			
			if(packing.packingBox==null ||packing.packingBox==""){
				$scope.packingErr=true
				return;
			}else{
				$scope.packingErr=false
			}
			if(packing.packingReq=="" ){
				$scope.packingReqErr=true;
				return;
			}else{
				$scope.packingReqErr=false
				
			}
		
			
			
			//console.log("DDDDD :: "+JSON.stringify(packing))
			//return;
			
			packing.createdBy=loginUser.firstName+"  "+loginUser.lastName
			packing.userId=loginUser.id
		
			$rootScope.loader=true;
			var msg=""
				var url=packingURL+"/addPacking"
				//console.log("URL :: "+url)
			genericFactory.add(msg,url,packing).then(function(response){
			
				$scope.packing={}
				$scope.addNewPackingBoxTab=false;
				$rootScope.loader=false;
				$scope.loadPacking();
				if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
				}
	    		
	    	});
			

		}		
		
		
		var init = function() {
			$scope.loadPacking();
			$scope.packingBox={}
			$scope.packingBox.boxName=""
			$scope.packingBox.boxSize=0
			$scope.packingBox.boxLayer=0
			$scope.layerListViewTab=false
			
		}
		init();
		
	//***************************************************************** VIEW *******************************************************//	
		
		
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : View Packing
		 * @date : 21/12/2020
		 */
		$scope.view= function(packing) {
			/*$scope.viewDetails=true;
			$scope.selPacking=packing*/
			//$stateParams.$state('packing/1')
			 $location.path('main/packing/'+packing.packingId)
		}
		

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
   //***************************************************************** VIEW *******************************************************//	

		
		

	}
})();
