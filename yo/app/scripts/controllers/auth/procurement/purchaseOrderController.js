'use strict';
angular.module('mrc')
	.controller('purchaseOrderController', ['$scope','$filter','$rootScope','poService','loaderService','alertService','prService','commonService',
		function(scope, $filter, rootScope,poService,loaderService ,alertService,prService,commonService) {
			scope.po={'searchText':'','displayPOs':[],'poCreatedStatus':true};
			scope.formats = ['MM/dd/yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			scope.format = scope.formats[0];
			scope.pageResults = [{ id: 1, pages: 20 },{ id: 2, pages: 50 },{ id: 3, pages: 100 },{ id: 4, pages: 200 }];
			scope.selectedPages = scope.pageResults[0];
			scope.confirmGr = false;
			scope.displayConfirmGrBtn = false;
			scope.displayAccountBtn=false;
			scope.podetailflow = false;
			scope.fnIsDetailView=function(){
				return poService.detailView;
			};
			scope.fnGetPoObj = function(){
				return poService.selectedPO;
			};
			scope.fnToogleDetailView=function(){
				scope.confirmGr=false;
				poService.detailView=!poService.detailView;
				scope.fnInit();
			};
			scope.fnGetPOTotalQuantity=function(purchaseOrderObject){
				var total=0;
				for (var i = 0; i < purchaseOrderObject.materials.length; i++) {
					total=total+purchaseOrderObject.materials[i].quantity;
				}
				if(!isNaN(total)){
					return total.toFixed(2);
				}else{
					return '';
				}
				return total;
			};
			scope.fnGetPOTotalPrice=function(purchaseOrderObject){
				if(purchaseOrderObject.materials){
					var total=0;
					for (var i = 0; i < purchaseOrderObject.materials.length; i++) {
						total=total+(purchaseOrderObject.materials[i].quantity*purchaseOrderObject.materials[i].unitPrice);
					}
					if(!isNaN(total)){
						return total.toFixed(2);
					}else{
						return '';
					}
				}
			};
			scope.fnGetLineTotal=function(purchaseOrderObject){
				var total=0;
				total=purchaseOrderObject.quantity*purchaseOrderObject.unitPrice;
				if(!isNaN(total)){
					return total.toFixed(2);
				}else{
					return '';
				}
			};
			scope.fnDetailView = function(item){
				poService.detailView=!poService.detailView;
				scope.po.poCreatedStatus=true;
				poService.selectedPO = angular.copy(item)
				scope.podetailflow = true;
			}
			scope.fnGetPurchaseOrders=function(callback){
				poService.getPOList(function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						scope.po.completePOs = angular.copy(result.data);
						scope.po.displayPOs = angular.copy(result.data);
						scope.po.displayPOs = scope.po.completePOs.slice(0, scope.selectedPages.pages);
					}
					callback();
				});
			};
			scope.fnIsKeyAvailable = function(values, searchTextKey) {
				var matchedValues = _.filter(values, function(value) {
					var patternChecking = new RegExp(searchTextKey, 'ig');
					var result = patternChecking.test(value);
					return result;
				});
				if (matchedValues.length > 0) {
					return true;
				} else {
					return false;
				}
			};
			scope.fnSearchPOs = function() {
				loaderService.start();
				scope.po.displayPOs = [];
				if (scope.po.searchText.length > 0) {
					var searchTextKeys = scope.po.searchText.split(' ');
					var allPOs = angular.copy(scope.po.completePOs);
					for (var i = 0; i < allPOs.length; i++) {
						var tempArray = [];
						var requiredKeyValues = _.pick(allPOs[i], 'poNumber', 'vendorId');
						var onlyValues = _.values(requiredKeyValues);
						for (var j = 0; j < searchTextKeys.length; j++) {
							var searchTextKeytatus = scope.fnIsKeyAvailable(onlyValues, searchTextKeys[j]);
							if (searchTextKeytatus) {
								tempArray.push(allPOs[i]);
							}
						}
						if (tempArray.length == searchTextKeys.length) {
							scope.po.displayPOs.push(allPOs[i]);
						}
					}
				}else{
					scope.po.displayPOs  = angular.copy(scope.po.completePOs);
				}
				loaderService.stop();
			};
			scope.$watch('po.searchText', function(value) {
				scope.fnSearchPOs();
			});
	
			
			scope.fnRecordsDisplayPerPage =function(number){
					scope.po.displayPOs = scope.po.completePOs.slice(0, number.pages);
			}
			scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				scope.opened = true;
			};
			scope.open1 = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				scope.opened = true;
			};
			scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};
			scope.fnSavePO=function(){
				var xmlContent = scope.buildSavePORequestXml();
					prService.createPO(xmlContent, function(result) {
						if(result.error){
							alertService.warn(result.message);
						}else{
							poService.selectedPO = result.data;
							scope.$parent.fnTogglePrOrPo('po');
							poService.detailView=true;
						}
					});
			};
			scope.fnConfirmGR=function(detailObj){
				var xmlContent=scope.getConFirmGRSoapRequest(detailObj);
				poService.confirmGR(xmlContent, function(result) {
					if(result.error){
						alertService.warn(result.message);
					}else{
						scope.confirmGr = true;
						scope.materialDocNumber = result.data;
						alertService.success('Material Doc Number : ' + scope.materialDocNumber);
						scope.$parent.fnTogglePrOrPo('po');
						poService.detailView=true;
						scope.displayConfirmGrBtn = false;
						scope.displayAccountBtn=true;
					}
				});
			};
			scope.fnConfirmAllGR=function(detailObj){
				var xmlSoapObject=scope.getConFirmAllGRSoapRequest();
				poService.confirmAllGR(xmlSoapObject, function(result) {
					if(result.error){
						alertService.warn(result.message);
					}else{
						var materialDocNumber = result.data;
						scope.$parent.fnTogglePrOrPo('po');
						poService.detailView=true;
					}
				});
			};
			scope.buildSavePORequestXml = function() {

				var poNum = angular.copy(prService.poNumber);
				var selectedPO = angular.copy(poService.selectedPO);
				var selectedList = selectedPO.materials;
				var soapXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:ZConvPrToPo><IPoheader>';
				soapXml += '<PoNumber>';
				soapXml += selectedPO.poNumber;
				soapXml += '</PoNumber>';
				soapXml += '<CompCode/><DocType/><DeleteInd/><Status/><CreatDate/><CreatedBy/><ItemIntvl/>';
				soapXml  += '<Vendor>';
				soapXml  += selectedPO.vendorId;
				soapXml  += '</Vendor>';
				soapXml  += '<Langu/><LanguIso/><Pmnttrms/><Dscnt1To/><Dscnt2To/><Dscnt3To/><DsctPct1/><DsctPct2/><PurchOrg/><PurGroup/><Currency/><CurrencyIso/><ExchRate/><ExRateFx/><DocDate/><VperStart/><VperEnd/><Warranty/><Quotation/><QuotDate/><Ref1/><SalesPers/><Telephone/><SupplVend/><Customer/><Agreement/><GrMessage/><SupplPlnt/><Incoterms1/><Incoterms2/><CollectNo/><DiffInv/><OurRef/><Logsystem/><Subitemint/><PoRelInd/><RelStatus/><VatCntry/><VatCntryIso/><ReasonCancel/><ReasonCode/><RetentionType/><RetentionPercentage/><DownpayType/><DownpayAmount/><DownpayPercent/><DownpayDuedate/><Memory/><Memorytype/><Shiptype/><Handoverloc/><Shipcond/></IPoheader><IPoitem>';
				var listlength = selectedList.length;
				for (var i = 0; i < listlength; i++) {
					soapXml  += '<item>';
					soapXml  += '<PoItem>';
					soapXml  += selectedList[i].prItemNumber;
					soapXml  += '</PoItem>';
					soapXml  += '<DeleteInd/><ShortText/>'; 
					soapXml  += '<Material>';
					soapXml  += selectedList[i].materialId;
					soapXml  += '</Material>';
					soapXml  += '<MaterialExternal/><MaterialGuid/><MaterialVersion/><Ematerial/><EmaterialExternal/><EmaterialGuid/><EmaterialVersion/>';
					soapXml  += '<Plant>';
					soapXml  += selectedList[i].plant;
					soapXml  += '</Plant>';
					soapXml  += '<StgeLoc/><Trackingno/>';
					soapXml  += '<MatlGroup>';
					soapXml  += selectedList[i].materialGroup;
					soapXml  += '</MatlGroup>';
					soapXml  += '<InfoRec/><VendMat/>';
					soapXml  += '<Quantity>';
					soapXml  += selectedList[i].quantity;
					soapXml  += '</Quantity>';
					soapXml  += '<PoUnit>';
					soapXml  += selectedList[i].uom;
					soapXml  += '</PoUnit>';
		            soapXml  += '<PoUnitIso/><OrderprUn/><OrderprUnIso/><ConvNum1/><ConvDen1/>';
		            soapXml  += '<NetPrice>';
		            soapXml  += selectedList[i].unitPrice;
					soapXml  += '</NetPrice>';
		            soapXml  += '<PriceUnit/><GrPrTime/><TaxCode/><BonGrp1/><QualInsp/><InfoUpd/><PrntPrice/><EstPrice/><Reminder1/><Reminder2/><Reminder3/><OverDlvTol/><UnlimitedDlv/><UnderDlvTol/><ValType/><NoMoreGr/><FinalInv/><ItemCat/><Acctasscat/><Distrib/><PartInv/><GrInd/><GrNonVal/><IrInd/><FreeItem/><GrBasediv/><AcknReqd/><AcknowlNo/><Agreement/><AgmtItem/><Shipping/><Customer/><CondGroup/><NoDisct/><PlanDel/><NetWeight/><Weightunit/><WeightunitIso/><Taxjurcode/><CtrlKey/><ConfCtrl/><RevLev/><Fund/><FundsCtr/><CmmtItem/><Pricedate/><PriceDate/><GrossWt/><Volume/><Volumeunit/><VolumeunitIso/><Incoterms1/><Incoterms2/><PreVendor/><VendPart/><HlItem/>';
		            soapXml  += '<GrToDate>';
		            soapXml  += scope.convertDateToYYYYMMDD(selectedList[i].deliveryDate);
					soapXml  += '</GrToDate>';
		            soapXml  += '<SuppVendor/><ScVendor/><KanbanInd/><Ers/><RPromo/><Points/><PointUnit/><PointUnitIso/><Season/><SeasonYr/><BonGrp2/><BonGrp3/><SettItem/><Minremlife/><RfqNo/><RfqItem/>';
		            soapXml  += '<PreqNo>';
		            soapXml  += selectedList[i].prNumber;
					soapXml  += '</PreqNo>';
					//soapXml  += '</PreqItem>';
					//soapXml  += selectedList[i].prItemNumber;
					//soapXml  += '</PreqItem>';
		            soapXml  += '<PreqItem/><RefDoc/><RefItem/><SiCat/><RetItem/><AtRelev/><OrderReason/><BrasNbm/><MatlUsage/><MatOrigin/><InHouse/><Indus3/><InfIndex/><UntilDate/><DelivCompl/><PartDeliv/><ShipBlocked/><PreqName/><PeriodIndExpirationDate/><IntObjNo/><PckgNo/><Batch/><Vendrbatch/><Calctype/><GrantNbr/><CmmtItemLong/><FuncAreaLong/><NoRounding/><PoPrice/><SupplStloc/><SrvBasedIv/><FundsRes/><ResItem/><OrigAccept/><AllocTbl/><AllocTblItem/><SrcStockType/><ReasonRej/><CrmSalesOrderNo/><CrmSalesOrderItemNo/><CrmRefSalesOrderNo/><CrmRefSoItemNo/><PrioUrgency/><PrioRequirement/><ReasonCode/><FundLong/><LongItemNumber/><ExternalSortNumber/><ExternalHierarchyType/><RetentionPercentage/><DownpayType/><DownpayAmount/><DownpayPercent/><DownpayDuedate/><ExtRfxNumber/><ExtRfxItem/><ExtRfxSystem/><SrmContractId/><SrmContractItm/><BudgetPeriod/><BlockReasonId/><BlockReasonText/><SpeCrmFkrel/><DateQtyFixed/><GiBasedGr/><Shiptype/><Handoverloc/><TcAutDet/><ManualTcReason/><FiscalIncentive/><FiscalIncentiveId/><TaxSubjectSt/><ReqSegment/><StkSegment/></item>';
				}	
				soapXml  += '</IPoitem></urn:ZConvPrToPo></soapenv:Body></soapenv:Envelope>';
				return soapXml;
			};

			scope.convertDateToYYYYMMDD = function(date) {
			    try {
				     if (date) {
				      var milliseconds = date.getTime();
				      var yyymmdd = commonService.getDateFromMillisecondsInRequestFormat1(milliseconds);
				      return yyymmdd;
				     } else {
				      return '';
				     }
			    } catch (e) {
			     return '';
			    }
   			};

			scope.getConFirmGRSoapRequest=function(detailObj){
				var poItemNuber ;
				try {
					if(detailObj.prItemNumber) {
					 	poItemNuber = detailObj.prItemNumber;
					 }	
				}catch(e){
					poItemNuber = ''
				}
				var confirmGRXml = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soap:Header/><soap:Body><urn:ZbapiGoodsmvtCreate><ItReturn><item></item></ItReturn>';
				confirmGRXml += '<IvLoc>';
				confirmGRXml += detailObj.storageLocation;
				confirmGRXml += '</IvLoc>';
		 		confirmGRXml += '<IvMaterial>';
		 		confirmGRXml += detailObj.materialId;
		 		confirmGRXml += '</IvMaterial>';
		 		confirmGRXml += '<IvPoitem>';
		 		confirmGRXml += poItemNuber;
		 		confirmGRXml += '</IvPoitem>';
		 		confirmGRXml += '<IvPurord>';
		 		confirmGRXml += poService.selectedPO.poNumber;
		 		confirmGRXml += '</IvPurord>';
		 		confirmGRXml += '<IvQuant>';
		 		confirmGRXml += detailObj.quantity;
		 		confirmGRXml += '</IvQuant>';
		 		confirmGRXml += '<IvUom>';
		 		confirmGRXml += detailObj.uom;
		 		confirmGRXml += '</IvUom>';
				confirmGRXml += '</urn:ZbapiGoodsmvtCreate></soap:Body></soap:Envelope>';
				return confirmGRXml;
			};

			scope.getConFirmAllGRSoapRequest=function(){
				var selectedPurOrd = poService.selectedPO;
				var confirmGRXml = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soap:Header/><soap:Body><urn:ZbapiGoodsmvtCreate><ItReturn><item></item></ItReturn>';
				confirmGRXml += '<IvLoc>';
				confirmGRXml += detailObj.storageLocation;
				confirmGRXml += '</IvLoc>';
		 		confirmGRXml += '<IvMaterial>';
		 		confirmGRXml += detailObj.materialId;
		 		confirmGRXml += '</IvMaterial>';
		 		confirmGRXml += '<IvPoitem>';
		 		confirmGRXml += detailObj.prItemNumber;
		 		confirmGRXml += '</IvPoitem>';
		 		confirmGRXml += '<IvPurord>';
		 		confirmGRXml += poService.selectedPO.poNumber;
		 		confirmGRXml += '</IvPurord>';
		 		confirmGRXml += '<IvQuant>';
		 		confirmGRXml += detailObj.quantity;
		 		confirmGRXml += '</IvQuant>';
		 		confirmGRXml += '<IvUom>';
		 		confirmGRXml += detailObj.uom;
		 		confirmGRXml += '</IvUom>';
				confirmGRXml += '</urn:ZbapiGoodsmvtCreate></soap:Body></soap:Envelope>';
				return confirmGRXml;

			};

			/*-------------------------Procurement Doc details Starting-------------*/
			 scope.fnProcurementDocumentDetailReqHeader =function(){
			 		try{
					var saveDocReqItem ='';
					saveDocReqItem += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">';
					saveDocReqItem += '<soap:Header/>';
					saveDocReqItem += '<soap:Body>';
					saveDocReqItem += '<urn:ZGetAccDocDetail>';
					if(scope.podetailflow){
						saveDocReqItem += '<IMatdoc>'+scope.srmContactId+'</IMatdoc>';
					}else{
						saveDocReqItem += '<IMatdoc>'+scope.materialDocNumber+'</IMatdoc>';
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
					alertService.warn('Sorry, Failed to Create XML');
					return null;
				}
			 };

			 scope.fnProcurementDocumentDetailReq =function(data,cb){
			 	poService.GetProcurementDocDetail(data,function(result){
					if(result.error){
						alertService.warn(result.message);
					}else{
						try{
							var tempData=result.data;       
							scope.procurement.DocDetails = angular.copy(tempData);
						}catch(e){
							alertService.warn("Sorry, unable to get Doc Details!");
						}
					}
					if(cb instanceof Function){
						cb();
					}
				});
			 };

			 scope.fnDisplayProcurementAccDetails=function(){
					loaderService.start();
					var xmlSoapObject=scope.fnProcurementDocumentDetailReqHeader();
					if(xmlSoapObject){
						scope.fnProcurementDocumentDetailReq(xmlSoapObject,function(){
							loaderService.stop();
						});
					}else{
						loaderService.stop();
					}
			 };
			 scope.fnGetDispalyObjectForConfirmGR=function(detailObj){
			 	if(!(detailObj.SrmContractId) || detailObj.SrmContractId ==''){
			 		scope.displayConfirmGrBtn = true;
			 		scope.displayAccountBtn=false;
			 	}else{
			 		scope.srmContactId = detailObj.SrmContractId;
			 		scope.displayConfirmGrBtn = false;
			 		scope.displayAccountBtn=true;
			 		if(scope.podetailflow){
			 			scope.confirmGr=true;
			 		}
			 	}
			 };

			/*-------------------------Procurement Doc details Ending-------------*/
			scope.fnInit=function(){
				scope.fnGetPurchaseOrders(function(){
					poService.selectedPO={};
					scope.po.searchText="";
				});
			};
			scope.fnInit();
}]);