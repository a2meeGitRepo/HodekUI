/**
 * @author : Dattatray Bodhale
 * @name : PackingBoxMstController
 * @date : 08/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.qrCodeGeneration').controller('QrCodeGenerationController', QrCodeGenerationController);
	QrCodeGenerationController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope' ];

	/* @ngInject */
	function QrCodeGenerationController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope) {
		
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
		$scope.loadQRCodetransaction= function() {
			var msg = "Packing ....', 'Successful !!";
            var url = qrCodeURL+"/getAllQRCodeTransaction";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.qrTransactions= response.data;
                    console.log("qrTransactions :: "+JSON.stringify($scope.qrTransactions))
                   
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
			
		}
		/**
		 * @author : Dattatray Bodhale
		 * @name : Close Form 
		 * @date : 10/12/2020
		 */
		$scope.cancelAdd = function() {
			$scope.addNewPackingBoxTab=false;
			
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
                    console.log("components:: "+JSON.stringify($scope.components))
                   
            });
		}
		
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : View QR
		 * @date : 10/12/2020
		 */
		$scope.viewQR = function(transaction) {
			$scope.viewQRTabs=true;
		//	console.log("packing  "+JSON.stringify(packing))
			var msg = "QR Loaded ....', 'Successful !!";
            var url = qrCodeURL+"/getQRCodeByTransactionNo?transactionNo="+transaction.transactionNo;
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.qrCodes= response.data;
                    console.log("qrCodes :: "+JSON.stringify($scope.qrCodes))
                   
            });
		}
		
		
		/**
		 * @author : Dattatray Bodhale
		 * @description : save packing
		 * @date : 09/12/2020
		 */
		$scope.save = function(grCodeGenerator) {
			var cotaint={}
			cotaint.title="Alert"
				
			console.log("JSON :: "+JSON.stringify(grCodeGenerator))
			
			if(grCodeGenerator.componentMst==""||grCodeGenerator.componentMst==null){
				$scope.componentErr=true
				return;
			}else{
				$scope.componentErr=false
				if(grCodeGenerator.componentMst.qrType=='Custom Front'||grCodeGenerator.componentMst.qrType=='Custom Back'){
					console.log("qrType :: "+grCodeGenerator.componentMst.qrType)
					
					if(grCodeGenerator.variant==""||grCodeGenerator.variant==null||grCodeGenerator.variant==undefined){
						$scope.variantDataErr=true
						return;
					}else{
						$scope.variantDataErr=false
					}
				}
			}
			
	
			
		
				if(grCodeGenerator.qrCount=="" ||grCodeGenerator.qrCount==0||grCodeGenerator.qrCount==undefined){
					$scope.qrCountErr=true;
					return;
				}else{
					$scope.qrCountErr=false
				}
			//console.log("DDDDD :: "+JSON.stringify(packing.qrCount))
			//return;
			
			//grCodeGenerator.createdBy=loginUser.firstName+"  "+loginUser.lastName
			grCodeGenerator.generatedBy=loginUser
			console.log("grCodeGenerator :: "+JSON.stringify(grCodeGenerator))
			$rootScope.loader=true;
			var msg=""
				var url=qrCodeURL+"/addQRCodeTransaction"
				console.log("URL :: "+url)
			genericFactory.add(msg,url,grCodeGenerator).then(function(response){
			
				$scope.grCodeGenerator={}
				$scope.addNewPackingBoxTab=false;
				$rootScope.loader=false;
				$scope.loadQRCodetransaction();
				if(response.data.code==200){
					toastr.success(response.data.message);
				}else{
					toastr.error(response.data.message);
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
		$scope.spitString=function (component){
			console.log(" component "+JSON.stringify(component.constantQrCode))
			var arr = component.constantQrCode.split('#T')
			$scope.string1=arr[0]+"#T"
			
					var arr1 = arr[1].split('#V')
					$scope.string2="#V"+arr1[1]
			console.log(" string1 "+$scope.string1)
			console.log(" string2 "+$scope.string2)
		}
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
		  */	 $scope.multiPrintCanvas=function(){ 
				var containt={};
				containt.title="Mandetory"

					
			
				var windowContent = '';
				var count =0;
				  for(var i = 0; i < $scope.qrCodes.length; i++){
					 
			    	if($scope.qrCodes[i].check){
			    		console.log(" IAM PRINTING ")
			    		var dataUrl = document.getElementById('anycanvas' + i).toDataURL();
			    		var value=$scope.qrCodes[i]
			    		 value.printBy=loginUser.id
							console.log(" Printed Value  "+JSON.stringify(value))
							$scope.printrd.push(value);
			    		if($scope.qrCodes[i].componentMst.print_size=="12 x 50 cut"){
			    			if($scope.qrCodes[i].componentMst.format=='datamatrix'){
			    				if($scope.qrCodes[i].componentMst.qrType=='Variable' && $scope.qrCodes[i].componentMst.variableType=='Date'){
			    				//	windowContent+='<div style="padding: 1px"><span style=" font-size: 5px;">'+$scope.qrCodes[i].componentMst.labelHeading+'</span></div><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><span style=" font-size: 25px;">'+$scope.qrCodes[i].componentMst.labelHeading2+'</span></div><div style="padding: 1px"><span style=" font-size: 5px;">'+$scope.qrCodes[i].componentMst.labelHeading+'</span></div><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><span style=" font-size: 25px;">'+$scope.qrCodes[i].componentMst.labelHeading2+'</span></div>'
				    				windowContent += '<div style="padding: 5px;display: inline-block;border:2px solid;margin-left:10px;margin-top:15px"><div class="col-xs-6"  style="display: inline-block;"><span style=" style=" font-family: Arial;font-size: 10px;""><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br><span style=" font-family: Arial;font-size: 50px; padding:4px;margin-bottom:20px"><b>'+$scope.qrCodes[i].componentMst.labelHeading2+'<b></span><img src="' + dataUrl + '" style="margin-left:25px;margin-top:5px;"></div></div><div style="padding: 5px;display: inline-block;border:2px solid;margin-left:65px;margin-top:15px"><div class="col-xs-6"  style="display: inline-block;"><span style="font-family: Arial; font-size: 15px;margin-bottom:10%"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br> <span style=" font-family: Arial;font-size: 50px;padding:4px;margin-bottom:20px"><b>'+$scope.qrCodes[i].componentMst.labelHeading2+'<b></span><img src="' + dataUrl + '"  style="margin-left:25px;margin-top:5px;"></div></div>';

				    			//	windowContent += '<div style="padding: 5px;display: inline-block;border:2px solid;margin-left:10px"><span style=" font-size: 15px;margin-bottom:10%"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ></br> </br><span style=" font-size: 15px; border:2px solid;padding:4px;margin-bottom:20px">'+$scope.qrCodes[i].componentMst.labelHeading2+'</span></div></div><div style="padding: 5px;display: inline-block;margin-left:10px"><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-size: 15px;margin-bottom:10%"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br> </br><span style=" font-size: 15px; border:2px solid;padding:4px;margin-bottom:20px">'+$scope.qrCodes[i].componentMst.labelHeading2+'</span></div></div>';
				    				//windowContent += '<div style="padding: 5px;display: inline-block;border:2px solid;margin-left:10px;margin-top:10px"><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-family: Arial;font-size: 30px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span><p style="  font-family: Arial;font-size: 30px; border:2px solid;margin: 0"><b>'+$scope.qrCodes[i].componentMst.labelHeading2+'</b></p></br></div></div><div style="padding: 5px;display: inline-block;border:2px solid;margin-top:10px;margin-left:50px"><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-family: Arial;font-size: 30px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span><p style="  font-family: Arial;font-size: 30px; border:2px solid;margin: 0"><b>'+$scope.qrCodes[i].componentMst.labelHeading2+'</b></p></br></div></div>';

			    					console.log("12 50 varibal lenth ")
			    				}else{
			    					console.log("12 50 Fixed lenth ")
				    				windowContent += '<div style="padding: 5px;display: inline-block;border:2px solid;margin-left:10px;margin-top:10px"><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-family: Arial;font-size: 30px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span><p style="  font-family: Arial;font-size: 30px; border:2px solid;margin: 0"><b>'+$scope.qrCodes[i].componentMst.labelHeading2+'</b></p></br></div></div><div style="padding: 5px;display: inline-block;border:2px solid;margin-top:10px;margin-left:50px"><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-family: Arial;font-size: 30px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span><p style="  font-family: Arial;font-size: 30px; border:2px solid;margin: 0"><b>'+$scope.qrCodes[i].componentMst.labelHeading2+'</b></p></br></div></div>';

			    				}
			    				

			    			}else{
			    				
			    			}
			    		}
			    		else if($scope.qrCodes[i].componentMst.print_size=="12 x 50"){
				    			if($scope.qrCodes[i].componentMst.format=='datamatrix'){
						    		
						    		windowContent += '<div style="padding: 5px;display: inline-block;margin-left:20px"><div class="col-xs-6"  style="display: inline-block;margin-top:20px"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px;margin-top:10px"  ><span style=" font-size: 25px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br> <span style=" font-size: 25px;padding:1px;margin-left:10px;margin-bottom:10px;">'+$scope.qrCodes[i].componentMst.labelHeading2+'</span></div></div>';

				    				//windowContent += '<div style="padding: 5px;display: inline-block;border:2px solid;margin-left:40px;margin-top:10px"><div class="col-xs-6"  style="display: inline-block;margin-left:40px"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-size: 15px;margin-bottom:10%"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br> </br><span style=" font-size: 15px; border:2px solid;padding:4px;margin-bottom:20px">'+$scope.qrCodes[i].componentMst.labelHeading2+'</span></div></div><div style="padding: 5px;display: inline-block;border:2px solid;margin-left:10px"><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-size: 15px;margin-bottom:10%"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br> </br><span style=" font-size: 15px; border:2px solid;padding:4px;margin-bottom:20px">'+$scope.qrCodes[i].componentMst.labelHeading2+'</span></div></div>';
	
				    			}else{
				    				console.log("12 50 BAR CODE")
						    		windowContent += '<div style="padding: 5px;display: inline-block;margin-left:20px"><div class="col-xs-6"  style="display: inline-block;margin-top:20px"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:70px;margin-top:10px"  ><span style=" font-family: Arial;font-size: 55px; margin-bottom:-20px"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span> <p style="font-family: Arial; font-size: 55px;padding:1px;margin-left:10px;margin-bottom:10px;;margin-top:-4px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading2+'</b></p></div></div>';

				    			}
			    		}
			    		
			    		else if($scope.qrCodes[i].componentMst.print_size=="18 x 50"){
			    			console.log("18 50 ")
			    			if($scope.qrCodes[i].componentMst.format=='datamatrix'){
					    		windowContent += '<div style="padding: 5px;display: inline-block;margin-left:30px;margin-top: 15px"><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:30px;margin-top:10px"  ><div style="font-family: Arial; font-size: 45px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></div> <span style=" font-size: 35px; font-family: Arial;border:2px solid;padding:1px;margin-left:10px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading2+'</b></span></br></br></br></div></div>';

			    			}else{
					    		windowContent += '<div style="padding: 5px;display: inline-block;margin-left:10px;margin-top:20px"><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px;margin-top:10px"  ><span style="font-family: Arial; font-size: 35px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br> <span style=" font-size: 35px; border:2px solid;padding:1px;margin-left:10px;margin-bottom:10px;">'+$scope.qrCodes[i].componentMst.labelHeading2+'</span></div></div>';

			    			}
		    		}
			    		else if($scope.qrCodes[i].componentMst.print_size=="25 x 50"){
			    			if($scope.qrCodes[i].componentMst.format=='datamatrix'){
					    		windowContent += '<div style="padding: 5px;display: inline-block;margin-left:60px"><div class="col-xs-6"  style="display: inline-block;"><img src="' + dataUrl + '" ></div><div class="col-xs-6" style="display: inline-block;margin-left:10px;margin-top:10px"  ><span style=" font-family: Arial;font-size: 35px;"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br> <span style=" font-size: 35px; border:2px solid;padding:1px;margin-left:10px;margin-bottom:10px;">'+$scope.qrCodes[i].componentMst.labelHeading2+'</span></div></div>';


			    			}else{
			    				console.log("25 50 Barcode")
					    		windowContent += '<div style="padding: 5px;margin-left:20px;margin-left:20px"><div class="col-xs-6"  style="margin-top:20px"><span style="font-family: Arial; font-size: 55px;margin-left:25%;margin-top:20px"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br><img src="' + dataUrl + '"  style="margin-left:15%"></div><div class="col-xs-6" style=""  ><span style=" font-family: Arial;font-size: 55px;margin-left:30%;"><b>'+$scope.qrCodes[i].componentMst.labelHeading2+'</b></span></div></div>';

			    			}
		    		}
					//	windowContent+=	'<div style="padding: 5px; display: inline-block;border:2px solid;margin-left:10px"><div class="col-xs-6" style="display: inline-block;><img "src="'  + dataUrl + '</div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-size: 15px;margin-bottom:10%"><b>'+$scope.qrCodes[i].componentMst.labelHeading+'</b></span></br> </br><span style=" font-size: 15px; border:2px solid;padding:4px;margin-bottom:20px">'+$scope.qrCodes[index].componentMst.labelHeading2+'</span></div></div><div style="padding: 5px; display: inline-block;border:2px solid;margin-left:10px"><div class="col-xs-6" style="display: inline-block; "src="'  + dataUrl + '</div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-size: 15px;margin-bottom:10%"><b>'+$scope.qrCodes[index].componentMst.labelHeading+'</b></span></br> </br><span style=" font-size: 15px; border:2px solid;padding:4px;margin-bottom:20px">'+$scope.qrCodes[index].componentMst.labelHeading2+'</span></div></div>'

						

			    	}else{
			    		 count++;
			    	}
			    }
				  
				  
				  if(count==$scope.qrCodes.length){
					  
							containt.massage="Please Select At least one "
								genericFactory.showAlert(containt);
				  }else{
					 
							var popupWinindow = window.open('','_blank','width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
							popupWinindow.document.open();
							popupWinindow.document.write('<html><body onload="window.print()">' + windowContent + '</html>');
							popupWinindow.document.write('<style> @page {  margin: 15;} </style>');
							popupWinindow.document.close();
						
							savePrintedCode();
				  }
				  
			    
			
			}
		 $scope.printCode = function(){
				var windowContent = '';
				var count=0
			 angular.forEach($scope.qrCodes,function(value,index){
				console.log(" index  "+index)
					if($scope.qrCodes[index].check){
						 value.printBy=loginUser.id
							console.log(" Printed Value  "+JSON.stringify(value))
							$scope.printrd.push(value);
						count++
						console.log("ARRAY :: "+JSON.stringify($scope.qrCodes[index].componentMst.labelHeading))
			    		var idName='anycanvas' + index;
			    		var dataUrl = document.getElementById('anycanvas' + index).toDataURL()
			    		//windowContent += '<div style="page-break-after: always"><div style="width:350px;height:180px;border:1px solid"><span style="height:45px;witdh:100px; margin: -75px 0px 0px 5px ;important;"><span style="height:100px;witdh:100px;padding:5px;margin-left:20px" src="'  + dataUrl + '</span></div>';
			    		console.log("dataUrl  :: "+dataUrl)
						if($scope.qrCodes[index].componentMst.print_size=="12 x 50 cut"){
							//12 X 50 
							console.log("SIZE  IN 12 50 cut ")
					windowContent+=	'<div style="padding: 5px; display: inline-block;border:2px solid;margin-left:10px"><div class="col-xs-6" style="display: inline-block;><img "src="'  + dataUrl + '</div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-size: 15px;margin-bottom:10%"><b>'+$scope.qrCodes[index].componentMst.labelHeading+'</b></span></br> </br><span style=" font-size: 15px; border:2px solid;padding:4px;margin-bottom:20px">'+$scope.qrCodes[index].componentMst.labelHeading2+'</span></div></div><div style="padding: 5px; display: inline-block;border:2px solid;margin-left:30px"><div class="col-xs-6" style="display: inline-block; "src="'  + dataUrl + '</div><div class="col-xs-6" style="display: inline-block;margin-left:10px"  ><span style=" font-size: 15px;margin-bottom:10%"><b>'+$scope.qrCodes[index].componentMst.labelHeading+'</b></span></br> </br><span style=" font-size: 15px; border:2px solid;padding:4px;margin-bottom:20px">'+$scope.qrCodes[index].componentMst.labelHeading2+'</span></div></div>'
							



//windowContent+='<div class="row" style="page-break-after: always ;important;"><div class="col-sm-6 col-xs-6" style=" height:120px; "><span src="'  + dataUrl + '</span><span style=" font-size: 15px;">'+$scope.qrCodes[index].componentMst.labelHeading+'</span><span style=" font-size: 15px;">'+$scope.qrCodes[index].componentMst.labelHeading2+'</span></div><div class="col-sm-6 col-xs-6" style=" height:120px; "><span src="'  + dataUrl + '</span><span style=" font-size: 15px;">'+$scope.qrCodes[index].componentMst.labelHeading+'</span><span style=" font-size: 15px;">'+$scope.qrCodes[index].componentMst.labelHeading2+'</span></div></div>'
							
							//windowContent += '<div class="row" style="page-break-after: always ;important;"><span class="col-sm-6 col-xs-6"style="width:188px;height:45px; margin-top:70px;border:2px solid"><span  style="padding:5px;margin-left:20px;" src="'  + dataUrl + '</span><span class="col-sm-3 col-xs-3"style=" font-size: 15px;border:2px solid">'+$scope.qrCodes[index].componentMst.labelHeading+'</span><span style=" font-size: 15px;border:2px solid">'+$scope.qrCodes[index].componentMst.labelHeading+'</span></div></div>';
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
				savePrintedCode()
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
		 
		 
		 function savePrintedCode(){
			 console.log("Save Printed:: "+JSON.stringify($scope.printrd))
			 var msg = "Packing ....', 'Successful !!";
	            var url = qrCodeURL+"/savePrinttedComponent";
	            genericFactory.add(msg,url,$scope.printrd).then(function(response) {
	                   // console.log("qrCodes:: "+JSON.stringify($scope.reprintrd))
	                   
	            });
		 }
		var init = function() {
			$scope.selectedDataCounter = 0;
			$scope.loadQRCodetransaction();
			$scope.packingBox={}
			$scope.packingBox.boxName=""
			$scope.packingBox.boxSize=0
			$scope.packingBox.boxLayer=0
			$scope.layerListViewTab=false
			$scope.printrd=[]
			
		}
		init();

	}
})();
