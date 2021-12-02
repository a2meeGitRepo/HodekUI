/**
 * @author : Dattatray Bodhale
 * @name : PackingBoxMstController
 * @date : 08/12/2020
 */

(function() {
	'use strict';

	angular.module('myApp.packingTr').controller('PackingController', PackingController);
	PackingController.$inject = [ '$state', '$scope', 'toastr','DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter','$rootScope','$routeParams','$stateParams','$location' ];

	/* @ngInject */
	function PackingController($state, $scope, toastr,DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter,$rootScope,$routeParams,$stateParams,$location) {
		var packngIdId = $stateParams.packngId;
		var packingURL = staticUrl + '/packing';
		var packingBoxURL = staticUrl + '/packingBox';
		var qrCodeURL = staticUrl + '/qrCode';

		var userDetail = localStorageService.get(ApiEndpoint.userKey);
  	  // con.log("userDetail  "+userDetail)

		/**
		 * @author : Dattatray Bodhale
		 * @name : Verify QR 
		 * @date : 21/12/2020
		 */
		 function play() { 
	            var audio = new Audio( 
	'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3'); 
	            audio.play(); 
	        } 
		 function read(msgtext) { 
			 var msg = new SpeechSynthesisUtterance();
			 msg.text = msgtext;
			 window.speechSynthesis.speak(msg);
	        }
		 function generaterBoxQR(packing){
			/* var d = new Date();
			 var hours = d.getHours();
			 var minutes = d.getMinutes()
			  var hours = d.getHours();
			 var year = d.getFullYear();
				var month = d.getMonth();
				var day = d.getDate();
				var daystr=""
				if(day<=9){
					daystr="0"+day
				}else{
					daystr=day
				}
				var boxqr=year+""+month+""+daystr+""+hours+""+minutes
	              console.log("Packing :: "+boxqr)
	              var packingcode=packing.packingCode
	              var qrcodes=""
	            	  var msg=""
	            		 newBoxQRCode ="Component :"+packing.componentMst.partNo+"  "+packing.componentMst.componentName+" , Quantity : "+packing.packingBox.boxSize+", Layers : "+packing.packingBox.boxLayer+", Barcode Type : "+packing.componentMst.format+" Operator : "+userDetail.firstName+" "+userDetail.lastName+" , Date : "+$filter('date')(new Date(),'yyyy-MM-dd')

				  var url = qrCodeURL+"/getShift"
            	  console.log("qrCodeURL    :: "+url)
              genericFactory.getAll(msg,url).then(function(response) {
                   $scope.shift = response.data;
					  console.log("shift    :: "+$scope.shift)
					 newBoxQRCode +=", Shift : "+$scope.shift ;

              })
	            		  var newBoxQRCode=""
	            			  var url1 = packingURL+"/getPackedSerialNo?packingId="+packing.packingId             
	     					 genericFactory.getAll(msg,url1).then(function(response) {
	     						$scope.qrcodes = response.data;
	     						  console.log("qrcodes    :: "+$scope.qrcodes)
	     						 newBoxQRCode+=", Barcodes : "+$scope.qrcodes
	     					 })
	            

			return "Box No : "+boxqr+" , Packing No :"+packingcode+" , Batch : "+packing.batch.batchName+" , "+newBoxQRCode*/
		 }
		 
		 
		 
		 function checkBox(check){
             var pcount=0
             angular.forEach($scope.layers, function(layer,layerKey) {
                    		
                    		var savedLayer=""                  

                    		 angular.forEach(layer, function(cell,cellKey) {
                    			 if(cell.packedStatus=="Packed"){
                    				 pcount++;
                    			 }
                    		 })
             })
             
          
              if(pcount==$scope.packing.packingBox.boxSize){
            	//  console.log("BOX COMPLETED")
            	  var msg = "BOX PACKING  COMPLETED"
                        					// read(msg)
                        					 $scope.boxQrTab=true 
                        					 $scope.disableScan=true
                        					
            	  var msg = "QR Loaded ....', 'Successful !!";
            	//  console.log("BOX COMPLETED   "+check)
            	  if(check=="Create"){
            		  var url = packingURL+"/addBoxQR";
                       console.log("userDetail.id    :: "+userDetail.id)
            		  $scope.boxQrCode=generaterBoxQR($scope.packing);
                	  var boxQrObj={}
                	  boxQrObj.packing=$scope.packing
                	  boxQrObj.generated_by=userDetail.id
                	  boxQrObj.generatedDateTime= new Date();
                       genericFactory.add(msg,url,boxQrObj).then(function(response) {
                     	 
                       })
                       window.location.reload();
            	  }else{
            		  var url = packingURL+"/getBoxQRByPacking?packngId="+$scope.packing.packingId;
                      // // console.log("packingURL    :: "+url)
                       genericFactory.getAll(msg,url).then(function(response) {
                           $scope.boxQrobj= response.data;
                         console.log("boxQrobj:: "+JSON.stringify($scope.boxQrobj))
                           $scope.boxQrCode=$scope.boxQrobj.boxQr;
                       })
            	  }
                 
              }

		 }
		 
		 $scope.checkQRCode= function(qrCode) {
			// console.log("Packing ::  "+JSON.stringify($scope.packing.componentMst))
			 if($scope.packing.componentMst.qrType!="Fixed"&& $scope.packing.componentMst.variableType!="Date"){
				 if($scope.packing.componentMst.constantQrCode.length<=qrCode.length){
						console.log("CALL VERIFT")
						$scope.verifyQR(qrCode);
						}
			 }else{
			//	 console.log( "LENGTH "+$scope.packing.componentMst.constantQrCode.length)
				 if($scope.packing.componentMst.constantQrCode.length==qrCode.length){
				console.log("CALL VERIFT")
				$scope.verifyQR(qrCode);
				}
			 }
			 
		 
		 
		 }
		 
		 
		 
		 
		 
		$scope.verifyQR= function(qrCode) {
			//// console.log("verifyQR    :: "+qrCode)
			if(qrCode==undefined || qrCode==""){
	        	   toastr.info("Please give required input");
	           }
	           else{
	        
			var msg = "QR Loaded ....', 'Successful !!";
            var url = packingURL+"/getComponentQRByQRCode";
           // // console.log("packingURL    :: "+url)
           document.getElementById("qrcodetab").focus();
           var obj={};
           obj.qrCode=qrCode
           obj.packingId=packngIdId
           
            genericFactory.add(msg,url,obj).then(function(response) {
                    $scope.comQR= response.data;
                    console.log("comQR "+JSON.stringify($scope.comQR))
                    var containt={};
                    containt.title="Responce"
                    	  containt.massage=$scope.comQR.message

                    if($scope.comQR.code==200){
                    	var keepGoing = true;
                    	 angular.forEach($scope.layers, function(layer,layerKey) {
                    		
                    		var savedLayer=""                  

                    		 angular.forEach(layer, function(cell,cellKey) {
                    			//  console.log("cellKey "+cellKey)
                    			 if(keepGoing){
                    				 if(cell.packedStatus==""){
                        				 cell.packedStatus="Packed";
                        				var msg = "Scann Successfull"
                        		            document.getElementById("qrcodetab").focus();
	
                        					// read(msg)
                        					 
                        					 var packedQr={}
                        				savedLayer=layerKey
                        				packedQr.boxLayerId=cell.boxLayerId
                        				packedQr.packingId=packngIdId
                        				packedQr.layerUnit=cellKey+1
                        				packedQr.qrCode=qrCode;
                        				packedQr.packed_by=userDetail.id
                        				packedQr.packedDate= new Date();
                        				var url=packingURL+"/addPackedQrCode"
                        					var msg=""
                        				 genericFactory.add(msg,url,packedQr).then(function(response) {
                        					 
                        				 })
                        				 $scope.qrCode=""
                        					 checkBox("Create")
                        					//  console.log("packedQr :: "+JSON.stringify(packedQr))
                        				 keepGoing=false;
                        			 }
                    				
                        			 
                    			 }
                    			
                    			
                        	 }) ;
                        	 
                        	 
                        	 var packedcount=0
                        	  angular.forEach($scope.layers[savedLayer], function(cell,cellKey) { 
                        		//  console.log("IN 2 FOR ")
                             	 if(cell.packedStatus=="Packed"){
                     			//	 console.log("cell PACKED")
                     				 packedcount++;
                     			 }
                         		 
                        	  })
                        	 // console.log("Packed Coutn "+packedcount)
                  			 if(layer.length==packedcount){
                  				 var msg = "Layer Completed"
                  				// read(msg);
                  			 }
                  			// console.log("layer.lengt"+layer.length)
                        	
                    	 })
                    	
                    	
                    	
                    	
                    	
                    }else{
                    	containt.massage="Wrong QR Code "
                    	 genericFactory.showAlert(containt);
                    	 $scope.qrCode=""
                    	 play();
                    }
                    document.getElementById("qrcodetab").focus();
                //    console.log("comQR :: "+JSON.stringify($scope.comQR 	))
                   
            });
            document.getElementById("qrcodetab").focus();
		}
		}
		
		/**
		 * @author : Dattatray Bodhale
		 * @name : Verify QR 
		 * @date : 21/12/2020
		 */
		$scope.back= function() {
			 $location.path('main/packingTr')
		}
		
		var init = function() {
			document.getElementById("qrcodetab").focus();
			$scope.boxQrCode="";
			// con.log("PackingId :: "+packngIdId)
						var msg=""
			 var url = packingURL+"/getpackingById?packngId="+packngIdId;
			genericFactory.getAll(msg,url).then(function(response) {
                    $scope.packing= response.data;
                   // con.log("packing :: "+JSON.stringify($scope.packing))
              })
			
			
			
			
			var msg=""
			 var url = packingURL+"/getpackingBoxDetailsByPackingId?packngId="+packngIdId;
          //  console.log("packingURL    :: "+url)
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.layers= response.data;
                   // con.log("Layersa :: "+JSON.stringify($scope.layers))
                  
                   checkBox("Initialise");
            });
           
		}
		init();
	
		
		 $scope.printCode = function(){
				var windowContent = '';
			    		var dataUrl = document.getElementById('anycanvas1').innerHTML
				windowContent += '<div style="page-break-after: always ;important;margin-top:20px;margin-bottom:20px;margin-left:-20px"><div><img src="'+ dataUrl+'"></div>'+$scope.boxQrobj.boxQr+'</div>'
					//	windowContent += '<div style="page-break-after: always ;important;"><div style="width:188px;height:45px; margin-top:70px"><span style=" "><span style="padding:5px;margin-left:20px" src="'  + dataUrl + '</span><span style=" font-size: 30px;">'+$scope.boxQrobj.boxQr+'</span></div>';

				var popupWinindow = window.open('','_blank',',scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
				popupWinindow.document.write('<html><body onload="window.print()">' + windowContent + '</html>');
				popupWinindow.document.write('<style> @page {  margin: 15;} </style>');
				popupWinindow.document.close();
		    
			
			
		 }
	}
})();
