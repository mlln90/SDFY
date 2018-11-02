/* 2017-06-03 09:03:32 */
;
// JQ扩展
(function($) {
	var printAreaCount = 0, PopTimer;
    $.fn.extend({

        // 选择当前元素，取消所有同级选中
        changeActive: function() {
        	$(this).addClass('active')
        		.siblings().removeClass('active');
        },

        // 打印
        printArea: function () {  
	        var ele = $(this);  
	        var idPrefix = 'printArea_';
	        $('iframe#' + idPrefix + printAreaCount).remove();  
	        printAreaCount++;  
	        var iframeId = idPrefix + printAreaCount;  
	        var iframeStyle = 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;';  
	        iframe = document.createElement('IFRAME');  
	        $(iframe).attr({  
	            style: iframeStyle,  
	            id: iframeId  
	        });  
	        document.body.appendChild(iframe);  
	        var doc = iframe.contentWindow.document;  
	        $(document).find('link').filter(function () {  
	            return $(this).attr('rel').toLowerCase() == 'stylesheet';  
	        }).each(function() {  
                doc.write('<link type="text/css" rel="stylesheet" href="'  
                        + $(this).attr('href') + '" >');  
            });  
	        doc.write('<div class="' + $(ele).attr('class') + '">' + $(ele).html()  
	                + '</div>');  
	        doc.close();  
	        var frameWindow = iframe.contentWindow;  
	        frameWindow.close();  
	        frameWindow.focus();  
	        frameWindow.print();  
	    }  
    });

    $.extend({
    	/**
		 * 去掉字符串的头空格（左空格）
		 * @param _str 字符串
		 */
		triml: function(_str) {
		    var i;
		    for (i = 0; i < _str.length; i++) {
		        if (_str.charAt(i) != ' ') break;
		    }
		    var str = _str.substring(i, _str.length);
		    return str;
		},

		/**
		 * 去掉字符串的尾空格（右空格）
		 * @param _str 字符串
		 */
		trimr: function(_str) {
		   var i;
		    for (i = _str.length - 1; i >= 0; i--) {
		        if (_str.charAt(i) != ' ') break;
		    }
		    var str = _str.substring(0, i + 1);
		    return str;
		},

		/**
		 * 去掉字符串的头尾空格
		 * @param _str 字符串
		 */
		trims: function(_str) {
		    return $.triml($.trimr(_str));
		},

		/**
		 * 验证电话号码
		 * @param _tel 号码
		 */
		checkTel: function(_tel) {
		    var mobile = /^\d{11}$/;
		    var phone = /^0\d{2,3}-?\d{7,8}$/;
		    return mobile.test(_tel) || phone.test(_tel);
		},

		/*
		 * 验证邮箱
		 * @param _eml 邮箱地址
		 */
		checkEmail: function(_eml) {
		    var reg = reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		    return reg.test(_eml);
		},

		/*
		 * 检验是否为非负整数
		 * @param _num 数值
		 */
		checkInteger: function(_num) {
			var reg = /^([1-9]\d*|[0]{1,1})$/;
			return reg.test(_num);
		},

		/*
		 * 判断值是否存在，否则返回空字符串
		 * @param _val 传入的值
		 */
		CheckUndefined: function(_val) {
			if (_val == undefined) {
				return '';
			} else {
				return _val;
			}
		},

		/*
		 * 检测是否为 数字、26个英文字母或者下划线组成
		 * @param _str 字符串
		 */
		checkNHZ: function(_str) {
			var reg = /^\w+$/;
			return reg.test(_str);
		},

		// 生成唯一标识符
		Guid: function() {
		    // 生成4个随机的十六进制数字。 
		    function S4() {
		        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		    };
		    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()).toUpperCase();
		},

		/*
		 * 解析扩展名
		 * @param _fname 文件名
		 */
		getExtensionName: function(_fname) {
		    var pos = _fname.lastIndexOf('.')
		    var suffix = ''
		    if (pos != -1) {
		        suffix = _fname.substring(pos);
		    }
		    return suffix;
		},

		/*
		 * 检测文件类型是否为图片
		 * @param _fname 文件扩展名
		 */
		checkImg: function(_fname) {
		    if(_fname != '.PNG' && _fname !='.JPG' && _fname != '.JPEG') {
		        return false;
		    }
		    return true;
		},

		/**
		 * 将时间戳转为14位或读日期时间串
		 * @param timestamp 时间戳
		 * @param sign 分割符
		 */
		formatDate: function(timestamp, sign) {
		    if (timestamp == undefined || timestamp == '') return '-';
		    var time = new Date(timestamp);
		    var year = time.getFullYear();
		    var month = (time.getMonth() + 1) > 9 && (time.getMonth() + 1) || ('0' + (time.getMonth() + 1));
		    var date = time.getDate() > 9 && time.getDate() || ('0' + time.getDate());
		    var hour = time.getHours() > 9 && time.getHours() || ('0' + time.getHours());
		    var minute = time.getMinutes() > 9 && time.getMinutes() || ('0' + time.getMinutes());
		    var second = time.getSeconds() > 9 && time.getSeconds() || ('0' + time.getSeconds());
		    if (sign != undefined) {
		        return year + sign + month + sign + date + ' ' + hour + ':' + minute + ':' + second;
		    } else {
		        return YmdHis = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
		    }
		},

		/*
		 * 导出表头
		 * @param ele 表头元素
		 * @param _data 表头数据
		 */
		initTableHead: function(ele, _data) {
			$(ele).empty();
			$.each(_data, function(n, val) {
				if (val.sortable) {
		            sortable = ' data-sortable="true"';
		        } else {
		            sortable = '';   
		        }
				var th = '<th data-field="' 
					+ val.field + '" data-align="center" '
					+ sortable + '>'
					+ val.name + '</th>';
				$(ele).append(th);
			});
		},

		/*
		 * 提示框
		 * @param type 类型
		 * @param title 提示名称
		 * @param time 提示时间
		 * @param msg 提示信息
		 * @param btn 按钮
		 * @param yes 确认回调
		 * @param cancel 取消回调
		 */
		layerPop: function(_param) {
			var param = {
				type: 0,
				time: 60,
				title: '确认提示',
				msg: '',
				btn: ['取消', '确认']
			};
			if (_param) {
				if (_param.type != undefined) param.type = _param.type;
				if (_param.title != undefined) param.title = _param.title;
				if (_param.time != undefined) param.time = _param.time;
				if (_param.msg != undefined) param.msg = _param.msg;
				if (_param.btn != undefined) param.btn = _param.btn;
				if (_param.yes != undefined && typeof _param.yes == 'function') param.yes = _param.yes;
				if (_param.cancel != undefined && typeof _param.cancel == 'function') param.cancel = _param.cancel;
			}
			if (param.type == 0) {
				$('.ldyy-pop').remove();
				clearInterval(PopTimer);
				var pop = '<div class="ldyy-pop">'
						+ '<div class="content">'
						+ '<div class="animated bounceIn">'
						+ '<div class="top">'
						+ '<h2 class="title">' + param.title + '</h2>'
						+ '<div class="time">' + (param.time < 10 ? '0' + param.time : param.time) + '</div>'
						+ '</div>'
						+ '<div class="msg">' + param.msg + '</div>'
						+ '<div class="btns clearfix">BTNS'
						+ '</div></div></div></div>';
				var btns = '<div class="btn btn-cancel">取消</div><div class="btn btn-affirm">确认</div>'
				if (param.btn.length == 1) {
					btns = '<div class="btn btn-affirm">确认</div>';
				}
				pop = pop.replace('BTNS', btns);
				$(document.body).append(pop);
				$.layerInterval('.ldyy-pop .time', param.time, ClosePop);

				$('.ldyy-pop .btn-cancel').on('click', function() {
					ClosePop();
					if (typeof param.cancel == 'function') 
						setTimeout(param.cancel, 300);
				});

				$('.ldyy-pop .btn-affirm').on('click', function() {
					ClosePop();
					if (typeof param.yes == 'function') 
						setTimeout(param.yes, 300);
				});

				function ClosePop() {
					$('.ldyy-pop .animated').attr('class', 'animated bounceOut');
					setTimeout(function() {
						$('.ldyy-pop').remove();
						clearInterval(PopTimer);
					}, 300);
				}
			}
		},

		/*
		 * 倒计时关闭
		 * @param ele 显示事件标签元素
		 * @param _s 时间
		 * @param _callback 回调
		 * @param _type 类型
		 */
		layerInterval: function(ele, _s, _callback, _type) {
			// console.log(_s)
			if (_type == undefined) _type = 0;
			if (_s == undefined) _s = 60;
			PopTimer = setInterval(function() {
				_s--;
				if (_s <= 0) {
					clearInterval(PopTimer);
					if (typeof _callback == 'function') {
						_callback();
					}
				}
				$(ele).html(_s < 10 ? '0' + _s : _s);
			}, 1000);
		},

		/*
		 * 输入密码
		 * @param _pas 输入值
		 * @param _callback1 成功回调
		 * @param _callback2 失败回调
		 */
		layerImportPassword: function(_pas, _callback1, _callback2) {
			$('#import-number').remove();
			var text = '<div id="import-number" style="display: block; left: 500px;">'
					+ '<input type="password" class="pawd-input">'
					+ '<ul class="clearfix">'
					+ '<li>1</li><li>2</li><li>3</li><li>4</li>'
					+ '<li>5</li><li>6</li><li>7</li><li>8</li>'
					+ '<li>9</li><li>0</li><li data-type="1">删除</li><li data-type="0">确认</li>'
					+ '</ul>'
					+ '</div>';
			$(document.body).append(text);
			var ele = '#import-number';
			$(ele).slideDown();
			$input = $(ele + ' .pawd-input');
			$input.focus();
			$(ele + ' li').on('click', function() {
				var type = $(this).data('type');
				var val = $input.val();
				var num = $(this).text();
				if (type == 0) {
					if (val == _pas) {
						if (typeof _callback1 == 'function')
							_callback1();
					} else {
						if (typeof _callback2 == 'function')
							_callback2();
					}
					$(ele).slideUp('fast', function() {
						$(this).remove();
					});
				} else if (type == 1) {
					$input.val(val.substring(0, val.length - 1));
				} else {
					$input.val(val + num);
				}
			});

			$input.on('keyup', function(e) {
				if (e.keyCode == 13) {
					var val = $input.val();
					if (val == _pas) {
						if (typeof _callback1 == 'function') 
							_callback1();
					} else {
						if (typeof _callback2 == 'function')
							_callback2();
					}
					$(ele).slideUp('fast', function() {
						$(this).remove();
					});
				} else if (e.keyCode == 27) {
					$(ele).slideUp('fast', function() {
						$(this).remove();
					});
				}
			});
		},

		/*
		 * 10 进制转换 16进制
		 * @param _num 10 进制数值
		 */
		TranByte10To16: function(_num) {
			var list = ['A', 'B', 'C', 'D', 'E', 'F'];
			var Integer = Math.floor(_num / 16);
			var Remainder = _num % 16;
			function Greater(_num) {
				if (_num > 9) {
					return list[_num - 10];
				} else {
					return _num;
				}
			}
			return Greater(Integer) + '' + Greater(Remainder);
		},
		
		/*
		 * 16 进制转换 10进制
		 * @param _num 10 进制数值
		 */
		TranByte16To10: function(_num) {
			_num = String(_num);
			var list = ['A', 'B', 'C', 'D', 'E', 'F'];
			var Num10 = _num.substring(0, 1) * 16;
			var Num1 = Number(_num.substring(1));
			if (!Num1 && Num1 != 0) {
				var lisNu = 0;
				for (var i in list) {
					if (_num.substring(1) == list[i]) {
						lisNu = Number(i);
					}
				}
				Num1 = 10 + lisNu;
			}
			return Num10 + Num1;
		},

		/*
		 * 读卡转换进制
		 * @param _data 10 进制数值数组
		 * @param _type 类型 0 字符串 1 数组
		 */
		ReadCardTranByte: function(_data, _type) {
			if (_type == undefined) _type = 0;
			var list = [];
			var str = '';
			$.each(_data, function(n, val) {
				var _val = $.TranByte10To16(val);
				list.push(_val);
				str += _val.length < 2 ? '0' + _val : _val;
			});
			if (_type == 0) {
				return str;
			} else if (_type == 1) {
				return list;
			}
		},

		/*
		 * 分割卡号为16个字节
		 * @param _num 卡号
		 * @param _size 截取长度大小
		 */
		SegmentationCardNum: function(_num, _size) {
			_num = String(_num);
			if (!_size || Number(_size) <= 0)
				_size = 2;
			var len = $.GetPageNum(_num.length, _size);
			var list = [];
			for (var i = 0; i < len; i++) {
				var start = i * _size;
				var end = start + _size;
				var str = _num.substring(start, end);
				var num = $.TranByte16To10(str);
				list.push(num);
			}
			// list = list.reverse();
			if (list.length < 16) {
				var len = 16 - list.length;
				for (var i = 0; i < len; i++) {
					list.push(0);
				}
			}
			return list;
		},
    })

})(jQuery);

