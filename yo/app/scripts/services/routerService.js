'use strict';
angular.module('mrc').factory('routerService', function($route, $location, $routeParams, cookieService, commonService,$rootScope) {
	var router = function(data) {
		angular.extend(this, data);
	};
	router.transfer = function(url, params) {
		if (router.isAuthorized(url)) {
			for (var oldParam in $routeParams) {
				$location.search(oldParam, null);
			}
			if (!_.isEmpty(params)) {
				for (var newParam in params) {
					$location.search(newParam, params[newParam]);
				}
			}
			$location.path(url);
			if(!router.toExcludeHistory(url)){
				cookieService.put('activeUrlParams', JSON.stringify(params));
				cookieService.put('activeUrl', url);
			}
		} else {
			$location.path('/denied');
		}
	};
	router.isAuthorized = function(url) {
		return true;
	};
	router.handleBackButton=function(){
		$rootScope.$watch(
			function() {
				return $location.path();
			},
			function(newValue) {
				if (newValue =='/home') { 
					router.transfer('/home',{});
				}else{
					router.transfer('/home',{}); 
				}
			},
			true
		);
	};
	router.cleanUrl=function(){
		$location.$$search={};
		$location.path('/');
	};
	router.toExcludeHistory=function(url){
		var status=false;
		switch(url){
			case '/order':status=true;
										break;
		}
		
		return status;
	};
	return router;
});