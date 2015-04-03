'use strict';
angular.module('mrc').factory('poService', function(logService,xhrService,urlService,languageService,commonService,loaderService){
	var po = function(data) {
		angular.extend(this, data);
	};
	po.detailView=false;
	po.selectedPO ={};
	po.getPOListMorphedData=function(data){
		var result=[];
		try{
			var tempData=commonService.convertXmlToJson(data);
			tempData = tempData.Envelope.Body;
			if(!angular.isArray(tempData.ZGetPurOrderInfoResponse.Poheader.item)) {
				tempData.ZGetPurOrderInfoResponse.Poheader.item=[tempData.ZGetPurOrderInfoResponse.Poheader.item];
			}

			for (var i = 0; i < tempData.ZGetPurOrderInfoResponse.Poheader.item.length; i++) {
				var temp={};
				try{
					temp.poNumber=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].PoNumber;
				}catch(e){
					temp.poNumber='';
					logService.error(e);
				}
				try{
					temp.orderType=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].DocType;
					//temp.orderType = 'stock';
				}catch(e){
					temp.orderType='';
					logService.error(e);
				}
				try{
					if(temp.orderType == 'UD'){
						temp.vendorId=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].SupplPlnt;
					}else{
						/*temp.vendorId=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].Vendor;*/
						temp.vendorId=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].Vendor;
					}
					
				}catch(e){
					temp.vendorId='';
					logService.error(e);
				}
				try{
					temp.vendorName=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].Incoterms2;
				}catch(e){
					temp.vendorName='';
					logService.error(e);
				}
				try{
					temp.status=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].PoStatus;
				}catch(e){
					temp.status='';
					logService.error(e);
				}
				try{
					temp.supplierAck=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].SalesPers;
				}catch(e){
					temp.supplierAck='';
					logService.error(e);
				}
				try{
					temp.poDate=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].DocDate;
				}catch(e){
					temp.poDate='';
					logService.error(e);
				}
				try{
					var tempLineItems=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].LineCount;
					temp.lineItems=parseInt(tempLineItems);
				}catch(e){
					temp.lineItems=0;
					logService.error(e);
				}
				try{
					
					temp.quantity=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].TotQuan;
					temp.quantity = parseFloat(temp.quantity);
					if(isNaN(temp.quantity)) {
						temp.quantity = 0;
					}
				}catch(e){
					temp.quantity=0;
					logService.error(e);
				}
				try{
					temp.totalPrice=tempData.ZGetPurOrderInfoResponse.Poheader.item[i].TotPrice;
					temp.totalPrice = parseFloat(temp.totalPrice);
					if(isNaN(temp.totalPrice)) {
						temp.totalPrice= 0;
					}
				}catch(e){
					temp.totalPrice=0;
					logService.error(e);
				}
			var materials=[];
				for (var j = 0; j < tempData.ZGetPurOrderInfoResponse.Poitem.item.length; j++) {
					var tempMaterial={};
					if (tempData.ZGetPurOrderInfoResponse.Poitem.item[j].PoNumber == tempData.ZGetPurOrderInfoResponse.Poheader.item[i].PoNumber ) {
						try{
							tempMaterial.materialGroup=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].MatlGroup;
						}catch(e){
							tempMaterial.materialGroup='';
							logService.error(e);
						}
						try{
							tempMaterial.materialId=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].Material;
						}catch(e){
							tempMaterial.materialId='';
							logService.error(e);
						}
						try{
							tempMaterial.materialName=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].ShortText;
						}catch(e){
							tempMaterial.materialName='';
							logService.error(e);
						}
						try{
							// TODO 
							//Time being plant and storage location is hard coding, to generate confirm gr
							// plant no 0096 is required to save  storage location 1040
							//temp.plant=tempData[i].Plant;
							//tempMaterial.plant=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].Plant;
							// Only 0096 and 1040 combination would work
							tempMaterial.plant='0096';
						}catch(e){
							tempMaterial.plant='';
							logService.error(e);
						}
						try{
							tempMaterial.prNumber=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].PreqNo;
						}catch(e){
							tempMaterial.prNumber='';
							logService.error(e);
						}
						try{
							tempMaterial.prNumber=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].PreqNo;
						}catch(e){
							tempMaterial.prNumber='';
							logService.error(e);
						}
						try{
							tempMaterial.prItemNumber=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].PoItem;
						}catch(e){
							tempMaterial.prItemNumber='';
							logService.error(e);
						}
						try{
							//tempMaterial.storageLocation=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].StgeLoc;
							tempMaterial.storageLocation = '1040';
						}catch(e){
							tempMaterial.storageLocation='';
							logService.error(e);
						}
						try{
							tempMaterial.supplierAck=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].AcknowlNo;
						}catch(e){
							tempMaterial.supplierAck='';
							logService.error(e);
						}
						try{
							tempMaterial.deliveryCompleted=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].NoMoreGr;
						}catch(e){
							tempMaterial.deliveryCompleted='';
							logService.error(e);
						}
						try{
							tempMaterial.daysOfInventory='12';
						}catch(e){
							tempMaterial.daysOfInventory='';
							logService.error(e);
						}
						try{
							var tempQuantity=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].Quantity;
							tempMaterial.quantity=parseFloat(tempQuantity);
							if(isNaN(tempMaterial.quantity)) {
								tempMaterial.quantity = 0;
							}
						}catch(e){
							tempMaterial.quantity=0;
							logService.error(e);
						}
						try{
							tempMaterial.uom=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].PoUnit;
						}catch(e){
							tempMaterial.uom='';
							logService.error(e);
						}
						try{
							var tempUnitPrice=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].NetPrice;
							tempMaterial.unitPrice=parseFloat(tempUnitPrice);
							if(isNaN(tempMaterial.unitPrice)) {
								tempMaterial.unitPrice = 0;
							}
						}catch(e){
							tempMaterial.unitPrice=0;
							logService.error(e);
						}
						try{
							tempMaterial.deliveryDate=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].GrToDate;
						}catch(e){
							tempMaterial.deliveryDate='';
							logService.error(e);
						}
						try{
							tempMaterial.SrmContractId=tempData.ZGetPurOrderInfoResponse.Poitem.item[j].SrmContractId;
						}catch(e){
							tempMaterial.SrmContractId='';
							logService.error(e);
						}
						materials.push(tempMaterial);
					};
				
				};
				temp.materials={};
				temp.materials=materials;
				
				result.push(temp);
			}

		}catch(e) {
			result = [];
		}
	//	console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',result);
		return result;
	};
	
	po.getPOList=function(callback){
		loaderService.start();
		var headers = {
		 "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		var xmlContent=po.getPOListRequestXml();
		xhrService.doPost(urlService.getService('getPOList'),xmlContent,headers,function(data){
			data=po.getPOListMorphedData(data);
			if(data){
				callback({'status':200,'data':data});
			}else{
				logService.error(languageService.MESSAGES.FAILED_GET_PO_LIST);
				callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_PO_LIST});	
			}
			loaderService.stop();
		},function(data){
			loaderService.stop();
			logService.error(languageService.MESSAGES.FAILED_GET_PO_LIST);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_PO_LIST});
		});
	};


	po.getPOListRequestXml=function(){
		var poReqXml ='';
		var date = commonService.get20DaysOldDate();
		poReqXml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
		poReqXml += '<soapenv:Header/><soapenv:Body><urn:ZGetPurOrderInfo>';
		poReqXml += '<IDate>';
		poReqXml += date;
		poReqXml += '</IDate>';
		poReqXml += '<Poheader><item></item></Poheader><Poitem><item></item></Poitem></urn:ZGetPurOrderInfo></soapenv:Body></soapenv:Envelope>';
		return poReqXml;
	};

		/*--------------------Doc Delivery Details Starting------------------*/

		po.getDeliveryDocDetailsMorphedData =function(data){
			var deliveryTempData = commonService.convertXmlToJson(data);
			var  commontemp = deliveryTempData.Envelope.Body.ZGetAccDocDetailResponse;
			var headDetails = commontemp.TAccit.item;
			var result={};
			var documentNo;
			var companyCode;
			var finalYear;
			var postingDate;
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
			var postingIndicator;
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
			//console.log("result<<<<<<<<<<<<<<<<<<<<<<-------------------->",result)
			return result;
		}

		po.GetProcurementDocDetail = function(xmlContent,callback){
			var headers = {
			  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
			};
			xhrService.doPost(urlService.getService('getProcurementDocDetails'),xmlContent,headers,function(data){
				if(data){
					data=po.getDeliveryDocDetailsMorphedData(data);
				}
				if(data){
					callback({'status':200,'data':data});
				}else{
					logService.error(languageService.MESSAGES.FAILED_GET_DOCDETAIL);
					callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_DOCDETAIL});	
				}
			},function(data){
				logService.error(languageService.MESSAGES.FAILED_GET_DOCDETAIL);
				callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_DOCDETAIL});
			});
		}

	/*--------------------Doc Delivery Details Ending------------------*/

	po.confirmGR=function(xmlContent, callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('confirmGR'), xmlContent, headers, function(data) {
		var respJson=commonService.convertXmlToJson(data);
		var matDocNum=respJson.Envelope.Body.ZbapiGoodsmvtCreateResponse.EvMatdoc;
			if (data && matDocNum) {
				callback({'data': matDocNum,'message': ''});
			} else {
				logService.warn(languageService.MESSAGES.FAILED_CONFIRM_GR);
				callback({'error': 'error','message': languageService.MESSAGES.FAILED_CONFIRM_GR});
			}
		}, function(data) {
			logService.error(languageService.MESSAGES.FAILED_CONFIRM_GR);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_CONFIRM_GR});
		});
	};
	
	return po;
});