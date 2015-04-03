'use strict';
angular.module('mrc')
	.controller('headerController', ['$scope', '$rootScope','urlService','routerService',
		function(scope, rootScope,urlService,routerService) {
			scope.header={};
			scope.header.transfer = routerService.transfer;
			scope.header.headerUrl = urlService.getView('A_HEADER');
			scope.header.selectTab='products';
			scope.fnSelectionTab = function(url) {
				switch (url) {
					case '/customers':
						scope.header.selectTab='customers';
						routerService.transfer('/customers', {});
						break;
					case '/products':
						scope.header.selectTab='products'
						routerService.transfer('/products', {});
						break;
					case '/procurement':
						scope.header.selectTab='procurement';
						routerService.transfer('/procurement', {});
						break;
					case '/delivery':
						scope.header.selectTab='delivery';
						routerService.transfer('/delivery', {});
						break;
					case '/invoice':
						scope.header.selectTab='invoice';
						routerService.transfer('/invoice', {});
						break;
				}
			};
		}
	]);