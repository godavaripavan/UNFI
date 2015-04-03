'use strict';
angular.module('mrc').directive('widgetLoader', function() {
	return {
		scope:{
			 status:'='
		},
		// Restrict it to be an attribute in this case
		restrict: 'A',
		template: '<div data-ng-show="loaderStatus" align="center"><img src="images/loader.gif"/></div>',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			scope.loaderStatus=false;
			scope.$watch('status',function(value){
				if(value != undefined && value !=null){
					scope.loaderStatus=angular.copy(value);
				}else{
					scope.loaderStatus=angular.copy(false);
				}
			});
		}
	};
});