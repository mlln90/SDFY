/*
 * 2018-04-13 18:00:35
 * modules by jQ
 * Evan
 */
(function($) {

	$.extend({

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
		BrushIntoIdentity: function(_param) {
			var param = {
				s: 60,
				title: '请在图中机器对应的位置放入身份证',
				imgSrc: 'assets/images/card/input-IDCard.gif',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				btnName: '输入身份证号',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnBack: null,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				imgStyle: {},
				btnStyle: {},
				hasConfirm: true,
				titleStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.imgSrc = _param.imgSrc != undefined ? _param.imgSrc : param.imgSrc;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.imgStyle = _param.imgStyle != undefined ? _param.imgStyle : param.imgStyle;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.hasConfirm = _param.hasConfirm != undefined ? _param.hasConfirm : param.hasConfirm;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
			}
			var PageWrap = $('<div>').addClass('brush-into-identity page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);
			$('<img>').attr('src', param.imgSrc).css(param.imgStyle).appendTo(Animated);
			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var BtnWrap = $('<div>').addClass('btn-wrap text-center');
			if (param.hasConfirm)
				$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius btn-input-number').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
			$(BtnWrap).appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
			
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);
			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));

			// 按钮
			$(PageWrap).find('.btn-input-number').one('click', function() {
				$.TheKeySound();
				if (typeof param.btnBack == 'function')
					param.btnBack($(this));
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '刷身份证';
		},

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
		ConfirmInfo: function(_param) {
			var param = {
				s: 60,
				title: '请确认您的身份信息',
				subTitle: '账户信息',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				btnName: '确 认',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnBack: null,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				btnStyle: {},
				infoNames: ['姓 名', '性 别', '名 族', '生 日'],
				infoValues: [],
				titleStyle: {},
				infoWrapStyle: {},
				infoListStyle: {},
				infoTitleStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.subTitle = _param.subTitle != undefined ? _param.subTitle : param.subTitle;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.infoNames = _param.infoNames != undefined ? _param.infoNames : param.infoNames;
				param.infoValues = _param.infoValues != undefined ? _param.infoValues : param.infoValues;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.infoWrapStyle = _param.infoWrapStyle != undefined ? _param.infoWrapStyle : param.infoWrapStyle;
				param.infoListStyle = _param.infoListStyle != undefined ? _param.infoListStyle : param.infoListStyle;
				param.infoTitleStyle = _param.infoTitleStyle != undefined ? _param.infoTitleStyle : param.infoTitleStyle;
			}
			var PageWrap = $('<div>').addClass('confirm-info page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);

			var ConfirmWrap = $('<div>').addClass('confirm-info-wrap theme-br-color  col-5').css(param.infoWrapStyle);
			$('<h2>').addClass('gradual-theme text-center').css(param.infoTitleStyle).html(param.subTitle).appendTo(ConfirmWrap);

			var Infolist = $('<div>').addClass('info-list gray-6 font-36').css(param.infoListStyle);
			$(Infolist).appendTo(ConfirmWrap);
			$.each(param.infoNames, function(n, val) {
				var RowItem = $('<div>').addClass('row-item');
				$('<span>').addClass('name').html(val + '：').appendTo(RowItem);
				var value = param.infoValues[n];
				$('<span>').addClass('value').html(value ? value : '').appendTo(RowItem);
				$(RowItem).appendTo(Infolist);
			});
			$(Infolist).appendTo(ConfirmWrap);
			var BtnWrap = $('<div>').addClass('text-center p-b-xl');
			$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius btn-confirm').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
			$(BtnWrap).appendTo(ConfirmWrap);

			$(ConfirmWrap).appendTo(Animated);
			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);


			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);

			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));

			// 按钮
			$(PageWrap).find('.btn-confirm').one('click', function() {
				$.TheKeySound();
				if (typeof param.btnBack == 'function')
					param.btnBack($(this));
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '刷身份证';
		},

		/*
		 * 输入数字 
		 * @param s 返回时间
		 * @param type 类型值 0- 手机号 1- 身份证 2-金额
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
		 * @param timeBack 倒计时返回
		 * @param homeBack 首页返回
		 * @param prevBack 上一页返回
		 * @param exitBack 退卡返回
		 * @param callBack 渲染后返回
		 * @param btnStyle 按钮样式
		 * @param titleStyle 标题样式
		 * @param inputStyle 输入框样式
		 */
		ImportNumber: function(_param) {
			var param = {
				s: 60,
				type: 0,
				title: '请输入您的手机号',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				btnName: '确 认',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnBack: null,
				numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				btnStyle: {},
				titleStyle: {},
				inputStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.type = _param.type != undefined ? _param.type : param.type;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.numbers = _param.numbers != undefined ? _param.numbers : param.numbers;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.inputStyle = _param.inputStyle != undefined ? _param.inputStyle : param.inputStyle;
			}
			var PageWrap = $('<div>').addClass('import-number page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);

			var InputGroup = $('<div>').addClass('input-group theme-input-group m-t-xl col-8');
			var $input = $('<input>').addClass('input-control').attr('placeholder', param.title).css(param.inputStyle).appendTo(InputGroup);
			var InputClear = $('<div>').addClass('input-clear').appendTo(InputGroup);
			$(InputGroup).appendTo(Animated);

			var NumberGroup = $('<div>').addClass('import-number-group');
			var NumberWrap = $('<ul>').addClass('clearfix btns-group');
			$.each(param.numbers, function(n, val) {
				if (n === 9) {
					if (param.type === 1) {
						$('<li>').data('val', 'X').html('X').appendTo(NumberWrap);
					} else if (param.type === 2) {
						$('<li>').data('val', '.').html('·').appendTo(NumberWrap);
					} else {
						$('<li>').attr('disabled', '').appendTo(NumberWrap);						
					}
				}
				$('<li>').data('val', val).html(val).appendTo(NumberWrap);
			});
			$('<li>').attr('remove', '').data('val', 'rm').html('删除').appendTo(NumberWrap);
			$(NumberWrap).appendTo(NumberGroup);
			$(NumberGroup).appendTo(Animated);

			var BtnWrap = $('<div>').addClass('text-center');
			$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius btn-confirm').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
			$(BtnWrap).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);


			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);

			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));

			// 清除输入框内容
			$(InputClear).on('click', function() {
				$.TheKeySound();
				$input.val('');
			});

			// 按键列表
			$(NumberWrap).find('li:not([disabled])').on('click', function() {
				var ClickVal = $(this).data('val');
				var CurrentVals = $input.val().replace(/\-/g, '');
				var newVal = CurrentVals;
				var index = CurrentVals.indexOf('.');
				if (ClickVal >= 0 || ClickVal == 'X') {
					$.Speak(ClickVal);
					var str = CurrentVals.substring(index);
					if (index > -1 && str.length >= 3) { // 判断小数点后数字长度
						newVal = newVal;
					} else {
						newVal = CurrentVals + ClickVal;
					}
				} else if (ClickVal == 'rm') { // 删除
					$.TheKeySound();
					newVal = CurrentVals.substring(0, CurrentVals.length-1);
				} else if (ClickVal == '.') {
					$.Speak('点');
					if (index > -1) {  // 判断小数点是否存在
						newVal = newVal
					} else {
						newVal = CurrentVals + ClickVal;
					}
				}
				if (param.type === 0) {
					newVal = $.DivisionalTel(newVal);
				} else if (param.type === 1) {
					newVal = $.DivisionaIdentity(newVal);
				}
				$input.val(newVal);

				// 倒计时
				$.BackInterval(param.s, param.timeBack);
			});

			// 按钮
			$(PageWrap).find('.btn-confirm').on('click', function() {
				$.TheKeySound();
				// /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
				var val = $input.val().replace(/\-/g, ''); 
				if (param.type === 2)
					val = Number(val);
				if (typeof param.btnBack == 'function')
					param.btnBack($(this), val);
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			if (param.type === 0) {
				return '输入手机号';
			} else if (param.type === 1) {
				return '输入身份证号';
			} else if (param.type) {
				return '输入金额';
			}
		},

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
		 */
		HandleCondition: function(_param) {
			var param = {
				s: 30,
				yes: null,
				btn2: null,
				btn3: null,
				title: '办卡成功请选择需要办理的业务',
				btns: ['去挂号', '去充值'],
				message: '办卡成功！',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: false,
				hasPrev: false,
				hasExit: false,
				timeBack: null,
				callBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				msgStyle: {},
				btnStyle: {},
				topImgSrc: 'assets/images/tip/succeed.png',
				wrapStyle: {},
				hasBulbImg: true,
				bulbImgSrc: 'assets/images/tip/bulb.png',
				topImgStyle: {},
				bulbImgStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.yes = _param.yes != undefined ? _param.yes : param.yes;
				param.btn2 = _param.btn2 != undefined ? _param.btn2 : param.btn2;
				param.btn3 = _param.btn3 != undefined ? _param.btn3 : param.btn3;
				param.btns = _param.btns != undefined ? _param.btns : param.btns;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.message = _param.message != undefined ? _param.message : param.message;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.msgStyle = _param.msgStyle != undefined ? _param.msgStyle : param.msgStyle;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.topImgSrc = _param.topImgSrc != undefined ? _param.topImgSrc : param.topImgSrc;
				param.wrapStyle = _param.wrapStyle != undefined ? _param.wrapStyle : param.wrapStyle;
				param.hasBulbImg = _param.hasBulbImg != undefined ? _param.hasBulbImg : param.hasBulbImg;
				param.bulbImgSrc = _param.bulbImgSrc != undefined ? _param.bulbImgSrc : param.bulbImgSrc;
				param.topImgStyle = _param.topImgStyle != undefined ? _param.topImgStyle : param.topImgStyle;
				param.bulbImgStyle = _param.bulbImgStyle != undefined ? _param.bulbImgStyle : param.bulbImgStyle;
			}
			var PageWrap = $('<div>').addClass('handle-condition page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);

			var HintWrap = $('<div>').addClass('hint-wrap text-center').css(param.wrapStyle);
			$('<img>').addClass('status-img').attr('src', param.topImgSrc).css(param.topImgStyle).appendTo(HintWrap);

			var MsgWrap = $('<div>').addClass('hint-message theme-hint-color').css(param.msgStyle);
			if (param.hasBulbImg)
				$('<img>').addClass('bulb-img').attr('src', param.bulbImgSrc).css(param.bulbImgStyle).appendTo(MsgWrap);
			$('<span>').addClass('vertical-middle').html(param.message).appendTo(MsgWrap);
			$(MsgWrap).appendTo(HintWrap);
			$(HintWrap).appendTo(Animated);

			var BtnWrap = $('<div>').addClass('text-center btn-wrap');
			$.each(param.btns, function(n, val) {
				if (n > 2) return false;
				$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius').css(param.btnStyle).html(val).appendTo(BtnWrap);
			});
			$(BtnWrap).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);

			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack(PageWrap, MsgWrap);

			// 按钮
			$(PageWrap).find('.btn').one('click', function() {
				$.TheKeySound();
				var index = $(this).index();
				if (index == 0) {
					if (typeof param.yes == 'function')
						param.yes($(this));
				} else if (index == 1) {
					if (typeof param.btn2 == 'function')
						param.btn2($(this));
				} else if (index == 2) {
					if (typeof param.btn3 == 'function')
						param.btn3($(this));
				}
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '操作状态';
		},

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
		ImportCharacter: function(_param) {
			var param = {
				s: 60,
				isZzj: false,
				title: '请输入您的姓名',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: false,
				btnBack: null,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				titleStyle: {},
				inputStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.isZzj = _param.isZzj != undefined ? _param.isZzj : param.isZzj;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.inputStyle = _param.inputStyle != undefined ? _param.inputStyle : param.inputStyle;
			}
			var PageWrap = $('<div>').addClass('import-character page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);

			var InputGroup = $('<div>').addClass('input-group theme-input-group m-t-xl col-8');
			var $input = $('<input>').addClass('input-control').attr('placeholder', param.title).css(param.inputStyle).appendTo(InputGroup);
			var InputClear = $('<div>').addClass('input-clear').appendTo(InputGroup);
			$(InputGroup).appendTo(Animated);
			$('<div>').addClass('keyboard-wrap').appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);


			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			function CompositeKeyboard() {				
				$('.import-character .keyboard-wrap').CompositeKeyboard({
			        isZzj: param.isZzj,
			        input: '.input-group .input-control',
			        standby: true,
			        standbyName: '手写',
			        // standbyClickHide: false,
			        blankback: function(chars, $ele) {     // 确认
			            // console.log(chars, $ele, '键盘确认按钮返回');
			            if (typeof param.btnBack == 'function')
							param.btnBack($ele, chars);
			        },
			        charback: function(char) {  // 按键
			            // console.log(char, '键盘按键返回');
			            $.BackInterval(param.s, param.timeBack);
			        },
			        shiftback: function(st) {   // 大小写状态
			            // console.log(st, '拼音键盘大小写状态');
			            $.BackInterval(param.s, param.timeBack);
			        },
			        delback: function(chars) {  // 删除
			            // console.log(chars, '键盘按键删除返回');
			            $.BackInterval(param.s, param.timeBack);
			        },
			        hanziback: function(char) { // 汉字选择
			            // console.log(char, '汉字选择返回');
			            $.BackInterval(param.s, param.timeBack);
			        },
			        standbyback: function($ele) {
			        	// console.log($ele, '备用按键回调');
			        	$.BackInterval(param.s, param.timeBack);
			        	writediscern();
			        }
			    });
			}

			function writediscern() {
				$('.import-character .keyboard-wrap').writediscern({
			        input: '.input-group .input-control',
			        isZzj: param.isZzj,
			        blankback: function(chars, $ele) {     // 确认
			            // console.log(chars, $ele, '键盘确认按钮返回');
			            $.BackInterval(param.s, param.timeBack);
			            if (typeof param.btnBack == 'function')
							param.btnBack($ele, chars);
			        },
			        resetback: function($ele) {  // 重置
			            // console.log($ele, '键盘重置返回');
			            $.BackInterval(param.s, param.timeBack);
			        },
			        delback: function(chars, $ele) {  // 删除
			            // console.log(chars, $ele, '键盘按键删除返回');
			            $.BackInterval(param.s, param.timeBack);
			        },
			        hanziback: function(char) { // 汉字选择
			            // console.log(char, '汉字选择返回');
			            $.BackInterval(param.s, param.timeBack);
			        },
			        standbyback: function($ele) {
			            // console.log($ele, '备用按钮返回');
			            $.BackInterval(param.s, param.timeBack);
			            CompositeKeyboard();
			        },
			        writeback: function(_data, _reset) {
			        	// console.log(_data, '手写返回');
			        	$.BackInterval(param.s, param.timeBack);
			        }
			    });
			}

			CompositeKeyboard();
			// writediscern();

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));

			// 清除输入框内容
			$(InputClear).on('click', function() {
				$.TheKeySound();
				$input.val('');
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '输入字符';
		},

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
		ChooseSex: function(_param) {
			var param = {
				s: 60,
				sex: -1,
				title: '请选择儿童性别',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				btnName: '确 认',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: false,
				btnBack: null,
				sexlist: [{ name: '男孩', icon: 'boy', value: 0 }, { name: '女孩', icon: 'girl', value: 1 }],
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				btnStyle: {},
				titleStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.sex = _param.sex != undefined ? _param.sex : param.sex;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.sexlist = _param.sexlist != undefined ? _param.sexlist : param.sexlist;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
			}
			var PageWrap = $('<div>').addClass('choose-sex page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);

			var SexGroup = $('<div>').addClass('sex-group');
			$.each(param.sexlist, function(n, val) {
				var sex = $('<div>').addClass('sex line-block btn-shadow ' + val.icon).data('val', val.value);
				var item = $('<div>').addClass('cell-item');
				$('<i>').appendTo(item);
				$('<p>').html(val.name).appendTo(item);
				$(item).appendTo(sex);
				$(sex).appendTo(SexGroup);
			});
			if (param.sex >= 0)
				$(SexGroup).find('.sex:eq(' + param.sex + ')').addClass('active');
			$(SexGroup).appendTo(Animated);

			var BtnWrap = $('<div>').addClass('text-center btn-wrap');
			$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius btn-confirm').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
			$(BtnWrap).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);


			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 选择
			$(SexGroup).find('.sex').on('click', function() {
				$(this).changeActive();
				var data = $(this).data();
				param.sex = data.val;
				$.BackInterval(param.s, param.timeBack);
			});

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));

			// 按钮
			$(PageWrap).find('.btn-confirm').on('click', function() {
				$.TheKeySound();
				if (typeof param.btnBack == 'function')
					param.btnBack($(this), param.sex);
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '选择性别';
		},

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
		ChooseDate: function(_param) {
			var param = {
				s: 60,
				title: '请选择儿童出生日期',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				btnName: '确 认',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnBack: null,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				btnStyle: {},
				titleStyle: {},
				inputStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.inputStyle = _param.inputStyle != undefined ? _param.inputStyle : param.inputStyle;
			}
			var PageWrap = $('<div>').addClass('choose-birthday page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);

			var InputGroup = $('<div>').addClass('input-group theme-input-group m-t-xl col-8');
			var $input = $('<input>').addClass('input-control').attr('placeholder', param.title).css(param.inputStyle).appendTo(InputGroup);
			$(InputGroup).appendTo(Animated);

			var $Calendar = $('<div>').addClass('calendar-wrap').appendTo(Animated);

			var BtnWrap = $('<div>').addClass('text-center btn-wrap');
			$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius btn-confirm').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
			$(BtnWrap).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);


			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			setTimeout(function() {
				// 选择日期
				$input.ChooseData({
				    target: $Calendar,
				    yearago: 80,
				    callback: function() {
				        $.BackInterval(param.s, param.timeBack);
				    }
				});
			}, 500);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));

			// 按钮
			$(PageWrap).find('.btn-confirm').on('click', function() {
				$.TheKeySound();
				var val = $input.val();
				var currDate = new Date();
				var currYear = currDate.getFullYear();
				var year = Number(val.split('-')[0]);
				var age = currYear - year;
				if (typeof param.btnBack == 'function')
					param.btnBack($(this), val, age);
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '选择日期';
		},

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
		HospitalInfo: function(_param) {
			var param = {
				s: 90,
				title: '医院介绍',
				info: '',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				animateStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.info = _param.info != undefined ? _param.info : param.info;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.animateStyle = _param.animateStyle != undefined ? _param.animateStyle : param.animateStyle;
			}
			var PageWrap = $('<div>').addClass('hospital-introduce page');
			var Content = $('<div>').addClass('content col-10 p-t-xl');
			var Animated = $('<div>').addClass('animated ' + param.animate).css(param.animateStyle);
			var InfoWrap = $('<div>').addClass('info-wrap gray-6').html(param.info).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);


			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			setTimeout(function() {
				// 滑动
				$(Animated).SimulateScroll({
			        target: $(InfoWrap)
			    });
			}, 1000);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '医院介绍';
		},

		/*
		 * 搜索选项
		 * @param s 返回时间
		 * @param items 输出数据
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
		 * @param showParam 输出参数名称 - 必传
		 * @param hasSearch 是否输出搜索框
		 * @param nothingMsg 未查到信息提示
		 * @param titleStyle 标题样式
		 * @param inputStyle 输入框样式
		 * @param matchParam 匹配参数
		 * @param placeholder input 占位符
		 * @param itemlistStyle 输出容器标签样式
		 */
		SearchItems: function(_param) {
			var param = {
				s: 60,
				title: '请选择科室',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				showlen: 9,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				itemBack: null,
				showParam: '',
				hasSearch: true,
				nothingMsg: '没有查询到列表信息',
				titleStyle: {},
				inputStyle: {},
				matchParam: '',
				placeholder: '请输入您要查询科室是首字母',
				itemlistStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.showlen = _param.showlen != undefined ? _param.showlen : param.showlen;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.itemBack = _param.itemBack != undefined ? _param.itemBack : param.itemBack;
				param.showParam = _param.showParam != undefined ? _param.showParam : param.showParam;
				param.hasSearch = _param.hasSearch != undefined ? _param.hasSearch : param.hasSearch;
				param.nothingMsg = _param.nothingMsg != undefined ? _param.nothingMsg : param.nothingMsg;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.inputStyle = _param.inputStyle != undefined ? _param.inputStyle : param.inputStyle;
				param.matchParam = _param.matchParam != undefined ? _param.matchParam : param.matchParam;
				param.placeholder = _param.placeholder != undefined ? _param.placeholder : param.placeholder;
				param.itemlistStyle = _param.itemlistStyle != undefined ? _param.itemlistStyle : param.itemlistStyle;
			}
			var PageWrap = $('<div>').addClass('search-item page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);

			var $input, InputClear;
			if (param.hasSearch) {
				var InputGroup = $('<div>').addClass('input-group theme-input-group m-t-xl col-8');
				$input = $('<input>').addClass('input-control').attr('placeholder', param.placeholder).css(param.inputStyle).appendTo(InputGroup);
				InputClear = $('<div>').addClass('input-clear').appendTo(InputGroup);
				$(InputGroup).appendTo(Animated);
			}

			var KeyboardWrap = $('<div>').addClass('keyboard-wrap position').appendTo(Animated);
			var SearchItems = $('<div>').addClass('search-item-group col-10 margin-auto m-t-xl');
			var Itemlist = $('<div>').addClass('search-item-list clearfix btn-shadow-list gradual-theme-list btn-list').css(param.itemlistStyle);
			
			$(Itemlist).appendTo(SearchItems);

			var PageInfo = $('<div>').addClass('page-info theme-color');
			$('<div>').addClass('btn btn-prev-page').appendTo(PageInfo);
			$('<div>').addClass('info line-block').html('<span class="current-page">1</span> / <span class="total-page">1</span>').appendTo(PageInfo);
			$('<div>').addClass('btn btn-next-page').appendTo(PageInfo);

			$(PageInfo).appendTo(SearchItems);
			$(SearchItems).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap), init);

			// 初始化
			function init(_items) {
				param.items = _items;
			
				// 输出分页
				$.ShowPagesData('.search-item', param.items, param.showlen, showlist);
				

				if (param.hasSearch) {
					// 呼出拼音插件
					$input.on('click', function() {
						$(KeyboardWrap).CompositeKeyboard({
							isZzj: false,
							shift: true,
							isCapitalBig: true,
							blankClickHide: true,
							input: '.input-group .input-control',
							blankback: function(chars, $ele) {     // 确认
								console.log(chars, $ele, '键盘确认按钮返回');
								var data = $.SearchingTransformData(chars, param.matchParam, param.items);
								$.ShowPagesData('.search-item', data, 9, showlist);
							}
						});
					});
	
					// 清除输入框内容
					$(InputClear).on('click', function() {
						$.TheKeySound();
						$input.val('');
						$.ShowPagesData('.search-item', param.items, 9, showlist);
					});
				}
			}
				

			function showlist(ele, _num, _size, _data) {
				var start = (_num - 1) * _size;
				var end = start + _size;
				param.currData = _data.slice(start, end);

				// 输出列表
				$(PageInfo).find('.current-page').html(_num);
				$(Itemlist).empty();
				$.each(param.currData, function(n, val) {
					var name = val[param.showParam];
					var item = '<li class="btn"><span>' + name + '</span></li>';
					$(Itemlist).append(item);
				});

				// 选择
				$(Itemlist).find('li').one('click', function() {
					$.TheKeySound();
					var index = $(this).index();
					var info = param.currData[index];
					if (typeof param.itemBack == 'function')
						param.itemBack($(this), info);
				});

				// 倒计时
				$.BackInterval(param.s, param.timeBack);

				if (param.currData.length <= 0) {
					$.Speak(param.nothingMsg);
					$(Itemlist).html('<li class="hint-message theme-color">' + param.nothingMsg + '</li>')
				}
			}

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '搜索选项';
		},

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
		ItemSummaryGroup: function(_param) {
			var param = {
				s: 90,
				type: 0,
				info: '',
				title: null,
				imgSrc: 'assets/images/bg/doctor-img-white.png',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				itemBack: null,
				pageClass: '',
				hasHeader: true,
				titleStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.type = _param.type != undefined ? _param.type : param.type;
				param.info = _param.info != undefined ? _param.info : param.info;
				param.name = _param.name != undefined ? _param.name : param.name;
				param.job = _param.job != undefined ? _param.job : param.job;
				param.visit = _param.visit != undefined ? _param.visit : param.visit;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.imgSrc = _param.imgSrc != undefined ? _param.imgSrc : param.imgSrc;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.pageClass = _param.pageClass != undefined ? _param.pageClass : param.pageClass;
				param.hasHeader = _param.hasHeader != undefined ? _param.hasHeader : param.hasHeader;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
			}
			var PageWrap = $('<div>').addClass('item-summary-group page ' + param.pageClass);
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			if (param.title)
				$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);
			var SummaryWrap = $('<div>').addClass('summary-wrap theme-br-color col-10 margin-auto m-t-xl');
			var SummaryHeader = $('<div>').addClass('summary-header gradual-theme p-all-xl text-center font-30 ' + (param.type == 0 ? '' : 'row-item'));
			if (param.type != 0)
				$('<img>').attr('src', param.imgSrc).appendTo(SummaryHeader);
			var Info = $('<div>').addClass('info');
			$('<h2>').addClass('font-48 m-b-l').html(param.name).appendTo(Info);
			if (param.job)
				$('<p>').addClass('job').html(param.job).appendTo(Info);
			if (param.visit)
				$('<p>').addClass('visit').html(param.visit).appendTo(Info);
			$(Info).appendTo(SummaryHeader);
			if (param.hasHeader)
				$(SummaryHeader).appendTo(SummaryWrap);

			var SummaryBody = $('<div>').addClass('summary-body');
			var Summarylist = $('<div>').addClass('summary-list gray-6').html(param.info).appendTo(SummaryBody);

			$(SummaryBody).appendTo(SummaryWrap);
			$(SummaryWrap).appendTo(Animated);
			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			setTimeout(function() {
				// 滑动
				$(SummaryBody).SimulateScroll({
			        target: $(Summarylist)
			    });
			}, 1000);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '项目详情';
		},

		/*
		 * 列表分页
		 * @param s 返回时间
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
		 * @param selectTime 是否可选时间
		 * @param hasConfirm 是否有确认按钮
		 * @param matchParam 匹配参数
		 * @param nothingMsg 未查到信息提示
		 * @param titleStyle 标题样式
		 * @param timeIconSrc 选择时间图标
		 * @param summaryBack 详情返回
		 * @param clickTimeBack 点击时间图标返回
		 * @param listGroupStyle 列表外层样式
		 * @param searchInputHint 搜索框占位符提示
		 */
		listGroupPanel: function(_param) {
			var param = {
				s: 60,
				size: 6,
				title: '请选择您要缴费的项目',
				tipMsg: '*缴费最多可选当前页',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				btnName: '确 认',
				isSpeak: true,
				isRadio: false,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnBack: null,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				btnStyle: {},
				topItems: [],
				bodyItem: [],
				pageClass: '',
				hasSearch: false,
				hasSelect: false,
				hasSumary: false,
				selectTime: false,
				hasConfirm: false,
				matchParam: '',
				nothingMsg: '没有查询到列表信息',
				titleStyle: {},
				timeIconSrc: 'assets/images/icons/calendar.png',
				summaryBack: null,
				clickTimeBack: null,
				listGroupStyle: {},
				searchInputHint: '请输入您要查询科室首字母',
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.size = _param.size != undefined ? _param.size : param.size;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.tipMsg = _param.tipMsg != undefined ? _param.tipMsg : param.tipMsg;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.isRadio = _param.isRadio != undefined ? _param.isRadio : param.isRadio;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.topItems = _param.topItems != undefined ? _param.topItems : param.topItems;
				param.bodyItem = _param.bodyItem != undefined ? _param.bodyItem : param.bodyItem;
				param.pageClass = _param.pageClass != undefined ? _param.pageClass : param.pageClass;
				param.hasSearch = _param.hasSearch != undefined ? _param.hasSearch : param.hasSearch;
				param.hasSelect = _param.hasSelect != undefined ? _param.hasSelect : param.hasSelect;
				param.hasSumary = _param.hasSumary != undefined ? _param.hasSumary : param.hasSumary;
				param.selectTime = _param.selectTime != undefined ? _param.selectTime : param.selectTime;
				param.hasConfirm = _param.hasConfirm != undefined ? _param.hasConfirm : param.hasConfirm;
				param.matchParam = _param.matchParam != undefined ? _param.matchParam : param.matchParam;
				param.nothingMsg = _param.nothingMsg != undefined ? _param.nothingMsg : param.nothingMsg;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.timeIconSrc = _param.timeIconSrc != undefined ? _param.timeIconSrc : param.timeIconSrc;
				param.summaryBack = _param.summaryBack != undefined ? _param.summaryBack : param.summaryBack;
				param.clickTimeBack = _param.clickTimeBack != undefined ? _param.clickTimeBack : param.clickTimeBack;
				param.listGroupStyle = _param.listGroupStyle != undefined ? _param.listGroupStyle : param.listGroupStyle;
				param.searchInputHint = _param.searchInputHint != undefined ? _param.searchInputHint : param.searchInputHint;
			}
			var PageWrap = $('<div>').addClass('list-group-panel page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			var TitleGroup = $('<div>').addClass('title theme-title-color text-shadow').html('<span>' + param.title + '</span>').css(param.titleStyle).appendTo(Animated);
			if (param.selectTime)
				$('<img>').attr('src', param.timeIconSrc).appendTo(TitleGroup);
			if (param.hasSearch) {
				var SearchGroup = $('<div>').addClass('search-group');
				$('<input>').attr('placeholder', param.searchInputHint).addClass('input-control theme-br-color theme-color').appendTo(SearchGroup);
				$('<i>').addClass('icon-search').appendTo(SearchGroup);
				$(SearchGroup).appendTo(TitleGroup);
				$('<div>').addClass('keyboard-wrap position').appendTo(TitleGroup);
			}

			// if (param.hasSelect)
				// $('<div>').addClass('hint-tip gray-9 text-center').html(param.tipMsg).appendTo(Animated);

			var listGroup = $('<div>').addClass('list-group-wrap col-11 theme-br-color ' + param.pageClass);
			var listTop = $('<div>').addClass('list-top gradual-theme row-item');
			$.each(param.topItems, function(n, val) {
				$('<span>').html(val).appendTo(listTop);
			});
			$(listTop).appendTo(listGroup);

			var listBody = $('<div>').addClass('list-group gray-9').css(param.listGroupStyle);
			$(listBody).appendTo(listGroup);
			var PageInfo = $('<div>').addClass('page-info theme-color');
			$('<div>').addClass('btn btn-prev-page').appendTo(PageInfo);
			$('<div>').addClass('info line-block').html('<span class="current-page">1</span> / <span class="total-page">1</span>').appendTo(PageInfo);
			$('<div>').addClass('btn btn-next-page').appendTo(PageInfo);
			$(PageInfo).appendTo(listGroup);

			$(listGroup).appendTo(Animated);
			
			if (param.hasConfirm) {
				var BtnWrap = $('<div>').addClass('text-center btn-wrap p-b-l p-t-l');
				$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius btn-confirm').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
				$(BtnWrap).appendTo(Animated);
			}

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap), init);

			// 初始化
			function init(_items) {
				param.items = _items;
				param.selectItems = [];
				$.each(param.items, function(n, val) {
					param.selectItems.push(false);
				})
			
				// 输出分页
				$.ShowPagesData('.list-group-panel .animated', param.items, param.size, showlist);

			}				

			function showlist(ele, _num, _size, _data) {
				var start = (_num - 1) * _size;
				var end = start + _size;
				param.currData = _data.slice(start, end);

				// 输出列表
				$(PageInfo).find('.current-page').html(_num);
				$(listBody).empty();
				$.each(param.currData, function(n, val) {
					var row = $('<div>').addClass('row-item theme-br-color');
					if (param.hasSelect)
						$('<span>').html('<i class="fa fa-check"></i>').appendTo(row);
					$.each(param.bodyItem, function(_n, _val) {
						$('<span>').html(val[_val]).appendTo(row);
					});
					if (param.hasSumary)
						$('<span>').html('<div class="btn btn-link theme-color">查看详情</div>').appendTo(row);
					if (param.selectItems[start+n]) {
						$(row).addClass('active');
					}
					$(row).appendTo(listBody);
				});

				// 选择
				$(listBody).find('.row-item').on('click', function() {
					$.TheKeySound();
					if (param.isRadio) {
						$(this).changeActive();
						param.selectItems = [];
						$.each(param.items, function(n, val) {
							param.selectItems.push(false);
						})
					} else {
						$(this).toggleClass('active');
					}
					var index = $(this).index();
					param.selectItems[start+index] = $(this).hasClass('active');
				});

				// 详情
				$(listBody).find('.row-item .btn-link').on('click', function(event) {
					$.TheKeySound();
					event.stopPropagation();
					var index = $(this).parents('.row-item').index();
					var list = param.currData[index];
					if (typeof param.summaryBack == 'function')
						param.summaryBack($(this), list);
				});

				// 倒计时
				$.BackInterval(param.s, param.timeBack);

				if (param.currData.length <= 0) {
					$.Speak(param.nothingMsg);
					$(listBody).html('<li class="hint-message theme-color">' + param.nothingMsg + '！</li>')
				}
			}

			// 选择时间
			$(TitleGroup).find('img').on('click', function() {
				$.TheKeySound();
				if (typeof param.clickTimeBack == 'function')
					param.clickTimeBack($(this), init);
			});

			// 搜索按钮
			$(TitleGroup).find('.icon-search').on('click', function() {
				$.TheKeySound();
				if ($(this).parent().hasClass('active')) {
					$(".composite-keyboard").slideUp("fast");
				}
				$(this).parent().toggleClass('active');
			});

			// 搜索
			$(TitleGroup).find('.input-control').on('click', function() {
				$.TheKeySound();
				$(TitleGroup).find('.keyboard-wrap').CompositeKeyboard({
					isZzj: false,
					shift: true,
					isCapitalBig: true,
					blankClickHide: true,
					input: '.search-group .input-control',
					blankback: function(chars, $ele) {     // 确认
						var data = $.SearchingTransformData(chars, param.matchParam, param.items);
						$.ShowPagesData('.list-group-panel .animated', data, param.size, showlist);
					}
				});
			});

			// 按钮
			$(PageWrap).find('.btn-confirm').on('click', function() {
				$.TheKeySound();
				var list = [];
				$.each(param.selectItems, function(n, val) {
					if (val)
						list.push(n);
				})
				var len = list.length;
				if (!len) {
					$.Speak('请选择列表');
					return $.layer({
						type: 1,
						msg: '请选择列表！'
					})
				}
				var data = [];
				$.each(list, function(n, val) {
					data.push(param.items[val]);
				})
				if (typeof param.btnBack == 'function')
					param.btnBack($(this), data);
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '列表分页';
		},

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
		SummaryPagePanel: function(_param) {
			var param = {
				s: 60,
				size: 6,
				title: '详情列表',
				tipMsg: '*点击空白处返回',
				wrapper: '.wrapper',
				isSpeak: true,
				timeBack: null,
				callBack: null,
				topItems: [],
				bodyItem: [],
				hideBack: null,
				pageClass: '',
				tipMsgStyle: {},
				listGroupStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.size = _param.size != undefined ? _param.size : param.size;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.tipMsg = _param.tipMsg != undefined ? _param.tipMsg : param.tipMsg;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.topItems = _param.topItems != undefined ? _param.topItems : param.topItems;
				param.bodyItem = _param.bodyItem != undefined ? _param.bodyItem : param.bodyItem;
				param.hideBack = _param.hideBack != undefined ? _param.hideBack : param.hideBack;
				param.pageClass = _param.pageClass != undefined ? _param.pageClass : param.pageClass;
				param.tipMsgStyle = _param.tipMsgStyle != undefined ? _param.tipMsgStyle : param.tipMsgStyle;
				param.listGroupStyle = _param.listGroupStyle != undefined ? _param.listGroupStyle : param.listGroupStyle;
			}
			var PageWrap = $('<div>').addClass('summary-list-group position-box');
			$('<div>').addClass('text-center m-t-xl hint').html(param.tipMsg).css(param.tipMsgStyle).appendTo(PageWrap);
			var masked = $('<div>').addClass('position-box masked').appendTo(PageWrap);
			var listGroup = $('<div>').addClass('list-group-wrap col-11 theme-br-color ' + param.pageClass);
			var listTop = $('<div>').addClass('list-top gradual-theme row-item');
			$.each(param.topItems, function(n, val) {
				$('<span>').html(val).appendTo(listTop);
			});
			$(listTop).appendTo(listGroup);

			var listBody = $('<div>').addClass('list-group gray-9').css(param.listGroupStyle);
			$(listBody).appendTo(listGroup);
			var PageInfo = $('<div>').addClass('page-info theme-color');
			$('<div>').addClass('btn btn-prev-page').appendTo(PageInfo);
			$('<div>').addClass('info line-block').html('<span class="current-page">1</span> / <span class="total-page">1</span>').appendTo(PageInfo);
			$('<div>').addClass('btn btn-next-page').appendTo(PageInfo);
			$(PageInfo).appendTo(listGroup);
			
			$(listGroup).appendTo(PageWrap);
			if (!$('.summary-list-group').length)
				$(param.wrapper).append(PageWrap);
			$('.summary-list-group').slideDown('fast');

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap), init);

			// 初始化
			function init(_items) {
				param.items = _items;
			
				// 输出分页
				$.ShowPagesData('.summary-list-group', param.items, param.size, showlist);

			}
				

			function showlist(ele, _num, _size, _data) {
				var start = (_num - 1) * _size;
				var end = start + _size;
				param.currData = _data.slice(start, end);
				
				// 输出列表
				$('.summary-list-group .current-page').html(_num);
				$('.summary-list-group .list-group').empty();
				$.each(param.currData, function(n, val) {
					var row = $('<div>').addClass('row-item theme-br-color');
					$.each(param.bodyItem, function(_n, _val) {
						$('<span>').html(val[_val]).appendTo(row);
					});
					$('.summary-list-group .list-group').append(row);
				});

				// 选择
				$('.summary-list-group .list-group').find('.row-item').on('click', function() {
					$.TheKeySound();
					// $.BackInterval(param.s, param.timeBack);
					$(this).toggleClass('active').siblings().removeClass('active');
				});

				// 倒计时
				$.BackInterval(param.s, param.timeBack);

				if (param.currData.length <= 0) {
					$.Speak('没有查询到列表信息');
					$('.summary-list-group .list-group').html('<li class="hint-message theme-color">没有查询到列表信息！</li>')
				}
			}

			// 返回 - 隐藏
			$('.summary-list-group .masked').on('click', function() {
				$.TheKeySound();
				$('.summary-list-group').slideUp('fast');
				if (typeof param.hideBack == 'function')
					param.hideBack($(this));
			});
			return '详情分页';
		},

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
		ScanCode: function(_param) {
			var param = {
				s: 60,
				title: '请使用支付宝扫描二维码缴费',
				bgSrc: 'assets/images/bg/sweep-ali.png',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnBack: null,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				titleStyle: {},
				qrImgStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.bgSrc = _param.bgSrc != undefined ? _param.bgSrc : param.bgSrc;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.sexlist = _param.sexlist != undefined ? _param.sexlist : param.sexlist;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.qrImgStyle = _param.qrImgStyle != undefined ? _param.qrImgStyle : param.qrImgStyle;
			}
			var PageWrap = $('<div>').addClass('scan-code page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);

			var CodeGroup = $('<div>').addClass('code-group col-8 margin-auto');
			$('<img>').attr('src', param.bgSrc).addClass('code-bg').appendTo(CodeGroup);
			var QrCode = $('<div>').addClass('qr-code');
			var QrImg = $('<img>').css(param.qrImgStyle).appendTo(QrCode);
			$(QrCode).appendTo(CodeGroup);
			$(CodeGroup).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);


			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap), $(QrImg));

			// 按钮
			$(PageWrap).find('.btn-confirm').on('click', function() {
				$.TheKeySound();
				if (typeof param.btnBack == 'function')
					param.btnBack($(this), param.sex);
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '扫码支付';
		},

		/*
		 * 选择预约日期
		 * @param s 返回时间
		 * @param items 输出数据
		 * @param title 标题
		 * @param hintMsg 提示信息
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
		 * @param showParam 输出数据参数
		 * @param titleStyle 标题样式
		 * @param hasConfirm 是否有确认按钮
		 */
		ChooseSubscribeDate: function(_param) {
			var param = {
				s: 60,
				title: '请选择预约时间',
				items: $.GetCurrentTime(6),
				hintMsg: '温馨提示：目前系统支持一周内的预约挂号！',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnName: '确认',
				btnBack: null,
				btnStyle: {},
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				itemBack: null,
				showParam: 'day',
				titleStyle: {},
				hasConfirm: true,
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.items = _param.items != undefined ? _param.items : param.items;
				param.hintMsg = _param.hintMsg != undefined ? _param.hintMsg : param.hintMsg;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.itemBack = _param.itemBack != undefined ? _param.itemBack : param.itemBack;
				param.showParam = _param.showParam != undefined ? _param.showParam : param.showParam;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.hasConfirm = _param.hasConfirm != undefined ? _param.hasConfirm : param.hasConfirm;
			}
			var PageWrap = $('<div>').addClass('choose-subscribe-date page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);

			var DateGroup = $('<div>').addClass('date-group box-shadow theme-br-color col-10 margin-auto text-center');
			var TopGroup = $('<div>').addClass('row-item top-group gradual-theme');
			var BodyGroup = $('<div>').addClass('body-group gray-6');
			var AmGroup = $('<div>').addClass('row-item').html('<span disabled>上午</span>').appendTo(BodyGroup);
			var PmGroup = $('<div>').addClass('row-item').html('<span disabled>下午</span>').appendTo(BodyGroup);
			var items = param.items.slice(0, 7);
			$('<span>').appendTo(TopGroup);
			$.each(items, function(n, val) {
				$('<span>').html(val[param.showParam] + '号').appendTo(TopGroup);
				$('<span>').appendTo(AmGroup);
				$('<span>').appendTo(PmGroup);
			});
			// var apm = $.GetCurrentTime(2);
			var apm = 0;
			if (apm > 0) {
				$(AmGroup).find('span:eq(1)').attr('disabled', '');
				$(PmGroup).find('span:eq(1)').addClass('active');
			} else {
				$(AmGroup).find('span:eq(1)').addClass('active');
			}
			$(TopGroup).appendTo(DateGroup);
			$(BodyGroup).appendTo(DateGroup);
			$(DateGroup).appendTo(Animated);
			$('<p>').addClass('theme-hint-color text-center p-all-xl').html(param.hintMsg).appendTo(Animated);

			if (param.hasConfirm) {
				var BtnWrap = $('<div>').addClass('text-center btn-wrap p-b-l p-t-l');
				$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius btn-confirm').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
				$(BtnWrap).appendTo(Animated);
			}

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));
			
			// 选择日期
			$(BodyGroup).find('span:not([disabled])').on('click', function() {
				if (!$(this).hasClass('active')) {
					$(BodyGroup).find('span').removeClass('active');
					$(this).addClass('active');
					var data = GetData();
					if (typeof param.itemBack == 'function')
						param.itemBack($(this), data);
				}
			});
			
			// 按钮
			$(PageWrap).find('.btn-confirm').on('click', function() {
				$.TheKeySound();
				var data = GetData();
				if (typeof param.btnBack == 'function')
					param.btnBack($(this), data);
			});

			// 获取数据
			function GetData() {
				var $active = $(BodyGroup).find('span.active');
				var $parent = $active.parent();
				var index = $active.index() - 1;
				var apm = $parent.index();
				var data = param.items[index];
				return {
					noon: apm,
					data: data,
				}
			}

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '预约日期列表';
		},

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
		ChooseDoctor: function(_param) {
			var param = {
				s: 60,
				size: 3,
				title: '请选择就诊医生',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				nothingMsg: '没有查询到列表信息',
				titleStyle: {},
				itemBtnBack: null,
				itemBtnClass: '',
				listGroupStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.size = _param.size != undefined ? _param.size : param.size;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.getItem = _param.getItem != undefined ? _param.getItem : param.getItem;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.nothingMsg = _param.nothingMsg != undefined ? _param.nothingMsg : param.nothingMsg;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.itemBtnBack = _param.itemBtnBack != undefined ? _param.itemBtnBack : param.itemBtnBack;
				param.itemBtnClass = _param.itemBtnClass != undefined ? _param.itemBtnClass : param.itemBtnClass;
				param.listGroupStyle = _param.listGroupStyle != undefined ? _param.listGroupStyle : param.listGroupStyle;
			}
			var PageWrap = $('<div>').addClass('choose-doctor page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);


			var listGroup = $('<div>').addClass('doctor-list-wrap col-10 margin-auto');

			var listBody = $('<div>').addClass('doctor-list-group').css(param.listGroupStyle);
			$(listBody).appendTo(listGroup);

			var PageInfo = $('<div>').addClass('page-info theme-color');
			$('<div>').addClass('btn btn-prev-page').appendTo(PageInfo);
			$('<div>').addClass('info line-block').html('<span class="current-page">1</span> / <span class="total-page">1</span>').appendTo(PageInfo);
			$('<div>').addClass('btn btn-next-page').appendTo(PageInfo);
			$(PageInfo).appendTo(listGroup);
			
			if (param.hasConfirm) {
				var BtnWrap = $('<div>').addClass('text-center btn-wrap p-b-l p-t-l');
				$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius btn-confirm').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
				$(BtnWrap).appendTo(listGroup);
			}


			$(listGroup).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap), init);

			// 初始化
			function init(_items) {
				param.items = _items;
			
				// 输出分页
				$.ShowPagesData('.doctor-list-wrap', param.items, param.size, showlist);

			}				

			function showlist(ele, _num, _size, _data) {
				var start = (_num - 1) * _size;
				var end = start + _size;
				param.currData = _data.slice(start, end);

				// 输出列表
				$(PageInfo).find('.current-page').html(_num);
				$(listBody).empty();
				$.each(param.currData, function(n, val) {
					var item = param.getItem(val);
					$(listBody).append(item);
				});

				// 选择
				$(listBody).find('.row-item').on('click', function() {
					$.TheKeySound();
					$(this).toggleClass('active');
				});

				console.log( $(listBody) );
				// 详情
				$(listBody).find(param.itemBtnClass).on('click', function(event) {
					$.TheKeySound();
					event.stopPropagation();
					var index = $(this).parents('.item-group').index();
					var list = param.currData[index];
					if (typeof param.itemBtnBack == 'function')
						param.itemBtnBack($(this), list);
				});

				// 倒计时
				$.BackInterval(param.s, param.timeBack);

				if (param.currData.length <= 0) {
					$.Speak(param.nothingMsg);
					$(listBody).html('<li class="hint-message theme-color text-center">' + param.nothingMsg + '！</li>')
				}
			}

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '医生分页';
		},

		/*
		 * 确认操作信息
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
		ConfirmHandleInformation: function(_param) {
			var param = {
				s: 60,
				info: {},
				title: '请选择预约时间',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnName: '确认',
				btnBack: null,
				btnStyle: {},
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				titleStyle: {},
				hasConfirm: true,
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.info = _param.info != undefined ? _param.info : param.info;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.hasConfirm = _param.hasConfirm != undefined ? _param.hasConfirm : param.hasConfirm;
			}
			var PageWrap = $('<div>').addClass('confirm-handle-information page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			
			var InfoWrap = $('<div>').addClass('information-wrap theme-br-color box-shadow col-6 margin-auto');
			var TopInfo = $('<div>').addClass('top-info-group gradual-theme text-center');
			$('<img>').addClass('img-circle').attr('src', param.info.imgSrc).appendTo(TopInfo);
			$('<h3>').html(param.info.doctorName).appendTo(TopInfo);
			$('<h4>').html(param.info.departName).appendTo(TopInfo);
			$('<p>').html(param.info.doctorGree).appendTo(TopInfo);
			$(TopInfo).appendTo(InfoWrap);

			var BodyInfo = $('<table>').addClass('body-info-group theme-hint-color');
			if (param.info.bodyItem) {
				$.each(param.info.bodyItem, function(n, val) {
					var tr = $('<tr>');
					$('<td>').html(val.name).appendTo(tr);
					$('<td>').html(val.value).appendTo(tr);
					$(tr).appendTo(BodyInfo);
				});
			}
			$(BodyInfo).appendTo(InfoWrap);

			if (param.hasConfirm) {
				var BtnWrap = $('<div>').addClass('text-center btn-wrap p-b-l p-t-l');
				$('<div>').addClass('btn btn-shadow btn-gradual-theme btn-radius btn-confirm').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
				$(BtnWrap).appendTo(InfoWrap);
			}
			$(InfoWrap).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap));
			
			// 按钮
			$(PageWrap).find('.btn-confirm').on('click', function() {
				$.TheKeySound();
				if (typeof param.btnBack == 'function')
					param.btnBack($(this));
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '确认操作信息';
		},

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
		CashTopUp: function(_param) {
			var param = {
				s: 60,
				title: '请按照要求放入现金',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnName: '确认',
				btnBack: null,
				btnStyle: {},
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				needMoney: 0,
				titleStyle: {},
				hasConfirm: true,
				gifImgSrc: 'assets/images/card/paper-in.gif',
				billImgSrc: 'assets/images/payway/money-4-icon.png',
				hintBillMsg: '本机只接收以下纸币：',
				billTypeMsg: '纸币：10元、20元、50元、100元',
				servicesPhone: '100-1000-1000',
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.needMoney = _param.needMoney != undefined ? _param.needMoney : param.needMoney;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.hasConfirm = _param.hasConfirm != undefined ? _param.hasConfirm : param.hasConfirm;
				param.gifImgSrc = _param.gifImgSrc != undefined ? _param.gifImgSrc : param.gifImgSrc;
				param.billImgSrc = _param.billImgSrc != undefined ? _param.billImgSrc : param.billImgSrc;
				param.hintBillMsg = _param.hintBillMsg != undefined ? _param.hintBillMsg : param.hintBillMsg;
				param.billTypeMsg = _param.billTypeMsg != undefined ? _param.billTypeMsg : param.billTypeMsg;
				param.servicesPhone = _param.servicesPhone != undefined ? _param.servicesPhone : param.servicesPhone;
			}
			var PageWrap = $('<div>').addClass('cash-top-up page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);
			
			var BillGroup = $('<div>').addClass('bill-img-wrap text-center m-t-xl theme-hint-color');
			var BillImg = $('<div>').addClass('img-group');
			$('<span>').addClass('vertical-middle font-36').html(param.hintBillMsg).appendTo(BillImg);
			$('<img>').attr('src', param.billImgSrc).appendTo(BillImg);
			$(BillImg).appendTo(BillGroup);
			$('<p>').html(param.billTypeMsg).appendTo(BillGroup);
			$(BillGroup).appendTo(Animated);

			var DivWrap = $('<div>').addClass('text-center m-t-xl');
			var LeftWrap = $('<div>').addClass('paper-in-wrap text-center line-block vertical-middle');
			$('<img>').attr('src', param.gifImgSrc).appendTo(LeftWrap);
			$(LeftWrap).appendTo(DivWrap);

			var RightWrap = $('<div>').addClass('line-block handle-info-wrap theme-hint-color font-28 vertical-middle m-l-xl');
			var MoneyWrap = $('<p>').addClass('real-sum font-48 theme-color').html('已放入：¥');
			var SumEle = $('<span>').html('0.00').appendTo(MoneyWrap);
			$(MoneyWrap).appendTo(RightWrap);
			if (param.needMoney > 0) {
				var MoneyWrap = $('<p>').addClass('need-sum font-48 theme-color').html('需放入：¥');
				var NeedEle = $('<span>').html(param.needMoney.toFixed(2)).appendTo(MoneyWrap);
				$(MoneyWrap).appendTo(RightWrap);
			}

			$('<p>').addClass('text-left').html('温馨提示：如需退费请到窗口').appendTo(RightWrap);
			$('<p>').addClass('text-left').html('若机器出现故障，请拨打维修电话 ' + param.servicesPhone).appendTo(RightWrap);
			if (param.hasConfirm)
				var ConfirmBtn = $('<div>').addClass('btn btn-gradual-theme btn-radius btn-shadow btn-confirm').css(param.btnStyle).html(param.btnName).appendTo(RightWrap);
			$(RightWrap).appendTo(DivWrap);
			$(DivWrap).appendTo(Animated);
			$(Animated).appendTo(Content);

			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack(PageWrap, HandleGroup, SumEle, ConfirmBtn, NeedEle);
			
			// 按钮
			$(ConfirmBtn).on('click', function() {
				$.TheKeySound();
				if (typeof param.btnBack == 'function')
					param.btnBack($(this));
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '现金充值';
		},

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
		PosUnionpay: function(_param) {
			var param = {
				s: 60,
				title: '请按照提示执行操作步骤',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				hintItem: [
					'第1步：请先刷银行卡',
					'第2步：再按“确认”按钮',
					'第3步：输入密码',
					'第4步：按“确认”按钮'
				],
				posImgSrc: 'assets/images/bg/pos-img.png',
				hintPStyle: {},
				titleStyle: {},
				posImgStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.hintItem = _param.hintItem != undefined ? _param.hintItem : param.hintItem;
				param.posImgSrc = _param.posImgSrc != undefined ? _param.posImgSrc : param.posImgSrc;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.hintPStyle = _param.hintPStyle != undefined ? _param.hintPStyle : param.hintPStyle;
				param.posImgStyle = _param.posImgStyle != undefined ? _param.posImgStyle : param.posImgStyle;
			}
			var PageWrap = $('<div>').addClass('pos-unionpay page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);
			
			var UnionpayWrap = $('<div>').addClass('unionpay-wrap clearfix col-9 margin-auto');
			var LeftWrap = $('<div>').addClass('pull-left');
			$('<img>').addClass('pos-img').css(param.posImgStyle).attr('src', param.posImgSrc).appendTo(LeftWrap);
			$(LeftWrap).appendTo(UnionpayWrap);

			var RightWrap = $('<div>').addClass('pull-right font-36 gray-9 theme-hint-color');
			$('<h4>').addClass('m-b-xl').html('温馨提示：').appendTo(RightWrap);
			$.each(param.hintItem, function(n, val) {
				$('<p>').css(param.hintPStyle).html(val).appendTo(RightWrap);
			});
			$(RightWrap).appendTo(UnionpayWrap);
			$(UnionpayWrap).appendTo(Animated);
			$(Animated).appendTo(Content);

			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack(PageWrap);

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '银联充值';
		},

		/*
		 * 选择时间段
		 * @param s 返回时间
		 * @param yes 确认返回
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
		ChooseTimeQuantum: function(_param) {
			var param = {
				s: 60,
				yes: null,
				title: '选择时间段',
				wrapper: '.wrapper',
				endDate: '',
				statrDate: '',
				yesName: '完 成',
				hideName: '取 消',
				isSpeak: true,
				timeBack: null,
				callBack: null,
				hideBack: null,
				titleStyle: {},
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.yes = _param.yes != undefined ? _param.yes : param.yes;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.endDate = _param.endDate != undefined ? _param.endDate : param.endDate;
				param.statrDate = _param.statrDate != undefined ? _param.statrDate : param.statrDate;
				param.yesName = _param.yesName != undefined ? _param.yesName : param.yesName;
				param.hideName = _param.hideName != undefined ? _param.hideName : param.hideName;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.hideBack = _param.hideBack != undefined ? _param.hideBack : param.hideBack;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
			}
			var PageWrap = $('<div>').addClass('choose-time-quantum position-box');
			var Content = $('<div>').addClass('content');
			$('<div>').addClass('title').html(param.title).appendTo(Content);

			var DateGroup = $('<div>').addClass('date-input-group');
			$('<input>').addClass('input-control calendar-start-date').attr('placeholder', '开始时间').val(param.statrDate).appendTo(DateGroup);
			$('<span>').addClass('vertical-middle').html('至').appendTo(DateGroup);
			$('<input>').addClass('input-control calendar-end-date').attr('placeholder', '结束时间').val(param.endDate).appendTo(DateGroup);
			$(DateGroup).appendTo(Content);

			var CalendarGroup = $('<div>').addClass('calendar-wrap clearfix col-10');
			$('<div>').addClass('pull-left calendar-left').appendTo(CalendarGroup);
			$('<div>').addClass('pull-right calendar-right').appendTo(CalendarGroup);
			$(CalendarGroup).appendTo(Content);

			var BtnGroup = $('<div>').addClass('btn-wrap');
			$('<div>').addClass('btn btn-gradual-theme btn-shadow btn-radius btn-cancel').html(param.hideName).appendTo(BtnGroup);
			$('<div>').addClass('btn btn-gradual-theme btn-shadow btn-radius btn-confirm').html(param.yesName).appendTo(BtnGroup);
			$(BtnGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			if ($('.choose-time-quantum').length > 1) 
				$('.choose-time-quantum').remove();
			if (!$('.choose-time-quantum').length) {
				$(param.wrapper).append(PageWrap);

				$('.choose-time-quantum .calendar-start-date').ChooseData({
					target: $('.choose-time-quantum .calendar-left'),
					yearago: 80,
					callback: function() {
						$.BackInterval(param.s, param.timeBack);
					},
				});
			
				$('.choose-time-quantum .calendar-end-date').ChooseData({
					target: $('.choose-time-quantum .calendar-right'),
					yearago: 80,
					callback: function() {
						$.BackInterval(param.s, param.timeBack);
					},
				});

				// 确认 
				$('.choose-time-quantum .btn-confirm').on('click', function() {
					$.TheKeySound();
					var start = $('.choose-time-quantum .calendar-start-date').val();
					var end = $('.choose-time-quantum .calendar-end-date').val();
					if (start.replace(/\-/g, '') > end.replace(/\-/g, '')) {
						$.Speak('开始日期不可大于结束日期');
						return $.layer({
							type: 1,
							msg: '开始日期不可大于结束日期！',
							btn: ['确认']
						})
					}
					$('.choose-time-quantum').slideUp('fast');
					if (typeof param.yes == 'function')
						param.yes($(this), {
							start: start,
							end: end
						});
				});

				// 返回 - 隐藏
				$('.choose-time-quantum .btn-cancel').on('click', function() {
					$.TheKeySound();
					$('.choose-time-quantum').slideUp('fast');
					if (typeof param.hideBack == 'function')
						param.hideBack($(this));
				});
			}
			$('.choose-time-quantum').slideDown('fast');



			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($('.choose-time-quantum'));

			return '选择时间段';
		},

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
		MultipleOptions: function(_param) {
			var param = {
				s: 60,
				size: 3,
				title: '门诊满意度调查',
				wrapper: '.wrapper',
				animate: 'bounceIn',
				isSpeak: true,
				hasHome: true,
				hasPrev: true,
				hasExit: true,
				btnName: '提 交',
				btnBack: null,
				btnStyle: {},
				timeBack: null,
				homeBack: null,
				prevBack: null,
				exitBack: null,
				callBack: null,
				itemBack: null,
				multiple: [],
				titleStyle: {},
				hasConfirm: true,
				listGroupStyle: {},
				showMultipleParam: '',
				defaultSelectOption: 0,
			};
			if (_param) {
				param.s = _param.s != undefined ? _param.s : param.s;
				param.size = _param.size != undefined ? _param.size : param.size;
				param.title = _param.title != undefined ? _param.title : param.title;
				param.items = _param.items != undefined ? _param.items : param.items;
				param.wrapper = _param.wrapper != undefined ? _param.wrapper : param.wrapper;
				param.animate = _param.animate != undefined ? _param.animate : param.animate;
				param.isSpeak = _param.isSpeak != undefined ? _param.isSpeak : param.isSpeak;
				param.hasHome = _param.hasHome != undefined ? _param.hasHome : param.hasHome;
				param.hasPrev = _param.hasPrev != undefined ? _param.hasPrev : param.hasPrev;
				param.hasExit = _param.hasExit != undefined ? _param.hasExit : param.hasExit;
				param.btnName = _param.btnName != undefined ? _param.btnName : param.btnName;
				param.btnBack = _param.btnBack != undefined ? _param.btnBack : param.btnBack;
				param.btnStyle = _param.btnStyle != undefined ? _param.btnStyle : param.btnStyle;
				param.timeBack = _param.timeBack != undefined ? _param.timeBack : param.timeBack;
				param.homeBack = _param.homeBack != undefined ? _param.homeBack : param.homeBack;
				param.prevBack = _param.prevBack != undefined ? _param.prevBack : param.prevBack;
				param.exitBack = _param.exitBack != undefined ? _param.exitBack : param.exitBack;
				param.callBack = _param.callBack != undefined ? _param.callBack : param.callBack;
				param.itemBack = _param.itemBack != undefined ? _param.itemBack : param.itemBack;
				param.multiple = _param.multiple != undefined ? _param.multiple : param.multiple;
				param.showParam = _param.showParam != undefined ? _param.showParam : param.showParam;
				param.titleStyle = _param.titleStyle != undefined ? _param.titleStyle : param.titleStyle;
				param.hasConfirm = _param.hasConfirm != undefined ? _param.hasConfirm : param.hasConfirm;
				param.listGroupStyle = _param.listGroupStyle != undefined ? _param.listGroupStyle : param.listGroupStyle;
				param.showMultipleParam = _param.showMultipleParam != undefined ? _param.showMultipleParam : param.showMultipleParam;
				param.defaultSelectOption = _param.defaultSelectOption != undefined ? _param.defaultSelectOption : param.defaultSelectOption;
			}
			var PageWrap = $('<div>').addClass('multiple-options page');
			var Content = $('<div>').addClass('content');
			var Animated = $('<div>').addClass('animated ' + param.animate);
			$('<div>').addClass('title theme-title-color text-shadow').html(param.title).css(param.titleStyle).appendTo(Animated);

			var OptionWrap = $('<div>').addClass('option-list-wrap col-10 margin-auto theme-br-color');
			var OptionGroup = $('<div>').addClass('option-list gray-9').css(param.listGroupStyle);
			$(OptionGroup).appendTo(OptionWrap);

			var PageInfo = $('<div>').addClass('page-info theme-color');
			$('<div>').addClass('btn btn-prev-page').appendTo(PageInfo);
			$('<div>').addClass('info line-block').html('<span class="current-page">1</span> / <span class="total-page">1</span>').appendTo(PageInfo);
			$('<div>').addClass('btn btn-next-page').appendTo(PageInfo);
			$(PageInfo).appendTo(OptionWrap);
			if (param.hasConfirm) {
				var BtnWrap = $('<div>').addClass('text-center btn-wrap p-b-l p-t-l');
				$('<div>').addClass('btn btn-radius btn-gradual-theme btn-shadow btn-submit').css(param.btnStyle).html(param.btnName).appendTo(BtnWrap);
				$(BtnWrap).appendTo(OptionWrap);
			}

			$(OptionWrap).appendTo(Animated);

			$(Animated).appendTo(Content);
			$('<div>').addClass('time').html('<span class="s">0</span>s').appendTo(Content);

			var HandleGroup = $('<div>').addClass('handle-group');
			if (param.hasHome && !param.hasExit) {
				$('<div>').addClass('handle pull-right handle-home').html('首页').appendTo(HandleGroup);
			} else {
				if (param.hasHome)
					$('<div>').addClass('handle pull-left handle-home').html('首页').appendTo(HandleGroup);
			}
			if (param.hasExit)
				$('<div>').addClass('handle pull-right handle-exit').html('退卡').appendTo(HandleGroup);
				
			if (param.hasPrev)
				$('<div>').addClass('handle pull-right handle-prev').html('上一页').appendTo(HandleGroup);

			$(HandleGroup).appendTo(Content);
			$(Content).appendTo(PageWrap);
			$(param.wrapper).html(PageWrap);

			// 语音 - 日志
			if (param.isSpeak)
				$.Speak(param.title);
			$.Writelog(param.title);

			// 倒计时
			$.BackInterval(param.s, param.timeBack);

			// 渲染后执行
			if (typeof param.callBack == 'function')
				param.callBack($(PageWrap), init);

			// 初始化
			function init(_items) {
				param.items = _items;
				param.selectItems = [];
				$.each(param.items, function(n, val) {
					param.selectItems.push(param.defaultSelectOption);
				})
			
				// 输出分页
				$.ShowPagesData('.multiple-options .animated', param.items, param.size, showlist);

			}				

			function showlist(ele, _num, _size, _data) {
				var start = (_num - 1) * _size;
				var end = start + _size;
				param.currData = _data.slice(start, end);

				// 输出列表
				$(PageInfo).find('.current-page').html(_num);
				$(OptionGroup).empty();
				$.each(param.currData, function(n, val) {
					var Option = $('<div>').addClass('option-group');
					$('<p>').addClass('theme-hint-color').html((start+n+1) + '.' + val[param.showMultipleParam]).appendTo(Option);
					var EvaluateGroup = $('<div>').addClass('evaluate-list clearfix gray-8');
					$.each(param.multiple, function(_n, _val) {
						var Evaluate = $('<div>').addClass('evaluate');
						$('<i>').addClass('fa fa-check').appendTo(Evaluate);
						$('<span>').html(_val).appendTo(Evaluate);
						$(Evaluate).appendTo(EvaluateGroup);
					})
					if (param.selectItems[start+n] > -1) {
						$(EvaluateGroup).find('.evaluate').eq(param.selectItems[start+n]).addClass('active');
					}
					$(EvaluateGroup).appendTo(Option);
					$(Option).appendTo(OptionGroup)
				});

				// 选择
				$(OptionGroup).find('.evaluate').on('click', function() {
					$.TheKeySound();
					var index = $(this).index();
					var i = $(this).parents('.option-group').index();
					param.selectItems[start+i] = index;
					$(this).changeActive();
				});

				// 倒计时
				$.BackInterval(param.s, param.timeBack);

				if (param.currData.length <= 0) {
					$.Speak('没有查询到列表信息');
					$(OptionGroup).html('<div class="hint-message theme-color">没有查询到列表信息！</div>')
				}
			}
			
			// 按钮
			$(PageWrap).find('.btn-submit').on('click', function() {
				$.TheKeySound();
				if (typeof param.btnBack == 'function')
					param.btnBack($(this), param.selectItems);
			});

			// 首页
			$(PageWrap).find('.handle-home').one('click', function() {
				$.TheKeySound();
				if (typeof param.homeBack == 'function')
					param.homeBack($(this));
			});

			// 上一页
			$(PageWrap).find('.handle-prev').one('click', function() {
				$.TheKeySound();
				if (typeof param.prevBack == 'function')
					param.prevBack($(this));
			});

			// 退卡
			$(PageWrap).find('.handle-exit').one('click', function() {
				$.TheKeySound();
				if (typeof param.exitBack == 'function')
					param.exitBack($(this));
			});

			return '多重选择';
		},
	});

})(jQuery)
