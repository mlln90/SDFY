/*
 * 2018-05-21
 * Evan
 */

/*科室数据*/
function GetDepartmentsData() {
    var data = [];
    var len = Math.ceil(Math.random()*350);
    for (var i = 0; i <= len; i++) {
        var letter = $.GetRandomLetter(3);
        var obj = {
            id: i,
            Name: letter + '科室',
            surplus: Math.ceil(Math.random()*20),
            letter: letter
        }
        data.push(obj);
    }
    return data;
}

/* 科室信息 */
function GetMedDepartments() {
	var data = [];
	var len = Math.ceil(Math.random()*35);
	for (var i = 0; i <= len; i++) {
		var letter = $.GetRandomLetter(3);
		var obj = {
			Id: i,
			letter: letter,
			Name: letter + '科室',
			DepType: letter + '科室类型',
			DepDoc: letter + '战天狼',
			info: []
		}
		var ls = Math.ceil(Math.random()*20);
		for (var j = 0; j <= ls; j++) {
			var p = '消化内科教授、主任医师，医学博士、理学博士，博士导师，老年示范病房主任。1982年毕业于北京医科大学医疗系，1982年毕业于北京医科大学，1990年北京医科大学第三医院消化科获医学博士学位，1995年日本九州大学医学部获医学理学博士学位（Ph.D）。2011年赴美国约翰霍普金斯老年医学科学习3个月。'
			obj.info.push(p);
		}
		data.push(obj);
	}
	return data;
}

/* 医生信息 */
function GetMedDoctors() {
	var data = [];
	var len = Math.ceil(Math.random()*35);
	for (var i = 0; i <= len; i++) {
		var letter = $.GetRandomLetter(3);
		var type = Math.ceil(Math.random()*3);
		var gree = Math.ceil(Math.random()*2);
		var price = (Math.random()*5).toFixed(2) * 1;
		var obj = {
			Id: i,
			letter: letter,
			Name: letter + '医生姓名',
			DocName: letter + '医生姓名',
			DepName: letter + '科室',
			Position: '位置',
			SeqCode: Math.ceil(Math.random()*200),
			Date: $.GetCurrentTime(3),
			Noon: Math.ceil(Math.random()*3),
			receiptNo: Math.floor(Math.ceil(Math.random()*10000) + 10000000),
			time: '8:00 - 12:00',
			reged: Math.ceil(Math.random()*30),
			price: price,
			TotalFee: price,
			Doctype: ['副教授', '教授', '主治医师'][type],
			Degree: ['博士生导师', '博士后导师', '不知道什么导师'][gree],
			Visit: '周一上午，周三全天',
			imgSrc: 'assets/images/bg/doctor-img.png',
			imgSrcw: 'assets/images/bg/doctor-img-white.png',
			info: []
		}
		var ls = Math.ceil(Math.random()*20);
		for (var j = 0; j <= ls; j++) {
			var p = '从事消化内科临床工作近30年，老年医学6年。任老年医学科主任5年。曾先后任内科副主任、国际医疗部主任。有丰富的内科学知识、消化内科及消化内镜检查的临床经验；对疑难病例和老年患者尤为关注。发表文章120余篇。'
			obj.info.push(p);
		}
		data.push(obj);
	}
	return data;
}




/*缴费数据*/
function GetPayments() {
	var data = [];
	var len = Math.ceil(Math.random()*35);
	for (var i = 0; i <= len; i++) {
		var letter = $.GetRandomLetter(3);
		var type = Math.ceil(Math.random()*3) - 1;
		var cost = (Math.random()*2).toFixed(2) * 1;
		var obj = {
			Id: i,
			DocName: letter + '医生',
			Date: $.GetCurrentTime(3, null, '.'),
			Cost: cost,
			DeptName: '科室名称凑数字',
			Position: '位置凑数字',
			window: '发药窗口',
			prescriptionType: ['检查费', '诊疗费', '不知道什么费'][type],
			prescriptionAmount: cost,
			Receipt: Math.floor(Math.ceil(Math.random()*10000) + 10000000),
			data: []
		}
		var ls = Math.ceil(Math.random()*15);
		for (var j = 0; j <= ls; j++) {
			var letter = $.GetRandomLetter(ls);
			var count = Math.ceil(Math.random()*3);
			var Unit = (Math.random()*2).toFixed(2) * 1;
			var objs = {
				ItemName: letter + '项目',
				Unit: Unit,
				Count: count,
				Total: Unit * count,
				Type: '类型' + j
			}
			obj.data.push(objs);
		}
		data.push(obj);
	}
	return data;
}


/* 打印数据 */
function GetPrintlists() {
	var data = [];
	var len = Math.ceil(Math.random()*35);
	for (var i = 0; i <= len; i++) {
		var obj = {
			Id: i,
			Date: $.GetCurrentTime(3, null, '.'),
			DeptName: $.GetRandomLetter(3) + '科室',
			DocName: $.GetRandomLetter(3) + '医师',
			ItemName: $.GetRandomLetter(3) + '检测项目',
			Cost: (Math.random()*200).toFixed(2) * 1
		}
		data.push(obj);
	}
	return data;
}

/* 清单 */
function GetInventorys() {
	var data = [];
	var len = Math.ceil(Math.random()*35);
	for (var i = 0; i <= len; i++) {
		var st = Math.ceil(Math.random()*2) - 1;
		var sts = Math.ceil(Math.random()*2) - 1;
		var count = Math.ceil(Math.random()*3);
		var Unit = (Math.random()*2).toFixed(2) * 1;
		var obj = {
			Id: i,
			Date: $.GetCurrentTime(3, null, '.'),
			CostType: ['挂号费', '检查费', '化疗费', '不知道的费'][st],
			DeptName: $.GetRandomLetter(3) + '科室',
			DocName: $.GetRandomLetter(3) + '医师',
			ItemName: $.GetRandomLetter(3) + '项目',
			Cost: (Math.random()*200).toFixed(2) * 1,
			Receipt: Math.floor(Math.ceil(Math.random()*10000) + 10000000),
			Unit: Unit,
			Count: count,
			Total: Unit * count,
			TotalAmount: Unit * count,
			InvItemS: [],
		}
		var l = Math.ceil(Math.random()*12);
		for (var k = 0; k <= l; k++) {
			var ls = Math.ceil(Math.random()*30);
			var count = Math.ceil(Math.random()*3);
			var Unit = (Math.random()*2).toFixed(2) * 1;
			obj.InvItemS.push({
				ItemName: $.GetRandomLetter(ls) + '项目名称',
				Unit: Unit,
				Count: count,
				Total: Unit * count,
			})
		}
		data.push(obj);
	}
	return data;
}

/* _type 类型 0 - 药品 1 - 非药品*/
function GetDrugs(_type) {
	var data = [];
	for (var i = 0; i < 1000; i++) {
		var letter = $.GetRandomLetter(3);
		var num = Math.ceil(Math.random()*120);
		var obj;
		if (_type == 0) {
			obj = {
				letter: letter,
				Name: letter + '药品名称' + i,
				Serial: Math.ceil(Math.random()*100000000) + 1000000000,
				Price: (Math.random()*350).toFixed(2),
				Unit: ['盒', '支', '片', '瓶'][Math.ceil(Math.random()*4) - 1] + '(' + num + ')',
				Size: (Math.random()*50).toFixed(2) + 'mg*' + num,
				Vender: letter + '厂家'
			}
		} else {
			obj = {
				letter: letter,
				Name: letter + '项目名称' + i,
				Price: (Math.random()*350).toFixed(2),
				Serial: Math.ceil(Math.random()*100000000) + 1000000000,
				Unit: ['次', '次/科', '片', '项'][Math.ceil(Math.random()*4) - 1],
				Size: (Math.random()*50).toFixed(2) + 'mg*' + num,
				Code: $.GetRandomLetter(13),
				Scope: letter + '范围'
			}
		}
		data.push(obj);
	}
	return data;
}

/* 体检数据 */
function GetPhysicals() {
	var data = [], len = Math.ceil(Math.random()*100);
	for (var i = 0; i <= len; i++) {
		var letter = $.GetRandomLetter(3);
		var gree = Math.ceil(Math.random()*2);
		data.push({
			letter: letter,
			Date: $.GetCurrentTime(3, null, '.'),
			Type: ['体检', '化验', '不知道什么类型'][gree],
			ItemName: letter + '项目名称' + i,
			DoctorName: '医生名称' + i,
			Price: (Math.random()*350).toFixed(2),
		});
	}
	return data;
}

/* 满意度调查 */
function GetOptions() {
	var data = [], len = Math.ceil(Math.random()*50);
	for (var i = 0; i <= len; i++) {
		var letter = $.GetRandomLetter(17);
		data.push({
			id: i,
			Option: letter + '满意度？',
		});
	}
	return data;
}

function GetMultiple() {
	return [
		'非常满意',
		'满意',
		'一般',
		'不满意',
		'非常不满意'
	]
}

