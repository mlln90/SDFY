/*
 * 2018-04-05 01:26:35
 * hardware 硬件方法
 * Evan
 */

/*
 * 打开读卡器
 * @param _callback 成功回调
 */
function OpenDKQ(_callback) {
	try {
	    ReadCardDev.Open(DKQNAME, DKQCOM, function (x) {
	        $.Console('打开读卡器成功!');
	        if (typeof _callback == 'function') 
	        	_callback();
	    }, function (x, y, z) {
	    	$.Speak('打开读卡器失败请联系管理员');
	    	$.Writelog('读卡器打开失败');
			clearInterval(BackTimer);       // 清除定时返回
	    	$.tip('读卡器打开失败，请联系管理员！');
	    });
	} catch(er) {$.Console(er);}
}

// 读卡器检测是否有卡
function CheckDKQHasCard(_callback) {
	try {
        ReadCardDev.CheckCard(function(iRet) {
            if (iRet == -1) {
                $.Console('错误');
            }
            if (iRet == 0) {
                $.Console('无卡');
                // 允许进卡
            }
            if (iRet == 1) {
                // $.Console('有卡');
                if (typeof _callback == 'function')
                	_callback();
            }
        });
    } catch(er) { $.Console(er) }
}

// 读卡器读取卡号
function ReadDKQGetCardNum(_callback, _callback2) {
	try {
        ReadCardDev.ReadTracksBinary2(function (x, s1, s2, s3) {
            var CardNo = s3[1];
        	if (typeof _callback == 'function')
                _callback(CardNo);
        }, function (x, y) {
        	if (typeof _callback == 'function')
               _callback(x, y);
        })
    } catch(er) { $.Console(er) }
}

// 设置读卡器进卡
function SetDKQInCard(_num) {
    try {
        ReadCardDev.SetInCard(_num);    // 0 - 禁止进卡 1 允许进卡 
    } catch(er) {$.Console(er);}
}

// 设计读卡器位置
function SetDKQMoveCard(_num) {
    try {
        // 走卡位置ID: 0:前端不持卡 1:前端持卡 2:IC位 3:RF位 4:后端持卡 5:后端不持卡
        ReadCardDev.MoveCard(_num);
    } catch(er) { $.Console(er) }
}
/*----------------------------------*/


// 就诊卡插卡提示灯
function PluginCardIndicator() {
    try {       
        AcsSwitch.SetAcs('B', DKQTSD, 1);     // 闪烁
        setTimeout(function() {
            AcsSwitch.SetAcs('B', DKQTSD, 3); // 常亮
        }, 5000);
    } catch(er) { $.Console(er)};
}


// 关闭所以提示灯
function CloseIndicator() {
    try {
        AcsSwitch.CloseALL();
    } catch(er) { $.Console(er) }
}

// 推杆操作
function HandspikeTG(_num) {
    try {
        // 0 - 关闭 3 - 打开
        AcsSwitch.SetAcs('C', 1, _num);
    } catch(er) { $.Console(er) }
}
/*----------------------------------*/


// 打开身份证阅读器
function OpenIdentityReader() {
    // console.log('SFZTSD'+SFZTSD);
    if(ISBG == true){ SFZTSD = 6 };
    $.Writelog("身份证提示灯壁挂为第6路，台式为第7路");
    $.Writelog("身份证提示灯:"+SFZTSD);
    try {
        // 刷身份证 打开身份证阅读器
        AcsSwitch.SetAcs('B', SFZTSD, INDICATORTYPE); // 打开提示灯
        IDCardDev.Open(SFZYDQNAME, 'D:/1.BMP', 'IdentityCreatCallBack');    
    } catch(er) {$.Console(er);}
}

// 关闭身份证阅读器
function CloseIdentityReader() {
    try {
        AcsSwitch.SetAcs('B', SFZTSD, 0); // 关闭提示灯
        IDCardDev.Close();                // 关闭身份证阅读器
    } catch(er) { $.Console(er) }
}

/*
 * 身份证回调函数
 * @param _st 状态 0 -成功
 * @param _str 身份证信息字符串
 */
var IdentityCreatSucceedCallBack;
var IdentityInfo;
function IdentityCreatCallBack(_st, _str) {
	if (_st == 0) {
		var data = JSON.parse(_str);
		$.Console(data, '身份证信息');
		$.Writelog(' 身份证号：' + data.IDNo);
		$.Writelog(' 身份名字：' + data.Name);
		$.Writelog(' 身份性别：' + data.Sex);
		IdentityInfo = {
			Sex: data.Sex,
			DOB: data.Birthday,
            Birthday: data.Birthday,
			Age: $.Calculate(data.Birthday),
			IDNo: data.IDNo,
			Nation: data.Nation,
			Gender: $.CheckSex(data.IDNo),
			Address: data.Address,
			Balance: 0,
			ParentIDNo: data.IDNo,
			PatientName: data.Name,
			RelationName: data.Name,
            PatientID:''
		}
		if (typeof IdentityCreatSucceedCallBack == 'function')
			IdentityCreatSucceedCallBack();		
	} else {
		$.Speak('您的身份证件无效请重新办理');
		$.Writelog('证件无效');
		$.layer({
			msg: '您的身份证件无效，请重新办理！',
			btn: ['确认'],
			yes: $.TransformPage
		});
	}
	CloseIdentityReader();
};
/*----------------------------------*/


/*
 * 打开纸币器
 * @param _calStr 回调函数名字符串
 */
function OpenZBQ(_calStr) {
	var OpenResult = ZBQDev.OpenZBQ(ZBQNAME, ZBQCOM, _calStr);
    if (OpenResult != 0) {
    	$.Speak('纸币器打开失败请联系管理员');
		$.Writelog('纸币器打开失败！！！');
    	$.layer({
    		msg: '纸币器打开失败，请联系管理员！',
    		btn: ['确认'],
    		yes: ShowMainMenu
    	});
    	ZBQDev.CloseZBQ(); // 关闭纸币器
    } else {
    	$.Console('纸币器打开成功！');
    }
}

// 纸币器回调空函数
function RechargeOpenZBQ() {

}

/*
 * 开启现金充值
 * @param s 倒计时时间
 * @param $btn 确认按钮
 * @param $btns 操作按钮组
 * @param serial 流水号
 * @param back 定时返回函数
 */
var ZBQinterval; // 纸币器定时查询
function OpenCashRecharge(_param) {
	$.Console(_param, '调用纸币器参数');
	ZBQSWITCH = true;                            // 纸币器开关
    ZBQTOTALMONEY = 0;                           // 重置入钞总数
    try {
        ZBQDev.SetInMoney(INRMB);                    // 重置设置纸币器进钞类型
        AcsSwitch.SetAcs('B', ZBQTSD, 3);// 打开提示灯 入钞箭头
        AcsSwitch.SetAcs('B', 8, 3);                 // 打开提示灯 - 闪烁没效果 入钞板
    } catch(er) { $.Console(er) }
	$.Writelog('设置纸币器入钞！');

	StartRecord($.GetCurrentTime(3), _param.serial); // 开始录像

	clearInterval(ZBQinterval);       // 关闭纸币器定时
	ZBQinterval = setInterval(function() {
        var data;
        try {
            data = JSON.parse(ZBQDev.TakeMsg())
        } catch(er) { $.Console(er) }
		if (data && data != null && data.status != undefined) {
			if (data.status == 0 && ZBQSWITCH) {
				// console.log('请放入纸币');				
				_param.$btn.removeClass('btn-disabled');
			} else if (data.status == 1 && ZBQSWITCH) {
				// console.log('收钱中');
                _param.$btn.addClass('btn-disabled');
		    	if (_param.$btns.length) {
		    		_param.$btns.remove();
		    	}

		    	$.BackInterval(_param.s, _param.back)

		    } else if (data.status == 2 && ZBQSWITCH) {
		    	console.log('入钞金额' + data.money);
		    	$.Writelog('-----------ZB--------------');
		    	$.Writelog('纸币器接收金额：' + data.money);
		    	$.Writelog('-----------ZB--------------');
                ZBQTOTALMONEY += data.money;
                if (typeof _param.call == 'function') 
		    		_param.call(ZBQTOTALMONEY);
		    } else if (data.status == -1 && ZBQSWITCH) {
		    	$.Writelog('纸币器异常：' + data.msg);
		    }
		}
	}, 200);
}


// 关闭现金充值
function CloseCashRecharge() {
    AcsSwitch.SetAcs('B', ZBQTSD, 0); // 关闭提示灯
    AcsSwitch.SetAcs('B', 8, 0);      // 关闭提示灯
    ZBQDev.CloseInMoney();            // 禁止进钞
    CoinInDev.Close();                // 禁止入硬币

    clearInterval(ZBQinterval);       // 关闭纸币器定时
    ZBQSWITCH = false;                // 纸币器开关

    CloseRecord();                    // 关闭录像
    $.Writelog('纸币器禁止入钞！');
}

// 关闭纸币器
function CloseZBQ() {
    try {
        ZBQDev.CloseZBQ();
    } catch(er) { $.Console(er) }
}

/*
 * 开始录像
 * @param _date 日期
 * @param _SerialNumber 流水号
 */
function StartRecord(_date, _SerialNumber) {
	$.Console(arguments, '开启录像参数');
	$.Writelog('开始录像');
	var param = {
		Record: true,
        OutputDirectory: 'e:/video/' + _date + '/' + _SerialNumber + '/'
	}
	try {
    	VideoRecord.WriterConfig('D:/ZZJ/Record/Config.YAML', JSON.stringify(param));
	} catch(er) { $.Console(er) };
}

// 关闭录像
function CloseRecord() {
	$.Writelog('关闭录像');
    var param = {
		Record: false,
        OutputDirectory: ''
	}
	try {
    	VideoRecord.WriterConfig('D:/ZZJ/Record/Config.YAML', JSON.stringify(param));
	} catch(er) { $.Console(er) };
}
/*----------------------------------*/


// t12 读卡
function T12_ReadCard(_callback, _callback2) {
    try {
        FKQDev.T12_ReadTracksCardNormal(function (iret, bins, strs) {
            $.Console(strs, '证卡机读卡：');
            if (iret == 0) {
                if (typeof _callback == 'function')
                    _callback(iret, bins, strs);
            } else {
                if (typeof _callback2 == 'function')
                    _callback2(iret, bins, strs);
            }
        });
    } catch(er) { $.Console(er) }
}

// t12 打开
function T12_opendev() {
    try {
        FKQDev.T12_Tracks_Open2(ZKJNAME).then(function (ret) {
        // FKQDev.T12_Tracks_Open(ZKJNAME).then(function (ret) {
            $.Console(ret, 't12证卡机打开状态：');
            if (ret == 0) {
                if (typeof _callback == 'function')
                    _callback(ret);
            } else {
                if (typeof _callback2 == 'function')
                    _callback2(ret);
            }
        });
    } catch(er) { $.Console(er) }
}

// t12 读卡
function T12_ReadTracksCard() {
    console.log('读卡')
    try {
        FKQDev.T12_ReadTracksCardNormal(function (iret, bins, strs) {
            console.log(iret); // 状态
            console.log(bins);
            console.log(strs);
        });
    } catch(er) { $.Console(er) }
}

// t12 出卡
function T12_MoveCardToOut() {
    //走卡到出卡位
    //InternalIC:0x31 InternalRF:0x32 OutHold:0x30 OutUnhold:0x39 RecycleBox:0x33
    console.log(FKQDev.T12_MoveCard(0x39), '出卡');
}

// t12 检测
function T12_CheckCard(_callback, _callback2) {
    try {
        FKQDev.T12_CheckCard().then(function (ret) {
            console.log(ret)
            if (ret == 0) {
                if (typeof _callback == 'function')
                    _callback(ret);
            } else {
                if (typeof _callback2 == 'function')
                    _callback2(ret);
            }
        });
    } catch(er) { $.Console(er)}
}

// t12 走卡到读卡位
function T12_MoveCard(_callback, _callback2) {
    try {
        FKQDev.T12_MoveCard(0x32).then(function (ret) {
            console.log(ret)
            if (ret == 0) {
                if (typeof _callback == 'function')
                    _callback(ret);
            } else {
                if (typeof _callback2 == 'function')
                    _callback2(ret);
            }
        })
    } catch(er) { $.Console(er)}
}
/*----------------------------------*/

// 501  证卡机 打开操作
function Open501ZKJ(_IsTrue, _callback) {
    try {
        FKQDev.H502_Close(); // 关闭
        FKQDev.H501_OpenCOM(ZKJCOM).then(function (iret) {
            $.Writelog('501证卡机打开状态返回' + iret);
            $.Console(iret, '501证卡机打开状态');
            if (iret == 0) {
                ZKJSTATE = true;
                // Get502ZKJState(_IsTrue, _callback);
            } else {
                ZKJSTATE = false;
                $.Speak('证卡机打开失败，请联系管理员');
                $.Writelog('证卡机打开失败');
                $.layer({
                    msg: '证卡机打开失败，请联系管理员！',
                    btn: ['确认'],
                });
            }
        });            
    } catch(er) { $.Console(er) }
}

// 获取 502 证卡机状态
function Get502ZKJState(_IsTrue, _callback) {
    FKQDev.H502_GetStatus().then(function (ret)  {
        $.Writelog('检测证卡机状态返回' + ret);
        var ResultInfo = JSON.parse(ret);
        $.Console(ResultInfo, '检测证卡机状态返回');
        if (ResultInfo.MachineHondCard == 0) {
            if (ResultInfo.IsPrinterOK == 0) {
                FKQDev.H502_MoveCard(0x31).then(function (iret) {
                    $.Writelog('走卡返回' + iret);
                    $.Console(iret, '走卡返回');
                    if (iret != 0) {
                        $.Speak('走卡失败，请联系管理员');
                        $.Writelog('走卡失败');
                        $.layer({
                            msg: '走卡失败，请联系管理员！',
                            btn: ['确认'],
                            yes: ShowMainMenu
                        });
                        return;
                    };
                    ReadCardZKJ(true, _callback);
                });
            } else {
                ReadCardZKJ(false, _callback);
            }

            // var IsTrue = ResultInfo.MachineHondCard == 1 ? false : true;
            // var IsTrue = ResultInfo.IsPrinterOK == 1 ? false : true;
            // ReadCardZKJ(IsTrue, _callback);
        } else {
            ExitCardToRecycleBox(function() {
                if (_IsTrue) {
                    Ckeck502ZKJ(false, _callback);
                } else {                                
                    $.Speak('检测证卡机状态失败，请稍后再试');
                    $.Writelog('检测证卡机状态失败');                                    
                    $.layer({
                        msg: '检测证卡机状态失败，请稍后再试！',
                        btn: ['确认'],
                        yes: ShowMainMenu
                    });
                }
            });
        }
    })
}


// 证卡机读卡
function ReadCardZKJ(_IsTrue, _callback) {
    READCARDSTATE = false;
    // FKQDev.H502_ReadTracksCard(_IsTrue).then(function (ret) {
    FKQDev.H502_ReadTracksCard2().then(function (ret) {
        $.Writelog('证卡机读卡返回' + ret);
        var ResultInfo = JSON.parse(ret);
        $.Console(ResultInfo, '证卡机读卡返回');
        if (ResultInfo.Code == 0) {
            if (typeof _callback === 'function')
                _callback(ResultInfo);
        } else {
            $.Speak(ResultInfo.Msg);
            $.Writelog('读卡失败');                                 
            $.layer({
                msg: ResultInfo.Msg,
                btn: ['确认'],
                yes: ShowMainMenu
            });
        }
    });
}

// 50系列 打印出卡
function H502_PrintCard(_name) {
    var param = [
        {
            Str: _name,    // 文本
            Left: 18,           // 左，
            Top: 24,           // 上，
            Font: '微软雅黑',   // 字体名称，
            FontWidth: 26,     // 字体宽度：
            FontHeight: 61,    // 高度=17:40，
            Bold: true,        // 粗体，
            Italic: false,     // 斜体，
            UnderLine: false,  // 下划线，
            Deg: 0,            // 角度（0，0；1：90；2：180；,3：270）
        }
    ]

    $.Writelog(JSON.stringify(param))
    AcsSwitch.SetAcs('B', ZKJTSD, INDICATORTYPE);               // 打开指示灯 - 就诊卡出口	
    FKQDev.H502_PrintCard2(JSON.stringify(param)).then(function() {
        FKQDev.H502_MoveCard(0x39);
        setTimeout(function() {
            AcsSwitch.SetAcs('B', ZKJTSD, 0); // 打开指示灯 - 就诊卡出口
        }, 3000);
    })
}

// 绘制BMP图, 打印卡姓名和ID
function bmpCanvas() {
    var theCanvas = document.getElementById('bmp-canvas');
    var ca = theCanvas.getContext('2d');

    //绘制
    var gr = ca.createLinearGradient(0, 0, 258, 168);
    
    //文本
    var Paintname =  _name;
    var CardNo = _cardNo ;

    // 字体
    ca.font = 'bold 24px serif';

    // 获取文本距离
    var metrics = ca.measureText(Paintname); 

    // 获取文本的像素宽度
    var textWidth = metrics.width;

    // x 长度
    var xWidth = theCanvas.width;

    // x 中心点
    var xPosition = (xWidth / 2) - textWidth;

    // y 中心点
    var yPosition = theCanvas.height / 2;

    // 填充
    ca.textAlign = 'right';
    // ca.fillText(Paintname, xPosition-25, yPosition-5);
    ca.fillText(Paintname, xWidth - 10, yPosition + 25);
    // ca.fillText(CardNo, xWidth - 10, yPosition + 20);
    // ca.fillText(CardNo, xPosition-25, yPosition+20);

    var dataUrl = theCanvas.toDataURL("image/png").split(';')[0];
    var base64Arr =  theCanvas.toDataURL("image/png").split(';')[1];
    var base64 = base64Arr.split(',')[1];

    FileSystem.WriteImageFileFromBase64('D:/CardInfo.png', base64);

    // FKQDev.H502_PrintCard('D:/CardInfo.png');

    // 清除画布
    ca.clearRect(-xPosition, -yPosition, theCanvas.width/2, theCanvas.height/2);
}

// 退卡到回收盒
function ExitCardToRecycleBox(_callback) {
    try {       
        FKQDev.H502_MoveCard(0x33).then(function() {
            if (typeof _callback == 'function')
                _callback();
            $.Console(arguments, '退卡到回收盒');
        });
    } catch(er) { $.Console(er) }
}
/*----------------------------------*/


// 检测凭条 打印机
function CheckPrintDelectReceipt() {
    var St = 0;
    try {
        St = ThisWindow.DelectReceipt(); // 0 - 正常 1- 快用尽 3 -纸用完 -1 -故障
        $.Console(St, '凭条机状态返回');
        // console.log(St, '凭条机状态返回');
    } catch(er) {$.Console(er);}
    var PrintCode;
    try {
    	var text = FileSystem.ReadAllText('D:/ZZJ/CheckPrint/PrinterState.json');
		var PrintInfo = JSON.parse(text);
		var CodeStr = PrintInfo.PrinterStatus.split('CODE=');
		PrintCode = CodeStr[1].split(/\r\n/g)[0];
		// $.Writelog('打印机返回状态值：' + PrintCode);
		$.Console(PrintCode, '打印机状态');
    } catch(er) {$.Console(er);}
    
	var IsCheckError = false;
    $('.prompt-msg, #screen-prompt').remove();
    var text = '';

    switch (Number(PrintCode)) {
    	case 10006: 
    	case 40038:
    		text = '<div class="prompt-msg"><span>打印机墨粉即将用尽！请更换...</span></div>';
    		break;

    	case 40405:
    		text = '<div class="prompt-msg"><span>打印机墨盒已被拆卸！请联系管理员...</span></div>';
    		break;

    	case 30016:
    	case 60000:
    		text = '<div class="prompt-msg"><span>打印机内存溢出！请联系管理员...</span></div>';
    		break;

    	case 40010:
    	case 40309:
    		text = '<div class="prompt-msg"><span>打印机墨粉已用尽！请联系管理员...</span></div>';
    		break;

    	case 41213:
    		text = '<div class="prompt-msg"><span>打印机纸盒1纸已用尽！请更换...</span></div>';
    		break;

    	case 41313:
    		text = '<div class="prompt-msg"><span>打印机纸盒2纸已用尽！请更换...</span></div>';
    		break;

    	case 41913: 
    		text = '<div class="prompt-msg"><span>打印机纸已用尽！请联系管理员...</span></div>';
    		break;

    	case 60030:
    		text = '<div class="prompt-msg"><span>打印机不能打印！请联系管理员...</span></div>';
    		break;

		case 60152:
    		text = '<div class="prompt-msg"><span>打印机不可用！请联系管理员...</span></div>';
    		break;

    }

    if (St == 1) {
        text = '<div class="prompt-msg"><span>凭条打印纸即将用完，请注意更换！</span></div>';
    } else if (St == 3) {
        text = '<div id="screen-prompt"><div class="msg">凭条打印纸已用完，请联系管理员更换！</div></div>';
        $.Writelog(' 凭条打印纸已用完');
        IsCheckError = true;    	
    } else if (St == -1) {
        text = '<div id="screen-prompt"><div class="msg">凭条打印机故障，请联系管理员！</div></div>';
	    $.Writelog('凭条打印机故障');
        IsCheckError = true;
    }else if(St == 2){
        text = '<div id="screen-prompt"><div class="msg">凭条打印机缺纸，请联系管理员添加！</div></div>';
        $.Writelog('凭条打印机未装打印纸');
        IsCheckError = true;
    }

    if (IsCheckError) {
    	if ($('#home-page').length) {
        	$.ExitCardClearInfo();                 // 退卡
	    	setTimeout(function() {
                $('#home-page .handle-exit').remove();
                // $.CheckCardIsExist();              // 循环查卡
                SetDKQInCard(0);                   // 禁止进卡
	    	}, 300);
        }
    }
	$('.container').append(text);
}
/*----------------------------------*/

//人体感应回调
function BodyInductionBack(ret) {
	var data = JSON.parse(ret);
    // console.log(data);
	var num = data.Bank_I & 2;  // 获取 返回值的二进制 的第二位数值
	var st = num > 0;           // 转换成布尔类型
    // console.log(st);
	if (INTERACTIONSTATE == st) return;
    INTERACTIONSTATE = st;
	if (INTERACTIONSTATE) {
		// if ($('#home-page').length && !CardInfo.Info) {
        if ( !CardInfo.CardInfo ) {
			// $.Speak('请选择您要办理的业务');
			$.Writelog('人体感应：感应到有人');
		}
	} else {
        if (!CardInfo.CardInfo) 
            // $.Speak('祝您早日康复');
        $.Writelog('人体感应：感应到无人');
	}
}
/*----------------------------------*/

/*
 * 条码感应识别
 */
var BarCodeCallback;   // 触发事件的回调函数
function OpenBarCode(_callback) {
    QRScan.Close2();
    BarCodeCallback = _callback;
    // console.log('ISBG:'+ISBG);
    $.Writelog("是否为壁挂机:"+ISBG);
    if(ISBG == true){ BARCODECOM = 4; };       // 壁挂COM口是 4  台式的是 7
    console.log(BARCODENAME);                  // 条形机型号  XN200
    console.log(BARCODECOM);
    var st;
    try {
        st = QRScan.OpenScan(BARCODENAME, BARCODECOM,'BarCodeCallback');
    } catch(er) {console.log(er);}
    if (st != 0) {
        $.Speak('条码扫描机打开失败');
        $.Writelog('条码扫描机打开失败');
        $.layer({
            msg: '条码扫描机打开失败！',
        });
    }
}
