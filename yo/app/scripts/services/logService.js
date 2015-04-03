'use strict';
angular.module('mrc').factory('logService', function($log,configService){
	var logger = function(data){
		angular.extend(this, data);
	};
	var LEVELS={'LOG':1,'INFO':2,'WARN':3,'ERROR':4};
	/* Priority 4 i.e ERROR*/
	logger.error = function(){
		if(configService.LOGGER.ENABLED){
			if(LEVELS[configService.LOGGER.LEVEL]<=4){
				for(var key in arguments){$log.error(arguments[key]);}
			}
		}
	};
	/* Priority 3 i.e WARN*/
	logger.warn = function(message){
		if(configService.LOGGER.ENABLED){
			if(LEVELS[configService.LOGGER.LEVEL]<=3){
				for(var key in arguments){$log.warn(arguments[key]);}
			}
		}
	};
	/* Priority 2 i.e INFO*/
	logger.info = function(message){
		if(configService.LOGGER.ENABLED){
			if(LEVELS[configService.LOGGER.LEVEL]<=2){
				for(var key in arguments){$log.info(arguments[key]);}
			}
		}
	};
	/* Priority 1 i.e LOG*/
	logger.log = function(message){
		if(configService.LOGGER.ENABLED){
			if(LEVELS[configService.LOGGER.LEVEL]<=1){
				for(var key in arguments){$log.log(arguments[key]);}
			}
		}
	};
	return logger;
});