/* 2017-12-19 17:02:06 */


/*
 * 获取自助机服务器时间
 * @param _callback 回调
 */
function QueryZZJTime(_callback) {
	AJAX.Business.QueryZZJTime(function(ret) {
		// console.log(ret);
		if (typeof _callback == 'function')
			_callback(ret);
	}, AjaxRequestError, AjaxConnectorError);
}

/*
 * 获取HIS服务器机时间
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function QueryHISTime(_callback, _callback2) {
	var param = {
		ZZJCertificate: ZZJCertificate
	}
	AJAX.Business.QueryHISTime(JSON.stringify(param), function(ret) {
		if (typeof _callback == 'function')
			_callback(ret);
	}, _callback2, AjaxConnectorError);
}

/*
 * 获取 自助机信息 - 自动添加
 * @param _callback 成功回调
 */
function GetZZJInfo(_callback) {
	var param = {
		'ZZJCertificate'  : ZZJCertificate,
		'AdminCertificate': {}
	}
	// console.log("查询自助机信息接口入参",param);
	AJAX.Admin.QueryZZJInfomation( JSON.stringify(param), function(ret) {
		$.Console(ret, '获取自助机信息错误');
		$.Writelog(ret.Msg);
		$.layer({
			msg: ret.Msg
		});
	}, function(ret) {
		console.log(ret);
		MainMenuConfig = ret.ZZJInfomation.ModuleConfig.ModuleConfigs;
		MainMenuConfig = $.ModuleGrouping(MainMenuConfig);
		$.Console(MainMenuConfig, '模块转换数据');
		console.log(MainMenuConfig);
		var data = ret.ZZJInfomation;
		if (data.ZZJID != -1) {
			HOSPITALTYPE = data.DistrictID;
			ZZJInfomation = data;
			ZZJCertificate.ZZJID = data.ZZJID;			
			// CheckGlobalParam(ret.ZZJInfomationExtension);
			if (typeof _callback == 'function')		
				_callback();
		} else {
			var param = {
				ZZJCertificate: ZZJCertificate,
				ZZJInfomation:{
					Name: MachineInfo.GetMAC(),
					Mobile  :'13802205425',
					MACs: [ZZJCertificate.MAC]
				}				
			};
			AJAX.Admin.NewZZJInfomation(JSON.stringify(param), function(ret) {
				$.Console(ret, '添加新自助机信息错误');
				$.Writelog(ret.Msg);
			}, function(ret) {
				// console.log(ret);
				if (ret.ResultCode == 0) {
					GetZZJInfo();
				} else {
					$.layer({
						msg: '自助机添加名称失败'
					});
				}
			}, function(ret){
				console.log(ret)
			});
		}
	}, function(ret){
		$.Writelog('服务器网络出错');
		$.tip('网络故障，服务暂停');
	});
}

// 获取自助机硬件配置
function GetDeviceConfig() {
	// 获取当前硬件配置
	var param = {
    	TableID: ZZJInfomation.DeviceConfigTable.ID
    }
    AJAX.Admin.QueryDeviceConfigTable( JSON.stringify(param), function(ret) {
    	// console.log(ret);
    	var data = ret.DeviceConfigTable.DeviceInfomations;
    	JudgeHardwareModel(data);                 // 判断硬件型号
    	InitHardwareOperate();                    // 初始化硬件操作
    }, function(ret) {
    	$.Console(ret, '获取自助机硬件错误');
    	try {
    		$.Speak('' + ret.Msg);
    	} catch(er) {console.log(er);}
    	$.layer({
    		mag: ret.Msg
    	});
    });
}

/*
 * 检测模块使用时间
 * @param _callback 回调
 */
function CheckModuleUseTime(_callback) {
	var param = {
		TableID: ZZJInfomation.ModuleConfig.ID
	}

	AJAX.Admin.QueryModuleConfigTable(JSON.stringify(param), function(ret) {
		$.Console(ret, '模块配置');
		MainMenuConfig = ret.ModuleConfigTable.ModuleConfigs;
		MainMenuConfig = $.ModuleGrouping(MainMenuConfig, HOSPITALTYPE);
		if (typeof _callback == 'function')
			_callback();
		if (NETWORKST >= 3) {
			NETWORKST = 0;
			clearInterval(CheckMainTimer);           // 清除暂停服务定时
			var text = $('.pop-tip').text();
			if ($('.pop-tip').length && text.indexOf('网络故障') > -1) {				
				ShowMainMenu();                        // 初始化主菜单
				ReadCardDev.SetInCard(1);              // 允许进卡
				// setTimeout($.CheckCardIsExist, 300);   // 循环查卡
			}
		} else {			
			NETWORKST = 0;
		}
	}, function(ret) {
		$.Console(ret, '检测模块使用时间错误');
		if (typeof _callback == 'function')
			_callback();
	}, function(ret, st, err) {
		// console.log(ret, st, err);
		NETWORKST++;
		if (NETWORKST >= 3) {
			if ($('#main-menu').length) {
		    	$.ExitCardClearInfo();                 // 退卡
		    	setTimeout(function() {
		    		ReadCardDev.SetInCard(0);        // 禁止进卡
		    	}, 300);		    	
		    	$.tip('网络故障，服务暂停');
		    } else {
		    	CheckNetWork();    	
		    }
		}
	});
}


/*
 * 定时检测服务时间
 * @param _IsTrue 是否第一次调用
 * @param _callback 回调
 */
var CheckMainTimer;
function CheckServicingTime(_IsTrue, _callback) {
	var param = {
		TableID: ZZJInfomation.UseTimeSegmentConfig.ID
	}
	// 查询单台工作时间段
	AJAX.Admin.QueryWorkTimeSegmentConfigTable(JSON.stringify(param), function(ret) {
		console.log(ret);
		$.Console(ret, '检测服务器时间错误');
	}, function(ret) {
		// console.log(ret);
		if(ret.Code == '0'){
			var data = ret.UseTimeSegmentConfig.WorkTimeSegments;
			var enabled = ret.UseTimeSegmentConfig.WorkTimeSegments[0].Enabled;
			var tmp = new Date().getTime();
			var st = $.GetCheckCurrentTime(data, tmp);
			
			if (typeof _callback == 'function')
				_callback();

			if (st && ZZJInfomation.ZZJState == 0 && enabled == true) {
				clearInterval(CheckMainTimer);             // 清除暂停服务定时
				var text = $('.pop-tip').text();
				if ($('.pop-tip').length && text.indexOf('服务暂停') > -1 || _IsTrue) {				
					ShowMainMenu();                        // 初始化主菜单
					// setTimeout($.CheckCardIsExist, 300);   // 循环查卡
				}
		    } else {
		    	if ( $('#main-menu').length || _IsTrue) {
		    		if ($('.pop-tip').length && text.indexOf('服务暂停') > -1 ) {	
		    			return;
		    		}
		    		$.ExitCardClearInfo();                 // 退卡
			    	setTimeout(function() {
			    		try {
			    			ReadCardDev.SetInCard(0);      // 禁止进卡
			    		} catch(er) {$.Console(er);;}
			    	}, 300);
			    	var tmp = new Date().getTime();
					var time = $.GetCheckCurrentTime(data, tmp, 1);
					var text;
					if (ZZJInfomation.ZZJState != 0) {
						text = '';
					} else if (time.length > 0) {
						// var hour = time[0].StartTime.split('T')[1];
						var hour = time.StartTime;
						text = hour + ' 开启！';
					} else {
						time = $.GetCheckCurrentTime(data, tmp, 2);
						if (time.StartTime) {						
							// var hour = time.StartTime.split('T')[1];
							var hour = time.StartTime;
							text = '次日 ' + hour + ' 开启！';
						} else {
							// text = '次日开启！';
							text = '';
						}
					}
					$.tip('服务暂停！'  + text);
			    } else {
			    	CheckMainIsTrue(data);
			    }
		    }
		}else{
			console.log(ret.Msg)
		}
	}, function(){
		$.Writelog('服务器网络出错');
		$.tip('网络故障，服务暂停');
	});
}


/*
 * 办卡
 * @param ele 当前页面标签元素
 * @param _type 办卡类型
 * @param _callback 回调
 * @param _callback2 失败回调
 * @param _callerror 报错回调
 */
function CreateCardSubmit(_type, _callback, _callback2, _callerror) {
	var info = CreateCardInfo.PatientInfo;
	var CardNo = CreateCardInfo.Info.CardNo;
	var SerialNumber = CreateCardInfo.SerialNumber;
    var param = {
        CardInfo: {
            CardNo: CardNo,                // 就诊卡号
            CardType: 1,                   // 卡类型 0就诊卡
            PassNo: null                   // 卡验证密码 可传null
        },
        PatientInfo: {
            PatientName: info.PatientName, // 患者姓名
            RelationName: info.RelationName, // 监护人姓名
            PatientID: null,               // 病历号，传null
            AccountID: null,               // 病人账户，可传null
            IDNo: info.IDNo,               // 患者身份证号
            ParentIDNo: info.IDNo,         // 监护人身份证号
            Pattern: _type,                // 办卡类型 1 - 儿童 2 - 成人
            IDType: -1,                    // 证件类型，可传null
            Mobile: info.Mobile,           // 患者手机号
            relationPhone: info.Mobile,    // 监护人手机号
            Gender: info.Gender,           // 性别  1女  2男
            Address: info.Address,         // 地址
            Nation: info.Nation,           // 名族
            PatientType: -1,               // 患者类型，可传null
            MarryStatus: -1,               // 婚姻状态，可传null
            Balance: null,                 // 账户金额，可传null
            Profession: null,              // 专业，可传null
            DOB: info.DOB,                 // 出生日期 yyyy-MM-dd
            Age: info.Age,                 // 年龄，可传null
            OldCardType: null,             // 旧卡类型，可传null
            PactCode: null                 // 合同单位
        },
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: SerialNumber,        // 自助机流水号
    };
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}

    AJAX.Business.CreateCard(param, _callback, _callback2, _callerror);
}


/*
 * 获取用户信息
 * @param _CardNo 卡号
 * @param _callback 回调
 * @param _callback2 失败回调
 * @param _callerror 报错回调
 */
function QueryPatientInfo(_CardNo, _callback, _callback2, _callerror) {
    var param = {
        CardInfo: {
            CardNo: _CardNo,               // 就诊卡号
            CardType: 1,                   // 卡类型 1就诊卡
            PassNo: null                   // 卡验证密码 可传null
        },
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: $.GetSerial(),       // 自助机流水号
    }
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
    AJAX.Business.QueryPatientInfoByCardNo(param, _callback, _callback2, _callerror);
}

/*
 * 信息补录
 * @param _Card 卡信息
 * @param _callback 回调
 * @param _callback2 失败回调
 * @param _callerror 报错回调
 */
function InformationCollection(_Card, _callback, _callback2, _callerror) {
	var hosCardNoFlag = _Card.Info.hosCardNoFlag;
	var CardNo = _Card.Info.CardNo;
	var info = _Card.PatientInfo;
    var param = {
        CardInfo: {
            CardNo: CardNo,                // 就诊卡号
            CardType: 1,                   // 卡类型 1就诊卡
            PassNo: null,                  // 卡验证密码 可传null
            hosCardNoFlag: hosCardNoFlag,  // 1-儿童 2-成人
        },
        PatientInfo: {
            Mobile: info.Mobile,                // 患者手机号
            IDNo: info.IDNo,                    // 患者身份证号
            ParentIDNo: info.ParentIDNo ,       // 监护人身份证号
            RelationName: info.RelationName,    // 监护人姓名
            relationPhone: info.relationPhone , // 监护人手机号
        },
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: $.GetSerial(),       // 自助机流水号
    }
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
    AJAX.Business.InformationCollection(param, function(ret) {
        if (typeof _callback == 'function')
			_callback(ret);
	}, _callback2, _callerror);
}

/*
 * 发票查询
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function ReceiptCheck(_callback, _callback2) {
	var Serial = CardInfo.SerialNumber;
    var param = {
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: Serial,              // 自助机流水号
    }
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
    AJAX.Business.ReceiptCheck(param, _callback, _callback2, AjaxConnectorError);
}


/*
 * 就诊卡充值
 * @param _money 充值金额
 * @param _TranTy 充值方式
 * @param _callback 回调
 * @param _callback2 失败回调
 * @param _callerror 报错回调
 */
function CardByRecharge(_money, _TranTy, _callback, _callback2, _callerror) {
	var SerialNumber = CardInfo.SerialNumber;
	var param = {
		CardInfo: CardInfo.Info,           // 就诊卡信息
		PatientInfo: CardInfo.PatientInfo, // 患者信息
		TransactionInfo: {                 // 交易信息 暂时不可用 都传 null
            TransactionMode: _TranTy,      // 充值方式 1-银行卡 3-现金
            TransactionType: -1,
            Amount: _money,                // 充值金额
            TransactionSerialNumber: null,
            YBiRet: -1,
            POSiRet: -1,
            TransactionInfoEx: null
        },
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: SerialNumber,        // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.CardByRecharge(param, _callback, _callback2, _callerror);
}

/*
 * 查询科室类型
 * @param _type 挂号类型 0-挂号 1-预约挂号
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function QueryGhType(_type, _callback, _callback2) {
	var SerialNumber = CardInfo.SerialNumber;
	var param = {
		GHInfo: {
			GhType: _type                  // 挂号类型 0-挂号 1-预约
		},
		ZZJCertificate: ZZJCertificate,    // 自助机信息
	    SerialNumber: SerialNumber,        // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.QueryGhType(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 查询科室列表
 * @param _type 挂号类型值
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function QueryDepartments(_param, _callback, _callback2) {
	var Serial = CardInfo.SerialNumber;
	var param = {
		GHType: {
			typeId: _param.type,           // 挂号类型值 0=普通，1=急诊，2=专家
			queryId: _param.queryId,       // 查询类别0全部，1科室，2医生（直接传0）
		},
		ParentDepartment: {
			deptId: _param.deptId,         // 科室代码
		},
		ZZJCertificate: ZZJCertificate,    // 自助机信息
	    SerialNumber: Serial,              // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.QueryDepartments(param, _callback, _callback2, AjaxConnectorError);
}


/*
 * 挂号预结算
 * @param _type 挂号类型值
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function RegisteredBudget(_param, _callback, _callback2) {
	var Serial = CardInfo.SerialNumber;
	var param = {
		PatientInfo: CardInfo.PatientInfo, // 患者信息
		GHType: {
			typeId: _param.type,           // 挂号类型值 0=普通，1=急诊，2=专家
		},
		ParentDepartment: {
			deptId: _param.deptId,         // 科室代码
			doctorId: _param.doctorId,     // 医生代码
			schedulingSequenceNum: _param.Sequence,  // 挂号序号
		},
		ZZJCertificate: ZZJCertificate,    // 自助机信息
	    SerialNumber: Serial,              // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.RegisteredBudget(param, _callback, _callback2, AjaxConnectorError);
}


/*
 * 挂号结算
 * @param _type 挂号类型值
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function RegistrationSettlement(_param, _GHInfo, _callback, _callback2) {
	var Serial = CardInfo.SerialNumber;
	var param = {
		PatientInfo: CardInfo.PatientInfo, // 患者信息
		GHType: {
			typeId: _param.type,           // 挂号类型值 0=普通，1=急诊，2=专家
		},
		GHInfo: {
			receiptNo: _GHInfo.receiptNo,  // 预结算返回 数据号
			IsHealthCare: _GHInfo.IsHealthCare,  // 预结算返回 是否医保
		},
		ParentDepartment: {
			deptId: _param.deptId,         // 科室代码
			doctorId: _param.doctorId,     // 医生代码
		},
		ZZJCertificate: ZZJCertificate,    // 自助机信息
	    SerialNumber: Serial,              // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.RegistrationSettlement(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 查询缴费列表
 * @param _Card 就诊卡信息
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function BillInfoByAdmInfo(_callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		CardInfo: CardInfo.Info,               // 就诊卡信息
		PatientInfo: CardInfo.PatientInfo,     // 患者信息
		ZZJCertificate: ZZJCertificate,        // 自助机信息
	    SerialNumber: Serlal,                  // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.BillInfoByAdmInfo(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 查询缴费详情
 * @param _param 挂号数据
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function BillInfoByDetail(_param, _callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		CardInfo: CardInfo.Info,               // 就诊卡信息
		PatientInfo: CardInfo.PatientInfo,     // 患者信息
		PrescriptionInfo: {
			prescriptionNo: _param.PreNo,      // 处方号
		},
		ZZJCertificate: ZZJCertificate,        // 自助机信息
	    SerialNumber: Serlal,                  // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.BillInfoByDetail(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 处方预结算
 * @param _param 缴费处方数据
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function PayCostBudget(_param, _callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		CardInfo: CardInfo.Info,               // 就诊卡信息
		PatientInfo: CardInfo.PatientInfo,     // 患者信息
		PrescriptionInfo2: {
			tempLi: _param.PreInfo,            // 缴费数据 - 数组
		},
		ZZJCertificate: ZZJCertificate,        // 自助机信息
	    SerialNumber: Serlal,                  // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.PayCostBudget(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 处方结算
 * @param _param 预结算返回数据
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function InsertBankTradeInfo(_param, _callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		CardInfo: CardInfo.Info,               // 就诊卡信息
		PatientInfo: CardInfo.PatientInfo,     // 患者信息
		JFRetInfo: _param,                     // 预结算返回
		ZZJCertificate: ZZJCertificate,        // 自助机信息
	    SerialNumber: Serlal,                  // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.InsertBankTradeInfo(param, _callback, _callback2, AjaxConnectorError);
}


/*
 * 查询消费记录
 * @param _param 查询时间参数
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function BillGetByDetail(_param, _callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		CardInfo: CardInfo.Info,           // 就诊卡信息
		PatientInfo: CardInfo.PatientInfo, // 患者信息
		Time: {			
			dateStart: _param.dateStart,   // 开始时间
			dateEnd: _param.dateEnd,       // 结束时间
		},
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: Serlal,              // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.BillGetByDetail(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 查消费详情
 * @param _param 预结算返回数据
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function BillCXDetial(_param, _callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		CardInfo: CardInfo.Info,          // 就诊卡信息
		PatientInfo: CardInfo.PatientInfo,// 患者信息
		ACFList: {
			ReceiptNo: _param.ReceiptNo,  // 收据号
		},
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: Serlal,              // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.BillCXDetial(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 查询充值记录
 * @param _param 查询时间参数
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function QueryRecharge(_param, _callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		CardInfo: CardInfo.Info,           // 就诊卡信息
		Time: {			
			dateStart: _param.dateStart,   // 开始时间
			dateEnd: _param.dateEnd,       // 结束时间
		},
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: Serlal,              // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.QueryRecharge(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 住院患者信息查询
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function GetZYPatientInfo( _callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		CardInfo: CardInfo.Info,           // 就诊卡信息
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: Serlal,              // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.GetZYPatientInfo(param, _callback, _callback2, AjaxConnectorError);
}


/*
 * 住院充值
 * @param _money 充值金额
 * @param _callback 回调
 * @param _callback2 失败回调
 * @param _callerror 报错回调
 */
function AddIPPatDeposit(_money, _callback, _callback2, _callerror) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		ZYJLInfo: CardInfo.ZYJLInfo,       // 住院信息
		TransactionInfo: {
			Amount: _money,               // 充值金额
		},
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: Serlal,              // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.AddIPPatDeposit(param, _callback, _callback2, _callerror);
}

/*
 * 住院日清单查询
 * @param _param 查询时间参数
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function DHCQueryRQD(_param, _callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		ZYJLInfo: CardInfo.ZYJLInfo,       // 住院信息
		Time: {			
			dateStart: _param.dateStart,   // 开始时间
			dateEnd: _param.dateEnd,       // 结束时间
		},
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: Serlal,              // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.DHCQueryRQD(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 查询物品
 * @param _param 查询时间参数
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function QueryByDrug(_param, _callback, _callback2) {
	var Serial = CardInfo.SerialNumber;
	var param = {
		DrugQueryRu: {
			DrugQuery: _param.type,       // 物品类型 0-项目 1-药品
			StartNumber: _param.startNum, // 开始页码序号
			EndNumber: _param.endNum,     // 结束页码序号
		},
        ZZJCertificate: ZZJCertificate,   // 自助机信息
        SerialNumber: Serial,             // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.QueryByDrug(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 体检查询
 * @param _identity 身份证号
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function GQueryByPhysicalRecord(_identity, _callback, _callback2) {
	$.ajax({
		url: TJCX_PATH + '/tjgl/getrecord?idcard=' + _identity,
		success: function(ret, status, error) {
			if (ret.resultcode == 0) {
				if (typeof _callback == 'function')
					_callback(ret);
			} else {
				if (typeof _callback2 == 'function')
					_callback2(ret);
			}
		},
		error: AjaxConnectorError
	});
}

/*
 * 体检查询明细
 * @param _serial 体检编号
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function GQueryByPhysicalDetailes(_serial, _callback, _callback2) {
	$.ajax({
		url: TJCX_PATH + '/tjgl/getreport?tjbh=' + _serial,
		success: function(ret, status, error) {
			if (ret.resultcode == 0) {
				if (typeof _callback == 'function')
					_callback(ret);
			} else {
				if (typeof _callback2 == 'function')
					_callback2(ret);
			}
		},
		error: AjaxConnectorError
	});
}

/*
 * 满意度调查
 * @param _serial 体检编号
 * @param _callback 回调
 * @param _callback2 失败回调 
 */
function SatisfactionInquirySubmit(_serial, _callback, _callback2) {
	var Serial = CardInfo.SerialNumber;
	var param = {
		Satisfaction: {
			DrugQuery: _param.type,       // 物品类型 0-项目 1-药品
			StartNumber: _param.startNum, // 开始页码序号
			EndNumber: _param.endNum,     // 结束页码序号
		},
        ZZJCertificate: ZZJCertificate,   // 自助机信息
        SerialNumber: Serial,             // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.Satisfaction(param, _callback, _callback2, AjaxConnectorError);
}
/*---------------------------------------*/











/*
 * 查询排班医生
 * @param _Card 就诊卡信息
 * @param _param 挂号数据
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function QuerySchedules(_Card, _param, _callback, _callback2) {
	var param = {
		CardInfo: _Card.Info,                  // 就诊卡信息
		GHInfo: {
			QueryGhDoct: _param.QueryGhDoct,   // 医生类别 1-菩提 2-专家
			QueryGhType: _param.QueryGhType,   // 挂号类型值
			deptId: _param.deptId,             // 科室ID
		},
		ZZJCertificate: ZZJCertificate,        // 自助机信息
	    SerialNumber: _param.Serlal,           // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.QuerySchedules(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 当日挂号
 * @param _Card 就诊卡信息
 * @param _param 挂号类型值
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function DengesRegister(_Card, _param, _callback, _callback2) {
	var Serlal = CardInfo.SerialNumber;
	var param = {
		CardInfo: _Card.Info,                  // 就诊卡信息
		GHInfo: {
			deptId: _param.deptId,             // 科室ID
			typeId: _param.typeId,             // 科室类别 1-普通 2-专家
			doctorId: _param.doctorId,         // 医生ID
			registerTotalFee: _param.TotalFee, // 挂号金额
		},
		ParentDepartment: {			
			schedulingSequenceNum: _param.Noon,// 挂号午别
		},
		GHDoct: {
			feeList: [
				{
					feeName: '挂号费',         // 费用名称
					optional: 1,             
					fee: _param.RegFee,        // 费用金额
				}, {
					feeName: '诊疗费',         // 费用名称
					optional: 1,             
					fee: _param.DiagFee,       // 费用金额
				}, {
					feeName: '专家费',         // 费用名称
					optional: 1,             
					fee: _param.SpeFee,        // 费用金额
				}
			]
		},
		ZZJCertificate: ZZJCertificate,        // 自助机信息
	    SerialNumber: Serlal,                  // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.DengesRegister(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 查询挂号记录
 * @param _Card 就诊卡信息
 * @param _start 开始时间
 * @param _end 结束时间
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function QueryRegister(_Card, _start, _end, _callback, _callback2) {
	var param = {
		CardInfo: _Card.Info,              // 就诊卡信息
		Time: {			
			dateStart: _start,             // 开始时间
			dateEnd: _end,                 // 结束时间
		},
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: $.GetSerial(),       // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.QueryRegister(param, _callback, _callback2, AjaxConnectorError);
}


/*
 * 查询打印列表
 * @param _Card 就诊卡信息
 * @param _callback 回调
 * @param _callback2 失败回调
 */
function QueryOutPatReportList(_Card, _callback, _callback2) {
	var param = {
		CardInfo: _Card.Info,              // 就诊卡信息
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: $.GetSerial(),       // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.QueryOutPatReportList(param, _callback, _callback2, AjaxConnectorError);
}

/*
 * 添加打印数量
 * @param _sum 打印数量
 */
function AddReport(_sum) {
	var param = {
		HYDSum: {
			Sum: _sum                      // 打印数量
		},
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: $.GetSerial(),       // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}
	AJAX.Business.AddReport(param, function(ret) {
        console.log(ret);
	});
}

/*
 * 调用银联交易
 * @param _type 操作类型 01-消费 02-消费撤销 03-查询
 * @param _Cost 交易金额
 * @param _Card 就诊卡信息
 * @param _callback 回调
 * @param _callback2 失败回调 
 */
function CallMachineWPOS(_type, _Cost, _Card, _callback, _callback2) {
	var Serlal = _Card.SerialNumber;
	var param = {
		CardInfo: _Card.Info,               // 就诊卡信息
		PatientInfo: _Card.PatientInfo,     // 患者信息
        ZZJCertificate: {
        	ZZJID: ZZJCertificate.ZZJID,
        	MAC: ZZJCertificate.MAC,
        	SerialNumber: Serlal            // 自助机流水号
        },    // 自助机信息
        InvokePosDoSale: {
			Amount: _Cost,                  // --消费金额
			Trans: _type,                   // --交易方式  01 消费 02 消费撤销 03 查询
		},
		TransactionMode: {
			TransactionMode: 0,             //  门诊0 住院1
		}
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}

    setTimeout(function() {
    	var Result;
        if (_type == '01') {
        	Result = MachineWPOS.LanZhouMisPosDoSales(JSON.stringify(param)); // 交易
        } else if (_type == '03') {
        	Result = MachineWPOS.LanZhouMisPosCXYE(JSON.stringify(param));    // 查询
        }
        try {
	    	$.Writelog(Result);
	    } catch(er) {$.Console(er)}
		var data = JSON.parse(Result);
		if (data.ResultCode == 0) {
			if (_type == '01') UnionPtint()
			_callback(data);
		} else {
			_callback2(data);
		}
    }, 500);
}

/*
 * 银联充值
 * @param _Card 就诊卡信息
 * @param _TranTy 银联交易返回数据
 * @param _callback 回调
 * @param _callback2 失败回调
 * @param _callerror 报错回调
 */
function RechargePos(_Card, _TranTy, _callback, _callback2, _callerror) {
	var SerialNumber = CardInfo.SerialNumber;
	var param = {
		CardInfo: _Card.Info,              // 就诊卡信息
		PatientInfo: _Card.PatientInfo,    // 患者信息
		resultposdosales: _TranTy,         // 银联交易返回数据
        ZZJCertificate: ZZJCertificate,    // 自助机信息
        SerialNumber: SerialNumber,        // 自助机流水号
	}
    try {
    	$.Writelog(JSON.stringify(param));
    } catch(er) {$.Console(er)}

	AJAX.Business.RechargePos(param, _callback, _callback2, _callerror);
}
/*--------------------------------------------*/







// 检测网络
function CheckNetWork() {
	clearInterval(CheckMainTimer);
	CheckMainTimer = setInterval(function() {
		if ($('#main-menu').length) {
			$.ExitCardClearInfo();                 // 退卡
	    	setTimeout(function() {
	    		ReadCardDev.SetInCard(0);        // 禁止进卡
	    	}, 300);

	    	// 清除弹窗
			if ($('.zdyy-pop').length) {
				$('.zdyy-pop').slideUp('fast', function() {
					$(this).remove();
					clearInterval(LZFYPopTimer);
				});						
			}
	    	$.tip('网络故障，服务暂停');
		}
	}, 1000);
}

/*
 * 检测是否是主界面
 * @param _data 工作时间数据
 */
function CheckMainIsTrue(_data) {
	clearInterval(CheckMainTimer);
	CheckMainTimer = setInterval(function() {
		// console.log( $('#main-menu').length );
		if ($('#main-menu').length) {
			$.ExitCardClearInfo();                 // 退卡
	    	setTimeout(function() {
	    		ReadCardDev.SetInCard(0);          // 禁止进卡
	    	}, 300);
	    	var tmp = new Date().getTime();
			var time = $.GetCheckCurrentTime(_data, tmp, 1);
			var text;
			if (ZZJInfomation.ZZJState != 0) {
				text = '';
			} else if (time.length > 0) {
				// var hour = time[0].StartTime.split('T')[1];
				var hour = time.StartTime;
				text = hour + ' 开启！';
			} else {
				time = $.GetCheckCurrentTime(_data, tmp, 2);
				if (time.StartTime) {						
					// var hour = time.StartTime.split('T')[1];
					var hour = time.StartTime;
					text = '次日 ' + hour + ' 开启！';
				} else {
					text = '次日开启！';
				}
			}
			$.tip('服务暂停！'  + text);
		}
	}, 1000);
}


/*
 * 请求数据返回错误
 * @param _Card 卡信息
 */
function AjaxRequestError(ret) {
	// console.log(ret);
	$.Speak(ret.Msg);
	$.Writelog(ret.Msg);
	$.layer({
		msg: ret.Msg,
		btn: ['确认'],
		yes: ShowMainMenu
	});
}

//  接口出错提示
function AjaxConnectorError(ret) {
	// console.log(ret);
	$.Speak('网络异常请稍后再试');
	$.Writelog('--->网络异常<---');
	$.layer({
		msg: '网络异常，请稍后再试！',
		btn: ['确认'],
		yes: ShowMainMenu
	});
}