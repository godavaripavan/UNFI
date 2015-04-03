'use strict';
angular.module('mrc').factory('deliveryService', function(logService,xhrService,urlService,languageService,commonService){
	var delivery = function(data) {
		angular.extend(this, data);
	};
	delivery.getAllDeliveryOrders = function(xmlContent,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('getAllDeliveriesList'),xmlContent,headers,function(data){
			data=delivery.getDeliveryListMorphedData(data);
			if (data) {
				callback({'data': data,'message': ''});
			} else {
				logService.warn(languageService.MESSAGES.FAILED_GET_ALL_DELIVERIES);
				callback({'error': 'error','message': languageService.MESSAGES.FAILED_GET_ALL_DELIVERIES});
			}
		},function(data){
			logService.error(languageService.MESSAGES.FAILED_CREATE_PO);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_ALL_DELIVERIES});
		});
	};
	delivery.getAllSalesOrders=function(xmlContent,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('getSalesOrderForDelivery'),xmlContent,headers,function(response){
			response=delivery.getAllSalesOrdersMorphedData(response);
			if (response) {
				callback({'data': response,'message': ''});
			} else {
				logService.warn(languageService.MESSAGES.FAILED_GET_SALES_ORDERS);
				callback({'error': 'error','message': languageService.MESSAGES.FAILED_GET_SALES_ORDERS});
			}
		},function(data){
			logService.error(languageService.MESSAGES.FAILED_GET_SALES_ORDERS);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_SALES_ORDERS});
		});
	};
	delivery.saveDelivery = function(xmlContent,flag,callback){
		var serviceUrl='';
		if(flag){
			serviceUrl='saveDelivery';
		}else{
			serviceUrl='updateDelivery';
		}
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService(serviceUrl),xmlContent,headers,function(data){
			callback({
				'status':200,
				'data':data
			});
		},function(data){
			logService.error(languageService.MESSAGES.FAILED_SAVE_DELIVERY);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_SAVE_DELIVERY});
		});
	};
	delivery.updateDelivery = function(xmlContent,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('updateDelivery'),xmlContent,headers,function(data){
			callback({
				'status':200,
				'data':data
			});
		},function(data){
			logService.error(languageService.MESSAGES.FAILED_UPDATE_DELIVERY);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_UPDATE_DELIVERY});
		});
	};
	delivery.savePgiDelivery = function(xmlContent,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('saveDeliveryPGI'),xmlContent,headers,function(data){
			callback({
				'status':200,
				'data':data
			});
		},function(data){
			logService.error(languageService.MESSAGES.FAILED_SAVE_INVOICE);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_SAVE_INVOICE});
		});
	};
	delivery.GetDeliveryDocDetail = function(xmlContent,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('getProcurementDocDetails'),xmlContent,headers,function(data){
			if(data){
				data=delivery.getDeliveryDocDetailsMorphedData(data);
			}
			callback({
				'status':200,
				'data':data
			});
		},function(data){
			logService.error(languageService.MESSAGES.FAILED_GET_DOCDETAIL);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_DOCDETAIL});
		});
	};
	delivery.getDeliveryListMorphedData=function(xmldata){
		var result={};
		try{
			var deliveryTempData = commonService.convertXmlToJson(xmldata);
			result.lineItems=[];
			result.headerItems=[]; 
			var tempDeliveryJSON = deliveryTempData.Envelope.Body.ZGetDelvInfoAddlResponse.EtDeliveryHeader.item;
			var tempDeliveryLineItemsJson = deliveryTempData.Envelope.Body.ZGetDelvInfoAddlResponse.EtDeliveryItem.item;
			if(!angular.isArray(tempDeliveryJSON)) {
				tempDeliveryJSON=[tempDeliveryJSON];
			}
			for(var i=0;i<tempDeliveryJSON.length;i++){
				var temp={};
				try{
						temp.deliveryId=tempDeliveryJSON[i].Vbeln;
				}catch(e){
					temp.deliveryId='';
					logService.error(e);
				}
				try{
					temp.customerId=tempDeliveryJSON[i].Kunnr;
				}catch(e){
					temp.customerId='';
					logService.error(e);
				}
				
				try{
					temp.shipToPartyCustomer=tempDeliveryJSON[i].Kunnr;
				}catch(e){
					temp.shipToPartyCustomer='';
					logService.error(e);
				}
				
				try{
					temp.customerName=tempDeliveryJSON[i].Bolnr+''+tempDeliveryJSON[i].Verur;
				}catch(e){
					temp.customerName='';
					logService.error(e);
				}
				try{
					temp.deliveryDate=tempDeliveryJSON[i].Lfdat;
				}catch(e){
					temp.deliveryDate='';
					logService.error(e);
				}
				try{
					temp.netWeight=tempDeliveryJSON[i].Ntgew;
				}catch(e){
					temp.netWeight='';
					logService.error(e);
				}
				try{
					temp.quantity=tempDeliveryJSON[i].Lfimg;
				}catch(e){
					temp.quantity='';
					logService.error(e);
				}
				try{
					temp.pgiDone=tempDeliveryJSON[i].Vbtyp;
				}catch(e){
					temp.pgiDone='';
					logService.error(e);
				}
				try{
					temp.pgiDate=tempDeliveryJSON[i].WadatIst;
				}catch(e){
					temp.pgiDate='';
					logService.error(e);
				}
				try{
					temp.materialDocs=tempDeliveryJSON[i].Xabln;
				}catch(e){
					temp.materialDocs='';
					logService.error(e);
				}
				result.headerItems.push(temp);
			};
			if(!angular.isArray(tempDeliveryLineItemsJson)) {
				tempDeliveryLineItemsJson=[tempDeliveryLineItemsJson];
			}
			for (var j = 0; j < tempDeliveryLineItemsJson.length; j++) {
				var temp2={};
				try{
					temp2.deliveryId=tempDeliveryLineItemsJson[j].Vbeln;
				}catch(e){
					temp2.materialId='';
					logService.error(e);
				}
				try{
					temp2.materialId=tempDeliveryLineItemsJson[j].Matnr;
				}catch(e){
					temp2.materialId='';
					logService.error(e);
				}
				try{
					temp2.materialDescription=tempDeliveryLineItemsJson[j].Arktx;
				}catch(e){
					temp2.materialDescription='';
					logService.error(e);
				}
				try{
					temp2.materialGroup=tempDeliveryLineItemsJson[j].Matkl;
				}catch(e){
					temp2.materialGroup='';
					logService.error(e);
				}
				try{
					temp2.salesorderId=tempDeliveryLineItemsJson[j].Kdauf;
				}catch(e){
					temp2.salesorderId='';
					logService.error(e);
				}
				try{
					temp2.plantId=tempDeliveryLineItemsJson[j].Werks;
				}catch(e){
					temp2.plantId='';
					logService.error(e);
				}
				try{
					temp2.storageLocation=tempDeliveryLineItemsJson[j].Lgort;
				}catch(e){
					temp2.storageLocation='';
					logService.error(e);
				}
				try{
					temp2.quantity=tempDeliveryLineItemsJson[j].Lfimg;
				}catch(e){
					temp2.quantity='';
					logService.error(e);
				}
				try{
					temp2.pickQuantity=tempDeliveryLineItemsJson[j].Lfimg;
				}catch(e){
					temp2.pickQuantity='';
					logService.error(e);
				}
				try{
					temp2.uomId=tempDeliveryLineItemsJson[j].Meins;
				}catch(e){
					temp2.uomId='';
					logService.error(e);
				}
				try{
					temp2.weight=tempDeliveryLineItemsJson[j].Brgew;
				}catch(e){
					temp2.weight='';
					logService.error(e);
				}
				try{
					temp2.totalPrice=tempDeliveryLineItemsJson[j].Netpr;
				}catch(e){
					temp2.totalPrice='';
					logService.error(e);
				}
				/*try{
					temp2.deliveryDate=tempDeliveryLineItemsJson[j].Lfdat;
				}catch(e){
					temp2.deliveryDate='';
					logService.error(e);
				}*/
				try{
					temp2.heatCode=tempDeliveryLineItemsJson[j].Arktx;
				}catch(e){
					temp2.heatCode='';
					logService.error(e);
				}
				try{
					temp2.deliveryOrderIndicator=tempDeliveryLineItemsJson[j].Posnr;
				}catch(e){
					temp2.deliveryOrderIndicator='';
					logService.error(e);
				}
				try{
					temp2.deliverylineItemNumber=tempDeliveryLineItemsJson[j].Matnr;
				}catch(e){
					temp2.deliverylineItemNumber='';
					logService.error(e);
				}
				try{
					temp2.deliveryLineItemName=tempDeliveryLineItemsJson[j].Arktx;
				}catch(e){
					temp2.deliveryLineItemName='';
					logService.error(e);
				}
				try{
					temp2.salesorderId=tempDeliveryLineItemsJson[j].Vgbel;
				}catch(e){
					temp2.salesorderId='';
					logService.error(e);
				}
				result.lineItems.push(temp2);
			};
		}catch(e){
			logService.warn('Sorry, Invalid Delivery List Response Received!');
		}
		return result;
	};
	delivery.getAllSalesOrdersMorphedData=function(data){
		var result=[];
		try{
			var tempData=commonService.convertXmlToJson(data);
			var tempDelivarySalseOderList=tempData.Envelope.Body.ZGetSalesordInfoResponse.TSalesOrd.item;
			if(!angular.isArray(tempDelivarySalseOderList)) {
				tempDelivarySalseOderList=[tempDelivarySalseOderList];
			}
			for (var i = 0; i < tempDelivarySalseOderList.length; i++) {
				var temp={};
				try{
					var salesOrderId=tempDelivarySalseOderList[i].SdDoc
					temp.salesOrderId=parseInt(salesOrderId);
				}catch(e){
					temp.salesOrderId='';
					logService.error(e);
				}
				try{
					var shipToParty=tempDelivarySalseOderList[i].SoldTo;
					temp.shipToPartyCustomer=parseInt(shipToParty);
				}catch(e){
					temp.shipToPartyCustomer='';
					logService.error(e);
				}
				try{
					var shipToAddress=tempDelivarySalseOderList[i].ShipPoint
					temp.shipToAddress=parseInt(shipToAddress);
				}catch(e){
					temp.shipToAddress='';
					logService.error(e);
				}
				try{
					temp.materialDocs=tempDelivarySalseOderList[i].Xabln;
				}catch(e){
					temp.materialDocs='';
					logService.error(e);
				}
				var salesOrderLineItems=[];
				for (var j = 0; j < tempDelivarySalseOderList.length; j++) {
					if ((tempDelivarySalseOderList[i].ItmNumber==tempDelivarySalseOderList[j].ItmNumber)&&(tempDelivarySalseOderList[i].SdDoc==tempDelivarySalseOderList[j].SdDoc)) {
						var tempSalesOrderLineItems={};
						try{
							tempSalesOrderLineItems.materialId=tempDelivarySalseOderList[j].Material;
						}catch(e){
							tempSalesOrderLineItems.materialId='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.materialGroup=tempDelivarySalseOderList[j].MatVers;
						}catch(e){
							tempSalesOrderLineItems.materialGroup='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.plantId=tempDelivarySalseOderList[j].Plant;
						}catch(e){
							tempSalesOrderLineItems.plantId='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.storageLocation=tempDelivarySalseOderList[j].StoreLoc;
						}catch(e){
							tempSalesOrderLineItems.storageLocation='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.storageLocationId=tempDelivarySalseOderList[j].StoreLoc;
						}catch(e){
							tempSalesOrderLineItems.storageLocationId='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.salesorderId=tempDelivarySalseOderList[j].SdDoc;
						}catch(e){
							tempSalesOrderLineItems.salesorderId='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.quantity=tempDelivarySalseOderList[j].ReqQty;
						}catch(e){
							tempSalesOrderLineItems.quantity='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.deliveryQuantity=tempDelivarySalseOderList[j].DlvQty;
						}catch(e){
							tempSalesOrderLineItems.deliveryQuantity	='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.pickQuantity=tempDelivarySalseOderList[j].DlvQty;
						}catch(e){
							tempSalesOrderLineItems.pickQuantity='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.uomId=tempDelivarySalseOderList[j].BaseUom;
						}catch(e){
							tempSalesOrderLineItems.uomId='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.weight=tempDelivarySalseOderList[j].MatGuid;
						}catch(e){
							tempSalesOrderLineItems.weight='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.totalPrice=tempDelivarySalseOderList[j].NetPrice;
						}catch(e){
							tempSalesOrderLineItems.totalPrice='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.deliveryDate=tempDelivarySalseOderList[j].ReqDate;
						}catch(e){
							tempSalesOrderLineItems.deliveryDate='';
							logService.error(e);
						}
						try{
							tempSalesOrderLineItems.materialDescription=tempDelivarySalseOderList[j].ShortText;
						}catch(e){
							tempSalesOrderLineItems.materialDescription='';
							logService.error(e);
						}
						salesOrderLineItems.push(tempSalesOrderLineItems);
					};
					
				};
				temp.deliveryLineItems={};
				temp.deliveryLineItems=salesOrderLineItems;
				result.push(temp);
			};
		}catch(e){
			logService.warn('Sorry, Invalid Sales Orders Response Received!');
			result=[];
		}
		return result;
	};
	delivery.getDeliveryDocDetailsMorphedData =function(data){
		var result={};
		try{
			var deliveryTempData = commonService.convertXmlToJson(data);
			var  commontemp = deliveryTempData.Envelope.Body.ZGetAccDocDetailResponse;
			var headDetails = commontemp.TAccit.item;
			var documentNo;
			var companyCode;
			var finalYear;
			try{
			 result.documentNo= headDetails[0].Belnr;
			}catch(e){
				result.documentNo=null;
			}
			try{
				result.companyCode  = headDetails[0].Bukrs;
			}catch(e){
				result.companyCode = '';
			}
			try{
				result.finalYear = headDetails[0].Gjahr;
			}catch(e){
				result.finalYear ='';
			}
			try{
				result.postingDate = headDetails[0].Budat;
			}catch(e){
				result.postingDate ='';
			}
			var TBseg = commontemp.TAccit.item;
				result.TBseg =[];

			var glAccount;
			var description;
			var amount;
			var currencyKey;
			for (var i = 0; i < TBseg.length; i++) {
				var DocTableObj ={};
				try{
					DocTableObj.glAccount = TBseg[i].Hkont;
				}catch(e){
					DocTableObj.glAccount = '';
				}	
				try{
					DocTableObj.description = TBseg[i].Sgtxt;
				}catch(e){
					DocTableObj.description = '';
				}	
				try{
						DocTableObj.amount = TBseg[i].Pswbt;
				}catch(e){
						DocTableObj.amount = '';
				}	
				try{
					DocTableObj.currencyKey = TBseg[i].Pswsl;
				}catch(e){
					DocTableObj.currencyKey = '';
				}
				try{
					DocTableObj.postingIndicator = TBseg[i].Shkzg;
				}catch(e){
					DocTableObj.postingIndicator = '';
				}
				result.TBseg.push(DocTableObj);
			};
		}catch(e){
			logService.warn('Sorry, Invalid Accounting Doc Response Received!');
		}
		return result;
	};
	delivery.getDeliveryListRequestObjectXML=function(customerId){
		var orderReqItem ='';
		try{
			if(customerId){
				customerId=angular.copy(customerId);
				orderReqItem += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
				orderReqItem += '<soapenv:Header/>';
				orderReqItem += '<soapenv:Body>';
				orderReqItem += '<urn:ZGetDelvInfoAddl>';
				orderReqItem += '<IKunnr>'+customerId+'</IKunnr>';
				orderReqItem += '<IVbeln></IVbeln>';
				orderReqItem += '<IWerks></IWerks>';
				orderReqItem += '</urn:ZGetDelvInfoAddl>';
				orderReqItem += '</soapenv:Body>';
				orderReqItem += '</soapenv:Envelope>';
				return orderReqItem;
			}
		}catch(e){
			logService.warn('Sorry, Failed to Create XML');
			orderReqItem='';
		}
		return orderReqItem;
	};
	return delivery;
});