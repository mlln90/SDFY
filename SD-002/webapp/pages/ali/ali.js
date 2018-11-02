/* 2017-07-14 10:04:18 */
;
$(function() {

	// 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };
	
	// 初始化功能
	InitOperate();	

});

var AJAX = top.AJAX;
var ZZJINFO = top.ZZJINFO;
var CampusVal = top.CampusVal;
var ALISTATE = top.ALISTATE;

var flagId = ZZJINFO.ZZJInfomation.ZZJID;   

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
		// 每日明细
		case 0: 
			$(document.body).append(CurrentDetailText);

			// 初始化表头
			$.initTableHead('#data-table thead tr', TableHeadData);

			// 初始化查询数据
			InitSearchData();

			$('#current-detail .btn-back').on('click', function() {
				$('#current-detail').attr('class', 'animated fadeOutUp');
				setTimeout(function() {
					$('#current-detail').remove()
				}, 600);
			});
			break;

		// 支支付宝上班
		case 1: 
			if (ALISTATE) {
				$.layerPop({
					msg: '支付宝扫码已经是开启状态！',
					time: 6
				});
			} else {
				$.layerPop({
					msg: '请确认支付宝扫码功能开启？ </br> 支付宝扫码相关功能将开启使用',
					time: 6,
					yes: function() {
						BankUpDown('true');		
					}
				});
			}				
			break;

		// 支支付宝下班
		case 2:
			if (ALISTATE) {
				$.layerPop({
					msg: '请确认支付宝扫码功能关闭？ </br> 支付宝扫码相关功能将暂停使用',
					time: 6,
					yes: function() {
						BankUpDown('false');
					}
				});
			} else {
				$.layerPop({
					msg: '支付宝扫码已经是关闭状态！',
					time: 6
				});
			}
			break;
	}
}

/*
 * 支付宝上下班
 * @param _stStr 状态字符串
 */
function BankUpDown(_stStr) {
	var param = {
		DictContent: {
			Name: 'IsCompoundCardAli',              // 字典名称
			Type: 2,                                // 类型     
			Obj: ZZJINFO.ZZJInfomation.ZZJID,       // 指向
			DistrictID: CampusVal,                  // 院区 id
			Value: _stStr,                          // 字典值
			Remarks: '是否支持支付宝扫码'                 // 备注
		}
	}
	AJAX.Admin.ChangeDict(param, function(ret) {
		// console.log(ret);
		ALISTATE = _stStr === 'true';
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
	QueryBankList();

    // 查询按钮
    $('#current-detail .btn-search').on('click', QueryBankList);

    // 是否全部查询
    $('#current-detail .btn-all').on('click', function(){
    	if(flagId == null ){
    		flagId = ZZJINFO.ZZJInfomation.ZZJID;
    		$(this).html("ALL")
    	}else{
    		flagId = null;
    		$(this).html("ONE")
    	}
    });

    // 打印汇总
    $('#current-detail .btn-print').on('click', function() {
    	console.log(PT_data);
    	DJXJHZPT(PT_data, 4);
    });
}

/* 查询支付宝业务 */
var PT_data;
function QueryBankList() {
	var start = $('#startDate').val();
	var end = $('#endDate').val();
	var param = {
		DateTime: {
		    StartTime : start + ' 00:00:00', 
			EndTime   : end + ' 23:59:00'
		},
		"PayMetHod" : 4,
		// "ZZJCertificate" : {"ID" : ZZJINFO.ZZJInfomation.ZZJID },
		"ZZJCertificate" : {"ID" : flagId }
	}
	// AJAX.Admin.QueryTreasureByTime1(param, function(ret) {
	AJAX.Business.QueryPaylog( JSON.stringify(param), function(ret){
		console.log(ret);
	}, function(ret){
		console.log(ret);
		PT_data = ret;
		PT_data.startTime = param.DateTime.StartTime
		PT_data.endTime = param.DateTime.EndTime
		var data = TransformData(ret.PaylogInfo);

	    // 调用插件
		GetTablePlugin('#data-table', data);

		// 总数
	    $('.total-info .pull-left .item:eq(0) .value').html(ret.PaylogInfo.length);
	    $('.total-info .pull-left .item:eq(1) .value').html('￥' + ret.PayAmountSum.Alipay_Amount);

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
		if(val.business_type == 0){
			msg = "挂号"
		}else if(val.business_type == 2){
			msg = "取号"
		}else if(val.business_type == 3){
			msg = "处方缴费"
		}else if(val.business_type == 4){
			msg = "病历本"
		}else{
			msg = "未定义"
		}
		var obj = {
			SerialNum: val.zzjserialnumber,         // 交易流水
			Time: val.time.substring(0, 19),        // 日期
			CardNum: val.cardno,                    // 卡号
			Name: val.patientname,                  // 姓名
			Cost: val.amount,                       // 金额
			HIS: val.trance_id,                     // 交易单号
			Number: val.zzjid,                      // 自助机编号
			Status: val.pay_success,                // 支付转态
			ID  : val.id,                           // 支付id
			BusinessStatus : val.business_success,  // 业务状态
			BusinessType : msg,                     // 业务类型
			Telphone : val.mobile,                  // 手机号码
			Retfund : val.retfund,                  // 是否退费
			Desc: '--'
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
		CardNum: '0000' + i,
		CardType: '类型' + i,
		Cost: [Math.ceil(Math.random()*2000) + 1000],
		BankCard: '323200' + i,
		POSSerialNum: 'POS-324' + i,
		POSReferNum: 'POS-Ck-433' + i,
		BusinessType: '业务类型' + i,
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
        name: '病历号',
        field: 'CardNum',
        sortable: true
    }, {
        name: '金额',
        field: 'Cost',
        sortable: true
    }, {
        name: '交易单号',
        field: 'HIS',
        sortable: true
    }, {
        name: '设备编号',
        field: 'Number',
        sortable: true
    }, {
		name: '支付状态',
		field: 'Status',
		sortable: true
	}, {
		name: '支付ID',
		field: 'ID',
		sortable: true
	}, {
		name: '业务状态',
		field: 'BusinessStatus',
		sortable: true
	}, {
		name: '业务类型',
		field: 'BusinessType',
		sortable: true
	}, {
		name: '联系电话',
		field: 'Telphone',
		sortable: true
	}, {
		name: '是否退款',
		field: 'Retfund',
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
			+ '<div class="btn btn-search m-l-l">查询</div>'
			+ '<div class="btn btn-all m-l-l">ALL</div></div>'
			
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
			// + '<div class="btn btn-settle">POS结账</div>'
			+ '</div></div></div></div></div>'