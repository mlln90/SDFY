/* 2017-07-15 09:08:49 */
;
$(function() {

	// 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };

    if (ZZJINFO.ZZJInfomation.ZZJState == 0) {
    	ServerStatus(0);
    } else {
    	ServerStatus(1);
    }

	// 初始化功能
	InitOperate();	

});

var AJAX = top.AJAX;
var ZZJINFO = top.ZZJINFO;

/*
 * 功能绑定事件
 */
function InitOperate() {
	$('.operate-btns .item .btn').on('click', function() {
		var type = $(this).data('type');
		PopControl(type);		
	});
}


/*
 * 功能弹窗管理
 * @param _type 类型
 */
function PopControl(_type) {
	switch (_type) {
		// 系统检测
		case 0:
			$(document.body).append(SystemTestText);

			// 系统检测
			SysTemTest();
			break;

		// 系统日志
		case 1:
			$(document.body).append(SystemLogText);

			// 日志查询
			SystemLogSearch();
			break;

		// 视频回放
		case 2:
			$(document.body).append(VideoPlayBackText)

			// 视频回放
			VideoPlayBack();
			break;

		// 暂停服务
		case 3:
			ZZJINFO.ZZJInfomation.ZZJState = 1;	
			$.layerPop({
				msg: '请确认暂停服务',
				time: 6,
				yes: function() {
					AJAX.Admin.ChangeZZJInfomation( JSON.stringify(ZZJINFO), function(ret) {
						// console.log(ret);
						ServerStatus(1);
						$.layerPop({
							msg: '暂停成功！',
							time: 6,
							btn: ['确认']
						});
					}, function(ret) {
						console.log(ret);
						$.layerPop({
							msg: ret.Msg,
							time: 6,
							btn: ['确认']
						});
					});						
				}
			});
			break;

		// 开始服务
		case 4:
			ZZJINFO.ZZJInfomation.ZZJState = 0;
			$.layerPop({
				msg: '请确认开始服务',
				time: 6,
				yes: function() {
					AJAX.Admin.ChangeZZJInfomation( JSON.stringify(ZZJINFO), function(ret) {
						// console.log(ret);
						ServerStatus(0);
						$.layerPop({
							msg: '启动成功！',
							time: 6,
							btn: ['确认']
						});
					}, function(ret) {
						console.log(ret);
						$.layerPop({
							msg: ret.Msg,
							time: 6,
							btn: ['确认']
						});
					});
				}
			});
			break;
	}
}


/*
 * 系统检测
 */
function SysTemTest() {
	var ele = '#system-test';

	// 返回
	BackHide(ele);

	// 检测
	$(ele + ' .btns > .btn').on('click', function() {
		var $input = $(this).parents('.row-item').find('input.value');
		var type = $(this).data('type');
		ToolInspection($input, type);
	});
}

/*
 * 工具自检
 */
function ToolInspection($input, _type) {
	switch (_type) {
		case 0: // 报告单打印机
			ZZJPrinter.Print(BGDPRINTNAME, 800, 1200, false, function(Code, ID){
				if (Code == 0) { // 打印机正常
					$input.val('报告单打印机正常');
				} else {  // 打印机异常
					$input.val(ID);
			    }
		    });
			break;

		case 11: // 报告单打印机
			ZZJPrinter.Print(BGDPRINTNAME, 800, 1200, false, function(Code, ID){
				if (Code == 0) { // 打印机正常
					ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 18, 0, 0, 0, '报告单打印测试！！！报告单打印测试！！！报告单打印测试！！！');
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 18, 0, 0, 60, '报告单打印测试！！！报告单打印测试！！！报告单打印测试！！！');
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 18, 0, 0, 120, '报告单打印测试！！！报告单打印测试！！！报告单打印测试！！！');
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 18, 0, 0, 180, '报告单打印测试！！！报告单打印测试！！！报告单打印测试！！！');
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 18, 0, 0, 240, '报告单打印测试！！！报告单打印测试！！！报告单打印测试！！！');
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 18, 0, 0, 300, '报告单打印测试！！！报告单打印测试！！！报告单打印测试！！！');
			        ZZJPrinter.StartPrint(ID);
				} else {  // 打印机异常
					$input.val('打印异常：' + ID);
			    }
		    });
			break;

		case 1: // 凭条打印机
			ZZJPrinter.Print(PTJPRINTNAME, 300, 60, false, function(Code, ID){
				if (Code == 0) { // 打印机正常
					$input.val('凭条打印机正常');
			    } else { // 打印机异常
			        $input.val(ID);
			    }
		    });
			break;

		case 2: // 测试打印凭条
			ZZJPrinter.Print(PTJPRINTNAME, 300, 300, false, function(Code, ID){
				if (Code == 0) { // 打印机正常
					ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 18, 0, 0, 0, 'this  is  a 测试凭条！');
					ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 18, 0, 0, 40, 'this  is  a 测试凭条！');
					ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 18, 0, 0, 80, 'this  is  a 测试凭条！');
					ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 18, 0, 0, 120, 'this  is  a 测试凭条！');
					ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 18, 0, 0, 160, 'this  is  a 测试凭条！');
					ZZJPrinter.StartPrint(ID);
			    } else { // 打印机异常
			        $input.val('打印异常：' + ID);
			    }
		    });
			break;

		case 3: // 读卡器
			ReadCardDev.Close();                     // 关闭读卡器
			ReadCardDev.Open(DKQNAME, DKQCOM, function (x) {
				$input.val('读卡器正常');
		    }, function (x, y, z) {
		    	$.input('读卡器异常');
		    });
			break;

		case 4: // 发卡机
			FKQDev.H502_Close(); // 关闭
			FKQDev.H502_OpenCOM(ZKJCOM).then(function (iret) {
				console.log(iret)
				if (iret == 0) {
					FKQDev.H502_GetStatus().then(function (ret)  {
						var ResultInfo = JSON.parse(ret);
						console.log(ResultInfo)
						if (ResultInfo.MachineHondCard == 0) {
							FKQDev.H502_MoveCard(0x31).then(function (iret) {
								if (iret != 0) {
									$input.val('走卡失败，请联系管理员');
									return;
								};
							});

							var IsTrue = ResultInfo.MachineHondCard == 1 ? false : true;
							FKQDev.H502_ReadTracksCard(IsTrue).then(function (ret) {
								var ResultInfo = JSON.parse(ret);
								if (ResultInfo.Code == 0) {
									$input.val('读卡成功，卡号：' + ResultInfo.CardNo)
								} else {
									$input.val('读卡失败正在回收..');
									FKQDev.H502_MoveCard(0x33).then(function() {
										$input.val( '回收成功');
									});
								}
							});
						} else {
							$input.val('检测状态失败，正在回收...');
							FKQDev.H502_MoveCard(0x33).then(function() {
								$input.val( '回收成功');
							});
						}
					})
				} else {
					$input.val('证卡机打开失败');
				}
			});				
			break;

		case 12: // 测试发卡
			$input.val('功能暂未开放');
			break;

		case 5: // 身份证阅读
			var st = IDCardDev.Open(SFZYDQNAME,'D:/1.BMP','IdentityCreatCallBack');
			if (st == 0) {
				$input.val('身份证阅读正常');
			} else {
				$input.val('身份证阅读异常');
			}
			IDCardDev.Close();           // 关闭身份证阅读器
			function IdentityCreatCallBack(_st, _str) {
			};
			break;

		case 6: // pos 推杆
			AcsSwitch.OpenDev(COMPORT, function (_st) { // 打开机身电路控制板
		    	if (_st != 0) {
		    		$input.val('打开电路控制板失败');
		    	} else {
		    		AcsSwitch.SetAcs('C', 1, 3);     // 打开推杆 不能取值 1（闪烁） 硬件会坏 
		    		$input.val('打开推杆成功');
					setTimeout(function() {
						AcsSwitch.SetAcs('C', 1, 0); // 收回推杆
						$input.val('关闭推杆');
						setTimeout(function() {
							AcsSwitch.CloseDev();    // 关闭电路板连接
							$input.val('关闭电源成功');
						}, 15*1000);						
					}, 10*1000);
		    	}
		    });				
			break;

		case 7: // 纸币接收器
			ZBQDev.CloseZBQ();                 // 关闭纸币器
			var OpenResult = ZBQDev.OpenZBQ(ZBQNAME, ZBQCOM, '');
			if (OpenResult != 0) {
		    	$input.val('纸币器异常');
		    	ZBQDev.CloseZBQ();             // 关闭纸币器
		    } else {
				$input.val('纸币器正常');
				ZBQDev.CloseZBQ();             // 关闭纸币器
			}		    
			break;

		case 8: // 硬币自检
			OpenYBQ(function(st) {
				// console.log(st);
				$input.val(st == 0 ? '硬币器打开正常' : '硬币器打开失败');
				CoinInDev.Close();                // 禁止入硬币
			}, function() {});
			break;

		case 9: // 投币
			OpenYBQ(function(st) {
				// console.log(st);
				$input.val(st == 0 ? '硬币器打开正常' : '硬币器打开失败');
			}, function(_money, _st) {
				$input.val('入币：' + _money + '，状态：' + _st);
				CoinInDev.Close();                // 禁止入硬币
				if (_money == 1) {
					CoinOutDev.Coin1Out(YBQCOM, 9600, 1, function(code, st, msg) {
						$input.val('找零器找零：' + st + '个一元');
					});
				} else if (_money == 0.5) {
					CoinOutDev.Coin05Out(YBQCOM, 9600, 1, function(code, st, msg) {
						$input.val('找零器找零：' + st + '个5角');
					});
				}
			});
			setTimeout(CoinInDev.Close, 6000);
			break;

		case 10: // 条码扫描
			OpenBarCode(function(st) {
				// console.log(st);
				$input.val(st == 0 ? '条码扫描打开正常' : '条码扫描打开失败');
				QRScan.Close();                // 关闭条码扫描
			}, function() {});
			break;

		case 13: // 条码扫描自检
			OpenBarCode(function(st) {
				// console.log(st);
				$input.val(st == 0 ? '条码扫描打开正常' : '条码扫描打开失败');
				QRScan.Close();                // 关闭条码扫描
			}, function(ret) {
				var data = JSON.parse(ret);
				$input.val(data);
				QRScan.Close();                // 关闭条码扫描
			});
			setTimeout(QRScan.Close, 6000);
			break;
	}
}

/*
 * 硬币器打开
 */
var YBQCALLBACK;
function OpenYBQ(_callback, _ybcallback) {
	CoinInDev.Close();                // 禁止入硬币
	YBQCALLBACK = _ybcallback;
	var YBQ_st = CoinInDev.OpenCoinDev_In(YBQCOM, 9600, true, true, false, 'YBQCALLBACK'); // 打开硬币器
	if (typeof _callback == 'function')
		_callback(YBQ_st);
}

/*
 * 条码识别
 */
var BarCodeCallback;   // 触发事件的回调函数
function OpenBarCode(_callback, _tmcallback) {
	BarCodeCallback = _tmcallback;
	var st;
	try {
		st = QRScan.OpenScan(BARCODENAME, BARCODECOM,'BarCodeCallback');
	} catch(er) {console.log(er);}
	if (typeof _callback == 'function')
		_callback(st);
}


/*
 * 系统日志查询
 */
function SystemLogSearch() {
	var ele = '#system-log';

	// 返回
	BackHide(ele);

	// 日期插件
	var CurrentDate = $.formatDate(new Date().getTime()).substring(0, 10);
	$(ele + ' input[readonly].value').val(CurrentDate);
	$(ele + ' input[readonly].value').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        endDate: new Date(),
    	todayBtn: true,
        autoclose: true
    });

	// 默认查询系统日志
	ShowSystemLog(ele, CurrentDate);

    // 选择日志类型
    $('.btn-system, .btn-business').on('click', function() {
    	if (!$(this).hasClass('active')) {
    		$(this).changeActive();
    		var type = $(this).data('type');
	    	/*if (type == 1) {
	    		$(ele + ' .btn-affirm').hide();
	    		$(ele + ' .search').show();
	    	} else {
	    		$(ele + ' .btn-affirm').show();
	    		$(ele + ' .search').hide();
	    	}*/
	    	ShowLog(ele, type, '');
	    	var date = $(ele + ' input[readonly].value').val();
	    	if (type == 0) {
	    		ShowSystemLog(ele, date);
	    	} else {
	    		ShowSyBusinessLog(ele, date);
	    	}
    	}	    	
    });

    // 开启键盘输入流水号
    OpenKeyBar(ele, 0);
}

/*
 * 输出日志
 * @param ele 弹窗页标签元素
 * @param _type 类型
 * @param _num 流水号
 */
function ShowLog(ele, _type, _num) {
    // var date = $(ele + ' input[readonly].value').val();	
    var logs = '', title;
    if (_type == 0) {
		// logs = '系统日志：' + date;
		title = '系统日志';
	} else {
		// var SerialNum = $(ele + ' input.serial-num').val();
		// logs = '业务日志：' + SerialNum + ', 流水号：' + _num;
		title = '业务日志';
	}
	$(ele + ' .log-wrap .log .title').html(title);

	$(ele + ' .btn-affirm').unbind('click');
    $(ele + ' .btn-affirm').on('click', function() {
    	var date = $(ele + ' input[readonly].value').val();
    	if (_type == 0) {
    		ShowSystemLog(ele, date);
    	} else {
			ShowSyBusinessLog(ele, date);
		}
    	
    });		
}

/*
 * 系统日志
 * @param ele 目标元素标签
 * @param _date 日期
 */
function ShowSystemLog(ele, _date) {
	var date = _date.split('-');
	var FileName = date[0] + '年' + date[1] + '月' + date[2] + '日' + '.LOG';
	var isTrue = FileSystem.ExistsFile('D:/ZZJ/SystemLog/' + FileName);
	var text = '';
	if (isTrue) {
		text = FileSystem.ReadAllText('D:/ZZJ/SystemLog/' + FileName);
	} else {
		text = '没有查询到日志';
	}
    $(ele + ' .log-content').val(text);
}

/*
 * 业务日志
 * @param ele 目标元素标签
 * @param _date 日期
 */
function ShowSyBusinessLog(ele, _date) {
	var date = _date.split('-');
	var FileName = date[0] + '年' + date[1] + '月' + date[2] + '日' + '.LOG';
	var isTrue = FileSystem.ExistsFile('D:/ZZJ/UserLog/' + FileName);
	var text = '';
	if (isTrue) {
		text = FileSystem.ReadAllText('D:/ZZJ/UserLog/' + FileName);
	} else {
		text = '没有查询到日志';
	}
    $(ele + ' .log-content').val(text);
}


/*
 * 视频回放
 */
function VideoPlayBack() {
	var ele = '#video-playback';

	// 返回
	BackHide(ele);

	// 日期插件
	var CurrentDate = $.formatDate(new Date().getTime()).substring(0, 10);
	$(ele + ' .select-date input').val(CurrentDate);
	$(ele + ' .select-date input').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        endDate: new Date(),
    	todayBtn: true,
        autoclose: true
    });

    // 打开键盘输入识别号
    OpenKeyBar(ele, 1);

    // 播放速度
    $(ele + ' .select-speed input[type="radio"]').on('change', function() {
    	var val = $(ele + ' input[type="radio"]:checked').val();
    	console.log('当前播放速度：' + val);
    });

    // 播放操作
    $(ele + ' .btn-wrap .pull-right > .btn').on('click', function() {
    	var type = $(this).data('type');
    	console.log(type);
    	if (type == 4) {
    		VideoPlayer.Close('Player1');
			VideoPlayer.Close('Player2');
    	} else if (type == 0) {
    		VideoPlayer.Play('Player1');
    		VideoPlayer.Play('Player2');
    	} else if (type == 1) {
    		VideoPlayer.Pause('Player1');
    		VideoPlayer.Pause('Player2');
    	}
    });
}

/*
 * 开启键盘
 * @param ele 弹窗页标签元素
 * @param _type 类型
 */
function OpenKeyBar(ele, _type) {
	// 输入流水号
    $(ele + ' .btn-open').on('click', function() {
    	if (!$(this).hasClass('open')) {
    		$(this).html('关闭键盘');
    		ImportSerialNum(ele, _type, true);
    	} else {
    		$(this).html('打开键盘');
    		ImportSerialNum(ele, _type, false);
    	}
    	$(this).toggleClass('open');
    });
}


/*
 * 输入流水号
 * @param _ele 弹窗页标签元素
 * @param _type 类型
 * @param _isOpen 是否开始
 */
function ImportSerialNum(_ele, _type, _isOpen) {
	var $input = $(_ele + ' input.serial-num');
	if (_type == 1) {
		$input = $(_ele + ' input.discern-num');
	}
	var ele = '#import-number';

	// 计算 元素位置
	var pos = $input.offset();
	var top = pos.top + $input.height() + 5; 
	var right = $(document.body).width() - (pos.left + $input.outerWidth());

	if (_isOpen) {
		$(document.body).append(ImportNumberText);
		if (_type == 1) {
			$(ele).css({top: top, left: pos.left});
		} else {
			$(ele).css({top: top, right: right});
		}
		$(ele).slideDown();
		$(ele + ' li').on('click', function() {
			var type = $(this).data('type');
			var val = $input.val();
			var num = $(this).text();
			if (type == 0) {
				if (_type == 1) {
					var date = $(_ele + ' .select-date input').val();
					var lsh = ZZJINFO.ZZJInfomation.Name + '-' + date.replace(/\-/g, '') + '-' + val;
					var way = 'E:/video/' + date + '/' + lsh;
					var st = FileSystem.ExistsDir(way);
					if (st) {
						VideoPlayer.Close('Player1');
						VideoPlayer.Close('Player2');

					    VideoPlayer.NewPlayWindow('Player1', way + '/Camera0A.mp4', 220, 246, 500, 500);

					    VideoPlayer.NewPlayWindow('Player2', way + '/Camera0B.mp4', 730, 246, 500, 500);
					} else {
						$.layerPop({
							msg: '没有查询到数据！',
							time: 6,
						})
					}						

				} else {
					ShowLog(_ele, 1, val);
				}
			} else if (type == 1) {
				$input.val(val.substring(0, val.length - 1));
			} else {
				$input.val(val + num);
			}
		});
	} else {
		$(ele).slideUp('fast', function() {
			$(this).remove();
		});
	}
}


/*
 * 返回按钮 
 * @param ele 弹窗页 标签元素
 */
function BackHide(ele) {
	$(ele + ' .btn-back').on('click', function() {
		VideoPlayer.Close('Player1');
		VideoPlayer.Close('Player2');
		$(ele).attr('class', 'animated fadeOutUp');
		$('#import-number').remove();
		setTimeout(function() {
			$(ele).remove();
		}, 600);
	});
}


/*
 * 服务当前状态
 * @para _st 状态值
 */
function ServerStatus(_st) {
	if (_st == 0) {
		$('.pause-server').show();
	    $('.play-server').hide();
	} else {
		$('.pause-server').hide();
	    $('.play-server').show();
	}		
}


// 系统自检
var SystemTestText = '<div id="system-test" class="animated fadeInUp">'
			+ '<div class="content">'
			+ '<div class="top clearfix m-b-l">'
			+ '<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>'
			+ '</div>'
			+ '<div class="test-list">'
			+ '<div class="row-item">'
			+ '<span class="name">报告单打印机自检结果：</span>'
			+ '<input type="text" class="value">'
			+ '<div class="btns">'
			+ '<div class="btn" data-type="0">自检</div>'
			+ '<div class="btn" data-type="11">试打印</div>'
			+ '</div></div>'
			+ '<div class="row-item">'
			+ '<span class="name">凭条打印机自检结果：</span>'
			+ '<input type="text" class="value">'
			+ '<div class="btns">'
			+ '<div class="btn" data-type="1">自检</div>'
			+ '<div class="btn" data-type="2">试打印</div>'
			+ '</div></div>'
			+ '<div class="row-item">'
			+ '<span class="name">读卡器自检结果：</span>'
			+ '<input type="text" class="value">'
			+ '<div class="btns">'
			+ '<div class="btn" data-type="3">自检</div>'
			+ '</div></div>'
			+ '<div class="row-item">'
			+ '<span class="name">发卡机自检结果：</span>'
			+ '<input type="text" class="value">'
			+ '<div class="btns">'
			+ '<div class="btn" data-type="4">自检</div>'
			+ '<div class="btn" data-type="12">试打印</div>'
			+ '</div></div>'
			+ '<div class="row-item">'
			+ '<span class="name">身份证阅读器自检结果：</span>'
			+ '<input type="text" class="value">'
			+ '<div class="btns">'
			+ '<div class="btn" data-type="5">自检</div>'
			+ '</div></div>'
			+ '<div class="row-item">'
			+ '<span class="name">POS机推杆自检结果：</span>'
			+ '<input type="text" class="value">'
			+ '<div class="btns">'
			+ '<div class="btn" data-type="6">自检</div>'
			+ '</div></div>'
			+ '<div class="row-item">'
			+ '<span class="name">纸币接收器自检结果：</span>'
			+ '<input type="text" class="value">'
			+ '<div class="btns">'
			+ '<div class="btn" data-type="7">自检</div>'
			+ '</div></div>'
			+ '<div class="row-item">'
			+ '<span class="name">条码扫描器自检结果：</span>'
			+ '<input type="text" class="value">'
			+ '<div class="btns">'
			+ '<div class="btn" data-type="10">自检</div>'
			+ '<div class="btn" data-type="13">扫条码</div>'
			+ '</div></div>'
			+ '<div class="row-item">'
			+ '<span class="name">硬币接收找零自检结果：</span>'
			+ '<input type="text" class="value">'
			+ '<div class="btns">'
			+ '<div class="btn" data-type="8">自检</div>'
			// + '<div class="btn" data-type="9">投币</div>'
			+ '</div></div></div></div></div>';


// 系统日志
var SystemLogText = '<div id="system-log" class="animated fadeInUp">'
			+ '<div class="content">'
			+ '<div class="top clearfix">'
			+ '<div class="row-item pull-left">'
			+ '<span class="name">日期:</span>'
			+ '<input type="text" class="value" readonly placeholder="请选择日期">'
			+ '</div>'
			+ '<div class="btn btn-affirm pull-left m-l-l">确认</div>'
			+ '<div class="pull-right btn btn-back">返回 <i class="fa fa-reply"></i></div>'
			+ '</div>'
			+ '<div class="log-wrap m-t-l">'
			+ '<div class="top clearfix">'
			+ '<div class="pull-left">'
			+ '<div class="btn btn-system active" data-type="0">系统日志</div>'
			+ '<div class="btn btn-business" data-type="1">业务日志</div>'
			+ '</div>'
			+ '<div class="pull-right search">'
			+ '<div class="row-item">'
			+ '<span class="name">流水号：</span>'
			+ '<input type="text" class="value serial-num" placeholder="请输入流水号">'
			+ '<div class="btn btn-open m-l-l">打开键盘</div>'
			+ '</div></div></div>'
			+ '<div class="log">'
			+ '<h2 class="title">系统日志</h2>'
			+ '<textarea class="log-content"></textarea>'
			+ '</div></div></div></div>';

// 输入数字
var ImportNumberText = '<div id="import-number">'
			+ '<ul class="clearfix">'
			+ '<li>1</li><li>2</li><li>3</li><li>4</li>'
			+ '<li>5</li><li>6</li><li>7</li><li>8</li>'
			+ '<li>9</li><li>0</li><li data-type="1">删除</li><li data-type="0">确认</li>'
			+ '</ul></div>';

// 视频回放
var VideoPlayBackText = '<div id="video-playback">'
			+ '<div class="content">'
			+ '<div class="top clearfix">'
			+ '<div class="pull-left">'
			+ '<div class="row-item">'
			+ '<span class="name">识别号：</span>'
			+ '<input type="text" class="value discern-num" placeholder="请输入识别号">'
			+ '<div class="btn btn-open m-l-l">打开键盘</div>'
			+ '</div></div>'
			+ '<div class="pull-right btn btn-back">返回 <i class="fa fa-reply"></i></div>'
			+ '</div>'
			+ '<div class="vider-wrap clearfix m-t-l">'
			+ '<div class="pull-left person-video"><video src=""></video></div>'
			+ '<div class="pull-left money-video"><video src=""></video></div>'
			+ '</div>'
			+ '<div class="btn-wrap clearfix m-t-l">'
			+ '<div class="pull-left">'
			+ '<div class="select-date">'
			+ '<input type="text" class="lucid-input " placeholder="请选择日期" readonly>'
			+ '</div>'
			+ '<div class="select-speed">'
			+ '<label><input type="radio" name="speed" value="0" id="">慢速</label>'
			+ '<label><input type="radio" name="speed" value="1" checked="checked">正常</label>'
			+ '<label><input type="radio" name="speed" value="2" id="">快速</label>'
			+ '</div></div>'
			+ '<div class="pull-right">'
			+ '<div class="btn btn-play" data-type="0">播放</div>'
			+ '<div class="btn btn-pause" data-type="1">暂停</div>'
			// + '<div class="btn btn-prev" data-type="2">前一帧</div>'
			// + '<div class="btn btn-next" data-type="3">下一帧</div>'
			+ '<div class="btn btn-stop" data-type="4">停止</div>'
			+ '</div></div></div></div>';