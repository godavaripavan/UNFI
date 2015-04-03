'use strict';
angular.module('mrc').factory('applicationService', function(logService,xhrService,urlService,languageService) {
	var application = function(data) {
		angular.extend(this, data);
	};
	application.safeApply = function(scopeObject) {
		try{
			logService.log('Before applying $apply');
			if(!scopeObject.$$phase) {
				logService.log('$apply not in progress');
				scopeObject.$apply();
				logService.log('$apply applied');
			}else{
				logService.log('$apply already in progress');
			}
		}catch(e){}
	};
	return application;
});