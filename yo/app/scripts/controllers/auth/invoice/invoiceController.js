'use strict';
angular.module('mrc')
	.controller('invoiceController', ['$scope', '$rootScope','urlService','$filter','invoiceService','alertService','loaderService','commonService',
		function(scope, rootScope,urlService,$filter,invoiceService,alertService,loaderService,commonService) {
			scope.invoice={'page':'list'};
			scope.invoice.deliverySelected = false;
			scope.invoice.create = urlService.getView('A_INVOICE_CREATE');
			scope.invoice.detail = urlService.getView('A_INVOICE_DETAIL');
			scope.invoice.list = urlService.getView('A_INVOICE_LIST');
			scope.invoice.deliveryData={};
			scope.invoice.listData = false;
			scope.invoice.setSave = false;
			scope.searchSelected = false;
			scope.invoice.search={};
			scope.invoice.deliveryItems = {};
			var count = 0;

			/* -- Start of Create Invoice List Page -- */

			scope.fnOpenCreateDeliveryPage = function(page){
				scope.invoice.setSave = true;
				scope.invoice.page = page;
			}

			/* -- End of Create Invoice List Page -- */

			/* -- Start of Method on Cancel Click -- */

			scope.fnToggleDetailView = function(){
				for (var i = 0; i < scope.invoice.detailsData.length; i++) {
					if(scope.invoice.detailsData[i].isChecked == true){
						scope.invoice.detailsData[i].isChecked = "";
					}
				};
				scope.invoice.page = 'list'
				scope.invoice.searchText = "";
				if(scope.invoice.search.deliveryId){
					scope.invoice.search.deliveryId= "";
				}
				scope.invoiceitemNumber = "";
				scope.invoice.invoiceLineItems ={};
				scope.invoice.deliveries = {};
				scope.invoice.listData = false;
				scope.invoice.deliverySelected = false;
				scope.fnInitialize();
			};

			/* -- End of Method on Cancel Click -- */

			scope.fnRemoveItems = function(index){
				scope.invoice.detailsData.splice(index, 1);
				if (scope.invoice.detailsData.length == 0) {
					scope.fnToggleDetailView();
				}
			};

			scope.fnGetInvoiceDocs=function(item){
			 	return item.invoiceId.substring(2,10);
			 };
			/* -- Start of Create Invoice Create Page Functionality -- */		

			scope.fnOpenDetailsDeliveryPage =function(data){
				scope.invoice.detailsData = [];
 				scope.invoice.temp = [];
 				scope.invoice.detailsData = {};
 				scope.invoice.totalInvoiceSumTemp = 0;
				var itemsData ;
				itemsData = angular.copy(data);
				for (var i = 0; i < itemsData.length; i++) {
					if(itemsData[i].isChecked == true){
						if(itemsData[i].materialId){
							itemsData[i].deliveryId1 = itemsData[i].materialId.replace(/^0+/, '');
						}
						if(itemsData[i].salesOrder){
							itemsData[i].salesOrder1 = itemsData[i].salesOrder;
							itemsData[i].salesOrder1 = itemsData[i].salesOrder1.replace(/^0+/, '');
						}
						scope.invoice.totalInvoiceSumTemp = scope.invoice.totalInvoiceSumTemp + parseFloat(itemsData[i].totalPrice);
						scope.invoice.temp.push(itemsData[i]);
						scope.invoice.tempMaterialID = itemsData[i].materialId;
					}else{
						count = count + 1;
					}
				};
				scope.invoice.totalInvoiceSum = parseFloat(scope.invoice.totalInvoiceSumTemp);
				if(scope.invoice.totalInvoiceSum == "NaN"){
					scope.invoice.totalInvoiceSum = 0;
				}
				if(count == itemsData.length){
					alertService.warn("Select Altleast one Item");
					count=0;
				}else{
					count=0;
					scope.invoice.detailsData = scope.invoice.temp;
					scope.invoice.detailsData.materialId = scope.invoice.tempMaterialID;
					//scope.invoice.listData = false;
					scope.invoice.page = 'detail';
					// for (var i = 0; i < scope.invoice.invoiceLineItems.length; i++) {
				// 	if(scope.invoice.invoiceLineItems[i].isChecked == true){
				// 		scope.invoice.invoiceLineItems[i].isChecked = "";
				// 	}
				// };
				}
			};

			/* -- End of Create Invoice Create Page Functionality -- */

			/* -- Start of Double Click on table List Page functionality -- */
			
			scope.fnOpenDetailsInvoicePage = function(itemsData){
				scope.invoice.invoiceLineItems=[];
				scope.invoice.invoiceLineItems.otherDetails = {};
				scope.invoice.invoiceLineItems.otherDetails = itemsData;
				scope.invoice.totalInvoiceSum = parseFloat(scope.invoice.invoiceLineItems.otherDetails.totalInvoiceValue)
				scope.invoice.detailsData =[];		
				for (var i = 0; i < scope.invoice.items.length; i++) {
					if(scope.invoice.items[i].invoiceId == itemsData.invoiceId){
						if(scope.invoice.items[i].materialNumber){
							scope.invoice.items[i].materialNumber = scope.invoice.items[i].materialNumber.replace(/^0+/, '');
						}
						if(scope.invoice.items[i].salesOrder){
							scope.invoice.items[i].salesOrder1 = scope.invoice.items[i].salesOrder;
							scope.invoice.items[i].salesOrder1 = scope.invoice.items[i].salesOrder1.replace(/^0+/, '');
						}
						if(scope.invoice.items[i].deliveryId){
							scope.invoice.items[i].deliveryId1 = scope.invoice.items[i].deliveryId;
							scope.invoice.items[i].deliveryId1 = scope.invoice.items[i].deliveryId1.replace(/^0+/, '');
						}
						scope.invoice.detailsData.push(scope.invoice.items[i]);
					}
				};
				scope.invoiceitemNumber = itemsData.invoiceId;
				scope.invoice.page = 'detail';
				scope.invoice.listData = true;
			}

			/* -- End of Double Click on table List Page functionality -- */		

			/*----- Save Invoice starting -----*/
			scope.fnSaveInvoiceHeader=function(){
				try{
					var saveInvoiceReqItem ='';
					saveInvoiceReqItem += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
					saveInvoiceReqItem += '<soapenv:Header/>';
					saveInvoiceReqItem += '<soapenv:Body>';
					saveInvoiceReqItem += '<urn:ZbapiBillingdocCreatefrmdat1>';
					saveInvoiceReqItem += '<ItBilling>';
					for (var i = 0; i < scope.invoice.detailsData.length; i++) {
						saveInvoiceReqItem += '<item>';
						saveInvoiceReqItem += '<RefDoc>'+scope.invoice.detailsData.materialId+'</RefDoc>';
						saveInvoiceReqItem += '<ILineItem>'+scope.invoice.detailsData[i].lineItems+'</ILineItem>';
						saveInvoiceReqItem += '<IMaterial/>';
						saveInvoiceReqItem += '<IBranch/>';
						saveInvoiceReqItem += '<IMaterialGroup>'+scope.invoice.detailsData[i].materialGroup+'</IMaterialGroup>';
						saveInvoiceReqItem += '<ISalesOrder>'+scope.invoice.detailsData[i].salesOrder+'</ISalesOrder>';
						saveInvoiceReqItem += '<IPlant>'+scope.invoice.invoiceLineItems.otherDetails.plantId+'</IPlant>';
						saveInvoiceReqItem += '<IQty>'+scope.invoice.detailsData[i].materialQty+'</IQty>';
						saveInvoiceReqItem += '<IPickQty>'+scope.invoice.detailsData[i].pickQty+'</IPickQty>';
						saveInvoiceReqItem += '<IUom>'+scope.invoice.detailsData[i].uomId+'</IUom>';
						saveInvoiceReqItem += '<IWeight>'+scope.invoice.detailsData[i].weight+'</IWeight>';
						saveInvoiceReqItem += '<ITotalPrice>'+scope.invoice.detailsData[i].totalPrice+'</ITotalPrice>';
						saveInvoiceReqItem += '<ICustomerNumber>'+scope.invoice.invoiceLineItems.otherDetails.customerId+'</ICustomerNumber>';
						saveInvoiceReqItem += '<IBillToAddress>'+scope.invoice.invoiceLineItems.otherDetails.billToAddress+'</IBillToAddress>';
						saveInvoiceReqItem += '<ITotalInvoiceValue>'+scope.invoice.invoiceLineItems.otherDetails.totalInvoiceValue+'</ITotalInvoiceValue>';
						saveInvoiceReqItem += '</item>';
					};
					saveInvoiceReqItem += '</ItBilling>';
					saveInvoiceReqItem += '</urn:ZbapiBillingdocCreatefrmdat1>';
					saveInvoiceReqItem += '</soapenv:Body>';
					saveInvoiceReqItem += '</soapenv:Envelope>';
					return saveInvoiceReqItem;
				}catch(e){
					alertService.warn('Sorry, failed to create XML');
					return null;
				}
			};
			scope.fnSaveInvoiceReq =function(data,cb){
				invoiceService.saveInvoiceLineItems(data,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						try{
							var tempData=result.data;
							scope.invoiceitemNumber = result.data[0].savedInvoiceItemNumber;   
							scope.invoice.SavedItems = angular.copy(tempData.headerItems);
						}catch(e){
							alertService.warn("Sorry, unable to get Invoice list!");
						}
					}
					if(cb instanceof Function){
						cb();
					}
				});
			};
			scope.fnSaveInvoice = function(){
				scope.invoice.listData = true;
				scope.invoice.setSave = false;
				loaderService.start();
				var xmlSoapObject=scope.fnSaveInvoiceHeader();
				if(xmlSoapObject){
					scope.fnSaveInvoiceReq(xmlSoapObject,function(){
						loaderService.stop();
					});
				}else{
					loaderService.stop();
				}
			};

			/*----- Save Invoice Ending -----*/
			 /*----- Display Doc Details starting-------*/
			 scope.fnDocumentDetailReqHeader =function(){
			 		try{
					var saveDocReqItem ='';
					saveDocReqItem += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
					saveDocReqItem += '<soapenv:Header/>';
					saveDocReqItem += '<soapenv:Body>';
					saveDocReqItem += '<urn:ZGetAccDocDetails>';
					saveDocReqItem += '<IXblnr>'+scope.invoiceitemNumber+'</IXblnr>';
					saveDocReqItem += '<TBkpf>';
					saveDocReqItem += '<item></item>';
					saveDocReqItem += '</TBkpf>';
					saveDocReqItem += '<TBseg>';
					saveDocReqItem += '<item></item>';
					saveDocReqItem += '</TBseg>';
					saveDocReqItem += '</urn:ZGetAccDocDetails>';
					saveDocReqItem += '</soapenv:Body>';
					saveDocReqItem += '</soapenv:Envelope>';
					return saveDocReqItem;
				}catch(e){
					alertService.warn('Sorry, failed to create XML');
					return null;
				}
			 };

			 scope.fnDocumentDetailReq =function(data,cb){
			 	invoiceService.GetInvoiceDocDetail(data,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						try{
							var tempData=result.data;       
							scope.invoice.DocDetails = angular.copy(tempData);
						}catch(e){
							alertService.warn("Sorry, unable to get Doc Details!");
						}
					}
					if(cb instanceof Function){
						cb();
					}
				});
			 };

			 scope.fnDisplayAccDetails=function(){
					loaderService.start();
					var xmlSoapObject=scope.fnDocumentDetailReqHeader();
					if(xmlSoapObject){
						scope.fnDocumentDetailReq(xmlSoapObject,function(){
							loaderService.stop();
						});
					}else{
						loaderService.stop();
					}
			 };
			 /*----- Display Doc Details ending-------*/


			/* Paging functionality */

			scope.fnRecordsDisplayPerPage = function(pageResults) {
				scope.selectedPages = pageResults;
				scope.itemsPerPage = scope.selectedPages.pages;
				scope.fnGroupToPages();
			}




			scope.pageResults = [{
				id: 2,
				pages: 20
			}, {
				id: 3,
				pages: 50
			}, {
				id: 4,
				pages: 100
			}];
			scope.selectedPages = scope.pageResults[0];

			scope.itemsPerPage = scope.selectedPages.pages;
			var sortingOrder = 'name';
			scope.sortingOrder = sortingOrder;
			scope.reverse = false;
			scope.filteredItems = [];
			scope.groupedItems = [];
			scope.pagedItems = [];
			scope.pagedOrders = [];
			scope.currentPage = 0;

			/* End of Paging functionality */

			scope.invoice.items = {};
			

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
			scope.selectedvendor = scope.allvendors[0];
			
			var searchMatch = function(haystack, needle) {
				if (!needle) {
					return true;
				}
				return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
			};

			// init the filtered items
			scope.fnsearch = function() {
				scope.filteredItems = $filter('filter')(scope.invoice.items, function(item) {
					/*delete item['meterial'];
						delete item['prdate'];
						delete item['vendor'];
						delete item['quantity'];
						delete item['availqty'];
						delete item['total'];
						delete item['deliverydate'];*/
					for (var attr in item) {
						if (searchMatch(item[attr], scope.query))
							return true;
					}
					return false;
				});
				// take care of the sorting order
				if (scope.sortingOrder !== '') {
					scope.filteredItems = $filter('orderBy')(scope.filteredItems, scope.sortingOrder, scope.reverse);
				}
				scope.currentPage = 0;
				// now group by pages
			};
			
			scope.fnGroupToPages = function() {
				scope.pagedItems = [];
				for (var i = 0; i < scope.invoice.items.length; i++) {
					if (i % scope.itemsPerPage === 0) {
						scope.pagedItems[Math.floor(i / scope.itemsPerPage)] = [scope.invoice.items[i]];
					} else {
						scope.pagedItems[Math.floor(i / scope.itemsPerPage)].push(scope.invoice.items[i]);
					}
				}
			};

			scope.fnShowDeliveryDetails = function(data){
				scope.invoice.invoiceLineItems =[];
				scope.invoice.invoiceLineItems.otherDetails={}
				scope.invoice.deliveryData = angular.copy(data);
				for (var i = 0; i < scope.invoice.deliveryItems.length; i++) {
					if(scope.invoice.deliveryItems[i].materialId == scope.invoice.deliveryData.deliveryId ){
						scope.invoice.deliveryItems[i].materialNumber = scope.invoice.deliveryItems[i].materialNumber.replace(/^0+/, '');
						scope.invoice.invoiceLineItems.push(scope.invoice.deliveryItems[i])
					}
				};
				scope.invoice.invoiceLineItems.otherDetails = scope.invoice.deliveryData;
				scope.invoice.invoiceLineItems.otherDetails.deliveryId1 = scope.invoice.invoiceLineItems.otherDetails.deliveryId;
				scope.invoice.invoiceLineItems.otherDetails.deliveryId1 = scope.invoice.invoiceLineItems.otherDetails.deliveryId1.replace(/^0+/, '');
				scope.invoice.deliverySelected = true
			}
			

			/* -- Start of Method to get Invoice List -- */


			scope.fnGetInvoiceOrder=function(){
				try{
					var itemnumber = 10;
					var orderReqItem ='';
					orderReqItem += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
					orderReqItem += '<soapenv:Header/>';
					orderReqItem += '<soapenv:Body>';
					orderReqItem += '<urn:ZGetListInvoice>';
					orderReqItem += '<IDate>'+commonService.get20DaysOldDate()+'</IDate>';
					orderReqItem += '</urn:ZGetListInvoice>';
					orderReqItem += '</soapenv:Body>';
					orderReqItem += '</soapenv:Envelope>';
					return orderReqItem;
				}catch(e){
					alertService.warn('Sorry, failed to create XML');
					return null;
				}
			};

			scope.fnSendInvoice=function(data,cb){
				invoiceService.getInvoiceListDetails(data,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						try{
							var tempData=result.data;   
							scope.invoice.items = tempData;
							// for (var i = 0; i < scope.invoice.items.length; i++) {
							// 	if(scope.invoice.items[i].invoiceId){
							// 		scope.invoice.items[i].invoiceId1 = scope.invoice.items[i].invoiceId;
							// 		scope.invoice.items[i].invoiceId1 = scope.invoice.items[i].invoiceId.replace(/^0+/, '');
							// 	}
							// 	if(scope.invoice.items[i].customerId){
							// 		scope.invoice.items[i].customerId1 = scope.invoice.items[i].customerId;
							// 		scope.invoice.items[i].customerId1 = scope.invoice.items[i].customerId1.replace(/^0+/, '');
							// 	}
							// 	if(scope.invoice.items[i].deliveryId){
							// 		scope.invoice.items[i].deliveryId1 = scope.invoice.items[i].deliveryId;
							// 		scope.invoice.items[i].deliveryId1 = scope.invoice.items[i].deliveryId1.replace(/^0+/, '');
							// 	}
							// };
							scope.fnGroupToPages();
							scope.searchSelected = true;
						}catch(e){
							alertService.warn("Sorry, unable to get Invoice list!");
						}
					}
					if(cb instanceof Function){
						cb();
					}
				});
			};
			scope.fnGetInvoiceList=function(){
				loaderService.start();
				var xmlSoapObject=scope.fnGetInvoiceOrder();
				if(xmlSoapObject){
					scope.fnSendInvoice(xmlSoapObject,function(){
						loaderService.stop();
					});
				}else{
					loaderService.stop();
				}
			};

			/* -- End of Method to get Invoice List -- */		

			/* -- Start of Method to get Invoice Deliveries -- */

			scope.fnGetInvoiceDeliveries=function(){
				try{
					var itemnumber = 10;
					var deliveryReqItem ='';
					deliveryReqItem += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
					deliveryReqItem += '<soapenv:Header/>';
					deliveryReqItem += '<soapenv:Body>';
					deliveryReqItem += '<urn:ZGetDelvInfo>';
					deliveryReqItem += '<IDate>'+commonService.get20DaysOldDate()+'</IDate>';
					deliveryReqItem += '</urn:ZGetDelvInfo>';
					deliveryReqItem += '</soapenv:Body>';
					deliveryReqItem += '</soapenv:Envelope>';
					return deliveryReqItem;
				}catch(e){
					alertService.warn('Sorry, failed to create XML');
					return null;
				}
			};

			scope.fnSendInvoiceDeliveries=function(data,cb){
				invoiceService.getInvoiceDeliveryDetails(data,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						try{
							var tempData=result.data;       
							scope.invoice.deliveries = angular.copy(tempData.headerItems);
							for (var i = 0; i < scope.invoice.deliveries.length; i++) {
								if(scope.invoice.deliveries[i].deliveryId){
									scope.invoice.deliveries[i].deliveryId1 = scope.invoice.deliveries[i].deliveryId;
									scope.invoice.deliveries[i].deliveryId1 = scope.invoice.deliveries[i].deliveryId1.replace(/^0+/, '');
								}
							};
							scope.invoice.deliveryItems = angular.copy(tempData.lineItems);
							scope.searchSelected = true;
						}catch(e){
							alertService.warn("Sorry, failed to get Invoice Deliveries!");
						}
					}
					if(cb instanceof Function){
						cb();
					}
				});
			};
			scope.getDeliveries=function(){
				loaderService.start();
				var xmlSoapObject=scope.fnGetInvoiceDeliveries();
				if(xmlSoapObject){
					scope.fnSendInvoiceDeliveries(xmlSoapObject,function(){
						loaderService.stop();
					});
				}else{
					loaderService.stop();
				}
			};

			/* -- End of Method to get Invoice Deliveries -- */			

			scope.fnInitialize = function(){
				scope.fnGetInvoiceList();
			}
			scope.fnInitialize();


			// calculate page in place

			// functions have been describe process the data for display
			// change sorting order
			scope.fnSort_by = function(newSortingOrder) {
				if (scope.sortingOrder == newSortingOrder)
					scope.reverse = !scope.reverse;
					scope.sortingOrder = newSortingOrder;
				// icon setup
				$('th i').each(function() {
					// icon reset
					$(this).removeClass().addClass('fa fa-sort-desc');
				});
				if (scope.reverse)
					$('th.' + newSortingOrder + ' i').removeClass().addClass('dsui-white fa fa-sort-desc');
				else
					$('th.' + newSortingOrder + ' i').removeClass().addClass('dsui-white fa fa-sort-asc');
			};
			scope.invoiceTemplates =
			[ { actCls:'active', id:'InvoiceLineItems', url: 'views/auth/invoice/invoiceTabView.html', title:'Invoice Line Items'},
				{ actCls:'', id:'InvoiceHeaderDetails', url: '',title:'Invoice Header Details'}
			];
    
}]);