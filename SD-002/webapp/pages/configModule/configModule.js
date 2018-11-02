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

console.log(ZZJINFO);


// AJAX.Admin.QueryModules(function(ret) {
// 	console.log(ret);
// 	MainMenuConfig = ret.Modules;
// }, function(ret) {
// 	console.log(ret);
// });

AJAX.Business.QueryModuleConfigTableList("{}", function(ret){}, function(ret) {
	console.log(ret);
	if(ret.Code == 0){
		MainMenuConfig = ret.ModuleConfigTable[0].ModuleConfigs;
	}
}, function(ret) {
	console.log(ret);
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

		// 配置模块
		case 3:
			$(document.body).append(ModuleConfigText);

			// 输出数据并绑定事件
			ShowDataBindEvent4();
			break;

		// 配置模块
		case 4:
			$(document.body).append(ModuleConfigText);

			// 输出数据并绑定事件
			ShowDataBindEvent5();
			break;
	}
}


/* 配置模块 */
function ShowDataBindEvent4() {
	var ele = '#module-config';
	$(ele + ' .list-group').empty();
	console
	$.each(MainMenuConfig, function(n, val) {
		// var TagInfo = JSON.parse(val.Tag);
		// if (TagInfo.Campus != CampusVal
		// 	&& TagInfo.Campus != -1)
		// 	return true;
		var list =  '<div class="list-item">'
				+ '<label for="checkbox' + n + '">'
				+ '<span class="checkbox">'
				+ '<input type="checkbox" id="checkbox' + n + '" class="' + val.Code + '"/>'
				+ '<span></span>'
				+ '</span>' + val.Name
				+ '</label>'
				+ 'Work-Time：<select></select></div>';
		$(ele + ' .list-group').append(list);
		$(ele + ' .list-group .list-item:eq(' + n + ')').data(val);
	});

	var login = ThisWindow.ReadDict('login');   // 读取字典	
	var param = {
		ZZJCertificate: top.ZZJCertificate,     // 自助机信息
		AdminCertificate: JSON.parse(login);
	}
	// AJAX.Admin.QueryWorkTimeSegmentConfigList(param, function(ret) {
	// 	console.log(ret);
	// 	$(ele + ' .list-group .list-item').each(function(n) {
	// 		var $select = $(this).data(MainMenuConfig[n]).find('select');
	// 		$select.empty();
	// 		$select.append('<option value="-1">请选择模块工作时间</option>');
	// 		$.each(ret.WorkTimeSegmentTables, function(n, val) {
	// 			if (val.DistrictID != CampusVal
	// 				&& val.DistrictID != -1)
	// 				return true;
	// 			var time = val.TableName;
	// 			var option = '<option value="' + val.ID + '">' + time + '</option>';
	// 			$select.append(option);
	// 		});
	// 	});

	// 	// 查模块
	// 	var param = {
	// 		TableID: ZZJINFO.ZZJInfomation.ModuleConfigID
	// 	}
	// 	AJAX.Admin.QueryModuleConfigTable(param, function(ret) {
	// 		// console.log(ret);
	// 		var data = ret.ModuleConfigTable.ModuleConfigs;
	// 		$.each(data, function(n, val) {
	// 			var $check = $(ele + ' .list-group').find('input.' + val.Code);
	// 			$check.prop('checked', true);
	// 			$check.parents('label').next().val(val.WorkTimeSegmentConfigID);
	// 		});
	// 	}, function(ret) {
	// 		console.log(ret);
	// 	});
	// }, function(ret) {
	// 	console.log(ret);
	// });

	// 确认
	$(ele + ' .btn-affirm').on('click', function() {
		var ModuleArr = [];
		$(ele + ' .list-group .list-item').each(function() {
			var $check = $(this).find('input');
			var $parent = $check.parents('.list-item');
			var $label = $parent.find('label');
			var $selectd = $parent.find('select option:selected');
			var st = $check.prop('checked');
			if (st) {
				var data = $parent.data();
				var workId = $selectd.val();
				var TagInfo = JSON.parse(data.Tag);
				var obj = {
					SerialNumber: TagInfo.Sort,      // 模块序号
					WorkTimeSegmentConfigID: workId, // 模块工作时间 id
					ParentID: data.ParentID,         // 模块父级id
					Visual: true,                    // 显示或隐藏
					Enabled: data.Enabled,           // 启用或禁用
					IsFolder: data.IsFolder,         // 是否为目录
					ImagePath: data.ImagePath,       // 图片路径
					Tag: data.Tag,                   // 标签
					ModuleID: data.ID,               // 模块id
					Code: data.Code,                 // 模块 代码
					Name: data.Name,			     // 模块名称
				}
				ModuleArr.push(obj);
			}
		});
		var param = {
			ModuleConfigTable: {
				Name:  ZZJINFO.ZZJInfomation.Name + '模块配置表',
				ZZJID: ZZJINFO.ZZJInfomation.ZZJID,
				ModuleConfigs: ModuleArr
			}
		}

		AJAX.Admin.AddModuleConfigTable(param, function(ret) {
			// console.log(ret);
			ZZJINFO.ZZJInfomation.ModuleConfigID = ret.ModuleConfigID;
			top.ZZJINFO.ZZJInfomation.ModuleConfigID = ret.ModuleConfigID;
			$.layerPop({
				msg: '模块配置成功！',
				time: 6,
				btn: ['确认']
			});
		}, function(ret) {
			console.log(ret);
			$.layerPop({
				msg: '模块配置失败！',
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

/* 修改模块 */
function ShowDataBindEvent5() {
	var ele = '#module-config';
	$(ele + ' .title').html('修改模块');
	$(ele + ' .list-group').empty();

	var param = {
		TableID: ZZJINFO.ZZJInfomation.ModuleConfigID
	}
	// 查询模块列表
	AJAX.Admin.QueryModuleConfigTable(param, function(ret) {
		// console.log(ret);
		var data = ret.ModuleConfigTable.ModuleConfigs;
		$.each(data, function(n, val) {
			if (val.Code) {
				var list =  '<div class="list-item">'
						+ '<label for="checkbox' + n + '">'
						+ '<span class="checkbox">'
						+ '<input type="checkbox" class="' + val.Code + '" id="checkbox' + n + '" />'
						+ '<span></span>'
						+ '</span>' + val.Name
						+ '</label>'
						+ 'Work-Time：<select></select></div>';
				$(ele + ' .list-group').append(list);
				$(ele + ' .list-group .list-item:eq(' + n + ')').data(val);
			}		
		});

		var login = ThisWindow.ReadDict('login');  // 读取字典	
		var param = {
			ZZJCertificate: top.ZZJCertificate,     // 自助机信息
			AdminCertificate: JSON.parse(login)
		}
		AJAX.Admin.QueryWorkTimeSegmentConfigList(param, function(ret) {
			// console.log(ret);
			$(ele + ' .list-group .list-item').each(function() {
				var $select = $(this).find('select');
				$select.empty();
				$select.append('<option value="-1">请选择模块工作时间</option>');
				$.each(ret.WorkTimeSegmentTables, function(n, val) {
					if (val.DistrictID != CampusVal
						&& val.DistrictID != -1)
						return true;
					var time = val.TableName;
					var option = '<option value="' + val.ID + '">' + time + '</option>';
					$select.append(option);
				});
			});

			// 查模块
			var param = {
				TableID: ZZJINFO.ZZJInfomation.ModuleConfigID
			}
			AJAX.Admin.QueryModuleConfigTable(param, function(ret) {
				// console.log(ret);
				var data = ret.ModuleConfigTable.ModuleConfigs;
				$.each(data, function(n, val) {
					var $check = $(ele + ' .list-group').find('input.' + val.Code);
					$check.prop('checked', true);
					$check.parents('label').next().val(val.WorkTimeSegmentConfigID);
				});
			}, function(ret) {
				console.log(ret);
			});
		}, function(ret) {
			console.log(ret);
		});
	}, function(ret) {
		console.log(ret);
		$.layerPop({
			msg: ret.Msg,
			time: 15,
			btn: ['确认']
		});
	});		

	// 确认
	$(ele + ' .btn-affirm').on('click', function() {
		var ModuleArr = [];
		$(ele + ' .list-group .list-item').each(function() {
			var $check = $(this).find('input');
			var $parent = $check.parents('.list-item');
			var $label = $parent.find('label');
			var $selectd = $parent.find('select option:selected');
			var st = $check.prop('checked');
			if (st) {
				var data = $parent.data();
				var workId = $selectd.val();
				var TagInfo = JSON.parse(data.Tag);
				var obj = {
					SerialNumber: TagInfo.Sort,      // 模块序号
					WorkTimeSegmentConfigID: workId, // 模块工作时间 id
					ParentID: data.ParentID,         // 模块父级id
					Visual: true,                    // 显示或隐藏
					Enabled: data.Enabled,           // 启用或禁用
					IsFolder: data.IsFolder,         // 是否为目录
					ImagePath: data.ImagePath,       // 图片路径
					Tag: data.Tag,                   // 标签
					ModuleID: data.ID,               // 模块id
					Code: data.Code,                 // 模块 代码
					Name: data.Name,			     // 模块名称
				}
				ModuleArr.push(obj);
			}
		});
		var param = {
			ModuleConfigTable: {
				Name:  ZZJINFO.ZZJInfomation.Name + '模块配置表',
				ID: ZZJINFO.ZZJInfomation.ModuleConfigID,
				ModuleConfigs: ModuleArr
			}				
		}
		AJAX.Admin.ChangeModuleConfigTable(param, function(ret) {
			// console.log(ret);
			$.layerPop({
				msg: '修改成功！',
				time: 6,
				btn: ['确认']
			});
		}, function(ret) {
			console.log(ret);
			$.layerPop({
				msg: '修改失败！',
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


/* 配置模块 */
var ModuleConfigText = '<div id="module-config" class="animated fadeInUp">'
				+ '<div class="content text-center">'
				+ '<h2 class="title">模块配置</h2>'
				+ '<div class="wrap list-group">'
				+ '</div>'
				+ '<div class="btn-wrap">'
				+ '<div class="btn btn-affirm pull-left">确认</div>'
				+ '<div class="btn btn-back pull-right">返回 <i class="fa fa-reply"></i></div>'
				+ '</div>'
				+ '</div>'
				+ '</div>';