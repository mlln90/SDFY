/* 
 * 2018-07-24 22:48:29
 * Evan
 */

var pageType;                         // 判断支付状态的页面
var paymethods = '';                  // 判断是银行卡还是社保支付
var timerDKQStatus;                   // 轮循查卡状态 有/无
var readCardCOM = 'COM1';             // 台式或者壁挂 读卡器COM口
var testcom = 1;                      // 测试时传COM口 ==> newPayMethodOfBank
var PAYSTATUES;
var intprt;                           // 指针  
var INTERACTIONSWITCH = true;         // 人体感应切换
var INTERACTIONSTATE = true;
var InvoicePrintStartNo;              // 发票印刷号初始值

var isopenWXZFBPay = true;            // 是否开启微信支付宝
var isopenSocialPay = true;           // 是否开启社保支付宝
var isopenBankPay = true;             // 是否开启银联支付宝

var udpRefundRegPayid;
$(function() {

    // 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };

    // 自助信息
    GetZZJInfo(function(){
        console.log(ZZJInfomation);
        $.ShowCurrentMachineInfo(ZZJInfomation);    // 显示自助机信息
        QueryHISTime(function(ret){
            console.log(ret)
            var time = ret.Datetime.substring(0,19).replace('T',' ');
            DateTimeManager.SetDateTime(time,'yyyy-MM-dd HH:mm:ss');
            setInterval($.CurrentDate,1000);        // 输出时间
        },function(ret){
            setInterval($.CurrentDate,1000);        // 输出时间
        },function(ret){
            setInterval($.CurrentDate,1000);        // 输出时间
        });
        // GetDeviceConfig();                       // 获取自助机硬件配置

        if(ZZJInfomation.DeviceConfigTable.ID != -1){
            CheckServicingTime(true,function(){
                if(ZZJInfomation.ModuleConfig.ID != -1){     //模块id
                    setInterval(function(){
                        CheckServicingTime();                // 定时检查开机状态
                        // CheckModuleUseTime();             // 定时检查模块工作时间
                        CheckPrintDelectReceipt();           // 定时检测凭条及是否缺纸或故障
                    },QUERYSERVERINVERTAL*1000)
                }else{
                    setInterval(function(){
                        // CheckModuleUseTime();             // 定时检查模块工作时间
                        CheckPrintDelectReceipt();           // 定时检测凭条及是否缺纸或故障
                    },QUERYSERVERINVERTAL*1000)
                }  
            });
        }else{
            if(ZZJInfomation.ZZJState == 0){
                ShowMainMenu();                              // 初始化主菜单
                // setTimeout($.CheckCardIsExist,30);        // 循环查卡
            }else{
                ReadCardDev.SetInCard(0);                    // 禁止进卡
                $.tip('暂停服务');
            }
            if(ZZJInfomation.ModuleConfig.ID != -1){
                setInterval(function(){
                    // CheckModuleUseTime();                // 定时检查模块工作时间
                    CheckPrintDelectReceipt();              // 定时检测凭条及是否缺纸或故障
                },QUERYSERVERINVERTAL*1000)
            }
        }

        // PTJPRINTNAME 
        if( ZZJInfomation.DeviceConfigTable.ID == 1){           // 台式
            ISBG = false;
            PTJPRINTNAME = 'CUSTOM K80';
        }else if( ZZJInfomation.DeviceConfigTable.ID == 2 ){    // 壁挂机
            ISBG = true;                                        // 是否为壁挂
            SFZTSD = 6;
            PTJPRINTNAME = 'T90';
            readCardCOM = 'COM2';
            testcom = 2;
        }
        console.log( PTJPRINTNAME );
        console.log( readCardCOM );
        OpenAcs();                                              // 打开机身电路板控制

        if( ZZJCertificate.ZZJID == 3 || ZZJCertificate.ZZJID == 6 || ZZJCertificate.ZZJID == 11 ){
            console.log('自助机编号：'+ZZJCertificate.ZZJID+' 暂不签到');
        }else{
            POS.Register().then(function(value){
                console.log("签到返回值:",value);
                var value = JSON.parse(value);
                if(value == 0){
                    $.Writelog("银联社保签到成功");
                }else{
                    $.Writelog("签到返回值:"+value);
                    $.Writelog("银联社保签到失败");
                }
            },function(error){
                console.log(error)
            })
        }
        // else{
        //     MachineBGPOS.TL_LoginTrade().then(function(value){  // 银行卡，社保卡缴费签到
        //         console.log(value);
        //     },function(error){
        //         console.log(error);
        //     });
        // }
    });

    // 重置浏览器大小 及坐标
    try {
        ThisWindow.ReSetRECT(0, 0, 1280, 1024);  
    } catch(er) {$.Console(er);}

    // 调用浏览器调试工具
    var index = 0;
    $('.developer-tools').on('click', function() {
        index++;
        if (index >= 8) {
            try {
                ThisWindow.OpenDevTools2(850, 20, 340, 400);
            } catch(er) { $.Console(er);}
            index = 0;
        }           
    });

    // 备用事件触发
    $('.footer .contact').on('dblclick', function(){});
    $('.footer .date').on('dblclick', function(){ 
        // var param = { ZZJCertificate: ZZJCertificate };  // 测试自助机时间
        // AJAX.Business.QueryHISTime(JSON.stringify(param), function(ret){
        //     console.log(ret);
        // }, function(ret) {
        //     console.log('时间：',ret);
        // }, function(ret){
        //     console.log(ret)
        // });
    });
    // console.log($.FormatDateByString('2018080814:30:20'))
    // console.log($.Count(0.78, 0.98))
    // console.log($.Count(0.78, 0.98, 1))
    // console.log(0.78-0.98)
    // setInterval($.CurrentDate, 1000);                  // 输出时间    
    $('.manage-login').on('dblclick', ManageLogin);       // 管理员登录
});

IsLog = false;       // 用$.Console() 打印在控制台的参数 开启/关闭     

// 管理登录
function ManageLogin() {
    $.login(function(ret) {
        console.log(ret);
        if (!ret.ID.length) {
            $.Speak('请输入管理员帐号');
            $.layer({
                msg: '请输入管理员帐号！'
            });
            return;
        }
        if (!ret.Pin.length) {
            $.Speak('请输入登录密码');
            $.layer({
                msg: '请输入登录密码！'
            });
            return;
        }
        var val = nowDate().slice(5,7)+nowDate().slice(8,10);
        console.log(val);
        if(val == '' || val == undefined){
            val == '123';
        }
        if(ret.ID == val && ret.Pin == val){
            SetDKQInCard(0);            // 禁止进卡
            CloseIndicator();           // 关闭所有提示灯
            CloseZBQ();                 // 关闭纸币器
            CloseRecord();              // 关闭录像
            $.WriteDict('login', JSON.stringify(ret));
            setTimeout(function() {
                AcsSwitch.CloseDev();   // 关闭电路板连接
                top.location = '../SD-002/webapp/index.html';
            },300);
        }else{
            $.layer({
                msg: '帐号或密码错误',
                time: 3
            });
        }
    });
}


/*
 *   判断是否为子界面
 * @param _isTrue Boolean
 */
function IsChildPage(_isTrue) {
    _isTrue = _isTrue === undefined ? false : _isTrue;
    if (_isTrue){
        $('.container').addClass('child-page');
        $('.header').addClass('headerIdentBg');
    }else{
        $('.container').removeClass('child-page');
        $('.header').removeClass('headerIdentBg');
    }     
};
ThisWindow.SetTopMost(false);     // 是否置顶 

// console.log(MachineBGPOS);
// if(ZZJCertificate.ZZJID == 10){
//     console.log( ServicesManager );
// }
// console.log(ReadCardDev);

/*
 * 绑定功能操作 -- 主界面
 */

function ShowMainMenu() {   
    CardInfo = {};                // 就诊卡信息
    CreateCardInfo = {};          // 办卡信息
    IntroduceInfo = {};           // 医院介绍
    RegisterTakeInfo = {};        // 挂号取号
    RechargeAndPaymentInfo = {};  // 充值缴费
    pageType = '';                // 页面类型
    paymethods = '';              // 支付方式
    intprt = "";
    udpRefundRegPayid = '';
    clearInterval(timerDKQStatus);// 清楚查询卡状态

    IsChildPage(false);
    $(PAGE).html(HomeMenuText); 
    var ele = '#main-menu';

    $.Speak('请选择需要办理的业务');
    $.Writelog('首页选择办理业务');
    $.Writelog('-----------------------------------------------------------------');
    $.Writelog('---------------------------主页分割线----------------------------');
    $.Writelog('-----------------------------------------------------------------');
    $.ExecuteAnimate(ele);

    // if( ZZJCertificate.ZZJID == 6 || ZZJCertificate.ZZJID == 11 || ZZJCertificate.ZZJID == 3 ){
    //     $.Console("自助机6,11");
    //     NotPutInCard = true;
    // }else{
        // if( ZZJInfomation.ZZJID == 4 || ZZJInfomation.ZZJID == 24 || ZZJInfomation.ZZJID == 21){
        //     MachineBGPOS.TL_EjectCard();    
        // }else{
            // MachineBGPOS.CloseDKQ(readCardCOM).then(function(value){    // 关闭读卡器
            //     console.log(value);
            // }, function(error){
            //     console.log(error);
            // });  
        // }
    // }
    
    if( ZZJCertificate.ZZJID == 3 || ZZJInfomation.ZZJID == 6 || ZZJInfomation.ZZJID == 11){
        isopenSocialPay = false;               // 是否开启社保支付宝
        isopenBankPay = false;                 // 是否开启银联支付宝
    }
     
    CheckPrintDelectReceipt();                 // 检测凭条机是否缺纸或故障

    NotPutInCard = true;
    if (NotPutInCard) {                        // 判断是否是新建卡未插卡操作
        $.ExitCardClearInfo();                 // 清除信息 并退卡   ==> 现注释了里面的退卡 SetDKQMoveCard(0);
        // SetDKQMoveCard(0);                     // 设计走卡位
        ReadCardDev.SetInCard(0);              // 禁止进卡
    }
    // 判断是否插卡 改变显示模块
    // $.each(MainMenuConfig, function(n, val) {
        // if (val.type == 1) {
            //MainMenuConfig[n].show = CardInfo.CardNum != undefined ? false : true;
        // } else if (val.type == 6) {
            //MainMenuConfig[n].show = CardInfo.CardNum != undefined ? true : false;
        // }
    // });

    /**遍历数组用$.each()方法
    ***遍历MainMenuConfig(数组)
    *** n: __MainMenuConfig的type值
    *** val __MainMenuConfig（数组本身）
    **/
    // 输出功能模块
    var index = 0;
    $(ele + ' .menu-list').empty();
    if(MainMenuConfig == null || MainMenuConfig.length == 0){
        $.tip('网络故障，服务暂停');
    };
    $.each(MainMenuConfig, function(n, val) {
        if (val.Visual) {
            index++;
            var disabled = '';
            if(!val.Enabled && val.Enabled != undefined){
                disabled = ' disabled';
            }
            if(index <= 7){
                var item = `<div class="item ${val.IconName} ${disabled}" data-id="${n}" data-type="${val.Code}">
                            <div class="icon"></div>
                        </div>`;
                $(ele + ' .menu-list').append(item);
            }else{
                index = 7;
            }   
        }
    });

    console.log('ZZJInfomation.ModuleConfig.ID',ZZJInfomation.ModuleConfig.ID);
    if(ZZJInfomation.ModuleConfig.ID == 2){                   // 病历本                 
        $('#main-menu .menu-list > .printReport.item .icon').css('background','url(assets/images/navbar/medicalPrint.png) no-repeat');
    }
    if(ZZJInfomation.ModuleConfig.ID == 3){                   // 发票    
        $('#main-menu .menu-list > .printReport.item .icon').css('background','url(assets/images/navbar/invoicePrint.png) no-repeat');            
    }
    if(ZZJInfomation.ModuleConfig.ID == 4){                   // 化验单                 
        $('#main-menu .menu-list > .printReport.item .icon').css('background','url(assets/images/navbar/inspectionPrint.png) no-repeat');
    }
    
    $(ele + ' .menu-list').addClass('t' + index);
    $(ele + ' .menu-list .item').on('click', function(){      // 绑定事件、
        $.PlaySpecialSound;                                   // 按键音效
        var id = $(this).data('id');
        CurrentModelDate = MainMenuConfig[id];
        console.log(CurrentModelDate);
        PAGECODE = CurrentModelDate.Code;
        console.log(PAGECODE);
        if (PAGECODE == 'DYYW' && CurrentModelDate.Enabled == false) {
            $.Speak('暂无开放打印功能，谢谢');
            $(this).unbind('click');
        } else {
            NotPutInCard = true;
            $.TransformPage();
        }
    });
    if (!CardInfo.CardNum) {
        $(ele + ' .btn-exit').hide();         // 无卡删除退卡按钮
    }
    // 退卡
    // $.ExitCard(ele);
};

// 生成 二维码
function createCodeEWM(ele,_str){
    var str = utf16to8(_str);
    console.log(ele);
    ele.qrcode({
        render  : "canvas",
        text    : str,
        width   : "250",               //二维码的宽度
        height  : "250",               //二维码的高度
        background : "#ffffff",        //二维码的后景色
        foreground : "#000000",        //二维码的前景色
     }); 
}
// 二维码中文乱码问题
function utf16to8(str) {  
    var out, i, len, c;  
    out = "";  
    len = str.length;  
    for(i = 0; i < len; i++) {  
        c = str.charCodeAt(i);  
        if ((c >= 0x0001) && (c <= 0x007F)) {  
            out += str.charAt(i);  
        } else if (c > 0x07FF) {  
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));  
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));  
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
        } else {  
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));  
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
        }  
    }  
    return out;  
}

// 当前不支持 此功能
function unsupportedClick(){
    $.Speak("暂无开放此功能");
    $.layer({
        msg: '暂无开放此功能',         // msg 提示信息
        btn: ['确认'],                 // btn 按钮 - 数组 （最多两个）
        type: 1,                       // type 类型 [0, 1]
        time: 10,                      // time 倒计时时间
        bulb: true,                    // bulb 小灯泡是否显示
        title: '温馨提示',             // title 提示名称
        bulbSrc: 'assets/images/tip/bulb.png',   // bulbSrc 灯泡图片路径
        endExecute: true,             // endExecute 定时时间结束后是否执行确认函数 默认 true
        yes: function() {             // yes 确认按钮回调
            console.log('暂不开放此功能')     
        }
    });
}

// 网络异常
function contentError(msg){
    $.layer({
        msg: msg?msg:'网络异常，请稍后再试', 
        btn: ['确认'],
        type: 1,     
        time: 6,
        bulbSrc: 'assets/images/tip/bulb.png',
        yes: function(){
            ShowMainMenu();
        }
    })
}

function htmlEscape(text){
    var msg = text.replace(/<\/?[^>]*>/g, '');  // 去掉标签
    msg = msg.replace(/[|]*\n/, '');            // 去掉行尾空格
    msg = msg.replace(/&npsp;/ig, '');          // 去掉npsp 
    return msg;
}

// 查询自助机
function showzzjinfo(){
    var queryZZJdata = {'ZZJCertificate' : ZZJCertificate, 'AdminCertificate': {}};
    $.ajax({
        url:'/api/admin/QueryZZJInfomation',
        data:JSON.stringify(queryZZJdata), 
        type:'post',
        success:function(ret){
            var ret = JSON.parse(ret);
            if(ret.Code == '0'){
                console.log(ret.ZZJState);
            }else{
                console.log(ret.Msg);
            }
        },error:function(ret){
            $.Console(ret, '获取自助机信息错误');
            $.Writelog(ret.Msg);
            $.layer({
                msg: ret.Msg
            });
        }
    })
}

// 修改自组机信息
function changeZZJInfomation(){
    console.log(ZZJCertificate);
    console.log(ZZJInfomation);
    if(ZZJInfomation.ZZJState == 1){
        ZZJInfomation.ZZJState = 0;
    }else{
        ZZJInfomation.ZZJState = 1; 
    }
    var param = {
            'ZZJCertificate'   : ZZJCertificate,
            'AdminCertificate' : {},
            'ZZJInfomation'    : ZZJInfomation
        };
    AJAX.Admin.ChangeZZJInfomation(JSON.stringify(param),function(ret){
        console.log(ret)
    },function(ret){
        console.log(ret)
    })
}

// 删除自助机信息
function deleteZZJInfomation(){
    console.log(ZZJInfomation);
    console.log(ZZJCertificate);
    var param = {
            'ZZJCertificate'   : ZZJCertificate,
            'AdminCertificate' : {},
            'ZZJInfomation'    : ZZJInfomation
        };
    $.ajax({
        url:'/api/admin/DeleteZZJInfomation',
        type:'post',
        data:JSON.stringify(param),
        success:function(ret){
            var ret = JSON.parse(ret);
            console.log(ret)
        }
    })
}

function OpenAcs() {
    console.log('壁挂：'+ISBG);
    if(ISBG ==  true){
         AcsSwitch.OpenDev(1, function (x) {
            console.log(x == 0 ? "电路板打开成功!" : "电路板打开失败!");
            $.Writelog(x == 0 ? "电路板打开成功!" : "电路板打开失败!");
        });
    }else{
        AcsSwitch.OpenDev(5, function (x) {      //参数是COM号,通常是5,但偶尔也会变...
            // console.log(x == 0 ? "打开成功!" : "打开失败!");
            // $.Writelog(x == 0 ? "打开成功!" : "打开失败!");
            if(x == 0){
                console.log('电路板打开成功');
                $.Writelog('电路板打开成功');
                if(INTERACTIONSWITCH){
                    AcsSwitch.SetCallback("BodyInductionBack");
                }    
            }else{
                $.Speak('打开电路板控制失败');
                $.layer({
                    msg:'打开电路板控制失败'
                });
            }
        });
    }
    //参数是COM号,通常是5,但偶尔也会变...
    // AcsSwitch.OpenDev(5, function (x) {
    //     console.log(x == 0 ? "打开成功!" : "打开失败!");
    //     $.Writelog(x == 0 ? "打开成功!" : "打开失败!");
    // });
    // AcsSwitch.SetCallback("AcsCallBack");
};


// 计算年龄
// console.log( $.Calculate('2017-02-03') );
// console.log( countAges({PatientInfo:{IDNo:'421023201808091232'}}) );
function Record_UDP_CloseDKQfirst(msg){
    console.log(msg);
    SocketUDP.ClosePort(1006);
}

// var dayass = [
//     {date:"2018-09-09",val:9},
//     {date:"2018-03-08",val:8},
//     {date:"2012-09-07",val:12},
//     {date:"2018-04-09",val:122}
// ];

// 按时间将数组分类
function transframArray(_data){
    var newArr = _data;
    newArr.sort(function(i1,i2){
        return Number(i1.Date.slice(0,4)+i1.Date.slice(5,7)+i1.Date.slice(8,10)) - Number(i2.Date.slice(0,4)+i2.Date.slice(5,7)+i2.Date.slice(8,10))
    })
    return newArr.reverse();
}

