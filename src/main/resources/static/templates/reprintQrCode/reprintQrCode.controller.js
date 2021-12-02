/**
 * @author : Dattatray Bodhale
 * @name : PackingBoxMstController
 * @date : 08/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.reprintQrCode').controller('ReprintQrCodeController', ReprintQrCodeController);
	ReprintQrCodeController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope' ];

	/* @ngInject */
	function ReprintQrCodeController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope) {
		
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var qrCodeURL = staticUrl + '/qrCode';
		var componentURL = staticUrl + '/component';
		var packingBoxURL = staticUrl + '/packingBox';
		var tempEmpId = 0;
		var vm = angular.extend(this, {
			selectAllChk: false,
	
		});

		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Load Packing 
		 * @date : 10/12/2020
		 */
		$scope.loadQrCodeByTransactionNo= function(transactionNo) {
			var msg = "Packing ....', 'Successful !!";
            var url = qrCodeURL+"/getPrintedQRCodeByTransactionNo?transactionNo="+transactionNo;
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.qrCodes= response.data;
                    console.log("qrCodes:: "+JSON.stringify($scope.qrCodes))
                    if($scope.qrCodes.length==0){
                    	var containt={}
                    	containt.title="Alert"
                    		containt.massage="Invalid Transaction No "
                    			genericFactory.showAlert(containt);
                    }else{
                        $scope.viewQRTabs=true

                    }
                   
            });
		}
		
		
				/**
		 * @author : Dattatray Bodha;e
		 * @Description : select all data on click of Select All checkbox
		 * @date : 30/12/2020
		 */
		$scope.selectAllTable = function () {
			for (var index in $scope.qrCodes) {
				$scope.qrCodes[index].check = vm.selectAllChk;
				
			}
		
		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @Description : Select Single QR Code 
		 * @date : 30/12/2020
		 */

		$scope.selectQR = function (index) {
			$scope.qrCodes[index].check = !$scope.qrCodes[index].check;

			if ($scope.qrCodes[index].check == true) {
				$scope.selectedDataCounter++;
			} else
				$scope.selectedDataCounter--;

			if ($scope.selectedDataCounter == $scope.qrCodes.length)
				vm.selectAllChk = true;
			else {
				vm.selectAllChk = false;
			}

			
		}

		/**
		 * @author : Dattatray Bodhale
		 * @Description : Select Single QR Code 
		 * @date : 30/12/2020
		 */

		$scope.print = function () {
			/*if($scope.printSize==""||$scope.printSize ==undefined){
				$scope.printSizeErr=true;
				return;
			}else{
				$scope.printSizeErr=false;
			
			}*/
			var selCount=0
			for (var i in $scope.qrCodes) {
				if ($scope.qrCodes[i].check) {
					selCount++;
				}
			}
			if(selCount==0){
				var containt={}
				containt.title="Alert";
				containt.massage="Select atleast one QR Code"
					genericFactory.showAlert(containt);
				return;
			}
			$scope.printCode();
		}
		/**
		  * @author : ABS
		  * @description : to print QR code
		  * @date : 19/06/2018
		  */
		 $scope.printCode = function(){
				var windowContent = '';
				var count=0
			 angular.forEach($scope.qrCodes,function(value,index){
				
					if($scope.qrCodes[index].check){
						 value.printBy=loginUser.id
							console.log(" Printed Value  "+JSON.stringify(value))
							$scope.reprintrd.push(value);
						count++
						console.log("ARRAY :: "+JSON.stringify($scope.qrCodes[index].componentMst.labelHeading))
			    		var idName='anycanvas' + index;
			    		var dataUrl = document.getElementById('anycanvas' + index).innerHTML
			    		//windowContent += '<div style="page-break-after: always"><div style="width:350px;height:180px;border:1px solid"><span style="height:120px;witdh:100px; margin: -75px 0px 0px 5px ;important;"><span style="height:100px;witdh:100px;padding:5px;margin-left:20px" src="'  + dataUrl + '</span></div>';
			    		if($scope.qrCodes[index].componentMst.print_size=="12 x 50 cut"){
							//12 X 50 
							console.log("SIZE  IN 12 50 cut ")
							windowContent += '<div style="page-break-after: always ;important;"><div style="width:188px;height:45px; margin-top:70px"><span style=" "><span style="padding:5px;margin-left:20px" src="'  + dataUrl + '</span><span style=" font-size: 30px;">'+$scope.qrCodes[index].componentMst.labelHeading+'</span><span style=" "><span style="padding:5px;margin-left:20px" src="'  + dataUrl + '</span><span style=" font-size: 30px;">'+$scope.qrCodes[index].componentMst.labelHeading+'</span></div>';
				    	//	windowContent += '<div style="page-break-after: always"><div style="width:350px;height:180px;border:1px solid"><span><img src="assets/images/logo.png" style="height:120px;witdh:120px;border:1px solid;margin:10px;margin-right:20px"></span><span style="height:120px;witdh:100px; margin: -75px 0px 0px 5px ;important;"><img src="' + dataUrl + '" style="height:100px;witdh:100px;border:1px solid;padding:5px;margin-left:20px"><p  style="margin-left:50%">'+accession_number+'</p></span></div></div>';

						}
						else if($scope.qrCodes[index].componentMst.print_size=="12 x 50"){
							//12 X 50 
							windowContent += '<div style="page-break-after: always ;important;"><div style="width:188px;height:45px; margin-top:70px"><span style=" "><span style="padding:5px;margin-left:20px" src="'  + dataUrl + '</span><span style=" font-size: 30px;">'+$scope.qrCodes[index].componentMst.labelHeading+'</span></div>';
				    	//	windowContent += '<div style="page-break-after: always"><div style="width:350px;height:180px;border:1px solid"><span><img src="assets/images/logo.png" style="height:120px;witdh:120px;border:1px solid;margin:10px;margin-right:20px"></span><span style="height:120px;witdh:100px; margin: -75px 0px 0px 5px ;important;"><img src="' + dataUrl + '" style="height:100px;witdh:100px;border:1px solid;padding:5px;margin-left:20px"><p  style="margin-left:50%">'+accession_number+'</p></span></div></div>';

						}
						
						else if($scope.qrCodes[index].componentMst.print_size=="25 x 50"){
							//25 X 50 
							windowContent += '<div style="page-break-after: always ;important;"><div style="width:188px;height:94px; margin-top:70px"><span style=" "><span style="padding:5px;margin-left:20px" src="'  + dataUrl + '</span><span style=" font-size: 30px;">'+$scope.qrCodes[index].componentMst.labelHeading+'</span></div>';
						}else if($scope.qrCodes[index].componentMst.print_size=="18 x 50"){
							//25 X 50 
							windowContent += '<div style="page-break-after: always ;important;"><div style="width:188px;height:68px; margin-top:70px"><span style=" "><span style="padding:5px;margin-left:20px" src="'  + dataUrl + '</span><span style=" font-size: 30px;">'+$scope.qrCodes[index].componentMst.labelHeading+'</span></div>';
						}

			    	}
					
					
                
            })
            if(count !=0){
				var popupWinindow = window.open('','_blank','width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
				popupWinindow.document.write('<html><body onload="window.print()">' + windowContent + '</html>');
				popupWinindow.document.write('<style> @page {  margin: 15;} </style>');
				popupWinindow.document.close();
				
				saveRePrintedCode()
		    }
			
			 /* for(var i = 0; i < $scope.qrCodes; i++){
					 console.log("SELECTED for "+i+"   "+$scope.qrCodes[i].check)
			    	if($scope.qrCodes[i].check){
			    		var accession_number=vm.assetUnits[i].accession_number;
			    		var dataUrl = document.getElementById('anycanvas' + i).toDataURL();
			    		windowContent += '<div style="page-break-after: always"><div style="width:350px;height:180px;border:1px solid"><span><img src="assets/images/logo.png" style="height:120px;witdh:120px;border:1px solid;margin:10px;margin-right:20px"></span><span style="height:120px;witdh:100px; margin: -75px 0px 0px 5px ;important;"><img src="' + dataUrl + '" style="height:100px;witdh:100px;border:1px solid;padding:5px;margin-left:20px"><p  style="margin-left:50%">'+accession_number+'</p></span></div></div>';

						if($scope.printType==1){
				    		windowContent += '<div style="page-break-after: always"><div style="width:350px;height:180px;border:1px solid"><span><img src="assets/images/logo.png" style="height:120px;witdh:120px;border:1px solid;margin:10px;margin-right:20px"></span><span style="height:120px;witdh:100px; margin: -75px 0px 0px 5px ;important;"><img src="' + dataUrl + '" style="height:100px;witdh:100px;border:1px solid;padding:5px;margin-left:20px"><p  style="margin-left:50%">'+accession_number+'</p></span></div></div>';

						}else{
			    		    windowContent += '<div style="page-break-after: always"><div style="width:150px;height:288px;border:1px solid"><span><img src="assets/images/logo.png" style="height:120px;witdh:100px;border:1px solid;margin:10px;margin-right:20px"></span><span style="height:120px;witdh:100px; margin: -75px 0px 0px 5px ;important;"><img src="' + dataUrl + '" style="height:100px;witdh:100px;border:1px solid;padding:5px;margin-left:20px"><p  style="margin-left:25%">'+accession_number+'</p></span></div></div>';

						}

			    	}else{
			    		 count++;
			    	}
			    }*/
		 }	
		 
		 function saveRePrintedCode(){
			 console.log("Save Printed:: "+JSON.stringify($scope.reprintrd))
			 var msg = "Packing ....', 'Successful !!";
	            var url = qrCodeURL+"/saveRePrinttedComponent";
	            genericFactory.add(msg,url,$scope.reprintrd).then(function(response) {
	                    console.log("qrCodes:: "+JSON.stringify($scope.reprintrd))
	                   
	            });
		 }
		var init = function() {
			$scope.selectedDataCounter = 0;
			
			$scope.reprintrd=[]
		}
		init();

	}
})();
