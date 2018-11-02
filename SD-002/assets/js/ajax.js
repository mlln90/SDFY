/* 2017-07-12 15:51:05 */
;
// 路径集合 
var HTTP_PATH = '/api';
var AJAX_URL = {
	
}

var AJAX = (function() {

	
	var ajax = function (_param, _callback, _callback2, _type, _url, _dataType, _paramPath) {

		//若dataType未定义或者为null，则默认值为json;
		if(typeof _dataType == 'undefined' || _dataType == null) {
			_dataType = 'json';
		}
		//若_paramPath未定义或者为null，则默认去AJAX_URL定义的json中寻找对应的地址；若定义了则使用AJAX_URL中的地址加上本身
		if(typeof _paramPath == 'undefined' || _paramPath == null){
			_url = HTTP_PATH + AJAX_URL[_url];
		}else{
			_url = HTTP_PATH + AJAX_URL[_url] + _paramPath;
		}

		//定义一个布尔类型_processData
		var _processData = true;
		var _contentType = 'application/x-www-form-urlencoded';
		//如果参数_type（转为大写）为PUT或者为POST，那么将_processData置为false,并且改变内容类型。
		if(_type.toUpperCase() == 'PUT' || _type.toUpperCase() == 'POST'){
			_processData = false;
			_contentType = 'application/json; charset=UTF-8';
		}

		$.ajax({
			type 	: _type,
			url  	: _url,
			data 	: _param,
			dataType: _dataType,
			processData: _processData,
			contentType: _contentType,
			success	: function(ret, status, xhr) {
				//返回的数据不为空的时候；
				if(ret != null){
					//返回的数据是字符串的话，将其转化为对象
					if(typeof ret.d == 'string'){
						var data = JSON.parse(ret.d);
						if(typeof data == 'object'){
							
							if (data.ResultCode != undefined && data.ResultCode == 0) { //表示成功
								_callback(data, status, xhr);
							} else {
								//如果回调函数2存在的话，调用回调函数2；
								if(typeof _callback2 === 'function') {
									_callback2(data, status, xhr);
								}
							}
						}
					}
				}else{
					// console.info('error');
				}
			},
			error: function (ret, status, error) {
				// console.info(ret);
			}
		});
	}

	return {
		Admin: Admin,
	};
})()

