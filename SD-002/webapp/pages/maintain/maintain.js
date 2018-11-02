/* 2017-07-14 11:29:07 */
;
$(function() {
	
	// 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };

	// 初始化功能
	InitOperate();				

});

var AJAX = top.AJAX;
var ZZJINFO = top.ZZJINFO;

/*
 * 功能绑定事件
 */
function InitOperate() {
	$('.operate-btns .item .btn').on('click', function() {
		var type = $(this).data('type');
		PopControl(type, {});		
	});
}


/*
 * 功能弹窗管理
 * @param _type 类型
 * @param _data 数据
 * @param _input 数值框
 */
function PopControl(_type, _data, _input) {
	var param = {
		ModuleConfig: _data.ModuleConfig
	}
	switch (_type) {
		// 功能维护
		case 0: 
			$(document.body).append(MaintainListText);

			// 初始化表头
			$.initTableHead('#maintain-table thead tr', TableHeadData);

			// 初始维护列表
			InitMaintainList();

			// 返回
			$('#maintain .btn-back').on('click', function() {
				$('#maintain').attr('class', 'animated fadeOutUp');
				setTimeout(function() {
					$('#maintain').remove()
				}, 600);
			});
			break;

		// 确认
		case 1: 
			var num = $(_input).val();
			param.ModuleConfig.SerialNumber = num;
			Submit(param);
			break;

		// 隐藏
		case 2: 
			param.ModuleConfig.Visual = false;
			Submit(param);
			break;

		// 显示
		case 3: 
			param.ModuleConfig.Visual = true;
			Submit(param);
			break;

		// 禁用
		case 4: 
			param.ModuleConfig.Enabled = false;
			Submit(param);
			break;

		// 启用
		case 5: 
			param.ModuleConfig.Enabled = true;
			Submit(param);
			break;
	}

	function Submit(_param) {
		// console.log(_param);
		AJAX.Admin.ChangeModuleConfig(_param, function(ret) {
			console.log(ret);
			InitMaintainList();
		}, function(ret) {
			console.log(ret);
			$.layerPop({
				msg: ret.Msg
			})
		});
	}
}


/*
 * 输出初始化列表
 */
function InitMaintainList() {

	var param = {
		TableID: ZZJINFO.ZZJInfomation.ModuleConfigID
	}
	// 查询模块列表
	AJAX.Admin.QueryModuleConfigTable(param, function(ret) {
		// console.log(ret);
		var data = ret.ModuleConfigTable.ModuleConfigs;
		var data = TransformData(data);
		// 调用插件
		GetTablePlugin('#maintain-table', data);
	}, function(ret) {
		console.log(ret);
		$.layerPop({
			msg: ret.Msg,
			time: 15,
			btn: ['确认']
		});
	});
}

/*
 * 调用 table 插件 
 * @param ele table id  
 * @param _data 显示数据 
 */
function GetTablePlugin(ele, _data) {
    $(ele).bootstrapTable('load', _data);
    $(ele).bootstrapTable({
        data: _data,
        height: 750,
        striped: true
    });

    // 获取点击行的数据
    var rowData;
    $(ele).unbind();
    $(ele).on('click-row.bs.table', function(e, row, ele) {
        rowData = row;
    })
    .on('sort.bs.table', function() {
    	setTimeout(CountBtns, 200);
    });

    // 操作按钮
    $(ele).on('click', function(e) {
        if (e.target.nodeName == 'BUTTON') {
            var type = $(e.target).data('type');
            var $input = $(e.target).parents('tr').find('.row-item input');
            PopControl(type, rowData, $input);
        }
    });

    // 加减按钮
    CountBtns();
    function CountBtns() {
    	$(ele + ' .btn-sub').on('click', function() {
    		var $input = $(this).next();
    		var num = $input.val();
    		num--;
    		if (num <= 0) {
    			num = 0;
    		}
    		$input.val(num);
    	});
    	$(ele + ' .btn-add').on('click', function() {
    		var $input = $(this).prev();
    		var num = $input.val();
    		num++;
    		$input.val(num);
    	});
    }
};


/* 
 * 转换数据
 * @param _data 数据
 */
function TransformData(_data) {
	var data = [];

	$.each(_data, function(n, val) {
		var obj = {
			Module: val.Name,
			Order: GetOrder(val.SerialNumber),
			_Order: val.ID,
			Visual: ['显示', '隐藏'][val.Visual ? 0 : 1],
			Enabled: ['启用', '禁用'][val.Enabled ? 0 : 1],
			Operate: GetOperate(val.Visual ? 0 : 1, val.Enabled ? 0 : 1),
			ModuleConfig: val
		};
		data.push(obj);
	});

	return data;
}


/* 表头数据 */
var TableHeadData = [
	{
 		name: '功能模块',
 		field: 'Module',
 		sortable: true
 	}, {
 		name: '显示次序',
 		field: 'Order'
 	}, {
 		name: '显示状态',
 		field: 'Visual',
 		sortable: true
 	}, {
 		name: '禁用状态',
 		field: 'Enabled',
 		sortable: true
 	}, {
 		name: '操作',
 		field: 'Operate'
 	}
];


/* 临时数据 */
var TableData = [];
for (var i = 0; i < 50; i++) {
	var st = Math.ceil(Math.random()*2) - 1;
	var obj = {
		Module: '模块' + i,
		Order: GetOrder(i),
		_Order: i,
		Visual: ['显示', '隐藏'][st],
		Operate: GetOperate(st)
	};
	TableData.push(obj);
}

/*
 * 获取显示次序
 * @param _num 排序值
 */
function GetOrder(_num) {
	var count = '<div class="wrap"><div class="row-item">'
				+ '<span class="btn btn-sub"><i class="fa fa-minus"></i></span>'
				+ '<input type="text" value="' + _num + '" />'
				+ '<span class="btn btn-add"><i class="fa fa-plus"></i></span>'
				+ '</div></div>';
	return count;
}

/*
 * 获取操作功能按钮
 * @param _vt 显示状态
 * @param _et 禁用状态
 */
function GetOperate(_vt, _et) {
	var btns = '<button class="btn btn-affirm" data-type="1">确认</button> ';
	if (_vt == 0) {
		btns += '<button class="btn btn-hide" data-type="2">隐藏</button> ';
	} else {
		btns += '<button class="btn btn-show" data-type="3">显示</button> ';
	}
	if (_et == 0) {
		btns += '<button class="btn btn-hide" data-type="4">禁用</button>';
	} else {
		btns += '<button class="btn btn-show" data-type="5">启用</button>';
	}
	return btns;
}


var MaintainListText = '<div id="maintain" class="animated fadeInUp">'
			+ '<div class="content">'
			+ '<div class="text-right m-b-l">'
			+ '<div class="btn btn-back">返回 <i class="fa fa-reply"></i></div>'
			+ '</div>'
			+ '<table id="maintain-table"><thead><tr></tr></thead></table>'
			+ '</div></div>';