'use strict';
angular.module('mrc').factory('languageService', function(configService) {
	var language = function(data) {
		angular.extend(this, data);
	};
	language.en_US = {
		'MESSAGES': {
			'FAILED_GET_PRODUCTS':'Sorry, failed to get products',
			'FAILED_TOPTENPRODUCTS':'Sorry, failed to get top ten products',
			'FAILED_TOPTHREEORDERS':'Sorry, failed to get top three orders',
			'FAILED_GET_CUSTOMERS':'Sorry, failed to get customers',
			'FAILED_CREATE_ORDER':'Sorry, failed to save sales order',
			'FAILED_GET_PR_LIST':'Sorry, failed to get the pr list',
			'FAILED_GET_PO_LIST':'Sorry, failed to get the po list',
			'FAILED_GET_ALL_INVOICE_LIST':'Sorry, failed to get the invoice list',
			'FAILED_GET_ALL_INVOICE_DELIVERIES':'Sorry, failed to get the invoice deliveries',
			'FAILED_GET_ALL_DELIVERIES':'Sorry, failed to get the deliveries list',
			'FAILED_SAVE_INVOICE':'Sorry, failed to save the invoice',
			'FAILED_GET_PRICING':'Sorry, failed to get the pricing',
			'FAILED_GET_DOCDETAIL':'Sorry , failed to get document details',
			'FAILED_GET_SALES_ORDERS':'Sorry, failed to get sales orders',
			'FAILED_SAVE_DELIVERY':'Sorry, failed to save the delivery',
			'FAILED_UPDATE_DELIVERY':'Sorry, failed to update the delivery',
			'FAILED_CREATE_PO':'Sorry, failed to save purchase order',
			'FAILED_CONFIRM_GR':'Sorry, failed to confirm gr'
		},
		'CONSTANTS':{
			'EMPTY_STRING':'',
			'STOCK':'stock',
			'TRANSFER':'crossdock',
			'BUYOUT':'buyout'
		},
		'BUNDLE':{}
	};
	return language[configService.LANGUAGE];
});