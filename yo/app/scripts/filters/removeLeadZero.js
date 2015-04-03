'use strict';
angular.module('mrc').filter('truncateZeroes', function () {
	return function (value, length, end) {
		if(value){
			 while (value.substr(0,1) == '0' && value.length>1) { value = value.substr(1,9999); }
				return value;
		}else{
			return value;
		}
	};
});