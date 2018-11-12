;
// var Printdatas = {
// 	"CardInfo":{ "CardNo" :"0098030479","CardType":7},
// 	"PatientInfo":{
// 		"AccountID":"",
// 		"Address":"居民一组",
// 		"Balance":null,
// 		"Birthday":"2006-02-27",
// 		"Gender":1,
// 		"IDNo":"421024199902273112",
// 		"IDType":0,
// 		"Mobile":"13827804930",
// 		"Nation":"",
// 		"PatientID":"0003531452",
// 		"PatientName":"冉",
// 		"PatientType":0,
// 		"Profession":"",
// 	},
// 	"ZZJCertificate":{"ID":2},
// 	"RecipesInfo":{"RecipesID":"","RegisterInfo":{"RegSerialNumber":"5506304","Dept":{"DeptCode":"8247","DeptName":"门诊妇科","DeptIntroduce":"","DoctCount":null,"Disable":false,"Address":"","Register":false},"Doct":{"ScheduleID":"","DoctCode":"009999","DoctName":"任立群","DoctSex":-1,"DoctIntroduce":"","LevelName":"","LevelCode":"","InfinetReg":false,"RegNum":null,"Noon":-1,"PriceList":[],"Address":"","SurplusReg":null,"SeeTimeBetween":{"StartTime":null,"EndTime":null}},"Total":null,"SelfAmt":null,"SocietyAmt":0,"SeeTime":null,"LockID":null,"Address":null,"RegID":null,"WaitNo":"","WaitCount":"","PatType":""},"Details":[{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"专家门诊诊查费(主任医师)","Code":"110200002-2","Price":25,"Count":1,"Total":25,"Selfamt":"25","Unit":"次","Spec":""},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"},{"Name":"维生素B6片","Code":"Y00000027258","Price":0.07,"Count":23,"Total":1.61,"Selfamt":"1.61","Unit":"粒","Spec":"10mg*1000粒/瓶"}],"Total":26.61,"SelfAmt":"26.61","SocietyAmt":"0","HISPayNo":"000001184565","RecipeType":"","Address":"","PayTypeName":"普通患者（自费）","InvoiceNo":"","PayDate":"2018-09-21 11:52:52","InvoicePrinted":"1"}
// };



// 打印报告
function PrintReport() {
	IsChildPage(true);
	var images = 'assets/images/card/input-IDCard.gif';
	if(ISBG == true){
		images = 'assets/images/card/denglu.gif';
	}
	$.BrushIntoIdentity({   //登录
	    s: 60,
	    imgStyle: {
	        width: '600px',
	    },
	    title : '<p>请在图中机器对应的位置</p><p>放入身份证或扫描病历条码</p>',
	    imgSrc: images,
	    titleStyle:{
	    	fontWeight:'bold'
	    },
	    btnName: '手输病历号',
	    hasConfirm:true,
	    timeBack: function() {
	        console.log('倒计时结束');
	        QRScan.Close2();
	        CloseIdentityReader();
	        ShowMainMenu();
		},
	    btnBack: function($ele) {
	        console.log($ele);
	        console.log("手输病历号登录");
        	inputHpuZhenNo();
	    },
	    homeBack: function($ele) {
	        console.log($ele);
	        QRScan.Close2();
	        CloseIdentityReader();
	        ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log('上一页');
	        QRScan.Close2();
	        CloseIdentityReader();
	        ShowMainMenu();       //上一页
	    },
	    exitBack: function($ele) {
	        console.log($ele);
	        QRScan.Close2();
	        CloseIdentityReader();
	        $.ExitCard();             //退卡
	    },
	    callBack: function($ele) {
	        console.log($ele);
			pageType = 'DYYW';
	        userInfoToCard();     // 同时开启身份证和扫凭条
	    }
	});	
}

// 登录后展示  查看挂号信息
function judgingLoginPrinter(){
	console.log(ZZJCertificate);
	console.log(ZZJInfomation);
	if( JSON.stringify(CreateCardInfo) != '{}'){
		CardInfo = CreateCardInfo;
	}
	console.log(CardInfo);
	IsChildPage(false);
	$(PAGE).html(PrintReportText);
	var ele = '#printReport';
	$.ExecuteAnimate(ele, 0);
	//倒计时   // 定时返回
    $.BackInterval(45);

    $('.user-info').find('li:eq(0)').html('姓名：'+CardInfo.PatientInfo.PatientName);
    $('.user-info').find('li:eq(1)').html('卡号：'+CardInfo.CardInfo.CardNo);
    $('.user-info').find('li:eq(2)').html('年龄：'+ countAges(CardInfo) );

    var peizhiID = ZZJInfomation.ModuleConfig.ID;
    console.log(ZZJInfomation.ModuleConfig.Name);

    var str='';
    if(peizhiID == 2){                 // 病历本 - 病历号
    	str = `<div class="printdz item" data-type="DYBLB"><div class="icon"></div></div>
    		   <div class="printhzh item" data-type="DYBLH"><div class="icon"></div></div>`;
    }
    if(peizhiID == 3){                 // 发票
    	str = `<div class="printfp item" data-type="DYPF"><div class="icon"></div></div>`;
    }
    if(peizhiID == 4){                 // 化验单 - 清单打印
    	str = `<div class="printhyd item" data-type="DYHYD"><div class="icon"></div></div>
    		   <div class="printhydqd item" data-type="DYHYDQD"><div class="icon"></div></div>`;
    }
    $(ele).find('.menu-list').append(str);

    // 点击发票打印
	$('.printfp.item').click(function(){
		console.log('发票打印');
		console.log(CardInfo);
		
		$.Writelog('发票打印查询');
		var data = [];
		AJAX.Business.SelectInvoiceInfo(JSON.stringify(CardInfo), function(ret){
			console.log(ret);
		}, function(ret){
			console.log(ret);
			if(ret.Code == 0){
				var invoiceInfos = ret.InvoiceInfo;
				for(var i=0;i<invoiceInfos.length;i++){
					data[i] = {
						Date    : invoiceInfos[i].InvoiceDate.slice(0,10),
						TotalAMT: invoiceInfos[i].TOTALAMT,
						invoiceprinted: invoiceInfos[i].Print_Basic.INVOICEPRINTED==0?"未打印":"已打印",
						Hospayid: invoiceInfos[i].Print_Basic.HOSPAYID,
					}
				}
				console.log(data);
	    		InformationQueryInfo = data;
	    		RegisterTakeInfo = ret.InvoiceInfo;
				printInvoiceListPagination();
			}
		}, function(ret){
			console.log(ret);
		});
		
	});

	// 病历本打印
	$('.printdz.item').click(function(){
		$.ajax({
			url:'/api/Business/GetGetBlbPrice',
			data:JSON.stringify({}),
			type:'post',
			success:function(ret){
				var ret = JSON.parse(ret);
				$.Writelog('病历本价格查询'+ret.Msg)
				if(ret.Code == 0){
					var price = Number(ret.Amount);
					console.log(price);
					$.extend(CardInfo,{"Amount":price});
					printMedicalRecordBook();
				}else{
					console.log('查询价格失败');
					$.layer({
					    msg: '查询病历本价格失败，请稍后再试',      // msg 提示信息
					    btn: ['确认'],           // btn 按钮 - 数组 （最多两个）
					    type: 1,                 // type 类型 [0, 1]
					    time: 6,                 // time 倒计时时间
					    bulb: false,             // bulb 小灯泡是否显示
					    title: '温馨提示',       // title 提示名称  
					});
				}
			},error:function(ret){
				$.Writelog('网络异常，病历本价格查询失败')
			}
		});
	});

	// 病历号打印
	$('.printhzh.item').click(function(){
		console.log('打印病历号');
		console.log( CardInfo );
		$.layer({
			msg: '是否确认打印病历号？',         // msg 提示信息
		    btn: ['确认'],           // btn 按钮 - 数组 （最多两个）
		    type: 1,                 // type 类型 [0, 1]
		    time: 6,                 // time 倒计时时间
		    bulb: false,             // bulb 小灯泡是否显示
		    title: '温馨提示',       // title 提示名称 
		    endExecute: true,
		    yes:function(){
		    	PAYSTATUES = true;
		    	blbpingtiao(CardInfo);               // 打印可贴条码
		    }
		})
	});

	// 化验单打印
	$('.printhyd.item').click(function(){
		var today = nowDate().slice(0,10);
		var arrToday = today.split('-');
		var onemonthage;
		if(arrToday[1] - 1 > 0 && arrToday[1] - 1 < 10){
			onemonthage = arrToday[0] +'-0'+ (arrToday[1]-1) +'-'+ arrToday[2];
		}else if(arrToday[1] - 1 >= 10){
			onemonthage = arrToday[0] +'-'+ (arrToday[1]-1) +'-'+ arrToday[2];
		}else{
			onemonthage = (arrToday[0]-1) +'-'+ 12 +'-'+ arrToday[2];
		}
		$.Console(onemonthage);
		MachineLis.PrintLis( CardInfo.CardInfo.CardNo, onemonthage );
		
	})

	// 处方消费清单打印
	$('.printhydqd.item').click(function(){
		console.log('处方消费清单打印');
		console.log(CardInfo);
		$.Writelog('处方消费清单打印查询');
		
		$.loading(false,'正在查询请稍后');
		AJAX.Business.GetClinPayList(JSON.stringify(CardInfo), function(ret){
			$.layerClose();
			console.log(ret);
		}, function(ret){
			$.layerClose();
			var result = ret;
    		console.log(result);
            var data = []; 
            if(result.Code == '0'){
				if(result.RecipesInfo.length > 0){
					var RecipesInfo = result.RecipesInfo;
					var userinfo = {
						"CardInfo"        : CardInfo.CardInfo,
						"PatientInfo"     : CardInfo.PatientInfo,
						"ZZJCertificate"  : { ID: ZZJInfomation.ZZJID },
						"RecipesInfo"     : result.RecipesInfo
					}
			        console.log( userinfo );
			        $.Writelog('查询处方消费清单打印次数');
			        AJAX.Business.SelectPrintlog( JSON.stringify(userinfo), function(ret){     // 查询打印次数
			        	console.log(ret)
			        },function(ret){
			        	console.log(ret);
			        	if(ret.Code == 0){
			        		for(var i=0;i<ret.RecipesInfo.length;i++){
				    			data[i] = {
				    				Date    : ret.RecipesInfo[i].PayDate.slice(0,10),                   // 日期
				    				DeptName: ret.RecipesInfo[i].PayTypeName,                           // 支付类型名称
				    				DocName : ret.RecipesInfo[i].InvoicePrinted=="0"?'未打印':'已打印', // 是否打印
				    				Cost    : ret.RecipesInfo[i].Total,                                 // 总金额
				    				DoctCode: ret.RecipesInfo[i].RegisterInfo.Doct.DoctCode,            // 医生代码 
				    				RecipesID:ret.RecipesInfo[i].RecipesID,                             // 处方序号
				    				HISPayNo: ret.RecipesInfo[i].HISPayNo,                              // 发票号
				    			}
				    		}
				    		console.log(data);
				    		InformationQueryInfo = data;
				    		RegisterTakeInfo = ret.RecipesInfo;
				    		console.log(RegisterTakeInfo);
				    		listOfPaymentDetialPrint();
			        	}else{
			        		$.layer({
				        		msg:'查询打印次数失败',
				        		btn:['确认'],
				        		type: 1,
				        		time: 6,
				        		yes:function(){
				        			console.log('查询打印次数失败');
				        			$.Writelog('查询打印次数失败');
				        		}
				        	})
			        	}
			        }, function(ret){
			        	$.layer({
			        		msg:'网络异常，查询项目打印次数失败',
			        		btn:['确认'],
			        		type: 1,
			        		time: 6,
			        		yes:function(){
			        			console.log('网络异常，查询项目打印次数失败');
			        			$.Writelog('网络异常，查询项目打印次数失败');
			        		}
			        	})
			        });
		    	}else{
		    		console.log(result.Msg);
	    			noMustPayInfo();
		    	}
	    	}else{
	    		console.log('暂无已缴费的处方信息');
	    		failSearchPayInfo(result.Msg);
	    	}
		}, function(ret){
			$.layerClose();
			contentError();
		});
	});

	/* 退卡并返回主界面 - 循环查卡 */
	 $(ele + ' .printNav').click(function(){
	 	$.ExitCardAndBackMainPage();
	 });
	// 返回上一级
	$.BackPrevPage(ele, ShowMainMenu);
	// 首页
	$.BackIndexPage(ele);   
}

// 打印病历  弹窗其实购买病历本
function printMedicalRecordBook(ret,flag){
	var msg = "<p>购买病历本需要支付￥"+CardInfo.Amount+"元。</p><p>若您就诊<span style='color:#f00 !important'>生殖科</span>请前往人工窗口购买病历本，谢谢合作</p>";
	if(ZZJInfomation.ZZJID == 1){
		msg = "<p>购买病历本需要支付￥"+CardInfo.Amount+"元。</p><p>请确认是否购买</p>";
		unsupportedClick();
	}else{
		$.layer({
		    msg: msg,     
		    btn: ['确认'],           // btn 按钮 - 数组 （最多两个）
		    type: 1,                 // type 类型 [0, 1]
		    time: 10,                // time 倒计时时间
		    bulb: false,             // bulb 小灯泡是否显示
		    title: '温馨提示',       // title 提示名称
		    endExecute: false,       // endExecute 定时时间结束后是否执行确认函数 默认 true
		    yes: function() {        // yes 确认按钮回调     
		        blbbuyandquery()
		    }
		});
	}
}

// 查询病历本数量 是否为0
// console.log( MachineGMBL );
// console.log( MachineGMBL.GetStatusDYJ("STT420") );
function blbbuyandquery(){
    var user = CardInfo;
    console.log('购买病历本');
    // COM口 病历本打印机名称   
    MachineGMBL.OpenDYJ("STT420").then(function(value){                  // 打开病历本打印机
        var opens = JSON.parse(value);
        console.log(opens);
        if(opens.Code == 0){
            console.log("病历本打印机打开成功");
            MachineGMBL.GetStatusDYJ("STT420").then(function(value){     // 判断还有没有病历本
                var status = JSON.parse(value);
                console.log(status);
                if(status.Code == 0){
                    console.log("病历本数量大于0");
                    $.Writelog('病历本数量大于0');
                    if(CardInfo.CardInfo.CardNo == "0098030479"){
                    	blbbuyandprint();
                    }else{
                    	printChoisePaymethods();
                    }
                }else{
                	$.Writelog('购买病历本'+ status.msg)
                    $.layer({
                        msg: status.msg, 
                        btn: ['确认'],
                        type: 1,     
                        time: 15,
                        bulbSrc: 'assets/images/tip/bulb.png',
                        yes: function(){
                            console.log( status );
                            MachineGMBL.CloseDYJ("STT420");
                            judgingLoginPrinter();
                        }
                    })
                }
            },function(error){
                console.log('查询病历本数量失败');
                $.layer({
                    msg: '网络异常，查询病历本数量失败', 
                    btn: ['返回首页'],
                    type: 1,     
                    time: 6,
                    bulbSrc: 'assets/images/tip/bulb.png',
                    yes: function(){
                        console.log( status );
                        MachineGMBL.CloseDYJ("STT420");
                        ShowMainMenu();
                    }
                })
            });
        }else{
        	$.layer({
	            msg: opens.msg, 
	            btn: ['确认'],
	            type: 1,     
	            time: 6,
	            bulbSrc: 'assets/images/tip/bulb.png',
	            yes: function(){
	                console.log( status );
	                MachineGMBL.CloseDYJ("STT420");
	                judgingLoginPrinter();
	            }
	        })
        }
    },function(error){
        console.log('病历本打印机打开失败');
        $.layer({
            msg: '病历本打印机打开失败,请联系服务人员检查打印机', 
            btn: ['返回首页'],
            type: 1,     
            time: 6,
            bulbSrc: 'assets/images/tip/bulb.png',
            yes: function(){
                console.log( status );
                MachineGMBL.CloseDYJ("STT420");
                ShowMainMenu();
            }
        })
    })
};

// 选择支付方式
function printChoisePaymethods(){
	console.log(CardInfo);
	IsChildPage(true);
	var BackPrevPage = judgingLoginPrinter;
	$.HandleCondition({
	    s: 60,
	    type: 1,
	    title: '请选择支付方式',
	    btns:['银行卡付款','支付宝付款','微信付款','社保卡付款'],
	    message: '病历本：￥ '+CardInfo.Amount+'/本',
	    topImgSrc:'assets/images/tip/failure.png',
	    btnWrapStyle:{marginLeft:'200px',marginRight:'200px'},
	    wrapStyle:{paddingTop:'60px'},
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:true,
	    yes: function($ele) {
        	console.log($ele);
        	pageType = 'DYYW';
        	paymethods = 'bank';
    		if(isopenBankPay == true){           // 是否开启银联
				bankCardPayPrintreport();        // 银行卡
    		}else{
    			unsupportedClick();
    		}	
	    },
	    btn2: function($ele) {
	        console.log($ele);
	        pageType = 'DYYW';
	        paymethods = 'zhifuPay';
	        if(isopenWXZFBPay == true){           // 是否开启微信支付宝
	        	WeiXinPayPrintreport();           // 支付宝
	        }else{
	        	unsupportedClick();
	        }
	    },
	    btn3: function($ele) {
	        console.log($ele);
	        pageType = 'DYYW';
	        paymethods = 'weiChat';
	        if(isopenWXZFBPay == true){          // 是否开启微信支付宝
	        	WeiXinPayPrintreport();          // 微信
	        }else{
	        	unsupportedClick();
	        }
	    },
	    btn4: function($ele) {
	        console.log($ele);
	        pageType = 'DYYW';
	        paymethods = 'social';
	        if(isopenSocialPay == true){        // 是否开启社保
        		socialPayPrintreport();         // 调用社保
	        }else{
	        	unsupportedClick();
	        }
	    },
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	    },
	    callBack: function($ele, $msg) {
	    	$.layerClose();
	    	if(paymethods == "social" || paymethods == "bank"){
	    		AcsSwitch.SetAcs('C', 1, 0);        // 密码键盘灯
		        if(ISBG == true){
		            AcsSwitch.SetAcs('B', 4, 0);                
		        }else{
		            AcsSwitch.SetAcs('B', 2, 0);                
		        }; 
	    	}
	        $.Writelog('病历号：'+CardInfo.CardInfo.CardNo);
	    	$.Writelog('支付金额：'+CardInfo.Amount);
	    	if(isopenWXZFBPay != true){
	    		$ele.find('div.btn-wrap.text-center div:eq(1)').addClass('disabled-true');
	    		$ele.find('div.btn-wrap.text-center div:eq(2)').addClass('disabled-true');
	    	}
	    	if(isopenSocialPay != true){
    			$ele.find('div.btn-wrap.text-center div:eq(3)').addClass('disabled-true');
	    	}
	    	if(isopenBankPay != true){
    			$ele.find('div.btn-wrap.text-center div:eq(0)').addClass('disabled-true');
	    	}
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        MachineGMBL.CloseDYJ("STT420");
	        ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        MachineGMBL.CloseDYJ("STT420");
	        $.ExitCard();
	    },
	});
};

// 微信 + 支付宝
function WeiXinPayPrintreport(){
	var imgs = '';
	var titles = '';
	var payMethod = 0;
    if(paymethods == 'weiChat'){   // 微信下单  
    	payMethod = 3;
    	imgs = 'assets/images/bg/sweep-weix.png';
    	titles = '请使用微信扫描二维码缴费';
    }
   	if(paymethods == 'zhifuPay'){  // 支付宝下单  
   		payMethod = 4;
   		imgs = 'assets/images/bg/sweep-ali.png';
   		titles = '请使用支付宝扫描二维码缴费';
   	}
	console.log(CardInfo);
	IsChildPage(true);
	var BackPrevPage = printChoisePaymethods;
	$.ScanCode({
	    s: 130,
	    title: titles,
	    titleStyle:{fontWeight:'bold'},
	    bgSrc: imgs,
	    hasHome: true,
	    hasPrev: true,
	    hasExit: true,
	    timeBack: function() {
	        console.log('倒计时结束');
	        $.Writelog("倒计时结束");
	        MachineGMBL.CloseDYJ("STT420");
	        console.log(RechargeAndPaymentInfo); 
	        clearInterval(ReservationNumberTimer);
	      	ClosetheOrder(BackPrevPage);  // 关闭订单
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        $.Writelog("返回首页");
	        MachineGMBL.CloseDYJ("STT420");
	        console.log(RechargeAndPaymentInfo); 
	        $.layer({
	        	msg: '请您确认是否放弃当前支付？',        
			    btn: ['确定'],                    
			    type: 1,                           
			    time: 10,                          
			    bulb: false,                       
			    title: '确认',                     
			    bulbSrc: 'assets/images/tip/bulb.png',     
			    endExecute: false,                          
			    yes: function() { 
			    	$.Writelog('确认放弃当前支付'); 
			    	clearInterval(ReservationNumberTimer);
	      			ClosetheOrder(ShowMainMenu);  // 关闭订单 
			    }
	        })
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        $.Writelog("点击了上一页");
	        console.log(RechargeAndPaymentInfo); 
	        $.layer({
	        	msg: '请您确认是否放弃当前支付？',        
			    btn: ['确定'],                    
			    type: 1,                           
			    time: 10,                          
			    bulb: false,                       
			    title: '确认',                     
			    bulbSrc: 'assets/images/tip/bulb.png',     
			    endExecute: false,                          
			    yes: function() { 
			    	$.Writelog('确认放弃当前支付'); 
			    	clearInterval(ReservationNumberTimer);
	      			ClosetheOrder(BackPrevPage);    // 关闭订单
			    }
	        })
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.Writelog("点击了退出");
	        MachineGMBL.CloseDYJ("STT420");
	        console.log(RechargeAndPaymentInfo); 
	        $.layer({
	        	msg: '请您确认是否放弃当前支付？',        
			    btn: ['确定'],                    
			    type: 1,                           
			    time: 10,                          
			    bulb: false,                       
			    title: '确认',                     
			    bulbSrc: 'assets/images/tip/bulb.png',     
			    endExecute: false,                          
			    yes: function() { 
			    	$.Writelog('确认放弃当前支付'); 
			    	clearInterval(ReservationNumberTimer);
	      			ClosetheOrder($.ExitCard);     // 关闭订单
			    }
	        })
	    },
	    callBack: function($ele, $img) {
	        console.log($ele,$img, '渲染后回调');
	        PAYSTATUES = true;                                           // 支付状态判断
	        var registerprice = Number(CardInfo.Amount);                 // 病历本费用
	        console.log(registerprice);
	        var randomNumber = Math.random().toString().substr(2,8);     // 随机数
	        RechargeAndPaymentInfo = {
		        "ZZJCertificate": { "ID": ZZJInfomation.ZZJID },
		        "PayInfo":{
		            "PayMetHod": payMethod,                              //支付方式 
		            "Amount"   : registerprice,                          //支付金额
		            "AccountID": CardInfo.CardInfo.CardNo,
		            'ExParams'  : null,
		            'ID'        : null,
		            'PayUrl'    : '',
		            'TranNo'    : ''
		        },
		        "SerialNumber": $.GetSerial() + randomNumber,          
		    };
		    console.log('下单参数', RechargeAndPaymentInfo );

		    $.extend(CardInfo,RechargeAndPaymentInfo);
		    console.log("Pay接口参数", CardInfo);
		    AJAX.Business.Pay( JSON.stringify(CardInfo),function(ret){
		    	console.log(ret)
		    } ,function(value){
		    	console.log(value);
		    	if(value.Code == 0){
		    		var PayID = value.PayID;
		    		$.Writelog('成功获取PayID:'+PayID);
		    		$.extend(CardInfo,{"PayID": PayID});
					$.extend(RechargeAndPaymentInfo.PayInfo,{ID:PayID});
					$.extend(RechargeAndPaymentInfo,{"PayID": PayID});

				    $.loading(false,'加载中...');
				    AJAX.Business.TakeQR( JSON.stringify(RechargeAndPaymentInfo), function(ret){
				    	$.layerClose();
				    	console.log(ret);
				    }, function(ret){
				    	$.layerClose();
				    	if(ret.Code == '0'){
		        			var payInfo = ret.PayInfo;
		        			if(paymethods == 'weiChat'){   // 微信
		        				console.log('微信TranNo:'+payInfo.TranNo);
					        	$.Writelog('微信TranNo:'+payInfo.TranNo);
					        };
					       	if(paymethods == 'zhifuPay'){  // 支付宝
					       		console.log('支付宝TranNo:'+payInfo.TranNo);
					       		$.Writelog('支付宝TranNo:'+payInfo.TranNo);
					       	};
		        			var strs = payInfo.PayUrl;
		        			var ele = $img.parent('.qr-code');
		        			createCodeEWM(ele,strs);                              // 创建二维码
		        			//将商品编号加入 RechargeAndPaymentInfo
		        			$.extend(RechargeAndPaymentInfo,{"PayInfo":payInfo});
		        			QueryWeixinOrderPrintReport();                        // 循环查单
		        		}else{
		        			console.log('下单失败,请重试');
		        			$.Speak('下单失败请重试');
		        			$.Writelog('微信下单失败请重试');
		        			$.layer({
		                        msg: ret.Msg, 
		                        btn: ['确定'],
		                        type: 1,     
		                        time: 6,
		                        bulbSrc: 'assets/images/tip/bulb.png',
		                        yes:function(){
		                        	console.log(RechargeAndPaymentInfo);
		               				printChoisePaymethods();
		                        }
		                    });
		        		}
				    }, function(ret){
				    	$.layerClose();
				    	console.log(ret);
				    	MachineGMBL.CloseDYJ("STT420");
		        		contentError();
				    }); 

				}else{
					console.log('下单失败,请重试');
        			$.Writelog('下单失败'+ret.Msg);
					$.layer({
					    msg: '下单失败，请重新下单谢谢',        
					    btn: ['确定'],                    
					    type: 1,                           
					    time: 6,                          
					    bulb: false,                       
					    title: '确认',                     
					    bulbSrc: 'assets/images/tip/bulb.png',     
					    endExecute: true,                          
					    yes: function() {                       
					       	choosePayMethodOnTheDay();
					    }
					});
				}
			}, function(error){
				console.log(error);
		    	$.Writelog('Pay接口网络异常');
				$.layer({
					msg: 'Pay接口网络异常，下单失败',        
				    btn: ['确定'],                    
				    type: 1,                           
				    time: 10,                          
				    bulb: false,                       
				    title: '确认',                     
				    bulbSrc: 'assets/images/tip/bulb.png',     
				    endExecute: true,                          
				    yes: function() {                       
				        contentError();
				    }
				})
			})	  
	    }
	});
}

// 查询下单状态   微信支付宝
var queryWeChatOrderPayStatusNumber;     
function QueryWeixinOrderPrintReport(){
	clearInterval(ReservationNumberTimer);
	queryWeChatOrderPayStatusNumber = false;
	ReservationNumberTimer = setInterval(function(){
		AJAX.Business.QueryPayStatus( JSON.stringify(RechargeAndPaymentInfo), function(ret){
			console.log(ret);
		}, function(ret){
			if(ret.Code == '0' && !queryWeChatOrderPayStatusNumber){
				clearInterval(ReservationNumberTimer);
				queryWeChatOrderPayStatusNumber = true;		
				console.log(ret);			
				var PayInfo = ret.PayInfo;
				$.Writelog('微信支付宝查单'+ PayInfo.TranNo);
				$.extend(RechargeAndPaymentInfo,{'PayInfo':PayInfo});
				$.extend(RechargeAndPaymentInfo,{"TranceID": PayInfo.TranNo});
				$.extend(CardInfo,RechargeAndPaymentInfo);

				console.log(RechargeAndPaymentInfo);
				console.log(CardInfo);
				successAndPayingPrintReport();	
			}
		}, function(ret){
			console.log(ret);
			$.Writelog('网络异常，查单失败'+ ret);
		});
	},2500)
}

// 调用GetSaveBlb
function successAndPayingPrintReport(){
	IsChildPage(true);
	var BackPrevPage = printChoisePaymethods;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: '正在交易中,请稍后...',
	    message: '正在交易中,请稍后...',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:true,
	    btns: [null, null],
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	    },
	    callBack: function($ele, $msg) {
	        console.log($ele, $msg);
	        console.log(CardInfo);
		    // $.loading(false,'加载中...');
		    $.ajax({
		    	url:'/api/Business/GetSaveBlb',
		    	data:JSON.stringify(CardInfo),
		    	type:'post',
		    	success:function(ret){
		    		// $.layerClose();
		    		var ret = JSON.parse(ret);
		    		console.log(ret);
		    		if(ret.Code == 0){
		    			$.Writelog(ret.Msg);   	
		    			$.Writelog('病历本购买成功，打印');		
		    			blbbuyandprint();                    // 打印病历本
		    		}else{
		    			console.log(ret.Msg);
		    			$.Writelog(ret.Msg);
		    			$.Writelog('!0 病历本购买失败，退款');
		    			MachineGMBL.CloseDYJ("STT420");
		    			errorAndBackMoneyPrintreport(ret.Msg);
		    		}
		    	},error:function(ret){
		    		// $.layerClose();
		    		console.log('购买病历本失败');
		    		$.Writelog('网络异常购买病历本失败');
		    		MachineGMBL.CloseDYJ("STT420");
		    		$.layer({
						msg: '网络异常购买病历本失败，如您有退款或其他疑问请联系客服',        
					    btn: ['确定'],                    
					    type: 1,                           
					    time: 10,                          
					    bulb: false,                       
					    title: '确认',                     
					    bulbSrc: 'assets/images/tip/bulb.png',     
					    endExecute: true,                          
					    yes: function() {                       
					        ShowMainMenu();
					    }
					})
		    	}
		    })
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        MachineGMBL.CloseDYJ("STT420");
	        ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        MachineGMBL.CloseDYJ("STT420");
	        $.ExitCard();
	    },
	});
};

// 失败退费
function errorAndBackMoneyPrintreport(msg){
	IsChildPage(true);
	var BackPrevPage = judgingLoginPrinter;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: '购买病历本失败，退款将在3个工作日内到账',
	    message: msg?msg:'购买病历本失败，退款将在3个工作日内到账',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:false,
	    btns: [null, null],
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	    },
	    callBack: function($ele, $msg) {
	        console.log($ele, $msg);
	        wxRefundPayRegNo();
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCard();
	    },
	});
}

// 银行卡
function bankCardPayPrintreport(){
	console.log(CardInfo);
	IsChildPage(true);
	var images = 'assets/images/card/paper-in.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgInputBank.gif';
	}
	var BackPrevPage = printChoisePaymethods;
	$.BrushIntoIdentity({
	    s: 90,
	    title:'<p>请在图中机器对应的位置放入银行卡</p>',
	    imgSrc: images,
	    imgStyle: {width: '600px'},
	    titleStyle:{fontWeight:'bold'},
	    hasConfirm:false,
	    hasPrev: true,
	    hasHome: true,
	    hasExit: true,
	    timeBack: function() {
	        console.log('倒计时结束');
	        clearInterval(timerDKQStatus);
	        if(ZZJInfomation.ZZJID == 7){
	        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        	setTimeout(function(){
	        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
	        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        		setTimeout(function(){
	        			$.Writelog('>>>>>>>>>>>>倒计时结束<<<<<<<<<<<');
    					BackPrevPage();   
	        		},1000)
	        	},1500);
	        }else{
	            POS.Stop();                             // 中断银联操作
	    		// POS.OutCard("CRT310",testcom);       // 弹卡
	    		setTimeout(function(){
	    			$.Writelog('>>>>>>>>>>>>倒计时结束<<<<<<<<<<<');
	    			BackPrevPage();
	    		},2500);
	    	}
	    },
	    homeBack: function($ele) {
	        console.log($ele);
	        clearInterval(timerDKQStatus);
	        MachineGMBL.CloseDYJ("STT420");         // 关闭病历本打印机
	        if(ZZJInfomation.ZZJID == 7){
	        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        	setTimeout(function(){
	        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
	        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        		setTimeout(function(){
	        			$.Writelog('>>>>>>>>>>>>返回首页<<<<<<<<<<<');   
		    			ShowMainMenu();      
	        		},1000)
	        	},1500);
	        }else{
	        	POS.Stop();                             // 中断银联操作
	    		// POS.OutCard("CRT310",testcom);       // 弹卡
			    setTimeout(function(){
			    	$.Writelog('>>>>>>>>>>>>返回首页<<<<<<<<<<<');   
			    	ShowMainMenu(); 
			    },2500);
	        }
	    },
	    prevBack: function($ele) {
	        console.log('上一页');
	        clearInterval(timerDKQStatus);
	        if(ZZJInfomation.ZZJID == 7){
	        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        	setTimeout(function(){
	        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
	        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        		setTimeout(function(){
	        			$.Writelog('>>>>>>>>>>>>返回上一页<<<<<<<<<<<');
		        		BackPrevPage();     
	        		},1000)
	        	},1500);
	        }else{
	    		POS.Stop();                             // 中断银联操作
				// POS.OutCard("CRT310",testcom);       // 弹卡
			    setTimeout(function(){ 
			    	$.Writelog('>>>>>>>>>>>>返回上一页<<<<<<<<<<<');
		        	BackPrevPage(); 
		        },2500);  
		    }   
	    },
	    exitBack: function($ele) {
	        console.log($ele);
	        clearInterval(timerDKQStatus);
	        MachineGMBL.CloseDYJ("STT420");         // 关闭病历本打印机
	        if(ZZJInfomation.ZZJID == 7){
	        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        	setTimeout(function(){
	        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
	        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        		setTimeout(function(){
	        			$.Writelog('>>>>>>>>>>>>点击退出<<<<<<<<<<<');
	        			$.ExitCardClearInfo();              
						$.intoOrExitCard(0, 5);             
						// $.ExitCard();                   
	        		},1000)
	        	},1500);
	        }else{
	        	POS.Stop();                             // 中断银联操作
	    		// POS.OutCard("CRT310",testcom);       // 弹卡
			    setTimeout(function(){ 
			    	$.Writelog('>>>>>>>>>>>>点击退出<<<<<<<<<<<');
					$.ExitCardClearInfo();              // 清除卡信息
					$.intoOrExitCard(0, 5);             // 退卡提示 
					// $.ExitCard();                    // 退卡
				},2500);   
	        }                     
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        if( ZZJInfomation.ZZJID == 7){
    			ReadCardInfoAndGetkeys(); 
	        }else{
	        	PosReadBankCard();             // 新的银联测试方法
	        }
	    }
	});
};

function socialPayPrintreport(){                // 社保卡支付
	IsChildPage(true);
	var images = 'assets/images/card/into-card.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgInputSocial.gif';
	}
	var BackPrevPage = printChoisePaymethods;
	var registerprice = Number(CardInfo.Amount).toFixed(2);    // 病历本费用
	$.BrushIntoIdentity({
	    s: 90,
	    title:'请在图中机器对应的位置放入社保卡',
	    imgSrc: images,
	    imgStyle: {width: '600px'},
	    titleStyle:{fontWeight:'bold'},
	    hasConfirm:false,
	    timeBack: function() {
	        console.log('倒计时结束');
	        $.layerClose();
	        $.Writelog('>>>>>>>>>>>>倒计时结束<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);

	        console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        		setTimeout(function(){
        			BackPrevPage();    
        		},1000)
        	},1500);
	    },
	    homeBack: function($ele) {
	        console.log($ele);
	        $.Writelog('>>>>>>>>>>>>返回首页<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);
	        MachineGMBL.CloseDYJ("STT420");         // 关闭病历本打印机
	        
	        console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        		setTimeout(function(){
        			ShowMainMenu();    
        		},1000)
        	},1500);
	    },
	    prevBack: function($ele) {
	        console.log($ele,'上一页');
	        $.Writelog('>>>>>>>>>>>>返回上一页<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);

	        console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        		setTimeout(function(){
        			BackPrevPage();    
        		},1000)
        	},1500);
	    },
	    exitBack: function($ele) {
	        console.log($ele);
	        $.Writelog('>>>>>>>>>>>>点击退出<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);
	        MachineGMBL.CloseDYJ("STT420");         // 关闭病历本打印机

	        console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        		setTimeout(function(){
        			$.ExitCardClearInfo();
					$.intoOrExitCard(1, 5);                        // 退卡提示   
					// $.ExitCard();                               // 退卡  
        		},1000)
        	},1500);
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        // if( ZZJInfomation.ZZJID == 36 ){
	        	openSocialCardAndReadcardChange();
	        // }else{
	        // 	openSocialCardAndReadcard();                   // 打卡读卡器,社保卡读卡	  
	        // } 
	    }
	});
}


/*--------------------------------------发票----------------------------------*/
// 打印发票 列表分页  
function printInvoiceListPagination(){
	IsChildPage(true);
	var BackPrevPage = judgingLoginPrinter;
	$.listGroupPanel({
	    s: 60,
	    size: 5,
	    title:'选择要打印的发票',
	    titleStyle:{fontWeight:'bold'},
	    btnName:'打印',
	    hasSelectAll: false,    //是否有全选按钮
	    isBtnInside: true,      //确认按钮是否在外
	    isRadio: true,
	    hasSelect: true,
	    hasSumary: false,
	    hasConfirm: true,
	    hasSearch: true,
	    selectTime: false,     //设置选择日期
	    hasSearch:false,
	    matchParam: 'letter',
	    timeIconSrc: 'assets/images/icons/calendar.png',
	    pageClass: '',
	    topItems: ['选择', '日期', '发票号', '总金额', '是否打印'],
	    bodyItem: ['Date', 'Hospayid', 'TotalAMT', 'invoiceprinted'],
	    showParam: [],
	    listGroupStyle: {
	        height: '420px',
	    },
	    summaryBack: function($ele, ret) {
	    	//点击 查看详情
	        console.log($ele, ret);
	    }, 
	    timeBack: function() {
	        console.log('倒计时结束');
	        judgingLoginPrinter();
	    },
	    btnBack: function($ele, ret) {
	        console.log($ele, ret, '确认');
	        console.log(RegisterTakeInfo);
        	// 获取当前选择的 发票号信息
        	var choisefapiao = [];
        	for(var i=0;i<ret.length;i++){
        		for(var j=0;j<RegisterTakeInfo.length;j++){
        			if( ret[i].Date == RegisterTakeInfo[j].InvoiceDate.slice(0,10) && ret[i].Hospayid == RegisterTakeInfo[j].Print_Basic.HOSPAYID
 ){
        				choisefapiao.push(RegisterTakeInfo[j]);
        			}
        		}
        	}
        	console.log(choisefapiao);
			$.extend(CardInfo, {"choisefapiao":choisefapiao});                   // 目前是单选 将选择的加入
			var newArr = [];                                                     // 多选过滤设置
	        if( CardInfo.CardInfo.CardNo == "0098030479" ){                      // 测试时用的病历号
	        	newArr = CardInfo.choisefapiao;
	        }else{
	        	for(var j=0;j<CardInfo.choisefapiao.length;j++){
		        	if(CardInfo.choisefapiao[j].Print_Basic.INVOICEPRINTED == 0){    // 判断是否打印
		        		newArr.push( CardInfo.choisefapiao[j] );
		        	}
		        }
	        }
	        console.log(newArr);
	        if(newArr.length > 0){
	        	invoiceStartPrint(newArr);
	        }else{
	        	$.layer({
	        		msg: '您选择的发票列表已打印过',        // msg 提示信息
				    btn: ['确认'],                          // btn 按钮 - 数组 （最多两个）
				    type: 1,                                // type 类型 [0, 1]
				    time: 6,                                // time 倒计时时间
				    bulb: false,                            // bulb 小灯泡是否显示
				    title: '温馨提示',                      // title 提示名称 
				    endExecute: true,
				    yes:function(){
				    	$.Writelog("选择已打印过的发票");
				    }
			    })
	        }
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();         
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        judgingLoginPrinter();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCard();
	    },
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	        //获取当前需要打印的 发票列表信息
	        var data = InformationQueryInfo;
	        data = transframArray(data);
	        console.log( transframArray(data) );
	        _call(data);
	    }
	});
}

// 发票 开始打印
function invoiceStartPrint(_data){
	IsChildPage(true);
	var BackPrevPage = judgingLoginPrinter;
	$.HandleCondition({
	    s: 20,
	    type: 1,
	    message: '正在打印中,请稍后！',
	    title: '正在打印中,请稍后！',
	    topImgSrc:'assets/images/tip/failure.png',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:true,
	    btns: [null, null],
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	    },
	    callBack: function($ele, $msg) {
	        console.log($ele, $msg);
	        console.log(CardInfo);
	        var newArr = _data;
	        
	    	for(var i=0;i<newArr.length;i++){
				(function(i){
	        		var currentPrintfapiao = {
	        			"CardInfo"        : CardInfo.CardInfo,
						"PatientInfo"     : CardInfo.PatientInfo,
						"ZZJCertificate"  : { ID: ZZJInfomation.ZZJID }
	        		}
	        		$.extend(currentPrintfapiao, {currentyChoisefp : newArr[i]});
		    		fapiaoPrinter(currentPrintfapiao);  // 打印发票
	        	})(i)
	        }
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCard();
	    },
	});
}


/***************************-----------打印病历本-----------*******************************/

// 打印病历本
function blbbuyandprint(){
	var user = CardInfo;
	console.log(user);
	var sex,birth,nation;
    if(user.PatientInfo.Gender == 1){
        sex = '男';
    }else if(user.PatientInfo.Gender == 2){
        sex = '女';
    }else{
        sex = "";
    }
    birth =  $.CheckUndefined( user.PatientInfo.IDNo );
    if(birth != ""){
        birth = birth.slice(6,14);
    }else{birth = ""};
    nation = $.CheckUndefined( user.PatientInfo.Nation );
    
    if(ZZJInfomation.ZZJID == 27){
    	var text = user.PatientInfo.PatientName+','+sex+','+birth+','+user.CardInfo.CardNo+','+user.PatientInfo.Mobile+','+user.PatientInfo.Address+','+nation;
    	FileSystem.WriterText('D:/blb/'+user.CardInfo.CardNo+'.txt',text);
    }
    
	MachineGMBL.Print("STT420" ,user.PatientInfo.PatientName ,sex ,birth ,user.CardInfo.CardNo ,user.PatientInfo.Mobile ,user.PatientInfo.Address ,nation).then(function(value){
		console.log(value);
		console.log(typeof value);
		$.Writelog(value)
        var printstatus = JSON.parse(value);
        if(printstatus.Code == 0){
            console.log('打印成功');
            $.Writelog("病历本打印成功");
            PrintBLBHintLamp();          // 打印灯的开启关闭         
   			invoiceEndPrint();           // 打印
        }else{
            console.log('第一次打印失败');
            $.Writelog("第一次病历本打印失败");
            blbbuyandprintNoInfo();
            // blbbuyandprintdouble();
        }
    },function(error){
        console.log('打印出错');
        console.log(error);
        $.layer({
        	msg: "打印机异常，请联系服务人员检查打印机",    // msg 提示信息
		    btn: ['确认'],                                  // btn 按钮 - 数组 （最多两个）
		    type: 1,                                        // type 类型 [0, 1]
		    time: 6,                                        // time 倒计时时间
		    bulb: false,                                    // bulb 小灯泡是否显示
		    title: '温馨提示',                              // title 提示名称 
		    endExecute:true,
		    yes:function(){
		    	MachineGMBL.CloseDYJ("STT420");             // 关闭病历本打印机
		    	ShowMainMenu();
		    }
        });  
    });
}

function blbbuyandprintdouble(){
	var user = CardInfo;
	console.log(user);
	var sex,birth,nation;
    if(user.PatientInfo.Gender == 1){
        sex = '男';
    }else if(user.PatientInfo.Gender == 2){
        sex = '女';
    }else{
        sex = "";
    }
    birth =  $.CheckUndefined( user.PatientInfo.IDNo );
    if(birth != ''){ birth = birth.slice(6,14); }else{birth = ""};
    nation = user.PatientInfo.Nation;
    if( nation == ''){ nation = "" };
	MachineGMBL.PrintNew("STT420" ,user.PatientInfo.PatientName ,sex ,birth ,user.CardInfo.CardNo ,user.PatientInfo.Mobile ,user.PatientInfo.Address ,nation).then(function(value){
		console.log(value);
		console.log(typeof value);
		$.Writelog(value)
        var printstatus = JSON.parse(value);
        if(printstatus.Code == 0){
            console.log('打印成功');
            $.Writelog("病历本打印成功");
            PrintBLBHintLamp();          // 打印灯的开启关闭         
   			invoiceEndPrint();           // 打印
        }else{
            console.log('第二次调用打印失败');
            $.Writelog("第二次调用病历本打印失败");
            $.layer({
	        	msg: "打印失败，请联系服务人员检查打印机",      // msg 提示信息
			    btn: ['确认'],                                  // btn 按钮 - 数组 （最多两个）
			    type: 1,                                        // type 类型 [0, 1]
			    time: 10,                                       // time 倒计时时间
			    bulb: false,                                    // bulb 小灯泡是否显示
			    title: '温馨提示',                              // title 提示名称 
			    endExecute:true,
			    yes:function(){
			    	MachineGMBL.CloseDYJ("STT420");             // 关闭病历本打印机
			    	ShowMainMenu();
			    }
	        });  
        }
    },function(error){
        console.log('打印出错');
        console.log(error);
        $.layer({
        	msg: "打印机异常，请联系服务人员检查打印机",    // msg 提示信息
		    btn: ['确认'],                                  // btn 按钮 - 数组 （最多两个）
		    type: 1,                                        // type 类型 [0, 1]
		    time: 6,                                        // time 倒计时时间
		    bulb: false,                                    // bulb 小灯泡是否显示
		    title: '温馨提示',                              // title 提示名称 
		    endExecute:true,
		    yes:function(){
		    	MachineGMBL.CloseDYJ("STT420");             // 关闭病历本打印机
		    	ShowMainMenu();
		    }
        });  
    });
}

// 直接调用打印机打印病历本 不打印姓名性别条行码等
function blbbuyandprintNoInfo(){
	MachineGMBL.PrintEmpty("STT420").then(function(value){
		console.log(value);
		$.Writelog(value);
        var printstatus = JSON.parse(value);
        if(printstatus.Code == 0){
            console.log('打印成功');
            $.Writelog("病历本打印成功");
            PrintBLBHintLamp();          // 打印灯的开启关闭         
   			invoiceEndPrint();           // 打印
        }else{
            console.log('直接调用打印失败');
            $.Writelog("直接调用病历本打印失败");
            $.layer({
	        	msg: "打印机异常，请联系服务人员检查打印机",   // msg 提示信息
			    btn: ['确认'],                                 // btn 按钮 - 数组 （最多两个）
			    type: 1,                                       // type 类型 [0, 1]
			    time: 10,                                      // time 倒计时时间
			    bulb: false,                                   // bulb 小灯泡是否显示
			    title: '温馨提示',                             // title 提示名称 
			    endExecute:true,
			    yes:function(){
			    	MachineGMBL.CloseDYJ("STT420");            // 关闭病历本打印机
	    			judgingLoginPrinter();
			    }
	        });
        }
    },function(error){
        console.log('打印出错');
        console.log(error);
        $.layer({
        	msg: "打印机异常，请联系服务人员检查打印机",   // msg 提示信息
		    btn: ['确认'],                                 // btn 按钮 - 数组 （最多两个）
		    type: 1,                                       // type 类型 [0, 1]
		    time: 6,                                       // time 倒计时时间
		    bulb: false,                                   // bulb 小灯泡是否显示
		    title: '温馨提示',                             // title 提示名称 
		    endExecute:true,
		    yes:function(){
		    	MachineGMBL.CloseDYJ("STT420");            // 关闭病历本打印机
		    	ShowMainMenu();
		    }
        });
    }) 
}

// 病历本打印完成
function invoiceEndPrint(){
	IsChildPage(true);
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title:'打印完成!',
	    message: '打印完成!',
	    topImgSrc:'assets/images/tip/succeed.png',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:false,
	    hasExit:true,
	    btns: [null, null],
	    timeBack: function() {
	        console.log('倒计时结束');
	        ShowMainMenu();         // 返回首页
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	    },
	    callBack: function($ele, $msg) {
	        console.log($ele, $msg);
	        MachineGMBL.CloseDYJ("STT420");
	        var tag = "";
	        if( CardInfo.PayInfo.ExParams != undefined ){
	        	if(CardInfo.PayInfo.ExParams == null){
	        		tag = null;
	        	}else{
	        		tag = CardInfo.PayInfo.ExParams;
	        	}
	        }
	        var data = {
        		"PayID"    : CardInfo.PayID,
        		"TranceID" : CardInfo.PayInfo.TranNo==""?CardInfo.Trace:CardInfo.PayInfo.TranNo,
        		"business_success": true,
        		"pay_success"     : true,
        		"business_type"   : 4,
        		"retfund"         : false,
        		"tag"             : tag
        	}
        	console.log("更新传参uptadepaylog",data);
        	AJAX.Business.UpdatePaylog(JSON.stringify(data), function(ret){
        		console.log(ret);
        	}, function(value){
        		console.log("更新交易记录",value);
        		if(value.Code == 0){
        			console.log("病历本更新交易记录成功");
        			$.Writelog("病历本更新交易记录成功");
        		}else{
        			console.log(value.Msg);
        		}
        	}, function(error){
        		console.log(error);
        	})
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        // BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCard();
	    },
	});
}

/*----------------------------------------------*/

// 消费清单打印列表
function listOfPaymentDetialPrint(){
	var  BackPrevPage = judgingLoginPrinter;
	IsChildPage(true);   
	$.listGroupPanel({
	    s: 60,
	    size: 4,
	    title:'选择你要打印的项目',
	    titleStyle:{fontWeight:'bold'},
	    isBtnInside: true,     // 确认图标在外
	    isRadio: false,
	    hasSelect: true,
	    hasSelectAll: true,    // 是否有全选按钮
	    hasSumary: true,
	    hasConfirm: true,
	    hasSearch: false,
	    selectTime: false,
	    matchParam: 'letter',
	    timeIconSrc: 'assets/images/icons/calendar.png',
	    pageClass: '',
	    topItems: ['选择','发票号', '日期', '总金额', '是否打印','查看详情'],
	    bodyItem: ['HISPayNo', 'Date', 'Cost', 'DocName'],
	    showParam: [],
	    listGroupStyle: {
	        height: '420px',
	    },
	    itemBack: function($ele, ret) {
	        console.log($ele, ret);
	    },
	    summaryBack: function($ele, ret) {
	        console.log($ele, ret);
	        console.log(RegisterTakeInfo);
	        var rets;
        	for(var j=0;j<RegisterTakeInfo.length;j++){
        		if( ret.Date == RegisterTakeInfo[j].PayDate.slice(0,10) && ret.DoctCode == RegisterTakeInfo[j].RegisterInfo.Doct.DoctCode && ret.HISPayNo == RegisterTakeInfo[j].HISPayNo && ret.Cost == RegisterTakeInfo[j].Total){
        			rets = RegisterTakeInfo[j];
        			break;
        		}
        	}
	        console.log(rets);
	        readDetialprint(rets);            // 查看详情
	    }, 
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, ret) {
	        console.log($ele, ret, '确认');   // ret ==> 打印的项目   
	        console.log(RegisterTakeInfo);
	        var rets = [];
	        for(var i=0;i<ret.length;i++){
	        	for(var j=0;j<RegisterTakeInfo.length;j++){
	        		if(ret[i].Date == RegisterTakeInfo[j].PayDate.slice(0,10) && ret[i].DoctCode == RegisterTakeInfo[j].RegisterInfo.Doct.DoctCode && ret[i].RecipesID == RegisterTakeInfo[j].RecipesID && ret[i].HISPayNo == RegisterTakeInfo[j].HISPayNo){
	        			rets.push(RegisterTakeInfo[j]);
	        		}
	        	}
	        }
	        console.log(rets);
	        $.extend(CardInfo,{RecipesInfo:rets});
	        HYDQDPrintover();
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();         
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCard();
	    },
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	        var data = InformationQueryInfo;
	        console.log( transframArray(data) );
	        data = transframArray(data);
	        _call(data);
	    }
	})
}

//查看详情
function readDetialprint(results){
	var BackPrevPage = listOfPaymentDetialPrint;
	IsChildPage(true);  
	$.SummaryPagePanel({
	    s        : 60,
	    size     : 6,
	    title    : '项目详情列表',
	    wrapper  : '.content',
	    pageClass: 'summary',
	    topItems : ['项目编号', '药品名称',  '金额(￥)'],
	    bodyItem : ['Code', 'ItemName', 'Total'],
	    matchParam: 'letter',
	    itemBack : function($ele, ret) {
	        console.log($ele, ret);
	    },
	    callBack : function($ele, _call) {
	        console.log($ele, '渲染后回调');
	        console.log(results);
        	var newArr = [];
	        for(var i=0;i<results.Details.length;i++){
	        	newArr[i] = {
	        		ItemName : results.Details[i].Name,
	        		Unit     : results.Details[i].Price,
	        		Count    : results.Details[i].Count,
	        		Type     : results.Details[i].Code,
	        		Total    : results.Details[i].Total,
	        		Code     : results.Details[i].Code
	        	}
	        };
	        _call(newArr);
	    },
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    hideBack: function($ele) {
	        console.log($ele, '隐藏返回');
	    }
	}); 
}

// // 打印选择的列表 提示打印中
function HYDQDPrintover(){
	IsChildPage(true);
	var BackPrevPage = judgingLoginPrinter;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: '费用明细清单打印中请稍后',
	    message: '费用明细清单打印中请稍后',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:false,
	    btns: [null, null],
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	    },
	    callBack: function($ele, $msg) {
	        console.log($ele, $msg);
	        console.log(CardInfo);
	        HYDPRINTNAME = 'Brother HL-5590DN Printer';
	        var printsdata = [];
        	for(var j=0;j<CardInfo.RecipesInfo.length;j++){
	        	if(CardInfo.RecipesInfo[j].InvoicePrinted == "0"){   // 未打印
	        		printsdata.push(CardInfo.RecipesInfo[j]);	
	       		}
        	}
	        console.log(printsdata);
	        if(printsdata.length > 0){
	        	for(var i=0;i<printsdata.length;i++){
		        	(function(i){
		        		setTimeout(function(){
		        			var printRecipes = {
			        			"CardInfo"        : CardInfo.CardInfo,
								"PatientInfo"     : CardInfo.PatientInfo,
								"ZZJCertificate"  : { ID: ZZJInfomation.ZZJID }
			        		}
		        			$.extend(printRecipes, {RecipesInfo:printsdata[i]});
		        			// PrintHYD(printRecipes);      // 开始打印 
		        			PrintHYD_change(printRecipes);
		        		},1300)
		        	})(i);
		        }
	        }else{
	        	$.layer({
	        		msg: '您选择的列表已打印过',         // msg 提示信息
				    btn: ['确认'],           // btn 按钮 - 数组 （最多两个）
				    type: 1,                 // type 类型 [0, 1]
				    time: 6,                 // time 倒计时时间
				    bulb: false,             // bulb 小灯泡是否显示
				    title: '温馨提示',       // title 提示名称 
				    endExecute: true,
				    yes:function(){
				    	judgingLoginPrinter();
				    }
			    })
			} 
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCard();
	    },
	});
}

