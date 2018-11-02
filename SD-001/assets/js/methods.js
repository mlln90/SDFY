/*
 * 2018-04-05 00:03:00
 * methods 公共方法
 * Evan
 */

var CheckCardTimer, BackTimer;
(function($) {
	$.extend({

		/*
		 * 退卡 清除卡信息 清除变量值
		 */
		ExitCardClearInfo: function() {
			//SetDKQMoveCard(0); // 退卡

			PAGECODE = null;
    		NotPutInCard = false;

			CardInfo = {};
			CreateCardInfo = {};
			IntroduceInfo = {};
			PayBusinessInfo = {};
			HospitaledInfo = {};
			RegisterTakeInfo = {};
			QueryPrintInfo = {};
		},

		/*
		 * 退卡并返回主界面 - 循环查卡
		 */
		ExitCardAndBackMainPage: function() {
			$.ExitCardClearInfo();                  // 退卡清除信息
		    // setTimeout($.CheckCardIsExist, 300);    // 循环查卡
		    ShowMainMenu();                         // 返回主界面
		},

		/*
		 * 循环查询是否插卡
		 */
		CheckCardIsExist: function() {
		    clearInterval(CheckCardTimer);
			IsReadCardNow = false;
		    CheckCardTimer = setInterval(function() {
		        CheckDKQHasCard(function() {
		            clearInterval(CheckCardTimer);
		            if (!IsReadCardNow) {
		                ReadCard();
		            }  
		        });
		    }, 500);        
		},

		/*
		 * 当前时间
		 */
		CurrentDate: function() {
			var date = new Date();
			var weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			var days = date.getDate();
			days = days < 10 ? '0' + days : days;
			var weekName = weekArr[date.getDay()];

			// console.log(date.toTimeString());
			$('.footer .date-time').html( date.toTimeString().substring(0, 8) );
			$('.footer .date-week').html(weekName);
			$('.footer .date-day').html(year + '-' + month + '-' + days);
		},

		/*
		 * 执行动画 
		 * @param ele 执行标签元素父级
		 * @param _type 类型
		 * @param _callback 回调
		 */
		ExecuteAnimate: function(ele, _type, _callback) {
			if (_type == undefined) _type = 0;
			if (_type == 0) { // 显示
				$(ele + ' .animated').attr('class', 'bounceIn animated');		
			} else if (_type == 1) { // 消失
				$(ele + ' .animated').attr('class', 'bounceOut animated');
			}
			if (typeof _callback == 'function') {
				_callback();
			}
			// 清除拼音键盘
			if ($('.spell-container').length) {
				$('.spell-container').slideUp('fast', function() {
					$(this).remove();
				});
			}

			$('.container > .back-home').hide();
			$(PAGE).removeClass('filter');

			// 清除弹窗
			if ($('.zdyy-pop').length) {
				$('.zdyy-pop').slideUp('fast', function() {
					$(this).remove();
					clearInterval(layerTimer);
				});						
			}

			// 清除定时返回
			clearInterval(BackTimer);
	
			// 清除语音
			clearInterval(SpearkTimer);
		},

		/*
		 * 判断服务时间并返回提示信息
		 * @param _data 模块数据
 		 * @param _callback 回调
		 */
		JudgeServiceTime: function(_data, _callback) {
			var tmp = new Date().getTime();
			var time = $.GetCheckCurrentTime(_data.TimeData, tmp, 1);
			var text = '当前时间不可用，';
			if (time.length > 0) {
				var hour = time[0].StartTime.split('T')[1];
				text += hour + '开启！';
			} else {
				time = $.GetCheckCurrentTime(_data.TimeData, tmp, 2);
				var hour = time.StartTime.split('T')[1];
				text += '次日' + hour + '开启！';
			}
			if (typeof _callback == 'function') 
				_callback(text);
		},

		/*
		 * 判断是否为插卡操作
		 * @param _isIntoCard 界面值
		 * @param _cardInfo 卡信息
		 */
		JudgeModuleOperate: function(_isIntoCard, _cardInfo) {
			if (_isIntoCard && !_cardInfo) {
	            PluginCardIndicator();
	            $.intoOrExitCard(1, 5); // 插卡提示
			} else {
				$.TransformPage();
			}
		},

		/*
		 * 切换二级界面
		 */
		TransformPage: function() {
			switch(PAGECODE) {

				// 医药简介
		        case 'YYJJ':
		            HospitalIntroduce();
					break;
				
		        // 打印业务
				case 'DYYW':
					PrintReport();
					break;

				// 身份证办卡
		        case 'SFZBK':
		            IdentityCardRegist();
		            break;

		        // 门诊预约
		        case 'MZYY':
		           	OutpatientAppointment();
		            break;

		        // 当日挂号
		        case 'DRGH':
		            RegisterOntheDay();
					break;
				
				// 预约取号
				case 'YYQH':
					ReservationNumber();
					break;

				// 自助缴费
				case 'ZZJF':
					SelfHelpPayment();
					break;

		        default:
					ShowMainMenu();
			}
		},

		/*
		 * 生成二级模块界面 标签
		 * @param _ele 标签ID名称
		 * @param _title 界面标题
		 * @param _isExit 是否含有退卡按钮
		 */
		CreateSecondModuleTag: function(_ele, _title, _isExit) {
			_ele = _ele.substring(1);
			_isExit = _isExit == undefined ? true : _isExit;
			var HandleGroup = '\
				<div class="handle-group">\
					<div class="handle pull-left handle-home">首页</div>\
					<div class="handle pull-right handle-exit">退卡</div>\
                    <div class="handle pull-right handle-prev">上一页</div>\
                </div>\
			';
			if (!_isExit) {
				HandleGroup = '\
					<div class="handle-group">\
						<div class="handle pull-right handle-home">首页</div>\
						<div class="handle pull-right handle-prev">上一页</div>\
	                </div>\
				';
			}
			var text = '\
				<div id="' + _ele + '" class="page second-module">\
	                <div class="content">\
						<div class="animated">\
							<div class="title theme-title-color text-shadow">' + _title + '</div>\
	                        <div class="module-group">\
	                        </div>\
	                    </div>\
	                    <div class="time"><span class="s">0</span>s</div>'
	                    + HandleGroup + '\
	                </div>\
	            </div>\
			';
			return text;
		},

		/*
		 * 生成二级单个模块标签
		 * @param _name 模块数据
		 * @param _enabled 模块数据
		 * @param _class  类名
		 * @param _index 数据索引值
		 */
		CreatModuleTag: function(_name, _enabled, _class, _index) {
			if (!_enabled && _enabled != undefined && _class.indexOf('disabled') == -1) 
				_class += ' disabled';
			var text = '\
				<div class="module-item '
                    + _class + '" data-id="' + _index + '">\
                    <div class="module-outer">\
                        <i></i>\
                        <p>' + _name + '</p>\
                    </div>\
                </div>';
			return text;
		},

		/*
		 * 生成二级模块列表标签
		 * @param _ele 当前界面元素
		 * @param _modules 模块数据
		 * @param _class  类名
		 * @param _index 数据索引值
		 */
		CreatModulesTag: function(_ele, _modules) {
			$(_ele + ' .module-group').empty();
			var index = 0;
			$.each(_modules, function(n, val) {
				if (val.Visual) {   // 判断是否显示 
					index++;
					var item = $.CreatModuleTag(val.Name, val.Enabled, val.IconName, n);
					$(_ele + ' .module-group').append(item);
				}
			});
			$(_ele + ' .module-group').addClass('m-' + index);
		},

		/*
		 * 插卡退卡提示
		 * @param _type 类型
		 * @param _s  时间
		 */
		intoOrExitCard: function(_type, _s) {
			var IconName = '', hint = '';
			if (_type == 0) {
				IconName = 'paper-out.gif';
				if(ISBG ==  true){
					IconName = 'bgOutputBank.gif';
				}
				hint = '请取走您的银行卡...';
				$.Speak('请取走您的银行卡，，请取走您的银行卡');
			} else if (_type == 1) {
				IconName = 'exit-card.gif';
				if(ISBG ==  true){
					IconName = 'bgOutputSocial.gif';
				}
				hint = '请取出您的社保卡...';
				$.Speak('请取出您的社保卡，，请取出您的社保卡');
			} else if (_type == 2) {
				IconName = 'out-IDCard.gif';
				hint = '请将您的身份证或扫码凭条从阅读区取走...';
				$.Speak('请将您的身份证或扫码凭条从阅读区取走');
			}
			var text = '\
				<div id="operate-card" class="page">\
					<div class="animated">\
						<img src="assets/images/card/' + IconName + '">\
						<p class="flicker theme-color">' + hint + '</p>\
					</div>\
					<div class="time"><span class="s">0</span>s</div>\
				</div>';
			$(PAGE).html(text);
			if (!_s) _s = 5;
			var ele = '#operate-card';
			$.ExecuteAnimate(ele);

			$(ele).one('click', ShowMainMenu);

			// 定时返回
			$.BackInterval(_s);
		},

		/*
		 * 定时返回指定界面
		 * @param _s 定时时间 's 
 		 * @param _callback 定时结束回调
		 */
		BackInterval: function(_s, _callback) {
			clearInterval(BackTimer);
			if (_s == undefined) _s = 60;
			$('.wrapper .time .s').html(_s < 10 ? '0' + _s : _s);
			if (_s > 10) {
				$('.wrapper .time').removeClass('flicker');
			}
			BackTimer = setInterval(function() {
				_s--;
				if (_s <= 0) {
					clearInterval(BackTimer);
					if (typeof _callback == 'function') {
						_callback();
					} else {
						ShowMainMenu();
					}
				} else if (_s > 0 && _s <= 10) {
					$('.wrapper .time').addClass('flicker');
				} else {
					$('.wrapper .time').removeClass('flicker');
				}

				$('.wrapper .time .s').html(_s < 10 ? '0' + _s : _s);
			}, 1000);
		},

		/*
		 * 输出分页列表
		 * @param ele 当前页面标签元素
		 * @param _data 所有页面数据
		 * @param _pgsize 页面大小
		 * @param _callack 输出列表回调
		 */
		ShowPagesData: function(ele, _data, _pgsize, _callack) {
			var pagenum = 1, pagesize = _pgsize, total = _data.length, pages = $.GetPageNum(total, pagesize);

			$(ele + ' .page-info .btn').removeClass('yes');
			$(ele + ' .page-info .total-page').html(pages);
			if (pages > 1) {
				$(ele + ' .page-info .btn-prev-page').css('visibility', 'visible');
				$(ele + ' .page-info .btn-next-page').css('visibility', 'visible');
				$(ele + ' .page-info .info').css('visibility', 'visible');

				// 输出页面信息
				$(ele + ' .page-info .btn-next-page').addClass('yes');

				// 上一页
				$(ele + ' .page-info .btn-prev-page').unbind('click');
				$(ele + ' .page-info .btn-prev-page').on('click', function() {
					$.TheKeySound();
					var pm = pagenum;
					pagenum--;
					if (pagenum <= 1) {
						pagenum = 1;
						$(this).removeClass('yes');
					}
					if (pagenum < pages) {
						$(ele + ' .page-info .btn-next-page').addClass('yes');
					}

					if (pm != pagenum) {
						// 输出分页列表
						_callack(ele, pagenum, pagesize, _data);
					}				
				});

				// 下一页
				$(ele + ' .page-info .btn-next-page').unbind('click');
				$(ele + ' .page-info .btn-next-page').on('click', function() {
					$.TheKeySound();
					var pm = pagenum;
					pagenum++;
					if (pagenum >= pages) {
						pagenum = pages;
						$(this).removeClass('yes');
					}
					if (pagenum > 1) {
						$(ele + ' .page-info .btn-prev-page').addClass('yes');
					}

					if (pm != pagenum) {
						// 输出分页列表
						_callack(ele, pagenum, pagesize, _data);
					}
				});
			} else {
				$(ele + ' .page-info .btn-prev-page').css('visibility', 'hidden');
				$(ele + ' .page-info .btn-next-page').css('visibility', 'hidden');
				$(ele + ' .page-info .info').css('visibility', 'hidden');
			}

			// 输出分页列表
			_callack(ele, pagenum, pagesize, _data);
		},
		
		
		/*
		 * 配置进度导航条
		 * @param ele 目标元素标签 必须
		 * @param isClick 是否可以点击
		 * @param btns 按钮名称数组 必须
		 * @param locat 当前所在位置索引 
		 * @param fns 回调函数数组 必须
		 */
		pageNavigation: function(_param) {
			var ele = _param.ele, 
			isClick = typeof _param.isClick != 'boolean' ? false : _param.isClick;
			btns = typeof _param.btns != 'object' ? [] : _param.btns, 
			locat = _param.locat != undefined ? _param.locat : 0,
			fns = typeof _param.fns != 'object' ? [] : _param.fns;
			$(ele).empty();
			$.each(_param.btns, function(n, val) {
				var isAc = '';
				if (n <= locat) {
					isAc = ' active';
				}
				var btn = '<div class="btn btn-nav' + isAc + '">' + (n+1) + '.' + val + '</div>';
				$(ele).append(btn);
			});
			$(ele + ' .btn-nav.active').one('click', function() {
				var index = $(this).index();
				if (index != locat && isClick) {
					var callback = fns[index];
					if (typeof callback == 'function') {
						callback();
					}
				}				
			});
		},

		/*
		 * 过滤获取指定的值 可挂号的序号
		 * @param _timeStr 时间段字符串 （"15:30-16:30"）
		 * @param _data 需过滤获取的数组
		 */
		GetsEqCode: function(_timeStr, _data) {
			var times = _timeStr.split('-');
			var time1 = $.trimr(times[0])
			var time2 = $.triml(times[1])
			var data = [];
			$.each(_data, function(n, val) {
				if (val.EndTime.indexOf(time2) > -1 && val.StartTime.indexOf(time1) > -1) {
					data.push(val.SeqCode);
				}
			});
			return data;
		},

		/*
		 * 整理医生列表数据返回新数组
		 * @param _data 列表数据
		 */
		GetDoctorWeekList: function(_data) {
			var obj = {};
			$.each(_data, function(n, val) {
				obj[val.doctorCode] = '1';
			});
			var CodeArr = [];
			for (k in obj) {
				CodeArr.push(k);
			}
			var data = [];
			$.each(CodeArr, function(n, val) {
				data[n] = [];
				data[n][0] = []; // 上午
				data[n][1] = []; // 下午
				$.each(_data, function(_n, _val) {
					if (_val.doctorCode == val) {
						if (_val.AP == '上午') {
							data[n][0].push(_val);
						} else {
							data[n][1].push(_val);
						}						
					}
				});
			});
			return data;
		},

		/*
		 * 整理缴费医嘱详细数据 返回新数组
		 * @param _data 列表数据
		 */
		GetPaymentList: function(_data) {
			var list1 = [], list2 = [], data = [];
			$.each(_data, function(n, val) {
				var sector = val.RecdepLoc;
				if (!list1[sector]) {
					var obj = {
						sector: sector,
						location: val.RecdepAddress,
						amount: val.Amt,
						data: [val]
					};
					list2.push(obj);
					list1[sector] = val;
				} else {
					$.each(list2, function(_n, _val) {
						if (_val.sector == sector) {
							_val.data.push(val);
							_val.amount += val.Amt;
						}
					});
				}
			});
			return list2;
		},

		/*
		 * 转换消费记录按照日期。月份, 每日重组
		 * @param _data 列表数据
		 */
		GetConsume: function(_data) {
			var list1 = [], list2 = [];
			$.each(_data, function(n, val) {
				var time = val.invinfo.InvDate.slice(0, 7);
				if (!list1[time]) {
					var obj = {
						date: time,
						data: [val]
					};
					list2.push(obj);
					list1[time] = val;
				} else {
					$.each(list2, function(_n, _val) {
						if (_val.date == time) {
							_val.data.push(val);
						}
					});
				}
			});
			return list2;
		},

		/*
		 * 返回首页
		 * @param ele 当前页面 标签元素
		 * @param _callback 回调
		 */
		BackIndexPage: function(ele, _callback) {
			$(ele + ' .handle-group .handle-home').one('click', function() {
				$.TheKeySound();
				$.Writelog('------返回首页-----');
				if (typeof _callback == 'function') {
					_callback();
				} else {
					ShowMainMenu();
				}
			});
		},

		/*
		 * 退出业务
		 * @param ele 当前页面 标签元素
		 * @param _callback 回调
		 */
		QuitBusiness: function(ele, _callback) {
			$(ele + ' .handle-group .handle-quit').one('click', function() {
				$.TheKeySound();
				$.Writelog('------退出-----');
				if (typeof _callback == 'function') {
					_callback();
				} else {
					ShowMainMenu();
				}
			});
		},

		/*
		 * 退卡操作
		 * @param ele 当前页面 标签元素
		 */
		ExitCard: function(ele) {
			$(ele + ' .handle-group .handle-exit').on('click', function() {
				$.TheKeySound();
				$.Writelog('>>>>>>>>>>>>退卡<<<<<<<<<<<');
				$.ExitCardClearInfo();
				// setTimeout($.CheckCardIsExist, 500); // 循环查卡
				$.intoOrExitCard(0, 5); // 退卡提示
			});

			if (!ele) {
				$.Writelog('>>>>>>>>>>>>退卡<<<<<<<<<<<');
				$.ExitCardClearInfo();
				// setTimeout($.CheckCardIsExist, 500); // 循环查卡
				$.intoOrExitCard(2, 5); // 退卡提示
			}
		},

		/*
		 * 返回上一级
		 * @param ele 当前页面标签元素
		 * @param _callback 回调
		 */
		BackPrevPage: function(ele, _callback) {
			$(ele + ' .handle-group .handle-prev').one('click', function() {
				$.TheKeySound();
				$.Writelog('------返回上一级-----');
				if (typeof _callback == 'function') {
					_callback();
				} else {
					ShowMainMenu();
				}
			});
		},

		/*
		 * 确认按钮
		 * @param ele 当前页面标签元素
		 * @param _callback 回调
		 */
		AffirmNextPage: function(ele, _callback) {
			$(ele + ' .handle-group .handle-confirm').unbind('click');
			$(ele + ' .handle-group .handle-confirm').on('click', function() {
				$.TheKeySound();
				_callback();
			});
		},

		/*
		 * 输出当前机器的位置型号
		 * @param _data 自助机信息
		 */
		ShowCurrentMachineInfo: function(_data) {
			$('.header .service-phone').html($.DivisionalTel(_data.Mobile));
			$('.footer .service-phone').html($.DivisionalTel(_data.Mobile));
			$('.footer .serial .row-item:eq(0) .value').html(_data.Name);
			$('.footer .serial .row-item:eq(1) .value').html(_data.Position);
		},

		/*
		 * 获取自助机流水号
		 */
		GetSerial: function() {
			// 自助机编号 + 日期 + 自增流水号
			var NewDay = $.GetCurrentTime(3).replace(/\-/g, '');
			var StoreStr = '';
			var OldDay = '';
			var number = 1;
			try {
				StoreStr = ThisWindow.ReadDict('ID');  // 读取字典 id
				OldDay = ThisWindow.ReadDict('DATE');  // 读取字典 日期
			} catch(er) { $.Console(er) }

			$.Writelog('读取字典编号：' + StoreStr);
			$.Writelog('读取字典日期：' + OldDay);

			if (StoreStr) {
				number = Number(StoreStr);
				number++;
				if (OldDay != NewDay) {
					$.WriteDict('ID', 1);                 // 写入 id
					$.WriteDict('DATE', NewDay);          // 写入 date
					$.Writelog('存储当前日期：' + NewDay);
					$.Writelog('存储流水编号：' + 1);
				} else {
					$.WriteDict('ID', number);            // 写入 id
					$.Writelog('存储流水编号：' + number);
				}
			} else {
				$.WriteDict('ID', 1);                     // 写入
				$.WriteDict('DATE', NewDay);              // 写入 date
				$.Writelog('存储当前日期：' + NewDay);
				$.Writelog('存储流水编号：' + 1);
			}
			var SerialNumber = ZZJInfomation.Name + '-' + NewDay + '-' + $.Addstrnums(number, 4);

			$.Writelog('流水号：' + SerialNumber);

			return SerialNumber;
		},

	})
})(jQuery)