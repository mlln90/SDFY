/* 2017-06-03 09:03:32 */
;
// JQ扩展
var printAreaCount = 0, SpearkTimer, IsLog = false;
(function($) {
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
	    },	 
    });

    $.extend({
    	/*
    	 * 打印日志
    	 */
    	Console: function(ret, _msg) {
    		if (IsLog) {
    			if (!_msg)
    				console.log(ret);
    			else
    				console.log(_msg, ret);
    		}
    	},

    	/*
    	 * 语音播放
    	 * @param _msg 语音信息
    	 */
    	Speak: function(_msg) {
    	 	try {
    	 		ThisWindow.Speak(_msg);
    	 	} catch(er) { $.Console(er) };
    	},

    	/*
    	 * 打印日志
    	 * @param _msg 打印信息
    	 */
    	Writelog: function(_msg) {
    		try {
    			LogHelper.WriteLog(_msg);
    		} catch(er) { $.Console(er) };
    	},

		/*
		 * 按钮语音效果
		 */
		TheKeySound: function() {
			try {
				ThisWindow.PlaySpecialSound(KEYTONE); // 按键音效
			} catch(er) {$.Console(er);}
		},

		/*
		 * 存储变量
		 * @param _name 变量名
		 * @param _val 变量值
		 */
		WriteDict: function(_name, _val) {
			try {
				ThisWindow.WriteDict(_name, _val);
			} catch(er) { $.Console(er) }
		},

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
		CheckTel: function(_tel) {
		    // var mobile = /^\d{11}$/;
		    var mobile = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
		    var phone = /^0\d{2,3}-?\d{7,8}$/;
		    return mobile.test(_tel) || phone.test(_tel);
		    // return mobile.test(_tel);
		},

		/*
		 * 分割电话号码
		 * @param _str 号码字符串
		 * @param _type 类型
		 */
		DivisionalTel: function(_str, _type) {
			_str = _str.replace(/\-/g, '');
			var len = _str.length;
			var phone = '';
			if (len > 3 && len < 8) {
				phone = _str.substring(0, 3) + '-' + _str.substring(3, 7);
			} else if (len >= 8) {
				phone = _str.substring(0, 3) + '-' + _str.substring(3, 7) + '-' + _str.substring(7, 11);
			} else {
				phone = _str;
			}
			if (_type == undefined || _type == 0) {
				return phone;
			} else if (_type == 1) {
				return _str.substring(0, 11);
			}			
		},

		/*
		 * 验证邮箱
		 * @param _eml 邮箱地址
		 */
		CheckEmail: function(_eml) {
		    var reg = reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		    return reg.test(_eml);
		},

		/*
		 * 验证身份证号
		 * @param idCard 身份证号
		 */
		CheckIdentity: function(idCard) {
			idCard = $.trims(idCard.replace(/ /g, ''));               //去掉字符串头尾空格                       
	        /*if (idCard.length == 15) {     
	            return $.isValidityBrithBy15IdCard(idCard);           //进行15位身份证的验证      
	        } else */if (idCard.length == 18) {     
	            var a_idCard = idCard.split('');                      // 得到身份证数组     
	            if($.isValidityBrithBy18IdCard(idCard) && $.isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证  
	                return true;     
	            }else {     
	                return false;     
	            }     
	        } else {     
	            return false;     
	        }
		},

		/**   
	     * 判断身份证号码为18位时最后的验证位是否正确   
	     * @param a_idCard 身份证号码数组   
	     * @return   
	     */    
	    isTrueValidateCodeBy18IdCard: function(a_idCard) {    
		    var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子     
		    var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];                  // 身份证验证位值.10代表X   
	        var sum = 0;                             // 声明加权求和变量     
	        if (a_idCard[17].toLowerCase() == 'x') {     
	            a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作     
	        }     
	        for ( var i = 0; i < 17; i++) {     
	            sum += Wi[i] * a_idCard[i];            // 加权求和     
	        }     
	        valCodePosition = sum % 11;                // 得到验证码所位置     
	        if (a_idCard[17] == ValideCode[valCodePosition]) {     
	            return true;     
	        } else {     
	            return false;     
	        }     
	    },

	    /**   
	      * 验证18位数身份证号码中的生日是否是有效生日   
	      * @param idCard 18位书身份证字符串   
	      * @return   
	      */    
	    isValidityBrithBy18IdCard: function(idCard18){     
	        var year =  idCard18.substring(6,10);     
	        var month = idCard18.substring(10,12);     
	        var day = idCard18.substring(12,14);     
	        var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));     
	        // 这里用getFullYear()获取年份，避免千年虫问题     
	        if(temp_date.getFullYear()!=parseFloat(year)     
	              ||temp_date.getMonth()!=parseFloat(month)-1     
	              ||temp_date.getDate()!=parseFloat(day)){     
	                return false;     
	        }else{     
	            return true;     
	        }     
	    },

	    /**   
	     * 验证15位数身份证号码中的生日是否是有效生日   
	     * @param idCard15 15位书身份证字符串   
	     * @return   
	     */    
	    isValidityBrithBy15IdCard: function(idCard15){     
            var year =  idCard15.substring(6,8);     
            var month = idCard15.substring(8,10);     
            var day = idCard15.substring(10,12);     
            var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));     
            // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法     
            if(temp_date.getYear()!=parseFloat(year)     
                  ||temp_date.getMonth()!=parseFloat(month)-1     
                  ||temp_date.getDate()!=parseFloat(day)){     
                    return false;     
            }else{     
                return true;     
            }     
	    },

		/*
		 * 判断身份证号性别
		 * @param _IdNo 身份证号
		 */
		CheckSex: function(_IdNo) {
			var num = Number(_IdNo.substring(16, 17));
			if (num == 0 || num % 2 == 0) {
				return 2;
			} else {
				return 1;
			}
		},

		/*
		 * 分割身份证号
		 * @param _str 号码字符串
		 * @param _type 类型
		 */
		DivisionaIdentity: function(_str, _type) {
			_str = _str.replace(/\-/g, '');
			var len = _str.length;
			var cardNum = '';
			if (len > 6 && len < 14) {
				cardNum = _str.substring(0, 6) + '-' + _str.substring(6, 14);
			} else if (len >= 8) {
				cardNum = _str.substring(0, 6) + '-' + _str.substring(6, 14) + '-' + _str.substring(14, 18);
			} else {
				cardNum = _str;
			}
			if (_type == undefined || _type == 0) {
				return cardNum;
			} else if (_type == 1) {
				return _str.substring(0, 18);
			}			
		},

		/*
		 * 分割指定字符串
		 * @param _str 字符串
		 * @param _type 类型
		 * @param _num 分割位数
		 */
		Divisiona: function(_str, _type, _num) {
			_str = _str.replace(/\-/g, '');
			var len = _str.length, str = '';
			if (_num == undefined) _num = 4;
			var total = len % _num == 0 ? len / _num : Math.floor(len / _num) + 1;
			for (var i = 1; i <= total; i++) {
				var start = (i - 1) * _num;
				if (i < total) {
					str += _str.substr(start, 4) + '-';
				} else {
					str += _str.substr(start, 4);
				}
			}			
			if (_type == undefined || _type == 0) {
				return str;
			} else if (_type == 1) {
				return _str;
			}			
		},

		/*
		 * 检验是否为非负整数
		 * @param _num 数值
		 */
		CheckInteger: function(_num) {
			var reg = /^([1-9]\d*|[0]{1,1})$/;
			return reg.test(_num);
		},

		/*
		 * 检测是否为 数字、26个英文字母或者下划线组成
		 * @param _str 字符串
		 */
		CheckNHZ: function(_str) {
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
		GetExtensionName: function(_fname) {
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
		CheckImg: function(_fname) {
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
		FormatDate: function(timestamp, sign) {
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
		 * 获取指定日期的后一天
		 * @param _date 指定日期
		 * @param _type 类型
		 * @param _sign 分割符
		 */
		GetNextDay: function(_date, _type, _sign) {
			_type = _type ? _type : 0;
			_sign = _sign ? _sign : '-';
			var NowDate = new Date(_date);
			var NewDate = new Date(NowDate.getTime() + 1000 * 60 * 60 * 24);

			var year = NewDate.getFullYear();
		    var month = (NewDate.getMonth() + 1) > 9 && (NewDate.getMonth() + 1) || ('0' + (NewDate.getMonth() + 1));
		    var day = NewDate.getDate() > 9 && NewDate.getDate() || ('0' + NewDate.getDate());
		    var hour = NewDate.getHours() > 9 && NewDate.getHours() || ('0' + NewDate.getHours());
		    var minute = NewDate.getMinutes() > 9 && NewDate.getMinutes() || ('0' + NewDate.getMinutes());
		    var second = NewDate.getSeconds() > 9 && NewDate.getSeconds() || ('0' + NewDate.getSeconds());
		    var Result;
		    switch (_type) {
		    	case 0:
		    		Result = year + _sign + month + _sign + day;
		    		break;
		    }
		    return Result;
		},

		/*
		 * 获取指定日期周期
		 * @param _data 日期数组
		 */
		GetDateWeek: function(_data) {
			var date = new Date(Number(_data[0]), Number(_data[1])-1, Number(_data[2]));
			var weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			var weekName = weekArr[date.getDay()];
			return weekName;
		},

		/*
		 * 格式化日期字符串
		 * @param _str 日期字符串
		 * @param _type 返回类型
		 * @param _sign 分割字符
		 */
		FormatDateByString: function(_str, _type, _sign) {
			_type = _type ? _type : 0;
			_sign = _sign ? _sign : '-';
			if (_type == 0) {
				return _str.substring(0, 4) + _sign + _str.substring(4, 6) + _sign + _str.substring(6, 8) + ' ' + _str.substring(8);
			} else {
				return _str.substring(0, 4) + _sign + _str.substring(4, 6) + _sign + _str.substring(6, 8)
			}
		},

		/*
		 * 获取当前时间
		 *  @param _type 类型 
		 *       0 - 小时 
		 *       1 - 分钟 
		 *       2 早中晚（0-上午，1-下午, 2- 晚上） 
		 *       3 - 格式化当前日期 年月日
		 *       4 - 格式化日期 月日  
		 *       5 - 日期 星期 
		 *       6 - 未来一周  
		 *       7 - 当前时间字符串 无分割符
		 *       8 - 当前一周
		 * @param _days 增加或减少天数
		 * @param _sign 分割符号
		 */
		GetCurrentTime: function(_type, _days, _sign) {
			var date = new Date(), Result;
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var days = date.getDate();
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			_type = !_type ? 0 : _type;
			_sign = !_sign ? '-' : _sign;

			switch(_type) {
				case 0:
					Result = hours;
					break;
				case 1:
					Result = minutes;
					break;
				case 2:
					Result = 0;
					if (hours > 11 && hours <= 17)
						Result = 1;
					else if (hours > 17)
						Result = 2;
					break;
				case 3:
					month = month < 10 ? '0' + month : month;
					days = days < 10 ? '0' + days : days;
					Result = year + _sign + month + _sign + days;
					break;
				case 4:
					Result = $.GetCurrentTime(3).substring(5);
					break;
				case 5:
					var today = date.getTime();
					var timestamp = today + _days * 24 * 60 * 60 * 1000;
					var time = new Date(timestamp);
					var weekArr = [
						'\u661f\u671f\u5929', '\u661f\u671f\u4e00',
						'\u661f\u671f\u4e8c', '\u661f\u671f\u4e09',
						'\u661f\u671f\u56db', '\u661f\u671f\u4e94', 
						'\u661f\u671f\u516d'
					];
					var year = time.getFullYear();
					var month = time.getMonth() + 1;
					var days = time.getDate();
					month = month < 10 ? '0' + month : month;
					days = days < 10 ? '0' + days : days;
					var weekName = weekArr[time.getDay()];
					Result = {
						day: days,
						month: month + _sign + days,
						date: year + _sign + month + _sign + days,
						week: weekName
					}
					break;
				case 6:
					Result = [
						$.GetCurrentTime(5, 1, _sign), $.GetCurrentTime(5, 2, _sign), 
						$.GetCurrentTime(5, 3, _sign), $.GetCurrentTime(5, 4, _sign), 
						$.GetCurrentTime(5, 5, _sign), $.GetCurrentTime(5, 6, _sign), 
						$.GetCurrentTime(5, 7, _sign)
					];
					break;
				case 7:
					month = month < 10 ? '0' + month : month;
					days = days < 10 ? '0' + days : days;
					hours = hours < 10 ? '0' + hours : hours;
					minutes = minutes < 10 ? '0' + minutes : minutes;
					seconds = seconds < 10 ? '0' + seconds : seconds;
					Result = '' + year + month + days + hours + minutes + seconds;
					break;
				
				case 8:
					Result = [
						$.GetCurrentTime(5, 0, _sign), $.GetCurrentTime(5, 1, _sign), 
						$.GetCurrentTime(5, 2, _sign), $.GetCurrentTime(5, 3, _sign), 
						$.GetCurrentTime(5, 4, _sign), $.GetCurrentTime(5, 5, _sign), 
						$.GetCurrentTime(5, 6, _sign)
					];
					break;
			}
			return Result;
		},

		/*
		 * 获取指定年月的天数
		 * @param _year 年
		 * @param _month 月
		 */
        GetAssingDateDays: function(_year, _month) {
            if (_month == 2) {
                return _year % 4 == 0 ? 29 : 28;
            } else if (_month == 1 || 
            	_month == 3 || 
            	_month == 5 || 
            	_month == 7 || 
            	_month == 8 || 
            	_month == 10 || 
            	_month == 12) {
                return 31;
            } else {
                return 30;
            }
        },

		/*
		 * 质补长存 数字字符串 长度不够前置位补 ‘0’
		 * @param _num 数值
		 * @param n  指定长度
		 */
		Addstrnums: function(_num, n) {
			var len = _num.toString().length;
			while (len < n) {
				_num = '0' + _num;
				len++;
			}
			return _num;
		},

		/*
		 * 计算年龄
		 * @param _birthday 出生日期 (分割符必须是 ‘-’)
		 */
		Calculate: function(_birthday) {
			var bArr = _birthday.split('-');
			var cArr = $.GetCurrentTime(3).split('-');
			var age = cArr[0] - bArr[0] - 1;
			if (cArr[1] > bArr[1] || cArr[1] == bArr[1] && cArr[2] >= bArr[2]) { // 当前月份大于出生月份，或者当前月份等于出生月份并当前日大于等于出生日
				age++;
			}
			return age;
		},

		/*
		 * 解析日期格式化 yy-mm-dd
		 * @param _str 日期字符串
		 */
		GetFormatDate: function(_str) {
			return _str.substring(0, 4) + '-' + _str.substring(4, 6) + '-' + _str.substring(6);
		},

		/*
		 * 计算页数
		 * @param _total 总数
		 * @param _size 分割大小
		 */
		GetPageNum: function(_total, _size) {
			return _total % _size == 0 ? _total / _size : Math.floor(_total / _size) + 1;
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
		 * 判断当先时间是否符合定义时间段数组中的某项
		 * @param _TimeList 时间段数组
		 * @param _Tmp 当前时间戳
		 * @param _type 类型 
		 */
		GetCheckCurrentTime: function(_TimeList, _Tmp, _type) {
			// console.log(_TimeList);
			var TimeData = [];
			$.each(_TimeList, function(n, val) {
				if (val.Enabled) {
					if( 'T'.indexOf(val.StartTime) != -1){
						var star = val.StartTime.split('T')[1].split(':');
						var end = val.EndTime.split('T')[1].split(':');
						val.star = star;
						val.end = end;
						TimeData.push(val);
					}else{
						var star = val.StartTime.split(':');
						var end = val.EndTime.split(':');
						val.star = star;
						val.end = end;
						TimeData.push(val);
					}
				}
			});
			var today = $.GetCurrentTime(3).split('-');
			var isTrue = false, Time = [], Least = _Tmp, Small = {};
			$.each(TimeData, function(n, val) {
				var starTmp = new Date(today[0], Number(today[1]) - 1, today[2], val.star[0], val.star[1]).getTime();
				var endTmp = new Date(today[0], Number(today[1]) - 1, today[2], val.end[0], val.end[1]).getTime();
				if (_Tmp > starTmp && _Tmp < endTmp) {
					isTrue = true;
				}

				if (_Tmp < starTmp) {
					Time.push(val);
				}

				if (Least > starTmp) {
        			Least = starTmp;
        			Small = val;
        		}
			});
			if (_type == 2) {         // 返回最小开始时间
				return Small;         
			} else if (_type == 1) {  //  返回大于当前时间的时间段数组
				return Time;
			} else {                  // 返回当前时间是否有效
				return isTrue;
			}
		},

		/*
		 * 模块分组
		 * @param _ModulData
		 */
		ModuleGrouping: function(_ModulData) {
			var listmap = [],
			datalist = [];
			$.each(_ModulData, function(n, val) {
				val.State = true;
				var id = val.ID;
				var TagInfo = {};
				try {					
					TagInfo = JSON.parse(val.Tag);
					val.Bgcolor = TagInfo.BgColor;
					val.Texcolor = TagInfo.TxColor
					val.IconName = TagInfo.IconName;
					val.IsInToCard = TagInfo.InToCard;
					val.Type = TagInfo.Type;
					val.Diameter = TagInfo.Radius + 'px';
				} catch(er) { $.Console('模块数据转换出错！') }
				// if (TagInfo.Campus != _campus)   // 判断模块是否属于当前院区
					// return true;
				if (val.WorkTimeSegmentConfigID != -1) {
					var data = val.WorkTimeSegments;
					var tmp = new Date().getTime();
					var st = $.GetCheckCurrentTime(data, tmp);
					val.State = st;
					val.TimeData = data;
				}
				if (val.ParentID == -1 && !listmap[id]) {
					val.child = [];
					datalist.push(val);
					listmap[id] = val;
				} else {
					$.each(datalist, function(_n, _val) {
						if (val.ParentID == _val.ID) {
							_val.child.push(val);
						}
					});
				}
			});
			datalist.sort(function(i1, i2) {   // 排序
		        return i1.SerialNumber - i2.SerialNumber;
		    });
		    $.each(datalist, function(n, val) { // 子模块排序
		    	if (val.child.length > 1) {
		    		val.child.sort(function(i1, i2) {
		    			return i1.SerialNumber - i2.SerialNumber;
		    		})
		    	}
		    });
			return datalist;
		},

		/*
		 * 检索转换数据
		 * @param _key 关键词 首字母
		 * @param _attr 对比属性
 		 * @param _data 数据源
		 */
		SearchingTransformData: function(_key, _attr, _data) {
			var data = [];
			$.each(_data, function(n, val) {
				var keyStr = val[_attr] + '';
				if (keyStr.indexOf(_key) != -1) {
					data.push(val);
				}
			});
			return data;
		},
		
		/*
		 * 循环播放语音
		 * @param _msg 语音信息
		 * @param _s 循环时间
		 */
		CirculationSpeark: function(_msg, _s) {
			if (!_s || Number(_s) <= 0)
				_s = 10;
			clearInterval(SpearkTimer);
			SpearkTimer = setInterval(function() {
				try {
					ThisWindow.Speak(_msg);
				} catch(er) {$.Console(er);}
			}, _s * 1000);
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
				str += _val;
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
			if (!_size || Number(_size) <= 0)
				_size = 2;
			var len = $.GetPageNum(_num.length, _size);
			var list = [];
			for (var i = 0; i < len; i++) {
				var start = i * _size;
				var end = start + _size;
				var num = Number(_num.substring(start, end));
				list.push(num);
			}
			if (list.length < 16) {
				var len = 16 - list.length;
				for (var i = 0; i < len; i++) {
					list.push(0);
				}
			}
			return list;
		},

		/*
		 * 获取硬币找零个数
		 * @param _toMon 找零总金额
		 */
		GetCoinOutNum: function(_toMon) {
			var Yuan = 0, Angle = 0, Acost;
			Yuan = parseInt(_toMon);
			var Acost = _toMon - Yuan;
			if (Acost >= 0.5)
				Angle = 1;
			return {
				Yuan: Yuan,
				Angle: Angle
			}
		},


		/*
		 * 获取指定个数随机字母
		 * @param n 个数
		 */
		GetRandomLetter: function(n) {
			var char = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		    var res = '';
		     for(var i = 0; i < n ; i ++) {
		         var id = Math.ceil(Math.random()*25);
		         res += char[id];
		     }
		     return res;
		},

		/*
		 * 换算
		 * @param _num1 换算数字1
		 * @param _num2 换算数字2
		 * @param _type 换算类型
		 */
		Count: function(_num1, _num2, _type) {
			_type = _type ? _type : 0;
			var Result = 0;
			switch(_type) {
				case 0: // 加法
					Result = (Math.trunc(_num1 * 1000000000000 + _num2 * 1000000000000) / 1000000000000).toFixed(2);
					break;

				case 1: // 减法
					Result = (Math.trunc(_num1 * 1000000000000 - _num2 * 1000000000000) / 1000000000000).toFixed(2);
					break;

				case 2: // 乘法
					Result = (Math.trunc(_num1 * _num2 * 1000000000000) / 1000000000000).toFixed(2);
					break;

				case 3: // 除法
					Result = (Math.trunc(_num1 / _num2 * 1000000000000) / 1000000000000).toFixed(2);
					break;
			}
			return Number(Result);
		},
		
    })

})(jQuery);




/* 数组删除元素 */
Array.prototype.remove = function(from, to) {
  	var rest = this.slice((to || from) + 1 || this.length);
  	this.length = from < 0 ? this.length + from : from;
  	return this.push.apply(this, rest);
};