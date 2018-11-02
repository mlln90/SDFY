



// 选择日期
$('#choose-date .calendar-start-date').ChooseData({
    target: $('#choose-date .calendar-wrap'),// 嵌入目标
    yearago: 80,           // 向前多少年
    sign: '。',             // 分割符号
    type: 3,               // 选项 1-> 单个(日), 2-> 两个(月,日), 3-> 三个(年,月,日)  
    defaultYear: 2017,     // 默认选中 年
    defaultMonth: 3,   // 默认选中 月
    defaultDay: 2,       // 默认选中 天
    callback: function(ret) { // 选择日期回调
        console.log(ret);
    },
});


// 弹窗
$.layer({
    msg: '提示信息',         // msg 提示信息
    btn: ['按钮1', '按钮2'], // btn 按钮 - 数组 （最多两个）
    type: 0,                // type 类型 [0, 1]
    time: 5,                // time 倒计时时间
    bulb: true,             // bulb 小灯泡是否显示
    title: '提示标题',      // title 提示名称
    bulbSrc: 'assets/images/tip/bulb.png', // bulbSrc 灯泡图片路径
    endExecute: true,       // endExecute 定时时间结束后是否执行确认函数 默认 true
    yes: function() {       // yes 确认按钮回调
        console.log('确认回调');
    },
    cancel: function() {    // cancel 取消按钮回调
        console.log('取消回调')
    }
});

// 关闭弹窗
$.layerClose();

// 全屏提示 - 无倒计时
$.tip(
    '提示信息', // _msg 提示信息
    true      // _isSpeak 是否语音
);

// 加载提示
$.loading(
    true,     // _isSpeak 是否语音
    '提示信息' // _msg 提示信息
);

// 登陆
$.login(function(ret) {
    console.log(ret)
});

// 模拟滑动
$(ele).SimulateScroll({  // ele 需滑动内容外层
    target: $target      // target 需滑动内容
})

// 调用键盘 - 综合键盘
$('#input-characters .keyboard-wrap').CompositeKeyboard({
    isZzj: false,            // isZzj 是否是自助机运行
    shift: false,            // shift "shift" 按键是否被按下
    input: '.input-group .input-text',  // input 目标输入框
    standby: false,          // standby  备用按键是否启用 - 启用后禁用大小写键
    standbyName: '手写',      // standbyName 备用按钮名称
    blankClickHide: false,   // blankClickHide 点击确认按钮是否隐藏键盘
    standbyClickHide: false, // standbyClickHide 备用按键按下是否隐藏键盘
    letterCss: {             // letterCss 字母显示元素样式
        color: '#fff',
        backgroundColor: '#f00',
    },
    isCapitalBig: false,     // isCapitalBig 是否开启大写单选
    blankback: function(chars, $ele) {     // 确认
        console.log(chars, $ele, '键盘确认按钮返回');
    },
    charback: function(char) {   // charback 键盘按键返回
        console.log(char, '键盘按键返回');
    },
    shiftback: function(st) {    // shiftback 拼音键盘大小写状态
        console.log(st, '拼音键盘大小写状态');
    },
    delback: function(chars) {   // delback 键盘按键删除返回
        console.log(chars, '键盘按键删除返回');
    },
    hanziback: function(char) {  // hanziback 汉字选择返回
        console.log(char, '汉字选择返回');
    },
    standbyback: function($ele) {// standbyback 备用按钮返回
        console.log($ele, '备用按键回调');
    }
});

// 可移动键盘
$('#input-characters .input-group .input-text').spellKeyboard({
    top: 500,         // top 定位值
    left: 207,        // left 定位值
    type: 0,          // type 类型 0 - 拼音 1- 输出字母
    isZzj: false,      // isZzj 是否是自助机运行
    zindex: 99,       // 层级值
    bename: $('#input-characters .bename'), // bename 第二目标元素 - 输出字符
    charback: function(ret) {    // charback 字母按键返回
        console.log(ret, '字母按键返回');
    },
    numberback: function(ret) {  // numberback 数字返回
        console.log(ret, '数字按键返回');
    },
    callback: function(ret) {    // callback 类型为1时 按键返回
        console.log(ret, '输入纯字母按键返回');
    },
    closeback: function() {      // closeback 关闭返回
        console.log('关闭');
    },
    delback: function(chars) {   // delback 删除返回
        console.log(chars, '删除返回')
    },
    hanziback: function(char) {  // hanziback 汉字返回
        console.log(char, '汉字选择返回');
    }
})


// 手写
$('#input-characters .keyboard-wrap').writediscern({
    input: '.input-group .input-text',  // input 目标输入框
    isZzj: false,                       // isZzj 是否是自助机运行
    bename: '.bename',                  // bename 第二目标位置 非 input 
    standby: true,                      // standby  备用按键
    standbyName: '按钮',                 // standbyName 备用按钮名称
    blankClickHide: false,              // blankClickHide 确认按键按下是否隐藏键盘
    standbyClickHide: false,            // standbyClickHide 备用按键按下是否隐藏键盘
    blankback: function(chars, $ele) {  // blankback 确认按钮返回
        console.log(chars, $ele, '键盘确认按钮返回');
    },
    resetback: function($ele) {         // resetback 重置按钮返回
        console.log($ele, '键盘重置返回');
    },
    delback: function(chars, $ele) {    // delback 删除按钮返回
        console.log(chars, $ele, '键盘按键删除返回');
    },
    hanziback: function(char) {         // hanziback 汉字选择返回
        console.log(char, '汉字选择返回');
    },
    standbyback: function($ele) {      // standbyback 备用按钮返回
        console.log($ele, '备用按钮返回');
    },
    writeback: function(_data, _reset) { // writeback 手写返回
        console.log(_data, '手写返回');
    }
});

/*
* 办卡 - 刷身份证
* @param s 返回时间
* @param title 标题
* @param imgSrc 图片路径
* @param wrapper 容器
* @param animate 动画
* @param btnName 按钮名称
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnBack 按钮返回
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param imgStyle 图片样式
* @param btnStyle 按钮样式
* @param hasConfirm 是否输出确认按钮
* @param titleStyle 标题样式
*/
var BackPrevPage = function(){};
$.BrushIntoIdentity({
    s: 10,
    imgStyle: {
        width: '600px',
    },
    timeBack: function() {
        console.log('倒计时结束');
        BackPrevPage();
    },
    btnBack: function($ele) {
        console.log($ele);
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

/*
* 确认信息 
* @param s 返回时间
* @param title 标题
* @param subTitle 副标题
* @param wrapper 容器
* @param animate 动画
* @param btnName 按钮名称
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnBack 按钮返回
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param btnStyle 按钮样式
* @param infoNames 展示名称列表
* @param infoValues 展示信息列表
* @param titleStyle 标题样式
* @param infoWrapStyle info-wrap 样式
* @param infoListStyle info-list 样式
* @param infoTitleStyle h2 样式
*/
$.ConfirmInfo({
    s: 10,
    // hasExit: false,
    // hasHome: false,
    infoNames: [
        'one', 'two', 'three'
    ],
    infoValues: [
        2345, 567, 45678, 4567
    ],
    timeBack: function() {
        console.log('倒计时结束');
        BackPrevPage();
    },
    btnBack: function($ele) {
        console.log($ele);
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

/*
* 输入数字 
* @param s 返回时间
* @param type 类型值 0- 手机号 1- 身份证 2-金额 3-每4位分割 4-输入密码
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param btnName 按钮名称
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnBack 按钮返回
* @param numbers 数字列表
* @param inputlen 输入框限制长度
* @param timeBack 倒计时回调
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param itemBack 按键回调\\
* @param hasConfirm 是否开启确认按钮
* @param hasStandby  是否开启备用按钮
* @param standbyName 备用按钮名称
* @param standbyBack 备用按钮回调
* @param btnStyle 按钮样式
* @param titleStyle 标题样式
* @param inputStyle 输入框样式
*/
$.ImportNumber({
    s: 10,
    type: 1,
    title: '请输入您的身份证号码',
    // hasExit: false,
    // hasHome: false,
    timeBack: function() {
        console.log('倒计时结束');
        BackPrevPage();
    },
    btnBack: function($ele, val) {
        console.log($ele, val);
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

/*
* 操作状态页
* @param s 返回时间
* @param yes 第一个按钮回调
* @param btn2 第二个按钮回调
* @param btns 按钮数组
* @param title 标题
* @param message 提示信息
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param timeBack 倒计时返回
* @param callBack 渲染后返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param msgStyle 提示信息样式
* @param btnStyle 按钮样式
* @param topImgSrc 上大图地址
* @param wrapStyle wrap 样式
* @param hasBulbImg 是否输出灯泡图片
* @param bulbImgSrc 灯泡图片地址
* @param topImgStyle 大图样式
* @param bulbImgStyle 灯泡样式
* @param btnWrapStyle 按钮外层样式
*/
$.HandleCondition({
    s: 10,
    type: 1,
    btns: ['one', 'two'],
    message: '办卡成功！',
    btnWrapStyle: {
        //
    },
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
    yes: function($ele) {
        console.log($ele);
    },
    btn2: function($ele) {
        console.log($ele);
    },
    btn3: function($ele) {
        console.log($ele);
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

/*
* 输入字符
* @param s 返回时间
* @param isZzj 是否自助机运行
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnBack 按钮返回
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param titleStyle 标题样式
* @param inputStyle 输入框样式
*/
$.ImportCharacter({
    s: 10,
    timeBack: function() {
        console.log('倒计时结束');
        BackPrevPage();
    },
    btnBack: function($ele, val) {
        console.log($ele, val);
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
        console.log($ele);
    }
});


/*
* 选择性别 
* @param s 返回时间
* @param sex 性别值
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param btnName 按钮名称
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnBack 按钮返回
* @param sexlist 性别列表
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param btnStyle 按钮样式
* @param titleStyle 标题样式
*/
$.ChooseSex({
    s: 60,
    sex: null,
    title: '请选择性别',
    timeBack: function() {
        console.log('倒计时结束');
        BackPrevPage();
    },
    btnBack: function($ele, val) {
        if (val < 0) {
            console.log('请选择性别');
        }
        console.log($ele, val, '确认');
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
    }
});


/*
* 选择日期
* @param s 返回时间
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param btnName 按钮名称
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnBack 按钮返回
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param btnStyle 按钮样式
* @param titleStyle 标题样式
* @param inputStyle 输入框样式
*/
$.ChooseDate({
    s: 60,
    title: '请选择出生日期',
    timeBack: function() {
        console.log('倒计时结束');
        BackPrevPage();
    },
    btnBack: function($ele, val) {
        console.log($ele, val, '确认');
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
    }
});


/*
* 医院介绍
* @param s 返回时间
* @param title 标题
* @param info 医院介绍信息
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param animateStyle animated 样式
*/
$.HospitalInfo({
    s: 60,
    info: '<img src="assets/images/bg/hospital.png">'
    + '<p>'
    + '红星医院(石河子大学医学院哈密临床学院)1945年创建于革命圣地延安，其前身为白求恩国际和平医院第九分院，至今建院70年的历史。经过几代人的努力奋斗，已发展成为哈密地区集医疗、教学、科研、预防、保健、康复为一体的综合性三级甲等医院及全国爱婴医院。现为新疆医科大学、石河子大学医学院教学实习医院，是新疆医科大学第一附属医院、自治区人民医院、兵团医院、兰州军区乌鲁木齐总医院、自治区中医医院的协作医院。是卫生部北京医院、河南省人民医院、河南省中医院、河南省焦作市第一人民医院、河南省焦作市第二人民医院、河南省焦作市妇幼保健医院对口援助医院。'
    + '</p>'
    + '<p>'
    + '医院占地147747平方米，建筑面积45000平方米，医院开放床位755张，2014年度门急诊40万人次，住院2.33万人次，住院手术4563人次，平均住院日10.6天。拥有877名医务人员，专业技术人员747名，护理人员401名，其中享受国务院特殊津贴专家3名，新疆医科大学硕士生导师2名。全院设有临床科室23个，非临床科室14个，职能科室10个。医院以精湛的医疗技术，一流的服务质量，赢得哈密区域内各行各业的赞誉'
    + '</p>'
    + '<p>'
    + '近年来，医院开展了“学习型医院”、“数字化医院”、“节约型医院”、“平安医院”和“三甲医院”的创建活动，取得了较好效果。医院建成了医疗、护理示教室，承担着新疆医科大学、石河子大学医学院实习带教和哈密卫校临床教学及带教任务。医院致力于重点学科建设，目前我院兵团重点学科两个：中医风湿科、肿瘤外科；师级重点专科：心血管内科、骨科、肿瘤外科、脑外科。开展了一系列高难手术：如肝脏肿瘤切除术、多指断指再植和断手断臂再植、颅内巨大肿瘤切除术及各类肿瘤切除术等重大手术，并在哈密地区较早地开展了心血管介入等先进技术。先进的医疗设备及高超的医疗技术，使红星医院在哈密区域医疗卫生系统做到“人无我有，人有我新，人新我精”。'
    + '</p>'
    + '<p>'
    + '医院拥有1.5T核磁共振、64排螺旋CT、直线加速器、全自动生化分析仪、大C臂、飞利浦全数字化大型血管平板造影系统等大中型高精尖医疗设备和较为齐全的常规诊疗设备。'
    + '</p>'
    + '<p>'
    + '全院实行信息化管理，已完成HIS、LIS、电子病历、门诊医生工作站、电子处方等数字化项目建设。建成了以住院医生工作站、护士工作站门诊分诊叫号系统、影像管理系统、合理用药咨询和抗生素使用管理系统、医保控费系统、财务管理系统、HIP物资管理系统等为主要项目的医疗业务网络。'
    + '</p>'
    + '<p>'
    + '近年来，红星医院先后荣获“全国卫生系统先进集体”、“全国卫生系统纪检监察工作先进集体”、“全国卫生系统行业作风建设先进集体”、“全国民族团结先进集体”、“全国卫生系统抗击‘非典’先进集体”、“全国卫生系统思想政治工作先进单位”、“全国医院文化建设先进单位”“全国青年文明号”及自治区、兵团文明单位等多项荣誉称号。'
    + '</p>'
    + '<p>'
    + '红星医院始终坚持以病人为中心的服务理念，以一流的服务、一流的技术、一流的质量、一流的设备、一流的环境，为哈密各族人民提供优质的诊疗保健服务。'
    + '</p>',
    hasExit: false,
    animateStyle: {
        height: '675px'
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
    callBack: function($ele) {
        console.log($ele, '渲染后回调');
    },
});

/*
* 搜索选项
* @param s 返回时间
* @param isZzj 是否自助机运行
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param showlen 输出选项长度
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param itemBack 选择返回
* @param clearBack 清除返回
* @param showParam 输出参数名称 - 必传
* @param hasSearch 是否输出搜索框
* @param searchBack 搜索返回
* @param nothingMsg 未查到信息提示
* @param titleStyle 标题样式
* @param inputStyle 输入框样式
* @param matchParam 匹配参数
* @param isAutomatch 是否自动匹配
* @param placeholder input 占位符
* @param itemlistStyle 输出容器标签样式
*/
$.SearchItems({
    s: 60,
    isZzj: false,
    hasExit: false,
    isAutomatch: true,
    items: GetDepartmentsData(),
    showParam: 'Name',
    matchParam: 'letter',
    itemBack: function($ele, ret) {
        console.log($ele, ret);
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
        _call(GetDepartmentsData())
    },
    searchBack: function($ele, chars, _call) {
        console.log($ele, chars);
    },
    clearBack: function($ele, _call) {
        console.log($ele)
    }
});


/*
* 项目详情
* @param s 返回时间
* @param type 类型
* @param name 名称
* @param job 等级 职位
* @param visit 相关内容
* @param title 标题
* @param info 详情信息
* @param imgSrc 图片地址
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param pageClass 页面类名
* @param hasHeader 是否有头部
* @param titleStyle 标题样式
*/
$.ItemSummaryGroup({
    s: 60,
    // type: 1,
    info: '',
    name: '科室名称',
    job: '省级一级科室',
    visit: '科室主任：掉渣天',
    // hasExit: false,
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

/*
* 列表分页
* @param s 返回时间
* @param isZzj 是否自助机运行
* @param size 分页大小 最大 -6
* @param items 输出数据 - 数组
* @param title 标题
* @param tipMsg 注释信息
* @param wrapper 容器
* @param animate 动画
* @param btnName 按钮名称
* @param isSpeak 是否播放语音
* @param isRadio 是否单选
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnBack 确认返回
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param btnStyle 按钮样式
* @param topItems 头部列表参数 - 数组
* @param bodyItem 内容列表参数 - 数组
* @param pageClass 页面类名
* @param hasSearch 是否可搜索
* @param hasSelect 是否可选择
* @param hasSumary 是否可查看详情
* @param searchBack 搜索返回
* @param selectTime 是否可选时间
* @param hasConfirm 是否有确认按钮
* @param matchParam 匹配参数
* @param nothingMsg 未查到信息提示
* @param titleStyle 标题样式
* @param totalParam 总计参数名称 - number 类型
* @param isAutomatch 是否自动匹配
* @param hasTotalSum 是否输出总计
* @param timeIconSrc 选择时间图标
* @param summaryBack 详情返回
* @param hasSelectAll 是否含有全选按钮
* @param isBtnInside 按钮是否在外
* @param hasNeedSelect 是否需要选择 - true-可选中提交 false-不可选-确认提交全部
* @param clickTimeBack 点击时间图标返回
* @param listGroupStyle 列表外层样式
* @param searchInputHint 搜索框占位符提示
*/
$.listGroupPanel({
    s: 60,
    size: 5,
    isZzj: true,
    // isRadio: true,
    isRadio: false,
    hasSelect: true,
    hasSumary: true,
    hasConfirm: true,
    hasSearch: true,
    isAutomatch: false,
    hasSelectAll: true,
    // hasTotalSum: true,
    totalParam: 'Cost',
    selectTime: false,
    hasNeedSelect: false,
    matchParam: 'letter',
    timeIconSrc: 'assets/images/icons/calendar.png',
    pageClass: 'payments',
    topItems: ['选择', '就诊时间', '就诊科室', '医师', '就诊金额', '查看详情'],
    bodyItem: ['Date', 'DeptName', 'DocName', 'Cost'],
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
        BackPrevPage();
    },
    btnBack: function($ele, ret, sum) {
        console.log($ele, ret, sum, '确认');
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
        _call(GetPayments());
    },
    searchBack: function($ele, chars, _call) {
        console.log($ele, chars);
    },
    clickTimeBack: function($ele, _call) {
        console.log($ele, _call, '点击时间图标返回');
        $.ChooseTimeQuantum({
            s: 60,
            // yesName: '00',
            // hideName: '00--',
            statrDate: '2017-08-08',
            endDate: '2018-09-12',
            timeBack: BackPrevPage,
            callBack: function($ele) {
                console.log($ele);
            },
            hideBack: function($ele) {
                console.log($ele)
            },
            yes: function($ele, ret) {
                console.log($ele, ret);
                $.loading('正在查询，请稍后');
                setTimeout(function() {
                    $.layerClose();
                    // $.Speak('请选择您要缴费的项目');
                    _call(GetDrugs());
                }, 500);
            }
        })
    }
});



/*
* 详情分页
* @param s 返回时间
* @param size 分页大小
* @param items 输出数据 - 数组
* @param title 标题
* @param tipMsg 注释信息
* @param wrapper 容器
* @param isSpeak 是否播放语音
* @param timeBack 倒计时返回
* @param callBack 渲染后返回
* @param topItems 头部列表 - 数组
* @param bodyItem 内容列表 - 数组
* @param hideBack 隐藏返回
* @param pageClass 页面类名
* @param tipMsgStyle 提示文字样式
* @param listGroupStyle 列表外层样式
*/
$.SummaryPagePanel({
    s: 60,
    size: 6,
    title: '请选择缴费列表',
    wrapper: '.content',
    pageClass: 'summary',
    topItems: ['项目名称', '单价', '数量', '费用类型', '就诊金额'],
    bodyItem: ['ItemName', 'Unit', 'Count', 'Type', 'Total'],
    matchParam: 'letter',
    itemBack: function($ele, ret) {
        console.log($ele, ret);
    },
    callBack: function($ele, _call) {
        console.log($ele, '渲染后回调');
        _call(_ret.data);
    },
    timeBack: function() {
        console.log('倒计时结束');
        BackPrevPage();
    },
    hideBack: function($ele) {
        console.log($ele, '隐藏返回');
    }
});

/*
* 扫码支付
* @param s 返回时间
* @param title 标题
* @param bgSrc 背景图片地址
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnBack 按钮返回
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param titleStyle 标题样式
* @param qrImgStyle 二维码样式
*/
$.ScanCode({
    s: 60,
    // type: 1,
    // title: '请选择缴费列表',
    // hasHome: false,
    // hasPrev: false,
    // hasExit: false,
    qrImgStyle: {
        width: '100px'
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
    callBack: function($ele, $img) {
        console.log($ele, '渲染后回调');
        console.log($img)
        $img.attr('src', 'assets/images/bg/visiting.jpg');
    },
});

/*
* 选择预约日期
* @param s 返回时间
* @param items 输出数据
* @param title 标题
* @param hintMsg 提示信息
* @param items 输出数据 - 日期列表
* @param amItems 上午可选数据 - 与日期数据长度对应
* @param pmItems 下午可选数据 - 与日期数据长度对应
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnName 按钮名称
* @param btnBack 确认返回
* @param btnStyle 按钮样式
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param itemBack 选择返回
* @param titleStyle 标题样式
* @param hasConfirm 全选默认状态，可反选
* @param selectAllDefault 是否有确认按钮
* @param searchDefaultShow 搜索框是否默认选中
* @param surpluswithoutText 无号提示文字
*/
$.ChooseSubscribeDate({
    s: 60,
    // amItems:[1,1,1,0,0,1,1],
    // pmItems:[1,0,1,1,1,0,1],
    amItems:[{surplus:2},{},{surplus:5},{},{},{surplus:3},{surplus:2}],
    pmItems:[{surplus:4},{},{surplus:2},{},{surplus:3},{surplus:3},{surplus:2}],
    items:[
        $.GetCurrentTime(5,1),$.GetCurrentTime(5,2),
        $.GetCurrentTime(5,3),$.GetCurrentTime(5,4),
        $.GetCurrentTime(5,5),$.GetCurrentTime(5,6),
        $.GetCurrentTime(5,7),$.GetCurrentTime(5,6),
        $.GetCurrentTime(5,7),$.GetCurrentTime(5,6),
        $.GetCurrentTime(5,7),$.GetCurrentTime(5,6),
        $.GetCurrentTime(5,7),$.GetCurrentTime(5,6),
    ],
    showDateParam: 'month',
    showWeekParam: 'week',
    itemBack: function($ele, ret) {
        console.log($ele, ret);
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
        console.log(111)
    },
    callBack: function($ele, _call) {
        console.log($ele, '渲染后回调');
    },
});

/*
* 选择挂号医生分页
* @param s 返回时间
* @param size 分页大小 最大 -3
* @param items 输出数据 - 数组
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param getItem 获取列表内容 - 必传函数
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param nothingMsg: 未查到信息提示
* @param titleStyle 标题样式
* @param itemBtnBack 项目按钮回调
* @param itemBtnClass 项目按钮类名
* @param listGroupStyle 列表外层样式
*/
$.ChooseDoctor({
    s: 60,
    isSpeak: false,
    getItem: GetDoctorGroup,
    itemBtnBack: function($ele, ret) {
        console.log($ele, ret, '点击列表按钮')
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
        _call(GetMedDoctors())
    },
});

// 获取挂号医生列表输出 item-group - 必有列 类名
function GetDoctorGroup(_val) {
	return ' <div class="doctor-group item-group">\
		<div class="cell-item theme-tinge-br-color">\
			<div class="vertical-middle">\
				<img class="img-circle theme-tinge-br-color-1" src="' + _val.imgSrc + '">\
			</div>\
			<div class="vertical-middle">\
				<p class="theme-tinge-color m-b-s">\
                    <span class="font-36">' + _val.Name + '</span>\
                    <span class="font-28">' + _val.DepName + '</span>\
					<span>' + _val.Degree + '</span>\
				</p>\
				<p>\
					<span class="name">今日已挂号</span>\
					<span class="value">：' + _val.reged + '人</span>\
				</p>\
				<p>\
					<span class="name">诊费</span>\
					<span class="value">：¥' + _val.price + '</span>\
				</p>\
				<p>\
					<span class="name">就诊日期</span>\
					<span class="value">：' + _val.time + '</span>\
				</p>\
			</div>\
			<div class="vertical-middle">\
				<div class="btn btn-shadow btn-sm gradual-theme btn-radius btn-register">挂号</div>\
			</div>\
		</div>\
	</div>'
}

/*
* 确认操作信息 - 用于确认挂号
* @param s 返回时间
* @param info 输出信息
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnName 按钮名称
* @param btnBack 确认返回
* @param btnStyle 按钮样式
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param titleStyle 标题样式
* @param hasConfirm 是否有确认按钮
*/
$.ConfirmHandleInformation({
    s: 60,
    info: {
        imgSrc: 'assets/images/bg/doctor-img-white.png',
        doctorName: '医生名称',
        departName: '科室名称',
        doctorGree: '医生级别',
        bodyItem: [
            {
                name: '就诊时间：',
                value: '<p>2018.11.11(星期一)</p><p>上午 08:00 - 13:00</p>'
            }, {
                name: '门&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;诊：',
                value: '科室名称'
            }, {
                name: '诊&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费：',
                value: '¥30.5'
            }, {
                name: '就&nbsp;&nbsp;诊&nbsp;&nbsp;人：',
                value: '张雪峰'
            }
        ]
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
        // _call(GetMedDoctors())
    },
});

/*
* 现金充值
* @param s 返回时间
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnName 按钮名称
* @param btnBack 确认返回
* @param btnStyle 按钮样式
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param needMoney 需放入金额总数
* @param titleStyle 标题样式
* @param hasConfirm 是否有确认按钮
* @param gifImgSrc 纸币入钞动图
* @param billImgSrc 纸币面额图
* @param hintBillMsg 纸币接收提示文字
* @param billTypeMsg 纸币接收类型
* @param servicesPhone 服务电话
*/
var list = JSON.parse(INRMB);
var Money = {RMB1: '1元', RMB2: '2元', RMB5: '5元', RMB10: '10元', RMB20: '20元', RMB50: '50元', RMB100: '100元'};
var data = [], billTypeMsg = '纸币：';
$.each(list, function(n, val) {
    if (val >= 1) {
        billTypeMsg += Money[n] + '、';
        data.push(Money[n]);
    }
});
var len = data.length >= 4 ? 4 : data.length;
$.CashTopUp({
    s: 60,
    billImgSrc: 'assets/images/payway/money-' + len + '-icon.png',
    billTypeMsg: billTypeMsg,
    servicesPhone: '150-7929-2785',
    itemBtnBack: function($ele, ret) {
        console.log($ele, ret, '点击列表按钮')
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
    btnBack: function($ele) {
        console.log($ele)
    },
    callBack: function($ele, $btns, $sum, $confirm) {
        console.log($ele, $btns, $sum, $confirm, '渲染后回调');
    },
});

/*
* 银联充值
* @param s 返回时间
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param hintItem 提示步骤
* @param posImgSrc 银联图
* @param hintPStyle 提示信息文字样式
* @param titleStyle 标题样式
* @param posImgStyle 银联图片样式
*/
$.PosUnionpay({
    s: 60,
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

/*
* 选择时间段
* @param s 返回时间
* @param yes 确认返回
* @param type 类型 0-时间段 1-单个时间
* @param title 标题
* @param wrapper 容器
* @param endDate 结束日期
* @param statrDate 开始日期
* @param yesName 确认按钮名称
* @param hideName 隐藏按钮名称
* @param isSpeak 是否播放语音
* @param timeBack 倒计时返回
* @param callBack 渲染后返回
* @param hideBack 隐藏返回
* @param titleStyle 标题样式
*/
$.ChooseTimeQuantum({
    s: 60000,
    // yesName: '00',
    // hideName: '00--',
    statrDate: '2017-08-08',
    endDate: '2018-09-12',
    timeBack: BackPrevPage,
    callBack: function($ele) {
        console.log($ele);
    },
    hideBack: function($ele) {
        console.log($ele)
    },
    yes: function($ele, ret) {
        console.log($ele, ret);
    }
})

/*
* 多重选择
* @param s 返回时间
* @param size 分页大小 默认3
* @param items 输出数据 - 数组
* @param title 标题
* @param wrapper 容器
* @param animate 动画
* @param isSpeak 是否播放语音
* @param hasHome 是否有首页按钮
* @param hasPrev 是否有上一页按钮
* @param hasExit 是否有退卡按钮
* @param btnName 按钮名称
* @param btnBack 确认返回
* @param btnStyle 按钮样式
* @param timeBack 倒计时返回
* @param homeBack 首页返回
* @param prevBack 上一页返回
* @param exitBack 退卡返回
* @param callBack 渲染后返回
* @param itemBack 选择返回
* @param multiple 多重选项
* @param titleStyle 标题样式
* @param hasConfirm 是否有确认按钮
* @param listGroupStyle 列表外层样式
* @param showMultipleParam 显示多选参数字段名
* @param defaultSelectOption 默认选中多选下标值
*/
$.MultipleOptions({
    s: 60,
    multiple: GetMultiple(),
    showMultipleParam: 'Option',
    defaultSelectOption: 1,
    itemBtnBack: function($ele, ret) {
        console.log($ele, ret, '点击列表按钮')
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
        _call(GetOptions());
    },
});

