

/*
 * JQ扩展 键盘打字
 * @author Evan
 * @date 2017-07-21 11:47:57
 */
(function($) {

    $.fn.extend({

    	/*
    	 * 综合键盘
         * @param isZzj 是否是自助机运行
         * @param shift "shift" 按键是否被按下
         * @param input 目标输入框
         * @param letter 当前拼接字母
    	 * @param standby  备用按键
         * @param delback 键盘按键删除返回
         * @param charlist 汉字输出列表元素
         * @param charback 键盘按键返回
         * @param letterCss 字母显示元素样式
         * @param blankback 键盘确认按钮返回
         * @param shiftback 拼音键盘大小写状态
         * @param hanziback 汉字选择返回
         * @param standbyback 备用按钮返回
         * @param standbyName 备用按钮名称
         * @param isCapitalBig 是否开启大写单选
         * @param blankClickHide 点击确认按钮是否隐藏键盘
    	 * @param standbyClickHide 备用按键按下是否隐藏键盘
    	 */
    	CompositeKeyboard: function(param) {
    		var self = this;
            self.param = param;
            self.config = {
                isZzj: true,
            	shift: false,
                input: '',
                letter: '',
                standby: false,
            	charlist: '.character-list > ul',
                letterCss: {},
                standbyName: '备用',
                isCapitalBig: false,
                blankClickHide: false,
                standbyClickHide: true,
            	keyBoardList: [ // 搜索键盘按钮
					// ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
					['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
					['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
					['z', 'x', 'c', 'v', 'b', 'n', 'm']
				],
            };

            // 改变第一个字母大写
            String.prototype.firstUpperCase = function(){
			    return this.replace(/^\S/,function(s){return s.toUpperCase();});
			}

            // 如果传进参数则替换默认的配置参数
            if (self.param != undefined) {
                self.config.isZzj = getParamVal('isZzj');
                self.config.input = getParamVal('input');
                self.config.shift = getParamVal('shift');
                self.config.standby = getParamVal('standby');
                self.config.standbyName = getParamVal('standbyName');
                self.config.isCapitalBig = getParamVal('isCapitalBig');
                self.config.blankClickHide = getParamVal('blankClickHide');
                self.config.standbyClickHide = getParamVal('standbyClickHide');

                self.config.delback = getParamVal('delback');
                self.config.charback = getParamVal('charback');
                self.config.blankback = getParamVal('blankback');
                self.config.shiftback = getParamVal('shiftback');
                self.config.letterCss = getParamVal('letterCss');
                self.config.hanziback = getParamVal('hanziback');
                self.config.standbyback = getParamVal('standbyback');
            }

            if ($('.composite-keyboard').length) {
            	$('.composite-keyboard').slideDown('fast');
            } else {
        		var CompositeKeyBoard = $('<div>').addClass('composite-keyboard');
        		$('<div>').addClass('character-letter transparency-bg-color theme-color').css(self.config.letterCss).appendTo(CompositeKeyBoard);

        		var OutPut = $('<div>').addClass('output-character text-center clearfix');
        		$('<div>').addClass('pull-left character-prev-page btn-page').html('上一页').appendTo(OutPut);
        		$('<div>').addClass('line-block character-list').html('<ul class="clearfix"></ul>').appendTo(OutPut);
        		$('<div>').addClass('pull-right character-next-page btn-page').html('下一页').appendTo(OutPut);
        		$(OutPut).appendTo(CompositeKeyBoard);
        		
        		$.each(self.config.keyBoardList, function(n, val) {
        			var KeyBoardLine = $('<div>').addClass('keyboard-line');
	        		var linebox = $('<div>').addClass('line-block');
	        		var lineWrap = $('<ul>').addClass('clearfix');
        			if (val.length == 7) {
                        if (!param.standby)
                            $('<li>').attr('shift', '').html('大小写').appendTo(lineWrap);
                        else 
        				    $('<li>').attr('standby', '').html(self.config.standbyName).appendTo(lineWrap);
                    }
        			$.each(val, function(_n, _val) {        				
        				$('<li>').html(_val).appendTo(lineWrap);
        			});
        			if (val.length == 7) 
        				$('<li>').attr('remove', '').html('删除').appendTo(lineWrap);
        			$(lineWrap).appendTo(linebox);
        			$(linebox).appendTo(KeyBoardLine);
        			$(KeyBoardLine).appendTo(CompositeKeyBoard);
        		});

        		$('<div>').addClass('keyboard-blank text-center').html('确 认').appendTo(CompositeKeyBoard);
        		$(self).append(CompositeKeyBoard);
            }
        	if (self.config.shift) {
        		$('.composite-keyboard .keyboard-line li[shift]').addClass('active');
        		$('.composite-keyboard .character-letter').hide();
        		TransformCapital();
        	} else {
        		$('.composite-keyboard .character-letter').show();
        	}

        	// 大小写
        	$('.composite-keyboard .keyboard-line li[shift]').unbind('click');
        	$('.composite-keyboard .keyboard-line li[shift]').on('click', function() {
        		if (self.config.isCapitalBig) 
        			return;
        		$.TheKeySound();     // 按键音效
        		$(this).toggleClass('active');
        		if ($(this).hasClass('active')) {
        			self.config.shift = true;
        			TransformCapital();
        			self.config.letter = '';
        			$('.composite-keyboard .character-letter').hide();
	        		$('.composite-keyboard .character-letter').empty();
        		} else {
        			$('.composite-keyboard .character-letter').show();
        			self.config.shift = false;
        			TransformCapital(1);
        		}
        		if (typeof self.config.shiftback == 'function')
        			self.config.shiftback(self.config.shift);
        	});

            // 备用按键
            $('.composite-keyboard .keyboard-line li[standby]').unbind('click');
            $('.composite-keyboard .keyboard-line li[standby]').on('click', function() {
                $.TheKeySound();     // 按键音效
                if (self.config.standbyClickHide)
                    $('.composite-keyboard').slideUp('fast');
                if (typeof self.config.standbyback == 'function')
                    self.config.standbyback($(this));
            });

        	// 删除
        	$('.composite-keyboard .keyboard-line li[remove]').unbind('click');
        	$('.composite-keyboard .keyboard-line li[remove]').on('click', function() {
        		$.TheKeySound();     // 按键音效
        		var val = '';
        		if (self.config.shift) {
        			var vals = $(self.config.input).val();
        			val = vals.substring(0, vals.length - 1);
	        		$(self.config.input).val(val);
        		} else {
        			var chars = self.config.letter.firstUpperCase();
        			var val_ = chars.substring(0, chars.length - 1);
        			self.config.letter = val_;
	        		$('.composite-keyboard .character-letter').html(val_);

                    if (chars.length <= 0) {
                        var vals = $(self.config.input).val();
                        val = vals.substring(0, vals.length - 1);
                        $(self.config.input).val(val);
                    }

                    var charArr = [];
                    if (self.config.isZzj) {                        
					   charArr = JSON.parse(ChineseInput.PinyinTrance(val));
                    } else {                        
                        var checkStr = PinYin[val];  // 本地数据
                        if (checkStr != undefined) {
                            charArr = checkStr.split('');
                        }
                    }
					ShowCheckCharPages(charArr);
        		}
        		if (typeof self.config.delback == 'function')
        			self.config.delback(val);
        	});

        	// 按键
        	$('.composite-keyboard .keyboard-line li:not(li[shift],li[standby],li[remove])').unbind('click');
        	$('.composite-keyboard .keyboard-line li:not(li[shift],li[standby],li[remove])').on('click', function() {
        		$.TheKeySound();     // 按键音效
	        	var char = $(this).text();
	        	if (self.config.shift) {
	        		var val = $(self.config.input).val();
	        		$(self.config.input).val(val + char);
	        	} else {
	        		self.config.letter += char;
	        		var chars = self.config.letter.firstUpperCase();
	        		$('.composite-keyboard .character-letter').html(chars);
	        		
	        		var charArr = [];
                    if (self.config.isZzj) {                        
                       charArr = JSON.parse(ChineseInput.PinyinTrance(chars));
                    } else {                        
                        var checkStr = PinYin[chars];  // 本地数据
                        if (checkStr != undefined) {
                            charArr = checkStr.split('');
                        }
                    }
					ShowCheckCharPages(charArr);
	        	}
	        	if (typeof self.config.charback == 'function')
        			self.config.charback(char);
        	});

        	// 确认
        	$('.composite-keyboard .keyboard-blank').unbind('click');
        	$('.composite-keyboard .keyboard-blank').on('click', function() {
        		$.TheKeySound();       // 按键音效
                if (self.config.blankClickHide)
        		  $('.composite-keyboard').slideUp('fast');
        		if (typeof self.config.blankback == 'function')
        			self.config.blankback($(self.config.input).val(), $(this));
        	});

        	// 转换大小写
        	function TransformCapital(_type) {
        		$('.composite-keyboard .keyboard-line li').each(function(n) {
    				var val = $(this).text();
    				if (_type == 1) {
    					$(this).html(val.toLowerCase());
    				} else {
    					$(this).html(val.toUpperCase());
    				}
    			});
        	}

        	// 输出查询的汉字分页
        	function ShowCheckCharPages(_data) {
        		var pagenum = 1, pagesize = 8, total = _data.length, pages = $.GetPageNum(total, pagesize);
				$('.composite-keyboard .output-character .btn-page').removeClass('yes');

				if (pages > 1) {
					// 输出页面信息
					var $prev = $('.composite-keyboard .output-character .character-prev-page');
					var $next = $('.composite-keyboard .output-character .character-next-page');
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
				var $list = $('.composite-keyboard .character-list > ul');
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
					var char = $(this).text();
					var val = $(self.config.input).val();
	        		$(self.config.input).val(val + char);
	        		self.config.letter = '';
	        		$('.composite-keyboard .output-character .btn-page').removeClass('yes');
	        		$('.composite-keyboard .character-letter').empty();
	        		$list.empty();
	        		if (typeof self.config.hanziback == 'function')
	        			self.config.hanziback(char);
				});
			}

            // 获取对应参数
            function getParamVal(key) {
                return self.param[key] == undefined ? self.config[key] : self.param[key];
            }
    	},

        /*
         * 拼音打字
         * @param top 定位值
         * @param left 定位值
         * @param type 类型 0 - 拼音 1- 输出字母
         * @param isZzj 是否是自助机运行
         * @param zindex 层级值
         * @param bename 第二目标元素 - 输出字符
         * @param delback 删除返回
         * @param charback 字符返回
         * @param callback 类型为1时 按键返回
         * @param numberback 数字返回
         * @param hanziback 汉字返回
         * @param closeback 关闭返回
         */
        spellKeyboard: function(param) {
        	var self = this;
            self.param = param;
            self.config = {
                top: 500,
                left: 207,
                type: 0,
                isZzj: true,
                zindex: 99,
                charlist: [
                	['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '1', '2', '3'],
                	['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '4', '5', '6'],
                	['Z', 'X', 'C', 'V', 'B', 'N', 'M', '0', '7', '8', '9'],
                ]
            };

             // 如果传进参数则替换默认的配置参数
            if (self.param != undefined) {
                self.config.top = getParamVal('top');
                self.config.left = getParamVal('left');
                self.config.type = getParamVal('type');
                self.config.isZzj = getParamVal('isZzj');
                self.config.zindex = getParamVal('zindex');
                self.config.bename = getParamVal('bename');
                self.config.delback = getParamVal('delback');
                self.config.charback = getParamVal('charback');
                self.config.callback = getParamVal('callback');
                self.config.hanziback = getParamVal('hanziback');
                self.config.closeback = getParamVal('closeback');
                self.config.numberback = getParamVal('numberback');
            }

        	$('.spell-container').remove();
        	var SpellContaier = $('<div>').addClass('spell-container').css({
        		top: self.config.top,
        		left: self.config.left,
        		zIndex: self.config.zindex
        	});

        	var MoveBox = $('<div>').addClass('move-box');
        	$('<div>').addClass('letter-box pull-left').appendTo(MoveBox);
        	$('<spna>').html('拖动此处可移动').appendTo(MoveBox);
        	$('<span>').addClass('close').html('关闭').appendTo(MoveBox);
        	$(MoveBox).appendTo(SpellContaier);

        	var KeyBoardBox = $('<div>').addClass('keyboard-box');
        	var CharBox = $('<div>').addClass('char-box');
        	var ShadeBox = $('<div>').addClass('shade clearfix');
        	$('<ul>').addClass('clearfix pull-left').appendTo(ShadeBox);

        	var BtnWrap = $('<div>').addClass('btn-box pull-right');
        	$('<div>').addClass('btn btn-prev yes').html('<i class="fa fa-caret-left"></i>').appendTo(BtnWrap);
        	$('<div>').addClass('btn btn-next').html('<i class="fa fa-caret-right"></i>').appendTo(BtnWrap);

        	$(BtnWrap).appendTo(ShadeBox);
        	$(ShadeBox).appendTo(CharBox);
        	$(CharBox).appendTo(KeyBoardBox);

        	var KeysBox = $('<div>').addClass('keys-box');
        	var s = self.config.charlist.length - 1;
        	$.each(self.config.charlist, function(n, val) {
        		var Keyline = $('<div>').addClass('keys-line');
        		var KeyWrap = $('<ul>').addClass('clearfix');
        		if (n == s) {
        			$('<li>').html('<i class="fa fa-times"></i>').attr('remove', '').appendTo(KeyWrap);
        		}
        		$.each(val, function(_n, _val) {
        			if (_val == 1) {
        				$('<li>').html(_val).attr('one', '').appendTo(KeyWrap);
        			} else if (_val == 4) {
        				$('<li>').html(_val).attr('two', '').appendTo(KeyWrap);
        			} else if (_val == 0) {
        				$('<li>').html(_val).attr('three', '').appendTo(KeyWrap);
        			} else {
        				$('<li>').html(_val).appendTo(KeyWrap);
        			}
        		});
        		$(KeyWrap).appendTo(Keyline);
        		$(Keyline).appendTo(KeysBox);
        	});
        	$(KeysBox).appendTo(KeyBoardBox);

        	$(KeyBoardBox).appendTo(SpellContaier);
        	$('body > .container').append(SpellContaier);

        	if (self.config.type == 1) {
        		$('.spell-container .char-box').hide();
        	}

        	// 关闭
        	$('.spell-container .move-box .close').on('click', function(e) {
        		$('.spell-container').slideUp('fast', function() {
	    			$(this).remove();
	    		});
	    		if (typeof self.config.closeback == 'function') {
    				self.config.closeback();
    			}
        	});

        	var ys, xy, isMove = false;
        	// 点击
        	$('.spell-container .move-box').on('mousedown touchstart', function(e) {
        		self.config.top = $('.spell-container').position().top;
        		self.config.left = $('.spell-container').position().left;
        		if (e.targetTouches) {
		        	e.preventDefault();
		            e = e.targetTouches[0];
		            ys = e.pageY;
		            xs = e.pageX;
		        } else {         
		        	ys = e.clientY;
		            xs = e.clientX; 
		        }
		        isMove = true;
        	});

        	// 移动
        	$('body').on('mousemove touchmove', function(e) {
        		if (isMove) {
        			var x, y;
			        if (e.targetTouches) {
			        	e.preventDefault();
			            e = e.targetTouches[0];
			            x = e.pageX - xs;
			            y = e.pageY - ys;
			        } else {        
			            x = e.clientX - xs;
			            y = e.clientY - ys;
			        }
			        $('.spell-container').css({top: y + self.config.top, left: x + self.config.left});
        		}
        	});

        	// 结束
        	$('body').on('mouseup touchend', function(e) {
        		isMove = false;
        	});

        	// 按键
        	var $letter = $('.spell-container .letter-box');
        	$('.spell-container .keys-box li:not(li[remove])').on('click', function() {
        		$.TheKeySound();     // 按键音效
	        	var char = $(this).text();
        		if (self.config.type == 1) {
	        		var val = $(self).val();
	        		$(self).val(val + char);
	        		if (self.config.bename != undefined) {
	        			$(self.config.bename).html(val + char);
	        		}
	        		if (typeof self.config.callback == 'function')
	        			self.config.callback(char);
	        	} else {
	        		var val = $letter.text();
	        		if (char >= 0) {
	        			var $char = $('.spell-container .shade > ul li:eq(' + char + ')');
	        			var val = $(self).val();
						var text = $char.text();
						$letter.empty();
						$('.spell-container .shade').hide();
						$(self).val(val + text);
		        		if (self.config.bename != undefined) {
		        			$(self.config.bename).html(val + text);
		        		}
		        		if (typeof self.config.hanziback == 'function') {
	        				self.config.hanziback(text);
	        			}
	        			if (typeof self.config.numberback == 'function')
	        				self.config.numberback(char);
	        		} else {	        			
		        		var spells = char.toLowerCase();
						val += spells;	
						if (val.length > 10) {
							val = val.substring(0, 10);
						}
						val = val.firstUpperCase();
		        		$letter.html(val);

                        var charArr = [];
                        if (self.config.isZzj) {
						  charArr = JSON.parse(ChineseInput.PinyinTrance(val));
                        } else {                            
                            var checkStr = PinYin[val];
                            if (checkStr != undefined) {
                                charArr = checkStr.split('');
                            }
                        }
						if (typeof self.config.charback == 'function') {
		    				self.config.charback(charArr);
	        			}
	        			ShowCheckCharPages('.spell-container', charArr);
	    			}
	        	}
        	});

        	// 删除
        	$('.spell-container .keys-box li[remove]').on('click', function() {
        		$.TheKeySound();     // 按键音效
	        	if (self.config.type == 1) {
	        		var val = $(self).val();
	        		var text = val.substring(0, val.length - 1);
	        		$(self).val(text);
	        		if (self.config.bename != undefined) {
	        			$(self.config.bename).html(text);	
	        		}
	        		if (typeof self.config.delback == 'function') {
	    				self.config.delback(text);
	    			}
	        	} else {
	        		var val = $letter.text();
	        		val = val.substring(0, val.length - 1);
	        		$letter.html(val);

                    var charArr = [];
                    if (self.config.isZzj) {
                        charArr = JSON.parse(ChineseInput.PinyinTrance(val));
                    } else {                        
                        var checkStr = PinYin[val];
                        if (checkStr != undefined) {
                            charArr = checkStr.split('')
                        }
                    }
	        		if (typeof self.config.delback == 'function') {
	    				self.config.delback(charArr);
	    			}
	        		ShowCheckCharPages('.spell-container', charArr);
	        	}
        	});

        	// 输出查询的汉字分页
        	function ShowCheckCharPages(ele, _data) {
        		var pagenum = 1, pagesize = 10, total = _data.length, pages = $.GetPageNum(total, pagesize);
				$(ele + ' .btn-box .btn').removeClass('yes');

				if (pages > 1) {
					// 输出页面信息
					var $prev = $(ele + ' .btn-box .btn-prev');
					var $next = $(ele + ' .btn-box .btn-next');
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
							ShowCheckCharList(ele, pagenum, pagesize, _data);
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
							ShowCheckCharList(ele, pagenum, pagesize, _data);
						}
					});
				}

				// 输出汉字列表
				ShowCheckCharList(ele, pagenum, pagesize, _data);
        	}

        	// 输出汉字列表
        	function ShowCheckCharList(ele, _num, _size, _data) {
				var start = (_num - 1) * _size;
				var end = start + _size;
				var data = _data.slice(start, end);

				// 输出当前页汉字
				var uel = ele + ' .shade > ul';
				$(uel).empty();
				$.each(data, function(n, val) {
                    var li = '';
                    if (self.config.isZzj) {
					   li = '<li>' + val.Value + '</li>';
                    } else {
					   li = '<li>' + val + '</li>';
                    }
					$(uel).append(li);
				});

				// 汉字大于 0
				if (_data.length > 0) {
					$(ele + ' .shade').show();
				}

				// 绑定事件
				$(uel + ' li').one('click', function() {
					$.TheKeySound();     // 按键音效
					var val = $(self).val();
					var text = $(this).text();
					$letter.empty();
					$(ele + ' .shade').hide();
					$(self).val(val + text);
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

            // 改变第一个字母大写
            String.prototype.firstUpperCase=function(){
			    return this.replace(/^\S/,function(s){return s.toUpperCase();});
			}
        }
    })
})(jQuery);