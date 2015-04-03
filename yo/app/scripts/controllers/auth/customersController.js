'use strict';
angular.module('mrc')
	.controller('customersController', ['$scope', '$rootScope', 'urlService', 'routerService', 'svgService', 'sessionStoreService',
		function(scope, rootScope, urlService, routerService, svgService, sessionStoreService) {
			scope.customer = {
				'customerKey': 'customer'
			};
			svgService.createStackedAreaLine();
			var data = [{
				"date": "2014-7-1",
				"Gas Products": "19",
				"Valves": "13",
				"Speciality Products": "20",
				"Services": "48"
			}, {
				"date": "2014-8-1",
				"Gas Products": "18",
				"Valves": "14",
				"Speciality Products": "44",
				"Services": "24"
			}, {
				"date": "2014-10-1",
				"Gas Products": "7",
				"Valves": "18",
				"Speciality Products": "46",
				"Services": "29"
			}, {
				"date": "2014-11-1",
				"Gas Products": "20",
				"Valves": "28",
				"Speciality Products": "19",
				"Services": "33"
			}, {
				"date": "2014-12-1",
				"Gas Products": "19",
				"Valves": "12",
				"Speciality Products": "29",
				"Services": "40"
			}, {
				"date": "2014-1-1",
				"Gas Products": "20",
				"Valves": "15",
				"Speciality Products": "29",
				"Services": "36"
			}, {
				"date": "2014-2-1",
				"Gas Products": "22",
				"Valves": "17",
				"Speciality Products": "27",
				"Services": "34"
			}, {
				"date": "2014-3-1",
				"Gas Products": "19",
				"Valves": "19",
				"Speciality Products": "28",
				"Services": "34"
			}, {
				"date": "2014-4-1",
				"Gas Products": "25",
				"Valves": "24",
				"Speciality Products": "21",
				"Services": "30"
			}, {
				"date": "2014-5-1",
				"Gas Products": "20",
				"Valves": "28",
				"Speciality Products": "23",
				"Services": "29"
			}, {
				"date": "2014-6-1",
				"Gas Products": "19",
				"Valves": "19",
				"Speciality Products": "32",
				"Services": "30"
			}, ];
			svgService.createColumnBarChart(data);
			scope.fnGetCustomerData = function() {
				scope.customer.customer=angular.copy(sessionStoreService.getJSON(scope.customer.customerKey));
			};
		}
	]);