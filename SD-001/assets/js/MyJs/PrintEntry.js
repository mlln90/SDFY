/* 2018-01-24 11:19:29 */

 /*
  * 打印凭条等提示
  */
function PrintPTHintLamp() {
	if(ISBG == true){ PTJTSD = 5};                // 壁挂 B组第五路
	AcsSwitch.SetAcs('B', PTJTSD, INDICATORTYPE); // 凭条提示开启
	clearInterval(PRINTTIMER);
	PRINTTIMER = setTimeout(function() {
		AcsSwitch.SetAcs('B', PTJTSD, 0);         // 凭条提示灯关闭
	}, 3000);
}

/* 
 * 打印挂号凭条
 * @param _type 类型 0 - 当日挂号 1 - 微信取号 2 - 预约取号
 */
function PrinRegistertPT(_data, _type) {
	var msg, card = CardInfo;
	if (_type == 0 || !_type)
		msg = '当日挂号';
	var DeptName = $.CheckUndefined(_data.deptName);
	var Position = $.CheckUndefined(_data.Position);
	var totalY = 500;
	if (DeptName.length > PRINTPLACELEN) totalY += 25;
	// if (Position.length > PRINTPLACELEN) totalY += 25;
    ZZJPrinter.Print(PTJPRINTNAME, 300, totalY, false, function(Code, ID){
    	if (Code == 0) { // 打印机正常
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 0+_PR_, 0, '顺德区妇幼保健院');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 10, 0, 50+_PR_, 20, '门诊挂号券(自助)');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 40, '-------------------------------');
	        // ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 97+_PR_, 65, msg);

	        var info = card.PatientInfo;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 65, '姓  名：' + info.PatientName + '  ' + ['未知', '男', '女'][Number(info.Gender)] + '  ' + info.Age); 

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 90, '诊疗号：' + $.CheckUndefined(card.Info.CardNo));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 115, '候诊号：' + $.CheckUndefined(_data.SeqCode));

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 140, '金  额：');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 165, '就诊科室：');
	        var y = 170;
	        if (DeptName.length > PRINTPLACELEN) {
	        	ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 13, 0, 75+_PR_, y, DeptName.substring(0, PRINTPLACELEN));
	        	y += 25;
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '接      上：');
	        	ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 13, 0, 75+_PR_, (y-1), DeptName.substring(PRINTPLACELEN));
	        } else {
	        	ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 13, 0, 75+_PR_, (y-1), DeptName);
	        }

	        y += 25;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '医生姓名：' + $.CheckUndefined(_data.doctorName));
	        // y += 25;
	        // ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '医生类别：' + $.CheckUndefined(_data.Doctype));
	        y += 25;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '就诊时间：' + $.CheckUndefined(_data.data) + ' ' + _data.TimeRecord);
	        y += 25;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '总 费 用 ： ¥ ' + $.CheckUndefined(Number(_data.registerFee).toFixed(2)));
	        y += 25;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '支付方式：' + $.CheckUndefined(card.PayWay));
			y += 25;
			
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, (y + 0), '终端编号：' + ZZJInfomation.Name);

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, (y + 25), '流 水 号 ：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 75+_PR_, (y + 25), $.CheckUndefined(card.SerialNumber));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, (y + 50), '打印时间：' + $.FormatDate(new Date().getTime()));

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, (y + 72), '-------------------------------');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, (y + 90), '温馨提示：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, (y + 115), '    挂号当日当班有效，遗失不补！');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, (y + 140), '若需要更换报销收据，请到人工收费');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, (y + 165), '窗口！');
	        ZZJPrinter.StartPrint(ID);

	        PrintPTHintLamp(); // 打印凭条提示灯
       	} else { // 打印机异常
	       	$.Speak(ID);
			$.Writelog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
	    }
    });
}

/*
* 打印身份证注册信息
* @param _data 卡信息
*/
function PrintIdentityPT(_data){
	var card = _data;
	// txmCanvas();
	ZZJPrinter.Print(PTJPRINTNAME, 300, 400, false, function(Code, ID){
		if(Code == 0){ // 打印机正常
			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 50+_PR_, 0, '顺德区妇幼保健院');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 20+_PR_, 20, '-------------------------------');

	        var info = card.PatientInfo;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_, 75, '姓      名：' + $.CheckUndefined(info.PatientName));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_, 100, '就诊卡号：' + $.CheckUndefined(card.CardInfo.CardNo));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_, 125, '身份证号：' + $.CheckUndefined(info.IDNo));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_, 150, '手机号码：' + $.CheckUndefined(info.Mobile));

	        //打印base64位图片 ID base64图像文件 X Y W H
	        // ZZJPrinter.PrintBase64Picture(ID, BLACKLOGOBASE, 11, 10, 50, 50);
	        //打印指定路径的文件
	        // ZZJPrinter.PrintFilePicture(ID, 'D:/DYIMG/top_s1c.bmp', 11+_PR_, 10, 50, 50);
	        // ZZJPrinter.PrintFilePicture(ID, 'D:/CardtxmInfot.png', 11+_PR_, 10, 50, 315);
	        
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_, 340, '温馨提示：请收好您的扫码凭条！' );
	        ZZJPrinter.StartPrint(ID);

	        PrintPTHintLamp(); // 打印凭条提示灯
		}else{  // 打印机异常
			$.Speak(ID);
			$.Writelog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
		}
	})
}

/*
 * 打印充值凭条
 * @param _data 卡信息
 * @param _money 充值金额 
 * @param _st 充值状态 0 - 成功 1 - 失败
 */

function PrintRechargePT(_data, _money, _st) {
	var card = _data;
	if (_st == undefined) _st = 0;
	ZZJPrinter.Print(PTJPRINTNAME, 300, 405, false, function(Code, ID){
		if (Code == 0) { // 打印机正常
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 0+_PR_, 0, '顺德区妇幼保健院');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 20, '-------------------------------');
	        if (_st == 0) {
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 50+_PR_, 45, '预交金收据(自助机)');
	        } else {
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 80+_PR_, 45, '充值失败凭证');
	        }

	        var info = card.PatientInfo;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 75, '姓      名：' + $.CheckUndefined(info.PatientName));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 100, '就诊卡号：' + $.CheckUndefined(card.Info.CardNo));

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 130, '金      额：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 18, 0, 80+_PR_, 126, '¥' + _money.toFixed(2));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 165, '充值结果：');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 18, 0, 75+_PR_, 161, '【' + ['成功', '失败'][_st] + '】');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 200, '账户余额： ¥ ' + $.CheckUndefined(card._Balance.toFixed(2)));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 225, '充值方式：' + $.CheckUndefined(card.PayWay));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 250, '终端编号：' + ZZJInfomation.Name);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 275, '流 水 号 ：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 75+_PR_, 275, $.CheckUndefined(card.SerialNumber));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 300, '打印时间：' + $.FormatDate(new Date().getTime()));

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 325, '-------------------------------');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, 0+_PR_, 345, '温馨提示：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, 0+_PR_, 360, '     如果充值失败请持本凭证至窗口退款！');
	        ZZJPrinter.StartPrint(ID);

	        PrintPTHintLamp(); // 打印凭条提示灯
	    } else { // 打印机异常
	        $.Speak(ID);
			$.Writelog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
	    }
    });
}

/*
 * 缴费打印凭证
 * @param _data 缴费数据
 * @param _pages 共打印单数
 * @param _pagenum 打印当前单数
 */
function PrintPaymentsPT(_data, _pages, _pagenum) {
	$.Console(_data, '缴费打印数据');
	var data = _data, card = CardInfo, len = data.length, l = 0, ls = 0, y = 240;
	var DeptName = $.CheckUndefined(data.excutDeptName);
	var Position = $.CheckUndefined(data.Position);
	var wicket = $.CheckUndefined(data.window);

	if (DeptName.length > PRINTPLACELEN) l++;
	if (Position.length > PRINTPLACELEN) l++;
	if (wicket.length > PRINTPLACELEN) l++;
	
	ZZJPrinter.Print(PTJPRINTNAME, 300, (l*25 + ls*17 + 420), false, function(Code, ID){
		$.Writelog('打印机返回值：' + Code);
		if (Code == 0) { // 打印机正常
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 0+_PR_, 0, '顺德区妇幼保健院');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 20, '-------------------------------');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 40+_PR_, 45, '医嘱缴费凭证(自助机)');

	        var info = card.PatientInfo;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 75, '患者信息：' + info.PatientName + '  ' + ['未知', '男', '女'][Number(info.Gender)] + '  ' + info.Age); 

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 100, '就诊卡号：' + $.CheckUndefined(card.Info.CardNo));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 125, '处 方 号 ：' + $.CheckUndefined(data.prescriptionNo));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 150, '终端编号：' + ZZJInfomation.Name);

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 175, '流 水 号 ：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 75+_PR_, 175, $.CheckUndefined(card.SerialNumber));

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 200, '打印时间：' + $.FormatDate(new Date().getTime()));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 212, '-------------------------------');

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '执行科室：');
	        if (DeptName.length > PRINTPLACELEN) {
	        	ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 13, 0, 75+_PR_, (y-2), DeptName.substring(0, PRINTPLACELEN));
	        	y += 25;
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '接       上：');
	        	ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 13, 0, 75+_PR_, (y-2), DeptName.substring(PRINTPLACELEN));
	        } else {
	        	ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 13, 0, 75+_PR_, (y-2), DeptName);
	        }

	        y += 25;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '费用类型：' + $.CheckUndefined(data.typeID));


	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 14, 0, 0+_PR_, y + 10, '_________________________________');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 0+_PR_, y + 35, '金      额： ¥ ' + $.CheckUndefined(Number(data.prescriptionAmount).toFixed(2)));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 0+_PR_, y + 60, '支付方式：' + $.CheckUndefined(card.PayWay));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, y + 82, '-------------------------------');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 0+_PR_, y + 105, '                *本次共打印' + _pages + '单，当前第' + _pagenum + '单');
	        ZZJPrinter.StartPrint(ID);

	        PrintPTHintLamp(); // 打印凭条提示灯
	    } else { // 打印机异常
	        $.Speak(ID);
			$.Writelog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
	    }
    });
}

// 消费打印凭证
function PrintRecordPT(_data) {
	var data = _data, card = CardInfo, len = data.InvItemS.length, Strln = 9, l = 0, y = 205;
	$.each(data.InvItemS, function(n, val) {
		var nlen = val.ItemName.length;
		if(nlen > Strln && nlen <= (Strln * 2)) {
			l++;
		} else if (nlen > (Strln * 2)) {
			l += 2;
		}
	});

	ZZJPrinter.Print(PTJPRINTNAME, 300, (25*len + l*17 + 340), false, function(Code, ID){
		if (Code == 0) { // 打印机正常
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 0+_PR_, 0, '顺德区妇幼保健院');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 0+_PR_, 20, '-------------------------------');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 80+_PR_, 40, '消费明细清单');

	        var info = card.PatientInfo;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 75, '姓      名：' + info.PatientName); 
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 100, '就诊卡号：' + $.CheckUndefined(card.Info.CardNo));

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 125, '发票号码 ：' + $.CheckUndefined(data.Receipt));
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 150, '消费日期 ：' + $.CheckUndefined(data.Date));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 175, '打印时间：' + $.FormatDate(new Date().getTime()));

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 14, 0, 0+_PR_, 175, '_________________________________');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 200, '项目名称                  单价    数量    总价');
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 14, 0, 0+_PR_, 200, '_________________________________');

	        $.each(data.InvItemS, function(n, val) {
	        	var name = val.ItemName, ny;
	        	y += 25;
	        	if (name.length > Strln  && name.length <= (Strln*2)) {

	        		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 0+_PR_, y, name.substring(0, Strln));
	        		y += 17;
	        		ny = y - 8;
	        		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 0+_PR_, y, name.substring(Strln));

	        	} else if (name.length > (Strln*2)) {

	        		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 0+_PR_, y, name.substring(0, Strln));
	        		y += 17;
	        		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 0+_PR_, y, name.substring(Strln, Strln*2));
	        		y += 17;
	        		ny = y - 17;
	        		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 0+_PR_, y, name.substring(Strln*2));

	        	} else {
	        		ny = y;
	        		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, name);
	        	}        
	    		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 145+_PR_, ny, val.Unit.toFixed(2) + '');
	    		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 200+_PR_, ny, val.Count + '');
	    		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 235+_PR_, ny, val.Total.toFixed(2) + '');
	        });

	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 14, 0, 0+_PR_, y + 10, '_________________________________');
	        var cost = $.CheckUndefined(Number(data.TotalAmount).toFixed(2));
	        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 14, 0, 0+_PR_, y + 35, '合计金额： ¥ ' + cost + '元');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 0+_PR_, y + 70, '温馨提示：');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 0+_PR_, y + 85, '    此清单为消费明细清单，不能作为报销凭证。');
	        ZZJPrinter.StartPrint(ID);

	        PrintPTHintLamp(); // 打印凭条提示灯
	    } else { // 打印机异常
	        $.Speak(ID);
			$.Writelog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
	    }
    });
}

// 打印化验单 消费明细
function PrintHYD(_data) {
	console.log(_data);
	ZZJPrinter.Print(HYDPRINTNAME, 600, 1000, false, function(Code, ID){
		// console.log(Code);
		if (Code == 0) { // 打印机正常
			ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 17, 0, 180+_PR_,  0, '广东佛山市顺德区妇幼保健院');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 16, 0, 235+_PR_, 30, '门诊病人费用明细清单');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0,  14+_PR_, 64, '姓名：'  + _data.PatientInfo.PatientName );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 140+_PR_, 64, '日期：'  + _data.RecipesInfo.PayDate );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 420+_PR_, 64, '病历号：'+ _data.CardInfo.CardNo );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 610+_PR_, 64, '科室：'  + _data.RecipesInfo.RegisterInfo.Dept.DeptName );

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0,  20+_PR_, 100, '项目编号');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 120+_PR_,  90, '医疗服务价格项目、药品（通用名）');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 155+_PR_, 110, '或一次性医用耗材名称');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 370+_PR_, 100, '规格');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 460+_PR_, 100, '单价￥');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 510+_PR_, 100, '数量');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 570+_PR_, 100, '单位');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 630+_PR_, 100, '金额￥');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 690+_PR_, 100, '自费额￥');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0,   0+_PR_, 120, '-------------------------------------------------------------------------------------------------------------------------------');
 
	        var h=20;
	        var printDetials = _data.RecipesInfo.Details;
	        // console.log(printDetials);
	        if (printDetials.length>0) {
		        for(var i=0;i<printDetials.length;i++){
		        	(function(i){
		        		console.log(printDetials[i].Price);
						console.log(printDetials[i].Count);
						console.log(printDetials[i].Total);
						ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0,   0+_PR_, 135+h*i, ''+printDetials[i].Code );
						ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 120+_PR_, 135+h*i, ''+printDetials[i].Name );
						ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 350+_PR_, 135+h*i, ''+printDetials[i].Spec ); 
						ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 470+_PR_, 135+h*i, ''+printDetials[i].Price );
						ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 520+_PR_, 135+h*i, ''+printDetials[i].Count );
						ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 580+_PR_, 135+h*i, ''+printDetials[i].Unit );
						ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 635+_PR_, 135+h*i, ''+printDetials[i].Total );
						ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 690+_PR_, 135+h*i, ''+printDetials[i].Selfamt );
					})(i)
		        }
	    	};

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0,   0+_PR_, 135+printDetials.length*h, '说明：结算方式为'+_data.RecipesInfo.PayTypeName);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 270+_PR_, 135+printDetials.length*h, '总金额合计：'+_data.RecipesInfo.Total);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 440+_PR_, 135+printDetials.length*h, '自费总金额：'+_data.RecipesInfo.SelfAmt);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 610+_PR_, 135+printDetials.length*h, '优惠总金额：'+_data.RecipesInfo.SocietyAmt);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0,   0+_PR_, 155+printDetials.length*h, '打印时间：'+nowDate() );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0,  270+_PR_, 155+printDetials.length*h, '终端编号:' + $.CheckUndefined(ZZJInfomation.Name) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, 350+_PR_, 540, '· 1 ·' );
	        ZZJPrinter.StartPrint(ID);
	        PrintBLBHintLamp();

	        var printInfo = {
	        	'INVOICEPRINTED' : 1,
	        	'HOSPAYID'       : _data.RecipesInfo.HISPayNo
	        }
	        $.extend(CardInfo,{'PrintInfo' : printInfo});
	        console.log(CardInfo);
	        AJAX.Business.UpdatePrintlog( JSON.stringify(CardInfo), function(ret){     // 更新打印次数
	        	console.log(ret);
	        },function(ret){
	        	console.log(ret);
	        }, function(ret){
	        	console.log(ret)
	        });
		} else { // 打印机异常
			$.Speak(ID);
			$.Writelog(''+ HYDPRINTNAME +'打印机异常');
			$.Writelog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['返回主页'],
	        	yes: ShowMainMenu
	        });
	    }
    });
}


// 打印就诊卡并出卡
function PrintJZKAndOutCard_(_param) {
	AcsSwitch.SetAcs('M', ZKJTSD, INDICATORTYPE);               // 打开指示灯 - 就诊卡出口	
	var ResultInfo = MachineWPCX.PrintOutCart(JSON.stringify(_param));
	$.Console(ResultInfo, '发卡返回');
	setTimeout(function() {
		AcsSwitch.SetAcs('M', ZKJTSD, 0); // 打开指示灯 - 就诊卡出口
	}, 3000);
}

// 打印就诊卡并出卡
function PrintJZKAndOutCard(_PatientName) {
	console.log(_PatientName);
	AcsSwitch.SetAcs('B', ZKJTSD, INDICATORTYPE);               // 打开指示灯 - 就诊卡出口	
	ZZJPrinter.Print(ZKJNAME, 400, 200, false, function(Code, ID){
		console.log(Code);
		if (Code == 0) { // 打印机正常
			ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 24, 0, 60, 90, '.');
			ZZJPrinter.StartPrint(ID);
			setTimeout(function() {
				AcsSwitch.SetAcs('B', ZKJTSD, 0); // 打开指示灯 - 就诊卡出口
			}, 3000);
		} else { // 打印机异常
			$.Speak(ID);
			$.Writelog(ID);
			clearInterval(PrintBGDTimer);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['返回主页'],
	        	yes: ShowMainMenu
	        });
	    }
    });
}

// 自助机银联pos 数据打印
function UnionPtint() {
	var str = MachineWPOS.PrintYLPT();
	var ResultData = JSON.parse(str);
	if (ResultData.Code == 0) {				
		ZZJPrinter.Print(PTJPRINTNAME, 300, 630, false, function(Code, ID){
			if (Code == 0) { // 打印机正常
		        ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 0, ResultData.Text);
		        ZZJPrinter.StartPrint(ID);

		       	PrintPTHintLamp(); // 打印凭条提示灯
		    } else { // 打印机异常
		        $.Speak(ID);
				$.Writelog(ID);
		        $.layer({
		        	msg: ID,
		        	time: 15,
		        	btn: ['取消', '返回主页'],
		        	endExecute: false,
		        	yes: ShowMainMenu
		        });
		    }
	    });
	}		
}

/**------------------------------------------------------------------------------------------------------------------**/

// 生成并打印条码--注册
function CreateBarCodeAndPrint(card) {
	var barcode = document.createElement('img');
    var options = {
        width: 2,              //较细处条形码的宽度
        height: 80,            //条形码的宽度，无高度直接设置项，由位数决定，可以通过CSS去调整，见下
        quite: 10, 
        format: 'CODE128',
        displayValue: false,   //是否在条形码下方显示文字
        font: 'monospace', 
        textAlign: 'center', 
        fontSize: 12,
        backgroundColor:"", 
        lineColor: '#000'      //条形码颜色
    };
    JsBarcode(barcode, card.CardInfo.CardNo , options);     //原生
    // $('#barcode1').JsBarcode(str, options); //jQuery
    var randomNumber = Math.random().toString().substr(2,8);      // 随机数
    var base64 = $(barcode).attr('src');
    // console.log(base64);
    base64 = base64.split(';')[1];
    base64 = base64.split(',')[1];
	FileSystem.WriteImageFileFromBase64('D:/barcodes/base'+randomNumber+'.png', base64);

	var idcardno = $.CheckUndefined(card.PatientInfo.IDNo);
	var telphoneno = $.CheckUndefined(card.PatientInfo.Mobile);
	if(idcardno != ''){
		idcardno = idcardno.slice(0,6) + '********' + idcardno.slice(14,18);
	}
	if(telphoneno != ''){
		telphoneno = telphoneno.slice(0,3) +'****'+ telphoneno.slice(7,11);
	}
	
	ZZJPrinter.Print(PTJPRINTNAME, 300, 300, false, function(Code, ID){
    	if (Code == 0) { // 打印机正常
    		ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 50+_PR_, 0, '佛山顺德妇幼保健院');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 20+_PR_, 20, '-------------------------------');

	        var info = card.PatientInfo;
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_,  50, '姓      名：' + $.CheckUndefined(info.PatientName));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_,  70, '病历号：' + $.CheckUndefined(card.CardInfo.CardNo));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_,  90, '身份证号：' + idcardno);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_, 110, '手机号码：' + telphoneno);

			ZZJPrinter.PrintFilePicture(ID, 'D:/barcodes/base'+randomNumber+'.png', 40+_PR_, 135, 220, 80);
			ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 30+_PR_, 220, '温馨提示：请收好您的扫码凭条！' );

	        ZZJPrinter.StartPrint(ID);
	        PrintPTHintLamp();                      // 打印凭条提示灯
       	} else { // 打印机异常
	       	ThisWindow.Speak(ID);
			LogHelper.WriteLog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
	    }
    });
}

// // 挂号成功后打印凭条
function rechargeSucceed(card) {
	console.log(card);
	if (!PAYSTATUES){ //解决网络延时问题
		return;
	}
	PAYSTATUES = false;
	var tits = '门诊挂号券';
	var newtits = '';
	if(CardInfo.RegisterType == 3){
		newtits = '[加]';
	}
	if(pageType == 'YYQH'){
		tits = '预约报到券';
		newtits = '[预]';
	}
	var barcode = document.createElement('img');
    var options = {
        width: 2,              //较细处条形码的宽度
        height: 80,            //条形码的宽度，无高度直接设置项，由位数决定，可以通过CSS去调整，见下
        quite: 10, 
        format: 'CODE128',
        displayValue: false,   //是否在条形码下方显示文字
        font: 'monospace', 
        textAlign: 'center', 
        fontSize: 12,
        backgroundColor:"", 
        lineColor: '#000'      //条形码颜色
    };
    JsBarcode(barcode, card.CardInfo.CardNo , options);           // 原生
    // $('#barcode1').JsBarcode(str, options); //jQuery
    var randomNumber = Math.random().toString().substr(2,9);      // 随机数
    var base64 = $(barcode).attr('src');
    // console.log(base64);
    base64 = base64.split(';')[1];
    base64 = base64.split(',')[1];
	// console.log(base64);
	FileSystem.WriteImageFileFromBase64('D:/barcodes/base'+randomNumber+'.png', base64);

	var age = countAges(CardInfo);
	$.Writelog("调用凭条打印机");
	ZZJPrinter.Print(PTJPRINTNAME, 300, 420, false, function(Code, ID){
		if (Code == 0) { // 打印机正常
			$.Writelog("打印机正常");
			ZZJPrinter.PrintFilePicture(ID, 'D:/barcodes/base'+randomNumber+'.png', 70+_PR_, 0, 180, 50);
			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 50+_PR_, 65, '顺德区妇幼保健院');
			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 8, 0, 160+_PR_, 95, tits+'(自助)');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 20+_PR_, 105, '-------------------------------');

	        // 打印数据
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 130, '候诊号: ' + $.CheckUndefined(card.successRegister.WaitNo)+'号');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 155, '病历号: ' + $.CheckUndefined(card.CardInfo.CardNo));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 180, '姓  名: ' + $.CheckUndefined(card.PatientInfo.PatientName)+ ' 性别：'+ (card.PatientInfo.Gender=='1'?'男':'女')+' 年龄：'+age );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 205, '金 额: ￥' + $.CheckUndefined(card.Doct.PriceList[0].Price));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 230, '费用类型: '+ $.CheckUndefined(card.successRegister.PatType));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 255, '就诊医生: '+ $.CheckUndefined(card.Doct.DoctName));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 280, '就诊科室: '+ $.CheckUndefined(card.Dept.DeptName));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 305, '就诊地址: '+ $.CheckUndefined(card.successRegister.Address));
	        if(card.Dept.DeptCode == "0707"){
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 330, '预计就诊:'+ '请合理安排就诊时间' );
		        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 345, '终端编号:' + $.CheckUndefined(ZZJInfomation.Name) );
	        }else{
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 330, '就诊时间: '+newtits+card.Doct.SeeTimeBetween.StartTime.slice(0,16)+'-'+card.Doct.SeeTimeBetween.EndTime.slice(11,16));
	        	if( $.CheckUndefined(card.Dept.DeptName) == "门诊产科"){
		      		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 350, '温馨提示: 每次产检前，请务必到门诊三楼护士站测血压、体重' );
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 365, '预计就诊:'+ '请合理安排就诊时间' );
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 380, '终端编号:' + $.CheckUndefined(ZZJInfomation.Name) );
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 395, '打印时间:' + $.CheckUndefined( nowDate() ) );
		      	}else{
		      		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 350, '预计就诊:'+ '请合理安排就诊时间' );
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 365, '终端编号:' + $.CheckUndefined(ZZJInfomation.Name) );
			        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 380, '打印时间:' + $.CheckUndefined( nowDate() ) );
		      	}
	        }       
	        ZZJPrinter.StartPrint(ID);
	        PrintPTHintLamp();               // 打印凭条提示灯
	   	} else {                             // 打印机异常
	   		$.Writelog("打印机异常");
	       	ThisWindow.Speak(ID);
			LogHelper.WriteLog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 10,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
	    }
	});
}

//  // 线上取号成功后打印凭条
function rechargeSucceedOnline(card) {
	console.log(card);
	if (!PAYSTATUES){ //解决网络延时问题
		return;
	}
	PAYSTATUES = false;
	var barcode = document.createElement('img');
    var options = {
        width: 2,              //较细处条形码的宽度
        height: 80,            //条形码的宽度，无高度直接设置项，由位数决定，可以通过CSS去调整，见下
        quite: 10, 
        format: 'CODE128',
        displayValue: false,   //是否在条形码下方显示文字
        font: 'monospace', 
        textAlign: 'center', 
        fontSize: 12,
        backgroundColor:"", 
        lineColor: '#000'      //条形码颜色
    };
    console.log( card.CardInfo.CardNo );
    JsBarcode(barcode, card.CardInfo.CardNo , options);     //原生
    var randomNumber = Math.random().toString().substr(2,9);      // 随机数
    // $('#barcode1').JsBarcode(str, options); //jQuery
    var base64 = $(barcode).attr('src');
    // console.log(base64);
    base64 = base64.split(';')[1];
    base64 = base64.split(',')[1];
	// console.log(base64);
	FileSystem.WriteImageFileFromBase64('D:/barcodes/base'+randomNumber+'.png', base64);

	var age =countAges(CardInfo);
	$.Writelog("调用凭条打印机");
	ZZJPrinter.Print(PTJPRINTNAME, 300, 420, false, function(Code, ID){
		if (Code == 0) { // 打印机正常
			$.Writelog("打印机正常");
			ZZJPrinter.PrintFilePicture(ID, 'D:/barcodes/base'+randomNumber+'.png', 70+_PR_, 0, 180, 50);

			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 50+_PR_, 65, '顺德区妇幼保健院');
			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 8, 0, 160+_PR_, 95, '线上挂号券(自助)');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 20+_PR_, 105, '-------------------------------');

	        // 打印数据  card.successInfo.WaitNo
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 130, '候诊号: '+ $.CheckUndefined(card.successInfo.WaitCount)+'号');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 155, '病历号: '+ $.CheckUndefined(card.CardInfo.CardNo));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 180, '姓  名: '+ $.CheckUndefined(card.PatientInfo.PatientName)+ ' 性别：'+ (card.PatientInfo.Gender=='1'?'男':'女')+' 年龄：'+age );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 205, '支付状态：'+ $.CheckUndefined(card.successInfo.Msg));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 230, '费用类型: '+ $.CheckUndefined(card.successInfo.PatType));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 255, '就诊医生: '+ $.CheckUndefined(card.Doct.DoctName));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 280, '就诊科室: '+ $.CheckUndefined(card.Dept.DeptName));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 305, '就诊地址: '+ $.CheckUndefined(card.successInfo.Address));
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 330, '就诊时间: '+ $.CheckUndefined(card.Doct.ExParams.RegDate));

	        if( $.CheckUndefined(card.Dept.DeptName) == "门诊产科"){
	      		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 350, '温馨提示: 每次产检前，请务必到门诊三楼护士站测血压、体重' );
		        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 365, '预计就诊:'+ '请合理安排就诊时间' );
		        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 380, '终端编号:' + $.CheckUndefined(ZZJInfomation.Name) );
		        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 395, '打印时间:' + $.CheckUndefined( nowDate() ) );
	      	}else{
	      		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 350, '预计就诊:'+ '请合理安排就诊时间' );
		        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 365, '终端编号:' + $.CheckUndefined(ZZJInfomation.Name) );
		        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 380, '打印时间:' + $.CheckUndefined( nowDate() ) );
	      	}

	        ZZJPrinter.StartPrint(ID);
	        $.Writelog("绘制完毕开始打印");
	        PrintPTHintLamp();                            // 打印凭条提示灯
	   	} else {                                          // 打印机异常
	   		$.Writelog("打印机异常");
	       	ThisWindow.Speak(ID);
			LogHelper.WriteLog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
	    }
	});
	// AcsSwitch.SetAcs('B', 3, 0);
}

// // 处方缴费后打印凭条
function rechargeSucceedPrint(card) {
	console.log(card);
	if (!PAYSTATUES){ //解决网络延时问题
		return;
	}
	PAYSTATUES = false;
	var barcode = document.createElement('img');
    var options = {
        width: 2,              //较细处条形码的宽度
        height: 80,            //条形码的宽度，无高度直接设置项，由位数决定，可以通过CSS去调整，见下
        quite: 10, 
        format: 'CODE128',
        displayValue: false,   //是否在条形码下方显示文字
        font: 'monospace', 
        textAlign: 'center', 
        fontSize: 12,
        backgroundColor:"", 
        lineColor: '#000'      //条形码颜色
    };
    JsBarcode(barcode, card.CardInfo.CardNo , options);            //原生
    // $('#barcode1').JsBarcode(str, options); //jQuery
    var randomNumber = Math.random().toString().substr(2,10);      // 随机数
    var base64 = $(barcode).attr('src');
    // console.log(base64);
    base64 = base64.split(';')[1];
    base64 = base64.split(',')[1];
	// console.log(base64);
	FileSystem.WriteImageFileFromBase64('D:/barcodes/base'+randomNumber+'.png', base64);

	var age = countAges(CardInfo);
	var tot=0,shebao=0,pay=0;
	var chufangxuhao='';
	for(var i=0;i<card.successRegister.RecipesInfo.length;i++){
		tot += Number(card.successRegister.RecipesInfo[i].Total);
		shebao += Number(card.successRegister.RecipesInfo[i].SocietyAmt);
		pay += Number(card.successRegister.RecipesInfo[i].SelfAmt);
		chufangxuhao += card.successRegister.RecipesInfo[i].RecipesID+',';
	}
	var h = 25;
	var len = card.successRegister.ResultDataList.length;
	var fapiao = card.successRegister.InvoiceNo.split(',');
	var beizhu = card.successRegister.ResultMark.split('\r\n');

	$.Writelog("调用凭条打印机");
	ZZJPrinter.Print(PTJPRINTNAME, 300, 520+h*len+h*fapiao.length+h*beizhu.length, false, function(Code, ID){
		if (Code == 0) { // 打印机正常
			$.Writelog("打印机正常");
			ZZJPrinter.PrintFilePicture(ID, 'D:/barcodes/base'+randomNumber+'.png', 60+_PR_, 0, 180, 50);

			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 17, 0, 50+_PR_, 65, '顺德区妇幼保健院');
			ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 8, 0, 135+_PR_, 100, '门诊收费券(自助)请妥善保管');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 15, 0, 20+_PR_, 105, '-------------------------------');

	        // 打印数据
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 130, '流水号: ');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, 20+_PR_, 155, $.CheckUndefined( card.SerialNumber) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 180, '终端号: ' + $.CheckUndefined(ZZJInfomation.Name) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 205, '病历号: ' + $.CheckUndefined(card.CardInfo.CardNo) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 230, '姓  名: '+ card.PatientInfo.PatientName+ ' 性别：'+ (card.PatientInfo.Gender=='1'?'男':'女')+' 年龄：'+age);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 255, '总金额:￥' +tot.toFixed(2) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 280, '社保支付:￥ '+shebao.toFixed(2) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 305, '交易金额: ￥' +pay.toFixed(2) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 330, '处方号: ' +chufangxuhao);

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 355, '发票号: ');	        
	        for(var j=0;j<fapiao.length;j++){
	        	(function(j){
					ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 55+_PR_, 380+h*j, fapiao[j]);
				})(j)
	        }

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 380+h*fapiao.length, '发票金额: ');
			for(var k=0;k<len;k++){
				(function(k){
					var name = card.successRegister.ResultDataList[k].RecipeType;
					var xiaofei = Number(card.successRegister.ResultDataList[k].Total);
					ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 20+_PR_, 405+h*k+h*fapiao.length, name+'：￥'+xiaofei);
				})(k)
			}

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 20+_PR_, 405+h*len+h*fapiao.length, '备注:' );
	        for(var l=0;l<beizhu.length;l++){
	        	(function(l){
	        		ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, 20+_PR_, 430+h*len+h*fapiao.length+h*l, beizhu[l]);
	        	})(l)
			}

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 430+h*len+h*fapiao.length+h*beizhu.length, '交易时间：'+ nowDate());
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 455+h*len+h*fapiao.length+h*beizhu.length, '温馨提示：请收妥善保管您的收费凭条' );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, 20+_PR_, 465+h*len+h*fapiao.length+h*beizhu.length, '' );

	        ZZJPrinter.StartPrint(ID);
	        PrintPTHintLamp();               // 打印凭条提示灯
	   	} else {                             // 打印机异常
	   		$.Writelog("打印机异常");
	       	ThisWindow.Speak(ID);
			LogHelper.WriteLog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
	    }
	});
	// AcsSwitch.SetAcs('B', 3, 0);
}

// 病历本条形码打印
function blbpingtiao(card){
	console.log(card);
	console.log(PAYSTATUES);
	if (!PAYSTATUES){ //解决网络延时问题
		return;
	}
	PAYSTATUES = false;

	var barcode = document.createElement('img');
    var options = {
        width: 2,              //较细处条形码的宽度
        height: 80,            //条形码的宽度，无高度直接设置项，由位数决定，可以通过CSS去调整，见下
        quite: 10, 
        format: 'CODE128',
        displayValue: false,   //是否在条形码下方显示文字  font: 'monospace',
        font: 'monospace', 
        textAlign: 'center', 
        fontSize: 20,
        backgroundColor:"", 
        lineColor: '#000'      //条形码颜色
    };
    JsBarcode(barcode, card.CardInfo.CardNo , options);           // 原生
    // $('#barcode1').JsBarcode(str, options);                    // jQuery
    var randomNumber = Math.random().toString().substr(2,11);     // 随机数
    var base64 = $(barcode).attr('src');
    // console.log(base64);
    base64 = base64.split(';')[1];
    base64 = base64.split(',')[1];
	// console.log(base64);
	FileSystem.WriteImageFileFromBase64('D:/barcodes/base'+randomNumber+'.png', base64);

    console.log("调用打印...");
    ZZJPrinter.Print("Godex G500", 212, 132, false, function (Code, ID) {
        // console.log("打印回调:" + Code + ID);
        if (Code == 0) {
            //打印文本:ID 字体 大小 颜色 X Y 内容
            // ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 16, 30, 0, 25, "测试凭条!");
            // 打印图片  id 字体 起始x 起始y 宽度 高度
            ZZJPrinter.PrintFilePicture(ID, 'D:/barcodes/base'+randomNumber+'.png', 3+_PR_, 40, 150, 50);
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 8, 0, 40+_PR_, 85, $.CheckUndefined(card.CardInfo.CardNo) );
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, 100, '佛山顺德区妇幼保健院');
            console.log("绘制完毕!");

            ZZJPrinter.StartPrint(ID);         //绘制完毕,开始打印
            console.log("开始打印!");
            PrintBLBPTHintLamp();
        }else{
        	ThisWindow.Speak(ID);
			LogHelper.WriteLog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 10,
	        	btn: ['取消', '返回主页'],
	        	endExecute: false,
	        	yes: ShowMainMenu
	        });
        }
        console.log("回调返回!");
    });
};

// 条形码打印灯提示
function PrintBLBPTHintLamp() {
	AcsSwitch.SetAcs('B', 1, 1);                  // 病历提示开启
	clearInterval(PRINTTIMER);
	PRINTTIMER = setTimeout(function() {
		AcsSwitch.SetAcs('B', 1, 0);              // 病历提示灯关闭
	}, 3000);
}

// 病历本打印灯提示
function PrintBLBHintLamp() {
	AcsSwitch.SetAcs('B', 4, 1);                  // 病历提示开启
	clearInterval(PRINTTIMER);
	PRINTTIMER = setTimeout(function() {
		AcsSwitch.SetAcs('B', 4, 0);              // 病历提示灯关闭
	}, 9000);
}

// 根据身份证号 患者信息上的身份证号计算年龄
function countAges(cardinfo){
	var cardid;
	if(cardinfo.PatientInfo.IDNo == '' || cardinfo.PatientInfo.IDNo == undefined || cardinfo.PatientInfo.IDNo.length < 17){
        cardid = cardinfo.PatientInfo.Birthday.slice(0,4)+cardinfo.PatientInfo.Birthday.slice(5,7)+cardinfo.PatientInfo.Birthday.slice(8,10);
    }else if(cardinfo.PatientInfo.IDNo.length>17){
		cardid = cardinfo.PatientInfo.IDNo.slice(6,14);
	}
    console.log(cardid);
    var nowdate = nowDate().slice(0,10);
    console.log(nowdate);
    var age = Number( nowdate.slice(0,4) ) - Number( cardid.slice(0,4) );            // 计算岁数
    if(age < 0){
        age = 0 + '岁';   
        return age;   
    }else if(age == 0){                                          // 同年分 计算几个月大
        var oldmonth = cardid.slice(4,6);
        var nowmonth = nowdate.slice(5,7);
        var months = Number(nowmonth) - Number(oldmonth);
        if(months <= 0){                                         // 同年分同月 计算几天大
        	var oldday = cardid.slice(6,8);
        	var nowday = nowdate.slice(8,10);
        	var days = Number(nowday) - Number(oldday);
        	return days + '天'
        }else{
        	months = months + '个月';
        	return months;
        }
    }else{                        
    	age = age + '岁';
    	return age;
    }
}
//当前时间
function nowDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var days = date.getDate();
    days = days < 10 ? '0' + days : days;
    return year+'-'+month+'-'+days+' '+date.toTimeString().substring(0, 8)
}

// 打印发票
function fapiaoPrinter(card){
	var card = card;
	var printer = "EPSON LQ-80KFII ESC/P2";                      // 打印机名称 
	var fapiaoying;                                              // 发票印刷号数字部分
	var batch;                                                   // 剩余发票数量
	var Invoiceprintnums;                                        // 更新印刷号参数
	var invioceprintnumheader;                                   // 印刷号抬头字母
	var flag = false;                                            // 数量判断标志符
	var id;
	var localhostNo = FileSystem.ReadAllText('D:/invoiceprintnums.txt');  // 本地存储的上一张已打印的发票印刷号
	AJAX.Business.SelectInvoicePrintingNum(JSON.stringify({"zzjid":ZZJInfomation.ZZJID,"useto":0}) , function(ret){
		console.log(ret);
	}, function(value){
		console.log(value);
		if(value.Code == 0){
			if(value.Invoiceprintnum[0].printing_success){                          // true 代表已经打印的印刷号
				fapiaoying = Number(value.Invoiceprintnum[0].invioceprintnum) + 1;  // 新的印刷号 未打印过
				batch = value.Invoiceprintnum[0].batch - 1 ;
				invioceprintnumheader = value.Invoiceprintnum[0].invioceprintnumheader;	
			}else{
				fapiaoying = Number(value.Invoiceprintnum[0].invioceprintnum);      // flase 表示这个印刷号未打印过
				invioceprintnumheader = value.Invoiceprintnum[0].invioceprintnumheader;
				batch = value.Invoiceprintnum[0].batch;
			}
			if( batch >= 3 ){
				flag = true;
			}
			fapiaoying = InvoiceprintnumLength(fapiaoying);                         // 判断印刷号的长度(长度必须是8)
			FileSystem.WriterText('D:/invoiceprintnums.txt',fapiaoying);            // 将印刷号写入本地

			Invoiceprintnums = { "Invoiceprintnum" : [{
    			"zzjid"                : ZZJInfomation.ZZJID,
    			"hospayid"             : card.currentyChoisefp.Print_Basic.HOSPAYID,
    			"invioceprintnum"      : fapiaoying,
    			"batch"                : batch,
    			"printing_success"     : false,
    			"last_printing_time"   : '',
    			"invioceprintnumheader": invioceprintnumheader,
    			"id"                   : 0
    		}]};
		    // console.log("更新印刷号参数",Invoiceprintnums);
		    if(flag == true){
		    	$.Writelog("当前印刷号:"+fapiaoying);
		    	AJAX.Business.UpdateInvoicePrintingNum(JSON.stringify(Invoiceprintnums), function(ret){
			    	// console.log(ret);
			    }, function(value){
			    	console.log(value);
			    	if(value.Code == 0){ 
			    		$.Writelog("第一次更新印刷号："+value.Msg);
			    		Invoiceprintnums.Invoiceprintnum[0].invioceprintnumheader = value.Invoiceprintnum[0].invioceprintnumheader;
			    		Invoiceprintnums.Invoiceprintnum[0].id = value.Invoiceprintnum[0].id;
						card.currentyChoisefp.PrintNo = fapiaoying;
						var InvoiceInfo = [];
					    InvoiceInfo.push(card.currentyChoisefp);
					    $.extend(card ,{"InvoiceInfo" : InvoiceInfo});
					    // console.log(card);
						var sexlen = 0;
						if(card.PatientInfo.Gender == 1){
							sexlen = 0;
						}else if(card.PatientInfo.Gender == 2){
							sexlen = 35;
						}
						var invoiceDate = card.currentyChoisefp.InvoiceDate;
						var zifu = "√";
						var jiesuan = card.currentyChoisefp.Paytype;
						if(jiesuan == undefined){jiesuan = ""};
						var money = card.currentyChoisefp.TOTALAMT;
						var moneyDX = currentMoney(money);
						var y = 18;
						var x = 0;
						$.Writelog("开始调用发票打印写入数据");
						ZZJPrinter.Print(printer, 900, 420, false, function(Code, ID){
							if (Code == 0) {                                         // 打印机正常
								ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  8, 0, x+ 35+_PR_,  y+20, ''+card.currentyChoisefp.Print_Basic.HOSPAYID );    // 发票流水
								ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  8, 0, x+390+_PR_,  y+38, '非盈利性医院' );                          // 医院类型
								ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  8, 0, x+465+_PR_,  y+32, ''+invoiceDate.slice(0,4) );               // 年
								ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  8, 0, x+520+_PR_,  y+32, ''+invoiceDate.slice(5,7) );               // 月
								ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  8, 0, x+580+_PR_,  y+32, ''+invoiceDate.slice(8,10) );              // 日
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+ 40+_PR_,  y+62, ''+card.PatientInfo.PatientName );         // 患者姓名
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+200+_PR_,  y+62, ''+zifu );                                 // 门诊
						      	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+ 40+_PR_+sexlen, y+87, ''+zifu );                           // 患者性别
						      	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+220+_PR_,  y+92, ''+card.currentyChoisefp.SBPAYAMT );       // 优惠金额
						      	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+380+_PR_,  y+92, ''+card.currentyChoisefp.SELFAMT );        // 自费金额
						      	ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, x+525+_PR_,  y+92, ''+jiesuan);                               // 结算类型

						        var h=25;
						        var feiyongxq = card.currentyChoisefp.PayAmt_Basic;
						        if (feiyongxq.length>0) {
							        for(var i=0;i<feiyongxq.length;i++){
							        	(function(i){
											ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+ 0+_PR_, y+142+h*i, ''+feiyongxq[i].FEETYPE );
											ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+70+_PR_, y+142+h*i, ''+feiyongxq[i].TOTALAMT );
										})(i)
							        }
						    	};

						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, x+480+_PR_, y+247, '' + money);                                // 数字金额
						        var xlen = 40;
						        for(var j=0;j<moneyDX.length;j++){
						        	(function(j){
						        		ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, x+130+ xlen*j +_PR_, y+245, '' + moneyDX[j]);          // 大写汉字
						        	})(j)
						        }
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, x+520+_PR_, y+282, 'KL'+card.currentyChoisefp.PrintNo);        // 发票印刷号
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, x+300+_PR_, y+282, '注：请妥善保管，遗失不补');                // 备注
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, x+380+_PR_, y+320, '' + card.currentyChoisefp.Cashierid);      // 收款人id

						        ZZJPrinter.PrintFilePicture(ID, 'D:/fpyz/fuyoubk.png', x+40+_PR_, 263+y, 80, 80);                              // 盖章图位置
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 7, 0,  x+48+_PR_, y+265, '广东医科大学' );
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 7, 0,  x+48+_PR_, y+280, '顺德妇女儿童' );
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 7, 0,  x+48+_PR_, y+295, '医院(佛山市顺' );
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 7, 0,  x+41+_PR_, y+310, '德区妇幼保健院)' );
						        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 7, 0,  x+52+_PR_, y+325, '收费专用章' );
						        ZZJPrinter.StartPrint(ID);                      // 开始打印        
						        PrintBLBHintLamp();                             // 打印提示灯闪烁  
						        $.Writelog("发票打印调用完成"); 
						        
						        console.log(card);                              //  更新传参
						        AJAX.Business.UpdateInvoicePrintNum( JSON.stringify(card) ,function(ret){                 // 更新打印次数 his数据
						        	// console.log(ret);
						        },function(ret){
						        	console.log(ret);
						        	$.Writelog("his更新打印次数"+ret.Msg);
						        },function(error){
						        	console.log(error);
						        });
								var doubleInvoice = Invoiceprintnums;
						        doubleInvoice.Invoiceprintnum[0].printing_success = true;
						        console.log( "第二次更新印刷号：", doubleInvoice );
						        AJAX.Business.UpdateInvoicePrintingNum(JSON.stringify(doubleInvoice), function(ret){     // 更新打印次数 自己数据库
						        	// console.log(ret);
						        }, function(value){
						        	console.log(value);
						        	$.Writelog("第二次更新印刷号："+value.Msg);
						        }, function(error){
						        	console.log(error);
						        	$.Writelog("UpdateInvoicePrintingNum 接口异常第二次调用");
						        });
							} else {                                                                                    
								$.Speak(ID);
								$.Writelog(''+ printer +'打印机异常');
								$.Writelog(ID);
						        $.layer({
						        	msg: ID,
						        	time: 15,
						        	btn: ['返回主页'],
						        	yes: ShowMainMenu
						        });
						    }
					    });
			    	}else{
			    		console.log(value.Msg);
			    		$.Writelog("打印发票插入数据库更新失败");
			    		$.Writelog(value.Msg);
			    		$.layer({
							msg : "打印发票插入数据库更新失败",
							btn:["确定"],
							type: 1,
							time: 6,
							yes:function(){ judgingLoginPrinter() }
						})
			    	}
			    }, function(error){
			    	console.log(error);
			    	$.Writelog("UpdateInvoicePrintingNum 接口异常第一次调用");
			    });
		    }else{
		    	$.Writelog("打印机发票已用完,请联系服务人员添加发票");
		    	$.layer({
					msg:"打印机发票已用完,请联系服务人员添加发票",
					time:10,
					type: 1,
					btn :["确认"],
					yes:function(){ judgingLoginPrinter() }
				})
		    }
		}else{
			$.Writelog(value.Msg);
			$.layer({
				msg : value.Msg,
				btn:["确定"],
				type: 1,
				time: 6,
				yes:function(){ judgingLoginPrinter() }
			})
		}
	}, function(error){
		console.log(error);
		$.Writelog("SelectInvoicePrintingNum 接口异常");
	});
}


 
var pagenum = 1;
var printlen = 1;
var page = 1;
// 打印化验单 - 消费明细
function PrintHYD_change(_data) {
	console.log(_data);
	var x = 80;
	printlen = parseInt(_data.RecipesInfo.Details.length/15) + 1;
	if(page == 2){
		printlen = parseInt(_data.RecipesInfo.Details.length/15) + 2;
	}
	if(page == 3){
		printlen = parseInt(_data.RecipesInfo.Details.length/15) + 3;
	}
	console.log(printlen);
	ZZJPrinter.Print(HYDPRINTNAME, 600, 900, false, function(Code, ID){
		// console.log(Code);
		if (Code == 0) { // 打印机正常
			ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 17, 0, x+180+_PR_,  0, '广东佛山市顺德区妇幼保健医院');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 16, 0, x+235+_PR_, 30, '门诊病人费用明细清单');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+ 14+_PR_, 64, '姓名：'  + _data.PatientInfo.PatientName );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+140+_PR_, 64, '日期：'  + _data.RecipesInfo.PayDate );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+420+_PR_, 64, '病历号：'+ _data.CardInfo.CardNo );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+610+_PR_, 64, '科室：'  + _data.RecipesInfo.RegisterInfo.Dept.DeptName );

	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+ 20+_PR_, 100, '项目编号');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+120+_PR_,  90, '医疗服务价格项目、药品（通用名）');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+155+_PR_, 110, '或一次性医用耗材名称');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+370+_PR_, 100, '规格');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+460+_PR_, 100, '单价￥');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+510+_PR_, 100, '数量');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+570+_PR_, 100, '单位');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+630+_PR_, 100, '金额￥');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+690+_PR_, 100, '自费额￥');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+  0+_PR_, 120, '-------------------------------------------------------------------------------------------------------------------------------');

	        var h=20;
	        $.each(_data.RecipesInfo.Details, function(n,val){
	        	if(n <=15){
	        		page = 1;
	        		pagenum = 1;
	        		console.log(printlen);
	        	}
	        	if(n > 15){
					_data.RecipesInfo.Details = _data.RecipesInfo.Details.slice(16, _data.RecipesInfo.Details.length);
					setTimeout(function() {
						page = 2;
						pagenum = 2;
						PrintHYD_change(_data);
                    }, 300);
                    return false;
	        	}
	        	if(n > 30){
					_data.RecipesInfo.Details = _data.RecipesInfo.Details.slice(31, _data.RecipesInfo.Details.length);
					setTimeout(function() {
						page = 3;
						pagenum = 3;
						PrintHYD_change(_data);
                    }, 300);
                    return false;
	        	}
	        	ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+  0+_PR_, 120+h, ''+val.Code );
				ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+120+_PR_, 120+h, ''+val.Name );
				ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+350+_PR_, 120+h, ''+val.Spec ); 
				ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+470+_PR_, 120+h, ''+val.Price );
				ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+520+_PR_, 120+h, ''+val.Count );
				ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+580+_PR_, 120+h, ''+val.Unit );
				ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+635+_PR_, 120+h, ''+val.Total );
				ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+690+_PR_, 120+h, ''+val.Selfamt );
				h += 20;
	        });

			ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+  0+_PR_, 135+17*20, '-------------------------------------------------------------------------------------------------------------------------------');
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+  0+_PR_, 135+18*20, '说明：结算方式为'+_data.RecipesInfo.PayTypeName);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+270+_PR_, 135+18*20, '总金额合计：'+_data.RecipesInfo.Total);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+440+_PR_, 135+18*20, '自费总金额：'+_data.RecipesInfo.SelfAmt);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 10, 0, x+610+_PR_, 135+18*20, '优惠总金额：'+_data.RecipesInfo.SocietyAmt);
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, x+  0+_PR_, 155+18*20, '打印时间：'+nowDate() );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, x+270+_PR_, 155+18*20, '终端编号:' + $.CheckUndefined(ZZJInfomation.Name) );
	        ZZJPrinter.PrintString(ID, DTPTTYPEFACE,  9, 0, x+350+_PR_, 540,  "第"+pagenum+"页 共"+printlen+"页");
	        ZZJPrinter.StartPrint(ID);
	        PrintBLBHintLamp();

	        var printInfo = {
	        	'INVOICEPRINTED' : 1,
	        	'HOSPAYID'       : _data.RecipesInfo.HISPayNo
	        }
	        $.extend(CardInfo,{'PrintInfo' : printInfo});
	        console.log(CardInfo);
	        AJAX.Business.UpdatePrintlog( JSON.stringify(CardInfo), function(ret){     // 更新打印次数
	        	console.log(ret);
	        },function(ret){
	        	console.log(ret);
	        }, function(ret){
	        	console.log(ret)
	        });
		} else {                                                                       // 打印机异常
			$.Speak(ID);
			$.Writelog(''+ HYDPRINTNAME +'打印机异常');
			$.Writelog(ID);
	        $.layer({
	        	msg: ID,
	        	time: 15,
	        	btn: ['返回主页'],
	        	yes: ShowMainMenu
	        });
	    }
    });
}

// 判断发票印刷号的长度  设置成8位数长度字符串
function InvoiceprintnumLength(_data){
	var data = "" + _data;
	if(_data.length == 7){
		data = "0" + _data;
	}
	if(_data.length == 6){
		data = "00" + _data;
	}
	if(_data.length == 5){
		data = "000" + _data;
	}
	if(_data.length == 4){
		data = "0000" + _data;
	}
	if(_data.length == 3){
		data = "00000" + _data;
	}
	if(_data.length == 2){
		data = "000000" + _data;
	}
	if(_data.length == 1){
		data = "0000000" + _data;
	}
	return data;
}