'use strict';
angular.module('mrc').directive('autofillSync', [ function(){
	var link = function(scope, element, attrs, ngFormCtrl){
		element.on('submit', function(event){
			element.find('input').each(function(index, input){
				angular.element(input).trigger('change');
			});
			element.find('select').each(function(index, select){
				angular.element(select).trigger('change');
			});
			element.find('textarea').each(function(index, textarea){
				angular.element(textarea).trigger('change');
			});
		}); 
	};  
	return {
		/* negative priority to make this post link function run first */
		priority:-1,
		link: link,
		require: 'form'
	};  
}])