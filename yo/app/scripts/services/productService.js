'use strict';
angular.module('mrc').factory('productService', function(logService,xhrService,urlService,languageService,commonService){
	var product = function(data) {
		angular.extend(this, data);
	};
	product.getLastThreeOrdersMorphedData=function(data){
		var result=[];
		for (var i = 0; i < data.d.results.length; i++) {
			var temp={};
			try{
				temp.orderId=data.d.results[i].VBELN;
			}catch(e){
				temp.orderId='';
				logService.error(e);
			}
			try{
				temp.orderDate=data.d.results[i].ERDAT;
			}catch(e){
				temp.orderDate='';
				logService.error(e);
			}
			try{
				temp.totalQuantity=data.d.results[i].KWMENG;
			}catch(e){
				temp.totalQuantity='';
				logService.error(e);
			}
			try{
				temp.totalPrice=data.d.results[i].NETWR;
			}catch(e){
				temp.totalPrice='';
				logService.error(e);
			}
			try{
				temp.totalCost=data.d.results[i].TOTAL_COST;
			}catch(e){
				temp.totalCost='';
				logService.error(e);
			}
			try{
				temp.profit=data.d.results[i].PROFIT_PER;
			}catch(e){
				temp.profit='';
				logService.error(e);
			}
			result.push(temp);
		}
		return result;
	};
	product.getLastThreeOrders=function(customerId,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("MRCDEMO" + ":" + "Deloitte.1")
		};
		var url='/LastSalesOrdersParameters(\''+customerId+'\')/Results?$format=json';
		xhrService.doGet(urlService.getService('last3Orders')+url,{},headers,function(data){
			data=product.getLastThreeOrdersMorphedData(data);
			callback({
				'status':200,
				'message':data
			});
		},function(data){
			callback({
				'status': 'ok',
				'message': languageService.MESSAGES.FAILED_TOPTHREEORDERS
			});
		});
	};


	product.getTop10ProductsMorphedData=function(data){
		var result=[];
		for (var i = 0; i < data.d.results.length; i++) {
			var temp={};
			try{
				temp.productName=data.d.results[i].MATERIAL_TEXT;
			}catch(e){
				temp.productName='';
				logService.error(e);
			}
			try{
				temp.productId=data.d.results[i].MATERIAL_NO;
			}catch(e){
				temp.productId='';
				logService.error(e);
			}
			result.push(temp);
		}
		return result;
	};
	product.getTop10Products=function(callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("MRCDEMO" + ":" + "Deloitte.1")
		};
		xhrService.doGet(urlService.getService('top10products'),{},headers,function(data){
			data=product.getTop10ProductsMorphedData(data);
			callback({
				'status':200,
				'message':data
			});
		},function(data){
			callback({
				'status': 'ok',
				'message': languageService.MESSAGES.FAILED_TOPTENPRODUCTS
			});
		});
	};
	product.getCustomerSearchResultsMorphedData=function(data){
		var result=[];
		for (var i = 0; i < data.d.results.length; i++) {
			var temp={};
			try{
				temp.customerNo=data.d.results[i].CUSTOMER_NO;
			}catch(e){
				temp.customerNo='';
				logService.error(e);
			}
			try{
				temp.customerName=data.d.results[i].CUSTOMER_NAME;
			}catch(e){
				temp.customerName='';
				logService.error(e);
			}
			try{
				temp.customerLocation=data.d.results[i].CUSTOMER_CITY+', '+data.d.results[i].CUSTOMER_STATE;
			}catch(e){
				temp.customerLocation='';
				logService.error(e);
			}
			try{
				temp.contactName=data.d.results[i].CUSTOMER_CONTACT_NAME;
			}catch(e){
				temp.contactName='';
				logService.error(e);
			}
			try{
				temp.contactPhone=data.d.results[i].CUSTOMER_CONTACT_PHONE;
			}catch(e){
				temp.contactPhone='';
				logService.error(e);
			}
			try{
				temp.contactEmail=data.d.results[i].CUSTOMER_CONTACT_EMAIL;
			}catch(e){
				temp.contactEmail='';
				logService.error(e);
			}
			try{
				temp.accountType=data.d.results[i].CUSTOMER_TYPE;
			}catch(e){
				temp.accountType='';
				logService.error(e);
			}
			try{
				temp.accountCreditCheck=data.d.results[i].CUSTOMER_CC;
			}catch(e){
				temp.accountCreditCheck='';
				logService.error(e);
			}
			try{
				temp.salesOrg=data.d.results[i].CUSTOMER_SALES_ORG;
			}catch(e){
				temp.salesOrg='';
				logService.error(e);
			}
			try{
				temp.salesDistribritutionChannel=data.d.results[i].CUSTOMER_DISTR_CH;
			}catch(e){
				temp.salesDistribritutionChannel='';
				logService.error(e);
			}
			try{
				temp.salesDivision=data.d.results[i].CUSTOMER_DIV;
			}catch(e){
				temp.salesDivision='';
				logService.error(e);
			}
			try{
				temp.billingStreet=data.d.results[i].CUSTOMER_BT_STREET;
			}catch(e){
				temp.billingStreet='';
				logService.error(e);
			}
			try{
				temp.billingCity=data.d.results[i].CUSTOMER_BT_CITY;
			}catch(e){
				temp.billingCity='';
				logService.error(e);
			}
			try{
				temp.billingState=data.d.results[i].CUSTOMER_BT_STATE;
			}catch(e){
				temp.billingState='';
				logService.error(e);
			}
			try{
				temp.billingZip=data.d.results[i].CUSTOMER_BT_ZIP;
			}catch(e){
				temp.billingZip='';
				logService.error(e);
			}
			try{
				temp.shipToStreet=data.d.results[i].CUSTOMER_ST_STREET;
			}catch(e){
				temp.shipToStreet='';
				logService.error(e);
			}
			try{
				temp.shipToCity=data.d.results[i].CUSTOMER_ST_CITY;
			}catch(e){
				temp.shipToCity='';
				logService.error(e);
			}
			try{
				temp.shipToState=data.d.results[i].CUSTOMER_ST_STATE;
			}catch(e){
				temp.shipToState='';
				logService.error(e);
			}
			try{
				temp.shipToZip=data.d.results[i].CUSTOMER_ST_ZIP;
			}catch(e){
				temp.shipToZip='';
				logService.error(e);
			}
			result.push(temp);
		}
		return result;
	};
	product.getCustomerSearchResults=function(callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("MRCDEMO" + ":" + "Deloitte.1")
		};
		xhrService.doGet(urlService.getService('customerSearchResults'),{},headers,function(data){
			data=product.getCustomerSearchResultsMorphedData(data);
			callback({
				'status':200,
				'message':data
			});
		},function(data){
			callback({
				'status': 'ok',
				'message': languageService.MESSAGES.FAILED_GET_CUSTOMERS
			});
		});
	};
	product.getProductObject=function(object){
		var temp=angular.copy(object);
		return {
			"productDetails":{
				"productName":temp.MAT_TEXT,
				"productId":temp.MATNR,
				"size":temp.GROES,
				"materialType":temp.MATKL,
				"UOM":temp.MAT_MEINS +' | '+ temp.MSEHL_1,
				"productDesc":temp.ZZ_MAKTX,
				"price":parseFloat(temp.STPRS)
			},
			"Availability":[],
			"stock":false,
			"crossdock":false,
			"buyout":false
		};
	};
	product.getProductPlantObject=function(object,productObject){
		var temp=angular.copy(object);
		var branchName='';
		if(object.PLANT_TYPE == 'B'){
			branchName = 'Own Branch';
		}else if(object.PLANT_TYPE == 'R'){
			branchName = 'Regional';
		}else if(object.PLANT_TYPE == 'D'){
			branchName = 'Distribution Center';
		}else {
			branchName = '';
		}
		productObject.Availability.push({
			"branchName":angular.copy(branchName),
			"branchLocation":temp.PLANT_TEXT,
			"branchId":temp.PLANT_NO,
			"quantity":temp.QTY_REM,
		});
	};
	product.getAllProductsMorphedData=function(data){
		var result = [];
		try{
			var tempProducts=[];
			for (var i = 0; i < data.d.results.length; i++) {
				tempProducts.push(data.d.results[i].MATNR);
			}
			tempProducts=commonService.removeDuplicatesIn1DArray(tempProducts);
			for (var i = 0; i < tempProducts.length; i++) {
				for(var j=0;j<data.d.results.length;j++){
					if(data.d.results[j].MATNR == tempProducts[i]){
						result.push(product.getProductObject(data.d.results[j]));
						break;
					}
				}
			}
			for (var i = 0; i < result.length; i++) {
				for (var j = 0; j < data.d.results.length; j++) {
					if(data.d.results[j].MATNR == result[i].productDetails.productId){
						product.getProductPlantObject(data.d.results[j],result[i]);
					}
				}
			}
		}catch(e){
			logService.error(e);
		}
		return result;
	};
	product.getAllProducts=function(callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("MRCDEMO" + ":" + "Deloitte.1")
		};
		xhrService.doGet(urlService.getService('getAllProducts'),{},headers,function(response){
				var data=product.getAllProductsMorphedData(angular.copy(response));
				callback({
					'status':200,
					'message':data
				});
			
		},function(data){
			callback({
				'status': '500',
				'message':languageService.MESSAGES.FAILED_GET_PRODUCTS
			});
		});
	};
	product.getMorphedSalesOrderObject=function(xmlResponse){
		var salesOrderJsonResponse={};
		try{
			var tempData=commonService.convertXmlToJson(xmlResponse);
			var tempResponse=tempData.Envelope.Body.ZBapiSalesDocuCreateResponse;
			var salesOrderNumber = tempResponse.SalesdocumentEx;
			if(salesOrderNumber && salesOrderNumber.length>0){
				salesOrderJsonResponse.salesOrderNumber= angular.copy(salesOrderNumber);
			}
			var allPrNumbers=[];
			try{
				var tempPRResponse=tempResponse.PrDataEx;
				if(!angular.isArray(tempPRResponse.item)){
					tempPRResponse.item=[tempPRResponse.item];
				}
				for (var i = 0; i < tempPRResponse.item.length; i++) {
					allPrNumbers.push(tempPRResponse.item[i].Banfn);
				}
			}catch(e){
			}
			salesOrderJsonResponse.allPrNumbers=angular.copy(allPrNumbers);
			var poCreateNumber='';
			try{
				poCreateNumber=tempResponse.StockTrEx;
			}catch(e){
			}
			salesOrderJsonResponse.poCreateNumber=angular.copy(poCreateNumber);
		}catch(e){
			salesOrderJsonResponse={};
		}
		return salesOrderJsonResponse;
	};
	product.createSalesOrder=function(xmlContent,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("MRCDEMO" + ":" + "Deloitte.1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('createSalesOrder'), xmlContent, headers, function(data) {
			data=product.getMorphedSalesOrderObject(data);
			if (data) {
				callback({'data': data,'message': ''});
			} else {
				logService.warn(languageService.MESSAGES.FAILED_CREATE_ORDER);
				callback({'error': 'error','message': languageService.MESSAGES.FAILED_CREATE_ORDER});
			}
		}, function(data) {
			logService.error(languageService.MESSAGES.FAILED_CREATE_PO);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_CREATE_ORDER});
		});
	};
	product.getMorphedPricingObject = function(xmlResponse) {
		try {
			var pricingTempData = commonService.convertXmlToJson(xmlResponse);
			var responseData=pricingTempData.Envelope.Body.ZbapiSalesorderSimulateResponse;
			var materialObject = {};
			var tempMarginJSON = responseData.OrderConditionEx.item;
			if(!angular.isArray(tempMarginJSON)){
				tempMarginJSON=[tempMarginJSON];
			}
			for (var i = 0; i < tempMarginJSON.length; i++) {
				if(!materialObject.hasOwnProperty(tempMarginJSON[i].ItmNumber)){
					materialObject[tempMarginJSON[i].ItmNumber] = {
						'price': null,
						'margin': null,
						'currency': '',
						'cost':null
				 	};
				}
			 	try{
			 		if (tempMarginJSON[i].CondType == 'ZMR1') {
			 			materialObject[tempMarginJSON[i].ItmNumber].margin = tempMarginJSON[i].CondValue;
						materialObject[tempMarginJSON[i].ItmNumber].currency=tempMarginJSON[i].Currency;
			 		}
			 		if (tempMarginJSON[i].CondType == 'ZPRS') {
						materialObject[tempMarginJSON[i].ItmNumber].cost = tempMarginJSON[i].CondValue;
				 	}
			 	}catch(e){
			 	}
			}
			var tempPricingJSON = responseData.OrderItemsOut.item;
			if(!angular.isArray(tempPricingJSON)){
				tempPricingJSON=[tempPricingJSON];
			}
			for (var j = 0; j < tempPricingJSON.length; j++) {
				materialObject[tempPricingJSON[j].ITM_NUMBER].price=tempPricingJSON[j].NET_VALUE1;
			}
		} catch (e) {
		 logService.error(e);
		}
		return materialObject;
 };
	product.getXMLPricingObject=function(orderObject){
		var materialObject={};
		try {
			var orderReqItem = '';
			orderReqItem += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
			orderReqItem += '<soapenv:Header/>';
			orderReqItem += '<soapenv:Body>';
			orderReqItem += '<urn:ZbapiSalesorderSimulate>';
			orderReqItem += '<Messagetable><item></item></Messagetable><OrderConditionEx><item></item></OrderConditionEx>';
			orderReqItem += '<OrderHeaderIn>';
			orderReqItem += '<DocType>OR</DocType>';
			orderReqItem += '<SalesOrg>' + orderObject.customer.salesOrg + '</SalesOrg>';
			orderReqItem += '<DistrChan>' + orderObject.customer.salesDistribritutionChannel + '</DistrChan>';
			orderReqItem += '<Division>' + orderObject.customer.salesDivision + '</Division>';
			orderReqItem += '</OrderHeaderIn>';
			orderReqItem += '<OrderItemsIn>';
			for (var i = 0; i < orderObject.orders.length; i++) {
				orderReqItem += '<item>';
				var temp='0000' + ((i + 1) * 10);
				if(!materialObject.hasOwnProperty(orderObject.orders[i].productId)){
					materialObject[orderObject.orders[i].productId]=[];	
				}
				materialObject[orderObject.orders[i].productId].push(temp);
				orderReqItem += '<ItmNumber>'+temp+'</ItmNumber>';
				orderReqItem += ' <Material>' + orderObject.orders[i].productId + '</Material>';
				orderReqItem += ' <Plant>0096</Plant>';
				orderReqItem += '<TargetQu>' + orderObject.orders[i].quantity + '</TargetQu>';
				orderReqItem += '<SalesUnit>EA</SalesUnit>';
				orderReqItem += ' </item>';
			}
			orderReqItem += '</OrderItemsIn>';
			orderReqItem += '<OrderItemsOut><item></item></OrderItemsOut>';
			orderReqItem += '<OrderPartners><item>';
			orderReqItem += '<PartnRole>WE</PartnRole>';
			orderReqItem += '<PartnNumb>' + orderObject.customer.customerNo + '</PartnNumb>';
			orderReqItem += '<ItmNumber>000000</ItmNumber>';
			orderReqItem += '</item></OrderPartners>';
			orderReqItem += '<OrderScheduleIn>';
			for (var i = 0; i < orderObject.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += ' <SchedLine>0001</SchedLine>';
				orderReqItem += ' <ReqDate />';
				orderReqItem += '<ReqQty>' + orderObject.orders[i].quantity + '</ReqQty>';
				orderReqItem += ' </item>';
			}
			orderReqItem += '</OrderScheduleIn>';
			orderReqItem += '</urn:ZbapiSalesorderSimulate></soapenv:Body></soapenv:Envelope>';
			return {'pricingXML':orderReqItem,'materialObject':materialObject};
		} catch (e) {
			alertService.warn('Sorry, Failed to Create XML');
			return null;
		}
	};
	product.getProductPricing=function(xmlContent,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('getPricing'), xmlContent, headers, function(data) {
			if (data) {
				data=product.getMorphedPricingObject(data);
				callback({'data': data,'message': ''});
			} else {
				logService.warn(languageService.MESSAGES.FAILED_GET_PRICING);
				callback({'error': 'error','message': languageService.MESSAGES.FAILED_GET_PRICING});
			}
		}, function(data) {
			logService.error(languageService.MESSAGES.FAILED_CREATE_PO);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_PRICING});
		});
	};
	product.createNewSalesOrderXML=function(order){
		var orderReqItem = '';
		try{
			orderReqItem += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
			orderReqItem += '<soapenv:Header/>';
			orderReqItem += '<soapenv:Body>';
			orderReqItem += '<urn:ZBapiSalesDocuCreate>';
			
			orderReqItem += '<OrderText>';
			orderReqItem += '<item>';
			orderReqItem += '<DocNumber />';
			orderReqItem += '<TextId>ZMR3</TextId>';
			orderReqItem += '<Langu>E</Langu>';
			orderReqItem += '<FormatCol>*</FormatCol>';
			var poNumber='';
			if(order.customer.customerPo){
				poNumber=order.customer.customerPo + ',';	
			}
			orderReqItem += '<TextLine>' + poNumber + order.customer.afe + ',' + order.customer.rig + ',' + order.customer.field + ',' + order.customer.wbs + ',' + order.customer.job + '</TextLine>';
			orderReqItem += '<Function>009</Function>';
			orderReqItem += '</item>';
			orderReqItem += '</OrderText>';
			
			orderReqItem += '<PrDataEx><item></item></PrDataEx>';
	    orderReqItem += '<Return><item></item></Return>';
			
			orderReqItem += '<SalesConditionsIn>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<CondType>ZMRA</CondType>';
				orderReqItem += '<CondStNo>903</CondStNo>';
				orderReqItem += '<CondCount>01</CondCount>';
				orderReqItem += '<CondValue>' + order.orders[i].marginShare + '</CondValue>';
				//orderReqItem += '<Currency>USD</Currency>';
				orderReqItem += '</item>';
			}
			orderReqItem += '</SalesConditionsIn>';

			orderReqItem += '<SalesConditionsInx>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<CondType>ZMRA</CondType>';
				orderReqItem += '<CondStNo>903</CondStNo>';
				orderReqItem += '<CondCount>01</CondCount>';
				orderReqItem += '<Updateflag>I</Updateflag>';
				orderReqItem += '<CondValue>X</CondValue>';
				//orderReqItem += '<Currency>X</Currency>';
				orderReqItem += '</item>';
			}
			orderReqItem += '</SalesConditionsInx>';

			orderReqItem += '<SalesHeaderIn>';
			orderReqItem += '<DocType>TA</DocType>';
			// orderReqItem += '<DocType>'+order.customer.docType+'</DocType>';
			orderReqItem += '<SalesOrg>' + order.customer.salesOrg + '</SalesOrg>';
			orderReqItem += '<DistrChan>' + order.customer.salesDistribritutionChannel + '</DistrChan>';
			orderReqItem += '<Division>' + order.customer.salesDivision + '</Division>';

			var statusForCustomerPO = '';
			if (order.customer.customerPo && order.customer.customerPo.length > 0) {
				orderReqItem += '<PurchNoC>' +order.customer.customerPo + '</PurchNoC>';
				statusForCustomerPO = '<PurchNoC>X</PurchNoC>';
			}
			orderReqItem += '</SalesHeaderIn>';
						
			orderReqItem += '<SalesHeaderInx><Updateflag>I</Updateflag><DocType>X</DocType><SalesOrg>X</SalesOrg><DistrChan>X</DistrChan><Division>X</Division>' + statusForCustomerPO + '</SalesHeaderInx>';
						
			orderReqItem += '<SalesItemsIn>';
			for (var i = 0; i < order.orders.length; i++) {
				var itemCategory = '';
				if (order.orders[i].from == 'buyout') {
					itemCategory = 'TAB';
				} else if (order.orders[i].from == 'crossdock') {
					itemCategory = 'ZTRF';
				} else{
					itemCategory = 'TAN';
				}
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<Material>' + order.orders[i].productId + '</Material>';
				orderReqItem += '<Plant>0096</Plant>';
				orderReqItem += '<ItemCateg>' + itemCategory + '</ItemCateg>';
				orderReqItem += '<TargetQty>' + order.orders[i].quantity + '</TargetQty>';
				if (order.orders[i].shortText) {
					orderReqItem += '<ShortText>' + order.orders[i].shortText + '</ShortText>';
				}
				orderReqItem += '</item>'
			}
			orderReqItem += '</SalesItemsIn>';
			
			orderReqItem += '<SalesItemsInx>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<Updateflag>I</Updateflag>';
				orderReqItem += '<Material>X</Material><Plant>X</Plant><TargetQty>X</TargetQty>';
				orderReqItem += '<ItemCateg>X</ItemCateg>';
				if (order.orders[i].shortText) {
					orderReqItem += '<ShortText>X</ShortText>';
					}
				orderReqItem += '</item>';
			}
			orderReqItem += '</SalesItemsInx>';
			
			orderReqItem += '<SalesPartners>';
			orderReqItem += '<item>';
			orderReqItem += '<PartnRole>AG</PartnRole>';
			orderReqItem += '<PartnNumb>' + order.customer.customerNo + '</PartnNumb>';
			orderReqItem += '<ItmNumber>000000</ItmNumber>';
			orderReqItem += '</item>';
			orderReqItem += '</SalesPartners>';
			
			orderReqItem += '<SalesSchedulesIn>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<SchedLine>0001</SchedLine>';
				orderReqItem += '<ReqDate>' + commonService.getDateFromMillisecondsInRequestFormat1(new Date(order.orders[i].productDeliveryDate).getTime()) + '</ReqDate>';
				orderReqItem += '<ReqQty>' + order.orders[i].quantity + '</ReqQty>';
				orderReqItem += '</item>';
			}
			orderReqItem += '</SalesSchedulesIn>';
			
			orderReqItem += '<SalesSchedulesInx>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += ' <SchedLine>0001</SchedLine>';
				orderReqItem += '<Updateflag>I</Updateflag>';
				orderReqItem += '<ReqDate>X</ReqDate><ReqQty>X</ReqQty></item>';
			}
			orderReqItem += '</SalesSchedulesInx>';
			
			orderReqItem += '<Salesdocument />';

			orderReqItem += '</urn:ZBapiSalesDocuCreate></soapenv:Body></soapenv:Envelope>';
		}catch(e){
			orderReqItem=null;
		}
		return orderReqItem;
	};
	product.createModifiedSalesOrderXML=function(order){
		var orderReqItem = '';
		try{
			orderReqItem += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
			orderReqItem += '<soapenv:Header/>';
			orderReqItem += '<soapenv:Body>';
			orderReqItem += '<urn:ZBapiSalesDocuCreate>';
			
			orderReqItem += '<OrderText>';
			orderReqItem += '<item>';
			orderReqItem += '<DocNumber>'+order.salesOrderNumber+'</DocNumber>';
			orderReqItem += '<TextId>ZMR3</TextId>';
			orderReqItem += '<Langu>E</Langu>';
			orderReqItem += '<FormatCol>*</FormatCol>';
			var poNumber='';
			if(order.customer.customerPo){
				poNumber=order.customer.customerPo + ',';	
			}
			orderReqItem += '<TextLine>' + poNumber + order.customer.afe + ',' + order.customer.rig + ',' + order.customer.field + ',' + order.customer.wbs + ',' + order.customer.job + '</TextLine>';
			orderReqItem += '<Function>009</Function>';
			orderReqItem += '</item>';
			orderReqItem += '</OrderText>';
			
			orderReqItem += '<PrDataEx><item></item></PrDataEx>';
	    orderReqItem += '<Return><item></item></Return>';
			
			orderReqItem += '<SalesConditionsIn>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<CondType>ZMRA</CondType>';
				orderReqItem += '<CondValue>' + order.orders[i].marginShare + '</CondValue>';
				orderReqItem += '<CondStNo>903</CondStNo>';
				orderReqItem += '<CondCount>01</CondCount>';
				//orderReqItem += '<Currency>USD</Currency>';
				orderReqItem += '</item>';
			}
			orderReqItem += '</SalesConditionsIn>';

			orderReqItem += '<SalesConditionsInx>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<CondType>ZMRA</CondType>';
				orderReqItem += '<CondStNo>903</CondStNo>';
				orderReqItem += '<CondCount>01</CondCount>';
				orderReqItem += '<Updateflag>'+order.orders[i].updateFlag+'</Updateflag>';
				orderReqItem += '<CondValue>X</CondValue>';
				//orderReqItem += '<Currency>X</Currency>';
				orderReqItem += '</item>';
			}
			orderReqItem += '</SalesConditionsInx>';

			orderReqItem += '<SalesHeaderIn>';
			orderReqItem += '<DocType>TA</DocType>';
			// orderReqItem += '<DocType>'+order.customer.docType+'</DocType>';
			orderReqItem += '<SalesOrg>' + order.customer.salesOrg + '</SalesOrg>';
			orderReqItem += '<DistrChan>' + order.customer.salesDistribritutionChannel + '</DistrChan>';
			orderReqItem += '<Division>' + order.customer.salesDivision + '</Division>';

			var statusForCustomerPO = '';
			if (order.customer.customerPo && order.customer.customerPo.length > 0) {
				orderReqItem += '<PurchNoC>' +order.customer.customerPo + '</PurchNoC>';
				statusForCustomerPO = '<PurchNoC>X</PurchNoC>';
			}
			orderReqItem += '</SalesHeaderIn>';
						
			orderReqItem += '<SalesHeaderInx><Updateflag>U</Updateflag><DocType>X</DocType><SalesOrg>X</SalesOrg><DistrChan>X</DistrChan><Division>X</Division>' + statusForCustomerPO + '</SalesHeaderInx>';
						
			orderReqItem += '<SalesItemsIn>';
			for (var i = 0; i < order.orders.length; i++) {
				var itemCategory = '';
				if (order.orders[i].from == 'buyout') {
					itemCategory = 'TAB';
				} else if (order.orders[i].from == 'crossdock') {
					itemCategory = 'ZTRF';
				} else{
					itemCategory = 'TAN';
				}
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<Material>' + order.orders[i].productId + '</Material>';
				orderReqItem += '<Plant>0096</Plant>';
				orderReqItem += '<ItemCateg>' + itemCategory + '</ItemCateg>';
				orderReqItem += '<TargetQty>' + order.orders[i].quantity + '</TargetQty>';
				if (order.orders[i].shortText) {
					orderReqItem += '<ShortText>' + order.orders[i].shortText + '</ShortText>';
				}
				orderReqItem += '</item>'
			}
			orderReqItem += '</SalesItemsIn>';
			
			orderReqItem += '<SalesItemsInx>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<Updateflag>'+order.orders[i].updateFlag+'</Updateflag>';
				orderReqItem += '<Material>X</Material><Plant>X</Plant><TargetQty>X</TargetQty>';
				orderReqItem += '<ItemCateg>X</ItemCateg>';
				if (order.orders[i].shortText) {
					orderReqItem += '<ShortText>X</ShortText>';
					}
				orderReqItem += '</item>';
			}
			orderReqItem += '</SalesItemsInx>';
			
			orderReqItem += '<SalesPartners>';
			orderReqItem += '<item>';
			orderReqItem += '<PartnRole>AG</PartnRole>';
			orderReqItem += '<PartnNumb>' + order.customer.customerNo + '</PartnNumb>';
			orderReqItem += '<ItmNumber>000000</ItmNumber>';
			orderReqItem += '</item>';
			orderReqItem += '</SalesPartners>';
			
			orderReqItem += '<SalesSchedulesIn>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += '<SchedLine>0001</SchedLine>';
				orderReqItem += '<ReqDate>' + commonService.getDateFromMillisecondsInRequestFormat1(new Date(order.orders[i].productDeliveryDate).getTime()) + '</ReqDate>';
				orderReqItem += '<ReqQty>' + order.orders[i].quantity + '</ReqQty>';
				orderReqItem += '</item>';
			}
			orderReqItem += '</SalesSchedulesIn>';
			
			orderReqItem += '<SalesSchedulesInx>';
			for (var i = 0; i < order.orders.length; i++) {
				orderReqItem += '<item>';
				orderReqItem += '<ItmNumber>0000' + ((i + 1) * 10) + '</ItmNumber>';
				orderReqItem += ' <SchedLine>0001</SchedLine>';
				orderReqItem += '<Updateflag>'+order.orders[i].updateFlag+'</Updateflag>';
				orderReqItem += '<ReqDate>X</ReqDate><ReqQty>X</ReqQty></item>';
			}
			orderReqItem += '</SalesSchedulesInx>';
			
			orderReqItem += '<Salesdocument>'+order.salesOrderNumber+'</Salesdocument>';

			orderReqItem += '</urn:ZBapiSalesDocuCreate></soapenv:Body></soapenv:Envelope>';
		}catch(e){
			orderReqItem=null;
		}
		return orderReqItem;
	};
	return product;
});