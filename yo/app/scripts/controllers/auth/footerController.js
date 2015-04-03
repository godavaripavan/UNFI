'use strict';
angular.module('mrc')
	.controller('footerController', ['$scope', '$rootScope','urlService','routerService',
		function(scope, rootScope,urlService,routerService) {
			scope.footer={};
			scope.footer.transfer = routerService.transfer;
			scope.footer.footerUrl=urlService.getView('A_FOOTER');
		}
	]);