/*
 * 2018-04-18 08:34:35
 * write by JQ
 * Evan
 */
(function($) {

	$.fn.extend({
		/*
		 * 手写识别
		 * @param isZzj 是否是自助机运行
         * @param input 目标输入框
         * @param bename 第二目标位置 非 input 
    	 * @param standby  备用按键
         * @param delback 删除按钮返回
         * @param blankback 确认按钮返回
         * @param writeback 手写返回
         * @param resetback 重置按钮返回
         * @param hanziback 汉字选择返回
         * @param standbyback 备用按钮返回
    	 * @param blankClickHide 确认按键按下是否隐藏键盘
    	 * @param standbyClickHide 备用按键按下是否隐藏键盘
		 */
		writediscern: function(param) {
			var self = this;
            self.param = param;
            self.config = {
                isZzj: true,
                input: '',
                standby: true,
                standbyName: '拼 音',
                blankClickHide: false,
                standbyClickHide: true,
            };

            // 如果传进参数则替换默认的配置参数
            if (self.param != undefined) {
                self.config.isZzj = getParamVal('isZzj');
                self.config.input = getParamVal('input');
                self.config.bename = getParamVal('bename');
                self.config.standby = getParamVal('standby');
                self.config.standbyName = getParamVal('standbyName');
                self.config.blankClickHide = getParamVal('blankClickHide');
                self.config.standbyClickHide = getParamVal('standbyClickHide');

                self.config.delback = getParamVal('delback');
                self.config.blankback = getParamVal('blankback');
                self.config.writeback = getParamVal('writeback');
                self.config.resetback = getParamVal('resetback');
                self.config.hanziback = getParamVal('hanziback');
                self.config.standbyback = getParamVal('standbyback');
            }

            // 呼出插件
            if ($('.write-discern').length) {
            	$('.write-discern').slideDown('fast');
            } else {
            	var WriteDiscern = $('<div>').addClass('write-discern');

            	var OutPut = $('<div>').addClass('output-character text-center clearfix');
        		$('<div>').addClass('pull-left character-prev-page btn-page').html('上一页').appendTo(OutPut);

        		var Charlist = $('<div>').addClass('line-block character-list');
        		$('<ul>').addClass('clearfix').appendTo(Charlist);
        		$(Charlist).appendTo(OutPut);

        		$('<div>').addClass('pull-right character-next-page btn-page').html('下一页').appendTo(OutPut);
        		$(OutPut).appendTo(WriteDiscern);

        		var WriteArea = $('<div>').addClass('write-area text-center clearfix m-t-s');
        		var Pullleft = $('<div>').addClass('pull-left col-7');
        		CanvasWrap = $('<div>').addClass('line-block write-wrap').appendTo(Pullleft);
        		$(Pullleft).appendTo(WriteArea);

        		var Pullright = $('<div>').addClass('pull-right col-5 btn-wrap');
        		if (self.config.standby)
        			$('<div>').addClass('btn btn-standby').html(self.config.standbyName).appendTo(Pullright);
        		$('<div>').addClass('btn btn-reset').html('重 写').appendTo(Pullright);
        		$('<div>').addClass('btn btn-del').html('删 除').appendTo(Pullright);
        		$(Pullright).appendTo(WriteArea);

        		$(WriteArea).appendTo(WriteDiscern);
        		$('<div>').addClass('write-blank text-center').html('确 认').appendTo(WriteDiscern);
        		$(self).append(WriteDiscern);
            }


            // 备用按键
            $('.write-discern .btn-standby').unbind('click');
            $('.write-discern .btn-standby').on('click', function() {
            	$.TheKeySound();     // 按键音效
                if (self.config.standbyClickHide)
                    $('.write-discern').slideUp('fast');
                if (typeof self.config.standbyback == 'function')
                    self.config.standbyback($(this));
            });

            // 重置
            $('.write-discern .btn-reset').unbind('click');
            $('.write-discern .btn-reset').on('click', function() {
            	$.TheKeySound();     // 按键音效
            	WriteReste();
            	if (typeof self.config.resetback == 'function')
                    self.config.resetback($(this));
            });

            // 删除
            $('.write-discern .btn-del').unbind('click');
            $('.write-discern .btn-del').on('click', function() {
            	$.TheKeySound();     // 按键音效
            	var vals = $(self.config.input).val();
    			var val = vals.substring(0, vals.length - 1);
        		$(self.config.input).val(val);
        		if (typeof self.config.delback == 'function')
        			self.config.delback(val, $(this));
            });

            // 确认
            $('.write-discern .write-blank').unbind('click');
            $('.write-discern .write-blank').on('click', function() {
            	$.TheKeySound();     // 按键音效
            	if (self.config.blankClickHide)
            		$('.write-discern').slideUp('fast');
        		if (typeof self.config.blankback == 'function')
        			self.config.blankback($(self.config.input).val(), $(this));
            });

            // 计算宽高
			var width = $('.write-discern .write-wrap')[0].clientWidth;
			var height = $('.write-discern .write-wrap')[0].clientHeight;
			$('.write-discern .write-wrap').empty();
			$('<canvas>').appendTo($('.write-discern .write-wrap'));
		    var canvas = $('.write-discern .write-wrap canvas')[0];

		    // 触屏时候的差距值
		    var tp = 463;
		    var lt = 262.5;
		    canvas.width = width;
		    canvas.height = height;

		    // 绑定事件
		    canvas.addEventListener('mousedown', onMouseDown, false);
		    canvas.addEventListener('touchstart', onMouseDown, false);


		    canvas.addEventListener('mousemove', onMouseMove, false);
		    canvas.addEventListener('touchmove', onMouseMove, false);


		    canvas.addEventListener('mouseup', onMouseEnd, false);
		    canvas.addEventListener('mouseleave', onMouseLeave, false);

		    canvas.addEventListener('touchend', onMouseEnd, false);

		    // 变量
		    var context = canvas.getContext('2d');
		    var StrokesArr = [];
		    var linex = [];
		    var liney = [];
		    var linen = [];

		    var lastX = -1;
		    var lastY = -1;
		    var flag = 0;

		    // 开始点击或触屏
		    function onMouseDown(evt) {
		        if (evt.targetTouches) {
		        	evt.preventDefault();
		            evt = evt.targetTouches[0];
		            linex.push(evt.pageX - lt);
		            liney.push(evt.pageY - tp);
		        } else {
		            linex.push(evt.layerX);
		            liney.push(evt.layerY);
		        }
		        flag = 1;
		        linen.push(0);
		    }

		    // 移动
		    function onMouseMove(evt) {
		        var x, y;
		        if (evt.targetTouches) {
		        	evt.preventDefault();
		            evt = evt.targetTouches[0];
		            x = evt.pageX - lt;
		            y = evt.pageY - tp;
		        } else {
		            x = evt.layerX;
		            y = evt.layerY;
		        }
		        // 画字
		        if (flag == 1) {                
		            linex.push(x);
		            liney.push(y);
		            linen.push(1);
		            context.save();
		            context.translate(context.canvas.clientWidth / 2, context.canvas.clientHeight / 2);
		            context.translate(-context.canvas.clientWidth / 2, -context.canvas.clientHeight / 2);
		            context.beginPath();
		            context.lineWidth = 2;

		            for (var i = 1; i < linex.length; i++) {
		                lastX = linex[i];
		                lastY = liney[i];
		                if (linen[i] == 0) {
		                    context.moveTo(lastX, lastY);
		                } else {
		                    context.lineTo(lastX, lastY);
		                }
		            }

		            context.strokeStyle = 'hsl(90, 100%, 0%)';
		            context.shadowColor = '#999';
		            context.shadowBlur = 1;
		            context.stroke();
		            context.restore();
		        }
		    }

		    // 结束
		    function onMouseEnd(evt) {
		        if (evt.changedTouches) {
		        	evt.preventDefault();
		            evt = evt.changedTouches[0];
		            linex.push(evt.pageX - lt);
		            liney.push(evt.pageY - tp);
		        } else {                
		            linex.push(evt.layerX);
		            liney.push(evt.layerY);
		        }

		        // 导出汉字
		        ExportChar();               
		    }

		    // 离开范围
		    function onMouseLeave() {
		    	// 导出汉字
		        ExportChar();
		    }

		    // 搜索词库导出汉字
		    function ExportChar() {
		    	if (flag == 1) {
		        	flag = 0;
			        linen.push(0);

			        StrokesArr = StrokesArr.splice(0, StrokesArr.length - 2);
			        $.each(linex, function(n, val) {
		        		StrokesArr.push(Math.ceil(linex[n] / 2));
			        	StrokesArr.push(Math.ceil(liney[n] / 2));
			        });
			        
			        linex =  [];
			      	liney = [];
			      	linen = [];

			        StrokesArr.push(0);
			        StrokesArr.push(255);
			        StrokesArr.push(255);
			        StrokesArr.push(255);
			        var data = JSON.stringify(StrokesArr);

			        if (self.config.isZzj) {
			        	ChineseInput.HandWritingReconize(data, function (code, data) {
					        var CharData = JSON.parse(data);
					        var data = [];
					        $.each(CharData, function(n, val) {
					        	var obj = {
					        		Key: n,
					        		Value: val
					        	}
					        	data.push(obj);
					        })
					        if (typeof self.config.writeback == 'function')
								self.config.writeback(data, WriteReste);
					        ShowCheckCharPages(data);
					    });
			        } else {			        	
				        // 模拟输出 识别汉字
						var CharData = ['我', '你', '姓', '名', '他', '们', '王', '煞', '侘', '的', '速', '就', '哦', '去'];
						if (typeof self.config.writeback == 'function')
							self.config.writeback(CharData, WriteReste);
				        ShowCheckCharPages(CharData); 
			        }			        
			        
		        }
		    }

		    // 重置
		    function WriteReste() {
		    	linex =  [];
		      	liney = [];
		      	linen = [];
		      	StrokesArr = [];
		      	context.clearRect(0, 0, canvas.width, canvas.height);
		    }

		    // 输出查询的汉字分页
        	function ShowCheckCharPages(_data) {
        		var pagenum = 1, pagesize = 8, total = _data.length, pages = $.GetPageNum(total, pagesize);
				$('.write-discern .output-character .btn-page').removeClass('yes');

				if (pages > 1) {
					// 输出页面信息
					var $prev = $('.write-discern .output-character .character-prev-page');
					var $next = $('.write-discern .output-character .character-next-page');
					$next.addClass('yes');

					// 上一页
					$prev.unbind('click');
					$prev.on('click', function() {
						var pm = pagenum;
						pagenum--;
						if (pagenum <= 1) {
							pagenum = 1;
							$(this).removeClass('yes');
						}
						if (pagenum < pages) {
							$next.addClass('yes');
						}

						if (pm != pagenum) {
							$.TheKeySound();     // 按键音效
							// 输出汉字列表
							ShowCheckCharList(pagenum, pagesize, _data);
						}				
					});

					// 下一页
					$next.unbind('click');
					$next.on('click', function() {
						var pm = pagenum;
						pagenum++;
						if (pagenum >= pages) {
							pagenum = pages;
							$(this).removeClass('yes');
						}
						if (pagenum > 1) {
							$prev.addClass('yes');
						}

						if (pm != pagenum) {
							$.TheKeySound();     // 按键音效
							// 输出汉字列表
							ShowCheckCharList(pagenum, pagesize, _data);
						}
					});
				}

				// 输出汉字列表
				ShowCheckCharList(pagenum, pagesize, _data);
        	}

        	// 输出汉字列表
        	function ShowCheckCharList(_num, _size, _data) {
				var start = (_num - 1) * _size;
				var end = start + _size;
				var data = _data.slice(start, end);

				// 输出当前页汉字
				var $list = $('.write-discern .character-list ul');
				$list.empty();
				$.each(data, function(n, val) {
                    var li = '';
                    if (self.config.isZzj) {
					   li = '<li>' + val.Value + '</li>';
                    } else {
					   li = '<li>' + val + '</li>';
                    }
					$list.append(li);
				});

				// 绑定事件
				$list.find('li').one('click', function() {
					$.TheKeySound();     // 按键音效
					var val = $(self.config.input).val();
					var text = $(this).text();
					$list.empty();
					$('.write-discern .output-character .btn-page').removeClass('yes');
					WriteReste();
					$(self.config.input).val(val + text);
	        		if (self.config.bename != undefined) {
	        			$(self.config.bename).html(val + text);
	        		}
	        		if (typeof self.config.hanziback == 'function') {
        				self.config.hanziback(text);
        			}
				});
			}


            // 获取对应参数
            function getParamVal(key) {
                return self.param[key] == undefined ? self.config[key] : self.param[key];
            }
		}
	})

})(jQuery)