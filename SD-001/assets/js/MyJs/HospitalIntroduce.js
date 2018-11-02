var witchChoise;
var doctChoiseInfo = [];
var detpChoise;
// 医院介绍
function HospitalIntroduce() {
    IsChildPage(false);          //判断是否为子界面
	$(PAGE).html(HospitalIntroduceText);
	var ele = '#hospitalIntroduce';
	$.ExecuteAnimate(ele, 0);

	// 倒计时   // 定时返回
    $.BackInterval(30);

    // 点击医院简介  ==>  医院详情  ==> 返回
    $('.hospinto.item').click(function(){
        hospintoClick();
    });
   
    // 点击选择科室  ==>  选择科室  ==>  科室介绍  ==> 返回
    $('.departinto.item').click(function(){
        witchChoise = 'dept';
        departintoClick();
    });

    // 医生介绍  ==>  选择医生  ==>  医生介绍  ==> 返回
    $('.doctinto.item').click(function(){
        witchChoise = 'doct';
        departintoClick();
    });

    // 参保查询  ==> 社保平台接口
    $('.socialinto.item').click(function(){
        if(ZZJInfomation.ZZJID == 22 ){
            // url = 'http://139.0.1.99:9393/ebf/dev/devHomepage/devHomepage.jsp?pageType=MENU3&amp';
            userSocialInfoQuery();
        }else{
            unsupportedClick();
        }
    })

    /* 退卡并返回主界面 - 循环查卡 */
    $(ele + ' .printNav').click(function(){
        $.ExitCardAndBackMainPage();
    });
	// 返回上一级
	$.BackPrevPage(ele, ShowMainMenu);
	// 首页
	$.BackIndexPage(ele);
};

//医院简介
function hospintoClick(){
    IsChildPage(true);
    var BackPrevPage = $.TransformPage;
    /* 医院介绍 */
    $.HospitalInfo({
        s: 60,
        hasExit: false,
        animateStyle: {
            height: '680px'
        },
        info:'<img src="assets/images/bg/hospital1.jpg">'
            + '<p class="color:#206fbf">'
            + ' 广东医科大学顺德妇女儿童医院（佛山市顺德区妇幼保健院）是三级甲等妇幼保健院，全区唯一妇女儿童专科医院，是顺德唯一获省卫计委批准开展人类辅助生殖（试管婴儿）技术的医院，是广东省高等医学院校教学医院和暨南大学医学院研究生培养基地，是广东医科大学顺德妇女儿童医院。'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '医院是全区妇幼保健技术指导中心，担负着全区各镇妇产科和新生儿科危重病人的抢救工作。全区的新生儿急救中心、新生儿疾病筛查中心、产前诊断筛查中心、小儿神经疾病治疗中心、婚前检查中心、科学育儿指导中心、出生缺陷干预中心、危重症孕产妇救治中心、顺德区产科质量控制中心、顺德区儿科医疗质量控制中心等诊疗中心设在我院。 “广东省妇幼保健院乳腺病防治中心”顺德分中心、“广东省妇幼保健院宫颈疾病防治中心”顺德分中心落户我院。医院现有佛山市「十三五」医学重点专科 1 个、佛山市「十三五」医学特色专科 2 个，顺德区医学重点专科 4 个、顺德区临床重点专科 4个。'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '医院坚持走“大专科、小综合”的发展之路，年门诊量近80万人次，年住院病人2.5万人次。现开放床位530张，有工作人员700余人，有高、中级职称280多人，有各学科研究生以上学历人员近30人，院内有十多位专家赴英国、澳大利亚、日本、新加坡、意大利等国留学进修。医院妇产科系统、儿科系统、生殖系统技术力量强，专家荟萃。'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '妇产医院（设有产科、妇科、生殖中心、外科、乳腺专科、内科、男性专科等科室）产科年接产8500多婴儿，是顺德最大的育婴基地之一。产科根据产妇需求提供产前、产时、产后各种特色服务。妇科专家众多，拥有进口电子腹腔镜 宫腔镜 阴道镜、乳腺钼靶等多种先进设备，年住院病人3000多例。生殖中心自2011年开展夫精人工授精、常规体外受精－胚胎移植(第一代试管婴儿)、卵胞质内单精子注射(第二代试管婴儿)、胚胎冷冻复苏移植技术等。男科技术力量强，对男性各种常见病及疑难杂症疗效显著。外科技术全面，能高质量完成新生儿、儿童、成人各种手术。'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '儿童医院（设有儿科、新生儿科、发育儿科、小儿外科、儿童保健、五官科、口腔科、皮肤科等科室）是顺德技术力量最强、学科最全面、能一站式解除儿童各种疾病的儿童专科医院，儿科、新生儿科每年住院病人5000多人次，年抢救各种危急病儿400多人，成功抢救过体重仅550克的极低体重早产儿和孕龄仅23周的特早产儿。儿童保健科将儿童保健与康复纳入一体化管理，开设了高危儿监测、儿童早期潜能开发、学习障碍矫治以及智力、语言、运动发育落后，成效显著。'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '各主要科室电话：'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '产科：22630425'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '妇科：22632492'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '儿科：22667829'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '男科：22662291　22667862'
            + '</p>'
             + '<p class="color:#206fbf">'
            + '生殖中心：22662133'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '儿童保健科：22667810'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '新生儿急救中心：22630452 　　　'
            + '</p>'
            + '<p class="color:#206fbf">'
            + '外科/乳腺科住院部　22634559  '
            + '</p>',
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
        callBack: function($ele) {
            console.log($ele, '渲染后回调');
        },
    });
};

//选择科室
function departintoClick(){
    IsChildPage(true);
    var BackPrevPage = $.TransformPage;
    /* 搜索选项 */
    $.SearchItems({
        s: 60,
        hasExit: false,
        titleStyle:{
            fontWeight:'bold',
        },
        showParam: 'DeptName',
        // items:GetDepartmentsDatas(),
        matchParam: 'letter',
        hasSearch: false,
        showlen: 12,
        itemlistStyle: {
            height: '590px'
        },
        itemBack: function($ele, ret) {
            // 当前选择的科室信息
            console.log($ele, ret);
            detpChoise = ret
            if(witchChoise == 'dept'){
                departmentDetialInfo();
            }
            if(witchChoise == 'doct'){
                doctListChoose();
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
        callBack: function($ele, _call) {
            console.log($ele, '渲染后回调');   
            var data2 = JSON.stringify({ "ZZJCertificate": { 'ID': ZZJInfomation.ZZJID }, "UseTo": 2 });
            $.loading(false,'正在加载中');
            $.ajax({
                url:'/api/Business/queryDept',
                data:data2,
                type:'post',
                success:function(ret){
                    $.layerClose();
                    var result = JSON.parse(ret);
                    var data = []; 
                    if(result.Code == '0'){
                        for(var i=0; i<result.Depts.length;i++){
                            data[i] = result.Depts[i];
                        }
                        console.log(data);
                        _call( data );
                    }else{
                        console.log('查询科室信息失败');
                        $.layer({
                            msg: result.Msg, 
                            btn: ['确认'],
                            type: 1,     
                            time: 6,
                            bulbSrc: 'assets/images/tip/bulb.png',
                            yes: function(){
                                BackPrevPage();
                            }
                        })
                    }
                },error:function(){
                    $.layer({
                        msg: msg?msg:'网络异常，请稍后再试', 
                        btn: ['确认'],
                        type: 1,     
                        time: 6,
                        bulbSrc: 'assets/images/tip/bulb.png',
                        yes: function(){
                            BackPrevPage();
                        }
                    })
                }
            });    
        },
    });
}

//当前的科室信息
function departmentDetialInfo(){
    IsChildPage(true);
    var BackPrevPage = departintoClick;
    $.ItemSummaryGroup({
        s: 60,
        // type: 1,
        hasExit: false,
        // hasHeader:false,
        name: detpChoise.DeptName,
        job: '地址：'+detpChoise.Address,
        visit: '科室代码：'+detpChoise.DeptCode,
        pageClass:'text-detial-color',
        info: '<p>' + htmlEscape( detpChoise.DeptIntroduce ) + '</p>',
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
        callBack: function($ele) {
            console.log($ele, '渲染后回调');
        },
    });
}

//医生介绍
function doctListChoose(){
    doctChoiseInfo = [];
    console.log(detpChoise);
    console.log(witchChoise);
    IsChildPage(true);
    var BackPrevPage = departintoClick;
    $.ChooseDoctor({
        s: 60,
        hasExit: false,
        titleStyle:{
            fontWeight:'bold',
        },
        itemBtnClass:'.btn-register',
        title:'查看医生详情',
        getItem: GetDoctorGroup,
        itemBtnBack: function($ele, ret) {
            console.log($ele, ret, '点击列表按钮')
            //医生介绍
            doctorDetialInfo(ret);
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
            var data2 = JSON.stringify({ "ZZJCertificate": { 'ID': ZZJInfomation.ZZJID }, "UseTo": 2 });
            $.loading(false,'正在加载中');
            $.ajax({
                url:'/api/Business/queryDoct',
                data:data2,
                type:'post',
                success:function(ret){
                    $.layerClose();
                    var result = JSON.parse(ret);
                    if(result.Code == '0'){
                        for(var i=0; i<result.Docts.length;i++){
                            if( detpChoise.DeptCode == result.Docts[i].ExParams.DeptId ){
                                doctChoiseInfo.push(result.Docts[i]); 
                            }
                        } 
                        console.log(doctChoiseInfo); 
                        _call( doctChoiseInfo );
                    }else{
                        console.log('查询信息失败');
                        $.layer({
                            msg: result.Msg, 
                            btn: ['确认'],
                            type: 1,     
                            time: 6,
                            bulbSrc: 'assets/images/tip/bulb.png',
                            yes: function(){
                                BackPrevPage();
                            }
                        })
                    } 
                },error:function(ret){
                    $.layer({
                        msg: msg?msg:'网络异常，请稍后再试', 
                        btn: ['确认'],
                        type: 1,     
                        time: 6,
                        bulbSrc: 'assets/images/tip/bulb.png',
                        yes: function(){
                            BackPrevPage();
                        }
                    })
                }
            });    
        },
    });
}

// 获取挂号医生列表输出 item-group - 必有列 类名
function GetDoctorGroup(_val) {
    console.log(_val)
    return ` <div class="doctor-group item-group">\
        <div class="cell-item theme-tinge-br-color">\
            <div class="vertical-middle">\
                <img class="img-circle theme-tinge-br-color-1" src="http://201.201.201.34:1111/doctimg/${_val.DoctName}.jpg">\
            </div>\
            <div class="vertical-middle">\
                <p class="theme-tinge-color m-b-s">\
                    <span class="font-28">${_val.DoctName}</span>&nbsp;\
                </p>\
                <p>\
                    <span class="name">医生职称</span>\
                    <span class="value">：${_val.LevelName}</span>\
                </p>\
                <p>\
                    <span class="name">医生代码</span>\
                    <span class="value">：${_val.DoctCode}</span>\
                </p>\
            </div>\
            <div class="vertical-middle">\
                <div class="btn btn-shadow btn-sm gradual-theme btn-radius btn-register">查看</div>\
            </div>\
        </div>\
    </div>`
}


//当前医生的详细信息
function doctorDetialInfo(ret){
    console.log(ret);
    IsChildPage(true);
    var BackPrevPage = doctListChoose;
    $.ItemSummaryGroup({
        s: 60,
        type: 1,
        hasExit: false,
        // hasHeader:false,
        name:ret.DoctName,
        info: '<p>'+htmlEscape( ret.DoctIntroduce )+'</p>',
        visit: ret.DoctCode,
        titleStyle:{height:'200px'},
        imgSrc: "http://201.201.201.34:1111/doctimg/"+ret.DoctName+".jpg",
        job: ret.LevelName,
        pageClass:'text-detial-color',
        hasExit: true,
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
        callBack: function($ele) {
            console.log($ele, '渲染后回调');
        },
    });
}

// 社保平台 查询接入
function userSocialInfoQuery(){
    IsChildPage(true);          // 判断是否为子界面
    $(PAGE).html(SocialintoText);
    var ele = '#socialintoText';
    $.ExecuteAnimate(ele, 0);
    var BackPrevPage = HospitalIntroduce;
   
    // $.BackInterval(60);     // 倒计时  



    // 返回上一级
    $(ele + ' .handle-group .handle-prev').one('click', function() {
        $.TheKeySound();
        $.Writelog('------返回上一级-----');
        BackPrevPage();
    })

    // 返回首页
    $(ele + ' .handle-group .handle-home').one('click', function() {
        $.TheKeySound();
        $.Writelog('------返回首页-----');
        ShowMainMenu();
    })
   
}

