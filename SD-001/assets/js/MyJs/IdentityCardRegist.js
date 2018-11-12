var registerMethod = "idcard";

// 各种方式注册
function IdentityCardRegist(){
	IsChildPage(false);                                               // 判断是否为子界面
	$(PAGE).html(identityCardRegistText);
	var ele = '#identityCardRegist';
	$.ExecuteAnimate(ele, 0);
	$.Speak('前选择您要注册的方式');
	// 倒计时   // 定时返回
    $.BackInterval(30);
 	
 	$('.identityCardRegistBrushCard.item').click(function(){          // 身份证注册
 		registerMethod = "idcard";
 		BrushIdCardregister();
 	});	

 	$('.identityCardRegistSocial.item').click(function(){             // 社保卡注册
 		registerMethod = "socialcard";
		socialCardRegister();
 	});	

 	$('.identityCardRegistNoCard.item').click(function(){             // 无证注册
 		registerMethod = "nocard";
		inputIdcardNoregister();
 	});	

	/* 退卡并返回主界面 - 循环查卡 */
    $(ele + ' .printNav').click(function(){
        $.ExitCardAndBackMainPage();
    });
	// 返回上一级
	$.BackPrevPage(ele, ShowMainMenu);
	// 首页
	$.BackIndexPage(ele);	
};

// 刷身份证注册
function BrushIdCardregister(){
	var BackPrevPage = IdentityCardRegist;
	IsChildPage(true);
	var images = 'assets/images/card/input-IDCard.gif';
    if(ISBG == true){
        images = 'assets/images/card/bgdenglu.gif';
    }
	$.BrushIntoIdentity({
	    s: 60,
	    title : '<p>请在图中机器对应的位置放入身份证</p>',
	    imgSrc: images,
	    imgStyle: {
	        width: '600px',
	    },
	    titleStyle:{
	    	fontWeight:'bold'
	    },
	    hasConfirm:false,
	    timeBack: function() {
	        console.log('倒计时结束');
	       	CloseIdentityReader();
	       	BackPrevPage();
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
	        IdentityCreatSucceedCallBack = ConfirmUserInfo
	        OpenIdentityReader();
	    }
	});
}

//确认身份信息 
function ConfirmUserInfo(){
	IsChildPage(true);
	console.log(IdentityInfo);
	$.ConfirmInfo({
	    s: 15,
	    title:"请确认您的身份信息!",
	    titleStyle:{fontWeight:'bold',letterSpacing:'4px'},
	    infoListStyle:{color:'#206fbf'},
	    infoNames: [
	        '姓 名', '性 别', '民 族', '出生年月'
	    ],
	    infoValues: [
	        IdentityInfo.PatientName, IdentityInfo.Gender==1 ?"男":"女", IdentityInfo.Nation, IdentityInfo.DOB
	    ],
	    timeBack: function() {
	        console.log('倒计时结束');   //倒计时
	        // BackPrevPage();
	        ShowMainMenu(); 
	    },
	    btnBack: function($ele) {
	        console.log($ele);
	        console.log(CreateCardInfo);
	        //点击确认时 请患者输入手机号码
	        if(CreateCardInfo.PatientInfo.Mobile == undefined || CreateCardInfo.PatientInfo.Mobile == ''){
	        	inputPhoneNumber();
	        }else{
	        	registerSuccess();
	        }
	    },
	    homeBack: function($ele) {
	        console.log($ele);
	        ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log('上一页');  //上一页
	        // BackPrevPage();
	        ShowMainMenu(); 
	    },
	    exitBack: function($ele) {
	        console.log($ele);
	        $.ExitCard();           //退卡
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        var userID = {"ZZJCertificate":{"ID":ZZJInfomation.ZZJID},"CardInfo":{"CardNo":IdentityInfo.IDNo,"CardType":5}};
	        $.loading(false,'加载中...');
	        AJAX.Business.QueryPatientInfo(JSON.stringify(userID) ,function(ret){
	        	$.layerClose();
        		console.log(ret);
	        } ,function(ret){
	        	$.layerClose();
        		console.log(ret);
        		var patientInfo = ret.PatientInfo;
        		if(ret.Code == 0){
        			if(patientInfo.IDNo == ''){
        				patientInfo.IDNo = IdentityInfo.IDNo;
        			};
        			CreateCardInfo = {
			            "ZZJCertificate"  : { ID: ZZJInfomation.ZZJID },
			            "PatientInfo": {
			            	'PatientName' : patientInfo.PatientName,
			            	'PatientID'   : patientInfo.PatientID,
			            	'AccountID'   : patientInfo.AccountID,
			            	'IDNo'        : patientInfo.IDNo,
			            	'IDType'      : patientInfo.IDType,
			            	'PatientType' : patientInfo.PatientType,
			            	'Birthday'    : IdentityInfo.DOB,
			            	'Mobile'      : patientInfo.Mobile,
			            	'Gender'      : patientInfo.Gender,
			            	'Address'     : patientInfo.Address,
			            	'Nation'      : patientInfo.Nation,
			            	'Balance'     : IdentityInfo.Balance,
			            	'Profession'  : patientInfo.Profession,
			            },
			            'CardInfo'        : {
			            	'CardNo'      : ret.CardInfo.CardNo,
			            	'CardType'    : 5
			            }
			        };
        		}else{
        			console.log(ret.Msg);
        			$.extend(IdentityInfo, {'IDType':0});
        			CreateCardInfo = {
        				"ZZJCertificate"  : { ID: ZZJInfomation.ZZJID },
        				"PatientInfo"     : IdentityInfo
        			}
        		}
	        }, function(ret){
	        	$.layerClose();
        		console.log(ret);
        		contentError();
	        })
	    }
	});
}

//  输入手机号码
function inputPhoneNumber(){
	IsChildPage(true);
	var BackPrevPage;
	if(registerMethod == "socialcard"){
		BackPrevPage = IdentityCardRegist;
	}
	if(registerMethod == "idcard"){
		BackPrevPage = ConfirmUserInfo;
	}
	$.ImportNumber({
	    s: 30,
	    type: 0,
	    title: '请输入您的手机号码',
	    titleStyle:{fontWeight:'bold'},
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	        var vals = $.CheckTel(val);     // 验证手机号码是否符合格式
	        if(vals != false){
		        $.extend(CreateCardInfo.PatientInfo,{'Mobile':val});
				var newCreatCard = {
	       			'ZZJCertificate' : { ID : ZZJInfomation.ZZJID},
	       			'PatientInfo'    : CreateCardInfo.PatientInfo
		       	};
		       	console.log(newCreatCard);
		       	$.loading(false,'加载中...');
				AJAX.Business.RegisterID( JSON.stringify(newCreatCard), function(ret){
					$.layerClose();
					console.log(ret);
				}, function(ret){
					$.layerClose();
					if(ret.Code == '0'){        						
	       				$.extend(CreateCardInfo,{'CardInfo':ret.CardInfo});
	       				$.extend(CreateCardInfo,{'PatientInfo':ret.PatientInfo});
		       			console.log(CreateCardInfo);
		       			$.ajax({                                 // 实名制验证
				            url:'/api/Business/UpdateIDNo',
				            data:JSON.stringify(CreateCardInfo),
				            type:'post',
				            success:function(ret){
				                var ret = JSON.parse(ret);
				                console.log(ret);
			                    registerSuccess();
				            },error:function(ret){
				                $.Writelog('网络异常，实名制注册失败')
				                contentError();
				            }
				        });
	       			}else{
	       				console.log(注册失败);
	       				$.Speak('注册失败，请退出重试');
	       				contentError(ret.Msg);
	       			}
				}, function(ret){
					$.layerClose();
					console.log(ret);
					contentError();
				});			        	
	        }else{
	        	$.Speak('您输的电话号码格式有误，请重输')
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
	        console.log($ele);
	    }
	});
};

// 注册成功
function registerSuccess(){
	$.HandleCondition({
	    s: 10,
	    btns: ['去挂号', '去预约'],
	    message: '注册成功！',
	    timeBack: function() {
	        console.log('倒计时结束');
	        ShowMainMenu();         // 返回首页
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	    },
	    callBack: function($ele, $msg) {
	        console.log($ele, $msg)
	        // 调用自助机打印机 打印出用户注册的 卡号信息
	        console.log(CreateCardInfo);
	        //打印凭条
	        CreateBarCodeAndPrint(CreateCardInfo); 
	    },
	    yes: function($ele) {
	        console.log($ele);
	        // 挂号页面  当日挂号
			$.extend(CreateCardInfo,{RegType: 2});
			pageType = 'DRGH';
			judgingLogin();
	    },
	    btn2: function($ele) {
	        console.log($ele);
	        // 预约页面  门诊预约
	        $.extend(CreateCardInfo,{RegType: 1});
	        pageType = 'MZYY';
			judgingLoginYuyue();
	    }
	});
};

/*----------------社保卡注册-------------------*/

// 社保卡注册
function socialCardRegister(){
	IsChildPage(true);
	var BackPrevPage = IdentityCardRegist;
	$.BrushIntoIdentity({
	    s: 60,
	    title:'请在图中机器对应的位置放入社保卡',
	    imgSrc:'assets/images/card/into-card.gif',
	    imgStyle: {width: '600px'},
	    titleStyle:{fontWeight:'bold'},
	    hasConfirm:false,
	    timeBack: function() {
	        console.log('倒计时结束');
	        clearInterval(timerDKQStatus);
        	FileSystem.WriterText('D:/ZZJ/Debug/softpos/121.txt',"写入数据"); 
        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        		setTimeout(function(){
        			BackPrevPage();    
        		},1500)
        	},500);
	    },
	    homeBack: function($ele) {
	        console.log($ele);
	        clearInterval(timerDKQStatus);
        	FileSystem.WriterText('D:/ZZJ/Debug/softpos/121.txt',"写入数据"); 
        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        		setTimeout(function(){
        			ShowMainMenu();    
        		},1500);
        	},500);  
	    },
	    prevBack: function($ele) {
	        console.log('上一页');
	        clearInterval(timerDKQStatus);
            
        	FileSystem.WriterText('D:/ZZJ/Debug/softpos/121.txt',"写入数据"); 
        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') ); 
        		setTimeout(function(){
        			BackPrevPage();    
        		},1500); 
        	},500); 
	    },
	    exitBack: function($ele) {
	        console.log($ele);
	        $.Writelog('>>>>>>>>>>>>退卡<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);

        	FileSystem.WriterText('D:/ZZJ/Debug/softpos/121.txt',"写入数据"); 
        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );  
        		setTimeout(function(){
        			$.ExitCardClearInfo();
					$.intoOrExitCard(1, 5);              // 退卡提示   
					// $.ExitCard();                     // 退卡 
        		},1500);  
        	},500);
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        openSocialCardRegisterNo();          // 打卡读卡器,社保卡读卡
	    }
	});
}

// 打卡读卡器,社保卡读卡
function openSocialCardRegisterNo(){
	clearInterval(CheckCardTimer);                   // 清除循环查卡  
    if(ISBG == true){
        AcsSwitch.SetAcs('B', 4, 1);                 // 打卡读卡器灯  -闪烁
    }else{
        AcsSwitch.SetAcs('B', 2, 1);                 // 打卡读卡器灯  -闪烁 
    };
	var BackPrevPage = IdentityCardRegist;
	// MachineBGPOS.OpenDKQ(readCardCOM).then(function(value){                                                // 打开读卡器
 //        var opensocialvalue = JSON.parse(value);
 //        console.log(opensocialvalue);
 //        if(opensocialvalue.Code == 0){
 //            clearInterval(timerDKQStatus);
 //            timerDKQStatus = setInterval(function(){
 //                MachineBGPOS.GetStatusDKQ().then(function(value){                                          // 查卡状态
 //                    var querysocialstatus = JSON.parse(value);
 //                     console.log(querysocialstatus);
 //                    if(querysocialstatus.Code == 0){
 //                        clearInterval(timerDKQStatus);                                                     // 清楚循环查卡

                        MachineBGPOS.ssiRead( JSON.stringify({'Amount' : 0.01}) ).then(function(value){       // 读卡信息
                            var readSocialCardinfo = JSON.parse(value);
                            console.log(readSocialCardinfo);
                            if(readSocialCardinfo.Code == 0){
                                intprt = readSocialCardinfo.IntPrt;
                                resultposdosales = readSocialCardinfo.resultposdosales;
                                var userinfos = {
                                	"PatientInfo"  :{
                                		"PatientName" : resultposdosales.CardName,
	                                	"IDNo"        : resultposdosales.IdNo,
	                                	"Birthday"    : resultposdosales.DBO,
	                                	"Gender"      : (resultposdosales.Sex == '男' ? 1:2),
	                                	"Nation"      : resultposdosales.Nation,
	                                	"Address"     : resultposdosales.Address,
	                                	"PatientID"   : "",
	                                	"AccountID"   : "",
	                                	"IDType"      : "",
	                                	"PatientType" : "",
	                                	"Mobile"      : "",
	                                	"Balance"     : "",
	                                	"Profession"  : ""
                                	},
                                	"ZZJCertificate": { ID: ZZJInfomation.ZZJID }
                                }
                          		console.log(userinfos);
                          		CreateCardInfo = userinfos;

                          		MachineBGPOS.TL_CloseSSICardHandle( JSON.stringify({'IntPrt' : intprt}) ).then(function(value){
                          			console.log(value);
                          			if(ISBG == true){
                                    	AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
	                                }else{
	                                    AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
	                                };
					                MachineBGPOS.TL_EjectCard();
	                          		inputPhoneNumber();
                          		}, function(error){
                          			console.log(error);
                          			if(ISBG == true){
                                    	AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
	                                }else{
	                                    AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
	                                };
					                MachineBGPOS.TL_EjectCard();  
	                          		BackPrevPage();    
                          		});  
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
                                $.Writelog('读社保卡卡信息:');
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
                            $.Writelog('机器故障，查卡状态失败');
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

                    // }else{
                    //     console.log(querysocialstatus.msg);
                    //     $.Writelog('读卡状态:'+ querysocialstatus.msg);
                    // }
            //     }, function(error){
            //         clearInterval(timerDKQStatus);
            //         if(ISBG == true){
            //             AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
            //         }else{
            //             AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
            //         };
		                // MachineBGPOS.TL_EjectCard();  
            //         console.log(error);
            //         $.Writelog('机器故障，查卡状态失败');
            //         $.layer({
            //             msg: '异常，查询卡失败', 
            //             btn: ['确定'],
            //             type: 1,     
            //             time: 6,
            //             bulbSrc: 'assets/images/tip/bulb.png',
            //             yes:function(){
            //                 BackPrevPage();     
            //             }
            //         })
            //     });
            // },1000);
    //     }else{
    //         $.Writelog('打开读卡器失败');
    //         if(ISBG == true){
    //             AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
    //         }else{
    //             AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
    //         };
    //         MachineBGPOS.TL_EjectCard();
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
    //     MachineBGPOS.TL_EjectCard(); 
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
}

/*----------------------------------*/

// 输身份证号 或者 病历号
function inputIdcardNoregister(){
	IsChildPage(true);
	var BackPrevPage = IdentityCardRegist;
	$.ImportNumber({
	    s: 30,
	    type: 1,
	    hasStandby:true,
	    standbyName:'跳过',
	    title: '请输入您的身份证号码',
	    titleStyle:{fontWeight:'bold'},
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, val) {
	        console.log($ele,val);
	        var flag = $.CheckIdentity(val);   // true /false
	        if(flag == true){
	        	console.log('success');
	        	CardInfo = {"ZZJCertificate":{"ID":ZZJInfomation.ZZJID},"CardInfo":{"CardNo":val,"CardType":5}};   // 身份证号注册

	        	inputbasicInfomation();
	        }else{
	        	console.log('error');
	        	$.Speak('您输的身份证号码格式有误，请重输')
	        }
	    },
	    standbyBack: function($ele){
	    	console.log('跳过');
	    	CardInfo = {"ZZJCertificate":{"ID":ZZJInfomation.ZZJID},"CardInfo":{"CardNo":"","CardType":-1}}; 
	    	inputbasicInfomation();
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
	        console.log($ele);
	        $ele.find('div.btn-space .btn-cancel').addClass('grayBg');
	        $.Writelog('输身份证号码注册');
	    }
	});

}

// 输入基本信息
function inputbasicInfomation(){
	console.log(CardInfo);
	IsChildPage(true);    
	$(PAGE).html(noCardRegisterText2);
	addressInit("provinceS", "cityS", "areaS");
	addbirthInit("birthYear", "birthMonth", "birthDay");
	
	var ele = '#noCardRegister';
	$.ExecuteAnimate(ele, 0);
	$.BackInterval(300,inputIdcardNoregister);
	$('.nocard-table .table-content>input').each(function(){
		$(this).click(function(){
			if( $(this).hasClass('clicked') ){
				return;
			}else{
				$(this).addClass('clicked');
				$(this).parents('tr').siblings().find('td.table-content>input').removeClass('clicked');
			}
		})
	});

	// $('.btn-input-gorunp .pingyin').click(function(){            // 拼音输入
	// });
	$('.keyboard-wrap').html('');
	$('#input-characters .keyboard-wrap').CompositeKeyboard({
	    isZzj: true,             // isZzj 是否是自助机运行
	    shift: false,            // shift "shift" 按键是否被按下
	    input: '.input-group .input-text',  // input 目标输入框
	    standby: false,          // standby  备用按键是否启用 - 启用后禁用大小写键
	    standbyName: '手写',     // standbyName 备用按钮名称
	    blankClickHide: false,   // blankClickHide 点击确认按钮是否隐藏键盘
	    standbyClickHide: false, // standbyClickHide 备用按键按下是否隐藏键盘
	    letterCss: {             // letterCss 字母显示元素样式
	        color: '#fff',
	        backgroundColor: '#f00',
	    },
	    isCapitalBig: true,     // isCapitalBig 是否开启大写单选
	    blankback: function(chars, $ele) {                 // 空格确认 
	        console.log(chars, $ele, '键盘确认按钮返回');
	    },
	    charback: function(char) {                         // charback 键盘按键返回
	        console.log(char, '键盘按键返回'); 
	    },
	    shiftback: function(st) {                          // shiftback 拼音键盘大小写状态
	        console.log(st, '拼音键盘大小写状态');
	        $('.nocard-table .table-content>input').each(function(){
	        	if($(this).hasClass('clicked')){
	        		$(this).val( $(this).val() + char );
	        	}
	        })
	    },
	    delback: function(chars) {                         // delback 键盘按键删除返回
	        console.log(chars, '键盘按键删除返回');
	    },
	    hanziback: function(char) {                        // hanziback 汉字选择返回
	        console.log(char, '汉字选择返回');
	        $('.nocard-table .table-content>input').each(function(){
	        	if($(this).hasClass('clicked')){
	        		$(this).val( $(this).val() + char );
	        	}
	        })
	    },
	    standbyback: function($ele) {                      // standbyback 备用按钮返回
	        console.log($ele, '备用按键回调');
	    }
	});
	
	// 手写输入
	// $('.btn-input-gorunp .shouxie').click(function(){
	// 	$('.keyboard-wrap').html('');
	// 	$('#input-characters .keyboard-wrap').writediscern({
	// 	    input: '.input-group .input-text',  // input 目标输入框
	// 	    isZzj: false,                       // isZzj 是否是自助机运行
	// 	    bename: '.bename',                  // bename 第二目标位置 非 input 
	// 	    standby: false,                      // standby  备用按键
	// 	    standbyName: '按钮',                // standbyName 备用按钮名称
	// 	    blankClickHide: false,              // blankClickHide 确认按键按下是否隐藏键盘
	// 	    standbyClickHide: false,            // standbyClickHide 备用按键按下是否隐藏键盘
	// 	    blankback: function(chars, $ele) {  // blankback 确认按钮返回
	// 	        console.log(chars, $ele, '键盘确认按钮返回');
	// 	    },
	// 	    resetback: function($ele) {         // resetback 重置按钮返回
	// 	        console.log($ele, '键盘重置返回');
	// 	    },
	// 	    delback: function(chars, $ele) {    // delback 删除按钮返回
	// 	        console.log(chars, $ele, '键盘按键删除返回');
	// 	    },
	// 	    hanziback: function(char) {         // hanziback 汉字选择返回
	// 	        console.log(char, '汉字选择返回');
	// 	    },
	// 	    standbyback: function($ele) {      // standbyback 备用按钮返回
	// 	        console.log($ele, '备用按钮返回');
	// 	    },
	// 	    writeback: function(_data, _reset) { // writeback 手写返回
	// 	        console.log(_data, '手写返回');
	// 	    }
	// 	});
	// });

	// 手写改成  确认  == > 跳转
	$('.btn-input-gorunp .shouxie').click(function(){
		var name = $('#user-names').val();
		var sex = $('#radioChoise input[name="sex"]:checked').val();

		var month = $("#birthMonth").val();
        if(month < 10){ month = '0'+month }
        var day = $("#birthDay").val();
        if(day<10){ day = '0' + day };
        var userbirth = ''+ $("#birthYear").val() + month + day;

		var province = $("#provinceS").val();
        var city = $("#cityS").val();
        var area = $("#areaS").val();
        var detialAddress = $("#user-address").val();
        if(province == "请选择省份"){ province = '' };
        if(city == "市辖区" || city == "县"){ city = '市' };
        var newAdress = province + city + area + detialAddress;

		if(name != "" && sex != "" && province != "" && detialAddress != ""){
			if(sex == "男"){ gender = 1; };
			if(sex == "女"){ gender = 2; };
			PatientInfo =  {
                'PatientName' : name,
                'IDNo'        : CardInfo.CardInfo.CardNo,
                'Birthday'    : userbirth,
                'Mobile'      : "",
                'Gender'      : gender,
                'Address'     : newAdress,
                'Nation'      : ""
            }
            $.extend( CardInfo,{PatientInfo:PatientInfo} );
            console.log(CardInfo);
            inputPhoneNumberwuzhen();
		}else{
			$.layer({
				msg:"您输入的格式有误，请重输",
				type:1,
				time:6,
				title:'温馨提示',
				btn: ['确认'],  
				bulbSrc: 'assets/images/tip/bulb.png',
				yes:function(){
					console.log("输入格式有误")
				}
			})
		}
	})

	// 重写
	$('.btn-input-gorunp .chonxie').click(function(){
		$('.nocard-table .table-content>input').each(function(){
        	if($(this).hasClass('clicked')){
        		$(this).val('');
        	}
        })
	});

	// 删除
	$('.btn-input-gorunp .shanchu').click(function(){
		$('.nocard-table .table-content>input').each(function(){
        	if($(this).hasClass('clicked')){
        		$(this).val( $(this).val().slice(0,$(this).val().length-1) );
        		if( $(this).val().length <= 0){ $(this).val(''); };
        	}
        })
	});

	/* 退卡并返回主界面 - 循环查卡 */
    $(ele + ' .handle-exit').click(function(){
    	$.ExitCardClearInfo();
    	ShowMainMenu();
    });
	// 返回上一级
	$.BackPrevPage(ele, inputIdcardNoregister);
	// 首页
	$.BackIndexPage(ele);	
}

//  输入手机号码
function inputPhoneNumberwuzhen(){
	IsChildPage(true);
	var BackPrevPage = inputbasicInfomation;
	$.ImportNumber({
	    s: 30,
	    type: 0,
	    title: '请输入您的手机号码',
	    titleStyle:{fontWeight:'bold'},
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, val) {
	        console.log($ele, val);
	        //验证手机号码是否符合格式
	        var vals = $.CheckTel(val);
	        if(vals != false){
		        CardInfo.PatientInfo.Mobile = val;  // 把电话号码加入到 用户信息中
				var newCreatCard = {
	       			'ZZJCertificate' : { ID : ZZJInfomation.ZZJID},
	       			'PatientInfo'    : CardInfo.PatientInfo
		       	};
		       	console.log(newCreatCard);
		       	$.loading(false,'加载中...');
				AJAX.Business.RegisterID( JSON.stringify(newCreatCard), function(ret){
					$.layerClose();
					console.log(ret);
				}, function(ret){
					$.layerClose();
					if(ret.Code == '0'){        						
	       				console.log(ret);
	       				$.Writelog("无证注册成功"+ret.CardInfo.CardNo);
	       				$.extend(CreateCardInfo,{'CardInfo':ret.CardInfo});
	       				$.extend(CreateCardInfo,{'PatientInfo':ret.PatientInfo});
		       			console.log(CreateCardInfo);
		       			registerSuccess();
	       			}else{
	       				console.log(注册失败);
	       				$.Writelog("注册失败"+ret.Msg);
	       				$.Speak('注册失败，请退出重试');
	       				contentError(ret.Msg);
	       			}
				}, function(ret){
					$.layerClose();
					console.log(ret);
					contentError();
				});			        	
	        }else{
	        	$.Speak('您输的电话号码格式有误，请重输')
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
	        console.log($ele);
	    }
	});
};