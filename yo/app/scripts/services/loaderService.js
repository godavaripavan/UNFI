'use strict';
angular.module('mrc').factory('loaderService', function($timeout) {
	var loader = function(data) {
		angular.extend(this, data);
	};
	loader.stop = function() {
		if (!angular.element('#dsuiLoaderWidget').hasClass('dsui-loaded')) {
			$timeout(function() {
				angular.element('#dsuiLoaderWidget').addClass('dsui-loaded');
			},0);
		}
	};
	loader.start = function() {
		if(angular.element('#dsuiLoaderWidget').hasClass('dsui-loaded')) {
			angular.element('#dsuiLoaderWidget').removeClass('dsui-loaded');
		}
	};
	return loader;
});