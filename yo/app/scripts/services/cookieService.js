'use strict';
angular.module('mrc').factory('cookieService', function($cookieStore) {
	var cookie = function(data) {
		angular.extend(this, data);
	};
	cookie.put=function(cookieName,cookieValue){
		$cookieStore.put(cookieName, cookieValue);
	};
	cookie.get=function(cookieName){
		return $cookieStore.get(cookieName);
	};
	cookie.remove=function(cookieName){
		$cookieStore.remove(cookieName);
	};
	return cookie;
});