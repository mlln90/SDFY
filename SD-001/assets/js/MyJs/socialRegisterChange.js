var timeLXpressed;  

// 社保卡读取 
function openSocialCardAndReadcardChange(){
    clearInterval(CheckCardTimer);                   // 清除循环查卡   
    if(ISBG == true){
        AcsSwitch.SetAcs('B', 4, 1);             // 打卡读卡器灯  -闪烁
    }else{
        AcsSwitch.SetAcs('B', 2, 1);             // 打卡读卡器灯  -闪烁 
    };
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
   
    // MachineBGPOS.TL_ssiOpenCardReader( JSON.stringify({'Amount' : registerprice}) ).then(function(value){                 // 打开读卡器
    //     var opensocialvalue = JSON.parse(value);
    //     console.log(opensocialvalue);
    //     if(opensocialvalue.Code == 0){
    //         clearInterval(timerDKQStatus);
    //         timerDKQStatus = setInterval(function(){
    //             MachineBGPOS.TL_ssiGetStatusCardReader( JSON.stringify({'Amount' : registerprice}) ).then(function(value){    // 寻卡
    //                 var querysocialstatus = JSON.parse(value);
    //                 console.log(querysocialstatus);
    //                 if(querysocialstatus.Code == 0){

                        MachineBGPOS.ssiRead( JSON.stringify({'Amount' : registerprice}) ).then(function(value){    // 读卡信息
                            var readSocialCardinfo = JSON.parse(value);
                            console.log(readSocialCardinfo);
                            $.Writelog("读社保卡返回Code:"+readSocialCardinfo.Code);
                            if(readSocialCardinfo.Code == 0){
                                intprt = readSocialCardinfo.IntPrt;
                                $.Writelog("社保卡号："+ readSocialCardinfo.resultposdosales.IdNo);
                                var randomNumber = Math.random().toString().substr(2,8);      // 随机数
                                var paymethodss = 0;                // 0 表示未知
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

                                        openSocialKeyPrinetChange();                     // 打开密码键盘
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
                            }else if(readSocialCardinfo.Code == 112){
                                $.Writelog(readSocialCardinfo.msg);
                                if(ISBG == true){
                                    AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
                                }else{
                                    AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
                                };
                                MachineBGPOS.TL_EjectCard(); 
                                $.layer({
                                    msg: readSocialCardinfo.msg, 
                                    btn: ['确定'],
                                    type: 1,     
                                    time: 6,
                                    bulbSrc: 'assets/images/tip/bulb.png',
                                    yes:function(){
                                        // BackPrevPage();     
                                    }
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
                                        // BackPrevPage();     
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
    //                     $.Writelog('寻卡状态:'+ querysocialstatus.msg);
    //                 }
    //             }, function(error){
    //                 clearInterval(timerDKQStatus);
    //                 $.Writelog("寻卡异常");
    //                 if(ISBG == true){
    //                     AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
    //                 }else{
    //                     AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
    //                 };
    //                 MachineBGPOS.TL_ssiCloseReadData( JSON.stringify({'Amount' : registerprice}) );  // 寻卡异常或超时是调用
    //                 $.layer({
    //                     msg: "查询卡状态异常,请退出重试", 
    //                     btn: ['确定'],
    //                     type: 1,     
    //                     time: 6,
    //                     bulbSrc: 'assets/images/tip/bulb.png',
    //                     yes:function(){
    //                         BackPrevPage();     
    //                     }
    //                 })
    //             })  
    //         },1250);
    //     }else{
    //         $.Writelog('打开读卡器Code:'+opensocialvalue.Code);
    //         $.Writelog('打开读卡器msg:'+opensocialvalue.msg);
    //         if(ISBG == true){
    //             AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
    //         }else{
    //             AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
    //         };
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
    //     $.Writelog('打开读卡器异常');
    //     if(ISBG == true){
    //         AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
    //     }else{
    //         AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
    //     };
    //     $.layer({
    //         msg: "打开读卡器异常,请退出重试", 
    //         btn: ['确定'],
    //         type: 1,     
    //         time: 6,
    //         bulbSrc: 'assets/images/tip/bulb.png',
    //         yes:function(){
    //             BackPrevPage();     
    //         }
    //     })
    // });
};

// 打开密码键盘
function openSocialKeyPrinetChange(){
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
                                            if(ISBG == true){
                                                AcsSwitch.SetAcs('B', 4, 0);                
                                            }else{
                                                AcsSwitch.SetAcs('B', 2, 0);                
                                            };
                                            AcsSwitch.SetAcs('C', 1, 0);               // 提示密码键盘灯
                                            MachineBGPOS.TL_EjectCard();               // 退卡
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
                                        $.Writelog('----消费异常---',error);
                                        if(ISBG == true){
                                            AcsSwitch.SetAcs('B', 4, 0);                
                                        }else{
                                            AcsSwitch.SetAcs('B', 2, 0);                
                                        };
                                        AcsSwitch.SetAcs('C', 1, 0);                        // 提示密码键盘灯  
                                        MachineBGPOS.TL_EjectCard().then(function(value){   // 退卡
                                            console.log(value)
                                        }, function(error){
                                            console.log(error)
                                        });
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
                                    if(ISBG == true){
                                        AcsSwitch.SetAcs('B', 4, 0);                
                                    }else{
                                        AcsSwitch.SetAcs('B', 2, 0);                
                                    };
                                    AcsSwitch.SetAcs('C', 1, 0);                        // 提示密码键盘灯  
                                    $.Writelog("关闭密码键盘"+results.Code+','+results.msg); 
                                    MachineBGPOS.TL_EjectCard().then(function(value){   // 关闭读卡器
                                        console.log(value)
                                    }, function(error){
                                        console.log(error)
                                    });
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
                                MachineBGPOS.TL_EjectCard().then(function(value){        // 关闭读卡器
                                    console.log(value)
                                }, function(error){
                                    console.log(error)
                                });
                                $.layer({
                                    msg: '关闭密码键盘失败，交易取消', 
                                    btn: ['返回首页'],
                                    type: 1,     
                                    time: 6,
                                    bulbSrc: 'assets/images/tip/bulb.png',
                                    yes:function(){
                                        ShowMainMenu();
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
                            // 关闭键盘
                            MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){
                                console.log(value);
                                MachineBGPOS.TL_EjectCard().then(function(value){   // 关闭读卡器
                                    console.log(value)
                                }, function(error){
                                    console.log(error)
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
                            }, function(error){
                                console.log(error);
                                MachineBGPOS.TL_EjectCard();
                            });
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
                            // 关闭键盘
                            MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){
                                console.log(value)
                                MachineBGPOS.TL_EjectCard();
                            }, function(error){
                                console.log(error)
                            });
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
                    BackPrevPage();
                })
            },300)
        }else{
            console.log(openkeyprints.msg);
            if(ISBG == true){
                AcsSwitch.SetAcs('B', 4, 0);                
            }else{
                AcsSwitch.SetAcs('B', 2, 0);                
            };
            AcsSwitch.SetAcs('C', 1, 0);              // 密码键盘灯关
            $.Writelog('------打开密码键盘失败-----');
            MachineBGPOS.TL_EjectCard();
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
        clearInterval( timeLXpressed );
        $.layerClose();
        $.Writelog('------打开密码键盘失败-----');
        $.Speak('打开密码键盘失败,请退出重试');
        console.log(error);
    })

    $.BackInterval(90,function(){                    // 倒计时 定时返回
        clearInterval( timeLXpressed );
        MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){ // 关闭键盘
            console.log(value);
            MachineBGPOS.TL_EjectCard().then(function(value){
                console.log(value)
            }, function(error){
                console.log(error)
            });
        }, function(error){
            console.log(error)
        }); 
        BackPrevPage();    
    });    

    /* 退卡并返回主界面 - 循环查卡 */
    $(ele + ' .handle.handle-exit').click(function(){
        clearInterval( timeLXpressed );
        AcsSwitch.SetAcs('C', 1, 0);             // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){ // 关闭键盘
            console.log(value);
            MachineBGPOS.TL_EjectCard();
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
            MachineBGPOS.TL_EjectCard();                                  
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
        AcsSwitch.SetAcs('C', 1, 0);             // 密码键盘灯
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        MachineBGPOS.TL_StartSSIPASSTwo( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){   // 关闭键盘
            console.log(value);
            MachineBGPOS.TL_EjectCard();                               
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