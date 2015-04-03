'use strict';
angular.module('mrc')
	.controller('purchaseRequestController', ['$scope', '$rootScope', '$filter', 'prService','loaderService','poService','alertService',
		function(scope, rootScope, $filter, prService,loaderService,poService,alertService) {
			scope.pr = {'searchText':'','displayPRs':[]};
			scope.pr.formats = ['MM/dd/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			scope.pr.format = scope.pr.formats[0];
			scope.pr.pageSizes = [{
				'id': 1,
				'pages': 20
			}, {
				'id': 2,
				'pages': 50
			}, {
				'id': 3,
				'pages': 100
			}, {
				'id': 4,
				'pages': 200
			}];

			scope.fnCalQuentity =function(a){
				if(a){
					var	b = parseInt(a);		
				}
			return b;
			};
			
			scope.pr.selectedPageSize = scope.pr.pageSizes[0];

			scope.fnIsDetailView = function() {
				return prService.detailView;
			};

			scope.fnToogleDetailView = function() {
				scope.fnGetPurchaseRequests(function() {
					prService.selectedPRList = [];
					prService.detailView = !prService.detailView;
				});
			};
			scope.fnGetPurchaseRequests = function(callback) {
				prService.getPRList(function(result) {
					if (result.error) {
						alertService.warn(result.message);
					} else {
						scope.pr.completePRs = angular.copy(result.data);
						scope.pr.displayPRs = angular.copy(result.data);
						scope.pr.displayPRs = scope.pr.completePRs.slice(0, scope.pr.selectedPageSize.pages);
					}
					callback();
				});
			};
			scope.fnRemoveFromSelectedList = function(purchaseRequestObject) {
				var tempArray = [];
				for (var i = 0; i < prService.selectedPRList.length; i++) {
					if (purchaseRequestObject.prNumber+''+purchaseRequestObject.materialId !== prService.selectedPRList[i].prNumber+''+prService.selectedPRList[i].materialId) {
						tempArray.push(prService.selectedPRList[i]);
					}
				}
				prService.selectedPRList = angular.copy(tempArray);
			};
			scope.fnAddToSelectedList = function(purchaseRequestObject) {
				if (purchaseRequestObject.isChecked) {
					prService.selectedPRList.push(purchaseRequestObject);
				} else {
					scope.fnRemoveFromSelectedList(purchaseRequestObject);
				}
			};
			scope.fnHandleChangeOfVendor = function(purchaseRequestObject) {
				if (purchaseRequestObject.isChecked) {
					scope.fnRemoveFromSelectedList(purchaseRequestObject);
					prService.selectedPRList.push(purchaseRequestObject);
				}
			};
			scope.fnGetSelectedPRList = function() {
				return prService.selectedPRList;
			};
			scope.fnGetVendorId = function() {
				if (prService.selectedPRList.length > 0) {
					return prService.selectedPRList[0].vendorId;
				} else {
					return '';
				}
			};
			scope.fnGetVendorName = function() {
				var temp = "";
				if (prService.selectedPRList.length > 0) {
					for (var i = 0; i < prService.selectedPRList[0].vendors.length; i++) {
						if (prService.selectedPRList[0].vendors[i].vendorId == prService.selectedPRList[0].vendorId) {
							temp = prService.selectedPRList[0].vendors[i].vendorName;
						}
					}
				}
				return temp;
			};
			scope.fnGetTotalPrice = function(purchaseRequestObject) {
				var total = purchaseRequestObject.quantity * purchaseRequestObject.unitPrice;
				if (!isNaN(total)) {
					total = total.toFixed(2);
				} else {
					total = "";
				}
				return total;
			};
			scope.fnGetPOTotalPrice = function() {
				var total = 0;
				if (prService.selectedPRList.length > 0) {
					for (var i = 0; i < prService.selectedPRList.length; i++) {
						total = total + (prService.selectedPRList[i].quantity * prService.selectedPRList[i].unitPrice);
					}
				}
				if (!isNaN(total)) {
					total = total.toFixed(2);
				} else {
					total = 0;
				}
				return total;
			};
			scope.fnRemoveFromDetailedList = function(index) {
				prService.selectedPRList.splice(index, 1);
				if (prService.selectedPRList.length == 0) {
					scope.fnToogleDetailView();
				}
			};
			scope.fnCreatePoForPr = function() {
				var xmlContent = scope.buildCreatePORequestXml();
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
			scope.buildCreatePORequestXml = function() {

				var selectedList = angular.copy(prService.selectedPRList);
				var soapXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:ZConvPrToPo><IPoheader><PoNumber/><CompCode/><DocType/><DeleteInd/><Status/><CreatDate/><CreatedBy/><ItemIntvl/>';
				soapXml  += '<Vendor>';
				soapXml  += selectedList[0].vendorId;
				soapXml  += '</Vendor>';
				soapXml  += '<Langu/><LanguIso/><Pmnttrms/><Dscnt1To/><Dscnt2To/><Dscnt3To/><DsctPct1/><DsctPct2/><PurchOrg/><PurGroup/><Currency/><CurrencyIso/><ExchRate/><ExRateFx/><DocDate/><VperStart/><VperEnd/><Warranty/><Quotation/><QuotDate/><Ref1/><SalesPers/><Telephone/><SupplVend/><Customer/><Agreement/><GrMessage/><SupplPlnt/><Incoterms1/><Incoterms2/><CollectNo/><DiffInv/><OurRef/><Logsystem/><Subitemint/><PoRelInd/><RelStatus/><VatCntry/><VatCntryIso/><ReasonCancel/><ReasonCode/><RetentionType/><RetentionPercentage/><DownpayType/><DownpayAmount/><DownpayPercent/><DownpayDuedate/><Memory/><Memorytype/><Shiptype/><Handoverloc/><Shipcond/></IPoheader><IPoitem>';
				var listlength = selectedList.length;
				for (var i = 0; i < listlength; i++) {
					soapXml  += '<item><PoItem/><DeleteInd/><ShortText/>'; 
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
		            soapXml  += selectedList[i].deliveryDate;
					soapXml  += '</GrToDate>';
		            soapXml  += '<SuppVendor/><ScVendor/><KanbanInd/><Ers/><RPromo/><Points/><PointUnit/><PointUnitIso/><Season/><SeasonYr/><BonGrp2/><BonGrp3/><SettItem/><Minremlife/><RfqNo/><RfqItem/>';
		            soapXml  += '<PreqNo>';
		            soapXml  += selectedList[i].prNumber;
					soapXml  += '</PreqNo>';
					soapXml  += '<PreqItem>';
					soapXml  += '0000'+((1+i)*10);
					soapXml  += '</PreqItem>';
		            soapXml  += '<RefDoc/><RefItem/><SiCat/><RetItem/><AtRelev/><OrderReason/><BrasNbm/><MatlUsage/><MatOrigin/><InHouse/><Indus3/><InfIndex/><UntilDate/><DelivCompl/><PartDeliv/><ShipBlocked/><PreqName/><PeriodIndExpirationDate/><IntObjNo/><PckgNo/><Batch/><Vendrbatch/><Calctype/><GrantNbr/><CmmtItemLong/><FuncAreaLong/><NoRounding/><PoPrice/><SupplStloc/><SrvBasedIv/><FundsRes/><ResItem/><OrigAccept/><AllocTbl/><AllocTblItem/><SrcStockType/><ReasonRej/><CrmSalesOrderNo/><CrmSalesOrderItemNo/><CrmRefSalesOrderNo/><CrmRefSoItemNo/><PrioUrgency/><PrioRequirement/><ReasonCode/><FundLong/><LongItemNumber/><ExternalSortNumber/><ExternalHierarchyType/><RetentionPercentage/><DownpayType/><DownpayAmount/><DownpayPercent/><DownpayDuedate/><ExtRfxNumber/><ExtRfxItem/><ExtRfxSystem/><SrmContractId/><SrmContractItm/><BudgetPeriod/><BlockReasonId/><BlockReasonText/><SpeCrmFkrel/><DateQtyFixed/><GiBasedGr/><Shiptype/><Handoverloc/><TcAutDet/><ManualTcReason/><FiscalIncentive/><FiscalIncentiveId/><TaxSubjectSt/><ReqSegment/><StkSegment/></item>';
				}	
				soapXml  += '</IPoitem></urn:ZConvPrToPo></soapenv:Body></soapenv:Envelope>';
				return soapXml;
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
			scope.fnSearchPRs = function() {
				loaderService.start();
				scope.pr.displayPRs = [];
				if (scope.pr.searchText.length > 0) {
					var searchTextKeys = scope.pr.searchText.split(' ');
					var allPRs = angular.copy(scope.pr.completePRs);
					for (var i = 0; i < allPRs.length; i++) {
						var tempArray = [];
						var requiredKeyValues = _.pick(allPRs[i], 'prNumber', 'materialId');
						var onlyValues = _.values(requiredKeyValues);
						for (var j = 0; j < searchTextKeys.length; j++) {
							var searchTextKeytatus = scope.fnIsKeyAvailable(onlyValues, searchTextKeys[j]);
							if (searchTextKeytatus) {
								tempArray.push(allPRs[i]);
							}
						}
						if (tempArray.length == searchTextKeys.length) {
							scope.pr.displayPRs.push(allPRs[i]);
						}
					}
				}else{
					scope.pr.displayPRs  = angular.copy(scope.pr.completePRs);
				}
				loaderService.stop();
			};
			scope.$watch('pr.searchText', function(value) {
				scope.fnSearchPRs();
			});
			scope.fnRecordsDisplayPerPage =function(number){			
			scope.pr.displayPRs = scope.pr.completePRs.slice(0, number.pages);
			}
			scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				scope.opened = true;
			};
			scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};
			scope.fnInit = function() {
				scope.fnGetPurchaseRequests(function() {});
			};
			scope.fnInit();
		}
	]);