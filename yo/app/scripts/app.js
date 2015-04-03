'use strict';
angular.module('mrc',['ngCookies', 'ui.bootstrap'])
.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
		.when('/access/denied', {
			templateUrl: 'views/accessDenied.html'
		})
		.when('/access/404', {
			templateUrl: 'views/404.html'
		})
		.when('/products', {
			templateUrl: 'views/auth/catalog/products.html',
			controller: 'productController'
		}).when('/customers', {
			templateUrl: 'views/auth/catalog/customers.html',
			controller: 'customersController'
		})
		.when('/order', {
			templateUrl: 'views/auth/catalog/order.html',
			controller: 'orderController'
		})
		.when('/procurement', {
			templateUrl: 'views/auth/procurement/index.html',
			controller: 'procurementController'
		})
		.when('/delivery', {
			templateUrl: 'views/auth/delivery/index.html',
			controller: 'deliveryController'
		})
		.when('/invoice', {
			templateUrl: 'views/auth/invoice/index.html',
			controller: 'invoiceController'
		})
		.when('/', {
			redirectTo: '/products'
		})
		.otherwise({redirectTo: '/access/404'});
	}
])
.run(['routerService','loaderService','cookieService','urlService','$timeout',
	function(routerService,loaderService,cookieService,urlService,$timeout) {
		var lastAccessedUrl=cookieService.get('activeUrl');
		var lastAccessedUrlParams=cookieService.get('activeUrlParams');
		$timeout(function(){
			angular.element($('.dsui')[0]).removeAttr('style');
			angular.element($('.dsui-header')[0]).scope().fnSelectionTab(lastAccessedUrl);
		},0);
		routerService.cleanUrl();
		if(lastAccessedUrlParams){
			lastAccessedUrlParams=JSON.parse(lastAccessedUrlParams);
		}else{
			lastAccessedUrlParams={};
		}
		if(!lastAccessedUrl){
			routerService.transfer('/products',{});
		}else{
			routerService.transfer(lastAccessedUrl,lastAccessedUrlParams);
		}
		loaderService.stop();
	}
]);