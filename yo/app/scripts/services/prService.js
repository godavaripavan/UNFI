'use strict';
angular.module('mrc').factory('prService', function(logService,xhrService,urlService,languageService,commonService,loaderService){
	var pr = function(data) {
		angular.extend(this, data);
	};
	pr.detailView=false;
	pr.selectedPRList=[];

	pr.getPRList=function(callback){
		loaderService.start();
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		var xmlContent = pr.constructGetPRRequest();
		xhrService.doPost(urlService.getService('getPRList'),xmlContent,headers,function(data){
		var tempData=commonService.convertXmlToJson(data);
		var poList=pr.getPRMorphedData(tempData);
		if(poList){
				callback({'status':200,'data':poList});
			}else{
				logService.warn(languageService.MESSAGES.FAILED_GET_PR_LIST);
				callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_PR_LIST});
			}
			loaderService.stop();
		},function(data){
			loaderService.stop();
			logService.error(languageService.MESSAGES.FAILED_GET_PR_LIST);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_GET_PR_LIST});
		});
	};

	pr.createPO=function(xmlContent, callback){
		var headers = {
		  "Authorization": "Basic " + window.btoa("NANDIDEB" + ":" + "MRCDEMO1"),'Content-Type':'text/xml','Accept':'text/xml'
		};
		xhrService.doPost(urlService.getService('createPO'), xmlContent, headers, function(data) {
		var respJson=commonService.convertXmlToJson(data);
		var actualResp=pr.getCreatePORespMorphedData(respJson);
			if (data) {
				callback({'data': actualResp,'message': ''});
			} else {
				logService.warn(languageService.MESSAGES.FAILED_CREATE_PO);
				callback({'error': 'error','message': languageService.MESSAGES.FAILED_CREATE_PO});
			}
		}, function(data) {
			logService.error(languageService.MESSAGES.FAILED_CREATE_PO);
			callback({'error': 'ok','message': languageService.MESSAGES.FAILED_CREATE_PO});
		});
	};

	
	pr.getPRMorphedData=function(tempData){
		var result=[];
		tempData = tempData.Envelope.Body.ZGetPoInfoResponse.RequisitionItems.item;
		if(!angular.isArray(tempData)) {
			tempData.item=[tempData];
		}

		var listlength = tempData.length
		var vendors=[];
		var vendorTemp={};
		var vendorTemp2={};
		var vendorTemp3={};

		vendorTemp.vendorId= "422016";
        vendorTemp.vendorName= "TXAM PUMPS LLC";
        vendorTemp2.vendorId= "175677"
        vendorTemp2.vendorName= "HUSTEEL USA INC";
        vendorTemp3.vendorId= "175681";
        vendorTemp3.vendorName= "ADVANCED FLUID TECHNOLOGIES";
        vendors.push(vendorTemp);
        vendors.push(vendorTemp2);
        vendors.push(vendorTemp3);

		for (var i = 0; i < listlength; i++) {
			var temp={};
			try{
				temp.prNumber=tempData[i].PreqNo;
			}catch(e){
				temp.prNumber='';
				logService.error(e);
			}
			try{
				temp.storageLocation=tempData[i].StoreLoc;
			}catch(e){
				temp.storageLocation='';
				logService.error(e);
			}
			try{
				temp.materialId=tempData[i].Material;
			}catch(e){
				temp.materialId='';
				logService.error(e);
			}
			try{
				temp.materialName=tempData[i].ShortText;
			}catch(e){
				temp.materialName='';
				logService.error(e);
			}
			
			try{
				temp.prReleaseDate=tempData[i].RelDate;
			}catch(e){
				temp.prReleaseDate='';
				logService.error(e);
			}
			try{
				//temp.vendorId=tempData[i].FixedVend;
				temp.vendorId='';
			}catch(e){
				temp.vendorId='';
				logService.error(e);
			}
			
			try{
				// TODO 
				//Time being plant and storage location is hard coding, to generate confirm gr
				// plant no 0096 is required to save  storage location 1040
				temp.plant=tempData[i].Plant;
				//temp.plant='0096';
			}catch(e){
				temp.plant='';
				logService.error(e);
			}
			try{
				temp.quantity=tempData[i].Quantity;
				temp.quantity = parseFloat(temp.quantity);
					if(isNaN(temp.quantity)) {
						temp.quantity = 0;
					}
			}catch(e){
				temp.quantity=0;
				logService.error(e);
			}
			try{
				temp.availableQty=tempData[i].Shortage;
			}catch(e){
				temp.availableQty='';
				logService.error(e);
			}
			try{
				temp.totalPrice=tempData[i].CAmtBapi;
			}catch(e){
				temp.totalPrice='';
				logService.error(e);
			}
			try{
				temp.deliveryDate=tempData[i].DelivDate;
			}catch(e){
				temp.deliveryDate='';
				logService.error(e);
			}
			
			try{
				//temp.storageLocation = '1040';
				temp.storageLocation=tempData[i].StoreLoc;
			}catch(e){
				temp.storageLocation='';
				logService.error(e);
			}
			try{
				temp.materialGroup=tempData[i].MatGrp;
			}catch(e){
				temp.materialGroup='';
				logService.error(e);
			}
			try{
				temp.daysOfInventory=tempData[i].GrPrTime;
			}catch(e){
				temp.daysOfInventory='';
				logService.error(e);
			}
			try{
				temp.uom=tempData[i].Unit;
			}catch(e){
				temp.uom='';
				logService.error(e);
			}
			try{
				temp.unitPrice=tempData[i].CAmtBapi;
			}catch(e){
				temp.unitPrice='';
				logService.error(e);
			}
			temp.vendors=vendors;
			result.push(temp);
		}
		return result;
	};

	/*pr.getCreatePOMorphedData=function(selectedList, clientJson){
		var temp=[];
		var listlength = selectedList.length;
		var vendor = '';
		try{
			temp = clientJson.Envelope.Body.ZConvPrToPo.IPoitem.item;
			if(!angular.isArray(clientJson.Envelope.Body.ZConvPrToPo.IPoitem.item)) {
				temp=[clientJson.Envelope.Body.ZConvPrToPo.IPoitem.item];
			}

			if(pr.poNumber != '') {
				clientJson.Envelope.Body.ZConvPrToPo.IPoheader.PoNumber = pr.poNumber;
			}
		
			for (var i = 0; i < listlength; i++) {
				try{
					temp[i].PreqNo = selectedList[i].prNumber;
				}catch(e){
					temp[i].PreqNo='';
					logService.error(e);
				}
				try{
					temp[i].Material = selectedList[i].materialId;
				}catch(e){
					temp[i].Material='';
					logService.error(e);
				}
				try{
									
					clientJson.Envelope.Body.ZConvPrToPo.IPoheader.Vendor = selectedList[i].vendorId;
				}catch(e){
					clientJson.Envelope.Body.ZConvPrToPo.IPoheader.Vendor='';
					logService.error(e);
				}
				try{
					temp[i].Quantity=selectedList[i].quantity;
					temp[i].Quantity = parseFloat(temp[i].Quantity);
						if(isNaN(temp[i].Quantity)) {
							temp[i].Quantity = 0;
						}
				}catch(e){
					temp[i].Quantity=0;
					logService.error(e);
				}
				try{
					temp[i].PoUnit=selectedList[i].uom;
				}catch(e){
					temp[i].PoUnit='';
					logService.error(e);
				}
				try{
					temp[i].NetPrice=selectedList[i].unitPrice;
					temp[i].NetPrice = parseFloat(temp[i].NetPrice);
						if(isNaN(temp[i].NetPrice)) {
							temp[i].NetPrice = 0;
						}
				}catch(e){
					temp[i].NetPrice=0;
					logService.error(e);
				}
				try{
					temp[i].GrToDate=selectedList[i].deliveryDate;
				}catch(e){
					temp[i].GrToDate='';
					logService.error(e);
				}
				try{
					temp[i].PreqItem='0000'+((1+i)*10);
				}catch(e){
					temp[i].PreqItem='';
					logService.error(e);
				}
			}
		}catch(e){
			logService.error(e);
		}
		return clientJson;
	};*/

	pr.getCreatePORespMorphedData=function(respJson){
		var lineitems=[];
		var materials=[];
		var data = {};
		try{

		var headerJson = respJson.Envelope.Body.ZConvPrToPoResponse.EPoheader;
		if(!angular.isArray(respJson.Envelope.Body.ZConvPrToPoResponse.TPoitem.item)) {
				lineitems=[respJson.Envelope.Body.ZConvPrToPoResponse.TPoitem.item];
		}
		data.poNumber = headerJson.PoNumber;
		data.vendorId = headerJson.Vendor;
		data.vendorName = headerJson.Incoterms2;
		data.status = headerJson.Status;
		data.poDate = headerJson.CreatDate;
		data.lineItems = lineitems.length;
		
		for (var i = 0; i < lineitems.length; i++) {
			var temp = {};
			try{
				temp.materialGroup = lineitems[i].MatlGroup;
			}catch(e){
				temp.materialGroup='';
				logService.error(e);
			}
			try{
				temp.materialName = lineitems[i].ShortText;
			}catch(e){
				temp.materialName='';
				logService.error(e);
			}
			try{
				temp.materialId=lineitems[i].Material;
			}catch(e){
				temp.materialId='';
				logService.error(e);
			}
			try{
				//temp.plant=lineitems[i].Plant;
				temp.plant = '0096';
			}catch(e){
				temp.plant='';
				logService.error(e);
			}
			try{
				temp.prNumber=lineitems[i].PreqNo;
			}catch(e){
				temp.prNumber='';
				logService.error(e);
			}
			try{
				//temp.storageLocation=lineitems[i].StgeLoc;
				temp.storageLocation='1040';
			}catch(e){
				temp.storageLocation='';
				logService.error(e);
			}
			try{
				temp.supplierAck=lineitems[i].AcknowlNo;
			}catch(e){
				temp.supplierAck='';
				logService.error(e);
			}
			try{
				temp.deliveryCompleted=lineitems[i].NoMoreGr;
			}catch(e){
				temp.deliveryCompleted='';
				logService.error(e);
			}
			try{
				temp.quantity=lineitems[i].Quantity;
				temp.quantity = parseFloat(temp.quantity);
					if(isNaN(temp.quantity)) {
						temp.quantity = 0;
					}
			}catch(e){
				temp.quantity=0;
				logService.error(e);
			}
			try{
				temp.uom=lineitems[i].PoUnit;
			}catch(e){
				temp.uom='';
				logService.error(e);
			}
			try{
				temp.unitPrice=lineitems[i].NetPrice;
				temp.unitPrice = parseFloat(temp.unitPrice);
					if(isNaN(temp.unitPrice)) {
						temp.unitPrice = 0;
					}
			}catch(e){
				temp.unitPrice=0;
				logService.error(e);
			}
			try{
				temp.deliveryDate=lineitems[i].GrToDate;
			}catch(e){
				temp.deliveryDate='';
				logService.error(e);
			}
			try{
				temp.daysOfInventory=lineitems[i].GrPrTime;
			}catch(e){
				temp.daysOfInventory='';
				logService.error(e);
			}
			try{
				temp.prItemNumber=lineitems[i].PreqItem;
			}catch(e){
				temp.prItemNumber='';
				logService.error(e);
			}
			
			materials.push(temp);
		}
		data.materials = materials;
		}catch(e){
			logService.error(e);
		}
		return data;
	};

	pr.constructGetPRRequest=function(){
		var prReqXml ='';
		var date = commonService.get20DaysOldDate();
		prReqXml += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
		prReqXml += '<soap:Header/><soap:Body><urn:ZGetPoInfo>';
		prReqXml += '<IDate>';
		prReqXml += date;
		prReqXml += '</IDate>';
		prReqXml += '<RequisitionItems><item></item></RequisitionItems></urn:ZGetPoInfo></soap:Body></soap:Envelope>';
		return prReqXml;
	};

	return pr;
});