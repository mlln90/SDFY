/* 2017-07-13 09:47:55 */
;
$(function() {

	// 初始化菜单栏
	InitSideNav({
		ele: '#side-nav ul',
		pages: PagesData
	});

	// 获取自助机信息
	GetZZJInfo();	 

});

var ZZJCertificate = {            // 自助机认证信息
	MAC: MachineInfo.GetMAC(),    // 当前自助机 MAC 地址
	ZZJID: '',                    // 自助机编号
	Password: '123'               // 自助机密码
}

var ZZJINFO;                      // 自助机信息
var CASHSTATE = true;             // 是否现金充值
var BANKSTATE = true;             // 是否银联充值
var WEIXSTATE = true;             // 是否微信充值
var ALISTATE = true;              // 是否支付宝充值
var PRINTER = true;               // 是否补打

// var CampusVal = ThisWindow.ReadDict('CampusVal'); // 院区类型
var CampusVal = -1; // 院区类型


/*
 * 获取 自助机信息
 * @param _callback 成功回调
 */
function GetZZJInfo(_callback) {
	var param = {
		'ZZJCertificate': ZZJCertificate,
		'AdminCertificate': {}
	}
	AJAX.Admin.QueryZZJInfomation( JSON.stringify(param),function(ret){
		console.log(ret);
	} , function(ret) {
		// console.log(ret);
		var data = ret.ZZJInfomation;
		CampusVal = data.DistrictID;
		ZZJINFO = {
			ZZJInfomation: data
		};
		$.each(ret.ZZJInfomationExtension, function(n, val) {
			switch (val.Name) {
				// 是否支持现金操作
				case 'IsCompoundCardCash': CASHSTATE = val.Value === 'true'; break;

				// 是否支持银联操作
				case 'IsCompoundCardBank': BANKSTATE = val.Value === 'true'; break;

				// 是否支持微信扫码操作
				case 'IsCompoundCardWeix': WEIXSTATE = val.Value === 'true'; break;

				// 是否支持支付宝扫码操作
				case 'IsCompoundCardAli': ALISTATE = val.Value === 'true'; break;
			}
		});
		if (data.ZZJID != -1) {
			ZZJCertificate.ZZJID = data.ZZJID;
			if (typeof _callback == 'function')		
				_callback();
		} else {
			var param = {
				ZZJCertificate: ZZJCertificate,
				Name: MachineInfo.GetMAC()
			}
			AJAX.Admin.NewZZJInfomation( JSON.stringify(param), function(ret) {
				// console.log(ret);
				if (ret.ResultCode == 0) {
					GetZZJInfo();
				} else {
					$.layerPop({
						msg: '自助机添加名称失败',
						time: 6,
					});
				}
			}, function(ret) {
				console.log(ret);
			});
		}
	}, function(ret) {
		console.log(ret);
	});
}

/* 
 * 输出菜单
 * @param ele 菜单标签元素
 * @param pages 页面数组
 */
function InitSideNav(_param) {
	$(_param.ele).empty();
	$.each(_param.pages, function(n, val) {
		var li = '<li data-href="' + val.href + '" data-switch="' + val.isPawd + '">' + val.name + '</li>';
		$(_param.ele).append(li);
	});

	// 绑定事件
	$(_param.ele + ' li').on('click', function() {
		VideoPlayer.Close('Player1');
		VideoPlayer.Close('Player2');
		var $this = $(this);
		if (!$(this).hasClass('active')) {
			var src = $(this).data('href');
			var name = $(this).text();
			var Switch = $(this).data('switch');
			$('.operate-name').html(name);
			
			$('#import-number').remove();
			if (Switch) {
			    $.layerImportPassword('8', function() {
			    	$('#page-content iframe').attr('class', 'animated bounceOutLeft');
			    	if (src == '##') {
						// ThisWindow.OpenDevTools();
						ThisWindow.OpenDevTools2(850, 20, 340, 800);
					} else {
						setTimeout(function() {
							$('#page-content iframe').attr({'src': src, 'class': 'animated bounceInRight'});
						}, 300);
						$this.changeActive();
					}						
			    }, function() {
			    	alert('密码错误！');
			    });
			} else {
				$('#page-content iframe').attr('class', 'animated bounceOutLeft');
				setTimeout(function() {
					$('#page-content iframe').attr({'src': src, 'class': 'animated bounceInRight'});
				}, 300);
				$(this).changeActive();
			}		
		}
	});
}

// ThisWindow.OpenDevTools2(850, 20, 340, 500);







/* 页面数据 */
var PagesData = [
	{
		name: '补打业务',
		href: 'pages/printer/print.html',
		isPawd: true,
	},/*{
	 	name: '现金业务',
	 	href: 'pages/cash/cash.html',
	 	isPawd: true,
	 },*/ 
	{
		name: '银行卡业务',
		href: 'pages/bankCard/bankCard.html',
		isPawd: true,
	}, {
		name: '微信业务',
		href: 'pages/weix/weix.html',
		isPawd: true,
	}, {
		name: '支付宝业务',
		href: 'pages/ali/ali.html',
		isPawd: true,
	}, {
		name: '社保卡业务',
		href: 'pages/social/social.html',
		isPawd: true,
	},/* {
		name: '结账',
		href: 'pages/settleAccounts/settleAccounts.html',
		isPawd: true,
	}, */{
		name: '功能维护',
		href: 'pages/maintain/maintain.html',
		isPawd: false,
	}, {
		name: '系统工具',
		href: 'pages/systemTools/systemTools.html',
		isPawd: false,
	}, {
		name: '开发者工具',
		href: '##',
		isPawd: true,
	}, {
		name: '配置时间',
		href: 'pages/configTime/configTime.html',
		isPawd: false,
	}, {
		name: '配置模块',
		href: 'pages/configModule/configModule.html',
		isPawd: false,
	}, {
		name: '退出',
		href: 'pages/exit/exit.html',
		isPawd: false,
	}
];