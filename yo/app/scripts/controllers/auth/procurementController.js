'use strict';
angular.module('mrc')
	.controller('procurementController', ['$scope', '$rootScope', 'urlService','poService','prService','alertService','commonService',
		function(scope, rootScope, urlService,poService,prService,alertService,commonService) {
			scope.procurement={'page':'pr','pages':{},'po':{}};
			scope.procurement.pages.prList=urlService.getView('A_PR_LIST');
			scope.procurement.pages.prDetail=urlService.getView('A_PR_DETAIL');
			scope.procurement.pages.poList=urlService.getView('A_PO_LIST');
			scope.procurement.pages.poDetail=urlService.getView('A_PO_DETAIL');
			scope.procurement.po.orderTypes=[
				{ id: 1, type: 'All (Stock/DC/BO)' },
				{ id: 2, type: 'Stock' },
				{ id: 3, type: 'DC' },
				{ id: 4, type: 'BO' }
			];
			scope.procurement.po.selectedOrderType = scope.procurement.po.orderTypes[0];
			scope.fnOrdersChange = function(type){
				console.log("orderType",type);
			};
			scope.fnTogglePrOrPo=function(view){
				scope.procurement.page=view;
				poService.detailView=false;
				prService.detailView=false;
			};
			scope.fnIsDetailPage=function(){
				var temp=false;
				if(poService.detailView){
					temp=true;
				}else if(prService.detailView){
					temp=true;
				}
				return temp;
			};
			scope.fnConvertToPO=function(){
				var status=0;
				var tempIds=[];
				for(var i=0;i<prService.selectedPRList.length;i++){
					if(!prService.selectedPRList[i].vendorId){
						status=2;
						break;	
					}
					if(i>0 && !commonService.searchArray(tempIds,prService.selectedPRList[i].vendorId)){
						status=1;
						break;
					}else{
						tempIds.push(prService.selectedPRList[i].vendorId);
					}
				}
				if(prService.selectedPRList.length==0){
					alertService.warn('Selected any PR !');
				}else{
					if(status==0){
						prService.detailView=!prService.detailView;
					}else if(status==1){
						alertService.warn('Selected PR\'s are not of same vendor');
					}else if(status==2){
						alertService.warn('Select the Vendor properly please!');
					}
				}
			};
}]);