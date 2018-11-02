/* 2017-07-13 16:43:52 */
;
$(function() {

	// 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };
	
	// 初始化功能
	InitOperate();	

});

const AJAX = top.AJAX;
const CampusVal = top.CampusVal;
const loginInfo = JSON.parse(ThisWindow.ReadDict('login'));  // 读取字典	
var ZZJINFO = top.ZZJINFO;
var CASHSTATE = top.CASHSTATE;

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
		// 现金上班
		case 0: 
			if (CASHSTATE) {
				$.layerPop({
					msg: '现金已经是上班状态！',
					time: 6
				});
			} else {
				$.layerPop({
					msg: '请确认现金功能上班？ </br> 现金相关功能将开启使用',
					time: 6,
					yes: function() {
						CashUpDown('true');		
					}
				});
			}				
			break;

		// 现金下班
		case 1:
			if (CASHSTATE) {
				$.layerPop({
					msg: '请确认现金功能下班？ </br> 现金相关功能将暂停使用',
					time: 6,
					yes: function() {
						CashUpDown('false');
					}
				});
			} else {
				$.layerPop({
					msg: '现金已经是下班状态！',
					time: 6
				});
			}
			break;

		// 当日明细
		case 2:
			$(document.body).append(CurrentDetailText);

			// 初始化表头
			$.initTableHead('#data-table thead tr', TableHeadData);

			// 初始化查询数据
			InitSearchData();
			break;

		// 零钱管理
		case 3:
			$(document.body).append(ChangePurseText);

			BingdChangePurseEvent();
			break;
	}
}

/*
 * 现金上下班
 * @param _stStr 状态字符串
 */
function CashUpDown(_stStr) {
	var param = {
		DictContent: {
			Name: 'IsCompoundCardCash',             // 字典名称
			Type: 2,                                // 类型
			Obj: ZZJINFO.ZZJInfomation.ZZJID,       // 指向
			DistrictID: CampusVal,                  // 院区 id
			Value: _stStr,                          // 字典值
			Remarks: '现金上下班'                   // 备注
		}
	}
	AJAX.Admin.ChangeDict(param, function(ret) {
		// console.log(ret);
		CASHSTATE = _stStr === 'true';
		$.layerPop({
			msg: '修改成功！',
			time: 6,
			btn: ['确认']
		});
	}, function(ret) {
		console.info(ret);
		$.layerPop({
			msg: ret.Msg,
			time: 6,
			btn: ['确认']
		});
	});
}

/*
 * 输出查询数据
 */
function InitSearchData() {
	var ele = '#current-detail';
	PageBack(ele);
	var today = new Date().getTime();
    // var lastWeek = today - 7*24*60*60*1000;
    // var startDate = $.formatDate(lastWeek).substring(0, 10);
    var endDate = $.formatDate(today).substring(0, 10);
    $('#startDate').val(endDate);
    $('#endDate').val(endDate);

	// 日期控件
    $('#datepicker').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        endDate: new Date(),
    	todayBtn: true,
        autoclose: true
    });

    // 查询
	QueryCashList();
	    
    // 查询按钮
    $('#current-detail .btn-search').on('click', QueryCashList);

    // 打印汇总
    $('#current-detail .btn-print').on('click', function() {
    	console.log(PT_data);
    	DJXJHZPT(PT_data);
    });
}

/* 查询现金业务 */
var PT_data;
function QueryCashList() {
	var start = $('#startDate').val();
	var end = $('#endDate').val();
	var param = {
		DateTimeBetween: {
		   StartTime: start + ' 00:00:00',                     //开始查询时间  可为空
		   EndTime: end + ' 23:59:00'                          //结束查询时间   可为空
		},
		ZZJCertificate: ZZJINFO.ZZJInfomation,
	}
	AJAX.Admin.QueryCashByTime(param, function(ret) {
		console.log(ret);
		PT_data = ret;
		PT_data.startTime = param.DateTimeBetween.StartTime
		PT_data.endTime = param.DateTimeBetween.EndTime

		var data = TransformData(ret.RechargeLog);

	    // 调用插件
		GetTablePlugin('#data-table', data);

		// 总数
	    $('.total-info .pull-left .item:eq(0) .value').html(ret.xjCount);
	    $('.total-info .pull-left .item:eq(1) .value').html('￥' + ret.xjSum.toFixed(2));

	}, function(ret) {
		console.log(ret);
		$.layerPop({
			msg: ret.Msg,
			time: 15,
			btn: ['确认']
		});
	});
}


/*
 * 零钱管理
 */
function BingdChangePurseEvent() {
	var ele = '#change-purse';
	var $input = $(ele + ' .wrap .row-item:eq(0) .value');
	PageBack(ele);

	$(ele + ' .wrap .value').on('click', function() {
		$input = $(this);
	});

	// 输入数字
	$(ele + ' .numbers li:not(li[remove])').on('click', function() {
		var CurrNum = $input.val() + '';
		var num = $(this).text();
		var val = Number(CurrNum + num)
		$input.val(val);
	});

	// 删除
	$(ele + ' .numbers li[remove]').on('click', function() {
		var CurrNum = $input.val() + '';
		$input.val(CurrNum.substring(0, CurrNum.length - 1));
	});

	// 确认添加
	$(ele + ' .btn-affirm').on('click', function() {
		var Coin1Count = Number($(ele + ' .wrap .row-item:eq(0) .value').val());
		var Coin5Count = Number($(ele + ' .wrap .row-item:eq(1) .value').val());
		if (!Coin1Count && !Coin5Count)
			return $.layerPop({
				msg: '添加硬币数量不可全部为0！'
			});
		$.layerPop({
			msg: '请确认添加硬币！</br>1元硬币' + Coin1Count + '个，5角硬币' + Coin5Count + '个！',
			time: 6,
			yes: function() {
				var param = {
					AddFlag: true,                          // true 添加  false清空
					Coin1Count: Coin1Count,                 // 1元硬币个数
					Coin5Count: Coin5Count,                 // 5角硬币个数
					ZZJCertificate: top.ZZJCertificate,     // 自助机信息
					AdminCertificate: loginInfo
				}
				AddOrResetCoins(param);
			}
		});
	});

	// 清空硬币
	$(ele + ' .btn-clear').on('click', function() {
		$.layerPop({
			msg: '请确认是否清空硬币！清空后剩余硬币将归零！',
			time: 6,
			yes: function() {
				var param = {
					AddFlag: false,                         // true 添加  false清空
					Coin1Count: 0,
					Coin5Count: 0,
					ZZJCertificate: top.ZZJCertificate,     // 自助机信息
					AdminCertificate: loginInfo
				}
				AddOrResetCoins(param);
			}
		});
	});
}

/*
 * 管理硬币
 * @param _param 提交参数
 */
function AddOrResetCoins(_param) {
	AJAX.Admin.AddOrResetCoins(_param, function(ret) {
		console.log(ret);
		$.layerPop({
			msg: '操作成功！',
			time: 3,
		});
	}, function(ret) {
		console.log(ret);
		$.layerPop({
			msg: ret.Msg,
			time: 15,
			btn: ['确认']
		});
	});
}

/*
 * 调用 table 插件 
 * @param ele table id  
 * @param _data 显示数据 
 */
function GetTablePlugin(ele, _data) {
    $(ele).bootstrapTable('load', _data);
    $(ele).bootstrapTable({
        data: _data,
        height: 600,
        striped: true
    });
};


/* 
 * 转换数据
 * @param _data 数据
 */
function TransformData(_data) {
	var data = [];
	$.each(_data, function(n, val) {
		var obj = {
			SerialNum: val.SerialNumber,
			Time: val.Time.substring(0, 19).replace('T', ' '),
			// CaseNum: val.PatientInfo.PatientID,
			// CardType: val.CardInfo.CardType,
			CardNum: val.CardInfo.CardNo,
			Name: val.PatientInfo.PatientName,
			Cost: val.Amount,
			// DealType: '现金',
			PaperNum: val.PaperMoney,
			// Coin1Count: val.Coin1Count,
			// Coin5Count: val.Coin5Count,
			HIS: val.Success,
			Number: val.ZZJID,
			Desc: val.Remarks 
		};
		data.push(obj);
	});

	return data;
}


/* 临时数据 */
var TableData = [];
for (var i = 0; i < 50; i++) {
	var obj = {
		SerialNum: 'ZZJ-NUM-00' + i,
		Time: '2017-07-' + i,
		CaseNum: 'BL-' + i,
		CardType: '类型' + i,
		Name: '名称' + i,
		Cost: [Math.ceil(Math.random()*2000) + 1000],
		DealType: '交易类型' + i,
		PaperNum: '00' + i,
		HIS: ['成功', '失败'][Math.ceil(Math.random()*2) - 1],
		Number: 'ZZJ-' + i,
		Desc: '备注' + i 
	};
	TableData.push(obj);
}


/* 表头数据 */
var TableHeadData = [
	{
 		name: '自助机流水号',
 		field: 'SerialNum',
 		sortable: true
 	}, {
 		name: '时间',
 		field: 'Time',
 		sortable: true
 	}, {
 		name: '姓名',
 		field: 'Name',
 		sortable: true
 	}, {
 		name: '卡号',
 		field: 'CardNum',
 		sortable: true
 	}, {
 		name: '实收金额',
 		field: 'Cost',
 		sortable: true
 	}/*, {
 		name: '现金金额',
 		field: 'PaperNum',
 		sortable: true
 	}, {
 		name: '1元硬币(个)',
 		field: 'Coin1Count',
 		sortable: true
 	}, {
 		name: '5角硬币(个)',
 		field: 'Coin5Count',
 		sortable: true
 	}*/, {
 		name: 'HIS标志',
 		field: 'HIS',
 		sortable: true
 	}, {
 		name: '设备编号',
 		field: 'Number',
 		sortable: true
 	}, {
 		name: '备注',
 		field: 'Desc',
 		sortable: true
 	}
];



// 明细
var CurrentDetailText = '<div id="current-detail" class="animated fadeInUp">'
			+ '<div class="content">'
			+ '<h2 class="title text-center">每日明细</h2>'
			+ '<div class="table-wrap">'
			+ '<div class="search-wrap clearfix m-b-l">'
			+ '<div class="pull-left">'
			+ '<div class="date-wrap input-daterange" id="datepicker">'
			+ '<input type="text" class="" name="start" id="startDate" placeholder="请选择开始日期" readonly />'
            + '<span class="input-group-addon">到</span>'
            + '<input type="text" class="" name="end" id="endDate" placeholder="请选择结束日期" readonly />'
			+ '</div>'
			+ '<div class="btn btn-search m-l-l">查询</div></div>'
			+ '<div class="pull-right">'
			+ '<div class="btn btn-back">返回 <i class="fa fa-reply"></i></div>'
			+ '</div></div>'

			+ '<table id="data-table"><thead><tr></tr></thead></table>'

			+ '<div class="total-info m-t-l clearfix">'
			+ '<div class="pull-left">'
			+ '<div class="item">'
			+ '<span class="name">笔数：</span>'
			+ '<span class="value"></span>'
			+ '</div>'
			+ '<div class="item">'
			+ '<span class="name">总金额：</span>'
			+ '<span class="value"></span>'
			+ '</div></div>'
			+ '<div class="pull-right">'
			+ '<div class="btn btn-print">打印汇总</div>'
			// + '<div class="btn btn-settle">HIS结账</div>'
			+ '</div></div></div></div></div>'


// 零钱管理
var ChangePurseText = '<div id="change-purse" class="animated fadeInUp">'
				+ '<div class="content text-center">'
				+ '<h2 class="title">零钱管理</h2>'
				+ '<div class="wrap">'
				+ '<div class="row-item">'
				+ '<span class="name">添加1元硬币：</span>'
				+ '<input type="text" class="value" placeholder="请输入添加硬币个数">'
				+ '</div>'
				+ '<div class="row-item">'
				+ '<span class="name">添加5角硬币：</span>'
				+ '<input type="text" class="value" placeholder="请输入添加硬币个数">'
				+ '</div>'
				+ '</div>'
				+ '<div class="btn-wrap">'
				+ '<div class="numbers">'
				+ '<ul class="clearfix"><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li><li remove="">删除</li></ul>'
				+ '</div>'
				+ '<div class="btn btn-affirm pull-left">确认</div>'
				+ '<div class="btn btn-clear">清空硬币</div>'
				+ '<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>'
				+ '</div>'
				+ '</div>'
				+ '</div>';