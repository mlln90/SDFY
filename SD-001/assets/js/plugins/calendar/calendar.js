/*
 * JQ扩展 选择日期
 * @author Evan
 * @date 2018-01-27 00:53:23
 */
(function($) {

    $.fn.extend({

        // 选择日期
        ChooseData: function(param) {
            var DATE = new Date();
            var YEAR = DATE.getFullYear();
            var MONTH = (DATE.getMonth()+1) < 10 ? '0' + (DATE.getMonth()+1) : (DATE.getMonth()+1);
            var DAY = DATE.getDate() < 10 ? '0' + DATE.getDate() : DATE.getDate();
            var self = this;
            self.param = param;
            self.yearago = 50;         // 向前多少年
            if (param != undefined)
                self.yearago = param.yearago != undefined ? Number(param.yearago) : 50;
            self.config = {
                target: '',            // 嵌入目标
                sign: '-',             // 分割符号
                type: 3,               // 选项 1-> 单个(日), 2-> 两个(月,日), 3-> 三个(年,月,日)  
                defaultYear: YEAR,     // 默认选中 年
                defaultMonth: MONTH,   // 默认选中 月
                defaultDay: DAY,       // 默认选中 天
                year: getYearList(),   // 年数组 (默认)
                callback: null,        // 选择回调
            };

            var Datelist = $(self).val().split(self.config.sign);
            if (Datelist.length >= 3) {
                if (Datelist[0].length == 4)
                    self.config.defaultYear = Number(Datelist[0]);
                if (Datelist[1].length == 2)
                    self.config.defaultMonth = Number(Datelist[1]);
                if (Datelist[2].length == 2)
                    self.config.defaultDay = Number(Datelist[2]);
            } else if (Datelist.length == 2) {
                if (Datelist[0].length == 2)
                    self.config.defaultMonth = Number(Datelist[0]);
                if (Datelist[1].length == 2)
                    self.config.defaultDay = Number(Datelist[1]);
            } else if (Datelist.length == 1) {
                if (Datelist[0].length == 2)
                    self.config.defaultDay = Number(Datelist[0]);
            }

            // 如果传进参数则替换默认的配置参数
            if (self.param != undefined) {
                self.config.target = getParamVal('target');
                self.config.sign = getParamVal('sign');
                self.config.type = getParamVal('type');
                self.config.defaultYear = getParamVal('defaultYear');
                self.config.defaultMonth = getParamVal('defaultMonth');
                self.config.defaultDay = getParamVal('defaultDay');
                self.config.year = getParamVal('year');
                self.config.month = getParamVal('month');
                self.config.day = getParamVal('day');
                self.config.callback = getParamVal('callback');
            }

            self.config.month = getMonthList(); // 月数组 (默认)
            self.config.day = getDayList();     // 日数组 (默认)

            // 呼出插件
            !function showPop() {
                var poppanel = $('<div>').addClass('calendar');

                // 线条
                var popline = $('<div>').addClass('calendar-shade');
                $('<div>').addClass('calendar-shade-line').appendTo(popline);
                $('<div>').addClass('calendar-shade-line').appendTo(popline);
                $(popline).appendTo(poppanel);

                // 控制板
                var popmain = $('<div>').addClass('calendar-control').appendTo(poppanel);

                // 内容主体
                var popbody = $('<div>').addClass('calendar-main row-item');

                getBodyList(popbody, self.config.type);

                $(popbody).appendTo(poppanel);
                $(self.config.target).html(poppanel);

                defaultTransition(self.config.type);

                self.main = self.config.target.find(popmain);
                self.width = $('.calendar-shade-line').width();
                self.tempHei = $('.calendar-shade-line').outerHeight();

                if (self.config.type <= 3) {
                    self.temp = self.width / self.config.type;
                }

                // 绑定滑动事件
                addTouchEvent(self.config.type);

                // 输出日期
                ShowDate();
            }()

            // 默认过渡动画
            function defaultTransition(_type) {
                var an1 = getIndex(self.config.year, self.config.defaultYear);
                var an2 = getIndex(self.config.month, self.config.defaultMonth, 2);
                var an3 = getIndex(self.config.day, self.config.defaultDay, 1);
                var anpx1 = (an1 - 2) * 70;
                var anpx2 = (an2 - 2) * 70;
                var anpx3 = (an3 - 2) * 70;
                switch (_type) {
                    case 1:
                        animate('.calendar-main .calendar-panple:eq(0) ul', anpx3, an3);
                        break;

                    case 2:
                        animate('.calendar-main .calendar-panple:eq(0) ul', anpx2, an2);
                        animate('.calendar-main .calendar-panple:eq(1) ul', anpx3, an3);
                        break;

                    case 3:
                        animate('.calendar-main .calendar-panple:eq(0) ul', anpx1, an1);
                        animate('.calendar-main .calendar-panple:eq(1) ul', anpx2, an2);
                        animate('.calendar-main .calendar-panple:eq(2) ul', anpx3, an3);
                        break;
                }
                    
            }

            // 动画
            function animate(ele, _px, _index) {
                self.config.target.find(ele).find('li').removeClass('active');
                if (ele.timer) {
                    clearTimeout(ele.timer);
                }
                var s = 0;
                var ts = 500 / 20;
                var l = 0;
                var ws = _px / 20;
                (function add() {
                    s++;
                    if (s > 20) {
                        self.config.target.find(ele).find('li:eq(' + _index + ')')
                            .addClass('active');
                        return s = 0;
                    }
                    l += ws;
                    self.config.target.find(ele).css('top', -l);
                    ele.timer = setTimeout(add, ts);
                }())
            }

            // 绑定滑动事件
            function addTouchEvent(_type) {
                // 触点
                touchStart(_type);

                // 滑动
                // touchMove(_type);

                // 离开
                touchEnd(_type);
            }

            // 开始触屏
            var IsTrue = false;
            var IsStart = true;
            function touchStart(_type) {
                self.main.on('mousedown', function(e) {
                    if (!IsStart)
                        return;
                    IsTrue = true;
                    e.preventDefault();
                    self.x = e.offsetX;
                    self.startPos = e.offsetY;
                    self.lastMove = 0;
                    switch (_type) {
                        case 1:
                            self.day = self.config.target.find('.calendar-main .calendar-panple:eq(0) ul');
                            self.day.top = self.day[0].offsetTop;
                            clearInterval(self.dayTimer);
                            self.day.find('li').removeClass('active');
                            break;

                        case 2:
                            self.month = self.config.target.find('.calendar-main .calendar-panple:eq(0) ul');
                            self.day = self.config.target.find('.calendar-main .calendar-panple:eq(1) ul');
                            if (self.x < self.temp) {

                                self.month.top = self.month[0].offsetTop;
                                clearInterval(self.monthTimer);
                                self.month.find('li').removeClass('active');

                            } else {

                                self.day.top = self.day[0].offsetTop;
                                clearInterval(self.dayTimer);
                                self.day.find('li').removeClass('active');

                            }
                            break;

                        case 3:
                            self.year = self.config.target.find('.calendar-main .calendar-panple:eq(0) ul');
                            self.month = self.config.target.find('.calendar-main .calendar-panple:eq(1) ul');
                            self.day = self.config.target.find('.calendar-main .calendar-panple:eq(2) ul');

                            if (self.x < self.temp) {

                                self.year.top = self.year[0].offsetTop;
                                clearInterval(self.yearTimer);
                                self.year.stop(true, true);
                                self.year.find('li').removeClass('active');

                            } else if (self.x > self.temp && self.x < (self.temp * 2)) {

                                self.month.top = self.month[0].offsetTop;
                                clearInterval(self.monthTimer);
                                self.month.stop(true, true);
                                self.month.find('li').removeClass('active');

                            } else {

                                self.day.top = self.day[0].offsetTop;
                                clearInterval(self.dayTimer);
                                self.day.find('li').removeClass('active');

                            }
                    }
                    touchMove(_type);
                    if (typeof self.config.callback == 'function')
                        self.config.callback();
                });
            }

            // 移动中
            function touchMove(_type) {
                $('body').unbind('mousemove');
                $('body').on('mousemove', function(e) {
                    if (!IsTrue)
                        return;
                    if (!IsStart)
                        return;
                    e.preventDefault();
                    self.movePos = e.offsetY - self.startPos;
                    self.speed = self.movePos - self.lastMove;
                    self.lastMove = self.movePos;  
                    switch (_type) {
                        case 1:
                            self.day.css('top', self.day.top + self.movePos);
                            break;

                        case 2:
                            if (self.x < self.temp) {
                                self.month.css('top', self.month.top + self.movePos);
                            } else {
                                self.day.css('top', self.day.top + self.movePos);
                            }
                            break;

                        case 3:
                            if (self.x < self.temp) {
                                self.year.css('top', self.year.top + self.movePos);
                            } else if (self.x > self.temp && self.x < (self.temp * 2)) {
                                self.month.css('top', self.month.top + self.movePos);
                            } else {
                                self.day.css('top', self.day.top + self.movePos);
                            }
                            break;
                    }   
                });
            }

            // 触屏离开
            function touchEnd(_type) {
                $('body').on('mouseup', function(e) {
                    if (!IsTrue)
                        return;
                    IsTrue = false;
                    e.preventDefault();                  
                    self.endPos = e.offsetY - self.startPos;
                    if (self.endPos < 10 && self.endPos > -10) {
                        self.speed = 0;
                    }
                    switch (_type) {
                        case 1:
                            moveDay();
                            break;

                        case 2:
                            if (self.x < self.temp) {
                                moveMonth();
                            } else {
                                moveDay();
                            }
                            break;

                        case 3:
                            if (self.x < self.temp) {
                                moveYear();                                
                            } else if (self.x > self.temp && self.x < (self.temp * 2)) {
                                moveMonth();
                            } else {
                                moveDay();
                            }
                            break;
                    }   
                });
            }

            // 移动年份
            function moveYear() {
                self.year.swing = self.speed;
                self.year.endTop = self.year[0].offsetTop;
                self.year.speedUp = 0;
                IsStart = false;

                self.yearTimer = setInterval(function() {
                    var len = self.config.year.length - 2;
                    changeMoveParam(self.year, len);

                    var mc = self.year.endTop + self.year.speedUp;
                    self.year.css('top', mc);

                    if (Math.abs(self.year.swing) < 1) {
                        clearInterval(self.yearTimer);
                        var len = self.config.year.length -1;
                        changeInterParam(self.year, len);

                        self.config.defaultYear = self.minYear + self.year.sl;
                        showMonths(self.month, true);
                        showDays(self.day, true);
                        self.year.animate({top: (2 - self.year.sl) * self.tempHei}, 200, function() {
                            IsStart = true;
                            $(this).find('li:eq(' + self.year.sl + ')').addClass('active');
                            ShowDate();
                        });
                    }
                   
                }, 30);
            }

            // 移动月份
            function moveMonth() {
                self.month.swing = self.speed;
                self.month.endTop = self.month[0].offsetTop;
                self.month.speedUp = 0;

                IsStart = false;
                self.monthTimer = setInterval(function() {
                    var len = self.config.month.length - 2;
                    changeMoveParam(self.month, len);

                    var mc = self.month.endTop + self.month.speedUp;
                    self.month.css('top', mc);

                    if (Math.abs(self.month.swing) < 1) {
                        clearInterval(self.monthTimer);
                        var len = self.config.month.length -1;
                        changeInterParam(self.month, len);

                        self.config.defaultMonth = Number(self.minMonth) + self.month.sl;
                        self.month.animate({top: (2 - self.month.sl) * self.tempHei}, 200, function() {
                            IsStart = true;
                            $(this).find('li:eq(' + self.month.sl + ')').addClass('active');
                            ShowDate();
                        });
                        showDays(self.day, true);
                    }
                   
                }, 30);
            }

            // 移动天数
            function moveDay() {
                self.day.swing = self.speed;
                self.day.endTop = self.day[0].offsetTop;
                self.day.speedUp = 0;

                IsStart = false;
                self.dayTimer = setInterval(function() {
                    var len = self.config.day.length - 2;
                    changeMoveParam(self.day, len);

                    var mc = self.day.endTop + self.day.speedUp;
                    self.day.css('top', mc);
                    if (Math.abs(self.day.swing) < 1) {
                        clearInterval(self.dayTimer);
                        var len = self.config.day.length -1;
                        changeInterParam(self.day, len);

                        self.config.defaultDay = Number(self.minDay) + self.day.sl;
                        self.day.animate({top: (2 - self.day.sl) * self.tempHei}, 200, function() {
                            IsStart = true;
                            $(this).find('li:eq(' + self.day.sl + ')').addClass('active');
                            ShowDate();
                        });
                    }
                }, 30);
            }

            // 输出日期
            function ShowDate() {
                var year =  Number(self.config.defaultYear);
                var month = Number(self.config.defaultMonth);
                var day = Number(self.config.defaultDay);
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;
                var type = self.config.type;
                var sign = self.config.sign;
                var dateStr;
                if (type == 1) {
                    dateStr = day;
                } else if (type == 2) {
                    dateStr = month + sign + day;
                } else if (type == 3) {
                    dateStr = year + sign + month + sign + day;
                }
                self.val(dateStr);
            }

            // 改变移动参数
            function changeMoveParam(_param, _len) {
                _param.speedUp += _param.swing;
                _param.swing *= 0.8;
                _param.allTop = _param.endTop + _param.speedUp;
                _param.allLen = _len;
                if (_param.allTop >= self.tempHei * 2) {
                    _param.speedUp = self.tempHei * 2 - _param.endTop;
                    _param.swing = 0;
                } else if (_param.allTop <= -(_param.allLen * self.tempHei)) {
                    _param.speedUp = -(_param.allLen * self.tempHei) - _param.endTop;
                    _param.swing = 0;
                }
            }

            // 改变结束定时参数
            function changeInterParam(_param, _len) {
                _param.sl = parseInt(-_param.allTop / self.tempHei) + 2;
                _param.surpus = -_param.allTop % self.tempHei;
                if (_param.surpus > self.tempHei / 2) {
                    _param.sl += 1;
                }
                if (_param.sl >= _len) {
                    _param.sl = _len;
                } else if (_param.sl <= 0) {
                    _param.sl = 0;
                }
            }

            // 获取对应参数
            function getParamVal(key) {
                return self.param[key] == undefined ? self.config[key] : self.param[key];
            }

            // 获取指定数组元素下标
            function getIndex(_data, _val, _type) {
                var index;
                $.each(_data, function(n, val) {
                    if (_val == val) {
                        index = n;
                        return false;
                    }
                });
                if (index == undefined) {
                    index = _data.length - 1;
                    if (_type == 1) {
                        self.config.defaultDay = _data[index];                        
                    } else if (_type == 2) {
                        self.config.defaultMonth = _data[index];                         
                    } else {
                        self.config.defaultYear = _data[index];                                                 
                    }
                }
                return index;
            }

            // 获取选择项
            function getBodyList(ele, _type) {
                $(ele).empty();
                var num = Number(_type);
                var cls = 'col-'
                if (num == 1) cls += 12;
                if (num == 2) cls += 6;
                if (num == 3) cls += 4;
                for (var i = 0; i < num; i++) {
                    $('<div>').addClass('calendar-panple ' + cls)
                        .html('<ul></ul>').appendTo(ele);
                }
                if (num == 1) {
                    showDays($(ele).find('.calendar-panple:eq(0) ul')[0]);
                } else if (num == 2) {
                    $.each(self.config.month, function(n, val) {
                        var text = '<li>' + val + '月</li>';
                        $(ele).find('.calendar-panple:eq(0) ul').append(text);
                    });
                    showDays($(ele).find('.calendar-panple:eq(1) ul')[0]);
                } else if (num == 3) {
                    $.each(self.config.year, function(n, val) {
                        var text = '<li>' + val + '年</li>';
                        $(ele).find('.calendar-panple:eq(0) ul').append(text);
                    });
                     $.each(self.config.month, function(n, val) {
                        var text = '<li>' + val + '月</li>';
                        $(ele).find('.calendar-panple:eq(1) ul').append(text);
                    });
                    showDays($(ele).find('.calendar-panple:eq(2) ul')[0]);
                }
            }

            // 获取默认年数据 当前年份前50年
            function getYearList() {
                var yearArr = [];
                for (var i = 0; i <= self.yearago; i++) {
                    yearArr.push(YEAR - self.yearago + i);
                }
                self.minYear = yearArr[0];
                return yearArr;
            }

            // 获取默认月数据
            function getMonthList() {
                var monthArr = [];
                var len = 12;
                var month = Number(self.config.defaultMonth);
                var currmonth = Number(MONTH);
                if (self.config.defaultYear >= YEAR) {
                    len = currmonth;
                }
                for (var i = 1; i <= len; i++) {
                    monthArr.push(i < 10 ? '0' + i : i);
                }
                self.minMonth = monthArr[0];
                return monthArr;
            }

            // 获取默认日数据
            function getDayList() {
                var dayArr = [];
                var len;
                var month = Number(self.config.defaultMonth);
                if (month == 2) {
                    len = self.config.defaultYear % 4 == 0 ? 29 : 28;
                } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                    len = 31;
                } else {
                    len = 30;
                }
                var month = Number(self.config.defaultMonth);
                var currmonth = Number(MONTH);
                var currDay = Number(DAY);
                if (self.config.defaultYear >= YEAR && month >= currmonth) {
                    len = currDay;
                }
                for (var i = 1; i <= len; i++) {
                    dayArr.push(i < 10 ? '0' + i : i);
                }
                self.minDay = dayArr[0];                
                return dayArr;
            }

            // 重新输出月                                      
            function showMonths(ele, isTrue) {
                $(ele).empty();
                if (isTrue) {
                    self.config.month = getMonthList();
                }
                var index = getIndex(self.config.month, self.config.defaultMonth, 2);
                $.each(self.config.month, function(n, val) {
                    var text = '<li>' + val + '月</li>';
                    $(ele).append(text);
                });
                $(ele).find('li:eq(' + index + ')').addClass('active');

                var top = $(ele)[0].offsetTop;
                var len = self.config.month.length;

                if (top <= -(len -3) * self.tempHei) {
                    self.defaultMonth = len;
                    $(ele).animate({top: -(len - 3) * self.tempHei}, 400, function() {
                        $(ele).find('li:eq(' + (len-1) + ')').addClass('active');
                    });
                }
            }
            
            // 重新输出天                                        
            function showDays(ele, isTrue) {
                $(ele).empty();
                if (isTrue) {
                    self.config.day = getDayList();
                }
                var index = getIndex(self.config.day, self.config.defaultDay, 1);
                $.each(self.config.day, function(n, val) {
                    var text = '<li>' + val + '日</li>';
                    $(ele).append(text);
                });
                $(ele).find('li:eq(' + index + ')').addClass('active');
                var top = $(ele)[0].offsetTop;
                var len = self.config.day.length;
                if (top <= -(len -3) * self.tempHei) {
                    self.defaultDay = len;
                    $(ele).animate({top: -(len - 3) * self.tempHei}, 400, function() {
                        $(ele).find('li:eq(' + (len-1) + ')').addClass('active');
                    });
                }
            }
        }

    });

})(jQuery);