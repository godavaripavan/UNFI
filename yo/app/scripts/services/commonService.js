'use strict';
angular.module('mrc').factory('commonService', function(xhrService,urlService) {
	var common = function(data) {
		angular.extend(this, data);
	};
	common.searchArray = function(someArray, target) {
		var status = false;
		for (var i = 0; i < someArray.length; i++) {
			if (someArray[i] === target) {
				status = true;
				break;
			}
		}
		return status;
	};
	common.searchElement = function(someArray, target) {
		
		var status = false;
		for (var i = 0; i < someArray.length; i++) {
			if (someArray[i].productId === target) {
				status = true;
				break;
			}
		}
		return status;
	};
	common.removeElementFromArray = function(someArray, target) {
		var temp = [];
		for (var i = 0; i < someArray.length; i++) {
			if (someArray[i] !== target) {
				temp.push(someArray[i]);
			}
		}
		return temp;
	};
	common.trimArray = function(data) {
		var temp = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i] !== '' && data[i] !== null && data[i] !== undefined) {
				temp.push(data[i]);
			}
		}
		return temp;
	};
	common.getNonEmptyString = function(someData) {
		if (common.isEmptyString(someData)) {
			someData = '';
		}
		return someData;
	};
	common.isEmptyString = function(someString) {
		if (angular.isString(someString) && someString.length === 0) {
			return true;
		} else {
			return false;
		}
	};
	common.isEmptyArray = function(someArray) {
		if (angular.isArray(someArray) && someArray.length > 0) {
			return false;
		} else {
			return true;
		}
	};
	common.isEmptyJson = function(someJson) {
		if (angular.isObject(someJson) && Object.keys(someJson).length > 0) {
			return false;
		} else {
			return true;
		}
	};
	common.getDateFromMilliseconds = function(milliseconds) {
		try {
			if (angular.isNumber(milliseconds)) {
				var dateObject = new Date(milliseconds);
				var dateString = (dateObject.getMonth() + 1) + '/' + (dateObject.getDate()) + '/' + (dateObject.getYear() + 1900);
				return dateString;
			} else {
				return '';
			}
		} catch (e) {
			return '';
		}
	};
	common.getDateFromMillisecondsInFullFormat = function(milliseconds) {
		try {
			if (angular.isNumber(milliseconds)) {
				var dateObject = new Date(milliseconds);
				var month = dateObject.getMonth() + 1;
				if(parseInt(month) <10 ){
					month = '0'+month;
				}else{
					month = month;
				};
				var date = dateObject.getDate();
				if(parseInt(date) <10){
					date = '0'+date;
				}else{
					date = date;
				};
				var year = dateObject.getYear() + 1900;
				var dateString = month +'/'+date +'/'+year;
				//var dateString = (dateObject.getMonth() + 1) + '/' + (dateObject.getDate()) + '/' + (dateObject.getYear() + 1900);
				return dateString;
			} else {
				return '';
			}
		} catch (e) {
			return '';
		}
	};
	common.getDateFromMillisecondsInRequestFormat1 = function(milliseconds) {
		try {
			if (angular.isNumber(milliseconds)) {
				var dateObject = new Date(milliseconds);
				var tempMonth=dateObject.getMonth() + 1;
				var tempDay=dateObject.getDate();
				if(tempMonth<10){
					tempMonth = '0'+tempMonth;
				}
				if(tempDay<10){
					tempDay = '0'+tempDay;
				}
				var dateString =  (dateObject.getYear() + 1900) +'-'+tempMonth+ '-' + tempDay;
				return dateString;
			} else {
				return '';
			}
		} catch (e) {
			return '';
		}
	};
	common.getDateFromMillisecondsInRequestFormat2 = function(milliseconds) {
		try {
			if (angular.isNumber(milliseconds)) {
				var dateObject = new Date(milliseconds);
				var dateString =  (dateObject.getYear() + 1900) +'-'+(dateObject.getDate()) + '-' + (dateObject.getMonth() + 1);
				return dateString;
			} else {
				return '';
			}
		} catch (e) {
			return '';
		}
	};
	common.getMilliSecondsFromDate = function(dateString) {
		try {
			if (!this.isEmptyString(dateString)) {
				return new Date(dateString).getTime();
			} else {
				return '';
			}
		} catch (e) {
			return '';
		}
	};
	common.jsonImages = function(files, cb) {
		var fileAttachments = [];
		for (var i = 0; i<files.length; i++) {			
			var imageReader = new FileReader();
			imageReader.onload = (function(aFile, lastFileIndex, currentFileIndex) {
				return function(e) {
					var tempFileData = e.target.result;
					var dataContent = tempFileData.split(',');
					fileAttachments.push({
						'imageName': aFile.name,
						'mimeType': dataContent[0].split(':')[1].split(';')[0],
						'encodedString': dataContent[1]
					});
					if (lastFileIndex === currentFileIndex) {
						cb(fileAttachments);
					}
				};
			})(files[i], files.length - 1, i);
			imageReader.readAsDataURL(files[i]);
		}
	};
	common.removeDuplicatesIn1DArray = function(someArray) {
		var tempArray = new Array();
		someArray = common.trimArray(someArray);
		for (var i = 0; i < someArray.length; i++) {
			if (!common.searchArray(tempArray, someArray[i])) {
				tempArray.push(someArray[i]);
			}
		}
		return tempArray;
	};
	common.getJsonFromQuery=function(query){
		var allPairs=query.split('&');
		var temp={};
		for (var i = 0; i < allPairs.length; i++) {
			var pair=allPairs[i].split('=');
			temp[pair[0]]=pair[1];
		}
		return angular.copy(temp);
	};
	common.convertXmlToJson=function(xmlData){
		var x2js = new X2JS();
		var jsonObj = x2js.xml_str2json( xmlData );
		return jsonObj;
	};
	common.convertJsonToXml=function(jsonObj){
		var x2js = new X2JS();
		var xmlData = x2js.json2xml_str( jsonObj );
		return xmlData;
	};
	
	common.get20DaysOldDate=function(){
		var days = 20*24*60*60*1000;
		var dt = new Date();
		var dt20old = dt.getTime()-days;
		var olddt = new Date(dt20old);
		var day = olddt.getDate();
		var month = olddt.getMonth() ;
		var year = olddt.getFullYear();
		//var yyymmdd = year+'-'+month+'-'+day;
		var yyymmdd = common.getDateFromMillisecondsInRequestFormat1(olddt.getTime());
		return yyymmdd;
	};
	return common;
});