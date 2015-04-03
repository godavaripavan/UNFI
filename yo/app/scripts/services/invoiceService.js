'use strict';
angular.module('mrc').factory('invoiceService', function(logService,xhrService,urlService,languageService,commonService){
	var invoice = function(data) {
		angular.extend(this, data);
	};
	

	invoice.getInvoiceListMorphedData=function(data){
		var invoiceTempData = commonService.convertXmlToJson(data);
		var result=[];
		var tempInvoiceJSON = invoiceTempData.Envelope.Body.ZGetListInvoiceResponse.EList.item;
			for (var i = 0; i < tempInvoiceJSON.length; i++) {
				var temp={};
				try{
					temp.invoiceId=tempInvoiceJSON[i].Vbeln;
				}catch(e){
					temp.invoiceId='';
					logService.error(e);
				}
				try{
					temp.customerId=tempInvoiceJSON[i].Kunnr;
				}catch(e){
					temp.customerId='';
					logService.error(e);
				}
				try{
					temp.customerName=tempInvoiceJSON[i].Name1;
				}catch(e){
					temp.customerName='';
					logService.error(e);
				}
				try{
					temp.branchId=tempInvoiceJSON[i].Bupla;
				}catch(e){
					temp.branchId='';
					logService.error(e);
				}
				try{
					temp.deliveryId=tempInvoiceJSON[i].Vbelv;
				}catch(e){
					temp.deliveryId='';
					logService.error(e);
				}
				try{
					temp.invoiceDate=tempInvoiceJSON[i].Fkdat;
				}catch(e){
					temp.invoiceDate='';
					logService.error(e);
				}
				try{
					temp.lineItems=tempInvoiceJSON[i].Posnr;
				}catch(e){
					temp.lineItems='';
					logService.error(e);
				}
				try{
					temp.quantity=tempInvoiceJSON[i].Fkimg;
				}catch(e){
					temp.quantity='';
					logService.error(e);
				}
				try{
					temp.totalPrice=tempInvoiceJSON[i].Netwr;
				}catch(e){
					temp.totalPrice='';
					logService.error(e);
				}
				try{
					temp.accountingDoc=tempInvoiceJSON[i].Belnr;
				}catch(e){
					temp.accountingDoc='';
					logService.error(e);
				}
				try{
					temp.materialGroup=tempInvoiceJSON[i].Matkl;
				}catch(e){
					temp.materialGroup='';
					logService.error(e);
				}
				try{
					temp.salesOrder=tempInvoiceJSON[i].Aubel;
				}catch(e){
					temp.salesOrder='';
					logService.error(e);
				}
				try{
					temp.totalInvoiceValue=tempInvoiceJSON[i].Netwr;
				}catch(e){
					temp.totalInvoiceValue='';
					logService.error(e);
				}
				try{
					temp.uomId=tempInvoiceJSON[i].Meins;
				}catch(e){
					temp.uomId='';
					logService.error(e);
				}
				try{
					temp.weight=tempInvoiceJSON[i].Ntgew;
				}catch(e){
					temp.weight='';
					logService.error(e);
				}
				try{
					temp.plantId=tempInvoiceJSON[i].Werks.Werks;
				}catch(e){
					temp.plantId='';
					logService.error(e);
				}
				try{
					temp.materialNumber=tempInvoiceJSON[i].Matnr;
				}catch(e){
					temp.materialNumber='';
					logService.error(e);
				}
				try{
					temp.materialName=tempInvoiceJSON[i].Arktx;
				}catch(e){
					temp.materialName='';
					logService.error(e);
				}
				result.push(temp);
			};
		return result;
	};
	invoice.getInvoiceListDetails = function(xmlContent,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('getAllInvoiceDetails'),xmlContent,headers,function(data){
			if(data){
				data=invoice.getInvoiceListMorphedData(data);
			}
			callback({
				'status':200,
				'data':data
			});
		},function(data){
			logService.error(languageService.MESSAGES.FAILED_GET_ALL_INVOICE_DELIVERIES);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_ALL_INVOICE_DELIVERIES});
		});
	};
	invoice.getInvoiceDeliveriesMorphedData=function(data){
		var invoiceDeliveryTempData = commonService.convertXmlToJson(data);
		var result={};
		result.lineItems=[];
		result.headerItems=[];
		var tempInvoiceDeliveryHeader = invoiceDeliveryTempData.Envelope.Body.ZGetDelvInfoResponse.EtDeliveryHeader.item;
		var tempInvoiceDeliveryItem = invoiceDeliveryTempData.Envelope.Body.ZGetDelvInfoResponse.EtDeliveryItem.item;

			for (var i = 0; i < tempInvoiceDeliveryHeader.length; i++) {
				var temp={};
				try{
					temp.deliveryId=tempInvoiceDeliveryHeader[i].Vbeln;
				}catch(e){
					temp.deliveryId='';
					logService.error(e);
				}
				try{
					temp.customerId=tempInvoiceDeliveryHeader[i].Kunnr;
				}catch(e){
					temp.customerId='';
					logService.error(e);
				}
				try{
					temp.billToAddress=tempInvoiceDeliveryHeader[i].Kunag;
				}catch(e){
					temp.billToAddress='';
					logService.error(e);
				}
				try{
					temp.paymentTerms=tempInvoiceDeliveryHeader[i].Inco1;
				}catch(e){
					temp.paymentTerms='';
					logService.error(e);
				}
				try{
					temp.totalInvoiceValue=tempInvoiceDeliveryHeader[i].Netwr;
				}catch(e){
					temp.totalInvoiceValue='';
					logService.error(e);
				}
				try{
					temp.plantId=tempInvoiceDeliveryHeader[i].Werks;
				}catch(e){
					temp.plantId='';
					logService.error(e);
				}
				result.headerItems.push(temp);
			};
			for (var j = 0; j < tempInvoiceDeliveryItem.length; j++) {
				var temp2={};
				try{
					temp2.plantId=tempInvoiceDeliveryItem[j].Werks;
				}catch(e){
					temp2.plantId='';
					logService.error(e);
				}
				try{
					temp2.materialId=tempInvoiceDeliveryItem[j].Vbeln;
				}catch(e){
					temp2.materialId='';
					logService.error(e);
				}
				try{
					temp2.materialGroup=tempInvoiceDeliveryItem[i].Matkl;
				}catch(e){
					temp2.materialGroup='';
					logService.error(e);
				}
				try{
					temp2.materialNumber=tempInvoiceDeliveryItem[j].Matnr;
				}catch(e){
					temp2.materialNumber='';
					logService.error(e);
				}
				try{
					temp2.materialName=tempInvoiceDeliveryItem[j].Arktx;
				}catch(e){
					temp2.materialName='';
					logService.error(e);
				}
				try{
					temp2.salesOrder=tempInvoiceDeliveryItem[i].Vgbel;
				}catch(e){
					temp2.salesOrder='';
					logService.error(e);
				}
				try{
					temp2.quantity=tempInvoiceDeliveryItem[j].Lfimg;
				}catch(e){
					temp2.quantity='';
					logService.error(e);
				}
				try{
					temp2.branchId=tempInvoiceDeliveryItem[j].Vkbur;
				}catch(e){
					temp2.branchId='';
					logService.error(e);
				}
				try{
					temp2.materialQty=tempInvoiceDeliveryItem[j].Lfimg;
				}catch(e){
					temp2.materialQty='';
					logService.error(e);
				}
				try{
					temp2.pickQty=tempInvoiceDeliveryItem[j].Lgmng;
				}catch(e){
					temp2.pickQty='';
					logService.error(e);
				}
				try{
					temp2.uomId=tempInvoiceDeliveryItem[j].Vrkme;
				}catch(e){
					temp2.uomId='';
					logService.error(e);
				}
				try{
					temp2.weight=tempInvoiceDeliveryItem[j].Ntgew;
				}catch(e){
					temp2.weight='';
					logService.error(e);
				}
				try{
					temp2.totalPrice=tempInvoiceDeliveryItem[j].Netpr;
				}catch(e){
					temp2.totalPrice='';
					logService.error(e);
				}
				try{
					temp2.lineItems=tempInvoiceDeliveryItem[j].Posnr;
				}catch(e){
					temp2.lineItems='';
					logService.error(e);
				}
				result.lineItems.push(temp2);
			};
		return result;
	};
	invoice.getInvoiceDeliveryDetails = function(xmlContent,callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('getAllInvoiceDeliveries'),xmlContent,headers,function(data){
			if(data){
				data=invoice.getInvoiceDeliveriesMorphedData(data);
			}
			callback({
				'status':200,
				'data':data
			});
		},function(data){
			logService.error(languageService.MESSAGES.FAILED_GET_ALL_INVOICE_LIST);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_ALL_INVOICE_LIST});
		});
	};
	/*------------------- save Invoice -----------------*/
		invoice.getInvoiceSaveMorphedData =function(data){
			var invoiceTempData = commonService.convertXmlToJson(data);
			var result=[];
			var savedData={};
			var tempInvoiceSaveJSON = invoiceTempData.Envelope.Body.ZbapiBillingdocCreatefrmdat1Response;
			var savedInvoiceItemNumber = tempInvoiceSaveJSON.InvoiceNumber;
			var savedInvoiceMsgType = tempInvoiceSaveJSON.ReturnlogOut.Type;
			var savedInvoiceMsgId = tempInvoiceSaveJSON.ReturnlogOut.Id;
			var savedInvoiceMsgNumber = tempInvoiceSaveJSON.ReturnlogOut.Number;
			var savedInvoiceMsgDes = tempInvoiceSaveJSON.ReturnlogOut.Message;
			savedData={"savedInvoiceItemNumber":savedInvoiceItemNumber,"savedInvoiceMsgType":savedInvoiceMsgType,"savedInvoiceMsgId":savedInvoiceMsgId,"savedInvoiceMsgNumber":savedInvoiceMsgNumber,"savedInvoiceMsgDes":savedInvoiceMsgDes};
			result.push(savedData);
			return result;
		}
		invoice.saveInvoiceLineItems = function(xmlContent,callback){
			var headers = {
			  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
			};
			xhrService.doPost(urlService.getService('saveInvoice'),xmlContent,headers,function(data){
				if(data){
					data=invoice.getInvoiceSaveMorphedData(data);
				}
				callback({
					'status':200,
					'data':data
				});
			},function(data){
				logService.error(languageService.MESSAGES.FAILED_SAVE_INVOICE);
				callback({'error': 'ok','message': languageService.MESSAGES.FAILED_SAVE_INVOICE});
			});
		}
	/*------------------- save Invoice -----------------*/

	/*--------------------Doc Details Starting------------------*/

		invoice.getInvoiceDocDetailsMorphedData =function(data){
			var invoiceTempData = commonService.convertXmlToJson(data);
			var  commontemp = invoiceTempData.Envelope.Body.ZGetAccDocDetailsResponse;
			var TBkpf = commontemp.TBkpf.item;
			var result={};
			var documentNo;
			var companyCode;
			var finalYear;
			try{
			 result.documentNo= TBkpf.Belnr;
			}catch(e){
				result.documentNo=null;
			}
			try{
				result.companyCode  = TBkpf.Bukrs;
			}catch(e){
				result.companyCode = '';
			}
			try{
				result.finalYear = TBkpf.Gjahr;
			}catch(e){
				result.finalYear ='';
			}
			try{
				result.postingDate = TBkpf.Budat;
			}catch(e){
				result.postingDate ='';
			}

			var TBseg = commontemp.TBseg.item;
				result.TBseg =[];

			var DocTableObj ={};
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
						DocTableObj.amount = TBseg[i].Dmbtr;
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
			console.log("result-------------------->",result)
			return result;
		}

		invoice.GetInvoiceDocDetail = function(xmlContent,callback){
			var headers = {
			  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
			};
			xhrService.doPost(urlService.getService('GetDocDetails'),xmlContent,headers,function(data){
				if(data){
					data=invoice.getInvoiceDocDetailsMorphedData(data);
				}
				callback({
					'status':200,
					'data':data
				});
			},function(data){
				logService.error(languageService.MESSAGES.FAILED_GET_DOCDETAIL);
				callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_DOCDETAIL});
			});
		}

	/*--------------------Doc Details Ending------------------*/
	return invoice;
});