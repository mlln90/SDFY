/* 2017-07-15 09:08:49 */
;
$(function() {

	// 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };
    
	// 初始化功能
	InitOperate();	

});


/*
 * 功能绑定事件
 */
function InitOperate() {
	$('.operate-btns .item .btn').on('click', function() {
		var type = $(this).data('type');
		PopControl(type);		
	});
}


/*
 * 功能弹窗管理
 * @param _type 类型
 */
function PopControl(_type) {
	switch (_type) {
		// 添加常用品
		case 0:
			$(document.body).append(StapleText);

			// 输出数据并绑定事件
			ShowDataBindEvent();
			break;

		// 查看常用品
		case 1:
			$(document.body).append(StapleText);
			$('#staple .numbers').remove();
			$('#staple .bottom .btn-affirm').remove();

			// 输出数据并绑定事件
			ShowDataBindEvent();
			break;
	}
}


/*
 * 输出数据，绑定事件
 */
function ShowDataBindEvent() {
	var ele = '#staple';

	// 输出对应数值
	$(ele + ' .detail .row-item:eq(0) .value').val(999);
	$(ele + ' .detail .row-item:eq(1) .value').val(993);
	$(ele + ' .detail .row-item:eq(2) .value').val(995);
	$(ele + ' .detail .row-item:eq(3) .value').val(998);

	// 选择输入框
	var $input = $(ele + ' .detail .row-item:eq(0) .value');
	$(ele + ' .detail .row-item .value').on('click', function() {
		$input = $(this);
	});


	// 输入数字
	$(ele + ' .numbers li:not(li[remove])').on('click', function() {
		var CurrNum = $input.val() + '';
		var num = $(this).text();
		$input.val(CurrNum + num);
	});

	// 删除
	$(ele + ' .numbers li[remove]').on('click', function() {
		var CurrNum = $input.val() + '';
		$input.val(CurrNum.substring(0, CurrNum.length - 1));
	});

	// 确认
	$(ele + ' .btn-affirm').on('click', function() {
		var TDNum = $(ele + ' .detail .row-item:eq(0) .value').val();
		var JZKNum = $(ele + ' .detail .row-item:eq(1) .value').val();
		var BLBNum = $(ele + ' .detail .row-item:eq(2) .value').val();
		var DYZNum = $(ele + ' .detail .row-item:eq(3) .value').val();
		console.log('碳带可用量：', TDNum);
		console.log('就诊卡可用量：', JZKNum);
		console.log('病历本可用量：', BLBNum);
		console.log('打印纸可用量：', DYZNum);
	});

	// 返回
	$(ele + ' .btn-back').on('click', function() {
		$(ele).attr('class', 'animated fadeOutUp');
		setTimeout(function() {
			$(ele).remove();
		}, 600);
	});
}



var StapleText = '<div id="staple" class="animated fadeInUp">'
			+ '<div class="content text-center">'
			+ '<div class="detail">'
			+ '<div class="row-item">'
			+ '<span class="name">碳带可用量：</span>'
			+ '<input type="text" class="value" placeholder="请输入数量">'
			+ '</div>'
			+ '<div class="row-item">'
			+ '<span class="name">就诊卡可用量：</span>'
			+ '<input type="text" class="value" placeholder="请输入数量">'
			+ '</div>'
			+ '<div class="row-item">'
			+ '<span class="name">病历本可用量：</span>'
			+ '<input type="text" class="value" placeholder="请输入数量">'
			+ '</div>'
			+ '<div class="row-item">'
			+ '<span class="name">打印纸可用量：</span>'
			+ '<input type="text" class="value" placeholder="请输入数量">'
			+ '</div></div>'
			+ '<div class="btn-wrap">'
			+ '<div class="numbers">'
			+ '<ul class="clearfix">'
			+ '<li>1</li><li>2</li><li>3</li><li>4</li>'
			+ '<li>5</li><li>6</li><li>7</li><li>8</li>'
			+ '<li>9</li><li>0</li><li remove>删除</li>'
			+ '</ul></div>'
			+ '<div class="bottom">'
			+ '<div class="btn btn-affirm pull-left">确认</div>'
			+ '<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>'
			+ '</div></div></div></div>';