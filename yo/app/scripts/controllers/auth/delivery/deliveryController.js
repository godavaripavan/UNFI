'use strict';
angular.module('mrc')
	.controller('deliveryController', ['$scope', '$rootScope','urlService','$filter','deliveryService','alertService','loaderService','commonService',
		function(scope, rootScope,urlService,$filter,deliveryService,alertService,loaderService,commonService) {
			scope.delivery={'page':'list','items':[]};
			scope.delivery.createTab={'tab':'sales'};
			scope.delivery.serachText='';
			scope.delivery.deliveryOrderNumber='';
			scope.delivery.refDoc='';
			scope.delivery.enableDoc=false;
			scope.delivery.createSarch = '';
			scope.delivery.create = urlService.getView('A_DELIVERY_CREATE');
			scope.delivery.detail = urlService.getView('A_DELIVERY_DETAIL');
			scope.delivery.list = urlService.getView('A_DELIVERY_LIST');
			scope.delivery.salesOrders = {};
			scope.delivery.deliveryItems = {};
			scope.delivery.deliveryData={};
			scope.delivery.orderSelected = false;
			scope.delivery.materialDocs = "";

			var count = 0;
			scope.fnOpenCreateDeliveryPage =function(data,details){
				scope.delivery.delivaryDataOriginal=[];
				scope.delivery.delivaryDataOriginal.deliveryId='';
				scope.delivery.existed = false;
				scope.delivery.enablePrint = false;
				scope.delivery.enableDoc=false;
				scope.delivery.deliveryId='';
				scope.delivery.temp = [];
				scope.totalTruckLoad = 0;
				var salesData=angular.copy(data);
				scope.delivery.delivaryDataOriginal.createStatus = true;
				scope.delivery.materialDocsCreate = details.materialDocs;
				for (var i = 0; i < salesData.length; i++) {
					if(salesData[i].isChecked == true){
						if(salesData[i].weight != ""){
							scope.totalTruckLoad = scope.totalTruckLoad + parseFloat(salesData[i].weight);
						}
						scope.delivery.temp.push(salesData[i])
					}else{
						count = count + 1;
					}
				};
				if( scope.totalTruckLoad == "NaN" || scope.totalTruckLoad == "" || scope.totalTruckLoad == undefined){
					scope.delivery.totalTruckLoad = 0;
				}else{
					scope.delivery.totalTruckLoad = parseFloat(scope.totalTruckLoad);
				}
				if(count == salesData.length){
					alertService.warn("Select Atleast one Item");
					count = 0;
				}else{
					count = 0;
					scope.delivery.detailavail = scope.delivery.temp;
					scope.delivery.detailavail.deliveryOrderNumber = '';
					scope.delivery.page = 'detail';
				}
			};
			scope.fnOpenCreatePage = function(page){
				scope.delivery.editModeDisabled=false;
				scope.delivery.page = page;
			};
			scope.fnmakeThisActive=function(tab){
				scope.delivery.createTab.tab = tab;
				scope.delivery.salesOrders = [];
			};
			scope.fnRemoveItems = function(index){
				scope.delivery.detailavail.splice(index, 1);
				if (scope.delivery.detailavail.length == 0) {
					scope.fnClearCompleView();
				}
				scope.calcTruckLoad();
				
			};
			scope.calcTruckLoad = function(){
				scope.delivery.totalTruckLoad=0;
				if(scope.delivery.detailavail && scope.delivery.detailavail.length>0){
					for(var i=0;scope.delivery.detailavail.length;i++){
						if(scope.delivery.detailavail[i].weight){
							scope.delivery.totalTruckLoad += parseFloat(scope.delivery.detailavail[i].weight);	
						}
					}
				}
				if(!isNaN(scope.delivery.totalTruckLoad)){
					scope.delivery.totalTruckLoad=scope.delivery.totalTruckLoad.toFixed(2);
				}else{
					scope.delivery.totalTruckLoad=0;
				}
			};
			/*scope.fnSaveDelivery = function (){
				scope.delivery.readyToSave = true;
			};*/
			scope.allvendors = [{
				id: 1,
				vendor: "Boardman foods Inc"
			}, {
				id: 2,
				vendor: "Boardman foods Inc"
			}, {
				id: 3,
				vendor: "Boardman foods Inc"
			}, {
				id: 4,
				vendor: "Boardman foods Inc"
			}];
			scope.fnToogleDetailView = function(){
				scope.delivery.page = 'list';
				scope.delivery.showOrders = false;
				scope.delivery.serachText = "";

			}
			scope.fnClearCompleView=function(){
				scope.fnToogleDetailView();
				scope.delivery.overAllOrders=[];
				scope.delivery.salesOrders=[];
				scope.delivery.orderSelected=false;
				scope.delivery.salesData={};
				scope.delivery.createSarch="";
				scope.fnGetDeliveryOrdersList('0000100020');
			};
			scope.selectedvendor = scope.allvendors[0];
			scope.getSalesOrders = function(){
				var xmlSoapObject=scope.getDelivarySalesOrderXml();
				deliveryService.getAllSalesOrders(xmlSoapObject,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						scope.delivery.overAllOrders =angular.copy(result.data);
						scope.delivery.salesOrders =angular.copy(result.data);
						var temp=[];
						var data=[];
						for (var i = 0; i < scope.delivery.salesOrders.length; i++) {
							if(!commonService.searchArray(temp,scope.delivery.salesOrders[i].salesOrderId)){
								temp.push(scope.delivery.salesOrders[i].salesOrderId);
								data.push(scope.delivery.salesOrders[i]);
							}
						}
						scope.delivery.salesOrders=angular.copy(data);
					}
				});
			};
			scope.getDelivarySalesOrderXml = function(){
				var salseOrderXml ='';
				salseOrderXml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
				salseOrderXml += '<soapenv:Header/>';
				salseOrderXml += '<soapenv:Body>';
				salseOrderXml += '<urn:ZGetSalesordInfo>';
				salseOrderXml +='<IvBranch/>';
				if(scope.delivery.createTab.tab == 'customer'){
					salseOrderXml += '<IvCustNum>0000000'+scope.delivery.createSarch+'</IvCustNum>';
					salseOrderXml += '<IvSalesOrd/>';
					salseOrderXml += '<IvBranch/>';
				}else if(scope.delivery.createTab.tab == 'branch'){
					salseOrderXml += '<IvCustNum/>';
					salseOrderXml += '<IvSalesOrd/>';
					salseOrderXml += '<IvBranch>'+scope.delivery.createSarch+'</IvBranch>'
				}else if(scope.delivery.createTab.tab == 'sales'){
					salseOrderXml += '<IvCustNum></IvCustNum>';
					salseOrderXml += '<IvSalesOrd>'+scope.delivery.createSarch+'</IvSalesOrd>'; 
					salseOrderXml += '<IvBranch/>'
				}
				salseOrderXml += '<TSalesOrd>';
				salseOrderXml += '<item/>';
				salseOrderXml += '</TSalesOrd>';
				salseOrderXml += '</urn:ZGetSalesordInfo>';
				salseOrderXml += '</soapenv:Body>';
				salseOrderXml += '</soapenv:Envelope>';
				return salseOrderXml;
			};
			scope.fnShowSalesOrders = function(salesOrder){
				scope.delivery.orderSelected = true;
				scope.delivery.salesData={};
				var selectedSalesOrderData=_.where(scope.delivery.overAllOrders,{'salesOrderId':salesOrder.salesOrderId});
				scope.delivery.salesData = angular.copy(selectedSalesOrderData[0]);
				try{
					for(var i=1;i<selectedSalesOrderData.length;i++){
						for (var j = 0; j < selectedSalesOrderData[i].deliveryLineItems.length; j++) {
							scope.delivery.salesData.deliveryLineItems.push(selectedSalesOrderData[i].deliveryLineItems[j]);
						}
					}
				}catch(e){
				}
			};
			scope.fnSendRequestDelivery=function(data,cb){
				deliveryService.getAllDeliveryOrders(data,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						try{
							var tempData=result.data;           
							scope.delivery.deliveries = angular.copy(tempData.headerItems);
							scope.delivery.deliveryItems = angular.copy(tempData.lineItems);
						}catch(e){
							alertService.warn("Sorry, unable to get Delivery list!");
						}
					}
				});
			};
			scope.fnGetDeliveryOrdersList=function(customerId){
				var xmlSoapObject=deliveryService.getDeliveryListRequestObjectXML(customerId);
				if(xmlSoapObject){
					scope.fnSendRequestDelivery(xmlSoapObject,function(){});
				}
			};
		
		/*	scope.fnGetDeliveryOrdersList=function(searchTxt){
				scope.delivery.showOrders = true;
				deliveryService.getAllDeliveryOrders(searchTxt,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						scope.items=angular.copy(result.message);
						console.log(scope.items);
					}
				});
			};*/
			scope.fnShowDetailsPage=function(data){
				/*scope.deliveryItem = item;*/
				scope.totalTruckLoad = 0;
				scope.delivery.salesData ={};
				scope.delivery.deliveryLineItem = [];
				scope.delivery.deliveryLineItem.otherDetails={};
				scope.delivery.delivaryDataOriginal= angular.copy(data);
				scope.delivery.delivaryDataOriginal.createStatus = false;
				scope.delivery.materialDocsListPage = scope.delivery.delivaryDataOriginal.materialDocs;
				scope.delivery.salesData.shipToPartyCustomer = scope.delivery.delivaryDataOriginal.shipToPartyCustomer;
				if(data.pgiDate == "0000-00-00"){
					scope.delivery.enableDoc=false;
				}else{
					scope.delivery.enableDoc=true;
				}
				for(var i=0;i < scope.delivery.deliveryItems.length;i++ ){
					if(scope.delivery.deliveryItems[i].deliveryId == scope.delivery.delivaryDataOriginal.deliveryId){
						scope.delivery.deliveryLineItem.push(scope.delivery.deliveryItems[i]);
						scope.delivery.delivaryDataOriginal.deliveryId = scope.delivery.delivaryDataOriginal.deliveryId;
					}
				};
				for(var j=0;j<scope.delivery.deliveryLineItem.length;j++){
					if(scope.delivery.deliveryLineItem[j].deliveryId == scope.delivery.delivaryDataOriginal.deliveryId){
					
						scope.delivery.deliveryLineItem[j].deliveryDate = scope.delivery.delivaryDataOriginal.deliveryDate;
						scope.delivery.deliveryOrderNumber = scope.delivery.delivaryDataOriginal.deliveryId;
					}
					if(scope.delivery.deliveryLineItem[j].weight != ""){
							scope.totalTruckLoad +=  parseFloat(scope.delivery.deliveryLineItem[j].weight);
					}
				}

				if( scope.totalTruckLoad == "NaN" || scope.totalTruckLoad == "" || scope.totalTruckLoad == undefined){
					scope.delivery.totalTruckLoad = 0;
				}else{
					scope.delivery.totalTruckLoad = parseFloat(scope.totalTruckLoad);
				}

				scope.delivery.deliveryLineItem.otherDetails = scope.delivery.delivaryDataOriginal;
				
				scope.delivery.existed = true;
				scope.delivery.enablePrint = true;
				scope.delivery.editModeDisabled = true;
				scope.delivery.detailavail = scope.delivery.deliveryLineItem;
				scope.delivery.page = 'detail';
			};
				/*integration1*/
			scope.fnEnableEditMode=function(){
				scope.delivery.editModeDisabled = false;
				if(scope.delivery.existed){
					scope.delivery.enablePrint= true;
				}else{
					scope.delivery.enablePrint= false;
				}
			};
			scope.fnDisableEditMode=function(){
				var tempDelivery='';
				tempDelivery=scope.fnSaveDelivery();
				scope.delivery.editModeDisabled = true;
				if(scope.delivery.existed){
					scope.delivery.enablePrint= true;
				}else{
					scope.delivery.enablePrint= true;
				}
			};
    /*detail page functionality */
			scope.deliveryTemplates =
					[ { actCls:'active', id:'deliveryLineItems', url: 'views/auth/delivery/deliveryTabView.html', title:'Delivery Line Items'},
						{ actCls:'', id:'deliveryHeaderDetails', url: '',title:'Delivery Header Details'}
					];
			scope.dateOptions = {
			 'year-format': "'yy'",
			 'starting-day': 1
			};
 			scope.formats = ['MM/dd/yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  		scope.format = scope.formats[3];

  		scope.fnGetyyyy = function(date){
  			 var yyyy = date.getFullYear().toString();                                    
           var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based         
             var dd  = date.getDate().toString();             
                            
           return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
  		};
  		scope.fnGetEndDate=function(date){
  			if(date){
	  			var date =  new Date(date);
	  			var year = date.getFullYear();
				  var month = (1 + date.getMonth()).toString();
				  month = month.length > 1 ? month : '0' + month;
				  var day = date.getDate().toString();
				  day = day.length > 1 ? day : '0' + day;
				  return  month + '/' + day+'/'+year ;
				}else{
					return '';
				}
  		};
  		scope.today = function() {
		    scope.dt = new Date();
		  };
		  
		  scope.fnOpenHeatCodeModal = function(x){
		  	scope.popUpMaterialId = scope.delivery.detailavail[x].materialId;
		  	$("#deliveryHeatCode").modal("toggle");
		  };
		  /*----- Save Delivery starting -----*/
			scope.fnSaveDeliveryHeader=function(saveDeliveryData){
				try{
					var saveDeliveryData=angular.copy(saveDeliveryData);
					var saveDeliveryReqItem ='';
					console.log('saveDeliveryData<><><><>',saveDeliveryData);
					/* For Header*/
					saveDeliveryReqItem += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
					saveDeliveryReqItem += '<soapenv:Header/><soapenv:Body>';
					/*For Body*/
					saveDeliveryReqItem += '<urn:ZbapiOutbDeliveryCreateSls>';
					saveDeliveryReqItem += '<CreatedItems>';
					saveDeliveryReqItem += '<item>';
					saveDeliveryReqItem += '<RefDoc></RefDoc>';
					saveDeliveryReqItem += '<RefItem></RefItem>';
					saveDeliveryReqItem += '<DelivNumb></DelivNumb>';
					saveDeliveryReqItem += '<DelivItem></DelivItem>';
					saveDeliveryReqItem += '<Material></Material>';
					saveDeliveryReqItem += '<DlvQty></DlvQty>';
					saveDeliveryReqItem += '<SalesUnit></SalesUnit>';
					saveDeliveryReqItem += '<SalesUnitIso></SalesUnitIso>';
					saveDeliveryReqItem += '<MaterialExternal></MaterialExternal>';
					saveDeliveryReqItem += '<MaterialGuid></MaterialGuid>';
					saveDeliveryReqItem += '<MaterialVersion></MaterialVersion>';
					saveDeliveryReqItem += '</item>';
					saveDeliveryReqItem += '</CreatedItems>';
					if(scope.delivery.deliveryOrderNumber==''){
						saveDeliveryReqItem += '<Delivery></Delivery>';
						saveDeliveryReqItem += '<DeliveryFlag>C</DeliveryFlag>';
					}else{
						saveDeliveryReqItem += '<Delivery>'+scope.delivery.deliveryOrderNumber+'</Delivery>';
						saveDeliveryReqItem += '<DeliveryFlag>M</DeliveryFlag>';
					}
					saveDeliveryReqItem += '<Return>';
					saveDeliveryReqItem += '<item><Type></Type><Id></Id><Number></Number><Message></Message><LogNo></LogNo><LogMsgNo></LogMsgNo><MessageV1></MessageV1><MessageV2></MessageV2><MessageV3></MessageV3><MessageV4></MessageV4><Parameter></Parameter><Row></Row><Field></Field><System></System></item>';
					saveDeliveryReqItem += '</Return>';

					saveDeliveryReqItem += '<SalesOrderItems>';
						for (var i = 0; i < saveDeliveryData.length; i++) {
							saveDeliveryReqItem += '<item>';
							saveDeliveryReqItem += '<PosnrVl>00' + ((i + 1) * 10) + '</PosnrVl>';
							saveDeliveryReqItem += '<Matnr>'+saveDeliveryData[i].materialId+'</Matnr>';
							saveDeliveryReqItem += '<Werks>'+saveDeliveryData[i].plantId+'</Werks>';
							saveDeliveryReqItem += '<Lgort>'+saveDeliveryData[i].storageLocation+'</Lgort>';
							saveDeliveryReqItem += '<Lfimg>'+saveDeliveryData[i].quantity+'</Lfimg>';
							saveDeliveryReqItem += '<Pikmg>'+saveDeliveryData[i].pickQuantity+'</Pikmg>';
							saveDeliveryReqItem += '<Meins>'+saveDeliveryData[i].uomId+'</Meins>';
							saveDeliveryReqItem += '<Ntgew>'+saveDeliveryData[i].weight+'</Ntgew>';
							saveDeliveryReqItem += '<Netpr>'+saveDeliveryData[i].totalPrice+'</Netpr>';
							saveDeliveryReqItem += '<Lfdat>'+scope.savedDate(saveDeliveryData[i].deliveryDate)+'</Lfdat>';
							//console.log('==>',fnGetDateRequired(saveDeliveryData[i].deliveryDate);
							saveDeliveryReqItem += '<Arktx>'+saveDeliveryData[i].plantId+'</Arktx>';
							saveDeliveryReqItem += '</item>';
						};
					saveDeliveryReqItem += '</SalesOrderItems>';
					if(saveDeliveryData[0].salesorderId){
						saveDeliveryReqItem += '<Vbeln>'+saveDeliveryData[0].salesorderId+'</Vbeln>';
					}else{
						saveDeliveryReqItem += '<Vbeln></Vbeln>';
					}
					


					saveDeliveryReqItem += '</urn:ZbapiOutbDeliveryCreateSls>';
					/*End of Body*/
					saveDeliveryReqItem += '</soapenv:Body></soapenv:Envelope>';
					return saveDeliveryReqItem;
				}catch(e){
					alertService.warn('Sorry, Invalid delivery data !');
					return null;
				}
			};
			
			scope.fnDeliveryReq =function(data){
				var flag=true;
				if(scope.delivery.deliveryOrderNumber==''){
					flag=true;
				}else{
					flag=false;
				}
				deliveryService.saveDelivery(data,flag,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						try{
							var tempData= commonService.convertXmlToJson(result.data);      
							var saveDeliveryDataResult=tempData.Envelope.Body.ZbapiOutbDeliveryCreateSlsResponse;	
							var deliveryOrderNumber=saveDeliveryDataResult.Delivery;
								if(scope.delivery.delivaryDataOriginal.createStatus){
									scope.delivery.materialDoc = scope.delivery.materialDocsCreate;
								}else{
									scope.delivery.materialDoc = scope.delivery.materialDocsListPage;
								}
							if(deliveryOrderNumber){
								scope.delivery.deliveryOrderNumber=deliveryOrderNumber;
								//scope.delivery.delivaryDataOriginal= [];
								scope.delivery.delivaryDataOriginal.deliveryId='';
								scope.delivery.delivaryDataOriginal.deliveryId= angular.copy(scope.delivery.deliveryOrderNumber);
								scope.delivery.delivaryDataOriginal.materialDocs = scope.delivery.materialDoc;
								if(flag){
									alertService.success('Delivery Created with : ' + deliveryOrderNumber);
								}else{
									alertService.success('Delivery Updated with : ' + deliveryOrderNumber);
								}
							}else{
								alertService.success('Delivery Order Not Created ' );
							}
						}catch(e){
							alertService.warn("Sorry, unable to get Delivery list!");
						}
					}
					loaderService.stop();
					
				});
			};
			scope.fnSaveDelivery = function(){
				loaderService.start();
				var saveDeliveryData=scope.delivery.detailavail;
				var xmlSoapObject=scope.fnSaveDeliveryHeader(saveDeliveryData);
				if(xmlSoapObject){
					scope.fnDeliveryReq(xmlSoapObject,function(){
						loaderService.stop();
					});
				}else{
					loaderService.stop();
				}
			};
			/*----- Save Delivery Ends -----*/
		
			/*-------------------Delivery Doc Details Starting-----------------*/
			 scope.fnDeliveryDocumentDetailReqHeader =function(){
			 		try{
					var saveDocReqItem ='';
					saveDocReqItem += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
					saveDocReqItem += '<soap:Header/>';
					saveDocReqItem += '<soap:Body>';
					saveDocReqItem += '<urn:ZGetAccDocDetail>';
					if(scope.delivery.refDoc){
						saveDocReqItem += '<IMatdoc>'+scope.delivery.refDoc+'</IMatdoc>';
					}else{
						saveDocReqItem += '<IMatdoc>'+scope.delivery.delivaryDataOriginal.materialDocs+'</IMatdoc>';
					}
					saveDocReqItem += '<TAcchd>';
					saveDocReqItem += '<item/>';
					saveDocReqItem += '</TAcchd>';
					saveDocReqItem += '<TAccit>';
					saveDocReqItem += '<item/>';
					saveDocReqItem += '</TAccit>';
					saveDocReqItem += '</urn:ZGetAccDocDetail>';
					saveDocReqItem += '</soap:Body>';
					saveDocReqItem += '</soap:Envelope>';

					return saveDocReqItem;
				}catch(e){
					alertService.warn('Sorry Invalid Material No. !');
					return null;
				}
			 };

			 scope.fnDeliveryDocumentDetailReq =function(data,cb){
			 	deliveryService.GetDeliveryDocDetail(data,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						try{
							var tempData=result.data;       
							scope.delivery.DocDetails = angular.copy(tempData);
						}catch(e){
							alertService.warn("Sorry, unable to get Doc Details!");
						}
					}
					if(cb instanceof Function){
						cb();
					}
				});
			 };

			 scope.fnAcountingDocDetails=function(){
					loaderService.start();
					var xmlSoapObject=scope.fnDeliveryDocumentDetailReqHeader();
					if(xmlSoapObject){
						scope.fnDeliveryDocumentDetailReq(xmlSoapObject,function(){
							loaderService.stop();
						});
					}else{
						loaderService.stop();
					}
			 };

			/*-------------------Delivery Doc Details Ending-----------------*/
			/*On time delivery flag generation based on data start*/
			scope.fnGetOnTimestatus=function(item){
				var pgiDate = item.pgiDate;
				if(item.pgiDate == "0000-00-00"){
					var pgifrom = new Date("0001-01-01");
				}else{
					var pgifrom = new Date(item.pgiDate);
				}
				var deliveryDate = item.deliveryDate;
				var deliveryfrom = new Date(item.deliveryDate);
				if(pgifrom > deliveryfrom ){
					return "dsui-red";
				}else{
					return "dsui-green";
				}
			};
			/*On time delivery flag generation based on data end*/
		 /**/
		 scope.fnGetmaterialDocs=function(item){
		 	if(item.materialDocs){
		 		return '#'+item.materialDocs;	
		 	}else{
		 		return '#';
		 	}
		 };
/*save PGI and Delivery start*/
			scope.savedDate=function(date){
				var newDate;
				 var matches = /(\d{4})[-\/](\d{2})[-\/](\d{2})/.exec(date);
				if(matches){
					newDate = date;
				}else{
					newDate=scope.fnGetyyyy(date);
				}
				return newDate;

			};
			scope.fnSavePgiAndDeliveryHeader=function(saveDeliveryData){
				try{
					var saveDeliveryData=angular.copy(saveDeliveryData);
					var saveDeliveryReqItem ='';
					/* For Header*/
					saveDeliveryReqItem += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
					saveDeliveryReqItem += '<soap:Header/><soap:Body>';
					/*For Body*/
					saveDeliveryReqItem += '<urn:ZwsDeliveryPgi>';
					saveDeliveryReqItem += '<CreatedItems>';
					saveDeliveryReqItem += '<item>';
					saveDeliveryReqItem += '<RefDoc></RefDoc>';
					saveDeliveryReqItem += '<RefItem></RefItem>';
					saveDeliveryReqItem += '<DelivNumb></DelivNumb>';
					saveDeliveryReqItem += '<DelivItem></DelivItem>';
					saveDeliveryReqItem += '<Material></Material>';
					saveDeliveryReqItem += '<DlvQty></DlvQty>';
					saveDeliveryReqItem += '<SalesUnit></SalesUnit>';
					saveDeliveryReqItem += '<SalesUnitIso></SalesUnitIso>';
					saveDeliveryReqItem += '<MaterialExternal></MaterialExternal>';
					saveDeliveryReqItem += '<MaterialGuid></MaterialGuid>';
					saveDeliveryReqItem += '<MaterialVersion></MaterialVersion>';
					saveDeliveryReqItem += '</item>';
					saveDeliveryReqItem += '</CreatedItems>';
					saveDeliveryReqItem += '<ImDelivery>'+scope.delivery.deliveryOrderNumber+'</ImDelivery>';
					saveDeliveryReqItem += '<ImVbeln>'+saveDeliveryData[0].salesorderId+'</ImVbeln>';
					
					saveDeliveryReqItem += '<Return>';
					saveDeliveryReqItem += '<item><Type></Type><Id></Id><Number></Number><Message></Message><LogNo></LogNo><LogMsgNo></LogMsgNo><MessageV1></MessageV1><MessageV2></MessageV2><MessageV3></MessageV3><MessageV4></MessageV4><Parameter></Parameter><Row></Row><Field></Field><System></System></item>';
					saveDeliveryReqItem += '</Return>';

					saveDeliveryReqItem += '<SalesOrderItems>';
						for (var i = 0; i < saveDeliveryData.length; i++) {
							saveDeliveryReqItem += '<item>';
							saveDeliveryReqItem += '<PosnrVl>00' + ((i + 1) * 10) + '</PosnrVl>';
							saveDeliveryReqItem += '<Matnr>'+saveDeliveryData[i].materialId+'</Matnr>';
							saveDeliveryReqItem += '<Werks>'+saveDeliveryData[i].plantId+'</Werks>';
							saveDeliveryReqItem += '<Lgort>'+saveDeliveryData[i].storageLocation+'</Lgort>';
							saveDeliveryReqItem += '<Lfimg>'+saveDeliveryData[i].quantity+'</Lfimg>';
							saveDeliveryReqItem += '<Pikmg>'+saveDeliveryData[i].pickQuantity+'</Pikmg>';
							saveDeliveryReqItem += '<Meins>'+saveDeliveryData[i].uomId+'</Meins>';
							saveDeliveryReqItem += '<Ntgew>'+saveDeliveryData[i].weight+'</Ntgew>';
							saveDeliveryReqItem += '<Netpr>'+saveDeliveryData[i].totalPrice+'</Netpr>';
						
							saveDeliveryReqItem += '<Lfdat>'+scope.savedDate(saveDeliveryData[i].deliveryDate)+'</Lfdat>';
							console.log('fnGetEndDate==',scope.fnGetEndDate(saveDeliveryData[i].deliveryDate));
							//console.log('saveDeliveryData[i].deliveryDate<><><><><><>',commonService.getDateFromMillisecondsInRequestFormat1(saveDeliveryData[i].deliveryDate.getTime());
							saveDeliveryReqItem += '<Arktx>'+saveDeliveryData[i].plantId+'</Arktx>';
							saveDeliveryReqItem += '</item>';
						};
					saveDeliveryReqItem += '</SalesOrderItems>';
					
					saveDeliveryReqItem += '</urn:ZwsDeliveryPgi>';
					/*End of Body*/
					saveDeliveryReqItem += '</soap:Body></soap:Envelope>';
					//console.log('tgtgtgtgtg====',saveDeliveryReqItem);
					return saveDeliveryReqItem;
				}catch(e){
					alertService.warn('Sorry, Invalid delivery data !');
					return null;
				}
			};
			scope.fnPgiDeliveryReq =function(data){
				deliveryService.savePgiDelivery(data,function(result){
							if(result.error){
								alertService.warn(result.message);
							}else{
								try{
									var savedPgiData=commonService.convertXmlToJson(result.data);
									var refDoc='';
									refDoc=angular.copy(savedPgiData.Envelope.Body.ZwsDeliveryPgiResponse.CreatedItems.item.RefDoc);
									//console.log('savedPgiData...>',refDoc);
									if(refDoc!=''){
										scope.delivery.refDoc=refDoc;
										scope.delivery.enableDoc=true;
										alertService.success('PGi Created with : ' + refDoc);
									}else{
										alertService.warn('Sorry, unable to Save PGI !');
									}
									
								}catch(e){
									alertService.warn('Sorry, unable to Save PGI !');
									loaderService.stop();
								}
								loaderService.stop();
							}
				});				
			};
			scope.fnSavePgi = function(){
				loaderService.start();
				var saveDeliveryData=scope.delivery.detailavail;
				var xmlSoapObject=scope.fnSavePgiAndDeliveryHeader(saveDeliveryData);
				if(xmlSoapObject){
					scope.fnPgiDeliveryReq(xmlSoapObject,function(){
						loaderService.stop();
					});
				}else{
					loaderService.stop();
				}
			};
			scope.fnGoToDashBoard=function(){
				scope.fnClearCompleView();
				scope.delivery.page='list';
			};
			/*save PGI and Delivery ends*/
			scope.fnIntialize=function(){
		  	scope.today();
		  	scope.fnGetDeliveryOrdersList('0000100020');
		  	/*scope.getSalesOrders();*/
		  };
		  scope.fnIntialize();
}]);