// 门诊预约
function OutpatientAppointment() {
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
	    titleStyle:{
	    	fontWeight:'bold'
	    },
	    btnName: '手输病历号',
	    hasConfirm:true,
	    timeBack: function() {
	        console.log('倒计时结束');
	        // MachineScan.CloseScanner();
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
	       // 页面类型
	       pageType = 'MZYY';    // 门诊预约
	       userInfoToCard();     // 同时开启身份证和扫凭条
	    }
	});
}

// 登录后展示  查看挂号信息
function judgingLoginYuyue(){
	if( JSON.stringify(CreateCardInfo) != '{}'){
		CardInfo = CreateCardInfo;
	}
	console.log(CardInfo);
	IsChildPage(false);
	$(PAGE).html(OutpatientAppointmentText);
	var ele = '#outpatientAppointment';
	$.ExecuteAnimate(ele, 0);
	//倒计时   // 定时返回
    $.BackInterval(30);

    $('.user-info').find('li:eq(0)').html('姓名：'+ CardInfo.PatientInfo.PatientName);
    $('.user-info').find('li:eq(1)').html('卡号：'+ CardInfo.CardInfo.CardNo);
    $('.user-info').find('li:eq(2)').html('年龄：'+ countAges(CardInfo) );
    // $('.user-info').find('li:eq(2)').html('身份证号：'+CardInfo.PatientInfo.IDNo);

    //点击预约挂号
	$('.outpatientAppointmentgh.item').click(function(){		
      	makeAnAppointment();   //选择科室
	});

	//点击取消预约挂号
	$('.outpatientAppointmentqx.item').click(function(){
		// 查看已预约信息
		console.log(CardInfo);
		$.loading(false,'加载中...');
		AJAX.Business.QueryAppointment(JSON.stringify(CardInfo),function(ret){
			$.layerClose();
			console.log(ret);
		},function(ret){
			$.layerClose();
			var appointmentInfo = {};    //预约信息
			if(ret.Code == '0'){
    			appointmentInfo = ret.AppointmentInfo;
				//判断是否有预约信息
	    		if(appointmentInfo.length > 0){
	    			$.extend(CardInfo,{'AppointmentInfo':appointmentInfo});
	    			doctListChooseOutpatientList();
	    		}else{
                    // 提示没有 可取消的挂号信息
                    noCancelRegisterYuyue();
	        	}
	        }else{
	        	console.log(ret.Msg);
	        	noCancelRegisterYuyue();
	        }
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

//预约挂号  科室
function makeAnAppointment(){
	IsChildPage(true);
    var BackPrevPage = judgingLoginYuyue;
    /* 搜索选项 */
    $.SearchItems({
        s: 60,
        hasExit: true,
        titleStyle:{
            fontWeight:'bold',
        },
        // items: GetDepartmentsData(),
        nothingMsg: '查询不到科室的列表信息，请稍后再试',
        showParam: 'DeptName',
        matchParam: 'letter',
        hasSearch: false,
        showlen: 12,
        itemlistStyle: {
            height: '590px'
        },
        itemBack: function($ele, ret) {
            //拿到当前选择的科室信息
            console.log($ele, ret);
            $.extend(CardInfo,{'Dept':ret})
            doctListChooseReginster();
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
        callBack: function($ele, _call) {
            console.log($ele, '渲染后回调');
            var data2 = JSON.stringify({ "ZZJCertificate": { 'ID': ZZJInfomation.ZZJID },  
                    "UseTo": 1,     // 0 表示挂号 1预约
                });
            AJAX.Business.queryDept(data2, function(ret){
            	console.log(ret.Msg)
            }, function(ret){
            	var result = ret;
                var data = []; 
                if(result.Code == '0'){
                    for(var i=0; i<result.Depts.length;i++){
                        data[i] = result.Depts[i];
                    }
                    console.log(data)
                    _call( data );
                }else{
                    console.log('查询科室信息失败');
                    contentError(ret.Msg);
                }
            }, function(ret){
            	console.log(ret)
            	contentError();
            });   
        },
    });
} 

// 选择医生 列出医生列表
function doctListChooseReginster(){
	if( CardInfo.hasOwnProperty('Docts') ){
		delete CardInfo['Docts']
	}
    IsChildPage(true);
    var BackPrevPage = makeAnAppointment;
	$.ChooseDoctor({
        s: 60,
        isSpeak: false,
        titleStyle:{
            fontWeight:'bold',
        },
        itemBtnClass:'.btn-register',
        title:'请选择预约医生',
        nothingMsg:'暂无该科室的医生排班信息，请稍后查询',
        getItem: GetDoctorGroupOutpatientyuyue,
        itemBtnBack: function($ele, ret) {
	        console.log(ret);       //ret ==> 当前科室选择的医生信息 (但是还未选择时间)
	        $.extend(CardInfo,{'Doctm':ret})
	        console.log(CardInfo);
            //选择医生时间
            chooseRegisterTime();
        },
        timeBack: function() {
            console.log('倒计时结束');
            $.layerClose();
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
            console.log($ele, '渲染后回调');
            //根据传来的参数 查询医生
		    $.extend(CardInfo,{"UseTo": 1});
		    console.log(CardInfo);
            $.loading(false,'正在查询请稍后');
            AJAX.Business.queryDoct(JSON.stringify(CardInfo),function(ret){
            	$.layerClose();
            	console.log(ret)
            },function(result){
            	$.layerClose();
            	RegisterTakeInfo = result;
            	console.log(RegisterTakeInfo);
	    		if(RegisterTakeInfo.Code == '0'){		            
		            var docts = RegisterTakeInfo.Docts;
		            //过滤重复的医生  
		            var arr= _.uniqBy(docts,'DoctName');
					console.log(arr);
		            _call( arr ); 
				}else{
	    			console.log('查询科室医生预约信息失败')
	    			outTimeReginster(1);
	    		}
            });
		}
	})  
}

// 预约挂号医生列表输出 item-group - 必有列 类名
function GetDoctorGroupOutpatientyuyue(_val) {
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
                    <span class="name">预约类别</span>\
                    <span class="value">：${_val.LevelName}</span>\
                </p>\
            </div>\
            <div class="vertical-middle">\
                <div class="btn btn-shadow btn-sm gradual-theme btn-radius btn-register">预约</div>\
            </div>\
        </div>\
    </div>`
}

// 选择预约时间
function chooseRegisterTime(){
	console.log(RegisterTakeInfo);
	console.log(CardInfo.Doctm);   //当前选择的医生
	var arr = [];
	var currentdoctTimes = [];
	for(var i=0;i<RegisterTakeInfo.Docts.length;i++){
    	var obj = {
    		StartTime : RegisterTakeInfo.Docts[i].SeeTimeBetween.StartTime.slice(0,10),
    		Date: RegisterTakeInfo.Docts[i].SeeTimeBetween.StartTime.slice(11,16)+'-'+RegisterTakeInfo.Docts[i].SeeTimeBetween.EndTime.slice(11,16),
    		DoctCode : RegisterTakeInfo.Docts[i].DoctCode,
    		DoctName : RegisterTakeInfo.Docts[i].DoctName};
    	arr.push(obj);
    }
	console.log(arr);
	// 当前选择医生的所有时间 日期
	for(var j=0;j<arr.length;j++){
		if(CardInfo.Doctm.DoctCode == arr[j].DoctCode && CardInfo.Doctm.DoctName == arr[j].DoctName){
			currentdoctTimes.push(arr[j]);
		}
	}
	console.log(currentdoctTimes);   // 当前选择医生的所有时间日期
	// 过滤掉相同日期
	var detialdate = _.uniqBy(currentdoctTimes,'StartTime');
	console.log(detialdate);
	var items = [
		$.GetCurrentTime(5,1),$.GetCurrentTime(5,2),
	    $.GetCurrentTime(5,3),$.GetCurrentTime(5,4),
        $.GetCurrentTime(5,5),$.GetCurrentTime(5,6),
        $.GetCurrentTime(5,7)];
    var amItems = [0,0,0,0,0,0,0];
	for(var k=0;k<items.length;k++){
		for(var l=0;l<detialdate.length;l++){
    		if(items[k].date == detialdate[l].StartTime){
    			amItems[k] = 1;
    			continue;
    		}
    	}
    }
    console.log(amItems);

	IsChildPage(true);
 	var BackPrevPage = doctListChooseReginster;
	$.ChooseSubscribeDate({
	    s: 60,
	    amItems: amItems,
	    pmItems: amItems,
	    items: items,
	    showDateParam: 'month',
	    showWeekParam: 'week',
	    itemBack: function($ele, ret) {
	        console.log($ele, ret);   // 当前选择的时间
	        $.extend(CardInfo,ret);
	        // console.log(RegisterTakeInfo.Docts);
	        //根据选择时间 确定医生的 具体信息    
	        for(var i=0;i<RegisterTakeInfo.Docts.length;i++){
	        	if(CardInfo.Doctm.DoctCode == RegisterTakeInfo.Docts[i].DoctCode && ret.data.date == RegisterTakeInfo.Docts[i].SeeTimeBetween.StartTime.slice(0,10)){
	        		$.extend( CardInfo,{ Docts:[RegisterTakeInfo.Docts[i]] } );
	        	}
	        }
			console.log(CardInfo);  
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
	        console.log($ele, ret);
	        console.log(CardInfo);
	        $.loading(false,'加载中...');
	        AJAX.Business.queryDoct(JSON.stringify(CardInfo),function(ret){
	        	$.layerClose();
	        	contentError();
	        },function(rets){
	        	$.layerClose();
	        	console.log(rets.Docts)
				if(rets.Code == '0'){
        			choiseDocterRegisterTimeOutpatient(rets.Docts)
        		}else{
        			console.log(rets.Msg);
  					contentError(rets.Msg);
        		}
	        });
	    },
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	    },
	});
};

// 选择医生时间段
function choiseDocterRegisterTimeOutpatient(currentdocttimes){
	var BackPrevPage = chooseRegisterTime;
	IsChildPage(true);   
	$.listGroupPanel({
	    s: 60,
	    size: 7,
	    title:'请选择您要预约的时间段',
	    titleStyle:{fontWeight:'bold'},
	    isBtnInside: true,     //确认图标在外
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
	        height: '450px',
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
	        console.log(ret);
	        console.log(currentdocttimes);
	        // 确认 选择医生 及就诊时间
	        $.extend(CardInfo,{jzsj:ret});
	        for(var i=0;i<currentdocttimes.length;i++){
	        	if(ret[0].ScheduleID == currentdocttimes[i].ScheduleID && ret[0].Date.slice(0,5) == currentdocttimes[i].SeeTimeBetween.StartTime.slice(11,16)){
	        		$.extend(CardInfo,{Doct:currentdocttimes[i]})
	        	}
	        };
	        console.log(CardInfo);
	        if(CardInfo.Doct.RegNum <= 0){
	        	$.layer({
				    msg: '您选的时间预约已满,请选择其他时间段',        // msg 提示信息
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
	        	registerSure();  
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
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	        var jtime = [];
	        console.log(currentdocttimes);
	        for(var i=0;i<currentdocttimes.length;i++){
	        	var obj = {Date : currentdocttimes[i].SeeTimeBetween.StartTime.slice(11,16)+'-'+currentdocttimes[i].SeeTimeBetween.EndTime.slice(11,16),
	        			   StartTime  :currentdocttimes[i].SeeTimeBetween.StartTime.slice(0,10),
	        			   ScheduleID :currentdocttimes[i].ScheduleID,
	        			   DeptName   :currentdocttimes[i].RegNum
	        			};
	        	jtime.push(obj)
	        }
	        console.log(jtime);
	        function compare(property){
	        	return function(obj1,obj2){
	        		var value1 = Number(obj1[property].slice(0,2)+obj1[property].slice(3,5));
	        		var value2 = Number(obj2[property].slice(0,2)+obj2[property].slice(3,5));
	        		return value1 - value2;
	        	}
	        }
	        var sortObj = jtime.sort(compare("Date"));
            console.log(sortObj)
            var filtersortObj = [];
	        for(var j=0;j<sortObj.length;j++){
	        	if(CardInfo.noon == '0'){    // 上午
	        		if(sortObj[j].Date.slice(0,2) < 12){
	        			filtersortObj.push(sortObj[j])
	        		}
	        	}else{  // 下午
	        		if(sortObj[j].Date.slice(0,2) > 12){
	        			filtersortObj.push(sortObj[j])
	        		}
	        	}
	        }
	        _call(filtersortObj);
	        $("div.list-group.gray-9 .row-item").each(function(){
	        	var num = $(this).find("span:eq(2)").html();
	        	if(num <= 0){
	        		$(this).addClass("grayColor");
	        	}
	        }) 
	    }
	});
}

// 确认 预约挂号 
function registerSure(){
	var BackPrevPage = doctListChooseReginster;
	$.ConfirmHandleInformation({
	    s: 30,
	    title:'请确认您的预约时间',
	    info: {
	        imgSrc: 'http://201.201.201.34:1111/doctimg/'+CardInfo.Doct.DoctName+'.jpg',
	        doctorName: CardInfo.Doct.DoctName,
	        bodyItem: [
	            {
	                name: '就诊时间：',
	                value: `<p class="choise-registertime">${CardInfo.Doct.SeeTimeBetween.EndTime.slice(0,10)}/${CardInfo.jzsj[0].Date}</p>`
	            }, {
	                name: '就诊科室：',
	                value: CardInfo.Dept.DeptName
	            }, {
	                name: '就诊卡号：',
	                value: CardInfo.CardInfo.CardNo
	            }, {
	                name: '就&nbsp;&nbsp;诊&nbsp;&nbsp;人：',
	                value: CardInfo.PatientInfo.PatientName
	            }
	        ]
	    },
	    btnStyle:{
	    	height:'60px',
	    	lineHeight:'60px',
	    	fontSize:'30px'
	    },
	    btnName:'预约',
	    timeBack: function() {
	        console.log('倒计时结束');
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
	        console.log($ele, ret);
	        registerMustKnowOutpatient();         
	    },
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	    },
	});
}

// 取消挂号展示页面 列出医生列表
function doctListChooseOutpatientList(){
	IsChildPage(true);
    var BackPrevPage = judgingLoginYuyue;
	//根据传来的参数 查询医生
    $.extend(CardInfo,{"UseTo": 1});
    console.log(CardInfo);
	$.ChooseDoctor({
	    s: 60,
	    isSpeak: false,
	    titleStyle:{
	        fontWeight:'bold',
	    },
	    itemBtnClass:'.btn-register',
	    title:'选择要取消预约的医生',
	    nothingMsg:'暂无可取消的医生排班信息，请稍后查询',
	    getItem: GetDoctorGroupOutpatientCancel,
	    itemBtnBack: function($ele, ret) {
	        console.log($ele, ret, '点击列表按钮');   //ret ==> 当前选择的信息
	        console.log(CardInfo);
	        // var Total = ret.Doct.PriceList[0].Price;
	        var Total = null;
	        $.extend(ret,{Total:Total});
	        $.extend(CardInfo,{AppointmentInfo:ret});
	        console.log(CardInfo);
	        // 取消预约
	        AJAX.Business.CancelAppointment(JSON.stringify(CardInfo),function(ret){
	        	console.log(ret);
	        },function(ret){
	        	console.log(ret)
    	 		if(ret.Code == '0'){     			
        			cancelRegisterYuyue();
        		}else{
        			console.log(ret.Msg);
        			contentError(ret.Msg);
        		}
	        }, function(error){
	        	contentError();
	        });
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
	        console.log($ele, '渲染后回调');
	        console.log(CardInfo);
	        var arrOutpatient = [];
	        for(var i=0;i<CardInfo.AppointmentInfo.length;i++){
	        	arrOutpatient.push(CardInfo.AppointmentInfo[i])
	        }
	        _call(arrOutpatient)
		}
	})
}

// 取消挂号医生列表输出
function GetDoctorGroupOutpatientCancel(_val) {
	console.log(_val);
	//${_val.SeeTimeBetween.StartTime.slice(11)}-${_val.SeeTimeBetween.EndTime.slice(11)}
    return `<div class="doctor-group item-group">\
        <div class="cell-item theme-tinge-br-color">\
            <div class="vertical-middle">\
                <img class="img-circle theme-tinge-br-color-1" src="http://201.201.201.34:1111/doctimg/${_val.Doct.DoctName}.jpg">\
            </div>\
            <div class="vertical-middle">\
                <p class="theme-tinge-color m-b-s">\
                    <span class="font-28">${_val.Doct.DoctName}</span>&nbsp;&nbsp;\
                    <span class="font-28">${_val.Doct.DoctIntroduce}</span>&nbsp;\
                </p>\
                <p>\
                    <span class="name">就诊日期</span>\
                    <span class="value">：${_val.Doct.SeeTimeBetween.StartTime.slice(0,16)}-${_val.Doct.SeeTimeBetween.EndTime.slice(11,16)}</span>\
                </p>\
            </div>\
            <div class="vertical-middle">\
                <div class="btn btn-shadow btn-sm gradual-theme btn-radius btn-register">取消</div>\
            </div>\
        </div>\
    </div>`
}


//取消预约
function cancelRegisterYuyue(){
	IsChildPage(true);
	var BackPrevPage = judgingLoginYuyue;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title:'取消成功！如有需要请再次预约!',
	    message: '取消成功！如有需要请再次预约！',
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

//noCancelRegisterYuyue   提示没有可取消的订单
function noCancelRegisterYuyue(){
	IsChildPage(true);
	var BackPrevPage = judgingLoginYuyue;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    message: '您没有预约信息，如有需要请前往预约',
	    title:'您没有预约信息，如有需要请前往预约',
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

//预约挂号须知弹窗
function registerMustKnowOutpatient(){
	console.log(CardInfo);
	var registerMustKnowInfo = `<br/>
			<p style="text-align:left">1.预约后请按时取号就诊。</p><br/>
			<p style="text-align:left">2.若不能前去就诊，请提前取消预约，否则，将对您的信用产生不良影响。</p><br/>
			<p style="text-align:left">3.当月未按时报到累积三次将暂停当月的预约服务，下月自动恢复，谢谢理解配合。</p>`;
	$.layer({
	    msg: registerMustKnowInfo,         // msg 提示信息
	    btn: ['确认预约'],                 // btn 按钮 - 数组 （最多两个）
	    type: 1,                           // type 类型 [0, 1]
	    time: 15,                          // time 倒计时时间
	    bulb: false,                       // bulb 小灯泡是否显示
	    title: '确认预约信息',             // title 提示名称
	    bulbSrc: 'assets/images/tip/bulb.png',     // bulbSrc 灯泡图片路径
	    endExecute: true,                          // endExecute 定时时间结束后是否执行确认函数 默认 true
	    yes: function() {                          // yes 确认按钮回调
	        console.log(CardInfo);
	        $.loading(false,'正在预约中请稍后');
	        // 预约
	        AJAX.Business.Appointment(JSON.stringify(CardInfo),function(ret){
	        	$.layerClose();
	        	console.log(ret)
	        },function(ret){
	        	$.layerClose();
	        	console.log(ret)
        		if(ret.Code == '0'){
        			//进入 预约成功界面
        			outpatientSueecss(); 
        		}else{
        			//预约失败
        			outpatientFaile(ret.Msg)
        		}
	        },function(ret){
	        	$.layerClose();
	        	contentError();
	        });	
	    }
	})
};

//进入 预约成功界面
function outpatientSueecss(){
	IsChildPage(true);
	var BackPrevPage = registerSure;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title:'预约成功，请按时取号就诊！',
	    message: '预约成功，请按时取号就诊！',
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:false,
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
	        console.log($ele, $msg)
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

// 预约失败界面
function outpatientFaile(msg){
	IsChildPage(true);
	var BackPrevPage = registerSure;
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title:'预约失败！',
	    message: msg,
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:false,
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
	        console.log($ele, $msg)
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

//提示当前预约、挂号时间已过 
function outTimeReginster(_type){
	// _type = 0 挂号   1 预约
	var titles = '当前时间没有该科室的信息';
	var BackPrevPage;
	if(_type == 0 || !_type){
		titles = '当前时间没有该科室的挂号信息';
		BackPrevPage = departintoClickOnDay;
	}else{
		titles = '当前时间没有该科室的预约信息';
		BackPrevPage = makeAnAppointment;
	}
	IsChildPage(true);
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: titles,
	    message: titles,
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


// 提示有预约记录
function alertmsgOutpatient(){
	$.layer({
	    msg: '<p>系统检测到您有预约,</p><p>请问是否前往缴费?</p>',         // msg 提示信息
	    btn: [ '取消','确认'],   // btn 按钮 - 数组 （最多两个）
	    type: 1,                 // type 类型 [0, 1]
	    time: 5,                 // time 倒计时时间
	    bulb: false,             // bulb 小灯泡是否显示
	    title: '温馨提示',       // title 提示名称
	    // bulbSrc: 'assets/images/tip/bulb.png', // bulbSrc 灯泡图片路径
	    endExecute: true,        // endExecute 定时时间结束后是否执行确认函数 默认 true
	    yes: function() {        // yes 确认按钮回调
	        console.log('确认回调');
	        //展示预约信息
	        console.log(CardInfo); 
	        pleaseConfirmThePayment();    // ==> ReservationNumber.js
	    },
	    cancel: function() {     // cancel 取消按钮回调
	        console.log('取消回调');
	        //选择科室  
			makeAnAppointment();
	    }
	});
}