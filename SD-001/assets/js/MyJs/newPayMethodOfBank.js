var newPayMthodOfBankPayInfo;
var timeLXpressed;

async function PosReadBankCard () {
	newPayMthodOfBankPayInfo = "";                   // 清除卡支付信息
	console.log(testcom);
	clearInterval(CheckCardTimer);                   // 清除循环查卡   
    if(ISBG == true){
        AcsSwitch.SetAcs('B', 4, 1);                 // 打卡读卡器灯  -闪烁   壁挂的银行灯插卡B 4
    }else{
        AcsSwitch.SetAcs('B', 2, 1);                 // 打卡读卡器灯  -闪烁   台式的银行灯插卡B 2
    };
    var registerprice = 0;
    if(pageType == 'DRGH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 挂号费
    }
    if(pageType == 'YYQH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 挂号费
    };
    if(pageType == 'ZZJF'){
        for(var i=0;i<CardInfo.RecipesInfo.length;i++){
            registerprice += Number( CardInfo.RecipesInfo[i].SelfAmt );   // 自费
        }
    }
    if(pageType == 'DYYW'){
        registerprice = Number(CardInfo.Amount);                          // 病历本费用
    }
    registerprice = registerprice.toFixed(2);                             // 交易金额保留2位小数
    console.log(registerprice);
 	console.log("POS:",POS);
 	console.log(typeof registerprice);

    POS.ReadCard("PosReadCard_Callback", "CRT310", testcom, registerprice);        // 回调方法,读卡器型号,端口号,交易金额
}

// 读卡回调
function PosReadCard_Callback(json){
	var BackPrevPage;
	var registerprice = 0;
	 if(pageType == 'DRGH'){
        BackPrevPage = choosePayMethodOnTheDay;
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 挂号费
    }
    if(pageType == 'YYQH'){
        BackPrevPage = choosePayMethods;
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 预约挂号费
    };
    if(pageType == 'ZZJF'){
        BackPrevPage = choosePayMethodSelf;
        for(var i=0;i<CardInfo.RecipesInfo.length;i++){
            registerprice += Number( CardInfo.RecipesInfo[i].SelfAmt );   // 自费
        }
    }
    if(pageType == 'DYYW'){
        BackPrevPage = printChoisePaymethods;
        registerprice = Number(CardInfo.Amount);                          // 病历本费用
    }
    registerprice = registerprice.toFixed(2);
    console.log(registerprice);

	var value = JSON.parse(json);
	if(value.Code == 0){
		console.log(value);	
		$.Writelog(value.Msg);
		newPayMthodOfBankPayInfo = value.PayInfo;
		var bankcardnumber = JSON.parse(newPayMthodOfBankPayInfo).CardNo;
		var strace = JSON.parse(newPayMthodOfBankPayInfo).sTrackNo;
		console.log(bankcardnumber);
		console.log(strace);
		$.Writelog("银行卡号："+bankcardnumber);
		$.Writelog("交易单号："+strace);

		// 输密码前调用pay接口在数据库生成一条记录
		var randomNumber = Math.random().toString().substr(2,8);      // 随机数
	    var paymethodss = 0;                                          // 0 表示未知
	    if(paymethods == 'bank'){   paymethodss = 1; };               // 银行
	    if(paymethods == 'social'){ paymethodss = 2; };               // 社保
	    console.log("ExParams:", JSON.parse(newPayMthodOfBankPayInfo).RefundPack );
	    RechargeAndPaymentInfo = {                                    // 下单参数  
	        "ZZJCertificate": { ID: ZZJInfomation.ZZJID },
	        "PayInfo":{
	            "PayMetHod" : paymethodss,                            
	            "Amount"    : registerprice,                          // ==> 支付金额             
	            "AccountID" : bankcardnumber,                     
	            "ID"        : null,
	            "PayUrl"    : "",
	            "TranNo"    : strace,
	 		    "ExParams"  : JSON.parse(newPayMthodOfBankPayInfo).RefundPack
	        },
	        "SerialNumber": $.GetSerial() + randomNumber         
	    };
	    console.log('下单参数', RechargeAndPaymentInfo );
	    $.extend(CardInfo,RechargeAndPaymentInfo);
	    console.log("Pay接口参数", CardInfo);
	    AJAX.Business.Pay( JSON.stringify(CardInfo), function(ret){
            console.log(ret)
        }, function(value){
            if(value.Code == 0){
            	console.log("Pay接口Code",value.Code);
                var PayID = value.PayID;
                $.Writelog('成功获取PayID:'+PayID);
                $.extend(CardInfo,{"PayID": PayID});
                $.extend(RechargeAndPaymentInfo.PayInfo,{ID:PayID});
                $.extend(RechargeAndPaymentInfo,{"PayID": PayID});

                newOpeninputKeyPage();       // 输入密码                     
            }else{
                console.log('下单失败,请重试');
                $.Writelog('pay下单失败'+ret.Msg);
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
                        BackPrevPage();
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
	}else{
		console.log(value.Msg);
		$.Writelog("new读卡失败:"+value.Msg);
		if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        POS.Stop().then(function(value){
        	var value = JSON.parse(value);
        	console.log(value);
        	POS.OutCard("CRT310",testcom);            // 弹卡
        }, function(error){
        	console.log(error);
        });
        $.layer({
            msg: value.Msg,
            btn:['确认'],
            tme:6,
            type:1,
            endExecute: true, 
            yes:function(){
                // BackPrevPage();
            }
        })         
	}
}

function newOpeninputKeyPage(){
	IsChildPage(true);
	$(PAGE).html(socialOrbankinputKeyText);
	var ele = '#socialOrbankinputKey';                          
    var placeholder = '请输入银行卡或社保卡密码';
    if(paymethods == 'bank'){
        placeholder = '请输入银行卡密码';
    }
    if(paymethods == 'social'){
        placeholder = '请输入社保卡密码';
    }
	$(ele + ' .form-control').attr({
		type: 'password',
		placeholder: placeholder,
	});

	var BackPrevPage;  
    if(pageType == 'DRGH'){
        BackPrevPage = choosePayMethodOnTheDay;
    }
    if(pageType == 'YYQH'){
        BackPrevPage = choosePayMethods;
    };
    if(pageType == 'ZZJF'){
        BackPrevPage = choosePayMethodSelf;
    }
    if(pageType == 'DYYW'){
        BackPrevPage = printChoisePaymethods;
    }
    $.BackInterval(90,BackPrevPage);     // 倒计时 定时返回     

    AcsSwitch.SetAcs('C', 1, 1);
    PosGetPin();

    /* 退卡并返回主界面 - 循环查卡 */
	$(ele + ' .handle.handle-exit').click(function(){
        clearInterval( timeLXpressed );
        $.layerClose();
        AcsSwitch.SetAcs('C', 1, 0);            
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);        
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };  
        POS.Stop().then(function(value){
        	console.log(value);
        	POS.OutCard("CRT310",testcom);        // 弹卡
        },function(error){
        	console.log(error);
        });
        $.Writelog('------退卡-----');  
	 	$.ExitCardClearInfo();
        if(paymethods == 'social'){
            $.intoOrExitCard(1, 5);         // 退卡提示  
        }
        if(paymethods == 'bank'){
            $.intoOrExitCard(0, 5);         // 退卡提示  
        }    
	});
	// 返回上一级
	$(ele + ' .handle-group .handle-prev').one('click', function() {
        clearInterval( timeLXpressed );
        $.layerClose();
        AcsSwitch.SetAcs('C', 1, 0);        // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        POS.Stop().then(function(value){
        	console.log(value);
        	POS.OutCard("CRT310",testcom);  // 弹卡
        },function(error){
        	console.log(error);
        })

		$.TheKeySound();
		$.Writelog('------返回上一级-----');
        BackPrevPage();
	});
	// 返回首页
	$(ele + ' .handle-group .handle-home').one('click', function() {
        clearInterval( timeLXpressed );
        $.layerClose();
        AcsSwitch.SetAcs('C', 1, 0);        // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        }; 
        POS.Stop().then(function(value){
        	console.log(value);
        	POS.OutCard("CRT310",testcom);  // 弹卡
        },function(error){
        	console.log(error);
        })

        if(pageType == 'DYYW'){
            MachineGMBL.CloseDYJ("STT420");  // 关闭病历机
        }
		$.TheKeySound();
		$.Writelog('------返回首页-----');
		ShowMainMenu();
	});
	
}

async function PosGetPin(){
	var payinfo = newPayMthodOfBankPayInfo;
	POS.GetPin("PosGetPin_Callback", payinfo);
}

// 输入密码回调
function PosGetPin_Callback(json){
	var ele = '#socialOrbankinputKey';
    var BackPrevPage;  
    if(pageType == 'DRGH'){
        BackPrevPage = choosePayMethodOnTheDay;
    }
    if(pageType == 'YYQH'){
        BackPrevPage = choosePayMethods;
    };
    if(pageType == 'ZZJF'){
        BackPrevPage = choosePayMethodSelf;
    }
    if(pageType == 'DYYW'){
        BackPrevPage = printChoisePaymethods;
    }
    var $input = $(ele + ' input.form-control');  
	// 这里返回一个新的PayInfo,提取出来,替换掉之前的
	var value = JSON.parse(json);
	if(value.Code == 0){                            // 按确认键
		console.log(value);	
		$.Writelog("---确认键---");
		$.Writelog(value.Msg);
		newPayMthodOfBankPayInfo = value.PayInfo;   // 确认后的支付信息
		console.log("银行支付Trace："+ JSON.parse(newPayMthodOfBankPayInfo).sTrackNo);
        RechargeAndPaymentInfo.PayInfo.TranNo = JSON.parse(newPayMthodOfBankPayInfo).sTrackNo;
		PosPaying();	
	}else if(value.Code == 1){                      // 获取密码键值 包括更正
		console.log(value.Msg);
		$.Writelog(value.Msg);
		$input.val( value.Msg );
	}else if(value.Code == -1){                     // 取消
		$.Writelog("---取消键---");
		console.log(value);
        AcsSwitch.SetAcs('C', 1, 0);                // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        }; 
		POS.Stop().then(function(value){            // 中断银联操作
            console.log(value);
            POS.OutCard("CRT310",testcom);          // 弹卡
        }, function(error){
            console.log(error);
        }); 
        $.layer({
            msg: '您取消了交易，6秒后返回上一页', 
            btn: ['确定'],
            type: 1,     
            time: 6,
            bulbSrc: 'assets/images/tip/bulb.png',
            yes:function(){
                BackPrevPage();
            }
        })
	}else{
		console.log(value);
	}
}

async function PosPaying(){
	$.Writelog("银行交易返回");
	var payinfo = newPayMthodOfBankPayInfo;
	$.loading("加载中...");
	POS.Pay("PosPaying_Callback", payinfo);
}

function PosPaying_Callback(json){
	$.layerClose();
	var BackPrevPage;  
    if(pageType == 'DRGH'){
        BackPrevPage = choosePayMethodOnTheDay;
    }
    if(pageType == 'YYQH'){
        BackPrevPage = choosePayMethods;
    };
    if(pageType == 'ZZJF'){
        BackPrevPage = choosePayMethodSelf;
    }
    if(pageType == 'DYYW'){
        BackPrevPage = printChoisePaymethods;
    }
	var value = JSON.parse(json);
	console.log(value);
	// 需要注意的是:交易的时候,返回的Code表示通信成功,不代表交易成功
	// 通过判断 PayResult 节点中的返回码,来识别是否交易成功
	if(value.Code == 0){                  // 通讯成功
		$.Writelog("支付交易通讯成功"+value.Msg);
		if(value.PayResult == "00"){
			newPayMthodOfBankPayInfo = value.PayInfo;
			console.log("支付成功",newPayMthodOfBankPayInfo);
			$.Writelog('银行支付Trace：'+ JSON.parse(newPayMthodOfBankPayInfo).sTrackNo);
            $.extend(RechargeAndPaymentInfo, {'Resultposdosales' : newPayMthodOfBankPayInfo});
            $.extend(RechargeAndPaymentInfo, {"Trace"    : JSON.parse(newPayMthodOfBankPayInfo).sTrackNo});
            $.extend(RechargeAndPaymentInfo, {"TranceID" : JSON.parse(newPayMthodOfBankPayInfo).sTrackNo});
            RechargeAndPaymentInfo.PayInfo.TranNo   = JSON.parse(newPayMthodOfBankPayInfo).sTrackNo;
            RechargeAndPaymentInfo.PayInfo.ExParams = JSON.parse(newPayMthodOfBankPayInfo).RefundPack;
            $.extend(CardInfo,RechargeAndPaymentInfo);
            console.log(CardInfo);
			PosbankSuccessAndPaying();
		}else{
			console.log(value.PayResult);
			$.Writelog(value.PayResult);
			var msg = "交易失败，请退出重试"
			for(var i=0;i<bankData.length;i++){
				if(value.PayResult == bankData[i].Code ){
					msg = bankData[i].Msg;
				}
			}
			$.layer({
                msg: msg,        
                btn: ['确定'],                    
                type: 1,                           
                time: 6,                          
                bulb: false,                       
                title: '确认',                     
                bulbSrc: 'assets/images/tip/bulb.png',     
                endExecute: true,                          
                yes: function() {  
                	$.Writelog(msg);
                	POS.Stop().then(function(value){
                		console.log(value);
                		POS.OutCard("CRT310",testcom);                    // 弹卡    
                	}, function(error){
                		console.log(error);
                	});                                               
                    BackPrevPage();
                }
            });
		}
	}else{                                // 通讯失败
		console.log("缴费通讯失败");
		$.Writelog("支付交易通讯失败:"+value.Msg);
		$.layer({
            msg: value.Msg,        
            btn: ['确定'],                    
            type: 1,                           
            time: 6,                          
            bulb: false,                       
            title: '确认',                     
            bulbSrc: 'assets/images/tip/bulb.png',     
            endExecute: true,                          
            yes: function() {  
            	POS.Stop().then(function(value){
            		console.log(value);
            		POS.OutCard("CRT310",testcom);                    // 弹卡    
            	}, function(error){
            		console.log(error);
            	});                                               
                BackPrevPage();
            }
        });
	}
}

/*-------------退费退费退费-------------------*/
async function PosRefund(){              
	var payinfo = newPayMthodOfBankPayInfo;
	console.log(newPayMthodOfBankPayInfo);
    $.Writelog("new银行卡冲正："+JSON.parse(newPayMthodOfBankPayInfo).RefundPack);
	POS.Refund("PosRefund_Callback", payinfo);
}

function PosRefund_Callback(json){
	var value = JSON.parse(json);
	console.log(value);
	console.log(RechargeAndPaymentInfo);
	console.log(CardInfo);
	if(value.Code == 0){
		$.Writelog("冲正通讯成功");
		if(value.PayResult == "00"){
			$.Writelog("冲正退款成功");
			var business_type;
		    if(pageType == "YYQH"){
		        business_type = 2;
		    }
		    if(pageType == 'DRGH'){
		        business_type = 0;
		    }
		    if(pageType == 'ZZJF'){
		        business_type = 3;
		    }
		    if(pageType == 'DYYW'){
		        business_type = 4;
		    }   
			var data = {
                'PayID'           : RechargeAndPaymentInfo.PayID,
                'TranceID'        : RechargeAndPaymentInfo.Trace,
                'business_success': false,
                'pay_success'     : true,
                'bussiness_type'  : business_type,
                "retfund"         : true,                             // 10.16
            }
            $.ajax({           // 更新退款状态
                url:'/api/Business/UpdatePaylog',
                data: JSON.stringify(data),
                type:'post',
                success:function(ret){
                    var ret = JSON.parse(ret);
                    console.log(ret);
                    if(ret.Code == 0){
                        $.Writelog("更新退款状态成功");
                    }else{
                        $.Writelog("更新退款状态失败");
                    }
                }
            })
		}
	}else{
		console.log("冲正通讯失败");
		$.Writelog("支付交易通讯失败"+value.Msg);
        CancelRegisterFailebank(value.Msg);
	}
}

// 银行卡支付 消费成功后
function PosbankSuccessAndPaying(){
	IsChildPage(true);
	console.log(RechargeAndPaymentInfo);
	console.log(CardInfo);
	var BackPrevPage;
	if(pageType == 'DRGH'){      // 当日挂号
		BackPrevPage = judgingLogin;
	}
	if(pageType == 'YYQH'){      // 预约取号
		BackPrevPage = LoginReserevationNumber;
	}
	if(pageType == 'ZZJF'){      // 自助缴费
		BackPrevPage = judgingLoginSelf;
	}
    if(pageType == 'DYYW'){      // 打印业务
        BackPrevPage = judgingLoginPrinter;
    }
    $.Writelog( pageType + '交易:' + CardInfo.Trace);
	$.HandleCondition({
	    s: 45,
	    type: 1,
	    title: '支付成功，交易及打印凭条中，请稍后',
	    message: '支付成功，交易及打印凭条中，请稍后',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:true,
	    btns: [null, null],
	    timeBack: function() {
	        console.log('倒计时结束');
            $.Writelog("倒计时结束");
            $.layerClose();
	        BackPrevPage();
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	    },
	    callBack: function($ele, $msg) {
	        console.log($ele, $msg);
            if(ISBG == true){
                AcsSwitch.SetAcs('B', 4, 0);                
            }else{
                AcsSwitch.SetAcs('B', 2, 0);                
            }; 
            AcsSwitch.SetAcs('C', 1, 0);             // 密码键盘灯
            POS.Stop().then(function(value){
        		var value = JSON.parse(value);
        		console.log(value);
	        	POS.OutCard("CRT310",testcom);       // 弹卡
	        }, function(error){
	        	console.log(error);
	        });
            var business_type;
            if(pageType == "YYQH"){
                business_type = 2;
            }
            if(pageType == 'DRGH'){
                business_type = 0;
            }
            if(pageType == 'ZZJF'){
                business_type = 3;
            }
            if(pageType == 'DYYW'){
                business_type = 4;
            }
            console.log("第一次更新：",CardInfo.PayInfo.ExParams);
            //缴费成功 更新支付状态
            var data = {
                "PayID"    : CardInfo.PayID,
                "TranceID" : CardInfo.Trace==""?CardInfo.Trace:CardInfo.TranceID,
                "business_success": false,
                "pay_success"     : true,
                "business_type"   : business_type,
                "retfund"         : false,
                "tag"             : CardInfo.PayInfo.ExParams
            }
            console.log("更新支付传参uptadepaylog",data);
            AJAX.Business.UpdatePaylog(JSON.stringify(data), function(ret){
                console.log(ret);
            }, function(value){
                console.log("更新支付后交易信息",value);
                if(value.Code == 0){
                    $.Writelog("支付成功后更新交易支付记录成功");
                    //缴费成功 后调用挂号取号缴费等接口
                    setTimeout(function(){
                        if(pageType == 'YYQH'){
                            $.Writelog('预约取号');
                            PospayOverAndRegisterRegNoBank();          // 取号  SaveAppointment
                        }
                        if(pageType == 'ZZJF'){
                            $.Writelog('处方缴费');
                            PospayOverAndRegisterSelfbank();           // 处方  PayRecipes
                        }
                        if(pageType == 'DRGH'){
                            $.Writelog('当日挂号');
                            PospayOverAndRegisterBank();               // 挂号  Register
                        }
                        if(pageType == 'DYYW'){ 
                            $.Writelog('病历本打印'); 
                            PospayOverAndPrinterbank();                // 病历本打印  Printer
                        }
                    },500);        
                }else{
                    console.log(value.Msg);
                    $.Writelog("支付成功后更新交易支付记录失败");
                    PoserrorAndBackMoneyBank(value.Msg);
                }
            }, function(error){
                console.log(error);
                PoserrorAndBackMoneyBank();
            })
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        // ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        // BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        // $.ExitCard();
	    },
	});
}

//获取payid 成功 后调用挂号接口  -- 挂号
function PospayOverAndRegisterBank(){
    console.log(CardInfo);
    // $.loading(false,'正在挂号中...');
    AJAX.Business.Register( JSON.stringify(CardInfo), function(ret){
    	$.layerClose();
    	console.log(ret);
    }, function(ret){
    	// $.layerClose();
    	if(ret.Code == '0'){
			console.log(ret);
			console.log('挂号成功，请按时就诊！');
            $.Writelog('挂号成功，请按时就诊！');
			$.extend(CardInfo,{'successRegister':ret});
			PAYSTATUES = true;                // 打印状态设置 ==》 ture 可以打印
			PossuccessRegisterOnthedayBank();
            // rechargeSucceed(CardInfo);
		}else{
			console.log('挂号失败');
            $.Writelog('挂号失败,返回Code'+ret.Code);
			PoserrorAndBackMoneyBank(ret.Msg);
		}
    }, function(ret){
    	// $.layerClose();
    	console.log('挂号失败'); 
        $.Writelog('网络异常挂号失败');
        $.layer({
            msg: '网络异常挂号失败，如您有退款或其他疑问请联系客服',        
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
};

// 获取payid 成功 后调用取号接口  -- 取号
function PospayOverAndRegisterRegNoBank(){
    console.log(CardInfo);
    // $.loading(false,'取号中...');
    AJAX.Business.SaveAppointment( JSON.stringify(CardInfo), function(ret){
        $.layerClose();
        console.log(ret);
    }, function(ret){
        // $.layerClose();
        // console.log(ret);
        if(ret.Code == '0'){
            console.log('取号成功，请按时就诊！');
            $.Writelog('取号成功，请按时就诊！');
            $.extend(CardInfo,{'successRegister':ret});
            PAYSTATUES = true;              // 打印状态设置
            PossuccessRegisterOnthedayBank();  
            // rechargeSucceed(CardInfo); 
        }else{
            console.log(ret.Msg);
            $.Writelog('取号失败,返回CODE'+ret.Code);
            $.Writelog(ret.Msg);
            $.Speak('取号失败,返回Code'+ret.Code);
            PoserrorAndBackMoneyBank(ret.Msg);
        }
    }, function(ret){
        // $.layerClose();
        console.log('取号失败');
        $.Writelog('网络异常取号失败');
        $.layer({
            msg: '网络异常取号失败，退款请联系客服或者拨打屏幕上方联系电话',        
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
};

// 获取payid 成功 后调用处方接口  -- 处方
function PospayOverAndRegisterSelfbank(){
    console.log(CardInfo);
    // $.loading(false,'加载中...');
    AJAX.Business.PayRecipes(JSON.stringify(CardInfo), function(ret){
        $.layerClose();
        console.log(ret);
    }, function(ret){
        // $.layerClose();
        if(ret.Code == '0'){
            console.log('处方缴费成功，请按时就诊！');
            console.log(ret);
            $.Writelog('处方缴费成功，打印凭条');
            $.extend(CardInfo,{'successRegister':ret});
            PAYSTATUES = true;                // 打印状态设置
            PossuccessRegisterSelf();
            rechargeSucceedPrint(CardInfo);
        }else{
            console.log('处方缴费失败');
            $.Writelog('处方缴费失败,返回code'+ret.Code);
            PoserrorAndBackMoneyBank(ret.Msg);
        }
    }, function(ret){
        // $.layerClose();
        console.log('处方缴费失败');
        $.Writelog('网络异常处方缴费失败');
        $.layer({
            msg: '网络异常处方缴费失败，退款请联系客服或者拨打屏幕上方联系电话',        
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
};

// 获取payid 成功 后调用存病历本购买信息  -- 病历本打印
function PospayOverAndPrinterbank(){
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
                $.Writelog('购买病历本GetSaveBlb存储成功');
                PAYSTATUES = true;                      // 打印状态设置
                $.Writelog(ret.Msg);
                blbbuyandprint();                       // 打印病历本
            }else{
                console.log(ret.Msg);
                $.Writelog('购买病历本GetSaveBlb存储失败,返回Code'+ret.Code);
                $.Writelog(ret.Msg);
                MachineGMBL.CloseDYJ("STT420");
                PoserrorAndBackMoneyBank(ret.Msg)
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
}

// 挂号成功 - 取号成功
function PossuccessRegisterOnthedayBank(){
    var msg,bussiness_type;
    if(pageType == "YYQH"){
        msg = '取号成功，请按时就诊！';
        business_type = 2;
    }
    if(pageType == 'DRGH'){
        msg = '挂号成功，请按时就诊！';
        business_type = 0;
    }
	IsChildPage(true);
	$.HandleCondition({
	    s: 12,
	    type: 1,
	    title: msg,
	    message: msg,
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
	        rechargeSucceed(CardInfo);               // 打印凭条

	        console.log("第二次更新",newPayMthodOfBankPayInfo);
            var data = {
                "PayID"    : CardInfo.PayID,
                "TranceID" : CardInfo.Trace==""?CardInfo.Trace:CardInfo.TranceID,
                "business_success": true,
                "pay_success"     : true,
                "business_type"   : business_type,
                "retfund"         : false,
                "tag"             : CardInfo.PayInfo.ExParams
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
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCard();
	    },
	});
}

// 挂号失败 退款
function PoserrorAndBackMoneyBank(msg){
	IsChildPage(true);
	var BackPrevPage;
	if(pageType == 'DRGH'){      // 当日挂号
		BackPrevPage = judgingLogin;
	}
	if(pageType == 'YYQH'){      // 预约取号
		BackPrevPage = LoginReserevationNumber;
	}
	if(pageType == 'ZZJF'){      // 自助缴费
		BackPrevPage = judgingLoginSelf;
	}
	if(pageType == 'DYYW'){      // 病历本打印
        BackPrevPage = judgingLoginPrinter;
    }
	$.HandleCondition({
	    s: 18,
	    type: 1,
	    title: msg?msg:'交易失败,退款将在1到3个工作日内到账',
	    message: msg?msg+',退费中':'交易失败,退款将在1到3个工作日内到账',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:false,
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
            
            PosRefund();
       
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

// 支付成功 
function PossuccessRegisterSelf(){
	IsChildPage(true);
	$.HandleCondition({
	    s: 15,
	    type: 1,
	    title:'打印成功，请取走您的缴费凭条！',
	    message: '打印成功，请取走您的缴费凭条！',
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
	    	$.layerClose();
	        console.log($ele, $msg);
	        var data = {
        		"PayID"    : CardInfo.PayID,
        		"TranceID" : CardInfo.PayInfo.TranNo==""?CardInfo.Trace:CardInfo.PayInfo.TranNo,
        		"business_success": true,
        		"pay_success"     : true,
        		"business_type"   : 3,
        		"retfund"         : false,
                "tag"             : CardInfo.PayInfo.ExParams
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



















var bankData = [
	{
		"Code" : "00",
		"Msg"  : "交易成功"
	}, {
		"Code" : "01",
		"Msg"  : "查发卡行交易失败，请联系发卡行"
	}, {
		"Code" : "03",
		"Msg"  : "无效商户，商户需在银行或中心登记"
	}, {
		"Code" : "12",
		"Msg"  : "无效交易，发卡行不支持的交易"
	}, {
		"Code" : "13",
		"Msg"  : "无效金额，金额为0或交易金额超限"
	}, {
		"Code" : "14",
		"Msg"  : "无效卡号或未在中心登记，请联系发卡行"
	}, {
		"Code" : "20",
		"Msg"  : "无效应答交易失败，请联系发卡行"
	}, {
		"Code" : "38",
		"Msg"  : "超过允许的PIN密码错误次数超限"
	}, {
		"Code" : "41",
		"Msg"  : "挂失的卡"
	}, {
		"Code" : "51",
		"Msg"  : "账户内余额不足，请查询"
	}, {
		"Code" : "53",
		"Msg"  : "无此储蓄账户，请联系发卡行"
	}, {
		"Code" : "54",
		"Msg"  : "过期的卡，请联系发卡行"
	}, {
		"Code" : "55",
		"Msg"  : "输入密码错误，请重试"
	}, {
        "Code" : "57",
        "Msg"  : "不允许持卡人进行的交易，交易失败，请联系发卡行"
    }, {
		"Code" : "62",
		"Msg"  : "受限制的卡，交易失败请联系发卡行"
	}, {
		"Code" : "75",
		"Msg"  : "允许的输入PIN次数超限，密码错误次数超限"
	}, {
		"Code" : "77",
		"Msg"  : "需要向网络中心签到，POS批次与网络中心不一致"
	}, {
		"Code" : "97",
		"Msg"  : "POS终端号未在银行登记,请联系收单行或者银联"
	}, {
		"Code" : "99",
		"Msg"  : "PIN格式错误"
	}, {
		"Code" : "A0",
		"Msg"  : "MAC校验错，请重新签到"
	}
]