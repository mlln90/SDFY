$(function() {

	// 获取当前硬件配置
	var param = {
    	TableID: ZZJINFO.ZZJInfomation.DeviceConfigTable.ID
    }
    // AJAX.Admin.QueryDeviceConfigTable( JSON.stringify(param), function(ret) {
    // 	// console.log(ret);
    // 	var data = ret.DeviceConfigTable.DeviceInfomations;
    // 	JudgeHardwareModel(data);
    // }, function(ret) {
    // 	console.log(ret);
    // });

});

/*
 * 判断硬件型号
 * @param _data 硬件列表
 */
function JudgeHardwareModel(_data) {
	$.each(_data, function(n, val) {
		switch (val.DeviceType) {
			case 1: // 读卡器
				DKQNAME = val.DeviceName;
				DKQCOM = Number(val.COM);
				break;

			case 3: // 证卡机
				ZKJNAME = val.DeviceName;
				ZKJCOM = Number(val.COM);
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
				break;

			case 5: // 门禁
				COMPORT = Number(val.COM);
				break;

			case 6: // 报告单打印机
				BGDPRINTNAME = val.DeviceName;
				break;

			case 7: // 身份证阅读器
				SFZYDQNAME = val.DeviceName;
				break;

			case 8: // 密码键盘
				break;

			case 9: // 纸币器
				ZBQNAME = val.DeviceName;
				ZBQCOM = Number(val.COM);
				break;

			case 10: // 条码器
				BARCODENAME = val.DeviceName;
				BARCODECOM = Number(val.COM);
				break;

			case 11: //硬币器
				YBQCOM = 'COM' + val.COM;
				break;
		}
	});
}




/* 全局变量 */
var INDICATORTYPE = 1;            // 指示灯提示类型 1 - 闪烁 3 - 常亮
var DTPTTYPEFACE = '微软雅黑';    // 凭条打印字体
var _PR_ = 0;                     // 凭条打印向右移

var DKQNAME = 'CRT310';           // 读卡器名称
var DKQCOM = 1;                   // 读卡器 COM 口
var ZKJCOM = 10;                  // 证卡机 COM 口
var ZKJNAME = 'Seaory T12';       // 证卡机名称
// var PTJPRINTNAME = 'T90';      // 凭条机名称
var PTJPRINTNAME = 'CUSTOM K80';  
var BGDPRINTNAME = 'Brother HL-5590DN Printer';   // 报告单打印机名称
var COMPORT = 5;                  // 组件 COM 端口号
var SFZYDQNAME = 'SD';            // 身份证阅读器名称
var MMJPNAME;                     // 金属键盘名称 --备用--
var ZBQNAME = 'MEI';              // 纸币器名称
var ZBQCOM = 4;                   // 纸币器 com 口
var BARCODENAME = 'XN200';        // 条码机型号
var BARCODECOM = 7;               // 条码机com口
var YBQCOM = 'COM2';              // 硬币器om口

/*
 * 单机现金结账
 * @param _data 单机数据
 */
function DJXJJZPT_(_data) {
	var hospital = ['河医', '东院', '口腔', '惠济'][CampusVal-1];
	ZZJPrinter.Print(PTJPRINTNAME, 300, 550, false, function(Code, ID){
		if (Code == 0) { // 打印机正常
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 14, 0, _PR_, 0, '佛山顺德妇幼保健院' + hospital);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 70+_PR_, 30, '设备结账清单');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 20, 0, 0+_PR_, 40, '————————————————————————————————');

	        var strTime = _data.DateTimeBetween.StartTime.replace(/T/, ' ');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 70, '结账时间：' + strTime  + ' 至');
	        var endTime = _data.DateTimeBetween.EndTime.replace(/T/, ' ');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 75+_PR_, 90, endTime + '');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 110, '自助机编号：' + ZZJINFO.ZZJInfomation.Name);
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 20, 0, 0+_PR_, 120, '————————————————————————————————');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 150, '加硬币1元：');
	        var Coin1Money = _data.PlusCoin1Count;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 90+_PR_, 150, _data.PlusCoin1Count + '枚（￥' + Coin1Money.toFixed(2) + '元）');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 170, '加硬币5角：');
	        var Coin5Money = _data.PlusCoin5Count / 2;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 90+_PR_, 170, _data.PlusCoin5Count + '枚（￥' + Coin5Money.toFixed(2) + '元）');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 0+_PR_, 190, '合计：' + (Coin1Money + Coin5Money).toFixed(2) + '元');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 20, 0, 0+_PR_, 200, '————————————————————————————————');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 0+_PR_, 230, '交易硬币1元：' );
	        var Coin1Money = _data.Coin1Count;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 230, _data.Coin1Count + '枚（￥' + Coin1Money.toFixed(2) + '元）');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 250, '交易硬币5角：');
	        var Coin5Money = _data.Coin5Count / 2;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 250, _data.Coin5Count + '枚（￥' + Coin5Money.toFixed(2) + '元）');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 0+_PR_, 270, '合计：' + (Coin1Money + Coin5Money).toFixed(2) + '元');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 20, 0, 0+_PR_, 280, '————————————————————————————————');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 0+_PR_, 310, '剩余硬币1元：' );
	        var RemainderCoin1Count = _data.RemainderCoin1Count;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 310, _data.RemainderCoin1Count + '枚（￥' + RemainderCoin1Count.toFixed(2) + '元）');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 330, '剩余硬币5角：');
	        var RemainderCoin5Count = _data.RemainderCoin5Count / 2;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 330, _data.RemainderCoin5Count + '枚（￥' + RemainderCoin5Count.toFixed(2) + '元）');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 12, 0, 0+_PR_, 350, '合计：' + (RemainderCoin1Count + RemainderCoin5Count).toFixed(2) + '元');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 20, 0, 0+_PR_, 360, '————————————————————————————————');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 390, '纸币接收总额：￥' + _data.PaperMoney.toFixed(2) + '元');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 410, '交易总金额：￥' + _data.xjSum.toFixed(2) + '元');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 20, 0, 0+_PR_, 420, '————————————————————————————————');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 450, '打印时间：' + $.formatDate(new Date().getTime()));
	       
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


/*
 * 单机现金结账
 * @param _data 单机数据
 */
function DJXJJZPT(_data) {
	ZZJPrinter.Print(PTJPRINTNAME, 300, 550, false, function(Code, ID){
		if (Code == 0) { // 打印机正常
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 0+_PR_, 0, '佛山顺德妇幼保健院');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 60+_PR_, 30, '单机现金结账凭条');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 50, '-------------------------------');

	        var strTime = _data.DateTimeBetween.StartTime.replace(/T/, ' ');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 75, '结账时间：' + strTime  + ' 至');
	        var endTime = _data.DateTimeBetween.EndTime.replace(/T/, ' ');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 75+_PR_, 100, endTime + '');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 140, '自助机结账金额：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 160, '-------------------------------');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 185, '钱箱金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 75+_PR_, 183, '￥' + _data.xjSum.toFixed(2) + '元');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 205, '交易笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 75+_PR_, 205, _data.xjCount + '笔');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 240, '充值成功金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 238, '￥' + _data.CashSum.toFixed(2) + '元');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 265, '充值成功笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 110+_PR_, 265, _data.CashCount + '笔');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 300, '充值失败金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 300, '￥' + _data.CashfalseSum.toFixed(2) + '元');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 325, '交易失败笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 110+_PR_, 325, _data.CashfalseCount + '笔');

	        /*ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 360, '发卡收钞金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 360, '￥' + _data.BKSum.toFixed(2) + '元');*/

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 385, '发卡笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 75+_PR_, 385, _data.BKCount + '笔');


	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 420, '打 单 人：自助机管理员' );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 445, '核 对 人：' );

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 465, '收 费 员：' + _data.ExtUserID);

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


/*
 * 单机现金 / 银行 汇总
 * @param _data 单机数据
 * @param _type 类型
 */
function DJXJHZPT(_data, _type) {
	// var hospital = ['河医', '东院', '口腔', '惠济'][CampusVal-1];
	ZZJPrinter.Print(PTJPRINTNAME, 300, 460, false, function(Code, ID){
		if (Code == 0) { // 打印机正常
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 0+_PR_, 0, '佛山顺德妇幼保健院');
	        var sum = 0,falseSum = 0;
	        if (_type == 1) {
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 60+_PR_, 30, '单机银行汇总凭条');
	        	sum = _data.PayAmountSum.Bank_Amount;
	        	falseSum = _data.PayAmountSum.Bank_refend;
	        } else if (_type == 3) {
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 60+_PR_, 30, '单机微信汇总凭条');
	        	sum = _data.PayAmountSum.Wechat_Amount;
	        	falseSum = _data.PayAmountSum.Wechat_refend;
	        } else if (_type == 4) {
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 60+_PR_, 30, '单机支付宝汇总凭条');
	        	sum = _data.PayAmountSum.Alipay_Amount;
	        	falseSum = _data.PayAmountSum.Alipay_refend;
	        } else{
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 60+_PR_, 30, '单机社保汇总凭条');
	        	sum = _data.PayAmountSum.Social_Amount;
	        	falseSum = _data.PayAmountSum.Social_refend;
	        }
	        var falseCount = _data.PayAmountSum.fail;
	     
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 50, '-------------------------------');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 75, '统计时间：' + _data.startTime  + ' 至');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 75+_PR_, 100, _data.endTime + '');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 140, '统计金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 75+_PR_, 138, '￥' + sum.toFixed(2) + '元');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 165, '交易笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 75+_PR_, 163, _data.PaylogInfo.length + '笔');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 200, '交易成功金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 198, '￥' + sum.toFixed(2) + '元');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 225, '交易成功笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 110+_PR_, 225, _data.PaylogInfo.length + '笔');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 260, '交易失败金额：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 12, 0, 110+_PR_, 258, '￥' + falseSum.toFixed(2) + '元');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 285, '交易失败笔数：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 110+_PR_, 285, falseCount + '笔');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 295, '-------------------------------');



	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 325, '打 单 人：自助机管理员' );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 350, '核 对 人：' );

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 375, '收 费 员：' + _data.ExtUserID);

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 400, '自助机编号：' + ZZJINFO.ZZJInfomation.Name);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 425, '打印时间：' + $.formatDate(new Date().getTime()));
	       
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

/*
 * 主菜单配置
 */
var MainMenuConfig = [
	{
		name: '医院介绍',
		icon: 'hospital',
		type: 0,
		code: '',
		tag: '',
		show: true
	}, {
		name: '自助办卡',
		icon: 'auto-card',
		type: 1,
		code: 'ZZBK',
		tag: '插卡后隐藏',
		show: true
	}, {
		name: '微信支付服务',
		icon: 'get-number',
		type: 3,
		code: 'WXZFBQH',
		tag: '',
		show: true
	}, {
		name: '当日挂号',
		icon: 'register',
		type: 2,
		code: 'DRGH',
		tag: '',
		show: true
	}, {
		name: '充值缴费',
		icon: 'recharge',
		type: 4,
		code: 'CZJF',
		tag: '',
		show: true
	}, {
		name: '门诊预约',
		icon: 'subscribe',
		type: 5,
		code: 'MZYY',
		tag: '',
		show: true
	}, {
		name: '报告打印',
		icon: 'print-report',
		type: 7,
		code: 'BGDDY',
		tag: '',
		show: true
	}, {
		name: '信息查询',
		icon: 'query-onfo',
		type: 6,
		code: 'XXCX',
		tag: '',
		show: true
	}
];

// 隐藏界面
function PageBack(ele) {
	$(ele + ' .btn-back').on('click', function() {
		$(ele).attr('class', 'animated fadeOutUp');
		setTimeout(function() {
			$(ele).remove();
		}, 600);
	});
}