'use strict';
angular.module('mrc').factory('modalBox', function($dialog){
	var modalBox = function(data){
		angular.extend(this, data);
	};
	/*modalBox.openDialog = function(templateUrl,controllerName){
		var opts={};
		opts["backdrop"]=true;
		opts["dialogFade"]=true;
		opts["backdropFade"]=true;
		opts["keyboard"]=true;
		opts["backdropClick"]=true;
		opts["templateUrl"]=templateUrl;
		opts["controller"]=controllerName;
		//opts["template"] =  htmlTemplate;		
		this.options=opts;
		var dialogBox = $dialog.dialog(opts);
			dialogBox.open();
	};
	modalBox.close=function(){
		$dialog.dialog(options).close();
		this.options={};
	};*/
	modalBox.actionTemplate=function(){
		var requiredAction = {"result":null, "label": null, "cssClass": "btn-primary"};
		var templateAction={};
		angular.copy(requiredAction,templateAction);
		return templateAction;
	};
	modalBox.openMessageBox = function(titleText,messageBoxText,actions){
		$dialog.messageBox(titleText, messageBoxText, actions)
			.open()
			.then(function(result){
				if(result instanceof Function){
					result.call();
				}
		});
	};
	return modalBox ;
});
