var ReservationNumberTimer;
//预约取号
function ReservationNumber(){
	IsChildPage(true);  
	var images = 'assets/images/card/input-IDCard.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgdenglu.gif';
	}
	$.BrushIntoIdentity({     //登录 获取信息
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
	        $.Writelog('-------取号登录--------');
	        pageType = 'YYQH';
		    userInfoToCard();                      // 同时开启身份证和扫凭条
	    }
	});
};

//登录界面
function LoginReserevationNumber(){
	console.log(CardInfo);
	IsChildPage(false);                            //判断是否为子界面
	$(PAGE).html(reservationNumberText);
	var ele = '#reservationNumber';
	$.ExecuteAnimate(ele, 0);
	//倒计时   // 定时返回
    $.BackInterval(30);
    $('.user-info').find('li:eq(0)').html('姓名：'+CardInfo.PatientInfo.PatientName);
    $('.user-info').find('li:eq(1)').html('卡号：'+CardInfo.CardInfo.CardNo);
    $('.user-info').find('li:eq(2)').html('年龄：'+ countAges(CardInfo) );

    $('.reservationNumberyy.item').click(function(){
    	$.loading(false,'加载中...');
    	//查询预约信息
        $.extend(CardInfo,{'RegType':1});
        AJAX.Business.QueryAppointment( JSON.stringify(CardInfo), function(ret){
        	$.layerClose();
        	console.log(ret);
        }, function(ret){
        	$.layerClose();
    		console.log(ret)
    		if(ret.Code == '0'){
    			RegisterTakeInfo = ret.AppointmentInfo;
    			// 展示所有预约挂号的医生
    			showAllRegisterDoct();
    		}else{
    			console.log('没有预约信息');
    			$.layer({
			        msg: ret.Msg, 
			        btn: ['确认'],
			        type: 1,     
			        time: 6,
			        bulbSrc: 'assets/images/tip/bulb.png',
			        yes: function(){
			            // LoginReserevationNumber();
			        }
			    });
    		}
        }, function(ret){
        	$.layerClose();
    		console.log(ret);
    		contentError();
        });
	});  

	//微信取号  线上取号       	
	$('.reservationNumberwx.item').click(function(){
		$.extend(CardInfo,{'RegType':2})
		$.loading(false,'正在查询请稍后');
		AJAX.Business.QueryAppointment( JSON.stringify(CardInfo), function(ret){
			$.layerClose();
			console.log(ret);
		}, function(ret){
			$.layerClose();
			console.log(ret);
			if(ret.Code == '0'){
				RegisterTakeInfo = ret.AppointmentInfo;
				// 展示所有线上挂号的医生
				showAllRegisterDoctOnline();
			}else{
				console.log(ret.Msg);
				$.layer({
			        msg: ret.Msg, 
			        btn: ['确认'],
			        type: 1,     
			        time: 6,
			        bulbSrc: 'assets/images/tip/bulb.png',
			        yes: function(){
			            // LoginReserevationNumber();
			        }
			    });
			}
		}, function(ret){
			$.layerClose();
			console.log(ret);
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

//展示所有挂号的医生信息
function showAllRegisterDoct(){
	console.log(CardInfo);
	console.log(RegisterTakeInfo);
	var BackPrevPage = LoginReserevationNumber;
	IsChildPage(true);
	$.ChooseDoctor({
	    s: 60,
	    isSpeak: false,
	    titleStyle:{
	        fontWeight:'bold',
	    },
	    itemBtnClass:'.btn-register',
	    title:'请选择已预约的医生',
	    nothingMsg:'查询到您今日没有预约医生',
	    getItem: GetDoctorGroupGetNumber,
	    itemBtnBack: function($ele, ret) {
	    	console.log(RegisterTakeInfo);
	        console.log(ret);              // ret ==> 当前选择的信息
	        var Dept;
	        for(var i=0;i<RegisterTakeInfo.length;i++){
	        	if(ret.DoctCode == RegisterTakeInfo[i].Doct.DoctCode && ret.SeeTimeBetween.EndTime == RegisterTakeInfo[i].Doct.SeeTimeBetween.EndTime){
	        		Dept = RegisterTakeInfo[i].Dept;
	        		$.extend(CardInfo,{AppointmentInfo:RegisterTakeInfo[i]});
	        		break;
	        	}
	        }
	        $.extend(CardInfo,{"Doct":ret,"Dept":Dept});
	        console.log(CardInfo);
	        console.log(CardInfo.Doct.InfinetReg);
	        $.Writelog('是否能取号,'+CardInfo.Doct.InfinetReg);
	        // 确认医生信息
	        if(CardInfo.Doct.InfinetReg == true){

	        	var DateTimeSegmentBetween = {
		            "StartTime": CardInfo.Doct.SeeTimeBetween.StartTime,
		            "EndTime"  : CardInfo.Doct.SeeTimeBetween.EndTime
		        };
	    		$.extend(CardInfo, {"DateTimeSegmentBetween":DateTimeSegmentBetween});
	    		$.extend(CardInfo, {"Docts": [ CardInfo.Doct ] });
	    		AJAX.Business.queryRegistrFee(JSON.stringify(CardInfo), function(ret){}, function(value){
	        		if(value.Code == 0){
	        			$.Writelog(value.Msg);
	        			var doctRegPrice = value;
	        			$.extend(CardInfo,{"DoctRegPrice":doctRegPrice});
	        			CardInfo.Doct.PriceList[0].Price = CardInfo.DoctRegPrice.Price.Price;

	        			pleaseConfirmThePayment();
	        		}else{
	        			$.Writelog(value.Msg);
	        			$.layer({
						    msg: value.Msg,                                       // msg 提示信息
						    btn: ['确定'],                                        // btn 按钮 - 数组 （最多两个）
						    type: 1,                                              // type 类型 [0, 1]
						    time: 15,                                             // time 倒计时时间
						    bulb: false,                                          // bulb 小灯泡是否显示
						    title: '确认',                                        // title 提示名称
						    bulbSrc: 'assets/images/tip/bulb.png',                // bulbSrc 灯泡图片路径
						    endExecute: true,                                     // endExecute 定时时间结束后是否执行确认函数 默认 true
						    yes: function() {                                     // yes 确认按钮回调
						        $.Writelog(value.Msg);
						    }
						})
	        		}
	        	}, function(error){
	        		$.Writelog("查询挂号费异常");
	        		contentError();
	        	});
	        }else{
	        	$.layer({
                    msg: CardInfo.Doct.DoctIntroduce,
                    btn:['确认'],
                    tme:5,
                    type:1,
                    endExecute: true, 
                    yes:function(){
                    	$.Writelog(CardInfo.Doct.DoctIntroduce);
                    }
                });
	        }
	    },
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage(); 
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
	    btnBack: function($ele, ret) {
	        console.log($ele, ret)
	    },
	    callBack: function($ele, _call) {
	        // console.log($ele, '渲染后回调');
	        console.log(RegisterTakeInfo);
	        var arr = [];
	        var nowdate = nowDate().slice(0,10);
	        console.log(CardInfo);
	        if(CardInfo.CardInfo.CardNo == "0098030479"){
        		arr.push(RegisterTakeInfo[RegisterTakeInfo.length-1].Doct);
        		_call(arr);  
	        }else{
	        	for(var i=0;i<RegisterTakeInfo.length;i++){
		        	if(RegisterTakeInfo[i].Doct.SeeTimeBetween.StartTime.slice(0,10) == nowdate){
		        		arr.push(RegisterTakeInfo[i].Doct)
		        	}
		        }
		        _call(arr);  
	        }
 			 
		}
	})
}
// <span class="value">：¥ ${parseFloat(_val.PriceList[0].Price).toFixed(2)}</span>\
// 获取挂号医生列表输出 item-group - 必有列 类名
function GetDoctorGroupGetNumber(_val) {
	console.log(_val);
	//${_val.SeeTimeBetween.StartTime.slice(11)}-${_val.SeeTimeBetween.EndTime.slice(11)}
    return `<div class="doctor-group item-group">\
        <div class="cell-item theme-tinge-br-color">\
            <div class="vertical-middle">\
                <img class="img-circle theme-tinge-br-color-1" src="http://201.201.201.34:1111/doctimg/${_val.DoctName}.jpg">\
            </div>\
            <div class="vertical-middle">\
                <p class="theme-tinge-color m-b-s">\
                    <span class="font-28">${_val.DoctName}</span>&nbsp;&nbsp;\
                </p>\
                <p>\
                    <span class="name">医生代码</span>\
                    <span class="value">：${_val.DoctCode}</span>\
                </p>\
                <p>\
                    <span class="name">就诊日期</span>\
                    <span class="value">：${_val.SeeTimeBetween.StartTime.slice(0,16)}-${_val.SeeTimeBetween.EndTime.slice(11,16)} </span>\
                </p>\
            </div>\
            <div class="vertical-middle">\
                <div class="btn btn-shadow btn-sm gradual-theme btn-radius btn-register">取号</div>\
            </div>\
        </div>\
    </div>`
};

//展示单个医生信息
function pleaseConfirmThePayment(){
	var BackPrevPage = showAllRegisterDoct;
	console.log(CardInfo);
	var prices = CardInfo.Doct.PriceList[0].Price;
	IsChildPage(true);  
	$.ConfirmHandleInformation({
	    s: 60,
	    title:'请确认您的预约信息',
	    info: {
	        imgSrc: 'http://201.201.201.34:1111/doctimg/'+CardInfo.Doct.DoctName+'.jpg',
	        doctorName: CardInfo.Doct.DoctName,
	        bodyItem: [{
	                name: '就诊时间：',
	                value: `<p>${CardInfo.Doct.SeeTimeBetween.EndTime.slice(0,10)}</p><p>${CardInfo.Doct.SeeTimeBetween.StartTime.slice(11,16)}-${CardInfo.Doct.SeeTimeBetween.EndTime.slice(11,16)}</p>`,
	            }, {
	                name: '门&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;诊：',
	                value: CardInfo.Dept.DeptName,
	            }, {
	                name: '诊&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费：',
	                value: '￥'+ parseFloat(prices).toFixed(2),
	            }, {
	                name: '就&nbsp;&nbsp;诊&nbsp;&nbsp;人：',
	                value: CardInfo.PatientInfo.PatientName
	            }]
	    },
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
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
	    btnBack: function($ele, ret) {
	        console.log($ele, ret)
        	//选择支付 方式  4种
        	choosePayMethods()
	    },
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	    },
	});
}

//选择支付方式
function choosePayMethods(){
	IsChildPage(true);
	var BackPrevPage = pleaseConfirmThePayment;
	var prices = Number(CardInfo.Doct.PriceList[0].Price).toFixed(2);
	$.HandleCondition({
	    s: 60,
	    type: 1,
	    title:'请选择支付方式',
	    btns:['银行卡付款','支付宝付款','微信付款','社保卡付款'],
	    message: '挂号费：￥'+prices,
	    topImgSrc:'assets/images/tip/failure.png',
	    btnWrapStyle:{marginLeft:'200px',marginRight:'200px'},
	    wrapStyle:{paddingTop:'60px'},
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:true,
	    yes: function($ele) {
        	console.log($ele,'银行卡付款');
        	pageType = 'YYQH';
	        paymethods = 'bank';
        	if(isopenBankPay == true){
    			bankCardPay();             //银行卡
        	}else{
        		unsupportedClick();
        	}
	    },
	    btn2: function($ele) {
	        console.log($ele,'支付宝付款');
	        pageType = 'YYQH';
	        paymethods = 'zhifuPay';
	        if(isopenWXZFBPay == true){
	        	WeiXinPay();
	        }else{
	        	unsupportedClick();
	        }
	    },
	    btn3: function($ele) {
	        console.log($ele,'微信付款');
	        pageType = 'YYQH';
	        paymethods = 'weiChat';
	        if(isopenWXZFBPay == true){
	        	WeiXinPay();  
	        }else{
	        	unsupportedClick();
	        }
	    },
	    btn4: function($ele) {
	        console.log($ele,'社保卡付款');
	        pageType = 'YYQH';
	        paymethods = 'social';
	        if(isopenSocialPay == true){
    			socialSecurityCardPay();
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
	    	console.log(CardInfo);
	    	$.Writelog('病历号：'+CardInfo.CardInfo.CardNo);
	    	$.Writelog('支付金额：'+ prices);
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

//微信支付界面
function WeiXinPay(){
	console.log(CardInfo);
	IsChildPage(true);
	var BackPrevPage = choosePayMethods;
	var imgs = '';                     // 支付背景图片
	var titles = '';
	var payMethod = 0;                 // 支付方式
    if(paymethods == 'weiChat'){       // 微信下单  
    	payMethod = 3;
    	imgs = 'assets/images/bg/sweep-weix.png';
    	titles = '请使用微信扫描二维码缴费';
    };
   	if(paymethods == 'zhifuPay'){      // 支付宝下单  
   		payMethod = 4;
   		imgs = 'assets/images/bg/sweep-ali.png';
   		titles = '请使用支付宝扫描二维码缴费';
   	};
	$.ScanCode({
	    s: 130,
	    title: titles,
	    titleStyle:{fontWeight:'bold'},
	    bgSrc: imgs,
	    hasHome: true,
	    hasPrev: true,
	    hasExit: false,
	    timeBack: function() {
	        console.log('倒计时结束');
	        $.Writelog('倒计时结束');
	        console.log(RechargeAndPaymentInfo); 
	        clearInterval(ReservationNumberTimer);
	      	ClosetheOrder(BackPrevPage);    // 关闭订单
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        $.Writelog('返回首页');
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
	        $.Writelog('点击了上一页');
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
	        $.Writelog('点击了退出');
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
	      			ClosetheOrder($.ExitCard);   // 关闭订单
			    }
	        })
	    },
	    callBack: function($ele, $img) {
	        console.log($ele,$img, '渲染后回调');
	        PAYSTATUES = true;                                           // 支付状态判断
	        var registerprice = Number(CardInfo.Doct.PriceList[0].Price).toFixed(2);
	        console.log(registerprice);
	        var randomNumber = Math.random().toString().substr(2,8);     // 随机数
	        RechargeAndPaymentInfo = {
		        "ZZJCertificate": { "ID": ZZJInfomation.ZZJID },
		        "PayInfo":{
		            "PayMetHod": payMethod,                              // 支付方式 
		            "Amount"   : registerprice,                          // 支付金额
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
				    	console.log(ret);
				    	if(ret.Code == '0'){
		        			var payInfo = ret.PayInfo;
		        			if(paymethods == 'weiChat'){           // 微信
		        				console.log('微信TranNo:'+payInfo.TranNo);
					        	$.Writelog('微信TranNo:'+payInfo.TranNo);
					        };
					       	if(paymethods == 'zhifuPay'){          // 支付宝
					       		console.log('支付宝TranNo:'+payInfo.TranNo);
					       		$.Writelog('支付宝TranNo:'+payInfo.TranNo);
					       	};

		        			var strs = payInfo.PayUrl;
		        			var ele = $img.parent('.qr-code');
		        			createCodeEWM(ele,strs);                             // 创建二维码
		        			//将商品编号加入 RechargeAndPaymentInfo
		        			$.extend(RechargeAndPaymentInfo,{'PayInfo':payInfo});
		        			QueryWeixinOrderRegisterNo();                        // 循环查单
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
							       	choosePayMethods();
							    }
							});
		        		}
				    }, function(ret){
				    	$.layerClose();
				    	console.log(ret);
		        		contentError();
				    });
		    	}else{
		    		console.log(value.Msg);
		    		$.Writelog(value.Msg);
		    		$.layer({
						msg: value.Msg,        
					    btn: ['确定'],                    
					    type: 1,                           
					    time: 10,                          
					    bulb: false,                       
					    title: '确认',                     
					    bulbSrc: 'assets/images/tip/bulb.png',     
					    endExecute: true,                          
					    yes: function() {                       
					        choosePayMethods();
					    }
					})
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
			});  
	    }
	});
};

//进入银行卡支付界面bankCardPay
function bankCardPay(){
	IsChildPage(true);
	var images = 'assets/images/card/paper-in.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgInputBank.gif';
	}
	var BackPrevPage = choosePayMethods;
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
	        // console.log('倒计时结束');
	        $.layerClose();
	        clearInterval(timerDKQStatus);
	        if(ZZJInfomation.ZZJID == 36 || ZZJInfomation.ZZJID == 7 ){
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
	        // console.log($ele);
	        clearInterval(timerDKQStatus);
	        if(ZZJInfomation.ZZJID == 36 || ZZJInfomation.ZZJID == 7 ){
	        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        	setTimeout(function(){
	        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
	        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        		setTimeout(function(){
	        			$.Writelog('>>>>>>>>>>>>返回首页<<<<<<<<<<<');
	        			ShowMainMenu();    
	        		},1000)
	        	},1500);
	        	// MachineBGPOS.TL_EjectCard(); 
	        	// ShowMainMenu();
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
	        // console.log('上一页');
	        clearInterval(timerDKQStatus);
	        if(ZZJInfomation.ZZJID == 36 || ZZJInfomation.ZZJID == 7 ){
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
	        // console.log($ele);
	        clearInterval(timerDKQStatus);
	        if(ZZJInfomation.ZZJID == 36 || ZZJInfomation.ZZJID == 7 ){
	        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        	setTimeout(function(){
	        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
	        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        		setTimeout(function(){
	        			$.Writelog('>>>>>>>>>>>>点击退出<<<<<<<<<<<');
	        			$.ExitCardClearInfo();
						$.intoOrExitCard(0, 5);             // 退卡提示   
						// $.ExitCard();                    // 退卡  
	        		},1000)
	        	},1500);
	        }else{
		    	POS.Stop();                             // 中断银联操作
	    		// POS.OutCard("CRT310",testcom);       // 弹卡
	    		setTimeout(function(){
	    			$.Writelog('>>>>>>>>>>>>点击退出<<<<<<<<<<<');
					$.ExitCardClearInfo();
					$.intoOrExitCard(0, 5);             // 退卡提示   
					// $.ExitCard();                    // 退卡  
				},2500);       
			}                 
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        if( ZZJInfomation.ZZJID == 36 || ZZJInfomation.ZZJID == 7){
	        	ReadCardInfoAndGetkeys(); 
	        }else{
	        	PosReadBankCard();                     // 新的银联测试方法
	        }
	    }
	});
}

//进入社保卡支付界面 
function socialSecurityCardPay(){
	IsChildPage(true);
	var images = 'assets/images/card/into-card.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgInputSocial.gif';
	}
	var BackPrevPage = choosePayMethods;
	var registerprice = Number(CardInfo.Doct.PriceList[0].Price).toFixed(2);        // 预约挂号费
	$.BrushIntoIdentity({
	    s: 90,
	    title:'请在图片对应的位置放入社保卡',
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
	        console.log('上一页');
	        $.Writelog('>>>>>>>>>>>>上一页<<<<<<<<<<<');
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
	        console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        		setTimeout(function(){
        			$.ExitCardClearInfo();
					$.intoOrExitCard(1, 5);                     // 退卡提示  
					// $.ExitCard();                            // 退卡     
        		},1000)
        	},1500);
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        // if( ZZJInfomation.ZZJID == 36 ){
	        	openSocialCardAndReadcardChange();
	        // }else{
	        // 	openSocialCardAndReadcard();         // 打卡读卡器,社保卡读卡
	        // }
	    }
	});
};

// 缴费成后 查单
var queryWeChatOrderPayStatusNumber;           //微信查单状态
function QueryWeixinOrderRegisterNo(){
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
				$.extend(RechargeAndPaymentInfo.PayInfo,{'TranNo':PayInfo.TranNo});
				$.extend(RechargeAndPaymentInfo,{"TranceID": PayInfo.TranNo});
				$.extend(CardInfo,RechargeAndPaymentInfo);

				console.log(RechargeAndPaymentInfo);
				console.log(CardInfo);
				successAndPayingRegisterNo();	
			}
		}, function(ret){
			console.log(ret);
			$.Writelog('网络异常，查单失败'+ ret);
		});
	},2500)
}

// 查单成功 取号交易 获取 PayID
function successAndPayingRegisterNo(){
	IsChildPage(true);
	var BackPrevPage = choosePayMethods;
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
		    $.loading(false,'取号中请稍后');
		    AJAX.Business.SaveAppointment( JSON.stringify(CardInfo), function(ret){
		    	$.layerClose();
		    	console.log(ret);
		    }, function(ret){
		    	$.layerClose();
		    	if(ret.Code == '0'){
					console.log('取号成功，请按时就诊！');
					$.Writelog('取号成功，打印凭条！');
					console.log(ret);
					$.extend(CardInfo,{'successRegister':ret});	
					if(CardInfo.successRegister.TsrqTp != "" && CardInfo.successRegister.TsrqTp != undefined){
						$.layer({
							msg: `<img alt="加载图片破损" src="${CardInfo.successRegister.TsrqTp}"/>`,        
						    btn: ['确定'],                    
						    type: 1,                           
						    time: 15,                          
						    bulb: false,                       
						    title: '特别信息--请确认',                     
						    bulbSrc: 'assets/images/tip/bulb.png',     
						    endExecute: true,                          
						    yes: function() {                       
						        $.Writelog("特殊人群信息提示图片");
						    }
						})
					}
					successRegisterRegNo();         //取号成功界面
					rechargeSucceed(CardInfo);      //打印凭条
				}else{
					console.log(ret.Msg);
					$.Writelog('取号失败'+ret.Msg);
					errorAndBackMoneyRegisterNo(ret.Msg);
				}
		    }, function(ret){
		    	$.layerClose();
		    	console.log('网络异常,取号失败');
		    	$.Writelog('网络异常,取号失败');
				$.layer({
					msg: '网络异常取号失败，如您有退款或其他疑问请联系客服',        
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
		    }); 
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
};

//  取号成功 
function successRegisterRegNo(){
	IsChildPage(true);
	$.HandleCondition({
	    s: 15,
	    type: 1,
	    title:'	取号成功，请按时就诊！',
	    message: '取号成功，请按时就诊！',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:false,
	    hasExit:true,
	    btns: [null, null],
	    timeBack: function() {
	        console.log('倒计时结束');
	        ShowMainMenu(); 
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	    },
	    callBack: function($ele, $msg) {
	        console.log($ele, $msg);
	        console.log(CardInfo);
	        if(CardInfo.RegType == 1){  // 预约取号
	        	var data = {
	        		PayID    : CardInfo.PayID,
	        		TranceID : CardInfo.PayInfo.TranNo==""?CardInfo.TranceID:CardInfo.PayInfo.TranNo,
	        		business_success: true,
	        		pay_success     : true,
	        		business_type   : 2,
	        		retfund         : false
	        	}
	        	console.log("更新传参uptadepaylog",data);
	        	AJAX.Business.UpdatePaylog(JSON.stringify(data), function(ret){
	        		console.log(ret);
	        	}, function(value){
	        		console.log("挂号成功后更新交易记录",value);
	        		if(value.Code == 0){
	        			console.log("挂号成功后更新交易记录成功");
	        			$.Writelog("挂号成功后更新交易记录成功");
	        		}else{
	        			console.log(value.Msg);
	        		}
	        	}, function(error){
	        		console.log(error);
	        	})
	        } 
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        $.ExitCardClearInfo();             // 清除信息 
	        ShowMainMenu();                    // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        // BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCardClearInfo();             // 清除信息 
	        $.ExitCard();
	    },
	});
}

// 取号失败 
function errorAndBackMoneyRegisterNo(msg){
	IsChildPage(true);
	var BackPrevPage = judgingLogin;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: '取号失败，退款将在24小时内到账',
	    message: msg?msg:'取号失败，退款将在24小时内到账',
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
	        $.ExitCardClearInfo();             // 清除信息 
	        ShowMainMenu();                    // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCardClearInfo();             // 清除信息 
	        $.ExitCard();
	    },
	});
}

// 退费 退单
function wxRefundPayRegNo(){
	AJAX.Business.RefundPay( JSON.stringify(RechargeAndPaymentInfo), function(ret){
		console.log(ret)
	}, function(ret){
		if(ret.Code == '0'){
			console.log(ret.Msg);
			$.Speak('退单成功，退款将在二十四小时内到账');
			$.Writelog(ret.Msg);
			setTimeout(function(){
				ShowMainMenu();	
			},3000)
		}else{
			console.log('退单失败')
			$.Writelog(ret.Msg);
			// 取消挂号中 - 挂号查询
			setTimeout(function(){
				$.Speak(ret.Msg);
				ShowMainMenu();	
			},3000)
		}
	}, function(ret){
		console.log(ret);
		$.Speak('网络异常');
		contentError();
	});
};

//展示所有挂号的医生信息online
function showAllRegisterDoctOnline(){
	console.log(CardInfo);
	IsChildPage(true);
	$.ChooseDoctor({
	    s: 60,
	    isSpeak: false,
	    titleStyle:{
	        fontWeight:'bold',
	    },
	    itemBtnClass:'.btn-register',
	    title:'请选择已预约的医生',
	    nothingMsg:'今日暂无您预约的医生信息，请稍后查询',
	    getItem: GetDoctorGroupGetNumberOnline,
	    itemBtnBack: function($ele, ret) {
	    	console.log(RegisterTakeInfo);
	        console.log(ret);   //ret ==> 当前选择的信息
	        var Dept;
	        for(var i=0;i<RegisterTakeInfo.length;i++){
	        	if(ret.DoctName == RegisterTakeInfo[i].Doct.DoctName && ret.ExParams.RegDate == RegisterTakeInfo[i].Doct.ExParams.RegDate){
	        		Dept = RegisterTakeInfo[i].Dept;
	        		$.extend(CardInfo,{"AppointmentInfo":RegisterTakeInfo[i]});
	        		break;
	        	}
	        }
	        $.extend(CardInfo,{Doct:ret,Dept:Dept});
	        console.log(CardInfo);
	        pleaseConfirmThePaymentOnline();  // 确认医生信息
	    },
	    timeBack: function() {
	        console.log('倒计时结束');
	        // BackPrevPage();  
	        ShowMainMenu();
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();                   // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        // BackPrevPage();
	        ShowMainMenu();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCard();
	    },
	    btnBack: function($ele, ret) {
	        console.log($ele, ret)
	    },
	    callBack: function($ele, _call) {
	        // console.log($ele, '渲染后回调');
	        console.log(RegisterTakeInfo)
	        var arr = [];
	        var nowdate = nowDate().slice(0,10);
	        for(var i=0;i<RegisterTakeInfo.length;i++){
	        	if(RegisterTakeInfo[i].Doct.ExParams.RegDate.slice(0,10) == nowdate){
	        		arr.push(RegisterTakeInfo[i].Doct)
	        	}
	        }
 			_call(arr);   
		}
	})
}

// 获取挂号医生列表输出 item-group - 必有列 类名
function GetDoctorGroupGetNumberOnline(_val) {
	console.log(_val);
	//${_val.SeeTimeBetween.StartTime.slice(11)}-${_val.SeeTimeBetween.EndTime.slice(11)}
    return `<div class="doctor-group item-group">\
        <div class="cell-item theme-tinge-br-color">\
            <div class="vertical-middle">\
                <img class="img-circle theme-tinge-br-color-1" src="http://201.201.201.34:1111/doctimg/${_val.DoctName}.jpg">\
            </div>\
            <div class="vertical-middle">\
                <p class="theme-tinge-color m-b-s">\
                    <span class="font-28">${_val.DoctName}</span>&nbsp;&nbsp;\
                </p>\
                <p>\
                    <span class="name">就诊日期</span>\
                    <span class="value">：${_val.ExParams.RegDate} </span>\
                </p>\
            </div>\
            <div class="vertical-middle">\
                <div class="btn btn-shadow btn-sm gradual-theme btn-radius btn-register">取号</div>\
            </div>\
        </div>\
    </div>`
};

//展示单个医生信息
function pleaseConfirmThePaymentOnline(){
	var BackPrevPage = showAllRegisterDoctOnline;
	console.log(CardInfo);
	IsChildPage(true);  
	$.ConfirmHandleInformation({
	    s: 60,
	    title:'请确认您的预约信息',
	    info: {
	        imgSrc: 'http://201.201.201.34:1111/doctimg/'+CardInfo.Doct.DoctName+'.jpg',
	        doctorName: CardInfo.Doct.DoctName,
	        bodyItem: [{
	                name: '就诊时间：',
	                value: `<p>${CardInfo.Doct.ExParams.RegDate}</p>`,
	            }, {
	                name: '门&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;诊：',
	                value: CardInfo.Dept.DeptName,
	            }, {
	                name: '就&nbsp;&nbsp;诊&nbsp;&nbsp;人：',
	                value: CardInfo.PatientInfo.PatientName
	            }]
	    },
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
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
	    btnBack: function($ele, ret) {
	        console.log($ele, ret)
        	PAYSTATUES = true;
        	onlineReporting();    // 线上报道
	    },
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	    },
	});
}

// 线上报道
function onlineReporting(){
	var randomNumberself = Math.random().toString().substr(2,8); 
	$.extend(CardInfo,{"SerialNumber": $.GetSerial() + randomNumberself});
	// $.loading(false,'加载中...');
	AJAX.Business.OutLineRegCheckIn( JSON.stringify(CardInfo), function(ret){
		// $.layerClose();
		console.log(ret);
	} ,function(ret){
		// $.layerClose();
		console.log(ret);
		if(ret.Code == '0'){	
			$.extend(CardInfo,{successInfo:ret});
			$.Writelog('线上取号成功');
			if(CardInfo.successInfo.TsrqTp != "" && CardInfo.successInfo.TsrqTp != undefined){
				$.layer({
					msg: `<img alt="加载图片破损" src="${CardInfo.successInfo.TsrqTp}"/>`,        
				    btn: ['确定'],                    
				    type: 1,                           
				    time: 15,                          
				    bulb: false,                       
				    title: '特别信息--请确认',                     
				    bulbSrc: 'assets/images/tip/bulb.png',     
				    endExecute: true,                          
				    yes: function() {                       
				        $.Writelog("特殊人群信息提示图片");
				    }
				})
			}
			successRegisterRegNo();
			rechargeSucceedOnline(CardInfo);
		}else{
			console.log(ret.Msg);
			$.layer({
		        msg: ret.Msg, 
		        btn: ['确认'],
		        type: 1,     
		        time: 6,
		        bulbSrc: 'assets/images/tip/bulb.png',
		        yes: function(){
		            LoginReserevationNumber();
		        }
		    });
		}
	} ,function(ret){
		// $.layerClose();
		console.log(ret);
		contentError();
	});
}


