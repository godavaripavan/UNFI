'use strict';
angular.module('mrc').factory('configService', function() {
	var configuration = function(data) {
		angular.extend(this, data);
	};
	configuration.LANGUAGE = 'en_US';
	configuration.LOGGER = {
		'ENABLED': false,
		'LEVEL': 'LOG'
	};
	// configuration.IP_ADDRESS = '/';
	// configuration.CONTEXT = 'mrc-core/';
	return configuration;
});