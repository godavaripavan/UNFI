'use strict';
angular.module('mrc').controller('alertController',['$scope','alertService','applicationService',
	function(scope,alertService,applicationService){
	scope.alerts={};
	scope.alerts.messages=alertService.alerts;
	scope.alerts.closeAlert=alertService.closeAlert;
	scope.$on('clearAlerts',function(){
		applicationService.safeApply(scope);
	});	
}]);