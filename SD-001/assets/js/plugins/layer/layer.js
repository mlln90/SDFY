/*
 * 2018-04-04 16:31:11
 * layer by JQ
 * Evan
 */
var layerTimer;
(function($) {
	var layerIndex = 0;
	var layerWrapStyle = {
		top: 0,
	    left: 0,
	    width: '100%',
		color: '#FFFFFF',
	    height: '100%',
	    zIndex: 101,
	    position: 'absolute',
	    textAlign: 'center',
	    backgroundColor: 'rgba(0, 0, 0, .4)',
	}
	var contentStyle = {
		top: '50%',
	    left: '50%',
	    width: '650px',
	    position: 'absolute',
	    textAlign: 'center',
	    transform: 'translate(-50%, -50%)',
	}
	var animatedStyle = {
		overflow: 'hidden',
		borderRadius: '10px',
		backgroundColor: '#089187',
		boxShadow: '6px 9px 5px 0px rgba(78, 0, 0, 0.3)',
	}
	var topStyle = {
		position: 'relative',
		borderBottom: '1px solid #21C6B9',
	}
	var topStyle2 = {
		position: 'relative',
		backgroundImage: 'linear-gradient(0deg, #019490 0%, #18aaa6 8%, #2fc0bc 30%, #58cecb 59%, #93e5e2 100%),\
			linear-gradient(#ff00ff, #ff00ff)',
	}
	var titleStyle = {
		color: '#FFFFFF',
		fontSize: '22px',
		lineHeight: '50px',
		borderBottom: '1px solid #037E74',
	}
	var timeStyle = {
		top: 0,
		right: '20px',
		color: '#fff',
		lineHeight: '50px',
		position: 'absolute',
	}
	var messageWrapStyle = {
		padding: '25px',
		borderBottom: '1px solid #12B2A5',
	}
	var messageStyle = {
		color: '#089187',
		width: '600px',
		height: '380px',
		display: 'table-cell',
		overflow: 'hidden',
		fontSize: '30px',
		boxShadow: '0 0 7px rgba(0, 0, 0, .2), 0 4px 5px rgba(0, 0, 0, .4)',
		borderRadius: '5px',
		verticalAlign: 'middle',
		backgroundColor: '#FFFFFF',
	}
	var btnStyle = {
		color: '#FFFFFF',
		lineHeight: '80px',
		backgroundColor: '#089187',
	}

	var loginWrapStyle = {
		top: 0,
	    left: 0,
	    width: '100%',
	    height: '100%',
	    zIndex: 100,
	    position: 'absolute',
	    textAlign: 'center',
	    backgroundColor: 'rgba(0, 0, 0, .5)',
	}
	var maskStyle = {
		top: 0,
	    left: 0,
	    width: '100%',
	    height: '100%',
	    position: 'absolute',
	}
	var closeStyle = {
		top: '10px',
		right: '15px',
		color: '#fff',
		fontSize: '24px',
		position: 'absolute',
	};
	var loginAnimatedStyle = {
		overflow: 'hidden',
		boxShadow: '0 -4px 4px rgba(10, 165, 155, .2), 0 0 4px rgba(10, 165, 155, .5), 0 4px 4px rgba(10, 165, 155, .4)',
		// background: '-webkit-gradient(linear, 0 0, 0 bottom, from(#05C9BC), to(rgba(5, 131, 121, 1)))',
		borderRadius: '15px',
	};
	var inputGroupStyle = {
		padding: '10px 0'
	};
	var inputGroupNmaeStyle = {
		color: '#EFDCD8',
		width: '180px',
		fontSize: '24px',
		lineHeight: '42px',
		fontWeight: 'normal',
	};
	var inputGroupVauleStyle = {
		// color: '#089187',
		width: '330px',
		padding: '5px',
		fontSize: '28px',
		borderRadius: '3px',
	};
	var numberWrapStyle = {
		width: '540px',
		margin: '0 auto',
		padding: '15px 0 20px 0',
	};
	$.extend({
		/*
		 * layer
		 * @param msg 提示信息
		 * @param btn 按钮 - 数组 （最多两个）
		 * @param type 类型
		 * @param time 提示时间
		 * @param bulb 灯泡是否显示
		 * @param title 提示名称
		 * @param bulbSrc 图片路径
		 * @param yes 确认按钮回调
		 * @param cancel 取消按钮回调
		 * @param endExecute 定时时间结束后是否执行确认函数
		 */
		layer: function(_param) {
			var param = {
				msg: '\u63d0\u793a\u4fe1\u606f',
				btn: ['\u53d6\u0020\u6d88', '\u786e\u0020\u8ba4'],
				type: 0,
				time: 5,
				bulb: true,
				title: '\u4fe1\u606f\u63d0\u793a',
				bulbSrc: 'assets/images/tip/bulb.png',
				endExecute: true
			};
			if (_param) {
				if (_param.msg != undefined) param.msg = _param.msg;
				if (_param.btn != undefined) param.btn = _param.btn;
				if (_param.type != undefined) param.type = _param.type;
				if (_param.bulb != undefined) param.bulb = _param.bulb;
				if (_param.time != undefined) param.time = _param.time;
				if (_param.title != undefined) param.title = _param.title;
				if (_param.bulbSrc != undefined) param.bulbSrc = _param.bulbSrc;
				if (_param.endExecute != undefined) param.endExecute = _param.endExecute;
				if (_param.yes != undefined && typeof _param.yes == 'function') param.yes = _param.yes;
				if (_param.cancel != undefined && typeof _param.cancel == 'function') param.cancel = _param.cancel;
			}

			$('.layer-pop').remove();
			clearInterval(layerTimer);
			layerIndex++;

			if (param.type == 0) {

				var layerpop = $('<div>').addClass('layer-pop layer-pop-' + layerIndex).css(layerWrapStyle);
				$('<div>').addClass('mask').css(maskStyle).appendTo(layerpop);
				var content = $('<div>').addClass('content').css(contentStyle);

				var animated = $('<div>').addClass('animated bounceIn').css(animatedStyle);

				var top = $('<div>').css(topStyle);
				$('<h2>').css(titleStyle).html(param.title).appendTo(top);
				$('<div>').addClass('time').css(timeStyle).html(param.time < 10 ? '0' + param.time : param.time).appendTo(top);
				$(top).appendTo(animated);

				var wrap = $('<div>').css(messageWrapStyle);
				$('<div>').addClass('msg').css(messageStyle).html(param.msg).appendTo(wrap);
				$(wrap).appendTo(animated);

				var btns = $('<div>').addClass('btns clearfix');
				if (param.btn.length == 1) {
					btnStyle.width = '100%';
					$('<div>').addClass('btn pull-left btn-confirm').css(btnStyle).html(param.btn[0]).appendTo(btns);
				} else {
					btnStyle.width = '50%';
					$('<div>').addClass('btn pull-left btn-cancel').css(btnStyle).html(param.btn[0]).appendTo(btns);
					$('<div>').addClass('btn pull-left btn-confirm').css(btnStyle)
					.css('background-color', '#03716A').html(param.btn[1]).appendTo(btns);
				}
				$(btns).appendTo(animated);
				$(animated).appendTo(content);
				$(content).appendTo(layerpop);
				$('body > .container').append(layerpop);
			} else if (param.type == 1) {
				var layerpop = $('<div>').addClass('layer-pop layer-pop-' + layerIndex).css(layerWrapStyle);
				$('<div>').addClass('mask').css(maskStyle).appendTo(layerpop);
				var content = $('<div>').addClass('content').css(contentStyle).css('width', 650);

				var animated = $('<div>').addClass('animated bounceIn').css(animatedStyle).css('border-radius', 50);

				var top = $('<div>').css(topStyle2);
				$('<h2>').addClass('gradual-theme').css(titleStyle).css({
					fontSize: '48px',
					lineHeight: '120px',
				}).html(param.title).appendTo(top);
				$('<div>').addClass('time').css(timeStyle).css('top', 25).html(param.time < 10 ? '0' + param.time : param.time).appendTo(top);
				$(top).appendTo(animated);

				var wrap = $('<div>').css({
					padding: '25px 45px 5px',
					backgroundColor: '#FFFFFF',
				});
				var msg = $('<div>').addClass('msg').css(messageStyle).css({
					color: '#999999',
					boxShadow: 'none',
				});
				if (param.bulb) {					
					$('<img>').attr('src', param.bulbSrc).css({
						width: 40,
						height: 40,
						marginRight: '5px',
					}).appendTo(msg);
				}
				$('<span>').html(param.msg).css({
					verticalAlign: 'middle'
				}).appendTo(msg);
				$(msg).appendTo(wrap);
				$(wrap).appendTo(animated);

				var btns = $('<div>').addClass('btns clearfix text-center');
				var Style = {
					width: '260px',
					height: '80px',
					margin: '0 10px',
					fontSize: '36px',
					lineHeight: '80px',
					boxShadow: '6px 9px 5px 0px rgba(1, 121, 118, 0.3)',
					borderRadius: '40px',
				}
				if (param.btn.length == 1) {
					$('<div>').addClass('btn btn-confirm gradual-theme').css(Style).html(param.btn[0]).appendTo(btns);
				} else {
					$('<div>').addClass('btn btn-cancel gradual-theme').css(Style).html(param.btn[0]).appendTo(btns);
					$('<div>').addClass('btn btn-confirm gradual-theme').css(Style).html(param.btn[1]).appendTo(btns);
				}
				$(btns).appendTo(wrap);
				$(animated).appendTo(content);
				$(content).appendTo(layerpop);
				$('body > .container').append(layerpop);
			}

			layerTimer = setInterval(function() {
				param.time--;
				if (param.time <= 0) {
					clearInterval(layerTimer);
					ClosePop();
				}
				$('.layer-pop .time').html(param.time < 10 ? '0' + param.time : param.time);
			}, 1000);

			var isClick = false;
			$('.layer-pop .mask, .layer-pop .btn-cancel').on('click', function() {
				$.TheKeySound();
				isClick = true;
				ClosePop();
				if (typeof param.cancel == 'function') 
					setTimeout(param.cancel, 300);
			});

			$('.layer-pop .btn-confirm').on('click', function() {
				$.TheKeySound();
				isClick = true;
				ClosePop();
				if (typeof param.yes == 'function') 
					setTimeout(param.yes, 300);
			});

			function ClosePop() {
				$('.layer-pop .animated').attr('class', 'animated bounceOut');
				$('.layer-pop .btn-cancel').unbind('click');
				$('.layer-pop .btn-confirm').unbind('click');
				setTimeout(function() {
					$('.layer-pop').remove();
					clearInterval(layerTimer);
					if (typeof param.yes == 'function' && !isClick) {
						if (param.endExecute) {
							setTimeout(param.yes, 300);
						}
					}
				}, 300);
			}
		},

		/*
		 * 全屏提示
		 * @param _msg 提示信息
		 * @param _isSpeak 是否语音
		 */
		tip: function(_msg, _isSpeak) {
			_msg = _msg ? _msg : '\u8bf7\u7a0d\u540e';
			_isSpeak = _isSpeak == undefined ?  true: _isSpeak;
			$('.pop-tip').remove();
			layerIndex++;

			// 清除定时返回
			clearInterval(layerTimer);
			clearInterval(BackTimer);

			var tipPop = $('<div>').addClass('pop-tip layer-pop-' + layerIndex).css(layerWrapStyle).css({
				zIndex: 10,
				background: 'none'
			});
			var content = $('<div>').addClass('content').css({
				// marginTop: '100px',
				// background: 'url(assets/images/bg/big-bg.jpg) no-repeat',
				// backgroundSize: 'cover',
			});

			$('<div>').addClass('message theme-color').css({
				width: '1280px',
				height: '844px',
				display: 'table-cell',
				fontSize: '48px',
				textAlign: 'center',
				verticalAlign: 'middle',
			}).html(_msg + '...').appendTo(content);

			$(content).appendTo(tipPop);
			$('.container .wrapper').html(tipPop);
			if (_isSpeak) $.Speak(_msg);
		},

		/*
		 * 加载提示
		 * @param _isSpeak 是否播放语音
		 * @param _msg 提示信息
		 */
		loading: function(_isSpeak, _msg) {
			_msg = _msg ? _msg : '\u6b63\u5728\u52a0\u8f7d\u4e2d\u002c\u8bf7\u7a0d\u540e';
			_isSpeak = _isSpeak == undefined ?  true: _isSpeak;
			$('.layer-pop').remove();
			layerIndex++;
			clearInterval(layerTimer);

			var layerpop = $('<div>').addClass('layer-pop layer-pop-' + layerIndex).css(layerWrapStyle);
			var loading = $('<div>').addClass('loading').css(contentStyle);

			var loadbox = $('<div>').addClass('box');
			for (var i = 1; i < 13; i++) {
				$('<div>').addClass('circle_' + i).appendTo(loadbox);
			}

			$(loadbox).appendTo(loading);
			$('<span>').html(_msg + '...').appendTo(loading);
			$(loading).appendTo(layerpop);
			$('body > .container').append(layerpop);
			if (_isSpeak) $.Speak(_msg);
		},

		/*
		 * 登录弹窗
		 */
		login: function(_callback) {
			$('.pop-login').remove();
			var login = $('<div>').addClass('pop-login').css(loginWrapStyle);

			$('<div>').addClass('mask').css(maskStyle).appendTo(login);
			var content = $('<div>').addClass('content').css(contentStyle).css('width', 600);

			var animated = $('<div>').addClass('animated bounceIn gradual-theme').css(loginAnimatedStyle);
			var top = $('<div>').addClass('top').css(topStyle);
			$('<div>').addClass('title').html('\u7ba1\u7406\u5458\u767b\u5f55').css(titleStyle).appendTo(top);
			$('<div>').addClass('btn btn-close').html('<i class="fa fa-close"></i>').css(closeStyle).appendTo(top);

			var inputGroup = $('<div>').addClass('input-group').css(inputGroupStyle);
			var nameInput = $('<div>').addClass('row-item').css('margin-top', 10);
			var paswInput = $('<div>').addClass('row-item').css('margin-top', 10);
			$('<span>').addClass('name').html('\u5e10\u53f7').css(inputGroupNmaeStyle).appendTo(nameInput);
			$('<span>').addClass('name').html('\u5bc6\u7801').css(inputGroupNmaeStyle).appendTo(paswInput);

			$('<input>').addClass('value name-input theme-color').attr({
				type: 'text',
				placeholder: '\u8bf7\u8f93\u5165\u7ba1\u7406\u5458\u5e10\u53f7'
			}).css(inputGroupVauleStyle).appendTo(nameInput);

			$('<input>').addClass('value pasw-input theme-color').attr({
				type: 'password',
				placeholder: '\u8bf7\u8f93\u5165\u767b\u5f55\u5bc6\u7801'
			}).css(inputGroupVauleStyle).appendTo(paswInput);
			$(nameInput).appendTo(inputGroup);
			$(paswInput).appendTo(inputGroup);

			var numberWrap = $('<div>').css(numberWrapStyle);
			var ulItemWrap = $('<ul>').addClass('clearfix login-btns');
			for(var i = 1; i < 10; i++) {
				$('<li>').addClass('btn').data('val', i).html(i).appendTo(ulItemWrap);
			}
			$('<li>').addClass('btn').data('val', 'remove').html('\u5220\u9664').appendTo(ulItemWrap);
			$('<li>').addClass('btn').data('val', '0').html('0').appendTo(ulItemWrap);
			$('<li>').addClass('btn').data('val', 'login').html('\u767b\u5f55').appendTo(ulItemWrap);
			$(ulItemWrap).appendTo(numberWrap);

			$(top).appendTo(animated);
			$(inputGroup).appendTo(animated);
			$(numberWrap).appendTo(animated);

			$(animated).appendTo(content);
			$(content).appendTo(login);
			$('body > .container').append(login);

			// 关闭
			$(login).find('.btn-close, .mask').on('click', function() {
				$.TheKeySound();
				$(login).remove();
			});

			// 输入框
			var $input = $(login).find('.name-input');
			$input.focus();
			$(login).find('input').on('click', function() {
				$.TheKeySound();
				$input = $(this);
			});
			$(login).find('input').on('keyup', function(e) {
				if (e.keyCode == 13) {
		            Logined();
		        }
			});

			// 按键
			$(login).find('.login-btns .btn').on('click', function() {
				$.TheKeySound();
				var val = $(this).data('val');
        		var CurrentVal = $input.val();
				if (val == 'remove') {
		            $input.val(CurrentVal.substring(0, CurrentVal.length -1));
		        } else if (val == 'login') {
		            Logined();
		        } else {
		            $input.val(CurrentVal + val);
		        }
			});

			// 登录
			function Logined() {
				var Result = {
					ID: $(login).find('.name-input').val(),
					Pin: $(login).find('.pasw-input').val(),
				}
				if (typeof _callback)
					_callback(Result);
			}
		},

		/*
		 * 关闭弹窗
		 */
		layerClose: function() {
			$('.layer-pop-' + layerIndex).remove();
		}
	})
})(jQuery)
