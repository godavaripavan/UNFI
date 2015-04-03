'use strict';
angular.module('mrc').factory('sessionStoreService', function(alertService){
	var local = function(data) {
		angular.extend(this, data);
	};
	//window.localStorage - stores data with no expiration date
	//window.sessionStorage - stores data for one session (data is lost when the tab is closed)	
	var storage = window.sessionStorage;
	local.setJSON=function(key,value){
		if(typeof(storage) !== "undefined") {
			storage.setItem(angular.copy(key), JSON.stringify(angular.copy(value)));
		} else {
			alertService.error("WebStorage Not Accessable");
		}
	};
	local.getJSON=function(key){
		if(typeof(storage) !== "undefined") {
			var temp = storage.getItem(angular.copy(key));
			return JSON.parse(temp);
		} else {
			alertService.error("WebStorage Not Accessable");
		}
	};
	local.setString=function(key,value){
		if(typeof(storage) !== "undefined") {
			storage.setItem(angular.copy(key), angular.copy(value));
		} else {
			alertService.error("WebStorage Not Accessable");
		}
	};
	local.getString=function(key,callback){
		if(typeof(storage) !== "undefined") {
			var temp = storage.getItem(angular.copy(key));
			return temp;
		} else {
			alertService.error("WebStorage Not Accessable");
		}
	};
	local.remove=function(key,callback){
		if(typeof(storage) !== "undefined") {
			storage.removeItem(angular.copy(key));
		} else {
			alertService.error("WebStorage Not Accessable");
		}
	};
	local.clear=function(key,callback){
		if(typeof(storage) !== "undefined") {
			storage.clear();
		} else {
			alertService.error("WebStorage Not Accessable");
		}
	};
	return local;
});
