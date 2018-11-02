/*
 * JQ扩展 屏幕滑动
 * @author Evan
 * @date 2018-01-27 00:53:23
 */
(function($) {
	$.fn.extend({
		// 模拟滑动
		SimulateScroll: function(param) {
			var _this = this;
			_this.target;
			if (param) {
				if (param.target)
					_this.target = param.target
			}
			var style = {
				position: 'absolute',
				width: '100%',
				top: 0,
				left: 0,
			}
			_this.target.css(style);
			// $(this).css('overflow', 'hidden');
			style.height = '100%';
			style.zIndex = 3;
			$('<div>').addClass('slider-panel').css(style).appendTo(this);
			_this.slider = $(this).find('.slider-panel');
            _this.target.maxhei = _this.target.outerHeight();
            _this.target.minhei = _this.slider.height();
            _this.target.maxtop = _this.target.minhei - _this.target.maxhei;

			// 开始触屏
            var IsTrue = false;
            _this.slider.on('mousedown', function(e) {
                IsTrue = true;
                e.preventDefault();
                _this.x = e.offsetX;
                _this.startPos = e.offsetY;
                _this.lastMove = 0;
                _this.target.top = _this.target[0].offsetTop;
                clearInterval(_this.targetTimer);
                MouseMove();
            });

            // 移动鼠标
            function MouseMove() {
            	$('body').unbind('mousemove');
                $('body').on('mousemove', function(e) {
                    if (!IsTrue)
                        return;
                    e.preventDefault();
                    _this.movePos = e.offsetY - _this.startPos;
                    _this.speed = _this.movePos - _this.lastMove;
                    _this.lastMove = _this.movePos;  
                    _this.target.css('top', _this.target.top + _this.movePos);
                });
            }

            $('body').unbind('mouseup');
            $('body').on('mouseup', function(e) {
                if (!IsTrue)
                    return;
                IsTrue = false;
                e.preventDefault();                  
                _this.endPos = e.offsetY - _this.startPos;
                if (_this.endPos < 10 && _this.endPos > -10) {
                    _this.speed = 0;
                }

                _this.target.swing = _this.speed;
                _this.target.endTop = _this.target[0].offsetTop;
                _this.target.speedUp = 0;

                IsStart = false;
                _this.targetTimer = setInterval(function() {
                    _this.target.speedUp += _this.target.swing;
                	_this.target.swing *= 0.96;
                    var mc = _this.target.endTop + _this.target.speedUp;
                    if (mc <= _this.target.maxtop) {
                    	mc = _this.target.maxtop;
                    } else if (mc >= 0) {
                    	mc = 0;
                    }
                    if (_this.target.minhei > _this.target.maxhei) {
                        mc = 0;
                    }
                    _this.target.css('top', mc);
                    if (Math.abs(_this.target.swing) < 1) {
                        clearInterval(_this.targetTimer);
                    }
                }, 30);
            });
		}
	})
})(jQuery)