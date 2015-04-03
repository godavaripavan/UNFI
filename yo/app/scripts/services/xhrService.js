'use strict';
angular.module('mrc').factory('xhrService', function($http,logService){
	var xhr = function(data){
		angular.extend(this, data);
	};
	xhr.getTime=function(url){
		var link=angular.copy(url);
		if(link.indexOf('?')!=-1){
			link = link+ '&time=' + new Date().getTime();
		}else{
			link=link+ '?time=' + new Date().getTime();
		}
		return link;
	};
	xhr.doPost = function(url, data, headers, successcb, errorcb){
		$http({'method': 'POST', 'url': url, 'data':data,'headers':headers, 'withCredentials':true})
			.success(function(result, status, headers, config) {
				logService.info('------------------------------------------------');
				logService.info('Received Post Data : ');
				logService.info(result);
				logService.info('------------------------------------------------');
				if(status == 200){
					successcb(result);
				}else{
					errorcb(result);
				}
			})
			.error(function(result, status, headers, config){
				logService.info('------------------------------------------------');
				logService.info('Received Post Data : ');
				logService.info(result);
				logService.info('------------------------------------------------');
				errorcb(result);
			});
	};
	xhr.doGet = function(url, data, headers, successcb, errorcb){
		$http({'method': 'GET', 'url': xhr.getTime(url), 'data':data,'headers':headers, 'withCredentials':true})
			.success(function(result, status, headers, config) {
				logService.info('------------------------------------------------');
				logService.info('Received Get Data : ');
				logService.info(result);
				logService.info('------------------------------------------------');
				if(status == 200){
					successcb(result);
				}else{
					errorcb(result);
				}
			})
			.error(function(result, status, headers, config) {
				logService.info('------------------------------------------------');
				logService.info('Received Get Data : ');
				logService.info(result);
				logService.info('------------------------------------------------');
				errorcb(result);
			});
	};
	xhr.doDelete = function(url, data, headers, successcb, errorcb){
		$http({'method': 'DELETE', 'url': xhr.getTime(url), 'data':data,'headers':headers})
			.success(function(result, status, headers, config) {
				logService.info('------------------------------------------------');
				logService.info('Received Delete Data : ');
				logService.info(result);
				logService.info('------------------------------------------------');
				if(status == 200){
					successcb(result);
				}else{
					errorcb(result);
				}
			})
			.error(function(result, status, headers, config) {
				logService.info('------------------------------------------------');
				logService.info('Received Delete Data : ');
				logService.info(result);
				logService.info('------------------------------------------------');
				errorcb(result);
			});
	};
	return xhr;
});