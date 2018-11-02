var wxTimerself;       //定时器名称

//自助缴费
function SelfHelpPayment(){
	IsChildPage(true);          //判断是否为子界面
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
	        QRScan.Close2();
	        CloseIdentityReader();
	       	ShowMainMenu();             // 返回首页
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
	        ShowMainMenu();             // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log('上一页');
	        QRScan.Close2();
	        CloseIdentityReader();
	        ShowMainMenu();     
	    },
	    exitBack: function($ele) {
	        console.log($ele);
	        QRScan.Close2();
	        CloseIdentityReader();
	        $.ExitCard();               //退卡
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        $.Writelog('-------自助缴费登录--------');
	        pageType = 'ZZJF';
		    userInfoToCard();                      // 同时开启身份证和扫凭条
	    }
	});
}

// 登录界面
function judgingLoginSelf(){
	console.log(CardInfo);
	IsChildPage(false);          //判断是否为子界面
	$(PAGE).html(SelfHelpPaymentText);
	var ele = '#selfHelpPayment';
	$.ExecuteAnimate(ele, 0);
	//倒计时   // 定时返回
    $.BackInterval(30);
    $('.user-info').find('li:eq(0)').html('姓名：'+CardInfo.PatientInfo.PatientName);
    $('.user-info').find('li:eq(1)').html('卡号：'+CardInfo.CardInfo.CardNo);
    $('.user-info').find('li:eq(2)').html('年龄：'+ countAges(CardInfo) );

    $('.selfHelpPaymentjf.item').click(function(){
    	$.loading(false,'正在查询请稍后');
    	AJAX.Business.QueryRecipes(JSON.stringify(CardInfo),function(ret){
    		$.layerClose();
    		console.log(ret);
    	},function(ret){
    		$.layerClose();
    		var result = ret;
    		console.log(result);
            var data = []; 
            if(result.Code == '0'){
				if(result.RecipesInfo.length > 0){
		    		for(var i=0;i<result.RecipesInfo.length;i++){
		    			data[i] = {
		    				Date    : result.RecipesInfo[i].PayTypeName,
		    				DeptName: result.RecipesInfo[i].RegisterInfo.Dept.DeptName,
		    				DocName : result.RecipesInfo[i].RegisterInfo.Doct.DoctName,
		    				Cost    : result.RecipesInfo[i].Total,
		    				DoctCode: result.RecipesInfo[i].RegisterInfo.Doct.DoctCode,
		    				RecipesID:result.RecipesInfo[i].RecipesID
		    			}
		    		}
		    		InformationQueryInfo = data;
		    		RegisterTakeInfo = result.RecipesInfo;
		    		listOfPaymentItems();
		    	}else{
		    		console.log('暂无可缴费的处方信息');
	    			noMustPayInfo(result.Msg);
		    	}
	    	}else{
	    		console.log('暂无可缴费的处方信息');
	    		failSearchPayInfo(result.Msg);
	    	}
    	},function(ret){
    		$.layerClose();
    		contentError();
    	});
	});           	
	$('.selfHelpPaymentmx.item').click(function(){
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
		    		for(var i=0;i<result.RecipesInfo.length;i++){
		    			data[i] = {
		    				Date    : result.RecipesInfo[i].PayDate.slice(0,10),
		    				PayTypeName:result.RecipesInfo[i].PayTypeName,
		    				DeptName: result.RecipesInfo[i].RegisterInfo.Dept.DeptName,
		    				DocName : result.RecipesInfo[i].RegisterInfo.Doct.DoctName,
		    				Cost    : result.RecipesInfo[i].Total,
		    				DoctCode: result.RecipesInfo[i].RegisterInfo.Doct.DoctCode,
		    				RecipesID:result.RecipesInfo[i].RecipesID
		    			}
		    		}
		    		console.log(data);
		    		InformationQueryInfo = data;
		    		RegisterTakeInfo = result.RecipesInfo;
		    		listOfPaymentItemsMX();
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

//缴费项目列表
function listOfPaymentItems(){
	var BackPrevPage = judgingLoginSelf;
	IsChildPage(true);   
	$.listGroupPanel({
	    s: 60,
	    size: 4,
	    titleStyle:{fontWeight:'bold'},
	    isBtnInside: true,     //确认图标在外
	    isRadio: false,
	    hasSelect: true,
	    hasSelectAll: true,   //是否有全选按钮
	    hasSumary: true,
	    hasConfirm: true,
	    hasSearch: false,
	    selectTime: false,
	    matchParam: 'letter',
	    timeIconSrc: 'assets/images/icons/calendar.png',
	    pageClass: '',
	    topItems: ['选择', '支付类型名称', '就诊科室', '医师', '就诊金额(￥)','查看详情'],
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
	        var doctsInfo;
	        for(var k=0;k<RegisterTakeInfo.length;k++){
	        	if(ret.Date == RegisterTakeInfo[k].PayTypeName && ret.Cost == RegisterTakeInfo[k].Total){
	        		doctsInfo = RegisterTakeInfo[k];
	        		break;
	        	}
	        }
	        readDetialSelf(doctsInfo,0);     // 查看详情页
	    }, 
	    timeBack: function() {
	        console.log('倒计时结束');
	        BackPrevPage();
	    },
	    btnBack: function($ele, ret) {
	        console.log($ele, ret, '确认');   // ret ==> 缴费的项目  
	        console.log(RegisterTakeInfo);
	        var rets = [];
	        for(var i=0;i<ret.length;i++){
	        	for(var j=0;j<RegisterTakeInfo.length;j++){
	        		if(ret[i].Date == RegisterTakeInfo[j].PayTypeName && ret[i].Cost == RegisterTakeInfo[j].Total && ret[i].DoctCode == RegisterTakeInfo[j].RegisterInfo.Doct.DoctCode && ret[i].RecipesID == RegisterTakeInfo[j].RecipesID ){
	        			rets.push(RegisterTakeInfo[j]);
	        		}
	        	}
	        }
	        console.log(rets);
	        $.extend(CardInfo,{RecipesInfo:rets});
	        // 查询选中处方 自费详情 及金额
	        SelfATM();
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
	        var data = InformationQueryInfo;
	        console.log( transframArray(data) );
	        _call( transframArray(data) );
	    }
	})
};

// 消费明细列表
function listOfPaymentItemsMX(){
	var  BackPrevPage = judgingLoginSelf;
	IsChildPage(true);   
	$.listGroupPanel({
	    s: 60,
	    size: 5,
	    title:'选择你要查看的项目详情',
	    titleStyle:{fontWeight:'bold'},
	    isBtnInside: true,     //确认图标在外
	    isRadio: true,
	    hasSelect: false,
	    hasSelectAll: false,   //是否有全选按钮
	    hasSumary: true,
	    hasConfirm: false,
	    hasSearch: false,
	    selectTime: false,
	    matchParam: 'letter',
	    timeIconSrc: 'assets/images/icons/calendar.png',
	    pageClass: '',
	    topItems: ['支付类型名称', '就诊科室', '医师', '就诊金额(￥)','查看详情'],
	    bodyItem: ['PayTypeName', 'DeptName', 'DocName', 'Cost'],
	    showParam: [],
	    listGroupStyle: {
	        height: '458px',
	    },
	    itemBack: function($ele, ret) {
	        console.log($ele, ret);
	    },
	    summaryBack: function($ele, ret) {
	        console.log($ele, ret);
	        console.log(RegisterTakeInfo);
	        var rets;
        	for(var j=0;j<RegisterTakeInfo.length;j++){
        		if( ret.PayTypeName == RegisterTakeInfo[j].PayTypeName && ret.Cost == RegisterTakeInfo[j].Total){
        			rets = RegisterTakeInfo[j];
        			break;
        		}
        	}
	        console.log(rets);
	        // 查看详情
	        readDetialSelf(rets,1); 
	    }, 
	    timeBack: function() {
	        console.log('倒计时结束');
	        $.layerClose();
	        BackPrevPage();
	    },
	    btnBack: function($ele, ret) {
	        console.log($ele, ret, '确认');   //ret ==> 缴费的项目   
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
	        var data = InformationQueryInfo;
	        console.log( transframArray(data) );
	        _call( transframArray(data) );
	    }
	})
}

// 查询选中 处方列表 查询其自费金额  ==> 处方预结算
function SelfATM(){
	console.log(CardInfo);
	$.loading(false,'加载中...');
	AJAX.Business.GetPayPrepare(JSON.stringify({"RecipesInfo":CardInfo.RecipesInfo,"CardInfo":CardInfo.CardInfo,"PatientInfo":CardInfo.PatientInfo}), function(ret){
		$.layerClose();
		console.log(ret);
	}, function(ret){
		$.layerClose();
		if(ret.Code == '0'){
			$.extend(CardInfo.RecipesInfo,ret.RecipesInfo);
			console.log(CardInfo);
			$.Writelog("选择支付方式");
			
			var selfamt = 0;
		    for(var i=0;i<CardInfo.RecipesInfo.length;i++){
		    	selfamt += Number( CardInfo.RecipesInfo[i].SelfAmt );         // 自费
		    }
		    console.log(selfamt);
		    if(selfamt == 0){
		    	// 当缴费金额为0 时 ，直接进行处方交易
		    	$.layer({
			        msg: "系统检测到您需要缴费金额为0元，给予您直接进入结算", 
			        btn: ['确认'],
			        type: 1,     
			        time: 5,
			        title: '温馨提示',  
			        endExecute: true, 
			        bulbSrc: 'assets/images/tip/bulb.png',
			        yes:function(){
			        	registerMoneyEqueryZero();
			        }
			    })
			}else{
				choosePayMethodSelf(); // 选择支付方式
			}
			
		}else{
			contentError(ret.Msg)
		}	
	}, function(ret){
		$.layerClose();
		contentError();

	});
}

// 选择支付方式
function choosePayMethodSelf(){
    var selfamt=0,societyam=0,totals=0;
    for(var i=0;i<CardInfo.RecipesInfo.length;i++){
    	selfamt += Number( CardInfo.RecipesInfo[i].SelfAmt );         // 自费
    	societyam += Number( CardInfo.RecipesInfo[i].SocietyAmt );    // 优惠
    	totals += Number( CardInfo.RecipesInfo[i].Total );            // 总计
    }
    console.log(selfamt,societyam,totals);
	IsChildPage(true);
	var BackPrevPage = listOfPaymentItems;
	$.HandleCondition({
	    s: 60,
	    type: 1,
	    title:'请选择支付方式',
	    btns:['银行卡付款','支付宝付款','微信付款','社保卡付款'],
	    message: '<span>总金额：￥'+totals.toFixed(2)+' </span><span> 社保：￥'+societyam.toFixed(2)+' </span><span style="color:red"> 自费金额：￥'+selfamt.toFixed(2)+' </span>',
	    topImgSrc:'assets/images/tip/failure.png',
	    btnWrapStyle:{marginLeft:'200px',marginRight:'200px'},
	    wrapStyle:{paddingTop:'60px'},
	    hasBulbImg:false,
	    hasHome:true,
	    hasPrev:true,
	    hasExit:true,
	    yes: function($ele) {
        	console.log($ele,'银行卡付款');
        	pageType = 'ZZJF';                     //  页面类型
	        paymethods = 'bank'; 
        	if(isopenBankPay == true){
        		$.Writelog('选择银行卡支付');
    			bankCardPayself();                 // 银行卡
        	}else{
        		unsupportedClick()
        	}
	    },
	    btn2: function($ele) {
	        console.log($ele,'支付宝付款');
	        pageType = 'ZZJF';
	        paymethods = 'zhifuPay';
	        if(isopenWXZFBPay == true){
	        	$.Writelog('选择支付宝支付');
				WeiXinPayslef();
	        }else{
	        	unsupportedClick();
	        }
	    },
	    btn3: function($ele) {
	        console.log($ele,'微信付款');
	        pageType = 'ZZJF';
	        paymethods = 'weiChat';
	        if(isopenWXZFBPay == true){
	        	$.Writelog('选择微信支付');
	        	WeiXinPayslef();
	        }else{
	        	unsupportedClick();
	        }
	    },
	    btn4: function($ele) {
	        console.log($ele,'社保卡付款');
	        pageType = 'ZZJF';
	        paymethods = 'social';
	        if(isopenSocialPay == true){
        		$.Writelog('选择社保支付');
	        	socialSecurityCardPayself();
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
	        console.log($ele, $msg);
	        $.Writelog('病历号：'+CardInfo.CardInfo.CardNo);
	    	$.Writelog('支付金额：'+selfamt.toFixed(2));
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

//暂无可缴费的处方信息
function noMustPayInfo(info){
	IsChildPage(true);
	var BackPrevPage;
	if(pageType == 'DYYW'){
		BackPrevPage = judgingLoginPrinter;
	}
	if(pageType == 'ZZJF'){
		BackPrevPage = judgingLoginSelf;
	}
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: info?info:'没有查询到您的处方信息！',
	    message: info?info:'没有查询到您的处方信息！',
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

//  code = 1 暂无可缴费的处方信息  
function failSearchPayInfo(info){
	IsChildPage(true);
	var BackPrevPage;
	if(pageType == 'DYYW'){
		BackPrevPage = judgingLoginPrinter;
	}
	if(pageType == 'ZZJF'){
		BackPrevPage = judgingLoginSelf;
	}
	$.HandleCondition({
	    s: 30,
	    type: 1,
	    title: info?info:'您暂无可缴费的处方信息！',
	    message: info?info:'您暂无可缴费的处方信息！',
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

//微信 + 支付宝 支付界面
function WeiXinPayslef(){
	console.log(CardInfo);
	IsChildPage(true);
	var BackPrevPage = choosePayMethodSelf;
	var imgs = '';                     // 支付背景图片
	var titles = '';                   // 标题名称
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
   	};
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
	        $.Writelog('倒计时结束');
	        $.layerClose();
	        console.log(RechargeAndPaymentInfo);
	        clearInterval(wxTimerself);
	        ClosetheOrder(BackPrevPage); 
	    },
	    homeBack: function($ele) {
	        console.log($ele, '首页');
	        $.Writelog('点击首页');
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
			    	clearInterval(wxTimerself);
			       	ClosetheOrder(ShowMainMenu);
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
			    	clearInterval(wxTimerself);
			       	ClosetheOrder(BackPrevPage);
			    }
	        })
	    },
	    exitBack: function($ele) {
	        console.log($ele, '退出');
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
			    	clearInterval(wxTimerself);              
			       	ClosetheOrder($.ExitCard);
			    }
	        })
	    },
	    callBack: function($ele, $img) {
	        console.log($ele, '渲染后回调');
	        console.log(CardInfo);
	        PAYSTATUES = true;                                               // 设置打印状态
	        var selfamt=0;
		    for(var i=0;i<CardInfo.RecipesInfo.length;i++){
		    	selfamt += Number( CardInfo.RecipesInfo[i].SelfAmt );        // 自费金额
		    }
		    selfamt = selfamt.toFixed(2);
		    console.log(selfamt);
	        var randomNumberself = Math.random().toString().substr(2,8);     // 随机数
	        RechargeAndPaymentInfo = {                                       // 下单参数  
		        "ZZJCertificate": { ID: ZZJInfomation.ZZJID }, 
		        "PayInfo":{
		            "PayMetHod": payMethod,
		            "Amount"   : selfamt,                                    // 自费金额
		            'AccountID': CardInfo.CardInfo.CardNo,
		            'ExParams'  : null,
		            'ID'        : null,
		            'PayUrl'    : '',
		            'TranNo'    : ''
		        },
		        "SerialNumber": $.GetSerial() + randomNumberself,
		    };
		    console.log('下单参数', RechargeAndPaymentInfo );

		    $.extend(CardInfo,RechargeAndPaymentInfo);
		    console.log("Pay接口参数", CardInfo);
		    AJAX.Business.Pay( JSON.stringify(CardInfo),function(ret){
		    	console.lor(ret)
		    }, function(value){
		    	if(value.Code == 0){
		    		var PayID = value.PayID;
		    		$.Writelog('成功获取PayID:'+PayID);
		    		$.extend(CardInfo,{"PayID": PayID});
					$.extend(RechargeAndPaymentInfo.PayInfo,{ID:PayID});
					$.extend(RechargeAndPaymentInfo,{"PayID": PayID});

					$.loading(false,'加载中...');
				    AJAX.Business.TakeQR(JSON.stringify(RechargeAndPaymentInfo), function(ret){
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
		        			createCodeEWM(ele,strs);
		        			//将商品编号加入 RechargeAndPaymentInfo
		        			$.extend(RechargeAndPaymentInfo,{'PayInfo':PayInfo});
		        			QueryWeixinOrderSelf();      // 循环查单
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
							       	choosePayMethodSelf();
							    }
							});
		        		}
				    }, function(ret){
				    	$.layerClose();
				    	console.log(ret);
				    	$.Writelog('网络异常，下单失败');
		        		contentError()
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
					        choosePayMethodSelf();
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
		    })   
	    }
	})
};

//进入银行卡支付界面bankCardPay
function bankCardPayself(){
	IsChildPage(true);
	var images = 'assets/images/card/paper-in.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgInputBank.gif';
	}
	var BackPrevPage = choosePayMethodSelf;
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
	        $.layerClose();
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
	        			$.Writelog('>>>>>>>>>>>>退卡<<<<<<<<<<<');
						$.ExitCardClearInfo();
						$.intoOrExitCard(0, 5);         // 退卡提示  
						// $.ExitCard();                // 退卡 
	        		},1500)
	        	},500);
	        }else{
	        	POS.Stop();                             // 中断银联操作
	    		// POS.OutCard("CRT310",testcom);       // 弹卡
			    setTimeout(function(){ 
			    	$.Writelog('>>>>>>>>>>>>退卡<<<<<<<<<<<');
					$.ExitCardClearInfo();
					$.intoOrExitCard(0, 5);             // 退卡提示  
					// $.ExitCard();                    // 退卡 
				},3000);    
	        }               
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        if( ZZJInfomation.ZZJID == 7 ){
	        	ReadCardInfoAndGetkeys();
	        }else{
	        	PosReadBankCard();             // 新的银联测试方法
	        }
	    }
	});
}

//进入社保卡支付界面
function socialSecurityCardPayself(){
	IsChildPage(true);
	var images = 'assets/images/card/into-card.gif';
	if(ISBG == true){
		images = 'assets/images/card/bgInputSocial.gif';
	}
	var BackPrevPage = choosePayMethodSelf;
	var registerprice = 0;
	for(var i=0;i<CardInfo.RecipesInfo.length;i++){
        registerprice += Number( CardInfo.RecipesInfo[i].SelfAmt );   // 自费
    }
    registerprice = registerprice.toFixed(2);
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
        		},1500)
        	},500);
	    },
	    prevBack: function($ele) {
	        console.log('上一页');
	        $.Writelog('>>>>>>>>>>>>返回上一页<<<<<<<<<<<');
	        clearInterval(timerDKQStatus);
	       	console.log("写入前", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        	setTimeout(function(){
        		FileSystem.WriterText('D:/ZZJ/Debug/softpos/whilebreak',"111"); 
        		console.log("写入后", FileSystem.ReadAllText('D:/ZZJ/Debug/softpos/whilebreak') );   
        		setTimeout(function(){
        			BackPrevPage();    
        		},1500)
        	},500);
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
					$.intoOrExitCard(1, 5);                        // 退卡提示   
					// $.ExitCard();                               // 退卡  
        		},1500)
        	},500);
	    },
	    callBack: function($ele) {
	        console.log($ele);
	        // if(ZZJInfomation.ZZJID == 36){
	        	openSocialCardAndReadcardChange();
	        // }else{
	        // 	openSocialCardAndReadcard();                   // 打卡读卡器， 查询卡状态
	        // }
	    }
	});
}

// 支付成功 
function successRegisterSelf(){
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
        		PayID    : CardInfo.PayID,
        		TranceID : CardInfo.PayInfo.TranNo==""?CardInfo.Trace:CardInfo.PayInfo.TranNo,
        		business_success: true,
        		pay_success     : true,
        		business_type   : 3,
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

// 缴费成后 查单
var queryWeChatOrderSelfPayStatus;
function QueryWeixinOrderSelf(){
	clearInterval(wxTimerself);
	queryWeChatOrderSelfPayStatus = false;
	wxTimerself = setInterval(function(){
		AJAX.Business.QueryPayStatus(JSON.stringify(RechargeAndPaymentInfo), function(ret){
			console.log(ret);
		}, function(ret){
			if(!queryWeChatOrderSelfPayStatus && ret.Code == '0'){
				clearInterval(wxTimerself);	
				queryWeChatOrderSelfPayStatus = true;	
				console.log(ret);		
				var PayInfo = ret.PayInfo;
				$.Writelog('微信支付宝查单'+ PayInfo.TranNo);
				$.extend(RechargeAndPaymentInfo.PayInfo,{'TranNo':PayInfo.TranNo});
				$.extend(RechargeAndPaymentInfo,{"TranceID": PayInfo.TranNo});
				$.extend(CardInfo,RechargeAndPaymentInfo);
				
				console.log(RechargeAndPaymentInfo);
				console.log(CardInfo);
				bankSuccessAndSelfpaying();  // 调交易接口   获取 PayID
			}else{
				console.log('查单失败');
			}
		}, function(ret){
			console.log(ret);
		});
	},2500)
};

// PayRecipes
function bankSuccessAndSelfpaying(){
	var BackPrevPage = ShowMainMenu;
	$.HandleCondition({
	    s: 60,
	    type: 1,
	    title: '处方交易及打印凭条中，请稍后',
	    message: '处方交易及打印凭条中，请稍后',
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
			var data = {
				PayID    : CardInfo.PayID,
        		TranceID : CardInfo.PayInfo.TranNo==""?CardInfo.TranceID:CardInfo.PayInfo.TranNo,
        		business_success: false,
        		pay_success     : true,
        		bussiness_type  : 3,
        		retfund         : false
			}
			$.extend(CardInfo,data);
		    // $.loading(false,'加载中...');
		    AJAX.Business.PayRecipes(JSON.stringify(CardInfo), function(ret){
		    	// $.layerClose();
		    	console.log(ret);
		    }, function(ret){
		    	// $.layerClose();
		    	console.log(ret);
		    	if(ret.Code == '0'){
					console.log('处方缴费成功，请按时就诊！');
					$.Writelog('处方缴费成功，打印凭条');
					$.extend(CardInfo,{'successRegister':ret});
					successRegisterSelf();
					rechargeSucceedPrint(CardInfo);
				}else{
					console.log('处方缴费失败');
					$.Writelog('!0状态 处方缴费失败');
					wxRefundPaySelf();
				}
		    }, function(ret){
		    	// $.layerClose();
		    	console.log(ret);
		    	console.log('网络异常,处方缴费失败');
				$.Writelog('网络异常,处方缴费失败');
				$.layer({
					msg: '网络异常处方缴费失败，如您有退款或其他疑问请联系客服',        
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
	        console.log($ele, '点击了首页');
	        // ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '点击了上一页');
	        // BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '点击了退出');
	        // $.ExitCard();
	    },
	});
};

// 退费 退单
function wxRefundPaySelf(){
	$.loading(false,'加载中...')
	AJAX.Business.RefundPay(JSON.stringify(RechargeAndPaymentInfo), function(ret){
		$.layerClose();
		console.log(ret);
	}, function(ret){
		$.layerClose();
		if(ret.Code == '0'){
			console.log(ret.Msg);
			$.Writelog("退费成功");
			$.Speak('退单成功，退款将在二十四小时内到账');	
		}else{
			console.log('退单失败');
			$.Writelog("退费失败");
			$.Speak(ret.Msg);
			$.layer({
		        msg: ret.Msg, 
		        btn: ['确认'],
		        type: 1,     
		        time: 5,
		        title: '温馨提示',  
		        endExecute: true, 
		        bulbSrc: 'assets/images/tip/bulb.png',
		        yes:function(){
		        	judgingLoginSelf();
		        }
		    })
		};
	}, function(ret){
		$.layerClose();
		console.log(ret);
		contentError();
	});
};

//查看详情
function readDetialSelf(results,_type){
	var BackPrevPage;
	if(_type == 0){
		BackPrevPage = listOfPaymentItems;
	}else{
		BackPrevPage = listOfPaymentItemsMX;
	}
	IsChildPage(true);  
	$.SummaryPagePanel({
	    s: 60,
	    size: 6,
	    title: '项目详情列表',
	    wrapper: '.content',
	    pageClass: 'summary',
	    // topItems: ['项目名称', '单价(￥)', '数量', '费用类型', '就诊金额(￥)'],
	    // bodyItem: ['ItemName', 'Unit', 'Count', 'Type', 'Total'],
	    topItems: ['项目名称', '数量',  '总金额(￥)'],
	    bodyItem: ['ItemName', 'Count', 'Total'],
	    matchParam: 'letter',
	    itemBack: function($ele, ret) {
	        console.log($ele, ret);
	    },
	    callBack: function($ele, _call) {
	        console.log($ele, '渲染后回调');
	        console.log(results);
	        if(_type == 0){
	        	AJAX.Business.QueryRecipesDetail( JSON.stringify({'RecipesInfo':results}), function(ret){
	        		console.log(ret);
	        	}, function(ret){
	        		if(ret.Code == '0'){
	        			var newArr = [];
				        for(var i=0;i<ret.RecipesInfo.Details.length;i++){
				        	newArr[i] = {
				        		ItemName : ret.RecipesInfo.Details[i].Name,
				        		Unit     : ret.RecipesInfo.Details[i].Price,
				        		Count    : ret.RecipesInfo.Details[i].Count,
				        		Type     : ret.RecipesInfo.Details[i].Code,
				        		Total    : ret.RecipesInfo.Details[i].Total,
				        	}
				        };
				        _call(newArr);
	        		}else{
	        			console.log(ret.Msg);
	        			$.layer({
	        				msg: ret.Msg, 
	        				btn: ['确认'],
	        				type: 1,     
   						 	time: 10,
   						 	bulbSrc: 'assets/images/tip/bulb.png'
	        			})
	        		}
	        	} ,function(ret){
	        		console.log(ret);
	        		contentError();
	        	});
	        }else{
	        	var newArr = [];
		        for(var i=0;i<results.Details.length;i++){
		        	newArr[i] = {
		        		ItemName : results.Details[i].Name,
		        		Unit     : results.Details[i].Price,
		        		Count    : results.Details[i].Count,
		        		Type     : results.Details[i].Code,
		        		Total    : results.Details[i].Total,
		        	}
		        };
		        _call(newArr);
	        } 
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



/**************************************--交易金额为 0 的情况--***********************************************/

function registerMoneyEqueryZero(){
	console.log(CardInfo);
	PAYSTATUES = true;                                               // 设置打印状态
    var selfamt=0;
    for(var i=0;i<CardInfo.RecipesInfo.length;i++){
    	selfamt += Number( CardInfo.RecipesInfo[i].SelfAmt );        // 自费金额
    }
    selfamt = selfamt.toFixed(2);
    console.log(selfamt);
    var randomNumberself = Math.random().toString().substr(2,8);     // 随机数
    RechargeAndPaymentInfo = {                                       // 下单参数  
        "ZZJCertificate": { ID: ZZJInfomation.ZZJID }, 
        "PayInfo":{
            "PayMetHod": 6,                                          // 固定金额为 0 时支付方式为6 
            "Amount"   : selfamt,                                    // 自费金额
            'AccountID': CardInfo.CardInfo.CardNo,
            'ExParams'  : null,
            'ID'        : null,
            'PayUrl'    : '',
            'TranNo'    : ''
        },
        "SerialNumber": $.GetSerial() + randomNumberself,
    };
    console.log('下单参数', RechargeAndPaymentInfo );
    $.extend(CardInfo,RechargeAndPaymentInfo);

    console.log("Pay接口参数", CardInfo);
    AJAX.Business.Pay( JSON.stringify(CardInfo),function(ret){
    	console.lor(ret)
    }, function(value){
    	if(value.Code == 0){
    		var PayID = value.PayID;
    		$.Writelog('成功获取PayID:'+PayID);
    		$.extend(CardInfo,{"PayID": PayID});
			$.extend(RechargeAndPaymentInfo.PayInfo, {ID:PayID});
			$.extend(RechargeAndPaymentInfo, {"PayID": PayID});
			$.extend(RechargeAndPaymentInfo, {"TranceID": RechargeAndPaymentInfo.PayInfo.TranNo});
			$.extend(CardInfo,RechargeAndPaymentInfo);
			
			bankSuccessAndSelfpayingMoneyZero();	
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
			        choosePayMethodSelf();
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
    })   
}

function bankSuccessAndSelfpayingMoneyZero(){
	var BackPrevPage = ShowMainMenu;
	$.HandleCondition({
	    s: 60,
	    type: 1,
	    title: '处方交易及打印凭条中，请稍后',
	    message: '处方交易及打印凭条中，请稍后',
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
			var data = {
				PayID    : CardInfo.PayID,
        		TranceID : CardInfo.PayInfo.TranNo==""?CardInfo.TranceID:CardInfo.PayInfo.TranNo,
        		business_success: false,
        		pay_success     : true,
        		bussiness_type  : 3,
        		retfund         : false
			}
			$.extend(CardInfo,data);
		    // $.loading(false,'加载中...');
		    AJAX.Business.PayRecipes(JSON.stringify(CardInfo), function(ret){
		    	// $.layerClose();
		    	console.log(ret);
		    }, function(ret){
		    	// $.layerClose();
		    	console.log(ret);
		    	if(ret.Code == '0'){
					console.log('处方缴费成功，请按时就诊！');
					$.Writelog('处方缴费成功，打印凭条');
					$.extend(CardInfo,{'successRegister':ret});
					successRegisterSelf();
					rechargeSucceedPrint(CardInfo);
				}else{
					console.log('处方缴费失败');
					$.Writelog('!0状态 处方缴费失败');
					wxRefundPaySelf();
				}
		    }, function(ret){
		    	// $.layerClose();
		    	console.log(ret);
		    	console.log('网络异常,处方缴费失败');
				$.Writelog('网络异常,处方缴费失败');
				$.layer({
					msg: '网络异常处方缴费失败，如您有退款或其他疑问请联系客服',        
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
	        console.log($ele, '点击了首页');
	        // ShowMainMenu();         // 返回首页
	    },
	    prevBack: function($ele) {
	        console.log($ele, '点击了上一页');
	        // BackPrevPage();
	    },
	    exitBack: function($ele) {
	        console.log($ele, '点击了退出');
	        // $.ExitCard();
	    },
	});
};
