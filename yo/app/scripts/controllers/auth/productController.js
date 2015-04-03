'use strict';
angular.module('mrc')
	.controller('productController', ['$scope', '$rootScope','routerService','commonService','loaderService','urlService','alertService','productService','sessionStoreService','applicationService',
		function(scope, rootScope,routerService,commonService,loaderService,urlService,alertService,productService,sessionStoreService,applicationService) {
			scope.transfer=routerService.transfer;
			scope.products = {'productsKey':'cart','customerKey':'customer','workingStatus':false,'buyoutModel':{},'searchArray':[],'salesOrderKey':'salesOrder'};
			scope.products.buyoutModel.categories =[
				{ name: 'Carbon pipe', value: 'Carbon pipe' }, 
				{ name: 'Valve', value: 'Valve' }, 
				{ name: 'Flange', value: 'Flange' },
				{ name: 'Other', value: 'Other' }
			];
			scope.products.branchData = {};
			scope.products.transferModal = {};
			scope.products.emptySearchStatus=false;
			scope.products.displayProducts=[];
			scope.products.displayCustomers=[];
			scope.products.searchText='';
			scope.products.customerSearch='';
			scope.products.transferObject={};
			scope.products.buyOutObject={};
			scope.products.customerSelect = urlService.getView('A_CUSTOMER_MODAL');
			scope.products.transferSelect = urlService.getView('A_TRANSFER_MODAL');
			scope.products.buyOutSelect = urlService.getView('A_BUYOUT_MODAL');
			scope.products.buyoutEmptySelect = urlService.getView('A_EMPTY_BUYOUT_MODAL');
			scope.products.viewOtherBranches = urlService.getView('A_VIEW_OTHER_BRANCH_MODAL');
			var workingStatus,selectedValue;
			scope.productsList=[];
			scope.cartList=[];
			scope.totalQuantity=0;
			scope.topProductsList = [];
			scope.products.branchProducts = {};	
			scope.products.otherBranchDetails = {};
			scope.customerSearchResults = [];	
			scope.customerSelected = false;
			scope.customerSelectedBtn = false;

			scope.fnGetProductHistory=function(){
				var data=angular.copy(sessionStoreService.getJSON(scope.products.productsKey));
				if(data){
					for (var i = 0; i < data.length; i++) {
						scope.cartList.push(data[i]);
					};
					scope.totalQuantity=0;
					for (var i = 0; i < scope.cartList.length; i++) {
							scope.totalQuantity=scope.totalQuantity+scope.cartList[i].quantity;
					};
				}else{
					scope.cartList=[];
				}
			};
			scope.fnSaveProductsData=function(){
				sessionStoreService.setJSON(scope.products.productsKey,scope.cartList);
			};
			scope.fnGetCustomerSelected=function(){
				scope.products.customerData=angular.copy(sessionStoreService.getJSON(scope.products.customerKey));
				if(scope.products.customerData){
					scope.customerSelected=true;
					scope.customerSelectedBtn=true;
				}
			};
			scope.trimNumber=function(text) {
				if(new String(text).length>8){
					return new String(angular.copy(text)).substring(text.length-8);
				}else{
					return text;
				}
				// while (s.substr(0,1) == '0' && s.length>1) { s = s.substr(1,s.length); }
				// return s;
			};
			scope.fnGetAllProducts=function(cb){
				productService.getAllProducts(function(result) {
					if (result.status == 200) {
						scope.productsList = result.message;
						for (var k = 0; k < scope.cartList.length; k++) {
							for (var i = 0; i < scope.productsList.length; i++) {
									if(scope.productsList[i].productDetails.productId==scope.cartList[k].productId){
										scope.productsList[i][scope.cartList[k].from]=true;
								}
							}
						}
						var temp = [];
						for (var k = 0; k < scope.productsList.length; k++) {
							temp = [];
							for (var i = 0; i < scope.productsList[k].Availability.length; i++) {
									if(scope.productsList[k].Availability[i].branchName=="Regional"){
										temp[1] = scope.productsList[k].Availability[i];
									}
									if(scope.productsList[k].Availability[i].branchName=="Own Branch"){
										temp[0] = scope.productsList[k].Availability[i];
									}
									if(scope.productsList[k].Availability[i].branchName=="Distribution Center"){
										temp[2] = scope.productsList[k].Availability[i];
									}
							}
							scope.productsList[k].Availability= angular.copy(temp);
						}
					} else {
						alertService.error(result.message);
					}
					if(cb instanceof Function){
						cb();
					}
				});
			};
			scope.showOtherBranches= function(product){
				scope.productBranches = product;
				scope.products.productNameForBranch = product.productId;
				scope.products.branchTempData= {};
				scope.products.branchTempData1 = [{
								"plantId":"00425741",
								"plantLocation":"Reno, Nevada",
								"availableQuantity":"300"
							},
							{
								"plantId":"00429804",
								"plantLocation":"Forth Worth, Texas",
								"availableQuantity":"500"
							},
							{
								"plantId":"00445995",
								"plantLocation":"Monroe, Washington",
								"availableQuantity":"250"
							},
							{
								"plantId":"00446042",
								"plantLocation":"Bakersfield, California",
								"availableQuantity":"300"
							}];
				scope.products.branchTempData = scope.products.branchTempData1;
				$("#viewOtherBranchModal").modal("toggle");			
			};
			scope.saveBranchDetails = function(productId){
				$("#viewOtherBranchModal").modal("toggle");
			}

			scope.fnSelectOtherBranch = function(index,productData,branchData){
				scope.tempData={};
				scope.selectedValue = index;
				productData.branchDetails = {};
				productData.branchDetails = branchData;
				scope.products.branchData = productData;
			}
			scope.addToChart=function(){
				scope.fnSaveProductsData();
				scope.totalQuantity=0;
				for (var i = 0; i < scope.cartList.length; i++) {
					if(scope.cartList[i].quantity!=0){
						scope.totalQuantity=scope.totalQuantity+scope.cartList[i].quantity;
					}else{
						scope.cartList[i].quantity=1;
						alertService.error("Quantity cannot be '0'");
					}
				}
			};
			scope.fnRemoveCart=function(index){
				for (var i = 0; i < scope.productsList.length; i++) {
					if(scope.productsList[i].productDetails.productId==scope.cartList[index].productId){
							scope.productsList[i][scope.cartList[index].from]=false;
							scope.totalQuantity=scope.totalQuantity-scope.cartList[index].quantity
					}
				}
				scope.cartList.splice(index,1);
				if(scope.cartList.length == 0){
					scope.showReview = false;
				}
				scope.fnSaveProductsData();
			};
			scope.fnAddProducttoCart=function(cartType,productDetails){
				var defaultMarkUp; 
				if(cartType == "buyout"){
					$("#buyOutModal").modal("toggle");
					scope.defaultMarkUp = 20;
				} else if(cartType == "crossdock") {
					scope.defaultMarkUp = 0;
					$("#transferModal").modal("toggle");
				}else{
					scope.defaultMarkUp = 0;
				}
				if(scope.products.branchData.productId == productDetails.productDetails.productId){
					if(productDetails[cartType]==true){
						var tempStore={
														'productName':productDetails.productDetails.productName,
														'productId':productDetails.productDetails.productId,
														'quantity':1,
														'price':productDetails.productDetails.price,
														'markUp':scope.defaultMarkUp,
														'from':cartType,
														'editStatus':false,
														'plantLocation': scope.products.branchData.branchDetails.plantLocation,
														'plantId': scope.products.branchData.branchDetails.plantId,
														'availableQuantity': scope.products.branchData.branchDetails.availableQuantity
													};
						scope.cartList.push(tempStore);
						scope.totalQuantity=0;
						for (var i = 0; i < scope.cartList.length; i++) {
							scope.totalQuantity=scope.totalQuantity+scope.cartList[i].quantity;
						};
						scope.fnSaveProductsData();
					}

				}else{
					if(productDetails[cartType]==true){
						var tempStore1={
														'productName':productDetails.productDetails.productName,
														'productId':productDetails.productDetails.productId,
														'quantity':1,
														'price':productDetails.productDetails.price,
														'markUp':scope.defaultMarkUp,
														'from':cartType,
														'editStatus':false,
														'plantLocation':'',
														'plantId':'',
														'availableQuantity':null
													};
						scope.cartList.push(tempStore1);
						scope.totalQuantity=0;
						for (var i = 0; i < scope.cartList.length; i++) {
							scope.totalQuantity=scope.totalQuantity+scope.cartList[i].quantity;
						};
						scope.fnSaveProductsData();
					}
				}	
			};
			scope.fnOpenTransferModal = function(cartType,productDetails){
				if(productDetails[cartType]==false){
					$("#transferModal").modal("toggle");
					productDetails[cartType] = true;
					scope.products.transferObject = productDetails;
				}else{
					alertService.warn("Already added to cart");
				}
			};
			scope.fnOpenBuyOutModal = function(cartType,productDetails){
				if(productDetails[cartType]==false){
					$("#buyOutModal").modal("toggle");
					productDetails[cartType] = true;
					scope.products.buyOutObject = productDetails;
				}else{
					alertService.warn('Already added to cart');
				}
			};
			scope.fnAddStock = function(cartType,productDetails){
				if(productDetails[cartType]==false){
					productDetails[cartType] = true;
					scope.fnAddProducttoCart('stock',productDetails);
				}else{
					alertService.warn('Already added to cart');
				}
			};
			/************** empty buy out starting***************/
			scope.fnEmptyBuyoutModel=function(){
				$('#emptyBuyoutProductModal').modal("toggle");
				scope.totalQuantity = scope.totalQuantity+parseFloat(scope.products.buyoutModel.quantity);
				var tempObj ={  
					'productName': scope.products.buyoutModel.productname,
					'productId':'000000000009999999',
					'quantity': parseFloat(scope.products.buyoutModel.quantity),
					'price': parseFloat(scope.products.buyoutModel.price),
					'markUp':20,
					'from':"buyout",
					'editStatus':false,
					'shortText':angular.copy(scope.products.buyoutModel.productname),
					'category':scope.products.buyoutModel.category
				};
				scope.cartList.push(tempObj);
				scope.products.buyoutModel.productname='';
				scope.products.buyoutModel.quantity=null;
				scope.products.buyoutModel.price=null;
				scope.products.buyoutModel.category=null;

				scope.fnSaveProductsData();
			};
			/************** empty buy out starting***************/
			scope.getCustomerSearchResults = function(cb){
				productService.getCustomerSearchResults(function(result) {
					if (result.status == 200) {
						scope.customerSearchResults = result.message;
					} else {
						alertService.error(result.message);
					}
					if(cb instanceof Function){
						cb();
					}
				});
			};
			scope.showCustomerResults = function(){
				$("#customerSelectionModal").modal("toggle");
			};
			scope.showFinalizedOrder = function(){
				scope.customerSelected = true;
				scope.customerSelectedBtn = true;
				var url='/order';
				$("#customerSelectionModal").modal("hide");
				scope.transfer(url,{});
			};
			scope.closeCustomerModal = function(){
				$("#customerSelectionModal").modal("toggle");
				sessionStoreService.remove(scope.products.customerKey);
			};
			scope.showReview = false;
			scope.customerSelection = false;
			scope.fnSelectCustomerDummy = function (index,data){
				scope.customerSelected = true;
				scope.customerSelection = true;
				if(scope.cartList.length == 0){
					scope.showReview = false;
				}else{
					scope.showReview = true;
				}
				sessionStoreService.setJSON(scope.products.customerKey,data);
				scope.showReview = false;
				scope.selectedValue = index;
			};
			scope.dateOptions = {
			 'year-format': "'yy'",
			 'starting-day': 1
			};
			scope.open = function() {
				scope.opened = true;
			};
			scope.fnEvaluateNoResultsDisplay=function(){
				return scope.products.emptySearchStatus && scope.products.displayProducts.length == 0 && scope.products.searchText.length>3;
			};
			scope.fnIsKeyAvailable=function(values,searchTextKey){
				var matchedValues = _.filter(values, function(value){ 
					var patternChecking = new RegExp(searchTextKey,'ig');
					var result = patternChecking.test(value);
					return result;
				});
				if(matchedValues.length>0){
					return true;
				}else{
					return false;
				}
			};
			scope.highlight = function(text, search) {
				var updatedText = text;
				var dataSplit = search.split(' ');
				for (var i = 0; i < dataSplit.length; i++) {
						if (!dataSplit[i]) {
								updatedText = (updatedText);
						}
						updatedText = updatedText.replace(new RegExp(dataSplit[i], 'gi'), '::$::$&::$;;'); 	
				}
				//<span style="background-color:yellow;">$&</span>
				updatedText = updatedText.split('::$::').join('<span style=\"background-color:yellow;\">');//.replace(new RegExp('::$::', 'g'),'<span style=\"background-color:yellow;\">');
				updatedText = updatedText.split('::$;;').join('</span>');//.replace(new RegExp('::$;;', 'g'),'</span>');
				return updatedText;
			};
			scope.fnEvaluateManagableActions=function(){
				if(scope.customerSelected && scope.cartList.length>0){
					return true;
				}else{
					return false;
				}
			};
			scope.fnGetTotalQuantity=function(){
				scope.totalQuantity=0;
				for (var i = 0; i < scope.cartList.length; i++) {
					scope.totalQuantity+=scope.cartList[i].quantity;
				}
				if(!isNaN(scope.totalQuantity)){
					return scope.totalQuantity;
				}else{
					return '';
				}
			};
			scope.fnSearchProducts=function(){
				loaderService.start();
				scope.products.displayProducts=[];
				if(scope.products.searchText.length>0){
					scope.products.emptySearchStatus=true;
					var searchTextKeys=scope.products.searchText.split(' ');
					var allProducts=angular.copy(scope.productsList);
					for (var i = 0; i < allProducts.length; i++) {
						var tempArray=[];
						var requiredKeyValues=_.pick(allProducts[i].productDetails, 'productName', 'productDesc','productId');
						var onlyValues=_.values(requiredKeyValues);
						for (var j = 0; j < searchTextKeys.length; j++) {
							var searchTextKeytatus=scope.fnIsKeyAvailable(onlyValues,searchTextKeys[j]);
							if(searchTextKeytatus){
								tempArray.push(allProducts[i]);
							}
						}
						if(tempArray.length==searchTextKeys.length){
							scope.products.displayProducts.push(allProducts[i]);
						}
					}
				}
				loaderService.stop();
			};
			scope.$watch('products.searchText', function(value) {
				if(value.length>3){
					scope.fnSearchProducts();
				}else if(value.length<=3){
					scope.products.displayProducts=[];
				}
			});
			scope.$watch('products.customerSearch',function(value){
				scope.fnSearchCustomers();
			});
			scope.fnSearchCustomers=function(){
				scope.products.displayCustomers=[];
				if(scope.products.customerSearch.length>0){
					var searchTextKeys=scope.products.customerSearch.split(' ');
					var allCustomers=angular.copy(scope.customerSearchResults);
					for (var i = 0; i < allCustomers.length; i++) {
						var tempArray=[];
						var requiredKeyValues=_.pick(allCustomers[i], 'customerNo', 'customerName','customerLocation');
						var onlyValues=_.values(requiredKeyValues);
						for (var j = 0; j < searchTextKeys.length; j++) {
							var searchTextKeytatus=scope.fnIsKeyAvailable(onlyValues,searchTextKeys[j]);
							if(searchTextKeytatus){
								tempArray.push(allCustomers[i]);
							}
						}
						if(tempArray.length==searchTextKeys.length){
							scope.products.displayCustomers.push(allCustomers[i]);
						}
					}
				}
			};
			scope.fnToggleAdjustStatus = function(cartData){
				cartData.editStatus = ! cartData.editStatus;
				cartData.oldPrice = angular.copy(cartData.price);
				cartData.oldMarkUp = angular.copy(cartData.markUp);
			};

			scope.fnSaveLatestPrice = function(cartData){
				cartData.editStatus = ! cartData.editStatus;
				scope.fnSaveProductsData();
			};

			scope.fnRevertOldPrice = function(cartData){
				cartData.price = angular.copy(cartData.oldPrice);
				cartData.markUp = angular.copy(cartData.oldMarkUp);
				cartData.editStatus = ! cartData.editStatus;
			};

			scope.fnCalTotalPriceForItem = function(cartData){
				cartData.cost = cartData.price*cartData.quantity;
				if(cartData.markUp >0 ){
					cartData.cost = cartData.cost + (cartData.cost * (cartData.markUp/100));
				}
				cartData.cost = cartData.cost;
				scope.fnSaveProductsData();
				return (cartData.cost).toFixed(2);
			};

			scope.fnCalTotalPrice = function(){
				scope.totalPrice=0.0;
				for (var i = 0; i < scope.cartList.length; i++) {
					scope.totalPrice += parseFloat(scope.cartList[i].cost); 
				};
				return scope.totalPrice;
			}
			scope.fnLoadOrderProducts=function(){
				var data=sessionStoreService.getJSON(scope.products.salesOrderKey);
				if(data && data.customer && data.orders){
					scope.products.customerData=angular.copy(data.customer);
					if(scope.products.customerData){
						scope.customerSelected=true;
						scope.customerSelectedBtn=true;
					}
					for (var i = 0; i < data.orders.length; i++) {
						scope.cartList.push(angular.copy(data.orders[i]));
					};
					scope.totalQuantity=0;
					for (var i = 0; i < scope.cartList.length; i++) {
							scope.totalQuantity=scope.totalQuantity+scope.cartList[i].quantity;
					};
					scope.fnSaveProductsData();
					scope.cartList=[];
				}else{
					scope.cartList=[];
				}
				if(data && data.customer){
					sessionStoreService.setJSON(scope.products.customerKey,data.customer);
				}
			};
			scope.fnInitialize=function(){
				loaderService.start();
				scope.fnLoadOrderProducts();
				scope.fnGetAllProducts(function(){
						scope.getCustomerSearchResults(function(){
							scope.fnGetProductHistory();
							scope.fnGetCustomerSelected();
							loaderService.stop();
						});
				});
			};
		}
	]);