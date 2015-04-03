'use strict';
angular.module('mrc')
	.controller('orderController', ['$scope', '$rootScope', 'urlService', 'routerService', 'sessionStoreService', 'commonService', 'productService', 'alertService', 'loaderService', 'languageService',
		function(scope, rootScope, urlService, routerService, sessionStoreService, commonService, productService, alertService, loaderService, languageService) {
			scope.order = {
				'customerKey': 'customer',
				'orderKey': 'cart',
				'dateKey': 'date',
				'salesOrderKey':'salesOrder',
				'orderCreatedStatus': false,
				'orderDate': '',
				'deliveryDate': '',
				'salesOrderNumber': ''
			};
			scope.order.transfer = routerService.transfer;
			scope.order.customer = {};
			scope.order.lastThreeOrdersData = [];
			scope.order.orderCreatedStatusBtn = false;
			scope.order.topTenProducts = urlService.getView('A_TOP_TEN_PRODUCTS_MODAL');
			scope.order.lastThreeOrders = urlService.getView('A_LAST_THREE_ORDERS_MODAL');
			scope.order.costAndPriceModals = urlService.getView('A_COST_AND_PRICE_ANALYSIS_MODAL');
			scope.order.taxPercentage = 10; //XXX Fixed for now as 10%
			scope.dateOptions = {
				'year-format': "'yy'",
				'starting-day': 1
			};
			scope.fnToggleTopTenProductsPopUp = function() {
				$("#topTenProducts").modal("toggle");
			};
			scope.fnToggleLastThreeOrdersPopUp = function() {
				$("#lastThreeOrders").modal("toggle");
			};
			scope.fnOpenCostAnalysisModal = function(){
				$("#costAnalysisModal").modal("toggle");
			};
			scope.fnOpenPriceAnalysisModal = function(){
				$("#priceAnalysisModal").modal("toggle");
			};
			scope.fngetEffctonOrders = function() {
				var globalDateselected = commonService.getDateFromMillisecondsInFullFormat(new Date(scope.order.deliveryDate).getTime());
				for (var i = 0; i < scope.order.orders.length; i++) {
					scope.order.orders[i].productDeliveryDate = angular.copy(globalDateselected);
				};
			};
			scope.fnGetCurrentDate = function() {
				if(!scope.order.orderDate){
					scope.order.orderDate = commonService.getDateFromMillisecondsInFullFormat(new Date().getTime());
				}
				return scope.order.orderDate;
			};
			scope.trimNumber = function(text) {
				if (new String(text).length > 8) {
					return new String(angular.copy(text)).substring(text.length - 8);
				} else {
					return text;
				}
				// while (s.substr(0,1) == '0' && s.length>1) { s = s.substr(1,s.length); }
				// return s;
			};
			scope.fnDateFormat = function(date) {
				var formatdate = date.substring(4, 6) + '/' + date.substring(6, 8) + '/' + date.substring(0, 4);
				return formatdate;
			};
			scope.fnGetDate = function(dateObj) {
				var day = new Date(dateObj).getDate();
				if (parseInt(day) < 10) {
					day = "0" + (parseInt(day));
				} else {
					day = day;
				}
				var month = new Date(dateObj).getMonth();
				if ((parseInt(month)) + 1 < 10) {
					month = "0" + (parseInt(month) + 1);
				} else {
					month = month;
				}
				var year = new Date(dateObj).getFullYear();
				return month + '/' + day + '/' + year;
			};
			scope.fnRemoveLineItem = function(index) {
				scope.order.orders.splice(index, 1);
			};
			scope.fnClearOrders = function() {
				sessionStoreService.remove(scope.order.orderKey);
			};
			scope.fnLineItemMarginPercentage = function(orderItem) {
				orderItem.marginCost = parseFloat(orderItem.newPrice) - parseFloat(orderItem.price);
				orderItem.marginShare = ((orderItem.marginCost / orderItem.price) * 100);
				if (!isNaN(orderItem.marginShare) && orderItem.marginShare != -Infinity) {
					orderItem.marginShare = Number((orderItem.marginShare).toFixed(0));
					return Number((orderItem.marginShare).toFixed(0));
				} else {
					orderItem.marginShare = 0;
					return 0;
				}

			};
			scope.fnGetTotalMarginAmount = function() {
				scope.order.totalMargin = 0.0;
				for (var i = 0; i < scope.order.orders.length; i++) {
					scope.order.totalMargin += parseFloat(scope.order.orders[i].marginCost) * scope.order.orders[i].quantity;
				}
				if (!isNaN(scope.order.totalMargin) && scope.order.totalMargin != -Infinity) {
					return scope.order.totalMargin.toFixed(2);
				} else {
					return ''
				}
			};
			scope.fnGetTotalMarginPercent = function() {
				scope.order.totalMarginPercent = 0.0;
				var totalCost = new Number(scope.fnGetTotalCost());
				var totalMargin = new Number(scope.fnGetTotalMarginAmount());
				if (!isNaN(totalCost) && !isNaN(totalMargin)) {
					scope.order.totalMarginPercent = (totalMargin / totalCost) * 100;
				}
				if (!isNaN(scope.order.totalMarginPercent) && scope.order.totalMarginPercent!= -Infinity) {
					return scope.order.totalMarginPercent.toFixed(2);
				} else {
					return ''
				}
			};
			scope.fnLineItemNewPrice = function(orderItem) {
				orderItem.newPrice = ((orderItem.marginShare/100)+1)*orderItem.price;
				// orderItem.marginShare.toFixed(2);
				if (!isNaN(orderItem.newPrice)) {
					orderItem.newPrice = Number((orderItem.newPrice).toFixed(2));
					return Number((orderItem.newPrice).toFixed(2));
				} else {
					orderItem.newPrice = 0;
					return 0;
				}

			};
			scope.fnGetTotalCost = function() {
				scope.order.totalCost = 0.0;
				for (var i = 0; i < scope.order.orders.length; i++) {
					scope.order.totalCost += parseFloat(scope.order.orders[i].price) * scope.order.orders[i].quantity;
				}
				if (!isNaN(scope.order.totalCost)) {
					return scope.order.totalCost.toFixed(2);
				} else {
					return ''
				}
			};
			scope.fnGetTotalPrice = function() {
				scope.order.totalPrice = 0.0;
				for (var i = 0; i < scope.order.orders.length; i++) {
					scope.order.totalPrice += parseFloat(scope.order.orders[i].newPrice) * scope.order.orders[i].quantity;
				}
				if (!isNaN(scope.order.totalPrice)) {
					return scope.order.totalPrice.toFixed(2);
				} else {
					return ''
				}
			};
			scope.fnGetTotalProductQuantity = function() {
				var totalQuantity = 0;
				for (var i = 0; i < scope.order.orders.length; i++) {
					totalQuantity += parseFloat(scope.order.orders[i].quantity);
				}
				if (!isNaN(totalQuantity)) {
					return totalQuantity;
				} else {
					return ''
				}
			};
			scope.fnGetTaxAmount = function(withTotal) {
				scope.order.taxAmount = ((scope.order.totalPrice * scope.order.taxPercentage) / 100);
				if (!withTotal) {
					if (!isNaN(scope.order.taxAmount)) {
						return scope.order.taxAmount.toFixed(2);
					} else {
						return ''
					}
				} else {
					scope.order.totalPriceWithTax = scope.order.taxAmount + scope.order.totalPrice;
					if (!isNaN(scope.order.totalPriceWithTax)) {
						return scope.order.totalPriceWithTax.toFixed(2);
					} else {
						return ''
					}
				}
			};
			scope.fnGetCustomerData = function() {
				scope.order.customer=angular.copy(sessionStoreService.getJSON(scope.order.customerKey));
				scope.fnGetLast3OrderedProducts(scope.order.customer.customerNo);
			};
			scope.fnSendSalesOrder = function(data, cb) {
				productService.createSalesOrder(data, function(result) {
					if (result.error) {
						alertService.warn(result.message);
					} else {
						if(result.data.salesOrderNumber){
							scope.order.orderCreatedStatus = true;
							var orderCreated=false;
							if(scope.order.salesOrderNumber){
								orderCreated=true;
							}else{
								orderCreated=false;
							}
							scope.order.salesOrderNumber = angular.copy(result.data.salesOrderNumber);
							//scope.fnClearOrders();
							if(!orderCreated){
								alertService.success('Sales Order Created with : ' + scope.order.salesOrderNumber);	
							}else{
								alertService.success('Sales Order Modified with : ' + scope.order.salesOrderNumber);	
							}
							var lastPRIndex=-1;
							for (var i = 0; i < scope.order.orders.length; i++) {
								if(scope.order.orders[i].from=='buyout' && result.data.allPrNumbers.length>0){
									lastPRIndex++;
									scope.order.orders[i].documentNumber=result.data.allPrNumbers[lastPRIndex];
								}
								if(scope.order.orders[i].from=='crossdock' && result.data.poCreateNumber.length>0){
									scope.order.orders[i].documentNumber=result.data.poCreateNumber;
								}
							}
							sessionStoreService.clear();
						}else{
							alertService.warn("Sales order not created!");
						}
					}
					if (cb instanceof Function) {
						cb();
					}
				});
			};
			scope.fnSubmitOrder = function() {
				loaderService.start();
				var xmlSoapObject = '';
				if(scope.order.salesOrderNumber && scope.order.salesOrderNumber.length>0){
					xmlSoapObject=productService.createModifiedSalesOrderXML(angular.copy(scope.order));
				}else{
					xmlSoapObject=productService.createNewSalesOrderXML(angular.copy(scope.order));
				}
				if (xmlSoapObject) {
					scope.fnSendSalesOrder(xmlSoapObject, function() {
						loaderService.stop();
					});
				} else {
					alertService.warn('Sorry, failed to create XML request object');
					loaderService.stop();
				}
			};
			scope.fnModifySalesOrder = function() {
				scope.fnUpdateFlagForItems();
				sessionStoreService.setJSON(scope.order.salesOrderKey,scope.order);
				scope.order.orderCreatedStatus = false;
			};
			scope.fnSubmitOrderProduct = function() {
				var url = '/products';
				scope.order.transfer(url, {});

			};
			scope.fnGetLast3OrderedProducts = function(customerId) {
				productService.getLastThreeOrders(customerId, function(result) {
					if (result.status == 200) {
						scope.order.lastThreeOrdersData = result.message;
					} else {
						alertService.error(result.message);
					}
				});
			};
			scope.getTop10Products = function(cb) {
				productService.getTop10Products(function(result) {
					if (result.status == 200) {
						scope.topProductsList = result.message;
					} else {
						alertService.error(result.message);
					}
					if (cb instanceof Function) {
						cb();
					}
				});
			};
			scope.fnEvaluateNewPrice = function(orderItem) {
				var tempPercentage = 0;
				if (orderItem.from == languageService.CONSTANTS.STOCK) {
					tempPercentage = 30;
				} else if (orderItem.from == languageService.CONSTANTS.TRANSFER) {
					tempPercentage = 10;
				} else if (orderItem.from == languageService.CONSTANTS.BUYOUT) {
					tempPercentage = 20;
				}
				orderItem.newPrice = (tempPercentage * orderItem.price) / 100;
				orderItem.newPrice += orderItem.price;
			};
			scope.fnGetOrders = function() {
				scope.order.orders = angular.copy(sessionStoreService.getJSON(scope.order.orderKey));
				for (var i = 0; i < scope.order.orders.length; i++) {
					//scope.fnEvaluateNewPrice(scope.order.orders[i]);//XXX Removed the old Logic
					scope.order.orders[i].newPrice=scope.order.orders[i].price;
				}
			};
			scope.fnRemoveleadingZeroLocal = function(value){
				if(value){
					 while (value.substr(0,1) == '0' && value.length>1) { value = value.substr(1,9999); }
						return value;
				}else{
					return value;
				}
			};
			scope.fnTooltip = function(order) {
				var temp=commonService.getNonEmptyString(order.documentNumber);
				if(!temp){
					temp='';
				}
				if (order.from == 'buyout') {
					scope.tooltipText = 'Purchase Request : ' + temp;
					return scope.tooltipText;
				} else if (order.from == 'crossdock') {
					scope.tooltipText = 'Stock Tranfer Order : '+ temp;
					return scope.tooltipText;
				} else {
					scope.tooltipText = "";
					return scope.tooltipText;
					$('.removeToolTip i').removeAttr('tooltip')
				}
			};
			scope.fnTransferToProcurementTab = function(order) {
				var url = '/procurement';
				if (order.from == 'stock') {

				} else if (order.from == 'crossdock') {
					angular.element($('.dsui-header')[0]).scope().fnSelectionTab(url);
					scope.order.transfer(url, {
						"page": 'po',
						"value": 23443245
					});
				} else if (order.from == 'buyout') {
					angular.element($('.dsui-header')[0]).scope().fnSelectionTab(url);
					scope.order.transfer(url, {
						"page": 'pr',
						"value": 23444446
					});
				}
			};
			scope.fnGetCostPrice=function(itemIds,data){
				var costData=null;
				for(var key in data){
					if(_.contains(itemIds,key)){
						costData=data[key];
						break;
					}
				}
				return costData;
			};
			scope.fnGetXMLPricing=function(cb){
				var xmlPricingObject=productService.getXMLPricingObject(scope.order);
				productService.getProductPricing(xmlPricingObject.pricingXML,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						var data=angular.copy(result.data);
						//var tempProductIds=scope.fnGetPreviousOrderProductIds();
						for (var i = 0; i < scope.order.orders.length; i++) {
							var productId=angular.copy(scope.order.orders[i].productId);
							//if(!commonService.searchArray(tempProductIds,productId)){
								var costData = scope.fnGetCostPrice(xmlPricingObject.materialObject[productId],data);
								if(costData){
									try{
										var newPrice=costData.price;
										if(newPrice){
											scope.order.orders[i].newPrice=parseFloat(newPrice);	
										}
									}catch(e){
									}
									try{
										var newMargin=costData.margin;
										if(newMargin){
											scope.order.orders[i].marginShare=newMargin;
										}
									}catch(e){
									}
									try{
										var newCost=costData.cost;
										if(newCost){
											scope.order.orders[i].price=newCost;
										}
									}catch(e){
									}
								}
							//}
						}
					}
					if(cb instanceof Function){
						cb();
					}
				});
			};
			scope.fnGetPreviousOrderProductIds=function(){
				var temp=sessionStoreService.getJSON(scope.order.salesOrderKey);
				var productIds=[];
				if(temp && temp.orders.length>0){
					for(var i=0;i<temp.orders.length;i++){
						productIds.push(temp.orders[i].productId+temp.orders[i].from);
					}
				}
				return angular.copy(productIds);
			};
			scope.fnGetOldOrderProduct=function(productId){
				var temp=sessionStoreService.getJSON(scope.order.salesOrderKey);
				var orderObject={};
				for (var i = 0; i < temp.orders.length; i++) {
					if(temp.orders[i].productId+temp.orders[i].from == productId){
						orderObject = temp.orders[i];
						break;
					}
				}
				return orderObject;
			};
			scope.fnLoadOldOrderProducts=function(){
				var tempIds=scope.fnGetPreviousOrderProductIds();
				for (var i = 0; i < scope.order.orders.length; i++) {
					var tempId=scope.order.orders[i].productId+scope.order.orders[i].from;
					if(commonService.searchArray(tempIds,tempId)){
						var temp=angular.copy(scope.fnGetOldOrderProduct(tempId));
						scope.order.orders[i]=temp;
						scope.order.orders[i].updateFlag='U';
					}else{
						scope.order.orders[i].updateFlag='I';
					}
				}
			};
			scope.fnLoadOrderData=function(){
				var temp=sessionStoreService.getJSON(scope.order.salesOrderKey);
				if(temp && temp.deliveryDate && temp.orderDate && temp.salesOrderNumber){
					scope.order.deliveryDate=angular.copy(temp.deliveryDate);
					scope.order.orderDate=angular.copy(temp.orderDate);
					scope.order.salesOrderNumber = angular.copy(temp.salesOrderNumber);
				}
			};
			scope.fnUpdateFlagForItems=function(){
				for (var i = 0; i < scope.order.orders.length; i++) {
					scope.order.orders[i].updateFlag='U';
				};
			};
			scope.fnIntialize = function() {
				loaderService.start();
				scope.fnGetCustomerData();
				scope.fnGetOrders();
				scope.getTop10Products(function() {
					scope.fnGetXMLPricing(function(){
						scope.fnLoadOldOrderProducts();
						scope.fnLoadOrderData();
						loaderService.stop();
					});
				});
			};
			scope.fnIntialize();
		}
	]);