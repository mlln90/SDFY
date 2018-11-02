/* 2018-01-23 11:18:38 */

// try {
// 	ThisWindow.OpenDevTools2(850, 108, 340, 400);
// } catch(er) {$.Console(er);}

//全局变量
var PAGE = '.container .wrapper';   // 分页容器
var HOSPITALTYPE = -1;              // 院区类型  -1 所有院区 1 - 妇幼
var PAGECODE;                       // 界面编码
var PRINTPAYNAMELEN = 9;            // 缴费项目名称 字段分割长度
var PRINTPLACELEN = 11;             // 打印所有位置的分割长度
var ZBQTOTALMONEY = 0;              // 纸币器入钞总数

var NotPutInCard;                   // 判断是否插卡

var CardInfo = {};                  // 就诊卡信息
var CreateCardInfo = {};            // 办卡信息
var RegisterTakeInfo = {};          // 挂号取号
var RechargeAndPaymentInfo = {};    // 充值缴费
var PrintBusinessInfo = {};         // 打印业务
var HospitaledInfo = {};            // 住院业务
var InformationQueryInfo = {};      // 信息查询
var IntroduceInfo = {};             // 医院介绍
var SatisfactionInquiryInfo = {};   // 满意度调查

var BARCODENAME = 'XN200';          // 条形机型号
var BARCODECOM = 7;                 // 条形机com口    壁挂COM口是 4  台式的是 7


var IsCompoundCard = true;           // 是否使用院内卡 （就诊卡）
var IsCashPay = false;               // 是否使用现金支付缴费
var IsBankPay = true;                // 是否使用银行卡支付缴费
var IsSocialPay = true;              // 是否使用社保卡支付缴费
var IsCompoundCardAccepting = false; // 是否可使用院内卡预交金
var IsCompoundCardCash = false;      // 是否支持院内卡现金操作
var IsCompoundCardCashRecharge = false; // 是否使用院内卡现金充值
var IsFillCard = false;              // 是否补卡
var IsChangeCard = false;            // 是否换卡

var WINDOWFIRST;                    // 浏览器打开是否为第一次
var NETWORKST = 0;                  // 当前网络状态值 大于等于 3 表示网络故障

var KEYTONE = 'D:/ZZJ/SpecialSounds/4004.wav';  // 按键音地址

var DKQNAME = 'CRT310';             // 读卡器名称
var DKQCOM = 1;                     // 读卡器 COM 口
var DKQTSD = 2;                     // 就诊卡提示灯 门禁号

var ZKJCOM = 10;                    // 证卡机 COM 口
// var ZKJNAME = 'Seaory T12';      // 证卡机名称
var ZKJNAME = 'HiTi CS-200e';       // 证卡机名称
var ZKJTSD = 1;                     // 证卡机提示灯 门禁号
var ZKJSTATE = true;                // 证卡机打开状态

// var PTJPRINTNAME = 'T90';        // 凭条机名称 -- 壁挂
var PTJPRINTNAME = 'CUSTOM K80';    // 凭条机名称 -- 台式

var PTJTSD = 3;                     // 凭条机提示灯 门禁号

// var HYDPRINTNAME = 'Brother HL-5450DN series';   // 化验单打印机名称
var HYDPRINTNAME = "Brother HL-5590DN Printer";     // 化验单打印机名称

var COMPORT = 5;                    // 门禁 COM 端口号
var HYDTSD = 4;                     // 化验单打印机 提示灯门禁号

var SFZYDQNAME = 'HX';              // 身份证阅读器名称
var SFZTSD = 7;                     // 身份证提示灯
var MMJPNAME;                       // 金属键盘名称 --备用--

var ZBQNAME = 'MEI';                // 纸币器名称
var ZBQCOM = 4;                     // 纸币器 com 口
var ZBQTSD = 5;                     // 提示灯门禁号
var ZBQTOTALMONEY = 0;              // 纸币器，硬币器入钞总数

var PAPERMONEY = 0;                 // 纸币交易金额
var COINYUANMONEY = 0;              // 硬币1元交易金额
var COINJIAOMONEY = 0;              // 硬币5角交易金额

var ZBQSWITCH;                      // 纸币器当前入钞状态 开启或关闭
var YBQCOM = 'COM2';                // 硬币器om口
var YBCKTSD = 6;                    // 硬币出口提示灯门禁口
var INRMB = '{"RMB1":1,"RMB2":1,"RMB5":1,"RMB10":1,"RMB20":1,"RMB50":1,"RMB100":1}'; // 入钞类型设置

var PMDTSD = 6;                     // 跑马灯门禁号

const NGINXPATH = 'http://129.1.3.14:8112'; // 打印下载图标半路经 服务器

var ISBG = false;                   // 是否是壁挂机
var ISCP = false;                   // 是否是侧屏

var INDICATORTYPE = 1;              // 指示灯提示类型 1 - 闪烁 3 - 常亮
var _PR_ = 0;                       // 凭条打印向右移
var DTPTTYPEFACE = '微软雅黑';      // 凭条打印字体
var PRINTTIMER;                     // 凭条提示灯 定时变量

var KEYTONE = 'D:/ZZJ/SpecialSounds/4004.wav';  // 按键音地址

var QUERYSERVERINVERTAL = 30;       // 查询服务时间间隔
var ZZJWORKTIME = [];               // 自助机暂停开启时间数组
var MainMenuConfig = [];            // 自助机界面模块配置

var ZZJCertificate = {              // 自助机认证信息
	MAC: '',                        // 当前自助机 MAC 地址
	ZZJID: '1',                     // 自助机编号
	Password: '1'                   // 自助机密码
}
try {
	ZZJCertificate.MAC = MachineInfo.GetMAC();
	console.log(MachineInfo.GetMAC());
} catch(er) {$.Console(er);}

var ZZJInfomation = {};            // 自助机信息

// 初始化硬件操作
function InitHardwareOperate() {

	if (IsCompoundCard) {                  // 判断是否支持插卡
		try {
			OpenDKQ(function() {
				ReadCardDev.SetInCard(1);
			});                                // 打开读卡器
			ReadCardDev.MoveCard(0);           // 退卡
		} catch(er) {$.Console(er);}

	} else {
		OpenDKQ();                             // 打开读卡器
		try {
			ReadCardDev.SetInCard(0);          // 禁止进卡

			setTimeout(function() {
				ReadCardDev.Close();           // 关闭读卡器, 禁止进卡需关闭前禁止
			}, 500);
		} catch(er) {$.Console(er);}
	}

	// try {
	//     if (ThisWindow.IsInit()) {
	//     	WINDOWFIRST = true;
	//     	OpenZBQ('RechargeOpenZBQ');    // 打开纸币器
	//     }
	//     ZBQDev.CloseZBQ();                 // 关闭纸币器
	//     setTimeout(function() {
	//     	OpenZBQ('RechargeOpenZBQ');    // 打开纸币器
	//     }, 500);

	// 	CoinInDev.Close();                 // 禁止入硬币
	//     AcsSwitch.CloseDev();              // 关闭电路板连接

	// 	CloseRecord();                     // 关闭视频
		
	// 	T12_opendev();

	//     AcsSwitch.OpenDev(COMPORT, function (_st) { // 打开机身电路控制板
	//     	if (_st != 0) {
	//     		$.Speak('打开电路控制板失败');
	//     		$.layer({
	//     			msg: '打开电路控制板失败！'
	//     		});
	//     	} else {
	//     		AcsSwitch.SetAcs('B', PMDTSD, 3);      // 打开侧面跑马灯
	//     		AcsSwitch.SetAcs('B', DKQTSD, 3);      // 就诊卡入口提示灯
	//     	}
	//     });
	// } catch(er) {$.Console(er);}
}

/*
 * 检测当前自助机的全局参数
 * @param _data 自助机全局或单机的配置参数数据
 */
function CheckGlobalParam(_data) {
	$.Console(_data, '全局变量参数');
	$.each(_data, function(n, val) {
		switch (val.Name) {
			// 是否支持现金操作
			case 'IsCompoundCardCash': IsCompoundCardCash = val.Value === 'true'; break;

			// 是否支持现金充值
			case 'IsCompoundCardCashRecharge': IsCompoundCardCashRecharge = val.Value === 'true'; break;

			// 是否支持预交金操作（余额支付 缴费）
			case 'IsCompoundCardAccepting': IsCompoundCardAccepting = val.Value === 'true'; break;

			// 是否支持插卡操作
			case 'IsCompoundCard': IsCompoundCard = val.Value === 'true'; break;

			// 是否支持现金支付或缴费
			case 'IsCashPay': IsCashPay = val.Value === 'true'; break;

			// 是否支持银联支付或缴费
			case 'IsBankPay': IsBankPay = val.Value === 'true'; break;

			// 是否支持社保支付或缴费
			case 'IsSocialPay': IsSocialPay = val.Value === 'true'; break;

			// 是否支持补卡操作
			case 'IsFillCard': IsFillCard = val.Value === 'true'; break;

			// 是否支持换卡操作
			case 'IsChangeCard': IsChangeCard = val.Value === 'true'; break;
		}
	});
	PayMentWayConfig[0].Enabled = IsCompoundCardCash;
	PayMentWayConfig[1].Enabled = IsBankPay;
}

/*
 * 判断硬件型号
 * @param _data 硬件列表
 */
function JudgeHardwareModel(_data) {
	$.Console(_data, '硬件配置');
	$.each(_data, function(n, val) {		
		var OtherInfo = JSON.parse(val.Other);
		switch (val.DeviceType) {
			case 1: // 读卡器
				DKQNAME = val.DeviceName;
				DKQCOM = Number(val.COM);
				DKQTSD = Number(OtherInfo.Indor);
				break;

			case 3: // 证卡机
				ZKJNAME = val.DeviceName;
				ZKJCOM = Number(val.COM);
				ZKJTSD = Number(OtherInfo.Indor);
				break;

			case 4: // 凭条打印机
				if (val.DeviceName == 'T90') {
					_PR_ = 0;
				} else if (val.DeviceName == 'CUSTOM K80') {
					_PR_ = 20;
				} else {
					_PR_ = 0;
				}
				PTJPRINTNAME = val.DeviceName;
				PTJTSD = Number(OtherInfo.Indor);
				break;

			case 5: // 门禁
				COMPORT = Number(val.COM);
				if (COMPORT == 1) { // 壁挂机
					ISBG = true;
				} else if (COMPORT == 2) {
					ISCP = true;
				}
				break;

			case 6: // 化验单打印机
				HYDPRINTNAME = val.DeviceName;
				HYDTSD = Number(OtherInfo.Indor);
				break;

			case 7: // 身份证阅读器
				SFZYDQNAME = val.DeviceName;
				SFZTSD = Number(OtherInfo.Indor);
				break;

			case 8: // 密码键盘
				break;

			case 9: // 纸币器
				ZBQNAME = val.DeviceName;
				ZBQCOM = Number(val.COM);
				ZBQTSD = Number(OtherInfo.Indor);
				var data = OtherInfo.Other.split(',');
				var obj = {
					RMB1: 0,
					RMB2: 0,
					RMB5: 0,
					RMB10: 0,
					RMB20: 0,
					RMB50: 0,
					RMB100: 0
				}
				$.each(data, function(n, val) {
					switch (val) {
						case '1': obj.RMB1 = 1; break;
						case '2': obj.RMB2 = 1; break;
						case '5': obj.RMB5 = 1; break;
						case '10': obj.RMB10 = 1; break;
						case '20': obj.RMB20 = 1; break;
						case '50': obj.RMB50 = 1; break;
						case '100': obj.RMB100 = 1; break;
					}
				});
				INRMB = JSON.stringify(obj);
				break;

			case 10: // 条码器
				BARCODENAME = val.DeviceName;
				BARCODECOM = Number(val.COM);
				break;

			case 11: // 硬币器
				YBQCOM = 'COM' + val.COM;
				YBCKTSD = Number(OtherInfo.Indor);
				break;

			case 12: // 跑马灯
				PMDTSD = Number(OtherInfo.Indor);
				break;
		}
	});
}



// 满意度调查问题
var SatisfactionOptions = [
	{
		id: 0,
		Option: '对导诊人员的满意度',
	}, {
		id: 1,
		Option: '对收费人员服务态度的满意度',
	}, {
		id: 2,
		Option: '对医师的治疗水平的满意度',
	}, {
		id: 3,
		Option: '对医生的服务态度的满意度',
	}, {
		id: 4,
		Option: '对注射室护士技术操作的满意度',
	}, {
		id: 5,
		Option: '对护士服务态度的满意度',
	}, {
		id: 6,
		Option: '对药剂人员服务态度的满意度',
	}, {
		id: 7,
		Option: '对放射科人员服务态度的满意度',
	}, {
		id: 8,
		Option: '对检验科人员服务态度的满意度',
	}, {
		id: 9,
		Option: '对超声诊断科人员服务态度的满意度',
	}, {
		id: 10,
		Option: '对就诊程序及指引的满意度',
	}, {
		id: 11,
		Option: '对就诊环境的满意度',
	}, {
		id: 12,
		Option: '对你所就诊的医生的满意度',
	}, {
		id: 13,
		Option: '对你所就诊科室的满意度',
	}, {
		id: 14,
		Option: '您愿意介绍其他病人来本院看病吗？',
	}
];

// 满意度多选
var SatisfactionMultiple = [
	'满意',
	'不满意',
	'一般',
	'未选择',
]

// 模块配置
// MainMenuConfig = [
// 	{
// 		"ID": 1,
// 		"Code": "YYJJ",              
// 		"Name": "医院简介",          
// 		"Diameter": "240px",         
// 		"Visual": true,              
// 		"Enabled": true,             
// 		"Texcolor": "#ffffff",       
// 		"ParentID": -1,              
// 		"IconName": "hospitalIntroduce",   
// 		"IsInToCard": true,         
// 		"SerialNumber": 1,           
// 		"WorkTimeSegmentConfigID": 1,
// 		"WorkTimeSegments": [
// 			{
// 				"StartTime": "2018-07-24T00:00:00",
// 				"EndTime": "2018-07-24T12:00:00",
// 				"Enabled": true}, 
// 			{
// 				"StartTime": "2018-07-24T12:00:00",
// 				"EndTime": "2018-07-24T23:59:59",
// 				"Enabled": true}
// 		]
// 	},{
// 		"ID": 2,
// 		"Code": "DYYW",
// 		"Name": "打印业务",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": false,
// 		"Texcolor": "#ffffff",
// 		"ParentID": -1,
// 		"IconName": "printReport",
// 		"IsInToCard": true,
// 		"SerialNumber": 2,
// 		"WorkTimeSegmentConfigID": 1,
// 		"WorkTimeSegments": [       
// 			{
// 				"StartTime": "2017-12-05T00:00:00",
// 				"EndTime": "2017-12-05T12:00:00",
// 				"Enabled": true
// 			}, {
// 				"StartTime": "2017-12-05T12:00:00",
// 				"EndTime": "2017-12-05T23:59:59",
// 				"Enabled": true
// 			}
// 		]
// 	}, {
// 		"ID": 3,
// 		"Code": "SFZBK",
// 		"Name": "注册办卡",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": -1,
// 		"IconName": "identityCardRegist",
// 		"IsInToCard": true,
// 		"SerialNumber": 3,
// 		"WorkTimeSegmentConfigID": 1,
// 		"WorkTimeSegments": [       
// 			{
// 				"StartTime": "2017-12-05T00:00:00",
// 				"EndTime": "2017-12-05T12:00:00",
// 				"Enabled": true
// 			}, {
// 				"StartTime": "2017-12-05T12:00:00",
// 				"EndTime": "2017-12-05T23:59:59",
// 				"Enabled": true
// 			}
// 		]
// 	}, {
// 		"ID": 4,
// 		"Code": "MZYY",
// 		"Name": "门诊预约",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": -1,
// 		"IconName": "outpatientAppointment",
// 		"IsInToCard": true,
// 		"SerialNumber": 4,
// 		"WorkTimeSegmentConfigID": 1,
// 		"WorkTimeSegments": [       
// 			{
// 				"StartTime": "2017-12-05T00:00:00",
// 				"EndTime": "2017-12-05T12:00:00",
// 				"Enabled": true
// 			}, {
// 				"StartTime": "2017-12-05T12:00:00",
// 				"EndTime": "2017-12-05T23:59:59",
// 				"Enabled": true
// 			}
// 		]
// 	}, {
// 		"ID": 5,
// 		"Code": "DRGH",
// 		"Name": "当日挂号",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": -1,
// 		"IconName": "registerOntheDay",
// 		"IsInToCard": true,
// 		"SerialNumber": 5,
// 		"WorkTimeSegmentConfigID": 1,
// 		"WorkTimeSegments": [       
// 			{
// 				"StartTime": "2017-12-05T00:00:00",
// 				"EndTime": "2017-12-05T12:00:00",
// 				"Enabled": true
// 			}, {
// 				"StartTime": "2017-12-05T12:00:00",
// 				"EndTime": "2017-12-05T23:59:59",
// 				"Enabled": true
// 			}
// 		]
// 	}, {
// 		"ID": 6,
// 		"Code": "YYQH",
// 		"Name": "预约取号",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": -1,
// 		"IconName": "reservationNumber",
// 		"IsInToCard": true,
// 		"SerialNumber": 6,
// 		"WorkTimeSegmentConfigID": 1,
// 		"WorkTimeSegments": [       
// 			{
// 				"StartTime": "2017-12-05T00:00:00",
// 				"EndTime": "2017-12-05T12:00:00",
// 				"Enabled": true
// 			}, {
// 				"StartTime": "2017-12-05T12:00:00",
// 				"EndTime": "2017-12-05T23:59:59",
// 				"Enabled": true
// 			}
// 		]
// 	}, {
// 		"ID": 7,
// 		"Code": "ZZJF",
// 		"Name": "自助缴费",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": -1,
// 		"IconName": "selfHelpPayment",
// 		"IsInToCard": true,
// 		"SerialNumber": 7,
// 		"WorkTimeSegmentConfigID": 1,
// 		"WorkTimeSegments": [       
// 			{
// 				"StartTime": "2017-12-05T00:00:00",
// 				"EndTime": "2017-12-05T12:00:00",
// 				"Enabled": true
// 			}, {
// 				"StartTime": "2017-12-05T12:00:00",
// 				"EndTime": "2017-12-05T23:59:59",
// 				"Enabled": true
// 			}
// 		]
// 	}, {
// 		"ID": 8,
// 		"Code": "YYJS",
// 		"Name": "医院介绍",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 1,
// 		"IconName": "hospinto",
// 		"IsInToCard": false,
// 		"SerialNumber": 1,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 9,
// 		"Code": "KSJS",
// 		"Name": "科室介绍",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 1,
// 		"IconName": "departinto",
// 		"IsInToCard": false,
// 		"SerialNumber": 2,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 10,
// 		"Code": "YSJS",
// 		"Name": "医生介绍",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 1,
// 		"IconName": "doctinto",
// 		"IsInToCard": false,
// 		"SerialNumber": 3,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 11,
// 		"Code": "CBCX",
// 		"Name": "参保查询",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 1,
// 		"IconName": "socialinto",
// 		"IsInToCard": true,
// 		"SerialNumber": 4,
// 		"WorkTimeSegmentConfigID": -1
// 	},{
// 		"ID": 12,
// 		"Code": "DYPF",
// 		"Name": "打印发票",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 2,
// 		"IconName": "printfp",
// 		"IsInToCard": false,
// 		"SerialNumber": 1,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 13,
// 		"Code": "DYBLB",
// 		"Name": "打印病历本",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 2,
// 		"IconName": "printdz",
// 		"IsInToCard": false,
// 		"SerialNumber": 2,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 14,
// 		"Code": "DYBLH",
// 		"Name": "打印病历号",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 2,
// 		"IconName": "printhzh",
// 		"IsInToCard": false,
// 		"SerialNumber": 3,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 15,
// 		"Code": "DYHYD",
// 		"Name": "打印化验单",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 2,
// 		"IconName": "printhyd",
// 		"IsInToCard": true,
// 		"SerialNumber": 4,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 16,
// 		"Code": "DYHYDQD",
// 		"Name": "打印清单",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 2,
// 		"IconName": "printhydqd",
// 		"IsInToCard": false,
// 		"SerialNumber": 5,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 17,
// 		"Code": "SFZZC",
// 		"Name": "身份证注册",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 3,
// 		"IconName": "identityCardRegistBrushCard",
// 		"IsInToCard": false,
// 		"SerialNumber": 1,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 18,
// 		"Code": "SBKZC",
// 		"Name": "社保卡注册",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 3,
// 		"IconName": "identityCardRegistSocial",
// 		"IsInToCard": false,
// 		"SerialNumber": 2,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 19,
// 		"Code": "WZZC",
// 		"Name": "无证注册",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 3,
// 		"IconName": "identityCardRegistNoCard",
// 		"IsInToCard": false,
// 		"SerialNumber": 3,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 20,
// 		"Code": "YYGH",
// 		"Name": "预约挂号",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 4,
// 		"IconName": "outpatientAppointmentgh",
// 		"IsInToCard": false,
// 		"SerialNumber": 1,
// 		"WorkTimeSegmentConfigID": -1
// 	},{
// 		"ID": 21,
// 		"Code": "QXYY",
// 		"Name": "取消预约",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 4,
// 		"IconName": "outpatientAppointmentqx",
// 		"IsInToCard": false,
// 		"SerialNumber": 2,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 22,
// 		"Code": "JRGH",
// 		"Name": "当日挂号",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 5,
// 		"IconName": "registerOntheDaygh",
// 		"IsInToCard": false,
// 		"SerialNumber": 1,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 23,
// 		"Code": "QXGH",
// 		"Name": "取消挂号",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": false,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 5,
// 		"IconName": "registerOntheDayqx",
// 		"IsInToCard": false,
// 		"SerialNumber": 2,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 24,
// 		"Code": "YYQH2",
// 		"Name": "预约取号",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 6,
// 		"IconName": "reservationNumberyy",
// 		"IsInToCard": false,
// 		"SerialNumber": 1,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 25,
// 		"Code": "XSQH",
// 		"Name": "线上取号",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 6,
// 		"IconName": "reservationNumberwx",
// 		"IsInToCard": false,
// 		"SerialNumber": 2,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 26,
// 		"Code": "CFJF",
// 		"Name": "处方缴费",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 7,
// 		"IconName": "selfHelpPaymentjf",
// 		"IsInToCard": true,
// 		"SerialNumber": 1,
// 		"WorkTimeSegmentConfigID": -1
// 	}, {
// 		"ID": 27,
// 		"Code": "XFMX",
// 		"Name": "消费明细",
// 		"Diameter": "240px",
// 		"Visual": true,
// 		"Enabled": true,
// 		"Texcolor": "#ffffff",
// 		"ParentID": 7,
// 		"IconName": "selfHelpPaymentmx",
// 		"IsInToCard": false,
// 		"SerialNumber": 2,
// 		"WorkTimeSegmentConfigID": -1
// 	}
// ];

/* 身份证办卡方式 */
var IdentityCardWay = [
	{
		ID: 1,
		Code: 'SSFZ',
		Name: '刷身份证',
		Visual: true,
		Enabled: true,
		Texcolor: '#fff',
		IconName: 'sweep-card',
	}, 
	{
		ID: 2,
		Code: 'SRSFZH',
		Name: '输入身份证号',
		Visual: true,
		Enabled: true,
		Texcolor: '#fff',
		IconName: 'identiti-card',
	}
];

/* 药品非药品 */
var GoodsConfig = [
	{
		ID: 1,
		Code: 'YPCX',
		Name: '药品查询',
		Diameter: '220px',
		Visual: true,
		Enabled: true,
		Texcolor: '#fff',
		IconName: 'drug',
	}, {
		ID: 2,
		Code: 'FYPCX',
		Name: '非药品查询',
		Diameter: '220px',
		Visual: true,
		Enabled: true,
		Texcolor: '#fff',
		IconName: 'nodrug',
	}
]

/* 充值方式配置 */
var PayMentWayConfig = [
	{
		ID: 1,
		Code: 'XJ',
		Name: '现金',
		Diameter: '220px',
		Visual: true,
		Enabled: true,
		Texcolor: '#fff',
		IconName: 'cash',
	}, {
		ID: 2,
		Code: 'YHK',
		Name: '银行卡',
		Diameter: '220px',
		Visual: true,
		Enabled: true,
		Texcolor: '#fff',
		IconName: 'unionpay',
	}, {
		ID: 3,
		Code: 'WEIX',
		Name: '微信',
		Diameter: '220px',
		Visual: true,
		Enabled: true,
		Texcolor: '#fff',
		IconName: 'weixin',
	}, {
		ID: 4,
		Code: 'ZFB',
		Name: '支付宝',
		Diameter: '220px',
		Visual: true,
		Enabled: true,
		Texcolor: '#fff',
		IconName: 'alipay',
	}
];

// MainMenuConfig = $.ModuleGrouping(MainMenuConfig);

// $.Console(MainMenuConfig, '模块转换数据');
// console.log(MainMenuConfig);