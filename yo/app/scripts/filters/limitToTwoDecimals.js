'use strict';
angular.module('mrc').filter('limitToTwo', function () {
	return function (reqnum, length, end) {
		var reqnumOne = parseFloat(reqnum);
		return reqnumOne.toFixed(2)
	};
});