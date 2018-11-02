/* 2017-07-15 20:38:44 */
;
$(function() {

	// 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };
    
	// 初始化功能
	InitOperate();	

});

const CampusVal = top.CampusVal;

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
		// 退出管理
		case 0:
			$.layerPop({
				msg: '请确认退出管理吗？将返回自助系统',
				time: 6,
				yes: function() {
					top.location = '../../../../SD-001/index.html';
					console.log('退出管理成功！');
				}
			});
			break;

		// 退出自助系统
		case 1:
			$.layerPop({
				msg: '请确认退出自助系统吗？将返回桌面',
				time: 6,
				yes: function() {
					ThisWindow.Exit();
					console.log('退出系统成功！');
				}
			});
			break;

		// 重启设备
		case 2:
			$.layerPop({
				msg: '请确认重启设备吗？',
				// msg:'请确定关闭服务吗？',
				time: 6,
				yes: function() {
					console.log('重启成功！');
					ThisWindow.Reboot();
					// console.log('关闭服务');
					// AJAX.Admin.ChangeZZJInfomation(ZZJINFO, function(ret) {
					// 	// console.log(ret);
					// 	ServerStatus(1);
					// 	$.layerPop({
					// 		msg: '暂停成功！',
					// 		time: 6,
					// 		btn: ['确认']
					// 	});
					// }, function(ret) {
					// 	console.log(ret);
					// 	$.layerPop({
					// 		msg: ret.Msg,
					// 		time: 6,
					// 		btn: ['确认']
					// 	});
					// });						
				}
			});
			break;

		// 关机
		case 3:
			$.layerPop({
				msg: '请确认关机吗？将关闭整个系统（Windows）',
				time: 6,
				yes: function() {
					console.log('关机成功！');
					ThisWindow.PowerOff();
				}
			});
			break;
	}
}
