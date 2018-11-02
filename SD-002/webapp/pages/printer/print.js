/* 2018-07-30 17:43:52 */
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
var PRINTER = top.PRINTER;
var CardInfo = {};
var PAYSTATUES = true;
var ISBG;
console.log(ZZJINFO);


if(ZZJINFO.ZZJInfomation.DeviceConfigTable.ID == 2){
	PTJPRINTNAME = 'T90';
	ISBG = true;
}

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
		// 补打缴费凭条
		case 0: 
			if (PRINTER) {
				$.layerPop({
					msg: '请确认补打缴费凭条？ </br> 补打功能将开启使用',
					time: 6,
					yes: function() {
						console.log('补打缴费凭条');
						queryHuanZInfo(_type);		
					}
				});
			} else {
				$.layerPop({
					msg: '取消补打缴费凭条',
					time: 6
				});
			}				
			break;

		// 补打化验单  ======================================
		case 1:
			if (PRINTER) {
				$.layerPop({
					msg: '请确认补打缴费凭条？ </br> 补打功能将开启使用',
					time: 6,
					yes: function() {
						console.log('补打缴费凭条');
						queryHuanZInfo(_type);		
					}
				});
			} else {
				$.layerPop({
					msg: '取消补打缴费凭条',
					time: 6
				});
			}
			break;

		// 补打挂号凭条
		case 2:
			if (PRINTER) {
				$.layerPop({
					msg: '请确认补打挂号凭条？ </br> 补打功能将开启使用',
					time: 6,
					yes: function() {
						console.log('挂号凭条');
						queryHuanZInfo(_type);
					}
				});
			} else {
				$.layerPop({
					msg: '取消补打挂号凭条',
					time: 6
				});
			}
			break;
	}
}

var startime = "00:00:00";
var endtime  = "23:59:00";
// 查询患者信息   -- 输卡号
function queryHuanZInfo(_type){
	console.log(_type);
	if(_type == 1 || _type == 0){
		$(document.body).append(printerDetailText);
	}
	if(_type == 2){
		$(document.body).append(printerDetailTextOne);
	}
	
	var ele = '#change-purse';
	var $input = $(ele + ' .wrap .row-item:eq(0) .value');
	PageBack(ele);

	$(ele + ' .wrap .value').on('click', function() {
		$input = $(this);
	});

	// 输入数字
	$(ele + ' .numbers li:not(li[remove])').on('click', function() {
		var num = $(this).text();
		$input.val( $input.val() + num );
	});

	// 删除
	$(ele + ' .numbers li[remove]').on('click', function() {
		var CurrNum = $input.val() + '';
		$input.val(CurrNum.substring(0, CurrNum.length - 1));
	});

	// 确认
	$(ele + ' .btn-affirm').on('click', function() {
		var IDNo = $(ele + ' .wrap .row-item:eq(0) .value').val();
		var CardNo = $(ele + ' .wrap .row-item:eq(1) .value').val();
		startime = $(ele + " .wrap .row-item:eq(2) #startime").val()==""?startime:$(ele + " .wrap .row-item:eq(2) #startime").val();
		endtime  = $(ele + " .wrap .row-item:eq(3) #endtime").val()==""?endtime:$(ele + " .wrap .row-item:eq(3) #endtime").val();
		console.log(startime,endtime);
		if (IDNo != ''){
			var userID = {"ZZJCertificate":{"ID":ZZJINFO.ZZJInfomation.ZZJID},"CardInfo":{"CardNo":IDNo,"CardType":5}};
			AJAX.Business.QueryPatientInfo(JSON.stringify(userID) ,function(ret){
        		console.log(ret);
	        } ,function(ret){
        		console.log(ret);
        		var patientInfo = ret.PatientInfo;
        		if(ret.Code == 0){
        			if(patientInfo.IDNo == ''){
        				patientInfo.IDNo = IdentityInfo.IDNo;
        			};
        			if(ret.CardInfo.CardNo == ''){
        				ret.CardInfo.CardNo = CardNo;
        			}
        			CardInfo = {
			            "ZZJCertificate"  : { ID: ZZJINFO.ZZJInfomation.ZZJID },
			            "PatientInfo": {
			            	'PatientName' : patientInfo.PatientName,
			            	'PatientID'   : patientInfo.PatientID,
			            	'AccountID'   : patientInfo.AccountID,
			            	'IDNo'        : patientInfo.IDNo,
			            	'IDType'      : patientInfo.IDType,
			            	'PatientType' : patientInfo.PatientType,
			            	'Birthday'    : patientInfo.Birthday,
			            	'Mobile'      : patientInfo.Mobile,
			            	'Gender'      : patientInfo.Gender,
			            	'Address'     : patientInfo.Address,
			            	'Nation'      : patientInfo.Nation,
			            	'Balance'     : patientInfo.Balance,
			            	'Profession'  : patientInfo.Profession
			            },
			            'CardInfo'        : {
			            	'CardNo'      : ret.CardInfo.CardNo,
			            	'CardType'    : 5
			            }
			        };
			        console.log(CardInfo);
			        if(_type == 0){
			        	addPrinterRegisterCFPT();     // 补打处方缴费凭条
			        }
			        if(_type == 2){
			        	addPrinterRegisterGHPT();     // 补打挂号凭条
			        }
			        if(_type == 1){
			        	queryPrintDatas();       // 补打发票
			        }
        		}else{
        			console.log(ret.Msg);
        			$.layerPop({
						msg: '请输入您的身份证号码或候诊号',
						time: 6
					});
        		}
	        }, function(ret){
        		console.log(ret);
	        })
		}else if(CardNo != ''){
			CardInfo = {
	            "ZZJCertificate": { ID: ZZJINFO.ZZJInfomation.ZZJID },
	            "CardInfo":{
	                "CardNo": CardNo,                          
	                "CardType": 7     //0:医院的卡 1:区域卡 2:社保卡 5:身份证 7:门诊号
	            }
	        };
		    AJAX.Business.QueryPatientInfo( JSON.stringify(CardInfo), function(ret){
	            console.log(ret);
	        }, function(ret){
	            console.log(ret);
	            if(ret.Code == '0'){  
	                var PatientInfo = ret.PatientInfo;  
	                $.extend(CardInfo,{PatientInfo:PatientInfo});
	                console.log(CardInfo);
	                if(_type == 0){
	                	addPrinterRegisterCFPT(CardInfo);   // 补打处方缴费凭条
	                }
	                if(_type == 2){
	                	addPrinterRegisterGHPT(CardInfo);   // 补打挂号凭
	                }
	                if(_type == 1){
			        	queryPrintDatas();                  // 补打
			        }
	            }else{
	                console.log('查询用户信息失败');
	                $.layerPop({
						msg: '查询用户信息失败',
						time: 6
					});
	            } 
	        }, function(ret){
	            console.log(ret);
	        });
		}else{
			$.layerPop({
				msg: '请输入您的身份证号码或候诊号',
				time: 6
			});
		}
	});
};

// 补打挂号凭条
function addPrinterRegisterGHPT(){
	console.log(CardInfo);
	$.extend( CardInfo, {'UseTo':0} );              //  UseTo  == 0  挂号/  == 1 缴费
	AJAX.Business.PrintByCardNo( JSON.stringify(CardInfo), function(ret){
		console.log(ret);
	}, function(ret){
		console.log(ret);
		if(ret.Code == 0){
			console.log(ret.Msg);
			$.extend(CardInfo ,{ 'RegisterInfo' : ret.RegisterInfo[0]});
			PAYSTATUES = true;
			rechargeSucceedesGHPT(CardInfo);
		}else{
			$.layerPop({
				msg: ret.Msg,
				time: 6
			});
		}
	}, function(ret){
		console.log(ret);
		$.layerPop({
			msg: '网络异常，请稍后再试',
			time: 6
		});
	});
}

// 补打处方缴费凭条
function addPrinterRegisterCFPT(){
	console.log(CardInfo);
	// var nowTimes = '2018-08-22' + " " + startime.slice(0,6) + "00";
	// var endTimes = '2018-10-22' + " " + endtime.slice(0,6) + "00";
	var nowTimes = nowDate().slice(0,10) + " " + startime.slice(0,6) + "00";
	var endTimes = nowDate().slice(0,10) + " " + endtime.slice(0,6) + "00";
	$.extend( CardInfo, {'UseTo':1,"DateTimeSegmentBetween":{"StartTime":nowTimes,"EndTime":endTimes}} );      //  UseTo  == 0  挂号/  == 1 缴费
	AJAX.Business.PrintByCardNo( JSON.stringify(CardInfo), function(ret){
		console.log(ret);
	}, function(ret){
		console.log(ret);
		if(ret.Code == 0){
			console.log(ret.Msg);
			var successRegister = [];
			for( var i=0;i<ret.RecipesInfo.length;i++ ){
				if(ret.RecipesInfo[i].RecipesID != ""){
					successRegister.push(ret.RecipesInfo[i]);
				}
			}
			console.log(successRegister);
			$.extend(CardInfo ,{ 'successRegister' : successRegister});
			PAYSTATUES = true;
			rechargeSucceedPrintCHPT(CardInfo);
		}else{
			$.layerPop({
				msg: ret.Msg+',您暂无可打印的处方',
				time: 6
			});
		}
	}, function(ret){
		console.log(ret);
		$.layerPop({
			msg: '网络异常，请稍后再试',
			time: 6
		});
	});
}

var RegisterTakeInfo, InformationQueryInfo;
function queryPrintDatas(){
	var data = [];
	// AJAX.Business.SelectInvoiceInfo(JSON.stringify(CardInfo), function(ret){
	// 	console.log(ret);
	// }, function(ret){
	// 	console.log(ret);
	// 	if(ret.Code == 0){
	// 		var invoiceInfos = ret.InvoiceInfo;
	// 		for(var i=0;i<invoiceInfos.length;i++){
	// 			data[i] = {
	// 				"Date"    : invoiceInfos[i].InvoiceDate.slice(0,10),
	// 				"TotalAMT": invoiceInfos[i].TOTALAMT,
	// 				"invoiceprinted": invoiceInfos[i].Print_Basic.INVOICEPRINTED==0?"未打印":"已打印",
	// 				"Hospayid": invoiceInfos[i].Print_Basic.HOSPAYID,
	// 			}
	// 		}
	// 		console.log(data);
	// 		InformationQueryInfo = data;
 //    		RegisterTakeInfo = ret.InvoiceInfo;
 //    		addPrinterRegisterPublic();
	// 	}
	// }, function(ret){
	// 	console.log(ret);
	// });

	var nowTimes = nowDate().slice(0,10) + " " + startime.slice(0,6) + "00";
	var endTimes = nowDate().slice(0,10) + " " + endtime.slice(0,6) + "00";
	//  UseTo  == 0  挂号/  == 1 缴费
	$.extend( CardInfo, {'UseTo':1,"DateTimeSegmentBetween":{"StartTime":nowTimes,"EndTime":endTimes}} );      
	AJAX.Business.PrintByCardNo( JSON.stringify(CardInfo), function(ret){
		console.log(ret);
	}, function(ret){
		console.log(ret);
		if(ret.Code == 0){
			console.log(ret.Msg);
			var successRegister = [];
			for( var i=0;i<ret.RecipesInfo.length;i++ ){
				if(ret.RecipesInfo[i].RecipesID != ""){
					successRegister.push(ret.RecipesInfo[i]);
					data[i] = {
						"Date"    : ret.RecipesInfo[i].PayDate.slice(0,10),
						"TotalAMT": ret.RecipesInfo[i].Total,
						"invoiceprinted": ret.RecipesInfo[i].RecipesID,
						"Hospayid": ret.RecipesInfo[i].HISPayNo
					}
				}
			}
			InformationQueryInfo = data;
			console.log(successRegister);
			RegisterTakeInfo = successRegister;
			addPrinterRegisterPublic(CardInfo);
		}else{
			$.layerPop({
				msg: ret.Msg+',您暂无可打印的处方',
				time: 6
			});
		}
	}, function(ret){
		console.log(ret);
		$.layerPop({
			msg: '网络异常，请稍后再试',
			time: 6
		});
	});
	

}


function addPrinterRegisterPublic(){
	console.log(CardInfo);
	$(document.body).append(printerDetailTextFP);
	var ele = '#change-purse-next';
	PageBack(ele);
	$(ele + " #choiseInvoce").empty();

	// 循环查到的数据
	$.each(InformationQueryInfo, function(n, val){
		var item = `<li class="row-item" style="margin-top:20px;">
						<span style="width: 50px;height:45px;border:1px solid #ddd;line-height:45px">√</span>
						<span style="width:160px;height:45px;border:1px solid #ddd;line-height:45px">${val.Date}</span>
						<span style="width:100px;height:45px;border:1px solid #ddd;line-height:45px">${val.TotalAMT}</span>
						<span style="width:200px;height:45px;border:1px solid #ddd;line-height:45px">${val.Hospayid}</span>
						<span style="width:300px;height:45px;border:1px solid #ddd;line-height:45px">${val.invoiceprinted}</span>
					</li>`; 
		$(ele + " #choiseInvoce").append(item);
	})
	
	// 选择要打印的项目
	$(ele + " #choiseInvoce li").each(function(){
		$(this).on("click", function(){
			if( !$(this).hasClass('active') ){
				$(this).addClass("active").siblings().removeClass("active");
			}
		})
	})

	// 确认
	$(ele + ' .btn-affirm').on('click', function() {
		var hospayid = $(ele + " #choiseInvoce li.active span:eq(3)").text();
		console.log(hospayid);
		var printData = [];
		for(var i=0;i<RegisterTakeInfo.length;i++){
			if(hospayid == RegisterTakeInfo[i].HISPayNo){
				printData.push( RegisterTakeInfo[i] );
			}
		}
		$.extend(CardInfo ,{"successRegister": printData});
		PAYSTATUES = true;
		rechargeSucceedPrintCHPT(CardInfo);
	});
}


/*/ ***************************************************************** /*/

//  界面显示输入部分
var printerDetailText = `<div id="change-purse" class="animated fadeInUp">
		<div class="content text-center">
			<h2 class="title">输入身份证号或病历号</h2>
			<div class="wrap">
				<div class="row-item">
					<span class="name">身份证号：</span>
					<input type="text" class="value" placeholder="请输入您的身份证号码">
				</div>
				<div class="row-item">
					<span class="name">病历号号：</span>
					<input type="text" class="value" placeholder="请输入您的候诊号码">
				</div>
				<div class="row-item">
					<span class="name">起始时间：</span>
					<input type="text" class="value" placeholder="09:10:00" id="startime">
					<span>(时分秒)</span>
				</div>
				<div class="row-item">
					<span class="name">结束时间：</span>
					<input type="text" class="value" placeholder="09:30:00" id="endtime">
					<span>(时分秒)</span>
				</div>
			</div>
			<div class="btn-wrap">
				<div class="numbers">
					<ul class="clearfix"><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li><li>:</li><li remove="">删除</li></ul>
				</div>
				<div class="btn btn-affirm pull-left">确认</div>
				<div class="btn btn-clear">备用</div>
				<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>
			</div>
		</div>
	</div>`;


//  界面显示输入部分
var printerDetailTextOne = `<div id="change-purse" class="animated fadeInUp">
		<div class="content text-center">
			<h2 class="title">输入身份证号或病历号</h2>
			<div class="wrap">
				<div class="row-item">
					<span class="name">身份证号：</span>
					<input type="text" class="value" placeholder="请输入您的身份证号码">
				</div>
				<div class="row-item">
					<span class="name">病历号号：</span>
					<input type="text" class="value" placeholder="请输入您的候诊号码">
				</div>
			</div>
			<div class="btn-wrap">
				<div class="numbers">
					<ul class="clearfix"><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li><li>:</li><li remove="">删除</li></ul>
				</div>
				<div class="btn btn-affirm pull-left">确认</div>
				<div class="btn btn-clear">备用</div>
				<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>
			</div>
		</div>
	</div>`;

var printerDetailTextFP = `<div id="change-purse-next" class="animated fadeInUp">
		<div class="content text-center">
			<h2 class="title">选择要打印的发票</h2>
			<div class="wrap">
				<div class="row-item">
					<span style="width: 50px;height:45px;border:1px solid #ddd;line-height:45px">/</span>
					<span style="width:160px;height:45px;border:1px solid #ddd;line-height:45px">日期</span>
					<span style="width:100px;height:45px;border:1px solid #ddd;line-height:45px">金额</span>
					<span style="width:200px;height:45px;border:1px solid #ddd;line-height:45px">HIS交易流水</span>
					<span style="width:300px;height:45px;border:1px solid #ddd;line-height:45px">处方序号</span>
				</div>
				<ul class="list-group-wrap" id="choiseInvoce">
				</ul>
			</div>
			<div class="btn-wrap">
				<div class="btn btn-affirm pull-left">确认</div>
				<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>
			</div>
		</div>
	</div>`;

/*/ ***************************************************************** /*/
if (ISBG == true) {
	_PR_ = 0;
} else  {
	_PR_ = 20;
}

// 挂号成功后补打打印凭条
function rechargeSucceedesGHPT(card) {
	console.log(card);
	if (!PAYSTATUES){ //解决网络延时问题
		return;
	}
	PAYSTATUES = false;
	var barcode = document.createElement('img');
    var options = {
        width: 2,              //较细处条形码的宽度
        height: 80,            //条形码的宽度，无高度直接设置项，由位数决定，可以通过CSS去调整，见下
        quite: 10, 
        format: 'CODE128',
        displayValue: false,   //是否在条形码下方显示文字
        font: 'monospace', 
        textAlign: 'center', 
        fontSize: 12,
        backgroundColor:"", 
        lineColor: '#000'      //条形码颜色
    };
    JsBarcode(barcode, card.CardInfo.CardNo , options);     //原生
    // $('#barcode1').JsBarcode(str, options); //jQuery
    var randomNumber = Math.random().toString().substr(2,10);      // 随机数
    var base64 = $(barcode).attr('src');
    console.log(base64)
    base64 = base64.split(';')[1];
    base64 = base64.split(',')[1];
	console.log(base64);
	FileSystem.WriteImageFileFromBase64('D:/barcodes/base'+randomNumber+'.png', base64);

	var age = countAges(CardInfo);
	ZZJPrinter.Print(PTJPRINTNAME, 300, 420, false, function(Code, ID){
		console.log(Code,ID);
		if (Code == 0) { // 打印机正常
			ZZJPrinter.PrintFilePicture(ID, 'D:/barcodes/base'+randomNumber+'.png', 70+_PR_, 0, 180, 50);
			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 50+_PR_, 65, '顺德区妇幼保健院');
			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 8, 0, 160+_PR_, 95, '门诊挂号券(补打)');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 20+_PR_, 105, '-------------------------------');

	        // 打印数据
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 130, '候诊号: ' + CheckIsUndefined( card.RegisterInfo.WaitNo )+'号' );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 155, '诊疗号: ' + CheckIsUndefined( card.CardInfo.CardNo ) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 180, '姓  名: ' + CheckIsUndefined( card.PatientInfo.PatientName ) + ' 性别：'+ (CheckIsUndefined(card.PatientInfo.Gender)=='1'?'男':'女')+' 年龄：'+age+'岁' );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 205, '金 额: ￥' + CheckIsUndefined( card.RegisterInfo.Total ) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 230, '费用类型: '+ CheckIsUndefined( card.RegisterInfo.PatType ) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 255, '就诊医生: '+ CheckIsUndefined( card.RegisterInfo.Doct.DoctName ) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 280, '就诊科室: '+ CheckIsUndefined( card.RegisterInfo.Dept.DeptName ) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 305, '就诊地址: '+ CheckIsUndefined( card.RegisterInfo.Address ) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  8, 0, 20+_PR_, 330, '就诊时间: '+ CheckIsUndefined( card.RegisterInfo.SeeTime ) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  8, 0, 20+_PR_, 345, '预计就诊时间: 请合理安排就诊时间' );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  8, 0, 20+_PR_, 360, '终端编号: '+ CheckIsUndefined( ZZJINFO.ZZJInfomation.Name) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  8, 0, 20+_PR_, 375, '打印时间:' + CheckIsUndefined( nowDate() ) );

	        ZZJPrinter.StartPrint(ID);
	        PrintPTHintLamp();               // 打印凭条提示灯
	        console.log('打印完成');
	        CardInfo = {};                   // 清空患者信息
	   	} else {                             // 打印机异常
	       	ThisWindow.Speak(ID);
			LogHelper.WriteLog(ID);
	        $.layerPop({
	        	msg: ID,
	        	time: 10,
	        	btn: ['确定'],
	        	endExecute: true,
	        	yes: function(){
	        		console.log('挂号凭条补打失败')
	        	}
	        });
	    }
	});
}

// // 处方缴费后打印凭条
function rechargeSucceedPrintCHPT(card) {
	console.log(card);
	if (!PAYSTATUES){ //解决网络延时问题
		return;
	}
	PAYSTATUES = false;
	var barcode = document.createElement('img');
    var options = {
        width: 2,              //较细处条形码的宽度
        height: 80,            //条形码的宽度，无高度直接设置项，由位数决定，可以通过CSS去调整，见下
        quite: 10, 
        format: 'CODE128',
        displayValue: false,   //是否在条形码下方显示文字
        font: 'monospace', 
        textAlign: 'center', 
        fontSize: 12,
        backgroundColor:"", 
        lineColor: '#000'      //条形码颜色
    };
    JsBarcode(barcode, card.CardInfo.CardNo , options);            //原生
    // $('#barcode1').JsBarcode(str, options); //jQuery
    var randomNumber = Math.random().toString().substr(2,10);      // 随机数
    var base64 = $(barcode).attr('src');
    console.log(base64)
    base64 = base64.split(';')[1];
    base64 = base64.split(',')[1];
	console.log(base64);
	FileSystem.WriteImageFileFromBase64('D:/barcodes/base'+randomNumber+'.png', base64);

	var age = countAges(CardInfo);
	var tot=0,shebao=0,pay=0;
	var chufangxuhao='';
	var fapiao='';
	var beizhu='';
	var len = card.successRegister.length;
	var payTime ="";
	for(var i=0;i<len;i++){
		tot += Number(card.successRegister[i].Total);             // 总计 
		shebao += Number(card.successRegister[i].SocietyAmt);     // 社保优惠
		pay += Number(card.successRegister[i].SelfAmt);           // 自费
		chufangxuhao += card.successRegister[i].RecipesID+',';    // 处方序号
		fapiao += card.successRegister[i].InvoiceNo+',';          // 发票号
		beizhu += card.successRegister[i].Address;                // 备注地址
		payTime += card.successRegister[i].PayDate+","
	}
	var h = 25;
	var s = 15;
	var fapiaos = fapiao.split(',');
	var chufangxuhaos = chufangxuhao.split(',');
	var newbzarr = beizhu.split('\r\n');
	var newbeizhu = newbzarr.distinct();

	var nowtims = nowDate().slice(0,4)+nowDate().slice(5,7)+nowDate().slice(8,10)+'-'+nowDate().slice(11,13)+nowDate().slice(14,16)+nowDate().slice(17,19);
	var SerialNumber = ZZJINFO.ZZJInfomation.Name +'-'+ nowtims.slice(0,10)+randomNumber;
	
	ZZJPrinter.Print(PTJPRINTNAME, 300, 450+h*fapiaos.length+h*chufangxuhaos.length+s*newbeizhu.length, false, function(Code, ID){
		if (Code == 0) { // 打印机正常
			ZZJPrinter.PrintFilePicture(ID, 'D:/barcodes/base'+randomNumber+'.png', 40+_PR_, 0, 180, 50);

			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 30+_PR_, 65, '顺德区妇幼保健院');
			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 8, 0, 115+_PR_, 100, '门诊收费券(补打)请妥善保管');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0,   0+_PR_, 105, '-------------------------------');

	        // 打印数据
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 130, '自助机流水号: ');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, 0+_PR_, 155, ''+SerialNumber);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 180, '终端号: ' + ZZJINFO.ZZJInfomation.Name);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 205, '就诊号: ' + card.CardInfo.CardNo);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 230, '姓  名: '+ card.PatientInfo.PatientName+ ' 性别：'+ (card.PatientInfo.Gender=='1'?'男':'女')+' 年龄：'+age);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 255, '总金额:￥' +tot.toFixed(2) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 280, '社保支付:￥ '+shebao.toFixed(2) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 305, '交易金额: ￥' +pay.toFixed(2) );

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 330, '处方号: ');
	        for(var k=0;k<chufangxuhaos.length;k++){
	        	(function(k){
					ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 35+_PR_, 355+h*k, chufangxuhaos[k]);
				})(k)
	        };
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 330+h*chufangxuhaos.length, '发票号: ');	        
	        for(var j=0;j<fapiaos.length;j++){
	        	(function(j){
					ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 35+_PR_, 355+h*j+h*chufangxuhaos.length, fapiaos[j]);
				})(j)
	        };
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 0+_PR_, 330+h*fapiaos.length+h*chufangxuhaos.length, '备注:' );
	        for(var l=0;l<newbeizhu.length;l++){
	        	(function(l){
	        		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 0+_PR_, 350+h*chufangxuhaos.length+h*fapiaos.length+s*l, newbeizhu[l]);
	        	})(l)
			}
			ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 0+_PR_, 335+h*fapiaos.length+s*newbeizhu.length+h*chufangxuhaos.length, '交易时间：'+ payTime);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 0+_PR_, 350+h*fapiaos.length+s*newbeizhu.length+h*chufangxuhaos.length, '温馨提示：请妥善保管您的收费凭条' );

	        ZZJPrinter.StartPrint(ID);
	        PrintPTHintLamp();               // 打印凭条提示灯
	        CardInfo = {};                   // 清空患者信息 
	   	} else {                             // 打印机异常
	       	ThisWindow.Speak(ID);
			LogHelper.WriteLog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 10,
	        	btn: ['确定'],
	        	endExecute: true,
	        	yes: function(){
	        		console.log('缴费凭条补打失败')
	        	}
	        });
	    }
	});
}

// 根据身份证号 患者信息上的身份证号计算年龄
function countAges(cardinfo){
    var cardid = cardinfo.PatientInfo.IDNo.slice(6,10);
    var nowdate = nowDate().slice(0,4);
    console.log(nowdate);
    if(cardid == '' || cardid == undefined || cardid == 0){
        cardid = Number(cardinfo.PatientInfo.Birthday.slice(0,4));
    }
    console.log(cardid);
    var age = nowdate - cardid;      // 岁数
    if(age < 0){
        age = 0;      
    }
    return age;
}
// 当前时间
function nowDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var days = date.getDate();
    days = days < 10 ? '0' + days : days;
    return year+'-'+month+'-'+days+' '+date.toTimeString().substring(0, 8);
}

function amounthago(){
	var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    month = month < 10 ? '0' + month : month;
    var days = date.getDate();
    days = days < 10 ? '0' + days : days;
    return year+'-'+month+'-'+days+' '+date.toTimeString().substring(0, 8);
}

// 凭条灯提示开启
function PrintPTHintLamp() {
	var PTJTSD = 3;
	if(ISBG == true){ PTJTSD = 5};
	AcsSwitch.SetAcs('B', PTJTSD, 1); // 凭条提示开启
	var PRINTTIMER;
	clearInterval(PRINTTIMER);
	PRINTTIMER = setTimeout(function() {
		AcsSwitch.SetAcs('B', PTJTSD, 0);         // 凭条提示灯关闭
	}, 3000);
}
// 判断值是否存在，否则返回空字符串
function CheckIsUndefined(_val){
	if (_val == undefined) {
		return '';
	} else {
		return _val;
	}
}

// 数组去重
Array.prototype.distinct = function (){
	var a = {}, c = [], len = this.length;
	for(let i=0;i<len;i++){
		var b = this[i];
		var d = (typeof b) + b;
		if(a[d] === undefined){
			c.push(b);
			a[d] = 1;
		}
	}
	return c;
}

























