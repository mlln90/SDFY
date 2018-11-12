// CardInfo = {
//     "ZZJCertificate": { ID: ZZJInfomation.ZZJID },
//     "CardInfo":{
//         "CardNo": '0090020787',
//         //0:医院的卡 1:区域卡 2:社保卡 5:身份证 7:门诊号
//         "CardType": 7
//     },
//     'PatientInfo':{
//         "PatientName": "患者",
//         "PatientID": "2884734",
//         "AccountID": "",
//         "IDNo": "440681198708100613",
//         "IDType": -1,
//         "PatientType": 0,
//         "Birthday": "1987-08-10",
//         "Mobile": "13110432108",
//         "Gender": 1,
//         "Address": "地球",
//         "Nation": "",
//         "Balance": null,
//         "Profession": ""
//     }
// }


var timeLXpressed; 
/*-------------------------------------------------*/
function userInfoToCard(){	
	// 感应身份证信息 IdentityInfo
    IdentityCreatSucceedCallBack = userxIndent;   
    OpenIdentityReader();
    // 打开扫条码
    OpenBarCode(userxSaoma);	
}

function userxIndent(){
    console.log(pageType);
	console.log(IdentityInfo);
	var idcard = IdentityInfo.IDNo;
	if(idcard != null || ident !='' || ident != undefined){
		QRScan.Close2();
        // 根据身份证去查询是否有注册卡
        var userID = {"ZZJCertificate":{"ID":ZZJInfomation.ZZJID},"CardInfo":{"CardNo":idcard,"CardType":5}};
        AJAX.Business.QueryPatientInfo(JSON.stringify(userID),function(ret){
            // console.log(ret);
        },function(ret){
            if(ret.Code == '0'){
                if(ret.PatientInfo.IDNo == ''){
                    ret.PatientInfo.IDNo = idcard;
                }
                CardInfo = {
                    "ZZJCertificate"  : { ID: ZZJInfomation.ZZJID },
                    "PatientInfo": {
                        'PatientName' : ret.PatientInfo.PatientName,
                        'PatientID'   : ret.PatientInfo.PatientID,
                        'AccountID'   : ret.PatientInfo.AccountID,
                        'IDNo'        : ret.PatientInfo.IDNo,
                        'IDType'      : ret.PatientInfo.IDType,
                        'PatientType' : ret.PatientInfo.PatientType,
                        'Birthday'    : IdentityInfo.DOB,
                        'Mobile'      : ret.PatientInfo.Mobile,
                        'Gender'      : ret.PatientInfo.Gender,
                        'Address'     : ret.PatientInfo.Address,
                        'Nation'      : ret.PatientInfo.Nation,
                        'Balance'     : IdentityInfo.Balance,
                        'Profession'  : ret.PatientInfo.Profession
                    },
                    'CardInfo'        : {
                        'CardNo'      : ret.CardInfo.CardNo,
                        'CardType'    : 5
                    }
                };
                console.log(CardInfo);
                $.Writelog('身份证登录：patientID'+CardInfo.PatientInfo.PatientID);
                $.Writelog('姓名:'+ CardInfo.PatientInfo.PatientName);
                $.Writelog('身份证号:'+ CardInfo.PatientInfo.IDNo);
                $.Writelog('病历号:'+ CardInfo.CardInfo.CardNo);
                if( pageType == 'DRGH' ){          // 当日挂号
                    $.extend(CardInfo,{RegType: 2});
                    judgingLogin();
                }
                if(pageType == 'DYYW'){           // 打印业务
                    judgingLoginPrinter();
                }
                if(pageType == 'MZYY'){           // 门诊预约
                    $.extend(CardInfo,{RegType: 1});
                    judgingLoginYuyue();
                }
                if(pageType == 'YYQH'){           // 预约取号
                    LoginReserevationNumber();
                }
                if(pageType == 'ZZJF'){           // 自助缴费
                    judgingLoginSelf();
                }
            }else{
                console.log(ret.Msg);
                $.Writelog(ret.Msg);
                var msg = '您没有妇幼医院的病历号，请前往注册';
                $.layer({
                    msg: msg,                          // msg 提示信息
                    btn: ['确定'],                     // btn 按钮 - 数组 （最多两个）
                    type: 1,                           // type 类型 [0, 1]
                    time: 10,                          // time 倒计时时间
                    bulb: false,                       // bulb 小灯泡是否显示
                    title: '确认',                     // title 提示名称
                    bulbSrc: 'assets/images/tip/bulb.png',     // bulbSrc 灯泡图片路径
                    endExecute: true,                          // endExecute 定时时间结束后是否执行确认函数 默认 true
                    yes: function() {                          // yes 确认按钮回调
                        console.log('您没有妇幼医院的bing号，请前往注册');
                        ShowMainMenu();
                    }
                })
            }
        }, function(ret){
            console.log(ret);
            contentError();
        });
	}else{
        $.Speak('查询用户信息失败');
        ShowMainMenu();
    }
}

function userxSaoma(data){
	var ascArr=JSON.parse(data);
    // console.log(ascArr);
    $.Writelog(pageType);
	QRScan.Close2();              // 关闭条码扫码器
	CloseIdentityReader();        // 关闭身份证阅读器
    let newArr = [];
    if(ascArr[0] == 65){
        newArr.push("A");
        for(let i=1;i<ascArr.length;i++){
            if(ascArr[i] == 13){
                break;
            }else{
                newArr.push(parseInt(ascArr[i]) - 0x30);
            }
        }
    }else if(ascArr[0] == 84){
        newArr.push("T");
        for(let i=1;i<ascArr.length;i++){
            if(ascArr[i] == 13){
                break;
            }else{
                newArr.push(parseInt(ascArr[i]) - 0x30);
            }
        }
    }else{
        for(let i=0;i<ascArr.length;i++){
            if(ascArr[i] == 13){
                break;
            }else{
                newArr.push(parseInt(ascArr[i]) - 0x30);
            }
        } 
    }
    console.log(newArr);
    var str='';
    for(var i=0; i<newArr.length; i++){
        str += String( newArr[i] );
    }
    console.log(str);
	
	if( str != "" && str.length == 10){
        CardInfo = {             // 卡信息
            "ZZJCertificate": { ID: ZZJInfomation.ZZJID },
            "CardInfo":{
                "CardNo": str,                          
                "CardType": 7    // 0:医院的卡 1:区域卡 2:社保卡 5:身份证 7:病历号
            }
        };
        $.loading(false,'正在加载中...');   // 根据卡号查询患者信息
        AJAX.Business.QueryPatientInfo( JSON.stringify(CardInfo), function(ret){
            $.layerClose();
            // console.log(ret);
        }, function(ret){
            $.layerClose();
            // console.log(ret);
            if(ret.Code == '0'){  
                var PatientInfo = ret.PatientInfo;  
                $.extend(CardInfo,{"PatientInfo":PatientInfo});
                $.Writelog('姓名:'+CardInfo.PatientInfo.PatientName);
                $.Writelog('扫码patientID:'+CardInfo.PatientInfo.PatientID);
                $.Writelog('身份证号:'+CardInfo.PatientInfo.IDNo);
                $.Writelog('病历号:'+ CardInfo.CardInfo.CardNo);
                
                if(PatientInfo.IDNo != ''){            // 判断身份证号是否为空                   
                    if( pageType == 'DRGH' ){          // 当日挂号
                        $.extend(CardInfo,{RegType: 2});
                        judgingLogin();
                    }
                    if(pageType == 'DYYW'){           // 打印业务
                        judgingLoginPrinter();
                    }
                    if(pageType == 'MZYY'){           // 门诊预约
                        $.extend(CardInfo,{RegType: 1});
                        judgingLoginYuyue();
                    }
                    if(pageType == 'YYQH'){           // 预约取号
                        LoginReserevationNumber();
                    }
                    if(pageType == 'ZZJF'){           // 自我缴费
                        judgingLoginSelf();
                    }
                }else{                 
                    $.layer({
                        msg: '您的候诊号为临时号码，是否补录信息？',  // msg 提示信息
                        btn: ['跳过','确定'],                         // btn 按钮 - 数组 （最多两个）
                        type: 1,                                      // type 类型 [0, 1]
                        time: 15,                                     // time 倒计时时间
                        bulb: false,                                  // bulb 小灯泡是否显示
                        title: '确认',                                // title 提示名称
                        bulbSrc: 'assets/images/tip/bulb.png',        // bulbSrc 灯泡图片路径
                        endExecute: true,                             // endExecute 定时时间结束后是否执行确认函数 默认 true
                        yes: function() {                             // yes 确认按钮回调
                            console.log('补录');
                            buluIdcardInfomation();
                        },cancel:function(){
                            console.log('跳过');
                            if( pageType == 'DRGH' ){                 // 当日挂号
                                $.extend(CardInfo,{RegType: 2});
                                judgingLogin();
                            }
                            if(pageType == 'DYYW'){                   // 打印业务
                                judgingLoginPrinter();
                            }
                            if(pageType == 'MZYY'){                   // 门诊预约
                                $.extend(CardInfo,{RegType: 1});
                                judgingLoginYuyue();
                            }
                            if(pageType == 'YYQH'){                   // 预约取号
                                LoginReserevationNumber();
                            }
                            if(pageType == 'ZZJF'){                   // 自助缴费
                                judgingLoginSelf();
                            }
                        }
                    })
                }
            }else{
                // console.log('查询用户信息失败');
                $.Writelog("查询用户信息失败,但查无数据");
                var msg = "没有查到您的档案信息"
                contentError(msg);
            } 
        }, function(ret){
            console.log(ret);
            $.layerClose();
            contentError();
        });
    }else{
    	console.log(ascArr);
        $.Writelog("不是顺德妇幼保健院病历号");
		ShowMainMenu();
    }
};

// 输入病历号登录
function inputHpuZhenNo(){
    QRScan.Close2();                        // 关闭扫条码
    CloseIdentityReader();                  // 关闭身份感应
    IsChildPage(true);                      // 是否子级页面
    var BackPrevPage = ShowMainMenu;        
    $.ImportNumber({                        // 输入病历号登入
        s: 30,
        type: 3,
        title: '请输入您的病历号',
        titleStyle:{fontWeight:'bold'},
        timeBack: function() {
            console.log('倒计时结束');
            BackPrevPage();
        },
        btnBack: function($ele, val) {
            console.log($ele, val);
            var vals = $.trims(val);        // 去掉首位空格
            if( vals.length == 10 ){
                $.Writelog("手输病历号登录");
                $.Writelog(vals);
                CardInfo = {
                    "ZZJCertificate": { ID: ZZJInfomation.ZZJID },
                    "CardInfo":{
                        "CardNo": vals,                          
                        "CardType": 7       // 0:医院的卡 1:区域卡 2:社保卡 5:身份证 7:门诊号
                    }
                };
                console.log(CardInfo);
                $.loading(false,'正在加载中');   //根据卡号查询患者信息
                AJAX.Business.QueryPatientInfo( JSON.stringify(CardInfo), function(ret){
                    $.layerClose();
                    console.log(ret);
                }, function(ret){
                    $.layerClose();
                    console.log(ret);
                    if(ret.Code == '0'){  
                        var PatientInfo = ret.PatientInfo;  
                        $.extend(CardInfo,{PatientInfo:PatientInfo});
                        $.Writelog('姓名:'+CardInfo.PatientInfo.PatientName);
                        $.Writelog('扫码patientID:'+CardInfo.PatientInfo.PatientID);
                        $.Writelog('身份证号:'+CardInfo.PatientInfo.IDNo);
                        $.Writelog('病历号:'+ CardInfo.CardInfo.CardNo);
                        
                        if(PatientInfo.IDNo != ''){            // 判断身份证号是否为空                   
                            if( pageType == 'DRGH' ){          // 当日挂号
                                $.extend(CardInfo,{RegType: 2});
                                judgingLogin();
                            }
                            if(pageType == 'DYYW'){           // 打印业务
                                judgingLoginPrinter();
                            }
                            if(pageType == 'MZYY'){           // 门诊预约
                                $.extend(CardInfo,{RegType: 1});
                                judgingLoginYuyue();
                            }
                            if(pageType == 'YYQH'){           // 预约取号
                                LoginReserevationNumber();
                            }
                            if(pageType == 'ZZJF'){           // 自我缴费
                                judgingLoginSelf();
                            }
                        }else{                 
                            $.layer({
                                msg: '您的候诊号为临时号码，是否补录信息？',   // msg 提示信息
                                btn: ['跳过','确定'],                          // btn 按钮 - 数组 （最多两个）
                                type: 1,                                       // type 类型 [0, 1]
                                time: 15,                                      // time 倒计时时间
                                bulb: false,                                   // bulb 小灯泡是否显示
                                title: '确认',                                 // title 提示名称
                                bulbSrc: 'assets/images/tip/bulb.png',         // bulbSrc 灯泡图片路径
                                endExecute: true,                              // endExecute 定时时间结束后是否执行确认函数 默认 true
                                yes: function() {                              // yes 确认按钮回调
                                    $.Writelog("补录身份信息");
                                    buluIdcardInfomation();
                                },cancel:function(){
                                    $.Writelog("跳过补录身份信息");
                                    if( pageType == 'DRGH' ){          // 当日挂号
                                        $.extend(CardInfo,{RegType: 2});
                                        judgingLogin();
                                    }
                                    if(pageType == 'DYYW'){           // 打印业务
                                        judgingLoginPrinter();
                                    }
                                    if(pageType == 'MZYY'){           // 门诊预约
                                        $.extend(CardInfo,{RegType: 1});
                                        judgingLoginYuyue();
                                    }
                                    if(pageType == 'YYQH'){           // 预约取号
                                        LoginReserevationNumber();
                                    }
                                    if(pageType == 'ZZJF'){           // 自助缴费
                                        judgingLoginSelf();
                                    }
                                }
                            })
                        }
                    }else{
                        $.Writelog("查询用户信息成功，但查无数据");
                        console.log(ret.Msg);
                        var msg = "没有查到您的档案信息";
                        contentError(msg);
                    } 
                }, function(ret){
                    console.log(ret);
                    $.layerClose();
                    contentError();
                });
            }else{
                $.Speak('您输的病历号格式有误，请重输')
            }
        },
        homeBack: function($ele) {
            console.log($ele);
            ShowMainMenu();         // 返回首页
        },
        prevBack: function($ele) {
            console.log('上一页');
            BackPrevPage();
        },
        exitBack: function($ele) {
            console.log($ele);
            $.ExitCard();
        },
        callBack: function($ele) {
            // console.log($ele);
            $.Writelog("手输病历号登录");
        }
    }); 
}


/*-------------------------------------------------------------------*/

// 打开读卡器 查询状态 银行卡
function ReadCardInfoAndGetkeys(){
    clearInterval(CheckCardTimer);                   // 清除循环查卡   
    if(ISBG == true){
        AcsSwitch.SetAcs('B', 4, 1);                 // 打卡读卡器灯  -闪烁   壁挂的银行灯插卡B4
    }else{
        AcsSwitch.SetAcs('B', 2, 1);                 // 打卡读卡器灯  -闪烁   台式的银行灯插卡B2
    };
    var registerprice = 0;
    var BackPrevPage;
    if(pageType == 'DRGH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 挂号费
        BackPrevPage = choosePayMethodOnTheDay;
    }
    if(pageType == 'YYQH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 预约挂号费
        BackPrevPage = choosePayMethods;
    };
    if(pageType == 'ZZJF'){
        for(var i=0;i<CardInfo.RecipesInfo.length;i++){
            registerprice += Number( CardInfo.RecipesInfo[i].SelfAmt );   // 自费
        }
        BackPrevPage = choosePayMethodSelf;
    }
    if(pageType == 'DYYW'){
        registerprice = Number(CardInfo.Amount);                          // 病历本费用
        BackPrevPage = printChoisePaymethods;
    }
    registerprice = registerprice.toFixed(2);
    console.log(registerprice);
    var openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );    // 打开读卡器
    openDKQTExt.then(function(value){
        var openvalue = JSON.parse(value);
        console.log(openvalue);
        if(openvalue.Code == 0){
            console.log(openvalue.IntPrt);
            // //轮循查询是否有卡 （状态）
            var cardinfomations = MachineBGPOS.ReadCardDataOneTwo( JSON.stringify({'IntPrt' : openvalue.IntPrt}) ); 
            $.loading(false,'读卡中请稍后');
            cardinfomations.then(function(value){                                 // 读取卡信息
                $.layerClose();
                var getcardinfo = JSON.parse(value);
                console.log(getcardinfo);
                if(getcardinfo.Code == 0){
                    console.log(getcardinfo.msg);
                    intprt = getcardinfo.IntPrt;                                  //  == > 指针
                    $.Writelog("银行卡号:"+getcardinfo.msg);                      // 银行卡号
                    var randomNumber = Math.random().toString().substr(2,8);      // 随机数
                    var paymethodss = 0;                                          // 0 表示未知
                    if(paymethods == 'bank'){   paymethodss = 1; }
                    if(paymethods == 'social'){ paymethodss = 2; }
                    RechargeAndPaymentInfo = {                                    // 下单参数  
                        "ZZJCertificate": { ID: ZZJInfomation.ZZJID },
                        "PayInfo":{
                            "PayMetHod" : paymethodss,                            // 支付方式
                            "Amount"    : registerprice,                          // 支付金额
                            'AccountID' : getcardinfo.msg,
                            'ExParams'  : null,
                            'ID'        : null,
                            'PayUrl'    : '',
                            'TranNo'    : ''
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
                            var PayID = value.PayID;
                            $.Writelog('成功获取PayID:'+PayID);
                            $.extend(CardInfo,{"PayID": PayID});
                            $.extend(RechargeAndPaymentInfo.PayInfo,{ID:PayID});
                            $.extend(RechargeAndPaymentInfo,{"PayID": PayID});

                            inputSocialPasword();                                   // 查卡信息 ==> 输入密码
                        }else{
                            console.log('下单失败,请重试');
                            $.Writelog('下单失败,'+value.Msg);
                            $.layer({
                                msg: '下单失败，请重新下单',        
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
                    console.log(getcardinfo.msg);
                    if(ISBG == true){
                        AcsSwitch.SetAcs('B', 4, 0);                
                    }else{
                        AcsSwitch.SetAcs('B', 2, 0);                
                    };
                    MachineBGPOS.TL_EjectCard(); 
                    $.Writelog('等卡失败,'+ getcardinfo.msg);
                    $.layer({
                        msg: '等卡失败,返回重试',
                        btn:['确认'],
                        tme:6,
                        type:1,
                        yes:function(){
                            BackPrevPage();
                        }
                    });
                }
            } ,function(error){
                $.layerClose();
                console.log(error);
                if(ISBG == true){
                    AcsSwitch.SetAcs('B', 4, 0);                
                }else{
                    AcsSwitch.SetAcs('B', 2, 0);                
                };
                MachineBGPOS.TL_EjectCard(); 
                $.Writelog('读卡错误');
                $.layer({
                    msg: '读取卡号错误,返回重试',
                    btn:['确认'],
                    tme:6,
                    type:1,
                    yes:function(){
                        BackPrevPage();
                    }
                });
            });
        }else{
            if(ISBG == true){
                AcsSwitch.SetAcs('B', 4, 0);                
            }else{
                AcsSwitch.SetAcs('B', 2, 0);                
            };
            MachineBGPOS.TL_EjectCard();  
            $.Writelog('打开读卡器:',openvalue.msg);
            $.layer({
                msg: openvalue.msg,
                btn:['确认'],
                tme:5,
                type:1,
                endExecute: true, 
                yes:function(){
                    // BackPrevPage();
                }
            })
        }
    },function(error){
        console.log('打开读卡器失败');
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        MachineBGPOS.TL_EjectCard(); 
        $.Writelog('打开读卡器失败');
        console.log(error);
        $.layer({
            msg: '打开读卡器失败',
            btn:['确认'],
            tme:5,
            type:1,
            endExecute: true, 
            yes:function(){
                ShowMainMenu();
            }
        })
    }); 
}

// 输入银行卡密码
function inputSocialPasword(){
	IsChildPage(true);
	$(PAGE).html(socialOrbankinputKeyText);
	var ele = '#socialOrbankinputKey';
    var BackPrevPage;                      
    var registerprice = 0;
    if(pageType == 'DRGH'){
        BackPrevPage = choosePayMethodOnTheDay;
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);      // 挂号费
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
        registerprice = Number(CardInfo.Amount);                          // 病历本费用
        BackPrevPage = printChoisePaymethods;
    }

    // $.BackInterval(90,BackPrevPage);                                   // 倒计时 定时返回
    $.BackInterval(90,function(){
        clearInterval( timeLXpressed );
        MachineBGPOS.TL_StartEppPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){
            console.log(value);
            MachineBGPOS.TL_EjectCard();
        }, function(error){
            console.log(error)
        })
        BackPrevPage();
    });

    registerprice = registerprice.toFixed(2);
    console.log(registerprice);
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
	var $input = $(ele + ' input.form-control');

	$.loading(false,'加载中请稍后');
    AcsSwitch.SetAcs('C', 1, 1); 
    // 打开密码键盘
    var openDKQTkeyprint = MachineBGPOS.TL_StartEppPASSOne( JSON.stringify({'IntPrt' : intprt}) );
    openDKQTkeyprint.then(function(value){
    	$.layerClose();
        var openkeyprints = JSON.parse(value);
        console.log(openkeyprints);
        if(openkeyprints.Code == 0){
            console.log(openkeyprints.msg);
            $.Speak( placeholder );                                             // 语音提示输密码                                       
            var numlen = 0;                                                     // 密码长度
            timeLXpressed = setInterval(function(){
                MachineBGPOS.TL_StartPinReportPressed().then(function(value){   // 轮循 密码键盘 键值
                    var keynums = JSON.parse(value);
                    if(keynums.Code == 0){
                        console.log(keynums.msg);
                        if(keynums.Key == 4){                                   // 判断按了确认
                            console.log('确认密码');
                            $.Writelog('确认密码');
                            clearInterval( timeLXpressed );
                            console.log( $input.val() );
                            console.log('关闭密码键盘入参:' + intprt );
                            MachineBGPOS.TL_StartEppPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(values){   // 关闭键盘
                                AcsSwitch.SetAcs('C', 1, 0);                    // 关闭密码键盘灯
                                if(ISBG == true){
                                    AcsSwitch.SetAcs('B', 4, 3);                
                                }else{
                                    AcsSwitch.SetAcs('B', 2, 3);                
                                };        
                                var results = JSON.parse(values);
                                console.log('关闭密码键盘出参', results);
                                $.Writelog("关闭密码键盘Code:"+results.Code);
                                var param = {
                                    'Amount' : registerprice,          // 消费金额
                                    'IntPrt' : results.IntPrt,         // 
                                };     

                                console.log(CardInfo);   
                                PAYSTATUES = true;                     // 支付状态判断                          
                                $.loading(false,'加载中...');
                                MachineBGPOS.TL_SaleTrade( JSON.stringify(param) ).then(function(values){     // 消费
                                    $.layerClose();
                                    console.log(values);                // 消费返回状态
                                    var currents = JSON.parse(values);
                                    $.Writelog( "消费返回code："+ currents.Code );
                                    if(currents.Code == 0){             // 消费成功
                                        $.Writelog('银行支付Trace：'+ currents.resultposdosales.Trace);
                                        $.Writelog(currents.resultposdosales.Trace);
                                        $.extend(RechargeAndPaymentInfo, {'Resultposdosales' : currents.resultposdosales});
                                        $.extend(RechargeAndPaymentInfo, {"Trace"      : currents.resultposdosales.Trace});
                                        $.extend(RechargeAndPaymentInfo, {"TranceID"   : currents.resultposdosales.Trace});
                                        $.extend(CardInfo,RechargeAndPaymentInfo);
                                        console.log(CardInfo);

                                        bankSuccessAndPaying();             // 银行卡消费成功后获取payid 
                                    }else{                                  // 消费失败
                                        console.log( currents.msg );
                                        $.Writelog('消费code:'+currents.Code+'MSG:'+currents.msg);
                                        AcsSwitch.SetAcs('C', 1, 0);        // 提示密码键盘灯
                                        if(ISBG == true){
                                            AcsSwitch.SetAcs('B', 4, 0);                
                                        }else{
                                            AcsSwitch.SetAcs('B', 2, 0);                
                                        };
                                        MachineBGPOS.TL_EjectCard(); 
                                        $.layer({
                                            msg: currents.msg, 
                                            btn: ['确认'],
                                            type: 1,     
                                            time: 5,
                                            bulbSrc: 'assets/images/tip/bulb.png',
                                            yes:function(){
                                                BackPrevPage();
                                            }
                                        })
                                    }
                                }, function(error){
                                    $.layerClose();
                                    console.log('消费异常',error);
                                    $.Writelog('----消费异常---');
                                    AcsSwitch.SetAcs('C', 1, 0);  
                                    if(ISBG == true){
                                        AcsSwitch.SetAcs('B', 4, 0);                
                                    }else{
                                        AcsSwitch.SetAcs('B', 2, 0);                
                                    }; 
                                    MachineBGPOS.TL_EjectCard();
                                    $.layer({
                                        msg: '交易失败，返回重试', 
                                        btn: ['确认'],
                                        type: 1,     
                                        time: 6,
                                        bulbSrc: 'assets/images/tip/bulb.png',
                                        yes:function(){
                                            BackPrevPage();
                                        }
                                    })
                                });
                            }, function(error){
                                console.log('关闭键盘失败',error);
                                if(ISBG == true){
                                    AcsSwitch.SetAcs('B', 4, 0);                
                                }else{
                                    AcsSwitch.SetAcs('B', 2, 0);                
                                }; 
                                $.Writelog('关闭键盘失败');
                                $.layer({
                                    msg: '关闭密码键盘失败', 
                                    btn: ['确认'],
                                    type: 1,     
                                    time: 6,
                                    bulbSrc: 'assets/images/tip/bulb.png',
                                    yes:function(){
                                        BackPrevPage();
                                    }
                                })
                            });
                        }else if(keynums.Key == 0){                           // 未知
                            console.log(keynums.msg);
                        }else if(keynums.Key == 1){                           // 输入数字键
                            numlen++;
                            $input.val( $input.val()+'*' );
                            console.log(numlen);
                            if(numlen > 6){ numlen = 6;}
                        }else if(keynums.Key == 2){                           // 取消键
                            clearInterval(timeLXpressed);
                            $.Writelog('------取消键-----');
                            AcsSwitch.SetAcs('C', 1, 0);                      // 密码键盘灯
                            if(ISBG == true){
                                AcsSwitch.SetAcs('B', 4, 0);                
                            }else{
                                AcsSwitch.SetAcs('B', 2, 0);                
                            }; 
                            MachineBGPOS.TL_StartEppPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){   // 关闭键盘
                                console.log(value);
                                MachineBGPOS.TL_EjectCard();  
                            }, function(error){
                                console.log(error);
                                MachineBGPOS.TL_EjectCard();                   // 关闭读卡器
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
                        }else if(keynums.Key == 3){                // 删除/更正键
                            numlen--;
                            $input.val( $input.val().slice(0,$input.val().length-1) );
                            if( $input.val().length <= 0){ $input.val(''); };
                            if(numlen <= 0){  numlen = 0;  };
                        }else{                                    // 非0 即为异常
                            clearInterval(timeLXpressed);
                            AcsSwitch.SetAcs('C', 1, 0);          // 密码键盘灯
                            if(ISBG == true){
                                AcsSwitch.SetAcs('B', 4, 0);                
                            }else{
                                AcsSwitch.SetAcs('B', 2, 0);                
                            }; 
                            MachineBGPOS.TL_StartEppPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){  // 关闭键盘
                                console.log(value);
                                MachineBGPOS.TL_EjectCard(); 
                            }, function(error){
                                console.log(error);
                                MachineBGPOS.TL_EjectCard();  
                            });
                            BackPrevPage();
                        }
                    }else{
                        console.log(keynums);
                    }
                },function(error){
                    console.log('密码键盘按键报错',error);
                    $.Writelog('------密码键盘按键报错-----');
                    clearInterval(timeLXpressed);
                    AcsSwitch.SetAcs('C', 1, 0);       // 密码键盘灯
                    if(ISBG == true){
                        AcsSwitch.SetAcs('B', 4, 0);                
                    }else{
                        AcsSwitch.SetAcs('B', 2, 0);                
                    }; 
                    MachineBGPOS.TL_EjectCard();  
                    $.layer({
                        msg:"密码键盘按键异常，请退出重试",
                        btn:['确认'],
                        tme:5,
                        type:1,
                        endExecute: true, 
                        yes:function(){
                            BackPrevPage();
                        }
                    });
                })
            },300)
        }else{
            console.log(openkeyprints.msg);
            if(ISBG == true){
                AcsSwitch.SetAcs('B', 4, 0);                
            }else{
                AcsSwitch.SetAcs('B', 2, 0);                
            }; 
            AcsSwitch.SetAcs('C', 1, 0);        // 密码键盘灯
            $.layer({
                msg:getStatusvalue.msg,
                btn:['确认'],
                tme:5,
                type:1,
                endExecute: true, 
                yes:function(){
                    BackPrevPage();
                }
            });
        }
    }, function(error){
    	$.layerClose();
        $.Writelog('------打开密码键盘失败-----');
        $.Speak('打开密码键盘失败,请退出重试');
        console.log(error);
    })

	/* 退卡并返回主界面 - 循环查卡 */
	$(ele + ' .handle.handle-exit').click(function(){
        clearInterval( timeLXpressed );
        AcsSwitch.SetAcs('C', 1, 0);             // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);         // 密码键盘灯      
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };            
        MachineBGPOS.TL_StartEppPASSTwo( JSON.stringify({'IntPrt' : intprt}) );  // 关闭键盘
        MachineBGPOS.TL_EjectCard(); 
	 	$.ExitCardClearInfo();
        $.Writelog('------点击退卡-----');
        if(paymethods == 'social'){
            $.intoOrExitCard(1, 5);              // 退卡提示  
        }
        if(paymethods == 'bank'){
            $.intoOrExitCard(0, 5);              // 退卡提示  
        }    
	});
	// 返回上一级
	$(ele + ' .handle-group .handle-prev').one('click', function() {
        clearInterval( timeLXpressed );
        AcsSwitch.SetAcs('C', 1, 0);       // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        }; 
		MachineBGPOS.TL_StartEppPASSTwo( JSON.stringify({'IntPrt' : intprt}) );  // 关闭键盘
        MachineBGPOS.TL_EjectCard(); 
		$.TheKeySound();
		$.Writelog('------返回上一级-----');
        BackPrevPage();
	});
	// 首页
	$(ele + ' .handle-group .handle-home').one('click', function() {
        clearInterval( timeLXpressed );
        AcsSwitch.SetAcs('C', 1, 0);       // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        }; 
        MachineBGPOS.TL_StartEppPASSTwo( JSON.stringify({'IntPrt' : intprt}) );  // 关闭键盘
        MachineBGPOS.TL_EjectCard();  
        if(pageType == 'DYYW'){
            MachineGMBL.CloseDYJ("STT420");  // 关闭病历机
        }
		$.TheKeySound();
		$.Writelog('------返回首页-----');
		ShowMainMenu();
	});
};

// 银行卡,社保卡支付 消费成功后
function bankSuccessAndPaying(){
	console.log(RechargeAndPaymentInfo);
	console.log(CardInfo);
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
            MachineBGPOS.TL_EjectCard(); 
            if(ISBG == true){
                AcsSwitch.SetAcs('B', 4, 0);                
            }else{
                AcsSwitch.SetAcs('B', 2, 0);                
            }; 
            AcsSwitch.SetAcs('C', 1, 0);       // 密码键盘灯
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
            //缴费成功 更新支付状态
            var data = {
                PayID    : CardInfo.PayID,
                TranceID : CardInfo.Trace==""?CardInfo.Trace:CardInfo.TranceID,
                business_success: false,
                pay_success     : true,
                business_type   : business_type,
                retfund         : false
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
                            payOverAndRegisterRegNoBank();          // 取号  SaveAppointment
                        }
                        if(pageType == 'ZZJF'){
                            $.Writelog('处方缴费');
                            payOverAndRegisterSelfbank();           // 处方  PayRecipes
                        }
                        if(pageType == 'DRGH'){
                            $.Writelog('当日挂号');
                            payOverAndRegisterBank();               // 挂号  Register
                        }
                        if(pageType == 'DYYW'){ 
                            $.Writelog('病历本打印'); 
                            payOverAndPrinterbank();                // 病历本打印  Printer
                        }
                    },500);        
                }else{
                    console.log(value.Msg);
                    $.Writelog("支付成功后更新交易支付记录失败");
                    errorAndBackMoneyBank(value.Msg);
                }
            }, function(error){
                console.log(error);
                errorAndBackMoneyBank();
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
function payOverAndRegisterBank(){
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
			successRegisterOnthedayBank();
            rechargeSucceed(CardInfo);
		}else{
			console.log('挂号失败');
            $.Writelog('挂号失败,返回Code'+ret.Code);
            $.Writelog(ret.Msg);
			errorAndBackMoneyBank(ret.Msg);
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

// 获取payid 成功 后调用处方接口  -- 处方
function payOverAndRegisterSelfbank(){
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
            successRegisterSelf();
            rechargeSucceedPrint(CardInfo);
        }else{
            console.log('处方缴费失败');
            $.Writelog('处方缴费失败,返回code'+ret.Code);
            errorAndBackMoneyBank(ret.Msg);
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

// 获取payid 成功 后调用取号接口  -- 取号
function payOverAndRegisterRegNoBank(){
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
            successRegisterOnthedayBank();  
            rechargeSucceed(CardInfo); 
        }else{
            console.log(ret.Msg);
            $.Writelog('取号失败,返回CODE'+ret.Code);
            $.Writelog(ret.Msg);
            $.Speak('取号失败,返回Code'+ret.Code);
            errorAndBackMoneyBank(ret.Msg);
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

// 获取payid 成功 后调用存病历本购买信息  -- 病历本打印
function payOverAndPrinterbank(){
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
                $.Writelog(ret.Msg);
                blbbuyandprint();                       // 打印病历本
            }else{
                console.log(ret.Msg);
                $.Writelog('购买病历本GetSaveBlb存储失败,返回Code'+ret.Code);
                $.Writelog(ret.Msg);
                MachineGMBL.CloseDYJ("STT420");
                errorAndBackMoneyBank(ret.Msg)
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
function successRegisterOnthedayBank(){
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
	    s: 15,
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
            var data = {
                PayID    : CardInfo.PayID,
                TranceID : CardInfo.Trace==""?CardInfo.Trace:CardInfo.TranceID,
                business_success: true,
                pay_success     : true,
                business_type   : business_type,
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
function errorAndBackMoneyBank(msg){
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
	    s: 30,
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
            $.Writelog("冲正Trace:"+RechargeAndPaymentInfo.Trace);  
            console.log( RechargeAndPaymentInfo.Trace );      
            $.loading(false,'加载中...');     // 冲正  退费
            MachineBGPOS.TL_CorrectTrade( JSON.stringify({'Trace':RechargeAndPaymentInfo.Trace}) ).then(function(value){
                console.log(value);
                var value = JSON.parse(value);
                if(value.Code == 0){
                    $.layerClose();
                    $.Writelog('冲正成功');
                    var data = {
                        'PayID'           : RechargeAndPaymentInfo.PayID,
                        'TranceID'        : RechargeAndPaymentInfo.Trace,
                        'business_success': false,
                        'pay_success'     : true,
                        'bussiness_type'  : business_type,
                        'retfund'         : true                             // 10.16
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
                }else{
                    console.log(value.msg);
                    $.layerClose();
                    $.Writelog('冲正失败,Code:'+value.Code);
                    CancelRegisterFailebank(value.msg);
                }
            }, function(error){
                $.layerClose();
                console.log(error);
                $.Writelog('冲正异常');
                $.layer({
                    msg: '网络异常，请联系客服人员进行退款处理', 
                    btn: ['确认'],
                    type: 1,     
                    time: 6,
                    bulbSrc: 'assets/images/tip/bulb.png',
                    yes:function(){
                        ShowMainMenu();
                    }
                })
            })  
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

// 提示退费失败
function CancelRegisterFailebank(msg){
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
        s: 30,
        type: 1,
        title: msg?msg:'退费失败，请联系客服人员',
        message: msg?msg:'退费失败，请联系客服人员',
        hasBulbImg:false,
        hasHome:true,
        hasPrev:true,
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

// 补录身份证信息 刷身份证模式 
function buluIdcardInfomation(){
    IsChildPage(true);
    var images = 'assets/images/card/input-IDCard.gif';
    if(ISBG == true){
        images = 'assets/images/card/denglu.gif';
    }
    $.BrushIntoIdentity({
        s: 30,
        title : '<p>请在图中机器对应的位置放入身份证</p>',
        imgSrc: images,
        imgStyle: {
            width: '600px',
        },
        titleStyle:{
            fontWeight:'bold'
        },
        hasConfirm:false,
        hasPrev:false,
        timeBack: function() {
            console.log('倒计时结束');
            CloseIdentityReader();
            ShowMainMenu();
        },
        btnBack: function($ele) {
            console.log($ele);
        },
        homeBack: function($ele) {
            console.log($ele);
            CloseIdentityReader();
            ShowMainMenu();         // 返回首页
        },
        prevBack: function($ele) {
            console.log('上一页');
            CloseIdentityReader();
            BackPrevPage();
        },
        exitBack: function($ele) {
            console.log($ele);
            CloseIdentityReader();
            $.ExitCard();             //退卡
        },
        callBack: function($ele) {
            console.log($ele);
            //调用硬件方法感应身份证信息
            IdentityCreatSucceedCallBack = UpdateIDNo;
            OpenIdentityReader();
        }
    });
}

// 补录身份证信息
function UpdateIDNo(){
    console.log(IdentityInfo);
    if(IdentityInfo.PatientName == CardInfo.PatientInfo.PatientName && IdentityInfo.Birthday == CardInfo.PatientInfo.Birthday){
        CardInfo.PatientInfo.IDNo = IdentityInfo.IDNo;
        $.ajax({
            url:'/api/Business/UpdateIDNo',
            data:JSON.stringify(CardInfo),
            type:'post',
            success:function(ret){
                var ret = JSON.parse(ret);
                console.log(ret);
                if(ret.Code == 0){
                    $.Writelog('补录成功');
                    updateIdnoSuccess();
                }else{
                    console.log(ret.Msg);
                    $.Writelog('补录失败');
                    ShowMainMenu();
                }
            },error:function(ret){
                $.Writelog('网络异常，补录信息失败')
                contentError();
            }
        })
    }else{
        $.layer({
            msg: '您补录的身份信息与卡号对应的信息不符', 
            btn: ['确认'],
            type: 1,     
            time: 6,
            bulbSrc: 'assets/images/tip/bulb.png',
            yes:function(){
                ShowMainMenu();
            }
        })
    } 
}

// 补录身份证信息成功
function updateIdnoSuccess(){
    $.HandleCondition({
        s: 10,
        type: 1,
        message: '补录身份证信息成功',
        title:'补录身份证信息成功',
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
        },
        homeBack: function($ele) {
            console.log($ele, '首页');
            ShowMainMenu();         // 返回首页
        },
        prevBack: function($ele) {
            console.log($ele, '上一页');
            ShowMainMenu();
        },
        exitBack: function($ele) {
            console.log($ele, '退卡');
            $.ExitCard();
        },
    });
};

/*----------------------------------------------------------*/

// 社保卡读取 
function openSocialCardAndReadcard(){
    clearInterval(CheckCardTimer);                   // 清除循环查卡   
    setTimeout(function(){
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 1);             // 打卡读卡器灯  -闪烁
        }else{
            AcsSwitch.SetAcs('B', 2, 1);             // 打卡读卡器灯  -闪烁 
        };
    },800);
    var registerprice = 0;
    var BackPrevPage;
    if(pageType == 'DRGH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);        // 挂号费
        BackPrevPage = choosePayMethodOnTheDay;
    }
    if(pageType == 'YYQH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);        // 预约挂号费
        BackPrevPage = choosePayMethods;
    };
    if(pageType == 'ZZJF'){
        for(var i=0;i<CardInfo.RecipesInfo.length;i++){
            registerprice += Number( CardInfo.RecipesInfo[i].SelfAmt );   // 自费
        }
        BackPrevPage = choosePayMethodSelf;
    }
    if(pageType == 'DYYW'){
        registerprice = Number(CardInfo.Amount);                          // 病历本费用
        BackPrevPage = printChoisePaymethods;
    }
    registerprice = registerprice.toFixed(2);
    console.log(registerprice);
    $.Writelog('社保卡缴费:' + registerprice);
    // MachineBGPOS.OpenDKQ( readCardCOM ).then(function(value){             // 打开读卡器
    //     var opensocialvalue = JSON.parse(value);
    //     console.log(opensocialvalue);
    //     if(opensocialvalue.Code == 0){
    //         clearInterval(timerDKQStatus);
    //         timerDKQStatus = setInterval(function(){
    //             MachineBGPOS.GetStatusDKQ().then(function(value){          // 查卡状态
    //                 var querysocialstatus = JSON.parse(value);
    //                 console.log(querysocialstatus);
    //                 if(querysocialstatus.Code == 0){
    //                     clearInterval(timerDKQStatus);                     // 清楚循环查卡
                        MachineBGPOS.ssiRead( JSON.stringify({'Amount' : registerprice}) ).then(function(value){          // 读卡信息
                            var readSocialCardinfo = JSON.parse(value);
                            console.log(readSocialCardinfo);
                            $.Writelog("读社保卡返回Code:"+readSocialCardinfo.Code);
                            if(readSocialCardinfo.Code == 0){
                                intprt = readSocialCardinfo.IntPrt;
                                $.Writelog("社保卡号："+ readSocialCardinfo.resultposdosales.IdNo);
                                var randomNumber = Math.random().toString().substr(2,8);      // 随机数
                                var paymethodss = 0;                                          // 0 表示未知
                                if(paymethods == 'bank'){   paymethodss = 1; }
                                if(paymethods == 'social'){ paymethodss = 2; }
                                RechargeAndPaymentInfo = {                                    // 社保下单  
                                    "ZZJCertificate": { ID: ZZJInfomation.ZZJID },
                                    "PayInfo":{
                                        "PayMetHod" : paymethodss,                            // 支付方式
                                        "Amount"    : registerprice,                          // 支付金额
                                        'AccountID' : readSocialCardinfo.resultposdosales.IdNo,
                                        'ExParams'  : null,
                                        'ID'        : null,
                                        'PayUrl'    : '',
                                        'TranNo'    : ''
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
                                        var PayID = value.PayID;
                                        $.Writelog('成功获取PayID:'+PayID);
                                        $.extend(CardInfo,{"PayID": PayID});
                                        $.extend(RechargeAndPaymentInfo.PayInfo,{ID:PayID});
                                        $.extend(RechargeAndPaymentInfo,{"PayID": PayID});

                                        openSocialKeyPrinet();                     // 打开密码键盘
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
                                console.log(readSocialCardinfo.msg);
                                $.Writelog("读社保卡Code:"+readSocialCardinfo.Code);
                                $.Writelog('读社保卡Msg:'+readSocialCardinfo.msg);
                                if(ISBG == true){
                                    AcsSwitch.SetAcs('B', 4, 0);           // 提示灯常关
                                }else{
                                    AcsSwitch.SetAcs('B', 2, 0);           // 提示灯常关
                                };
                                MachineBGPOS.TL_EjectCard();  
                                $.layer({
                                    msg: readSocialCardinfo.msg, 
                                    btn: ['确定'],
                                    type: 1,     
                                    time: 6,
                                    bulbSrc: 'assets/images/tip/bulb.png',
                                    yes:function(){
                                        BackPrevPage();     
                                    }
                                })
                            }
                        }, function(error){
                            console.log(error);
                            if(ISBG == true){
                                AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
                            }else{
                                AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
                            };
                            MachineBGPOS.TL_EjectCard();
                            console.log(error);
                            $.Writelog('机器异常，查卡状态失败');
                            $.layer({
                                msg: '异常，查询卡失败', 
                                btn: ['确定'],
                                type: 1,     
                                time: 6,
                                bulbSrc: 'assets/images/tip/bulb.png',
                                yes:function(){
                                    BackPrevPage();     
                                }
                            })
                        });
    //                 }else{
    //                     console.log(querysocialstatus.msg);
    //                     $.Writelog('读卡状态:'+ querysocialstatus.msg);
    //                 }
    //             }, function(error){
    //                 clearInterval(timerDKQStatus);
    //                 if(ISBG == true){
    //                     AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
    //                 }else{
    //                     AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
    //                 };
    //                 if(ZZJInfomation.ZZJID == 4 || ZZJInfomation.ZZJID == 24 || ZZJInfomation.ZZJID == 21){
    //                     MachineBGPOS.TL_EjectCard();  
    //                 }else{
    //                     MachineBGPOS.CloseDKQ(readCardCOM);         // 关闭读卡器
    //                 }
    //                 console.log(error);
    //                 $.Writelog('机器故障，查卡状态失败');
    //                 $.layer({
    //                     msg: '异常，查询卡失败', 
    //                     btn: ['确定'],
    //                     type: 1,     
    //                     time: 6,
    //                     bulbSrc: 'assets/images/tip/bulb.png',
    //                     yes:function(){
    //                         BackPrevPage();     
    //                     }
    //                 })
    //             });
    //         },1300);
    //     }else{
    //         $.Writelog('打开读卡器Code:'+opensocialvalue.Code);
    //         $.Writelog('打开读卡器Msg:'+opensocialvalue.msg);
    //         if(ISBG == true){
    //             AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
    //         }else{
    //             AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
    //         };
    //         if(ZZJInfomation.ZZJID == 4 || ZZJInfomation.ZZJID == 24 || ZZJInfomation.ZZJID == 21){
    //             MachineBGPOS.TL_EjectCard();  
    //         }else{
    //             MachineBGPOS.CloseDKQ(readCardCOM);         // 关闭读卡器
    //         }
    //         $.layer({
    //             msg: opensocialvalue.msg, 
    //             btn: ['确定'],
    //             type: 1,     
    //             time: 6,
    //             bulbSrc: 'assets/images/tip/bulb.png',
    //             yes:function(){
    //                 BackPrevPage();     
    //             }
    //         })
    //     }
    // }, function(error){
    //     $.Writelog('机器故障，打开读卡器失败');
    //     console.log(error);
    //     if(ISBG == true){
    //         AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
    //     }else{
    //         AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
    //     };
    //     if(ZZJInfomation.ZZJID == 4 || ZZJInfomation.ZZJID == 24 || ZZJInfomation.ZZJID == 21){
    //         MachineBGPOS.TL_EjectCard();  
    //     }else{
    //         MachineBGPOS.CloseDKQ(readCardCOM);         // 关闭读卡器
    //     }
    //     $.layer({
    //         msg: '机器故障，打开读卡器失败', 
    //         btn: ['返回首页'],
    //         type: 1,     
    //         time: 6,
    //         bulbSrc: 'assets/images/tip/bulb.png',
    //         yes:function(){
    //             ShowMainMenu();     
    //         }
    //     })
    // });
};

// 打开密码键盘
function openSocialKeyPrinet(){
    IsChildPage(true);
    $(PAGE).html(socialOrbankinputKeyText);
    var ele = '#socialOrbankinputKey';
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
        registerprice = Number(CardInfo.Amount);                          // 病历本费用
        BackPrevPage = printChoisePaymethods;
    }
    // $.BackInterval(90,BackPrevPage);    //倒计时 定时返回
    $.BackInterval(90,function(){
        clearInterval(timeLXpressed);
        MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){   // 关闭键盘
            console.log(value);
            MachineBGPOS.TL_EjectCard();   
        }, function(error){
            console.log(error)
        });                           
        BackPrevPage();
    })

    registerprice = registerprice.toFixed(2);
    console.log(registerprice);
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
    var $input = $(ele + ' input.form-control');

    $.loading(false,'加载中...');
    AcsSwitch.SetAcs('C', 1, 1);  
    console.log(intprt);
    // 打开密码键盘
    MachineBGPOS.TL_StartSSIPASSInit( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){
        $.layerClose();
        var openkeyprints = JSON.parse(value);
        console.log(openkeyprints);
        if(openkeyprints.Code == 0){
            console.log(openkeyprints.msg);
            $.Writelog("打开密码键盘成功");
            $.Speak( placeholder );                                    // 语音提示输密码                                       
            var numlen = 0;                                            // 密码长度
            timeLXpressed = setInterval(function(){
                MachineBGPOS.TL_SSIStartPinReportPressed().then(function(value){   // 轮循 密码键盘 键值
                    var keynums = JSON.parse(value);
                    if(keynums.Code == 0){
                        console.log(keynums.msg);
                        if(keynums.Key == 4){                          // 判断按了确认
                            console.log('确认密码');
                            $.Writelog('确认密码');
                            clearInterval( timeLXpressed );
                            console.log( $input.val() );
                            // 关闭键盘
                            MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(values){
                                AcsSwitch.SetAcs('C', 1, 0);           // 关闭密码键盘灯
                                if(ISBG == true){
                                    AcsSwitch.SetAcs('B', 4, 3);                
                                }else{
                                    AcsSwitch.SetAcs('B', 2, 3);                
                                };
                                console.log(CardInfo);               
                                var results = JSON.parse(values);
                                console.log(results);
                                if(results.Code == 0){
                                    var param = {
                                        'Amount' : registerprice,          // 消费金额
                                        'IntPrt' : results.IntPrt,         // 
                                    };     
                                    PAYSTATUES = true;                     // 支付状态判断                          
                                    $.loading(false,'加载中...');
                                    MachineBGPOS.TL_SSISaleTrade( JSON.stringify(param) ).then(function(values){  // 消费
                                        $.layerClose();
                                        console.log(values);                // 消费返回状态
                                        var currents = JSON.parse(values);
                                        if(currents.Code == 0){             // 消费成功
                                            console.log(currents.resultposdosales.Trace);
                                            $.Writelog('社保Trace：'+ currents.resultposdosales.Trace);
                                            $.Writelog(currents.resultposdosales.Trace);
                                            $.extend(RechargeAndPaymentInfo, {'Resultposdosales' : currents.resultposdosales});
                                            $.extend(RechargeAndPaymentInfo, {"Trace"      : currents.resultposdosales.Trace});
                                            $.extend(RechargeAndPaymentInfo, {"TranceID"   : currents.resultposdosales.Trace});
                                            $.extend(CardInfo,RechargeAndPaymentInfo);
                                            console.log(CardInfo);

                                            bankSuccessAndPaying();                    // 社保卡消费成功后获取payid 
                                        }else{                                         // 消费失败
                                            console.log( currents.msg );
                                            $.Writelog('消费code非0'+currents.msg);
                                            AcsSwitch.SetAcs('C', 1, 0);               // 提示密码键盘灯
                                            if(ISBG == true){
                                                AcsSwitch.SetAcs('B', 4, 0);                
                                            }else{
                                                AcsSwitch.SetAcs('B', 2, 0);                
                                            };
                                            MachineBGPOS.TL_EjectCard(); 
                                            $.layer({
                                                msg: currents.msg, 
                                                btn: ['确认'],
                                                type: 1,     
                                                time: 5,
                                                bulbSrc: 'assets/images/tip/bulb.png',
                                                yes:function(){
                                                    BackPrevPage();
                                                }
                                            })
                                        }
                                    }, function(error){
                                        $.layerClose();
                                        console.log('消费异常',error);
                                        $.Writelog('----消费异常---'+error);
                                        if(ISBG == true){
                                            AcsSwitch.SetAcs('B', 4, 0);                
                                        }else{
                                            AcsSwitch.SetAcs('B', 2, 0);                
                                        };
                                        AcsSwitch.SetAcs('C', 1, 0);                              // 提示密码键盘灯 
                                        MachineBGPOS.TL_EjectCard();  
                                        $.layer({
                                            msg: '交易异常，返回首页', 
                                            btn: ['返回首页'],
                                            type: 1,     
                                            time: 6,
                                            bulbSrc: 'assets/images/tip/bulb.png',
                                            yes:function(){
                                                ShowMainMenu();
                                            }
                                        })
                                    });
                                }else{
                                    AcsSwitch.SetAcs('C', 1, 0);       // 提示密码键盘灯  
                                    if(ISBG == true){
                                        AcsSwitch.SetAcs('B', 4, 0);                
                                    }else{
                                        AcsSwitch.SetAcs('B', 2, 0);                
                                    };
                                    $.Writelog("关闭密码键盘"+results.Code+','+results.msg); 
                                    MachineBGPOS.TL_EjectCard(); 
                                    $.layer({
                                        msg: results.msg, 
                                        btn: ['确定'],
                                        type: 1,     
                                        time: 6,
                                        bulbSrc: 'assets/images/tip/bulb.png',
                                        yes:function(){
                                            BackPrevPage();
                                        }
                                    })
                                }
                            }, function(error){
                                console.log('关闭键盘失败',error);
                                $.Writelog('关闭键盘失败');
                                MachineBGPOS.TL_EjectCard();  
                                $.layer({
                                    msg: '关闭密码键盘失败，交易取消', 
                                    btn: ['确定'],
                                    type: 1,     
                                    time: 6,
                                    bulbSrc: 'assets/images/tip/bulb.png',
                                    yes:function(){
                                        BackPrevPage();
                                    }
                                })
                            });
                        }else if(keynums.Key == 0){           //未知
                             console.log(keynums.msg);
                        }else if(keynums.Key == 1){           // 输入数字键
                            numlen++;
                            $input.val( $input.val()+'*' );
                            console.log(numlen);
                            if(numlen > 6){ numlen = 6;}
                        }else if(keynums.Key == 2){           // 取消键
                            clearInterval(timeLXpressed);
                            $.Writelog('------取消键-----');
                            console.log(keynums.msg);
                            AcsSwitch.SetAcs('C', 1, 0);       // 密码键盘灯
                            if(ISBG == true){
                                AcsSwitch.SetAcs('B', 4, 0);                
                            }else{
                                AcsSwitch.SetAcs('B', 2, 0);                
                            };
                            MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){ // 关闭键盘
                                console.log(value);
                                MachineBGPOS.TL_EjectCard(); 
                            }, function(error){
                                console.log(error);
                                MachineBGPOS.TL_EjectCard();
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
                        }else if(keynums.Key == 3){                // 删除/更正键
                            numlen--;
                            $input.val( $input.val().slice(0,$input.val().length-1) );
                            if( $input.val().length <= 0){ $input.val(''); };
                            if(numlen <= 0){  numlen = 0;  };
                        }else{                                    // 非0 即为异常
                            clearInterval(timeLXpressed);
                            AcsSwitch.SetAcs('C', 1, 0);          // 密码键盘灯
                            if(ISBG == true){
                                AcsSwitch.SetAcs('B', 4, 0);                
                            }else{
                                AcsSwitch.SetAcs('B', 2, 0);                
                            };
                            MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){ // 关闭键盘
                                $.Writelog(value);
                                MachineBGPOS.TL_EjectCard();  
                            }, function(error){
                                $.Writelog(error);
                                MachineBGPOS.TL_EjectCard();  
                            });
                            BackPrevPage();
                        }
                    }else{
                        console.log(keynums);
                    }
                },function(error){
                    console.log('密码键盘按键报错',error);
                    $.Writelog('------密码键盘按键报错-----');
                    clearInterval(timeLXpressed);
                    AcsSwitch.SetAcs('C', 1, 0);       // 密码键盘灯
                    if(ISBG == true){
                        AcsSwitch.SetAcs('B', 4, 0);                
                    }else{
                        AcsSwitch.SetAcs('B', 2, 0);                
                    };
                    MachineBGPOS.TL_EjectCard(); 
                    $.layer({
                        msg: '密码键盘按键异常', 
                        btn: ['确定'],
                        type: 1,     
                        time: 6,
                        bulbSrc: 'assets/images/tip/bulb.png',
                        yes:function(){
                            BackPrevPage();
                        }
                    })
                })
            },300)
        }else{
            console.log(openkeyprints.msg);
            AcsSwitch.SetAcs('C', 1, 0);              // 密码键盘灯关
            if(ISBG == true){
                AcsSwitch.SetAcs('B', 4, 0);                
            }else{
                AcsSwitch.SetAcs('B', 2, 0);                
            };
            $.Writelog('------打开密码键盘失败-----');
            MachineBGPOS.TL_EjectCard();              // 关闭读卡器
            $.layer({
                msg:getStatusvalue.msg,
                btn:['确认'],
                tme:6,
                type:1,
                endExecute: true, 
                yes:function(){
                    BackPrevPage();
                }
            });
        }
    }, function(error){
        $.layerClose();
        $.Writelog('------打开密码键盘失败-----');
        AcsSwitch.SetAcs('C', 1, 0);              // 密码键盘灯关
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        console.log(error);
        $.layer({
            msg: '打开密码键盘异常，请退出重试', 
            btn: ['确定'],
            type: 1,     
            time: 6,
            bulbSrc: 'assets/images/tip/bulb.png',
            yes:function(){
                BackPrevPage();
            }
        })
    })

    /* 退卡并返回主界面 - 循环查卡 */
    $(ele + ' .handle.handle-exit').click(function(){
        clearInterval( timeLXpressed );
        AcsSwitch.SetAcs('C', 1, 0);             // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){   // 关闭键盘
            console.log(value);
            MachineBGPOS.TL_EjectCard();         // 关闭读卡器
        }, function(error){
            console.log(error)
        });                                     
        if(pageType == 'DYYW'){
            MachineGMBL.CloseDYJ("STT420");      // 关闭病历机
        }
        $.ExitCardClearInfo();
        $.Writelog('------点击退卡-----');
        if(paymethods == 'social'){
            $.intoOrExitCard(1, 5);              // 退卡提示  
        }
        if(paymethods == 'bank'){
            $.intoOrExitCard(0, 5);              // 退卡提示  
        }    
    });
    // 返回上一级
    $(ele + ' .handle-group .handle-prev').one('click', function() {
        clearInterval( timeLXpressed );
        AcsSwitch.SetAcs('C', 1, 0);             // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        console.log(intprt);
        MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){  // 关闭键盘
            console.log(value);
            MachineBGPOS.TL_EjectCard();        // 关闭读卡器
        }, function(error){
            console.log(error)
        });                                      
        $.TheKeySound();
        $.Writelog('------返回上一级-----');
        BackPrevPage();
    });
    // 首页
    $(ele + ' .handle-group .handle-home').one('click', function() {
        clearInterval( timeLXpressed );
        AcsSwitch.SetAcs('C', 1, 0);            // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){  // 关闭键盘
            console.log(value);
            MachineBGPOS.TL_EjectCard();       // 关闭读卡器
        }, function(error){
            console.log(error)
        });
        if(pageType == 'DYYW'){
            MachineGMBL.CloseDYJ("STT420");     // 关闭病历机
        }
        $.TheKeySound();
        $.Writelog('------返回首页-----');
        ShowMainMenu();
    });
}



//   ------- 交易结束后重启服务------   //
// async function endRegisterAndRestartSevrice(){
//     try {
//         let value=JSON.parse(await ServicesManager.Status("银行社保交易接口"));
//         console.log(value);
//         if(value == 0){           // 正在运行
//             ServicesManager.Stop('银行社保交易接口');      // 停止服务
//             await Sleep(3000);
//             ServicesManager.Start('银行社保交易接口');     // 开启服务
//         }else if(value == 1){     // 启动挂起
//             ServicesManager.Stop('银行社保交易接口');      
//             await Sleep(3000);
//             ServicesManager.Start('银行社保交易接口');
//         }else if(value == 2){     // 暂停
//             await Sleep(3000);
//             ServicesManager.Start('银行社保交易接口');
//         }else if(value == 3){    // 暂停挂起
//             await Sleep(3000);
//             ServicesManager.Start('银行社保交易接口');
//         }else if(value == 4){    // 继续运行挂起
//             ServicesManager.Stop('银行社保交易接口');      
//             await Sleep(3000);
//             ServicesManager.Start('银行社保交易接口');    
//         }else if(value == 5){    // 停止
//             await Sleep(3000);
//             ServicesManager.Start('银行社保交易接口');     
//         }else if(value == 6){    // 停止挂起
//             await Sleep(3000);
//             ServicesManager.Start('银行社保交易接口');
//         }else if(value == -1){
//             $.layer({
//                 msg :"找不到银联服务,请检查银联服务是否开启",
//                 btn :["确认"],
//                 type: 1,
//                 time: 6,
//                 yes : function(){ }
//             })
//         }
//     }catch(error){
//         console.log(error);
//         $.layer({
//             msg :"银联社保服务状态异常",
//             btn :["确认"],
//             type: 1,
//             time: 6,
//             yes : function(){ }
//         })
//     }
// }   
