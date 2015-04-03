'use strict';
angular.module('mrc').filter('truncate', function () {
	return function (text, length, end) {
		if(text){
			if(text.length <= length ) {// || text.length - end.length <= length
				return text;
			}else{
				return String(text).substring(0, length) + end;
			}
		}
	};
});