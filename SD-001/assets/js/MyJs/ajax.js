/* 2017-07-12 15:51:05 */
;
// 路径集合 - 自助机主程序接口
// const HTTP_PATH = 'http://172.19.180.148:8080/api'; 
// const HTTP_PATH = 'http://201.201.201.34:1111/api'; 
const HTTP_PATH = '/api'; 

// 体检查询
// const TJCX_PATH = 'http://172.19.180.207:8071/api';
// const TJCX_PATH = '/tjcx/api';


var AJAX_URL = {

	'QueryAdmin'                        : '/Admin/QueryAdmin',

	'ChangeAdmin'                       : '/Admin/ChangeAdmin',

	'CheckAdmin2'                       : '/Admin/CheckAdmin2',

	// 自助机信息
	'QueryZZJInfomation'                : '/Admin/QueryZZJInfomation',

	'NewZZJInfomation'                  : '/Admin/NewZZJInfomation',

	'QueryWorkTimeSegmentConfigTable'   : '/Admin/QueryWorkTimeSegmentConfigTable',

	'ChangeModuleConfig'                : '/Admin/ChangeModuleConfig',

	'ChangeModuleConfigTable'           : '/Admin/ChangeModuleConfigTable',

	'ChangeZZJInfomation'               : '/Admin/ChangeZZJInfomation',

	'QueryModuleConfigTable'            : '/Admin/QueryModuleConfigTable',

	// 结账
	'CheckOut'                          : '/Admin/CheckOut',

	// 长链接
	'OpenBroadCast'                     : '/Admin/OpenBroadCast',


	// 业务查询
	'QueryCashByTime1'                  : '/Admin/QueryCashByTime1',  // 现金总数

	'QueryGhByTime'                     : '/Admin/QueryGhByTime',     // 挂号总数

	'QueryBkByTime'                     : '/Admin/QueryBkByTime',     // 办卡总数

	'QueryPOSByTime1'                   : '/Admin/QueryPOSByTime1',   // 银联总数

	'QueryReport'                       : '/Admin/QueryReport',       // 打印总数

	'QueryAll'                          : '/Admin/QueryAll',       // 查询总业务


	// 工作时间
	'QueryWorkTimeSegmentConfigList'    : '/Admin/QueryWorkTimeSegmentConfigList',

	'ChangeWorkTimeSegmentConfigTable'  : '/Admin/ChangeWorkTimeSegmentConfigTable',

	'AddWorkTimeSegmentTable'           : '/Admin/AddWorkTimeSegmentTable',

	'DeleteWorkTimeSegmentConfigTable'  : '/Admin/DeleteWorkTimeSegmentConfigTable',

	// 终端列表
	'QueryKioskList'                    : '/Admin/QueryKioskList',

	'QueryDeviceConfigTable'            : '/Admin/QueryDeviceConfigTable',

	// 模块
	'AddModuleConfigTable'              : '/Admin/AddModuleConfigTable',

	'QueryModules'                      : '/Admin/QueryModules',

	'AddModule'                         : '/Admin/AddModule',

	'DeleteModule'                      : '/Admin/DeleteModule',

	'ChangeModule'                      : '/Admin/ChangeModule',


	// 查询业务
	'QueryCashByTime'                   : '/Admin/QueryCashByTime',

	'QueryPOSByTime'                    : '/Admin/QueryPOSByTime',


	// 硬币管理
	'AddOrResetCoins'                   : '/Admin/AddOrResetCoins',



	// 银行
	'QueryBankConfigTableList'          : '/Admin/QueryBankConfigTableList',

	'AddBank'                           : '/Admin/AddBank',

	'ChangeBankConfig'                  : '/Admin/ChangeBankConfig',

	'DeleteBank'                        : '/Admin/DeleteBank',


	// 机型
	'QueryDeviceInfomationList'         : '/Admin/QueryDeviceInfomationList',

	'AddDeviceInfomationsTable'         : '/Admin/AddDeviceInfomationsTable',

	'DeleteDeviceInfomationTable'       : '/Admin/DeleteDeviceInfomationTable',

	'ChangeDeviceInfomationTable'       : '/Admin/ChangeDeviceInfomationTable',


	// 硬件
	'QueryDeviceConfigList'             : '/Admin/QueryDeviceConfigList',

	'DeleteDeviceConfigTable'           : '/Admin/DeleteDeviceConfigTable',

	'AddDeviceConfigTable'              : '/Admin/AddDeviceConfigTable',


	// 批量
	'ChangeMobileByBank'                : '/Admin/ChangeMobileByBank',

	'SuspendZZJ'                        : '/Admin/SuspendZZJ',


	// 字典
	'QueryDict'                         : '/Admin/QueryDict',

	'ChangeDict'                        : '/Admin/ChangeDict',

	'DeleteDictContent'                 : '/Admin/DeleteDictContent',


	// HIS 工号
	'QueryExtUserIDList'                : '/Admin/QueryExtUserIDList',

	'ChangeThirdPartyAccountConfig'     : '/Admin/ChangeThirdPartyAccountConfig',

	// 获取院区
	'QueryDistrictConfigTableList'      : '/Admin/QueryDistrictConfigTableList',

	'ChangeDistrictConfig'              : '/Admin/ChangeDistrictConfig',




	/*------------------------------------------------------------------------*/
	// 办卡
	'CreateCard'                        : '/Business/CreateCard',

	// 查卡信息
	'QueryPatientInfoByCardNo'          : '/Business/QueryPatientInfo',

	// 查询发票
	'ReceiptCheck'                      : '/Business/ReceiptCheck',

	// 充值
	'CardByRecharge'                    : '/Business/Recharge',

	// 科室医生排班
	'QueryDepartments'                  : '/Business/QueryDepartments',

	// 挂号预结算
	'RegisteredBudget'                  : '/Business/RegisteredBudget',
	
	// 挂号结算
	'RegistrationSettlement'            : '/Business/RegistrationSettlement',

	// 查询缴费列表
	'BillInfoByAdmInfo'                 : '/Business/BillInfoByAdmInfo',

	// 缴费详情
	'BillInfoByDetail'                  : '/Business/BillInfoByDetail',
	
	// 处方预结算
	'PayCostBudget'                     : '/Business/PayCostBudget',
	
	// 处方结算
	'InsertBankTradeInfo'               : '/Business/InsertBankTradeInfo',

	// 查询消费记录
	'BillGetByDetail'                   : '/Business/BillGetByDetail',

	// 消费详细
	'BillCXDetial'                      : '/Business/CXDetial',

	// 充值记录查询
	'QueryRecharge'                     : '/Business/QueryRecharge',

	// 住院病人信息查询
	'GetZYPatientInfo'                  : '/Business/GetZYPatientInfo',

	// 住院充值
	'AddIPPatDeposit'                   : '/Business/AddIPPatDeposit',
	
	// 住院日清单查询
	'DHCQueryRQD'                       : '/Business/DHCQueryRQD',

	// 物品数据查询
	'QueryByDrug'                       : '/Business/DrugQuery',
	
	// 满意度调查
	'Satisfaction'                      : '/Business/Satisfaction',


	/*------------sdfy---------------*/

	// 身份证号注册
	'RegisterID'                        : '/Business/RegisterID',

	// 根据卡号查询患者信息
	'QueryPatientInfo'                  : '/Business/QueryPatientInfo',

	// 查询科室
	'queryDept'                         : '/Business/queryDept',

	// 查询医生
	'queryDoct'                         : '/Business/queryDoct',

	// 查询挂号费
	'queryRegistrFee'                   : '/Business/queryRegistrFee',

	// 查看已预约信息
	'QueryAppointment'                  : '/Business/QueryAppointment',

	// 预约
	'Appointment'                       : '/Business/Appointment',

	// 取消预约信息
	'CancelAppointment'                 : '/Business/CancelAppointment',

	// 查看已挂号信息
	'QueryRegInfo'                      : '/Business/QueryRegInfo',

	// 微信  支付宝下单 生成二维码
	'TakeQR'                            : '/Pay/TakeQR',

	// 微信/支付宝 循环查单
	'QueryPayStatus'                    : '/Pay/QueryPayStatus',

	// 交易获取 PayID
	'Pay'                               : '/Business/Pay',

	// 挂号(当日挂号)
	'Register'                          : '/Business/Register',

	// 退号（当日挂号）
	'RefundRegInfo'                     : '/Business/RefundRegInfo',

	// 微信/支付宝退费、退单
	'RefundPay'                         : '/Pay/RefundPay',

	// 银联社保退号后更新退款状态
	'UpdatePay'                         : '/Business/UpdatePay',

	// 关闭订单
	'ClosePay'                          : '/Pay/ClosePay',

	// 查询处方
	'QueryRecipes'                      : '/Business/QueryRecipes',

	// 查询已缴费处方 (明细) 
	'GetClinPayList'                    : '/Business/GetClinPayList',

	// 查询处方列表 自费金额
	'GetPayPrepare'                     : '/Business/GetPayPrepare',

	// 处方支付接口
	'PayRecipes'                        : '/Business/PayRecipes',

	// 查看处方详情
	'QueryRecipesDetail'                : '/Business/QueryRecipesDetail',

	// 预约取号
	'SaveAppointment'                   : '/Business/SaveAppointment',

	// 线上取号
	'OutLineRegCheckIn'                 : '/Business/OutLineRegCheckIn',

	// 挂号凭条补打
	'PrintByCardNo'                     : '/Business/PrintByCardNo',

	// 查询明细清单打印次数
	'SelectPrintlog'                    : '/Business/SelectPrintlog',

	// 更新处方打印次数
	'UpdatePrintlog'                    : '/Business/UpdatePrintlog',

	// 发票打印
	'SelectInvoiceInfo'                 : '/Business/SelectInvoiceInfo',

	// 发票打印更新
	'UpdateInvoicePrintNum'             : '/Business/UpdateInvoicePrintNum',

	// 发票印刷号查询
	'SelectInvoicePrintingNum'          : '/Business/SelectInvoicePrintingNum',

	// 发票印刷号查询
	'UpdateInvoicePrintingNum'          : '/Business/UpdateInvoicePrintingNum',

	// 更新支付pay接口的支付单号 Trance
	'UpdatePaylog'                      : '/Business/UpdatePaylog',

	// 查询对账功能
	'QueryPaylog'                       : '/Business/QueryPaylog',

	// 查询自助机所有模块
	'QueryModuleConfigTableList'        : '/admin/QueryModuleConfigTableList',

	// 查询 Paylog 记录数据  ==> 银行社保退号要用到 表中的tag
	'SelectPaylog'                      : '/Business/SelectPaylog',


	/*------------------------------------------------------------------------*/

	// 服务器时间
	'QueryZZJTime'                      : '/Business/QueryZZJTime',

	// 'QueryHISTime'                   : '/Business/QueryTime',
	'QueryHISTime'                      : '/admin/queryTime',

	'RechargePos'                       : '/Business/RechargePos',

	// 信息补录
	'InformationCollection'             : '/Business/InformationCollection',

	// 余额
	'QueryOutPatBalance'                : '/Business/QueryOutPatBalance',

	// 信息补录
	'CompletePatientInfo'               : '/Business/CompletePatientInfo',

	// 挂号
	'QueryGhType'                       : '/Business/QueryGhType',

	'QuerySchedules'                    : '/Business/QuerySchedules',

	'DengesRegister'                    : '/Business/Register',

	'QueryRegister'                     : '/Business/QueryRegister',

	// 打印
	'QueryOutPatReportList'             : '/Business/Report',

	//科室查询
	'AddReport'                         : '/Business/AddReport',

}

var AJAX = (function() {

	var Admin = {};
	var Business = {};

	/* 查询管理列表 */
	Admin.QueryAdmin = function(_callback, _callback2, _errorback) {
		ajax({}, _callback, _callback2, _errorback, 'post', 'QueryAdmin', null, null);
	}

	/* 修改管理参数 */
	Admin.ChangeAdmin = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeAdmin', null, null);
	}

	/* 管理员登录 */
	Admin.CheckAdmin2 =  function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'CheckAdmin2', null, null);
	}


	/* 获取自助机信息 */
	Admin.QueryZZJInfomation = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryZZJInfomation', null, null);
	}

	/* 添加自助机信息 */
	Admin.NewZZJInfomation = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'NewZZJInfomation', null, null);
	}

	/* 修改自助机信息 */
	Admin.ChangeZZJInfomation = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeZZJInfomation', null, null);
	}

	/* 获取自助机时间配置 */
	Admin.QueryWorkTimeSegmentConfigTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryWorkTimeSegmentConfigTable', null, null);
	}

	/* 自助机配置单个模块 */
	Admin.ChangeModuleConfig = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeModuleConfig', null, null);
	}

	/* 自助机配置模块表 */
	Admin.ChangeModuleConfigTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeModuleConfigTable', null, null);
	}

	/* 获取自助机模块开启时间 */
	Admin.QueryModuleConfigTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryModuleConfigTable', null, null);
	}


	/* 自助机结账 */
	Admin.CheckOut = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'CheckOut', null, null);
	}

	/* 打开 webSocket 端口 */
	Admin.OpenBroadCast = function(_callback, _callback2, _errorback) {
		ajax({}, _callback, _callback2, _errorback, 'get', 'OpenBroadCast', null, null);
	}

	/* 查询自助机现金业务 */
	Admin.QueryCashByTime = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryCashByTime', null, null);
	}

	/* 查询自助机银行业务 */
	Admin.QueryPOSByTime = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryPOSByTime', null, null);
	}



	/* 硬币管理 */
	Admin.AddOrResetCoins = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'AddOrResetCoins', null, null);
	}



	/* 查询现金总数 */
	Admin.QueryCashByTime1 = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryCashByTime1', null, null);
	}
	
	/* 查询挂号总数 */
	Admin.QueryGhByTime = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryGhByTime', null, null);
	}

	/* 查询现金总数 */
	Admin.QueryBkByTime = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryBkByTime', null, null);
	}

	/* 查询银联总数 */
	Admin.QueryPOSByTime1 = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryPOSByTime1', null, null);
	}

	/* 查询自助机打印业务 */
	Admin.QueryReport = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryReport', null, null);
	}

	/* 查询总业务 */
	Admin.QueryAll = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryAll', null, null);
	}



	/* 查询所有机器 / 模块 工作时间 */
	Admin.QueryWorkTimeSegmentConfigList = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryWorkTimeSegmentConfigList', null, null);
	}

	/* 修改所有机器 / 模块 工作时间 */
	Admin.ChangeWorkTimeSegmentConfigTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeWorkTimeSegmentConfigTable', null, null);
	}

	/* 添加配置时间 */
	Admin.AddWorkTimeSegmentTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'AddWorkTimeSegmentTable', null, null);
	}

	/* 删除配置时间 */
	Admin.DeleteWorkTimeSegmentConfigTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'DeleteWorkTimeSegmentConfigTable', null, null);
	}



	/* 获取自助机列表信息 */
	Admin.QueryKioskList = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryKioskList', null, null);
	}

	/* 获取单机硬件配置 */
	Admin.QueryDeviceConfigTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryDeviceConfigTable', null, null);
	}




	/* 增加单机模块信息 */
	Admin.AddModuleConfigTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'AddModuleConfigTable', null, null);
	}

	/* 查询所有模块 */
	Admin.QueryModules = function(_callback, _callback2, _errorback) {
		ajax({}, _callback, _callback2, _errorback, 'post', 'QueryModules', null, null);
	}

	/* 添加模块 */
	Admin.AddModule = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'AddModule', null, null);
	}

	/* 删除模块 */
	Admin.DeleteModule = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'DeleteModule', null, null);
	}

	/* 修改模块 */
	Admin.ChangeModule = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeModule', null, null);
	}




	/* 查询所有银行列表 */
	Admin.QueryBankConfigTableList = function(_callback, _callback2, _errorback) {
		ajax({}, _callback, _callback2, _errorback, 'post', 'QueryBankConfigTableList', null, null);
	}

	/* 添加银行 */
	Admin.AddBank = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'AddBank', null, null);
	}

	/* 修改银行信息 */
	Admin.ChangeBankConfig = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeBankConfig', null, null);
	}

	/* 删除银行 */
	Admin.DeleteBank = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'DeleteBank', null, null);
	}


	/* 查询所有硬件列表 */
	Admin.QueryDeviceInfomationList = function(_callback, _callback2, _errorback) {
		ajax({}, _callback, _callback2, _errorback, 'post', 'QueryDeviceInfomationList', null, null);
	}

	/* 添加硬件 */
	Admin.AddDeviceInfomationsTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'AddDeviceInfomationsTable', null, null);
	}

	/* 删除硬件 */
	Admin.DeleteDeviceInfomationTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'DeleteDeviceInfomationTable', null, null);
	}

	/* 修改硬件 */
	Admin.ChangeDeviceInfomationTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeDeviceInfomationTable', null, null);
	}




	/* 查询所有机型列表 */
	Admin.QueryDeviceConfigList = function(_callback, _callback2, _errorback) {
		ajax({}, _callback, _callback2, _errorback, 'post', 'QueryDeviceConfigList', null, null);
	}

	/* 删除机型 */
	Admin.DeleteDeviceConfigTable =  function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'DeleteDeviceConfigTable', null, null);
	}

	/* 添加机型 */
	Admin.AddDeviceConfigTable = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'AddDeviceConfigTable', null, null);
	}


	/* 批量修改手机号 */
	Admin.ChangeMobileByBank = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeMobileByBank', null, null);
	}

	/* 全部暂停或开启服务 */
	Admin.SuspendZZJ = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'SuspendZZJ', null, null);
	}



	/* 查询字典 */
	Admin.QueryDict = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryDict', null, null);
	}

	/* 添加或修改字典 */
	Admin.ChangeDict = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeDict', null, null);
	}

	/* 删除字典 */
	Admin.DeleteDictContent = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'DeleteDictContent', null, null);
	}
	


	/* 查询所有 HIS 工号 */
	Admin.QueryExtUserIDList = function(_callback, _callback2, _errorback) {
		ajax({}, _callback, _callback2, _errorback, 'post', 'QueryExtUserIDList', null, null);
	}

	/* 添加或修改 HIS 工号 */
	Admin.ChangeThirdPartyAccountConfig = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeThirdPartyAccountConfig', null, null);
	}

	/* 获取院区列表 */
	Admin.QueryDistrictConfigTableList = function(_callback, _callback2, _errorback) {
		ajax({}, _callback, _callback2, _errorback, 'post', 'QueryDistrictConfigTableList', null, null);
	}

	/* 修改院区信息 */
	Admin.ChangeDistrictConfig = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ChangeDistrictConfig', null, null);
	}


	

	/* 获取自助机服务器时间 */
	Business.QueryZZJTime = function( _callback, _callback2, _errorback) {
		ajax({}, _callback, _callback2, _errorback, 'post', 'QueryZZJTime', null, null);
	}

	/* 获取服HIS务器时间 */
	Business.QueryHISTime = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryHISTime', null, null);
	}

	/* 办卡 */
	Business.CreateCard = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'CreateCard', null, null);
	}

	/* 查询卡信息 */
	Business.QueryPatientInfoByCardNo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryPatientInfoByCardNo', null, null);
	}

	/* 信息补录 */
	Business.InformationCollection = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'InformationCollection', null, null);
	}

	/* 发票查询 */
	Business.ReceiptCheck = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ReceiptCheck', null, null);
	}

	/* 现金充值 */
	Business.CardByRecharge = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'CardByRecharge', null, null);
	}

	/* 银联充值 */
	Business.RechargePos = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'RechargePos', null, null);
	}

	/* 查询门诊账户余额 */
	Business.QueryOutPatBalance = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryOutPatBalance', null, null);
	}

	/* 门诊信息补录 */
	Business.CompletePatientInfo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'CompletePatientInfo', null, null);
	}

	/* 查询可挂号科室类型 */
	Business.QueryGhType = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryGhType', null, null);
	}

	/* 查询科室列表 */
	Business.QueryDepartments = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryDepartments', null, null);
	}

	/* 挂号预结算 */
	Business.RegisteredBudget = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'RegisteredBudget', null, null);
	}

	/* 挂号结算 */
	Business.RegistrationSettlement = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'RegistrationSettlement', null, null);
	}

	/* 查询医生排班 */
	Business.QuerySchedules = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QuerySchedules', null, null);
	}

	/* 当日挂号 */
	Business.DengesRegister = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'DengesRegister', null, null);
	}

	/* 查询缴费列表 */
	Business.BillInfoByAdmInfo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'BillInfoByAdmInfo', null, null);
	}

	/* 查询缴费详情 */
	Business.BillInfoByDetail = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'BillInfoByDetail', null, null);
	}

	/* 处方预结算 */
	Business.PayCostBudget = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'PayCostBudget', null, null);
	}

	/* 处方结算 */
	Business.InsertBankTradeInfo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'InsertBankTradeInfo', null, null);
	}

	/* 消费明细 */
	Business.BillGetByDetail = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'BillGetByDetail', null, null);
	}

	/* 消费明细详情 */
	Business.BillCXDetial = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'BillCXDetial', null, null);
	}

	/* 挂号记录 */
	Business.QueryRegister = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryRegister', null, null);
	}

	/* 充值记录*/
	Business.QueryRecharge = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryRecharge', null, null);
	}

	/* 住院患者信息查询 */
	Business.GetZYPatientInfo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'GetZYPatientInfo', null, null);
	}

	/* 住院充值 */
	Business.AddIPPatDeposit = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'AddIPPatDeposit', null, null);
	}

	/* 住院日清单查询 */
	Business.DHCQueryRQD = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'DHCQueryRQD', null, null);
	}

	/* 物品查询 */
	Business.QueryByDrug = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryByDrug', null, null);
	}

	/* 查找打印列表 */
	Business.QueryOutPatReportList = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryOutPatReportList', null, null);
	}

	/* 添加打印数量 */
	Business.AddReport = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'AddReport', null, null);
	}

	/*-----------------SDFY------------------*/
	
	/* 身份证号注册 */
	Business.RegisterID = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'RegisterID', null, null);
	}

	/* 科室查询 */
	Business.queryDept = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'queryDept', null, null);
	}

	/* 医生查询 */
	Business.queryDoct = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'queryDoct', null, null);
	}

	/* 挂号费查询 */
	Business.queryRegistrFee = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'queryRegistrFee', null, null);
	}

	/* 根据卡号查询患者信息 */
	Business.QueryPatientInfo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryPatientInfo', null, null);
	}

	/* 查看已预约信息 */   //判断加号  3表示在挂完号之后医生给特殊患者加号
	Business.QueryAppointment = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryAppointment', null, null);
	}

	/* 预约 */
	Business.Appointment = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'Appointment', null, null);
	}

	/* 取消预约 */
	Business.CancelAppointment = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'CancelAppointment', null, null);
	}

	/* 查询已挂号信息 */
	Business.QueryRegInfo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryRegInfo', null, null);
	}

	/* 微信、支付宝 下单 生成二维码 */
	Business.TakeQR = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'TakeQR', null, null);
	}

	/* 微信/支付宝 循环查单 */
	Business.QueryPayStatus = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryPayStatus', null, null);
	}

	/* 交易获取 PayID */
	Business.Pay = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'Pay', null, null);
	}

	/* 挂号(当日挂号) */
	Business.Register = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'Register', null, null);
	}
	
	/* 退号（当日挂号） */
	Business.RefundRegInfo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'RefundRegInfo', null, null);
	}

	/* 微信/支付宝退费、退单 */
	Business.RefundPay = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'RefundPay', null, null);
	}

	/* 银联社保退号后更新退款状态 */
	Business.UpdatePay = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'UpdatePay', null, null);
	}

	/* 关闭订单 */
	Business.ClosePay = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'ClosePay', null, null);
	}

	/* 查询处方 */
	Business.QueryRecipes = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryRecipes', null, null);
	}

	/* 查询已缴费处方 (明细) */
	Business.GetClinPayList = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'GetClinPayList', null, null);
	}

	/* 查询处方列表 自费金额 */
	Business.GetPayPrepare = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'GetPayPrepare', null, null);
	}

	/* 处方支付接口 */
	Business.PayRecipes = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'PayRecipes', null, null);
	}

	/* 查询处方详情 */
	Business.QueryRecipesDetail = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryRecipesDetail', null, null);
	}

	/* 预约取号 */
	Business.SaveAppointment = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'SaveAppointment', null, null);
	}

	/* 线上取号 */
	Business.OutLineRegCheckIn = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'OutLineRegCheckIn', null, null);
	}

	/* 补打挂号凭条 */
	Business.PrintByCardNo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'PrintByCardNo', null, null);
	}

	/* 查询明细清单打印次数 */
	Business.SelectPrintlog = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'SelectPrintlog', null, null);
	}

	/* 更新清单打印次数 */
	Business.UpdatePrintlog = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'UpdatePrintlog', null, null);
	}

	/* 发票打印 */
	Business.SelectInvoiceInfo = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'SelectInvoiceInfo', null, null);
	}

	/* 更新发票打印次数 */
	Business.UpdateInvoicePrintNum = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'UpdateInvoicePrintNum', null, null);
	}

	/* 查询发票印刷号 */
	Business.SelectInvoicePrintingNum = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'SelectInvoicePrintingNum', null, null);
	}

	/* 更新发票印刷号 */
	Business.UpdateInvoicePrintingNum = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'UpdateInvoicePrintingNum', null, null);
	}

	/* 更新支付pay接口的支付单号 Trance */
	Business.UpdatePaylog = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'UpdatePaylog', null, null);
	}

	/* 查询对账功能 */
	Business.QueryPaylog = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryPaylog', null, null);
	}

	/* 查询自助机所有模块 */
	Business.QueryModuleConfigTableList = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'QueryModuleConfigTableList', null, null);
	}

	/* 查询自助机paylog表支付信息 银行社保退号要用到 tag */
	Business.SelectPaylog = function(_param, _callback, _callback2, _errorback) {
		ajax(_param, _callback, _callback2, _errorback, 'post', 'SelectPaylog', null, null);
	}




	var ajax = function (_param, _callback, _callback2, _errorback, _type, _url, _dataType, _paramPath, _isTrue) {

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
			// dataType: _dataType,
			// processData: _processData,
			// contentType: _contentType,
			success	: function(ret, status, xhr) {
				// console.log(ret);
				//返回的数据不为空的时候
				if(ret != null){
					//返回的数据是字符串的话，将其转化为对象
					if(typeof ret == 'string'){
						var data = JSON.parse(ret);
						if(typeof data == 'object'){						
							if (data.ResultCode != undefined && data.ResultCode == 0 || _isTrue) { 
							//表示成功 如果 _isTrue  为真则无论返回的值是否为0 都调用第一个回调函数
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
					console.info('error');
				}
			},
			error: function (ret, status, error) {
				// console.info(ret);
				if (typeof _errorback == 'function')
					_errorback(ret, status, error);
			}
		});
	}

	return {
		Admin: Admin,
		Business: Business,
	};
})()

