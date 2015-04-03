'use strict';
angular.module('mrc').factory('urlService', function(configService) {
	var url = function(data) {
		angular.extend(this, data);
	};
	url.useFixture=false;

	url.fixtures = {
		'getAllProducts':'fixtures/newProductCatalog.json',
		'top10products':'fixtures/top10Products.json',
		'customerSearchResults':'fixtures/newCustomerSearch.json',
		'last3Orders':'fixtures/newLast3Orders.json?fixture=1',
		'viewOtherBranches':'fixtures/viewOtherBranchesFixture.json',
		'createSalesOrder':'fixtures/createSalesOrder.xml',
		'getPRList':'fixtures/purchaseRequestListFixture.xml',
		'getPOList':'fixtures/purchaseOrderList.xml',
		'getAllDelivaryOrder':'fixtures/deliveryList.json',
		'getSalesOrderForDelivery':'fixtures/getSalesOrders.xml',
		'getAllDeliveriesList':'fixtures/deliveryList.xml',
		'getAllInvoiceDetails':'fixtures/invoice/Response_LW.xml',
		'getAllInvoiceDeliveries':'fixtures/invoice/Response_Delv_w.XML',
		'saveInvoice':'fixtures/invoice/saveInvoiceRes.xml',
		'GetDocDetails':'fixtures/invoice/DocDetailRes.xml',
		'createPO':'fixtures/createPO.XML',
		'saveDelivery':'fixtures/createDelivery.xml',
		'updateDelivery':'fixtures/modifyDelivery.xml',
		'saveDeliveryPGI':'fixtures/PGI.xml',
		'createDeliveryAndPGI':'fixtures/createDeliveryAndPGI.xml',
		'confirmGR':'fixtures/confirmGR.xml',
		'getPricing':'fixtures/getPricing.xml',
		'getProcurementDocDetails':'fixtures/ProcurementAccountDocDetailRes.xml'
	};
	url.partials = {
		'A_HEADER': 'views/auth/header.html',
		'A_FOOTER': 'views/auth/footer.html',
		'A_CUSTOMER_MODAL': 'views/auth/catalog/customerSelect.html',
		'A_TRANSFER_MODAL': 'views/auth/catalog/transferSelect.html',
		'A_BUYOUT_MODAL': 'views/auth/catalog/buyOutSelect.html',
		'A_VIEW_OTHER_BRANCH_MODAL': 'views/auth/catalog/viewOtherBranches.html',
		'A_EMPTY_BUYOUT_MODAL': 'views/auth/catalog/buyoutEmptySelect.html',
		'A_TOP_TEN_PRODUCTS_MODAL': 'views/auth/catalog/topTenProducts.html',
		'A_LAST_THREE_ORDERS_MODAL' : 'views/auth/catalog/lastThreeOrders.html',
		'DENIED': 'views/accessDenied.html',
		'A_PR_LIST':'views/auth/procurement/pr/list.html',
		'A_PR_DETAIL':'views/auth/procurement/pr/detail.html',
		'A_PO_LIST':'views/auth/procurement/po/list.html',
		'A_PO_DETAIL':'views/auth/procurement/po/detail.html',
		'A_DELIVERY_CREATE':'views/auth/delivery/create.html',
		'A_DELIVERY_DETAIL':'views/auth/delivery/detail.html',
		'A_DELIVERY_LIST':'views/auth/delivery/list.html',
		'A_INVOICE_CREATE':'views/auth/invoice/create.html',
		'A_INVOICE_DETAIL':'views/auth/invoice/detail.html',
		'A_INVOICE_LIST':'views/auth/invoice/list.html',
		'A_COST_AND_PRICE_ANALYSIS_MODAL':'views/auth/catalog/costAndPriceAnalysisModals.html'
	};

	url.services = {
		'getAllProducts':'wdproxy/WD7/MRC/MRC/services/material_avail.xsodata/Availability?$format=json&$select=MATNR,GROES,MATKL,MAT_MEINS,MSEHL_1,MAT_TEXT,ZZ_MAKTX,PLANT_NO,PLANT_TEXT,PLANT_TYPE,STPRS,QTY_REM',
		'top10products':'wdproxy/WD7/MRC/MRC/services/topmaterial.xsodata/TopProducts?$format=json',
		'customerSearchResults':'wdproxy/WD7/MRC/MRC/services/account_details.xsodata/AccountDetails?$format=json',
		'last3Orders':'wdproxy/WD7/MRC/MRC/services/last_sales_orders.xsodata',
		'createSalesOrder':'sapproxy/sap/bc/srt/rfc/sap/z_sales_docu_crea_1/100/z_sales_docu_crea_1/z_sales_binding',
		'getPOList':'sapproxy/sap/bc/srt/rfc/sap/z_get_pur_order_info1/100/z_get_pur_order_info1/z_get_pur_order_info1',
		'getPRList':'sapproxy/sap/bc/srt/rfc/sap/z_get_pr_info2/100/z_get_pr_info2/z_get_pr_info2',
		'getAllDeliveriesList':'sapproxy/sap/bc/srt/rfc/sap/z_get_delv_info_addl/100/z_get_delv_info_addl/z_get_delv_info_addl',
		'getAllInvoiceDetails':'sapproxy/sap/bc/srt/rfc/sap/z_get_list_invoice_3/100/z_get_list_invoice_3/z_get_list_invoice_3',
		'getAllInvoiceDeliveries':'sapproxy/sap/bc/srt/rfc/sap/z_get_delv_info1/100/z_get_delv_info1/z_get_delv_info1',
		'getSalesOrderForDelivery':'sapproxy/sap/bc/srt/rfc/sap/z_get_salesord_info_2/100/z_get_salesord_info_2/z_get_salesord_info_2',
		'saveInvoice':'sapproxy/sap/bc/srt/rfc/sap/zbapi_billingdoc_createfrmdat1/100/zbapi_billingdoc_createfrmdat1/zbapi_billingdoc_createfrmdat1',
		'GetDocDetails':'sapproxy/sap/bc/srt/rfc/sap/z_get_acc_doc_details_1/100/z_get_acc_doc_details_1/z_get_acc_doc_details_1',
		'createPO':'sapproxy/sap/bc/srt/rfc/sap/z_conv_pr_to_po/100/z_conv_pr_to_po/z_conv_pr_to_po',
		'saveDelivery':'sapproxy/sap/bc/srt/rfc/sap/zbapi_outb_delivery_create_sls/100/zbapi_outb_delivery_create_sls/zbapi_outb_delivery_create_sls',
		'updateDelivery':'sapproxy/sap/bc/srt/rfc/sap/zbapi_outb_delivery_create_sls/100/zbapi_outb_delivery_create_sls/zbapi_outb_delivery_create_sls',
		'saveDeliveryPGI':'sapproxy/sap/bc/srt/rfc/sap/zws_delivery_pgi/100/zws_delivery_pgi/zws_delivery_pgi',
		'getProcurementDocDetails':'sapproxy/sap/bc/srt/rfc/sap/z_get_acc_doc_detail2/100/z_get_acc_doc_detail2/z_get_acc_doc_detail2',
		'confirmGR':'sapproxy/sap/bc/srt/rfc/sap/zbapi_goodsmvt_create/100/zbapi_goodsmvt_create/zbapi_goodsmvt_create',
		'getPricing':'sapproxy/sap/bc/srt/rfc/sap/z_pricing_simulate1/100/z_pricing_simulate1/z_pricing_simu_bind'
	};

	url.getService = function(urlKey) {
		/*var temp = configService.IP_ADDRESS + configService.CONTEXT + url.services[urlKey];
		return angular.copy(temp);*/
		if(url.useFixture){
			return angular.copy(url.fixtures[urlKey]);
		}else{
			return angular.copy(url.services[urlKey]);	
		}
	};
	url.getView = function(partialkey) {
		return angular.copy(url.partials[partialkey]);
	};
	url.getFixture = function(fixtureKey) {
		return angular.copy(url.fixtures[fixtureKey]);
	};
	return url;
});
