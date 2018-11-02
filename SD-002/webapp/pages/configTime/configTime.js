/* 2017-09-27 11:58:34 */
;
$(function() {

	// 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };

	// 初始化功能
	InitOperate();
});

const AJAX = top.AJAX;
const CampusVal = top.CampusVal;
var ZZJINFO = top.ZZJINFO;

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
		// 修改配置时间
		case 0:
			$(document.body).append(AddWorkTimeText);

			// 输出数据并绑定事件
			ShowDataBindEvent1();
			break;

		// 添加配置时间
		case 1:
			$(document.body).append(AddWorkTimeText);

			// 输出数据并绑定事件
			ShowDataBindEvent2();
			break;

		// 更换配置时间
		case 2:
			$(document.body).append(ChangeConfigTimeText);

			// 输出数据并绑定事件
			ShowDataBindEvent3();
			break;

		// 修改配置信息
		case 3:
			$(document.body).append(ChangeInfoText);

			// 输出数据并绑定事件
			ShowDataBindEvent4();
			break;
	}
}

/*
 * 修改工作时间
 */
function ShowDataBindEvent1() {

	var ele = '#add-work-time';
	$(ele + ' .title').html('修改配置时间');

	var login = ThisWindow.ReadDict('login');  // 读取字典	
	var param = {
		ZZJCertificate: top.ZZJCertificate,     // 自助机信息
		AdminCertificate: JSON.parse(login)
	}
	var TimeList = [];
	var $select = $(ele + ' .wrap .row-item.time-list select');
	AJAX.Admin.QueryWorkTimeSegmentConfigList(param, function(ret) {
		// console.log(ret);
		TimeList = ret.WorkTimeSegmentTables;
		$select.empty();
		$select.append('<option value="-1">请选择需要修改的时间表</option>')
		$.each(TimeList, function(n, val) {
			if (val.DistrictID != CampusVal
				&& val.DistrictID != -1)
				return true;
			var time = val.TableName;
			/*$.each(val.WorkTimeSegments, function(_n, _val) {
				time += _val.StartTime.split('T')[1] + '-' + _val.EndTime.split('T')[1] + '  ';
			});*/
			var option = '<option value="' + n + '">' + time + '</option>';
			$select.append(option);
		});
	}, function(ret) {
		console.log(ret);
	});

	var CurrentData;
	$select.on('change', function() {
		var id = $(this).val();
		CurrentData = TimeList[id];
		$(ele + ' .wrap .row-item .value.time-name').val(CurrentData.TableName);
		var TimeArr = CurrentData.WorkTimeSegments;
		var $list = $('#time-list');
		$list.empty();
		$.each(TimeArr, function(n, val) {
			var list = GetOneGroupText();
			$list.append(list);
			var $Group = $list.find('.row-item:eq(' + n + ')');
			$Group.find('.time-status select').val(Number(val.Enabled));
			$Group.find('.time-start input').val(val.StartTime.split('T')[1]);
			$Group.find('.time-end input').val(val.EndTime.split('T')[1]);
		});
		DeleteTimeGroup();
	});
	AddTimeGroup();
	DeleteTimeGroup();

	// 确认
	$(ele + ' .btn-affirm').on('click', function() {
		var param = GetWorkTimeParam();
		if (!CurrentData) {
			return $.layerPop({
				msg: '请选择需要修改的时间表',
				time: 6,
				btn: ['确认']
			});
		}
		param.WorkTimeSegmentTable.ID = CurrentData.ID;
		AJAX.Admin.ChangeWorkTimeSegmentConfigTable(param, function(ret) {
			// console.log(ret);
			$.layerPop({
				msg: '修改成功！',
				time: 6,
				btn: ['确认']
			});
		}, function(ret) {
			console.log(ret);
			$.layerPop({
				msg: ret.Msg,
				time: 6,
				btn: ['确认']
			});
		});  // 修改
			
	});

	// 返回
	$(ele + ' .btn-back').on('click', function() {
		$(ele).attr('class', 'animated fadeOutUp');
		setTimeout(function() {
			$(ele).remove();
		}, 600);
	});
}

/*
 * 添加工作时间
 */
function ShowDataBindEvent2() {

	var ele = '#add-work-time';
	$(ele + ' .title').html('添加配置时间');
	$(ele + ' .wrap .row-item.time-list').remove();

	AddTimeGroup();
	DeleteTimeGroup();

	// 确认
	$(ele + ' .btn-affirm').on('click', function() {
		var param = GetWorkTimeParam();
		AJAX.Admin.AddWorkTimeSegmentTable(param, function(ret) {
			// console.log(ret);
			$.layerPop({
				msg: '添加成功！',
				time: 6,
				btn: ['确认']
			});			
		}, function(ret) {
			console.log(ret);
			$.layerPop({
				msg: ret.Msg,
				time: 6,
				btn: ['确认']
			});
		});
			
	});

	// 返回
	$(ele + ' .btn-back').on('click', function() {
		$(ele).attr('class', 'animated fadeOutUp');
		setTimeout(function() {
			$(ele).remove();
		}, 600);
	});
}

/*
 * 获取工作时间信息参数
 */
function GetWorkTimeParam() {
	var GroupNmae = $('#add-work-time .wrap .row-item .value.time-name').val();
	var TimeList = [];
	$('#time-list .row-item').each(function(n) {
		var Enabled = Boolean($(this).find('.time-status select').val() * 1);
		var StartTime = $(this).find('.time-start input').val();
		var EndTime = $(this).find('.time-end input').val();
		var obj = {
			Enabled: Enabled,
			EndTime: EndTime,
			StartTime: StartTime,
		}
		TimeList.push(obj);
	});
	return {
		WorkTimeSegmentTable: {
			TableName: GroupNmae,
			WorkTimeSegments: TimeList,
			DistrictID: CampusVal,
		}
	};
}

/*
 * 添加时间组
 */
function AddTimeGroup() {
	$('.btn-add-group').on('click', function() {
		$('#time-list').append(GetOneGroupText());
		DeleteTimeGroup();
	});
}

/*
 * 删除时间组
 */
function DeleteTimeGroup() {
	$('#time-list .btn-delete').unbind('click');
	$('#time-list .btn-delete').on('click', function() {
		$(this).parents('.row-item').remove();
	});
}


/*
 * 更换自助机配置时间
 */
function ShowDataBindEvent3() {

	var ele = '#change-config-time';

	var login = ThisWindow.ReadDict('login');  // 读取字典	
	var param = {
		ZZJCertificate: top.ZZJCertificate,     // 自助机信息
		AdminCertificate: JSON.parse(login)
	}
	AJAX.Admin.QueryWorkTimeSegmentConfigList(param, function(ret) {
		// console.log(ret);
		var $group = $(ele + ' .wrap');
		$group.empty();
		$.each(ret.WorkTimeSegmentTables, function(n, val) {
			if (val.DistrictID != CampusVal
				&& val.DistrictID != -1)
				return true;
			var time = '';
			$.each(val.WorkTimeSegments, function(_n, _val) {
				time += _val.StartTime.split('T')[1] + '-' + _val.EndTime.split('T')[1] + '  ';
			});
			var list = '<div class="row-item" data-id="' + val.ID + '">'
					+ '<label for="checkbox' + n + '">'
					+ '<span class="checkbox">'
					+ '<input type="checkbox" id="checkbox' + n + '" />'
					+ '<span></span>'
					+ '</span>'
					+ '<span class="name">' + val.TableName + '</span>' 
					+ '<span class="value">' + time + '</span>'
					+ '</label>'
					+ '</div>';
			$group.append(list);
		});

		var id = ZZJINFO.ZZJInfomation.UseTimeSegmentConfigID;
		$(ele + ' .wrap .row-item[data-id="' + id + '"]').find('input[type="checkbox"]').prop('checked', true);
		
		$(ele + ' .wrap input[type="checkbox"]').on('change', function() {
			$(this).parents('.row-item').siblings().find('input[type="checkbox"]').prop('checked', false);
		});

	}, function(ret) {
		console.log(ret);
	});

	// 确认
	$(ele + ' .btn-affirm').on('click', function() {
		var $checked = $(ele + ' .wrap input[type="checkbox"]:checked');
		if (!$checked.length) {
			$.layerPop({
				msg: '请选择工作时间',
				time: 6,
				btn: ['确认']
			})
			return;
		}
		var id = $checked.parents('.row-item').data('id');
		ZZJINFO.ZZJInfomation.UseTimeSegmentConfigID = id;
		AJAX.Admin.ChangeZZJInfomation(ZZJINFO, function(ret) {
			// console.log(ret);
			$.layerPop({
				msg: '修改成功！',
				time: 6,
				btn: ['确认']
			});
		}, function(ret) {
			console.log(ret);
			$.layerPop({
				msg: ret.Msg,
				time: 6,
				btn: ['确认']
			});
		});	
	});			

	// 返回
	$(ele + ' .btn-back').on('click', function() {
		$(ele).attr('class', 'animated fadeOutUp');
		setTimeout(function() {
			$(ele).remove();
		}, 600);
	});
}

/*
 * 修改配置信息 输出数据，绑定事件
 */
function ShowDataBindEvent4() {
	var data = ZZJINFO.ZZJInfomation;
	var ele = '#change-info';

	// 输出对应数值
	$(ele + ' .wrap .row-item:eq(0) .value').val(data.Mobile);
	$(ele + ' .wrap .row-item:eq(1) .value').val(data.Name);
	$(ele + ' .wrap .row-item:eq(2) .value').val(data.Position);

	// 确认
	$(ele + ' .btn-affirm').on('click', function() {
		var phone = $(ele + ' .wrap .row-item:eq(0) .value').val();
		var ZZJnum = $(ele + ' .wrap .row-item:eq(1) .value').val();
		var location = $(ele + ' .wrap .row-item:eq(2) .value').val();

		ZZJINFO.ZZJInfomation.Mobile = phone;
		ZZJINFO.ZZJInfomation.Name = ZZJnum;
		ZZJINFO.ZZJInfomation.Position = location;
		AJAX.Admin.ChangeZZJInfomation(ZZJINFO, function(ret) {
			// console.log(ret);
			$.layerPop({
				msg: '修改成功！',
				time: 6,
				btn: ['确认']
			});
		}, function(ret) {
			console.log(ret);
			$.layerPop({
				msg: ret.Msg,
				time: 6,
				btn: ['确认']
			});
		});	
	});

	// 返回
	$(ele + ' .btn-back').on('click', function() {
		$(ele).attr('class', 'animated fadeOutUp');
		setTimeout(function() {
			$(ele).remove();
		}, 600);
	});
}


/*  获取一组时间输入框 */
function GetOneGroupText() {
	return '<div class="row-item">'
				+ '<div class="time-status">'
				+ '开启状态:'
				+ '<select>'
				+ '<option value="1">开启</option>'
				+ '<option value="0">关闭</option>'
				+ '</select>'
				+ '</div>'
				+ '<div class="time-start">'
				+ '开启时间:'
				+ '<input type="text" class="value" placeholder="开启时间" value="07:00">'
				+ '</div>'
				+ '<div class="time-end">'
				+ '结束时间:'
				+ '<input type="text" class="value" placeholder="结束时间" value="17:00">'
				+ '</div>'
				+ '<div class="time-delete">'
				+ '<div class="btn btn-delete">删除</div>'
				+ '</div>'
				+ '</div>';
}



/* 修改配置信息 */
var ChangeInfoText = '<div id="change-info" class="animated fadeInUp">'
				+ '<div class="content text-center">'
				+ '<h2 class="title">修改信息</h2>'
				+ '<div class="wrap">'
				+ '<div class="row-item">'
				+ '<span class="name">服务电话：</span>'
				+ '<input type="text" class="value" placeholder="请输入手机号" value="">'
				+ '</div>'
				+ '<div class="row-item">'
				+ '<span class="name">机器编号：</span>'
				+ '<input type="text" class="value" placeholder="请输入自助机编号" value="ZZJ">'
				+ '</div>'
				+ '<div class="row-item">'
				+ '<span class="name">机器位置：</span>'
				+ '<input type="text" class="value" placeholder="请输入自助机位置" value="">'
				+ '</div>'
				+ '</div>'
				+ '<div class="btn-wrap">'
				+ '<div class="btn btn-affirm pull-left">确认</div>'
				+ '<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>'
				+ '</div>'
				+ '</div>'
				+ '</div>';

/* 添加自助机工作时间 */
var AddWorkTimeText = '<div id="add-work-time" class="animated fadeInUp">'
				+ '<div class="content text-center">'
				+ '<h2 class="title">添加配置时间</h2>'
				+ '<div class="wrap">'
				+ '<div class="row-item time-list">'
				+ '<span class="name">配置时间列表：</span>'
				+ '<select>'
				+ '<option value="-1">请选择需要修改的时间表</option>'
				+ '</select>'
				+ '</div>'
				+ '<div class="row-item">'
				+ '<span class="name">当前配置组名：</span>'
				+ '<input type="text" class="value time-name" placeholder="请输入名称" value="工作时间">'
				+ '<div class="btn-add-group">添加时间组</div>'
				+ '</div>'
				+ '<div id="time-list">'
				+ GetOneGroupText()
				+ '</div>'
				+ '</div>'
				+ '<div class="btn-wrap">'
				+ '<div class="btn btn-affirm pull-left">确认</div>'
				+ '<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>'
				+ '</div>'
				+ '</div>'
				+ '</div>';

// 修改自助机配置时间
var ChangeConfigTimeText = '<div id="change-config-time" class="animated fadeInUp">'
				+ '<div class="content text-center">'
				+ '<h2 class="title">更换自助机工作时间</h2>'
				+ '<div class="wrap text-left">'
				+ '</div>'
				+ '<div class="btn-wrap">'
				+ '<div class="btn btn-affirm pull-left">确认</div>'
				+ '<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>'
				+ '</div>'
				+ '</div>'
				+ '</div>';