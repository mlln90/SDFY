/* 2017-07-14 10:41:08 */
;
$(function() {

	// 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };
    
	// 结账
	$('.btn-settle').one('click', function() {
		var param = {
			ZZJCertificate: top.ZZJCertificate
		}
		AJAX.Admin.CheckOut(param, function(ret) {
			console.log(ret);
			$('.total-list .row-item:eq(0) .value').html(ret.BKCount + '笔');                         // 发卡笔数
			// $('.total-list .row-item:eq(0) .value').html('￥' + Number(ret.BKSum).toFixed(2));        // 发卡金额

			$('.total-list .row-item:eq(1) .value').html(ret.CashCount + '笔');                         // 充值成功笔数
			$('.total-list .row-item:eq(2) .value').html('￥' + Number(ret.CashSum).toFixed(2));        // 充值成功金额

			$('.total-list .row-item:eq(3) .value').html(ret.CashfalseCount + '笔');                         // 充值失败笔数
			$('.total-list .row-item:eq(4) .value').html('￥' + Number(ret.CashfalseSum).toFixed(2));        // 充值失败金额

			$('.total-list .row-item:eq(5) .value').html(ret.xjCount + '笔');                         // 交易总笔数
			$('.total-list .row-item:eq(6) .value').html('￥' + Number(ret.xjSum).toFixed(2));        // 钱箱总金额

			/*$('.total-list .row-item:eq(2) .value').html('￥' + Number(ret.xjTrueSum).toFixed(2));    // 现金成功金额
			$('.total-list .row-item:eq(3) .value').html('￥' + Number(ret.PaperMoney).toFixed(2));   // 纸币器入钞
			$('.total-list .row-item:eq(4) .value').html(ret.RemainderCoin1Count + '个');             // 1元硬币个数
			$('.total-list .row-item:eq(5) .value').html(ret.RemainderCoin5Count + '个');             // 5角硬币个数*/

			ret.PlusCoin1Count = 0;
			ret.PlusCoin5Count = 0;
			DJXJJZPT(ret);
			setTimeout(function() {
				DJXJJZPT(ret);
			}, 500);
		}, function(ret) {
			console.log(ret);
			LogHelper.WriteLog(ret.Msg);
			$.layerPop({
				msg: ret.Msg,
				time: 15,
				btn: ['确认']
			});
		});
	});

	// 结账历史
	$('.btn-history').on('click', function() {

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
	})


});

const AJAX = top.AJAX;
const ZZJINFO = top.ZZJINFO;
const CampusVal = top.CampusVal;


/*
 * 输出查询数据
 */
function InitSearchData() {

	var today = new Date().getTime();
    var lastWeek = today - 7*24*60*60*1000;
    var startDate = $.formatDate(lastWeek).substring(0, 10);
    var endDate = $.formatDate(today).substring(0, 10);
    $('#startDate').val(startDate);
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
}

/* 查询结账历史 */
var ExtUserID = '';
function QueryBankList() {
	var start = $('#startDate').val();
	var end = $('#endDate').val();
	var param = {
		DateTimeBetween: {
		   StartTime: start + ' 00:00:00',                     //开始查询时间  可为空
		   EndTime: end + ' 23:59:00'                          //结束查询时间   可为空
		},
		ZZJCertificate: ZZJINFO.ZZJInfomation,
	}
	AJAX.Admin.QueryInvoicing(param, function(ret) {
		// console.log(ret);
		ExtUserID = ret.ExtUserID;
		var data = TransformData(ret.Tb_ZZJ_XJJZMX);

	    // 调用插件
		GetTablePlugin('#data-table', data);

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
        height: 700,
        striped: true
	});
	
	// 获取点击行的数据
    var rowData;
    $(ele).unbind();
    $(ele).on('click-row.bs.table', function(e, row, ele) {
        rowData = row;
    });

    // 操作按钮
    $(ele).on('click', function(e) {
        if (e.target.nodeName == 'BUTTON') {
            var type = $(e.target).data('type');
            PopControl(type, rowData);
        }
    });
};


/*
 * 功能弹窗管理
 * @param _type 类型
 * @param _data 数据
 */
function PopControl(_type, _data) {
	switch (_type) {
		// 补卡
		case 1: 
			DJBDXJJZPT(_data)
			break;
	}
}

/* 
 * 转换数据
 * @param _data 数据
 */
function TransformData(_data) {
	var data = [];

	$.each(_data, function(n, val) {
		var obj = {
			ZZJNumber: val.ZZJBH,
			Time1: val.JZKSSJ.substring(0, 19).replace('T', ' '),
			Time2: val.JZJSSJ.substring(0, 19).replace('T', ' '),
			SucceedCount: val.CZCGBS,
			SucceedSum: val.CZCGJE,
			FaileCount: val.CZSBBS,
			FaileSum: val.CZSBJE,
			DealCount: val.SSBS,
			DealSum: val.SSJE,
			CreateCardCount: val.KP,
			Operate: GetOperate(),
		};
		data.push(obj);
	});

	return data;
}

// 获取操作功能按钮
function GetOperate() {
	var btns = '<button class="btn btn-affirm" data-type="1">补打</button> ';
	return btns;
}





/* 表头数据 */
var TableHeadData = [
	{
		name: '操作',
		field: 'Operate',
	}, {
		name: '自助机ID',
		field: 'ZZJNumber',
		sortable: true
	}, {
		name: '开始时间',
		field: 'Time1',
		sortable: true
	}, {
		name: '结束时间',
		field: 'Time2',
		sortable: true
	}, {
		name: '成功笔数',
		field: 'SucceedCount',
		sortable: true
	}, {
		name: '成功金额',
		field: 'SucceedSum',
		sortable: true
	}, {
		name: '失败笔数',
		field: 'FaileCount',
		sortable: true
	}, {
		name: '失败金额',
		field: 'FaileSum',
		sortable: true
	}, {
		name: '交易总笔数',
		field: 'DealCount',
		sortable: true
	}, {
		name: '交易总金额',
		field: 'DealSum',
		sortable: true
	}, {
		name: '发卡笔数',
		field: 'CreateCardCount',
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
			// + '<span class="name">笔数：</span>'
			// + '<span class="value"></span>'
			+ '</div>'
			+ '<div class="item">'
			// + '<span class="name">总金额：</span>'
			// + '<span class="value"></span>'
			+ '</div></div>'
			+ '<div class="pull-right">'
			// + '<div class="btn btn-print">打印汇总</div>'
			// + '<div class="btn btn-settle">POS结账</div>'
			+ '</div></div></div></div></div>'



// 单机补打凭条
function DJBDXJJZPT(_data) {
	ZZJPrinter.Print(PTJPRINTNAME, 300, 550, false, function(Code, ID){
		if (Code == 0) { // 打印机正常
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 0+_PR_, 0, '新疆兵团第十三师红星医院');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 60+_PR_, 30, '单机补打结账凭条');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 50, '-------------------------------');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 75, '结账时间：' + _data.Time1  + ' 至');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 75+_PR_, 100, _data.Time2 + '');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 140, '自助机结账金额：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 160, '-------------------------------');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 185, '钱箱金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 75+_PR_, 183, '￥' + _data.DealSum.toFixed(2) + '元');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 205, '交易笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 75+_PR_, 205, _data.DealCount + '笔');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 240, '充值成功金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 238, '￥' + _data.SucceedSum.toFixed(2) + '元');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 265, '充值成功笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 110+_PR_, 265, _data.SucceedCount + '笔');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 300, '充值失败金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 300, '￥' + _data.FaileSum.toFixed(2) + '元');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 325, '交易失败笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 110+_PR_, 325, _data.FaileCount + '笔');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 385, '发卡笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 75+_PR_, 385, _data.CreateCardCount + '笔');


	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 420, '打 单 人：自助机管理员' );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 445, '核 对 人：' );

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 465, '收 费 员：' + ExtUserID);

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 490, '自助机编号：' + ZZJINFO.ZZJInfomation.Name);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 515, '打印时间：' + $.formatDate(new Date().getTime()));
	       
	        ZZJPrinter.StartPrint(ID);
	    } else { // 打印机异常
	        ThisWindow.Speak(ID);
			LogHelper.WriteLog(ID);
	        $.layerPop({
	        	type: 0,
				time: 15,
				title: '确认提示',
				msg: ID
	        });
	    }
    });
}