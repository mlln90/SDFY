var wxTimer;              // 定时器名称
// 当日挂号
function RegisterOntheDay() {
	IsChildPage(true);
	var images = 'assets/images/card/input-IDCard.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgdenglu.gif';
	}
	$.BrushIntoIdentity({
	    s: 60,
	    imgStyle: {
	        width: '600px',
	    },
	    title : '<p>请在图中机器对应的位置</p><p>放入身份证或扫描病历条码</p>',
	    imgSrc: images,
	    btnName: '手输病历号',
	    hasConfirm: true,
	    titleStyle:{
	    	fontWeight:'bold'
	    },
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
	        ShowMainMenu();           // 返回首页
	    },
	    prevBack: function($ele) {
	        // console.log('返回上一页');
	        $.Writelog('-------返回上一页-------');
	        QRScan.Close2();          // 关闭扫条码器
	        CloseIdentityReader();    // 关闭身份证阅读器
	        ShowMainMenu();       
	    },
	    exitBack: function($ele) {
	        // console.log($ele);
	        $.Writelog('-------退出-------');
	        QRScan.Close2();          // 关闭扫条码器
	        CloseIdentityReader();    // 关闭身份证阅读器
	        $.ExitCard();             //退卡
	    },
	    callBack: function($ele) {
	        // console.log($ele);
	        pageType = 'DRGH';
	        $.Writelog('-------当日挂号登录----------');   
	        $.Writelog(pageType);
		    userInfoToCard();        // 同时开启身份证和扫凭条
	    }
	});
}

//  先登录  登录成功后进入自己界面选择 挂号项
function judgingLogin(){	
	if( JSON.stringify(CreateCardInfo) != '{}'){
		CardInfo = CreateCardInfo;
	}
	console.log(CardInfo);
	IsChildPage(false);                            //判断是否为子界面
	$(PAGE).html(RegisterOntheDayText);
	var ele = '#registerOntheDay';
	$.ExecuteAnimate(ele, 0);
    $.BackInterval(30);                           //倒计时   // 定时返回
    $('.user-info').find('li:eq(0)').html('姓名：'+CardInfo.PatientInfo.PatientName);
    $('.user-info').find('li:eq(1)').html('卡号：'+CardInfo.CardInfo.CardNo);
    $('.user-info').find('li:eq(2)').html('年龄：'+ countAges(CardInfo) );

	//点击取消挂号
	$('.registerOntheDayqx.item').click(function(){
		//查看已挂号信息
    	$.loading(false,'加载中请稍后');
    	AJAX.Business.QueryRegInfo( JSON.stringify(CardInfo), function(ret){
    		$.layerClose();
    		console.log(ret);
    	}, function(ret){
    		$.layerClose();
    		if(ret.Code == '0'){					
    			IntroduceInfo = ret.RegisterInfo;	
    			showProjectListOnTheDay();	     // 展示可退号信息		
    		}else{
                noCancelRegister(ret.Msg);       // 提示没有 可取消的挂号信息
    		}
    	}, function(ret){
    		$.layerClose();
    		contentError();
    	});
	});

	 //点击当日挂号
	$('.registerOntheDaygh.item').click(function(){	    
	    $.extend(CardInfo,{RegType:3});
	    $.loading(false,'加载中请稍后');
	    //查看预约记录  判断加号  3表示在挂完号之后医生给特殊患者加号
	    AJAX.Business.QueryAppointment( JSON.stringify(CardInfo), function(ret){
	    	$.layerClose();
	    	console.log(ret);
	    }, function(ret){
	    	$.layerClose();
    		if(ret.Code == '0'){
    			var AppointmentInfo = [];   // 挂号信息 
    			AppointmentInfo = ret.AppointmentInfo;
    			$.extend(CardInfo ,AppointmentInfo[0]); 
                alertmsg();  	            // 弹窗提示用户 是否需要加号预约
    		}else{
    			// 选择科室    RegisterType // 挂号类型 0:普通挂号 3:加号 
    			$.extend(CardInfo,{RegType:2})               
                $.extend(CardInfo,{RegisterType:0});
                departintoClickOnDay();       
    		}
	    }, function(ret){
	    	$.layerClose();
	    	console.log(ret)			
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

//提示框
function alertmsg(){
	$.layer({
	    msg: '<p>系统检测到您有加号,</p><p>请问是否前往缴费?</p>',         // msg 提示信息
	    btn: [ '取消','确认'],         // btn 按钮 - 数组 （最多两个）
	    type: 1,                       // type 类型 [0, 1]
	    time: 6,                       // time 倒计时时间
	    bulb: false,                   // bulb 小灯泡是否显示
	    title: '温馨提示',             // title 提示名称
	    // bulbSrc: 'assets/images/tip/bulb.png', // bulbSrc 灯泡图片路径
	    endExecute: true,              // endExecute 定时时间结束后是否执行确认函数 默认 true
	    yes: function() {              // yes 确认按钮回调  == > 挂加号缴费
	        console.log('确认回调');
	        console.log(CardInfo);     // 展示预约信息
	        var timeS = nowDate().slice(11,13);
	        var timeE = Number(timeS) + 1;
	        var DateTimeSegmentBetween = {
	            "StartTime": nowDate().slice(0,10)+" "+timeS+":00:00",
	            "EndTime"  : nowDate().slice(0,10)+" "+timeE+":00:00",
	        };
	        $.extend(CardInfo,{"DateTimeSegmentBetween":DateTimeSegmentBetween,"Docts":[CardInfo.Doct]} ); 
	        $.extend(CardInfo,{"RegisterType": 3}); 
	        AJAX.Business.queryRegistrFee(JSON.stringify(CardInfo), function(ret){}, function(value){
	        	if(value.Code == 0){
	        		$.Writelog(value.Msg);
        			var doctRegPrice = value;
        			$.extend(CardInfo, {"DoctRegPrice":doctRegPrice});
        			CardInfo.Doct.PriceList[0].Price = CardInfo.DoctRegPrice.Price.Price;
        			console.log(CardInfo);
        			addregisterOntheDay();   
	        	}else{
			        $.Writelog("Code"+value.Code+',MSG'+value.Msg);
					$.Speak(value.Msg);
	        	}
	        }, function(error){
	        	$.Writelog("加号查询挂号费接口异常");
	        });
	    },
	    cancel: function() {           // cancel 取消按钮回调
	        console.log('取消回调');
	        $.extend(CardInfo,{"RegisterType": 3}); // 选择科室     // 0正常挂号 3挂加号
			departintoClickOnDay();
	    }
	});
}

//展示挂加号的信息 
function addregisterOntheDay(){
	console.log(CardInfo);
	IsChildPage(true);  
	$.ConfirmHandleInformation({
	    s: 60,
	    title:'请确认您的加号信息',
	    info: {
	        imgSrc: 'http://201.201.201.34:1111/doctimg/'+CardInfo.Doct.DoctName+'.jpg',
	        doctorName: CardInfo.Doct.DoctName,
	        bodyItem: [
	            {
	                name: '门&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;诊：',
	                value: CardInfo.Dept.DeptName
	            }, {
	                name: '诊&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费：',
	                value: Number(CardInfo.Doct.PriceList[0].Price).toFixed(2)
	            }, {
	                name: '就&nbsp;&nbsp;诊&nbsp;&nbsp;人：',
	                value: CardInfo.PatientInfo.PatientName
	            }
	        ]
	    },
	    timeBack: function() {
	        console.log('倒计时结束');
	        ShowMainMenu();
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();           // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '上一页');
	        judgingLogin();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.ExitCard();
	    },
	    btnBack: function($ele, ret) {
	        console.log($ele, ret);
	        choosePayMethodOnTheDay(); // 进入支付界面
	    },
	    callBack: function($ele) {
	        console.log($ele, '渲染后回调');
	    }
	});
}

//选择科室
function departintoClickOnDay(){
    IsChildPage(true);
    var BackPrevPage = judgingLogin;
    $.SearchItems({
        s: 60,
        hasExit: true,
        titleStyle:{
            fontWeight:'bold',
        },
        showParam: 'DeptName',
        matchParam: 'letter',
        hasSearch: false,
        showlen: 12,
        itemlistStyle: {
            height: '590px'
        },
        itemBack: function($ele, ret) {
            console.log($ele, ret);                                                  // 当前选择的科室
            $.extend(CardInfo,{'Dept':ret});
            console.log(CardInfo);
            if(CardInfo.Dept.DeptName == "急诊科" ){  
        		var DateTimeSegmentBetween = {
		            "StartTime": "00:00",
		            "EndTime"  : "00:00"
		        };
		        $.extend(CardInfo,{"DateTimeSegmentBetween":DateTimeSegmentBetween,"Docts":[{"DoctCode":"","ScheduleId":""}]} );
            	AJAX.Business.queryRegistrFee(JSON.stringify(CardInfo), function(ret){}, function(value){
            		if(value.Code == 0){
            			$.Writelog(value.Msg);
            			var doctRegPrice = value;
            			$.extend(CardInfo, {"DoctRegPrice":doctRegPrice});
            			var doct = {
            				"ScheduleID": "",
            				"DoctCode"  : "",
            				"PriceList" : [{
				                "PriceName": "挂号费",
				                "Price"    : doctRegPrice.Price.Price
				            }]
            			}
            			$.extend(CardInfo, {"Doct":doct});
            			$.extend(CardInfo, {"RegisterType":4});
            			choosePayMethodOnTheDay();
            		}else{
            			$.layer({
						    msg: value.Msg,                                       // msg 提示信息
						    btn: ['确定'],                                        // btn 按钮 - 数组 （最多两个）
						    type: 1,                                              // type 类型 [0, 1]
						    time: 10,                                             // time 倒计时时间
						    bulb: false,                                          // bulb 小灯泡是否显示
						    title: '确认',                                        // title 提示名称
						    bulbSrc: 'assets/images/tip/bulb.png',                // bulbSrc 灯泡图片路径
						    endExecute: true,                                     // endExecute 定时时间结束后是否执行确认函数 默认 true
						    yes: function() {                                     // yes 确认按钮回调
						        $.Writelog("Code"+value.Code+',MSG'+value.Msg);
						        departintoClickOnDay();
						    }
						})
            		}
            	}, function(error){
            		$.Writelog("急诊科查询挂号费接口异常");
            	});
            }else{
            	doctListChooseOnTheDay();        // 选择医生
            }
        },
        timeBack: function() {
            console.log('倒计时结束');
            $.layerClose();
            BackPrevPage();     
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
            // console.log($ele, '渲染后回调');
           	var data2 = { 
           		"ZZJCertificate": { 'ID': ZZJInfomation.ZZJID }, 
   				"UseTo"      : 0 ,                          // 0 表示挂号 1 预约
   				"CardInfo"   : CardInfo.CardInfo,
   				"PatientInfo": CardInfo.PatientInfo
   			};
           	$.loading(false,'加载中请稍后...')
           	AJAX.Business.queryDept( JSON.stringify(data2), function(ret){
           		$.layerClose();
           		// console.log(ret);
           	}, function(ret){
           		$.layerClose();
           		var data = []; 
                if(ret.Code == '0'){
                    for(var i=0; i<ret.Depts.length;i++){
                        data.push( ret.Depts[i] ) ;
                    }
                    _call( data );
                    // if(ZZJInfomation.ZZJID != 22){
                    // 	var jizhenDoct = ret.Doct;
                    // 	$.extend(CardInfo,{"Doct" : jizhenDoct});
                    // }
                }else{
                    $.Speak(ret.Msg);
                    $.Writelog(ret.Msg);
                    $.layer({
					    msg: ret.Msg,        
					    btn: ['确定'],                    
					    type: 1,                           
					    time: 6,                          
					    bulb: false,                       
					    title: '确认',                     
					    bulbSrc: 'assets/images/tip/bulb.png',     
					    endExecute: true,                          
					    yes: function() {    
					    	$.Writelog('查询科室信息：'+ret.Msg);                   
					       	BackPrevPage();
					    }
					});
                }
           	}, function(ret){
           		console.log(ret);
           		$.layerClose();
           		contentError();
           	});
        },
    });
}

// 选择医生 列出医生列表
function doctListChooseOnTheDay(){
	if( CardInfo.hasOwnProperty('Docts') ){
		delete CardInfo['Docts']
	}
	IsChildPage(true);
    var BackPrevPage = departintoClickOnDay;
    $.extend(CardInfo,{"UseTo": 0});                  // 根据传来的参数 查询医生
    console.log(CardInfo);
	$.ChooseDoctor({
	    s: 60,
	    isSpeak: false,
	    titleStyle:{
	        fontWeight:'bold',
	    },
	    itemBtnClass:'.btn-register',
	    nothingMsg:'暂无该科室的医生排班信息，请稍后查询',
	    getItem: GetDoctorGroupOntheDay,
	    itemBtnBack: function($ele, ret) {
	    	console.log(RegisterTakeInfo)
	        console.log($ele, ret, '点击列表按钮');   // 当前选择的医生
	        $.extend(CardInfo,{Docts:[ret]});
	        console.log(CardInfo);
        	choiseDocterRegisterTime();               // 选择医生时间段
	    },
	    timeBack: function() {
	        console.log('倒计时结束');
	        $.layerClose();
	        BackPrevPage();  
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
	    btnBack: function($ele, ret) {
	        console.log($ele, ret)
	    },
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	        console.log(CardInfo);
	        var DateTimeSegmentBetween = {
	            "StartTime": nowDate().slice(0,10)+" 00:00:00",
	            "EndTime": nowDate().slice(0,10)+" 23:59:59"
	        };
	        $.extend(CardInfo,{'DateTimeSegmentBetween':DateTimeSegmentBetween});
	        console.log("查医生调用参数",CardInfo);
	        $.loading(false,'加载中...');
	        AJAX.Business.queryDoct( JSON.stringify(CardInfo), function(ret){
	        	$.layerClose();
	        	console.log(ret);
	        },function(result){
	        	$.layerClose();
	    		RegisterTakeInfo = result;
	    		console.log(RegisterTakeInfo);
	    		if(RegisterTakeInfo.Code == '0'){
		            var docts = RegisterTakeInfo.Docts;
		            var arr= _.uniqBy(docts,'DoctName');
					console.log(arr);
		            _call( arr ); 
				}else{
	    			console.log('查询科室医生挂号信息失败')
	    			outTimeReginster(0);
	    		}	
	        },function(ret){
	        	$.layerClose();
	        	console.log(ret);
	        	contentError();
	        });
		}
	})
}

// 获取挂号医生列表输出 item-group - 必有列 类名
function GetDoctorGroupOntheDay(_val) {
	console.log(_val);
    return `<div class="doctor-group item-group">\
        <div class="cell-item theme-tinge-br-color">\
            <div class="vertical-middle">\
                <img class="img-circle theme-tinge-br-color-1" src="http://201.201.201.34:1111/doctimg/${_val.DoctName}.jpg">\
            </div>\
            <div class="vertical-middle">\
                <p class="theme-tinge-color m-b-s">\
                    <span class="font-28">${_val.DoctName}</span>&nbsp;&nbsp;\
                    <span class="font-24">${_val.LevelName} </span>\
                    <span class="font-24">${_val.DoctIntroduce} </span>\
                </p>\
                <p>\
                    <span class="name">就诊日期</span>\
                    <span class="value">：${_val.SeeTimeBetween.StartTime.slice(0,10)} </span>\
                </p>\
                <p>\
                    <span class="name">坐诊时间</span>\
                    <span class="value">：${_val.SeeTimeBetween.StartTime.slice(11,16)}-${_val.SeeTimeBetween.EndTime.slice(11,16)}</span>\
                </p>\
                
            </div>\
            <div class="vertical-middle">\
                <div class="btn btn-shadow btn-sm gradual-theme btn-radius btn-register">挂号</div>\
            </div>\
        </div>\
    </div>`
}

// 选择医生时间段
function choiseDocterRegisterTime(){
	var BackPrevPage = doctListChooseOnTheDay;
	IsChildPage(true);   
	$.listGroupPanel({
	    s: 90,
	    size: 6,
	    title:'请选择您要挂号的时间段',
	    titleStyle:{fontWeight:'bold'},
	    isBtnInside: true,            // 确认图标在外
	    isRadio: true,
	    hasSelect: true,
	    hasSumary: false,
	    hasConfirm: true,
	    hasSearch: false,
	    selectTime: false,
	    matchParam: 'letter',
	    timeIconSrc: 'assets/images/icons/calendar.png',
	    pageClass: 'page-width',
	    topItems: ['选择', '就诊时间','剩余号源'],
	    bodyItem: ['Date','DeptName'],
	    showParam: [],
	    listGroupStyle: {
	        height: '410px',
	    },
	    itemBack: function($ele, ret) {
	        console.log($ele, ret);
	    },
	    summaryBack: function($ele, ret) {
	        console.log($ele, ret);
	    }, 
	    timeBack: function() {
	        console.log('倒计时结束');
	        $.layerClose();
	        BackPrevPage();
	    },
	    btnBack: function($ele, ret) {
	        console.log(ret);
	        console.log(CardInfo);
	        // 确认 选择医生 及就诊时间
	        for(var i=0;i<CardInfo.doctss.length;i++){
	        	if(ret[0].DoctCode == CardInfo.doctss[i].DoctCode && ret[0].Date.slice(0,5) == CardInfo.doctss[i].SeeTimeBetween.StartTime.slice(11,16) ){
	        		$.extend(CardInfo,{ Doct:CardInfo.doctss[i] });
	        	}
	        }
	        $.extend(CardInfo,{jzsj:ret});
	        if(CardInfo.Doct.RegNum <= 0){
	        	$.layer({
				    msg: `<p>当前剩余号源为0</p><p>请选择其他时间段</p>`, // msg 提示信息
				    btn: ['确定'],                                        // btn 按钮 - 数组 （最多两个）
				    type: 1,                                              // type 类型 [0, 1]
				    time: 15,                                             // time 倒计时时间
				    bulb: false,                                          // bulb 小灯泡是否显示
				    title: '确认',                                        // title 提示名称
				    bulbSrc: 'assets/images/tip/bulb.png',                // bulbSrc 灯泡图片路径
				    endExecute: true,                                     // endExecute 定时时间结束后是否执行确认函数 默认 true
				    yes: function() {                                     // yes 确认按钮回调
				        console.log('当前时间段剩余号源为0,请选择其他时间段');
				        $.Writelog("当前时间段剩余号源为0");
				    }
				})
	        }else{
        		CardInfo.DateTimeSegmentBetween.StartTime = CardInfo.Doct.SeeTimeBetween.StartTime;
        		CardInfo.DateTimeSegmentBetween.EndTime   = CardInfo.Doct.SeeTimeBetween.EndTime;
        		$.loading("加载中...");
        		AJAX.Business.queryRegistrFee(JSON.stringify(CardInfo), function(ret){}, function(value){
        			$.layerClose();
	        		if(value.Code == 0){
	        			$.Writelog(value.Msg);
            			var doctRegPrice = value;
            			$.extend(CardInfo,{"DoctRegPrice":doctRegPrice});
            			CardInfo.Doct.PriceList[0].Price = CardInfo.DoctRegPrice.Price.Price;
            			console.log(CardInfo);
	        			registerSureOnTheDay();  
	        		}else{
	        			$.Writelog(value.Msg);
	        			$.layer({
						    msg: value.Msg,        // msg 提示信息
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
	        		$.layerClose();
	        		$.Writelog("查询挂号费异常");
	        		contentError();
	        	});
		    }
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
	        console.log("查号源入参");
	        console.log(CardInfo);
	        $.loading(false,'加载中...');
	        AJAX.Business.queryDoct( JSON.stringify(CardInfo), function(ret){
	        	$.layerClose();
	        	console.log(ret);
	        },function(result){
	        	$.layerClose();
	    		if(result.Code == '0'){
		            var docts = result.Docts;
		            $.extend(CardInfo,{doctss:docts});
					console.log(docts);
					var arr1 = [];
			        var currentdoctTimes = [];
			        for(var i=0;i<docts.length;i++){
			        	var obj = {
			        		Date     :docts[i].SeeTimeBetween.StartTime.slice(11,16)+'-'+docts[i].SeeTimeBetween.EndTime.slice(11,16),
			        		DoctCode :docts[i].DoctCode,
			        		DeptName :docts[i].RegNum<0?0:docts[i].RegNum
			        	};
			        	arr1.push(obj);
			        }
			        console.log(arr1);
			        for(var j=0;j<arr1.length;j++){
			        	if(CardInfo.Docts[0].DoctCode == arr1[j].DoctCode ){
			        		currentdoctTimes.push(arr1[j])
			        	}
			        }
			        console.log(currentdoctTimes);
			        console.log( $('.footer .date .footer .date').html() );
					function compare(property){
			        	return function(obj1,obj2){
			        		var value1 = Number(obj1[property].slice(0,2)+obj1[property].slice(3,5));
			        		var value2 = Number(obj2[property].slice(0,2)+obj2[property].slice(3,5));
			        		return value1 - value2;
			        	}
			        }
			        var sortObj = currentdoctTimes.sort(compare("Date"));
			        _call(sortObj);
			        $("div.list-group.gray-9 .row-item").each(function(){
			        	var num = $(this).find("span:eq(2)").html();
			        	if(num <= 0){
			        		$(this).addClass("grayColor");
			        	}
			        }) 
				}else{
	    			console.log('查询科室医生挂号信息失败')
	    			outTimeReginster(0);
	    		}	
	        },function(ret){
	        	$.layerClose();
	        	console.log(ret);
	        	contentError();
	        });
	    }
	}); 
}

// 确认挂号信息 
function registerSureOnTheDay(){
	console.log(CardInfo)  
	var BackPrevPage = doctListChooseOnTheDay;
	var regprice = Number(CardInfo.Doct.PriceList[0].Price).toFixed(2);
	$.ConfirmHandleInformation({
	    s: 30,
	    info: {
	        imgSrc: 'http://201.201.201.34:1111/doctimg/'+CardInfo.Doct.DoctName+'.jpg',
	        doctorName: CardInfo.Doct.DoctName,
	        departName: CardInfo.Dept.DeptName,
	        bodyItem: [
	            {
	                name: '就诊时间：',
	                value: `<p class="choise-registertime">${CardInfo.Doct.SeeTimeBetween.EndTime.slice(0,11)},${CardInfo.jzsj[0].Date}</p>`
	            }, {
	                name: '门&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;诊：',
	                value: CardInfo.Dept.DeptName
	            }, {
	                name: '诊&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费：',
	                value: '￥' + regprice
	            }, {
	                name: '就&nbsp;&nbsp;诊&nbsp;&nbsp;人：',
	                value: CardInfo.PatientInfo.PatientName
	            }
	        ]
	    },
	    title: '请确认您选择的医生信息',
	    btnStyle:{
	    	height:'60px',
	    	lineHeight:'60px',
	    	fontSize:'30px'
	    },
	    btnName:'挂号',
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
	    btnBack: function($ele) {
	        console.log($ele);  
	        registerMustKnow()
	    },
	    callBack: function($ele) {
	        console.log($ele, '渲染后回调');
	    },
	});
}

//挂号须知弹窗
function registerMustKnow(){
	var registerMustKnowInfo = `<br/>
			<p style="text-align:left">1.挂号后请按时就诊。</p><br/>
			<p style="text-align:left">2.若不能前去就诊，请提前取消挂号，否则，将对您的信用产生不良影响。</p><br/>
			<p style="text-align:left">3.一天内连续3次取消挂号，将会影响您在医院的信用记录。</p><br/>`;
	$.layer({
	    msg: registerMustKnowInfo,         // msg 提示信息
	    btn: ['确认挂号'],                 // btn 按钮 - 数组 （最多两个）
	    type: 1,                           // type 类型 [0, 1]
	    time: 15,                          // time 倒计时时间
	    bulb: false,                       // bulb 小灯泡是否显示
	    title: '确认挂号信息',             // title 提示名称
	    bulbSrc: 'assets/images/tip/bulb.png',     // bulbSrc 灯泡图片路径
	    endExecute: true,                          // endExecute 定时时间结束后是否执行确认函数 默认 true
	    yes: function() {                          // yes 确认按钮回调
	        // console.log('确认回调');
	        console.log('确认挂号');
		    choosePayMethodOnTheDay();   // 进入 支付选择界面
	    }
	})
};

//进入 支付选择界面
function choosePayMethodOnTheDay(){
	console.log(CardInfo);
	IsChildPage(true);
	var BackPrevPage; 
	if(CardInfo.RegisterType == 0){
		BackPrevPage = registerSureOnTheDay;
	}
	if(CardInfo.RegisterType == 3){
		BackPrevPage = addregisterOntheDay;
	}
	if(CardInfo.Dept.DeptName == "急诊科"){
		BackPrevPage = departintoClickOnDay;
	};
	var regprices = Number(CardInfo.Doct.PriceList[0].Price).toFixed(2);
	$.HandleCondition({
	    s: 60,
	    type: 1,
	    title: '请选择支付方式',
	    btns:['银行卡付款','支付宝付款','微信付款','社保卡付款'],
	    message: '挂号费：￥' + regprices,
	    topImgSrc:'assets/images/tip/failure.png',
	    btnWrapStyle:{marginLeft:'200px',marginRight:'200px'},
	    wrapStyle:{paddingTop:'60px'},
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:true,
	    yes: function($ele) {
        	console.log($ele);
        	pageType = 'DRGH'; 
        	paymethods = 'bank';
        	if(isopenBankPay == true){
        		bankCardPayOnTheDay();          // 银行卡
        	}else{
    			unsupportedClick();
        	}
	    },
	    btn2: function($ele) {
	        console.log($ele);
	        pageType = 'DRGH'; 
	        paymethods = 'zhifuPay';
	        if(isopenWXZFBPay == true){
	        	WeiXinPayOnTheDay();            // 支付宝
	        }else{
	        	unsupportedClick();
	        }
	    },
	    btn3: function($ele) {
	        console.log($ele);
	        pageType = 'DRGH'; 
	        paymethods = 'weiChat';
	        if(isopenWXZFBPay == true){
	        	WeiXinPayOnTheDay();            // 微信
	        }else{
	        	unsupportedClick();
	        }
	    },
	    btn4: function($ele) {
	        console.log($ele);
	        pageType = 'DRGH'; 
	        paymethods = 'social';
	        if(isopenSocialPay == true){
    			socialSecurityCardPayOnTheDay();     // 社保卡
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
	    	clearInterval( timeLXpressed );
	    	$.layerClose();
	    	if(paymethods == "social" || paymethods == "bank"){
	    		AcsSwitch.SetAcs('C', 1, 0);        // 密码键盘灯
		        if(ISBG == true){
		            AcsSwitch.SetAcs('B', 4, 0);                
		        }else{
		            AcsSwitch.SetAcs('B', 2, 0);                
		        }; 
	    	};
	        $.Writelog('病历号：'+CardInfo.CardInfo.CardNo);
	    	$.Writelog('支付金额：'+regprices);
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

//微信 - 支付宝 扫码界面
function WeiXinPayOnTheDay(){
	console.log(CardInfo);
	var imgs = '';                     // 支付背景图片
	var titles = '';
	var payMethod = 0;                 // 支付方式
    if(paymethods == 'weiChat'){       // 微信下单  
    	payMethod = 3;
    	imgs = 'assets/images/bg/sweep-weix.png';
    	titles = '请使用微信扫描二维码缴费';
    }
   	if(paymethods == 'zhifuPay'){      // 支付宝下单  
   		payMethod = 4;
   		imgs = 'assets/images/bg/sweep-ali.png';
   		titles = '请使用支付宝扫描二维码缴费';
   	}
	IsChildPage(true);
	var BackPrevPage = choosePayMethodOnTheDay;
	$.ScanCode({
	    s: 130,
	    title: titles,
	    titleStyle: {fontWeight:'bold'},
	    bgSrc: imgs,
	    hasHome: true,
	    hasPrev: true,
	    hasExit: true,
	    timeBack: function() {
	        console.log('倒计时结束');
	        $.Writelog('倒计时结束');
	        console.log(RechargeAndPaymentInfo); 
	        clearInterval(wxTimer);
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
			    	clearInterval(wxTimer);
	      			ClosetheOrder(ShowMainMenu);    // 关闭订单
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
			    	clearInterval(wxTimer); 		
	        		ClosetheOrder(BackPrevPage);    // 关闭订单
			    }
	        })
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退卡');
	        $.Writelog("点击了退出");
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
			    	clearInterval(wxTimer);    
	      			ClosetheOrder($.ExitCard);      // 关闭订单
			    }
	        })                       
	    },
	    callBack: function($ele, $img) {
	        console.log($ele,$img, '渲染后回调');
	        PAYSTATUES = true;                                            // 支付状态判断
	        var registerprice = Number(CardInfo.Doct.PriceList[0].Price).toFixed(2); // 挂号费
	        console.log(registerprice);
	        var randomNumber = Math.random().toString().substr(2,8);      // 随机数
	        RechargeAndPaymentInfo = {                                    // 微信下单  
		        "ZZJCertificate": { ID: ZZJInfomation.ZZJID },
		        "PayInfo":{
		            "PayMetHod" : payMethod,                              // 支付方式
		            "Amount"    : registerprice,                          // 支付金额
		            'AccountID' : CardInfo.CardInfo.CardNo,
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

				    $.loading(false,'加载中...');
					AJAX.Business.TakeQR( JSON.stringify(RechargeAndPaymentInfo), function(ret){
						$.layerClose();
						console.log(ret);
					}, function(ret){
						$.layerClose();
						if(ret.Code == '0'){
		        			var PayInfo = ret.PayInfo;
		        			if(paymethods == 'weiChat'){   // 微信
		        				console.log('微信TranNo:'+PayInfo.TranNo);
					        	$.Writelog('微信TranNo:'+PayInfo.TranNo);
					        };
					       	if(paymethods == 'zhifuPay'){  // 支付宝
					       		console.log('支付宝TranNo:'+PayInfo.TranNo);
					       		$.Writelog('支付宝TranNo:'+PayInfo.TranNo);
					       	};

		        			var strs = PayInfo.PayUrl;
		        			var ele = $img.parent('.qr-code');
		        			createCodeEWM(ele,strs);                             // 创建二维码
		        			//将商品编号加入 RechargeAndPaymentInfo
		        			$.extend(RechargeAndPaymentInfo,{'PayInfo':PayInfo});
		        			console.log(RechargeAndPaymentInfo);
		        			QueryWeixinOrder();                                  // 循环查单
		        		}else{
		        			console.log(ret.Msg);
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
					}, function(ret){
						$.layerClose();
						console.log(ret);
						$.Writelog('网络异常，微信支付宝下单失败');
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

//进入银行卡支付界面bankCardPay
function bankCardPayOnTheDay(){
	IsChildPage(true);
	var images = 'assets/images/card/paper-in.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgInputBank.gif';
	}
	var BackPrevPage = choosePayMethodOnTheDay;
	$.BrushIntoIdentity({
	    s: 90,
	    title:'<p>请在图中机器对应的位置放入银行卡</p>',
	    imgSrc: images,
	    imgStyle: {width: '600px'},
	    titleStyle:{fontWeight:'bold'},
	    hasConfirm: false,
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
	        		},1500)
	        	},500);
	        }else{
	        	POS.Stop();                             // 中断银联操作
	    		// POS.OutCard("CRT310",testcom);       // 弹卡
	    		setTimeout(function(){
	    			$.Writelog('>>>>>>>>>>>>倒计时结束<<<<<<<<<<<');
	    			BackPrevPage();
	    		},3000);
	        }
	    },
	    homeBack: function($ele) {
	        console.log($ele);
	        clearInterval(timerDKQStatus);
	        if(ZZJInfomation.ZZJID == 7){
	        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        	setTimeout(function(){
	        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
	        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        		setTimeout(function(){
	        			$.Writelog('>>>>>>>>>>>>返回首页<<<<<<<<<<<');
	    				ShowMainMenu();  
	        		},1500)
	        	},500);
	        }else{
		    	POS.Stop();                             // 中断银联操作
	    		// POS.OutCard("CRT310",testcom);       // 弹卡
	    		setTimeout(function(){
	    			$.Writelog('>>>>>>>>>>>>返回首页<<<<<<<<<<<');
	    			ShowMainMenu();
	    		},3000); 
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
	        		},1500)
	        	},500);
	        }else{
	        	POS.Stop();                             // 中断银联操作
	    		// POS.OutCard("CRT310",testcom);       // 弹卡
		        setTimeout(function(){
		        	$.Writelog('>>>>>>>>>>>>返回上一页<<<<<<<<<<<');
	    			BackPrevPage();
	    		},3000);   
	        }     
	    },
	    exitBack: function($ele) {
	        console.log($ele);
	        clearInterval(timerDKQStatus);
	        if(ZZJInfomation.ZZJID == 7){
	        	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        	setTimeout(function(){
	        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
	        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
	        		setTimeout(function(){
	        			$.Writelog('>>>>>>>>>>>>点击退出<<<<<<<<<<<');
						$.ExitCardClearInfo();
						$.intoOrExitCard(0, 5); 
						// $.ExitCard();  //退卡     
	        		},1500)
	        	},500);
	        }else{
	        	POS.Stop();                             // 中断银联操作
	    		// POS.OutCard("CRT310",testcom);       // 弹卡	 
	    		setTimeout(function(){   
	    			$.Writelog('>>>>>>>>>>>>点击退出<<<<<<<<<<<');
					$.ExitCardClearInfo();
					$.intoOrExitCard(0, 5); 
					// $.ExitCard();  //退卡   
				},3000);     
	        }          
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        if(ZZJInfomation.ZZJID == 7 ){
	        	ReadCardInfoAndGetkeys(); 
	        }else{
	        	PosReadBankCard();                  // 新的银联测试方法
	        }
	    }
	});
}

//进入社保卡支付界面 socialSecurityCardPay
function socialSecurityCardPayOnTheDay(){
	IsChildPage(true);
	var images = 'assets/images/card/into-card.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgInputSocial.gif';
	}
	var BackPrevPage = choosePayMethodOnTheDay;
	var registerprice = Number(CardInfo.Doct.PriceList[0].Price).toFixed(2);
	$.BrushIntoIdentity({
	    s: 90,
	    title:'请在图中机器对应的位置放入社保卡',
	    imgSrc: images,
	    imgStyle: {width: '600px'},
	    titleStyle:{fontWeight:'bold'},
	    hasConfirm:false,
	    timeBack: function() {
	        console.log('倒计时结束');
	        $.Writelog('>>>>>>>>>>>>倒计时结束<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);
	        $.layerClose();
        	
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
	        $.Writelog('>>>>>>>>>>>>返回首页<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);

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
	        $.Writelog('>>>>>>>>>>>>上一页<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);
	        
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
	        $.Writelog('>>>>>>>>>>>>退出<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);
        	
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
	        // if( ZZJInfomation.ZZJID == 36 ){
	        	openSocialCardAndReadcardChange();
	        // }else{
	        // 	openSocialCardAndReadcard();         // 打卡读卡器,社保卡读卡
	        // }
	    }
	});
}

// 有挂号信息  展示出来
function showProjectListOnTheDay(){
	var BackPrevPage = judgingLogin;
	IsChildPage(true);   
	$.listGroupPanel({
	    s: 60,
	    size: 5,
	    title:'选择您要取消挂号的项目',
	    titleStyle:{fontWeight:'bold'},
	    isBtnInside: true,     //确认图标在外
	    isRadio: true,
	    hasSelect: true,
	    hasSelectAll: false,   //是否有全选按钮
	    hasSumary: false,
	    hasConfirm: true,
	    hasSearch: false,
	    selectTime: false,
	    matchParam: 'letter',
	    timeIconSrc: 'assets/images/icons/calendar.png',
	    pageClass: '',
	    topItems: ['选择', '挂号时间', '就诊科室', '医师', '就诊金额(￥)'],
	    bodyItem: ['Date', 'DeptName', 'DocName', 'Cost'],
	    showParam: [],
	    listGroupStyle: {
	        height: '420px',
	    },
	    itemBack: function($ele, ret) {
	        console.log($ele, ret);
	    },
	    summaryBack: function($ele, ret) {
	        console.log($ele, ret);
	    }, 
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, ret) {
	        console.log(ret);   //ret ==> 缴费的项目  
	        console.log(IntroduceInfo);
	        var result ={};
	        for(var i=0;i<IntroduceInfo.length;i++){
	        	if( ret[0].Date == IntroduceInfo[i].SeeTime.slice(0,10) && parseFloat(Number(ret[0].Cost)) == parseFloat(Number(IntroduceInfo[i].Total)) && ret[0].DocName == IntroduceInfo[i].Doct.DoctName){
	        		result = IntroduceInfo[i];
	        	}
	        }
	        console.log(result);
	        $.extend(CardInfo,{"RegisterInfo":result});	 
	        $.Writelog('regserilnumber'+result.RegSerialNumber);   
        	$.loading(false,'加载中...');
        	$.Writelog("调用退号接口");
        	if(result.Doct.ExParams.Zffs != "2" && result.Doct.ExParams.Zffs != "1"){
        		AJAX.Business.RefundRegInfo( JSON.stringify(CardInfo), function(ret){    // 退号 
		        	$.layerClose();
		        	console.log(ret);
		        }, function(ret){
		        	$.layerClose();
		        	console.log(ret);
		        	var results = ret;
		        	$.Writelog('Trace'+results.Trace);
		        	$.Writelog('PayId'+results.PayID);
	        		if(results.Code == 0){
	        			// 判断是微信支付宝 还是 银行卡社保退费
	        			// if(result.Doct.ExParams.Zffs != "2" && result.Doct.ExParams.Zffs != "1" ){
	        				$.Writelog("退号成功");
		    				cancelRegister();              // 取消挂号==> 成功
		    	// 		}else{
				   //      	// 冲正  退费
				   //      	$.loading(false,'加载中...');
					  //       MachineBGPOS.TL_CorrectTrade( JSON.stringify({'Trace': results.Trace }) ).then(function(value){
					  //       	$.layerClose();
							// 	var value = JSON.parse(value);
							// 	console.log(value);
							// 	$.Writelog(value.msg);
							// 	if(value.Code == 0){
							// 		$.Writelog("冲正成功");
							// 		var data = {
							// 			'PayID'           : results.PayID,
							// 			'TranceID'        : results.Trace,
							// 			'business_success': true,
							// 			'pay_success'     : results.pay_success,
							// 			'bussiness_type'  : results.bussiness_type,
							// 			'retfund'         : true                             // 10.16
							// 		}
							// 		$.ajax({               // 更新退款状态
							// 			url:'/api/Business/UpdatePaylog',
							// 			data: JSON.stringify(data),
							// 			type:'post',
							// 			success:function(ret){
							// 				var ret = JSON.parse(ret);
							// 				console.log(ret);
							// 				if(ret.Code == 0){
							// 					$.Writelog("更新退款状态成功");
							// 					cancelRegister();
							// 				}else{
							// 					$.Writelog("更新退款状态失败");
							// 					CancelRegisterFaile(ret.Msg);
							// 				}
							// 			},error:function(error){console.log(error)}
							// 		})
							// 	}else{
							// 		$.Writelog("冲正失败");
							// 		CancelRegisterFaile(value.msg);  // 取消挂号==> 失败
							// 	}
							// }, function(error){
							// 	$.layerClose();
							// 	$.Writelog("冲正接口异常");
							// 	console.log(error);
							// 	CancelRegisterFaile();  // 取消挂号==> 失败
							// })
				   //      } 
	        		}else{
	        			console.log(ret.Msg)
	        			CancelRegisterFaile(ret.Msg);  // 取消挂号==> 失败
	        		}
		        }, function(ret){
		        	$.layerClose();
		        	console.log(ret);
		        	CancelRegisterFaile(); 
		        });    
			}else{
				$.layerClose();
				// if(ZZJInfomation.ZZJID == 36 || ZZJInfomation.ZZJID == 22){
				// 	RetreatNumberOfBank();
				// }else{
					$.layer({
						msg: '检测到您是银行卡或者社保退号，请到人工窗口谢谢合作',        
					    btn: ['确定'],                    
					    type: 1,                           
					    time: 10,                          
					    bulb: false,                       
					    title: '确认',                     
					    bulbSrc: 'assets/images/tip/bulb.png',     
					    endExecute: true,                          
					    yes: function() {                       
					        judgingLogin();
					    }
					})
				// }
			}
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        ShowMainMenu();         // 返回首页
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
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	        console.log(CardInfo);
	        var data = [];
	        for(var i=0;i<IntroduceInfo.length;i++){
	        	data[i] = {
	        		Date    : IntroduceInfo[i].SeeTime.slice(0,10),
	        		DocName : IntroduceInfo[i].Doct.DoctName,
	        		Cost    : parseFloat(IntroduceInfo[i].Total).toFixed(2),
	        		DeptName: IntroduceInfo[i].Dept.DeptName
	        	}
	        }
	        console.log(data);
	        _call(data);
	    }
	})
};

//取消挂号
function cancelRegister(){
	IsChildPage(true);
	var BackPrevPage = judgingLogin;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title:'取消成功！如有需要请再次挂号！',
	    message: '取消成功！如有需要请再次挂号！',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:true,
	    btns: [null, null],
	    timeBack: function() {
	        console.log('倒计时结束');
	        // BackPrevPage();
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

//提示没有可取消的挂号订单
function noCancelRegister(msg){
	IsChildPage(true);
	var BackPrevPage = judgingLogin;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: '没有可取消的挂号订单',
	    message: msg,
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:true,
	    btns: [null, null],
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	        // ShowMainMenu();
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

//提示取消挂号失败
function CancelRegisterFaile(msg){
	IsChildPage(true);
	var BackPrevPage = judgingLogin;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: msg?msg:'取消挂号失败，请稍后重试',
	    message: msg?msg:'取消挂号失败，请稍后重试',
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

// 缴费成后 微信 支付宝 查单
var queryWeChatOrderPayStatus;           //查单状态
function QueryWeixinOrder(){
	clearInterval(wxTimer);
	queryWeChatOrderPayStatus = false;
	wxTimer = setInterval(function(){
		// 微信/支付宝 循环查单
		AJAX.Business.QueryPayStatus( JSON.stringify(RechargeAndPaymentInfo), function(ret){
			console.log(ret);
		}, function(ret){
			if(ret.Code == '0' && !queryWeChatOrderPayStatus){
				clearInterval(wxTimer);
				queryWeChatOrderPayStatus = true;
				console.log(ret);
				var PayInfo = ret.PayInfo;
				$.Writelog('微信支付宝查单'+ PayInfo.TranNo);
				$.extend(RechargeAndPaymentInfo.PayInfo,{'TranNo':PayInfo.TranNo});
				$.extend(RechargeAndPaymentInfo,{"TranceID": PayInfo.TranNo});
				$.extend(CardInfo,RechargeAndPaymentInfo);

				console.log(RechargeAndPaymentInfo);
				console.log(CardInfo);
				successAndPaying();				
			}else{
				console.log('查单失败');
			}
		}, function(ret){
			$.Writelog('网络异常，查单失败'+ ret);
		});
	},2500);
}

// 支付成功 挂号交易
function successAndPaying(){
	IsChildPage(true);
	var BackPrevPage = judgingLogin;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: '正在挂号中，请稍后...',
	    message: '正在挂号中，请稍后...',
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
			$.loading(false,'正在挂号中...');
		    AJAX.Business.Register( JSON.stringify(CardInfo), function(ret){
		    	$.layerClose();
		    	console.log(ret);
		    }, function(ret){
		    	$.layerClose();
		    	if(ret.Code == '0'){
					console.log(ret);
					console.log('挂号成功，请按时就诊！');
					$.Writelog('挂号成功，打印凭条！');
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
					successRegisterOntheday();
					rechargeSucceed(CardInfo);
				}else{
					console.log(ret.Msg);
					$.Writelog('挂号失败'+ret.Msg);
					errorAndBackMoney(ret.Msg);
				}
		    }, function(ret){
		    	$.layerClose();
		    	console.log('网络异常，挂号失败');
		    	$.Writelog('网络异常，挂号失败');
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
	});
}

// 挂号成功 
function successRegisterOntheday(){
	IsChildPage(true);
	$.HandleCondition({
	    s: 15,
	    type: 1,
	    title:'挂号成功，请按时就诊！',
	    message: '挂号成功，请按时就诊！',
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
        		TranceID : CardInfo.PayInfo.TranNo==""?CardInfo.TranceID:CardInfo.PayInfo.TranNo,
        		business_success: true,
        		pay_success     : true,
        		business_type   : 0,
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
	        ShowMainMenu();        
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

// 挂号失败 
function errorAndBackMoney(msg){
	IsChildPage(true);
	var BackPrevPage = judgingLogin;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: msg?msg:'挂号失败，退款将在一到三个工作日内到账',
	    message: msg?msg:'挂号失败，退款将在一到三个工作日内到账',
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
	        wxRefundPay(); 
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

// 微信/支付宝退费、退单
function wxRefundPay(){
	$.loading(false,'加载中...');
	$.Writelog('支付宝微信挂号失败退款');
	AJAX.Business.RefundPay( JSON.stringify(RechargeAndPaymentInfo), function(ret){
		$.layerClose();
		console.log(ret);
	}, function(ret){
		$.layerClose();
		if(ret.Code == '0'){
			console.log(ret.Msg);
			$.Writelog('退款成功:'+ret.Msg);
			$.Speak('退单成功，退款将在1到3个工作日到账');
			setTimeout(function(){
				ShowMainMenu();	
			},5000)
		}else{
			console.log(ret.Msg);
			$.Writelog('退款失败:'+ret.Msg);
			$.Speak(ret.Msg);
			$.layer({
			    msg: ret.Msg,        
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
			});
		}
	}, function(ret){
		$.layerClose();
		console.log(ret);
		$.Writelog('网络异常');
		$.layer({
		    msg: '网络异常，请联系客服人员进行退款',        
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
		});
	});
};

// 关闭订单  
function ClosetheOrder(_call){
	var backprover;
	if(_call == undefined){
		backprover = ShowMainMenu;
	}else{
		backprover = _call;
	}
	var closepaydata = RechargeAndPaymentInfo;
	console.log(closepaydata);
	if(closepaydata.PayInfo.TranNo != ''){
		$.Writelog('关闭订单:'+ closepaydata.PayInfo.TranNo);
		$.loading(false,'关闭订单中...');
		AJAX.Business.ClosePay( JSON.stringify(closepaydata), function(ret){
			$.layerClose();
			console.log(ret);
		}, function(ret){
			console.log(ret);
			$.layerClose();
			if(ret.Code == '0'){
				$.Writelog('关闭订单返回Code为0,'+ret.Msg);
				console.log('关闭订单返回Code为0,'+ret.Msg);
				backprover();
			}else{
				$.Writelog('关闭订单返回Code为非0,'+ret.Msg);
				console.log('关闭订单返回Code为非0,'+ret.Msg);
				backprover();
			}
		}, function(ret){
			$.layerClose();
			console.log('网络异常，关闭订单失败');
			$.Writelog('网络异常，关闭订单失败');
			$.layer({
			    msg: '网络异常，请联系客服人员进行退款',        
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
			});
		});
	}else{
		console.log('交易TranNo为空，如有缴费成功需人工退费');
		$.Writelog('交易TranNo为空，如有缴费成功需人工退费');
		backprover();
	}
}






// 银联退号    == 》
function RetreatNumberOfBank(){
	var refundJSH = JSON.parse(CardInfo.RegisterInfo.Doct.ExParams.Jsh);
	console.log("退号参数",refundJSH);

	if(CardInfo.ZZJCertificate.ID == refundJSH.zzjid ){
		var datas = {
			"PaylogInfo": {
	            "id"   : JSON.parse( CardInfo.RegisterInfo.Doct.ExParams.Jsh ).id,  // 支付payid     
	            // "time" : "",                               // 支付时间
	            // "zzjid": CardInfo.ZZJCertificate.ID,       // 自助机ID
	            // "patientname": CardInfo.PatientInfo.PatientName,            // 患者姓名
	            // "zzjserialnumber": "",                     // 流水号
	            // "cardno"   : CardInfo.CardInfo.CardNo,     // 病历号
	            // "amount"   : undefined,                    // 支付金额
	            // "trance_id": "",                           // 交易单号
	            // "paymethod": CardInfo.RegisterInfo.Doct.ExParams.Zffs       // 支付方式
			}
		}
		AJAX.Business.SelectPaylog(JSON.stringify(datas), function(ret){}, function(value){
			console.log(value);
			if(value.Code == 0){
				var payinfo = value.PaylogInfo[0].tag;
				console.log(payinfo);
				console.log(typeof payinfo);

				AJAX.Business.RefundRegInfo( JSON.stringify(CardInfo), function(ret){    // 退号 
				   	console.log(ret);
			    }, function(ret){
				   	$.layerClose();
				   	console.log(ret);
				   	var results = ret;
				   	$.Writelog('Trace'+results.Trace);
				   	$.Writelog('PayId'+results.PayID);
					if(results.Code == 0){
				        MachineBGPOS.TL_CorrectTrade( payinfo ).then(function(value){   // 冲正  退费
							var value = JSON.parse(value);
							console.log(value);
							$.Writelog(value.msg);
							if(value.Code == 0){
								$.Writelog("冲正成功");
								var data = {
									'PayID'           : results.PayID,
									'TranceID'        : results.Trace,
									'business_success': true,
									'pay_success'     : results.pay_success,
									'bussiness_type'  : results.bussiness_type,
									'retfund'         : true                             // 10.16
								}
								$.ajax({               // 更新退款状态
									url:'/api/Business/UpdatePaylog',
									data: JSON.stringify(data),
									type:'post',
									success:function(ret){
										var ret = JSON.parse(ret);
										console.log(ret);
										if(ret.Code == 0){
											$.Writelog("更新退款状态成功");
											cancelRegister();
										}else{
											$.Writelog("更新退款状态失败");
											CancelRegisterFaile(ret.Msg);
										}
									},error:function(error){console.log(error)}
								})
							}else{
								$.Writelog("冲正失败");
								CancelRegisterFaile(value.msg);  // 取消挂号==> 失败
							}
						}, function(error){
							$.Writelog("冲正接口异常");
							console.log(error);
							CancelRegisterFaile();  // 取消挂号==> 失败
						})
					}else{
						console.log(ret.Msg)
						CancelRegisterFaile(ret.Msg);  // 取消挂号==> 失败
					}
				}, function(ret){
				   	console.log(ret);
				   	CancelRegisterFaile(); 
				}); 
			}else{
				console.log("查询payinfo失败");
				console.log(value.Msg);
			}
		}, function(error){
			console.log(error);
		});
	}else{
		
	}

}