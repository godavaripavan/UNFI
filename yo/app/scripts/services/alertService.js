'use strict';
angular.module('mrc').factory('alertService', function($rootScope, commonService) {
	var alert = {};
	alert.alerts = [];
	alert.timer = null;
	alert.clearAlert = function() {
		if (alert.timer) {
			window.clearTimeout(alert.timer);
			alert.timer = null;
		}
		alert.timer = window.setTimeout(function(message) {
			alert.closeAlert();
			$rootScope.$broadcast('clearAlerts');
		}, 5000);
	};
	alert.closeAlert = function() {
		alert.alerts.splice(0, 1);
		window.clearTimeout(alert.timer);
		alert.timer = null;
	};
	alert.emptyAlert = function() {
		alert.alerts[0] = {
			'type': 'success',
			'message': 'Please try again'
		};
		alert.clearAlert();
	};
	alert.success = function(message) {
		if (!commonService.isEmptyString(message)) {
			alert.alerts[0] = {
				'type': 'success',
				'message': message
			};
			alert.clearAlert();
		} else {
			alert.emptyAlert();
		}
	};
	alert.info = function(message) {
		if (!commonService.isEmptyString(message)) {
			alert.alerts[0] = {
				'type': 'info',
				'message': message
			};
			alert.clearAlert();
		} else {
			alert.emptyAlert();
		}
	};
	alert.warn = function(message) {
		if (!commonService.isEmptyString(message)) {
			alert.alerts[0] = {
				'type': 'warning',
				'message': message
			};
			alert.clearAlert();
		} else {
			alert.emptyAlert();
		}
	};
	alert.error = function(message) {
		if (!commonService.isEmptyString(message)) {
			alert.alerts[0] = {
				'type': 'danger',
				'message': message
			};
			alert.clearAlert();
		} else {
			alert.emptyAlert();
		}
	};
	return alert;
});