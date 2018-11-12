/* 2018-06-12 11:07:44 */

//主菜单
var HomeMenuText = '<div id="main-menu">'
		+ '<div class="content">'
		+ '<div class="animated bounceIn">'
		+ '<div class="menu-list">'
		/*+ '<div class="item hospitalIntroduce" data-type="YYJJ"><div class="icon"></div></div>'
		+ '<div class="item printReport" data-type="DYYW"><div class="icon"></div></div>'
		+ '<div class="item identityCardRegist" data-type="SFZBK"><div class="icon"></div></div>'
		+ '<div class="item outpatientAppointment" data-type="MZYY"><div class="icon"></div></div>'
		+ '<div class="item registerOntheDay" data-type="DRGH"><div class="icon"></div></div>'
		+ '<div class="item reservationNumber" data-type="YYQH"><div class="icon"></div></div>'
		+ '<div class="item selfHelpPayment" data-type="ZZJF"><div class="icon"></div></div>'*/
		+ '</div></div>'
		+ '<div class="cartoon cartoon-person-1"></div>'
		+ '</div>'
		+ '<div class="operate clearfix">'
		+ '<div class="btn pull-right btn-exit"><span>退出</span>&nbsp;CARD</div>'
		+ '<div class="btn pull-right btn-consultations"><span>治疗取号</span></div>'
		+ '</div>'
		+ '<p class="company padding-50">深圳市汇利斯通信息技术有限公司制作</p>'
		+ '</div>';

// 医院介绍
var HospitalIntroduceText = `<div id="hospitalIntroduce">
			<div class="content">
				<div class="animated bounceIn">
					<div class="title printTitle">医院介绍及参保查询</div>
					<div class="menu-list">
						<div class="item hospinto" data-type="YYJS"><div class="icon"></div></div>
						<div class="item doctinto" data-type="YSJS"><div class="icon"></div></div>
						<div class="item departinto" data-type="KSJS"><div class="icon"></div></div>
						<div class="item socialinto" data-type="CBCX"><div class="icon"></div></div>
					</div>
					<div class="cartoon cartoon-person-1"></div>
				</div>
				<div class="handle-group">
					<div class="handlefirst pull-right handle-prev">上一页</div>
					<div class="handlefirst pull-right handle-home">首页</div>
	            </div>
				<div class="time"><span class='s'>60</span></div>
			</div>		
		</div>`;


// <div class="printfp item" data-type="DYPF"><div class="icon"></div></div>
// <div class="printdz item" data-type="DZBLDY"><div class="icon"></div></div>
// <div class="printhyd item" data-type="HYDDY"><div class="icon"></div></div>
//打印报告   PrintReport
var PrintReportText = `<div id="printReport">
			<div class="content">
				<div class="animated bounceIn">
					<div class="title printTitle">打印业务</div>
					<ul class="user-info col-6 font-24 clearfix">
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
					</ul>
					<div class="menu-list"></div>	
					<div class="cartoon cartoon-person-1"></div>
                </div>
                <div class="printNav">
					<div class="btn btn-exit"><span>退出</span>&nbsp;CARD</div>
				</div>
				<div class="time"><span class='s'>60</span></div>
				<div class="handle-group">
					<div class="handlefirst pull-right handle-prev">上一页</div>
					<div class="handlefirst pull-right handle-home">首页</div>
                </div>
			</div>
		</div>`;


//当日挂号   RegisterOntheDay
var RegisterOntheDayText = `<div id="registerOntheDay">
			<div class="content">
				<div class="animated bounceIn">
					<div class="title printTitle">当日挂号</div>
					<ul class="user-info col-6 font-24 clearfix">
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
					</ul>		
					<div class="menu-list">
						<li class="registerOntheDaygh item" data-type="JRGH"><div class="icon"></div></li>
						<li class="registerOntheDayqx item" data-type="QXGH"><div class="icon"></div></li>
					</div>
					<div class="cartoon cartoon-person-1"></div>
                </div>
                <div class="printNav">
					<div class="btn btn-exit"><span>退出</span>&nbsp;CARD</div>
				</div>
				<div class="time"><span class='s'>60</span></div>
				<div class="handle-group">
					<div class="handlefirst pull-right handle-prev">上一页</div>
					<div class="handlefirst pull-right handle-home">首页</div>
                </div>
			</div>
		</div>`;


//门诊预约   outpatientAppointment
var OutpatientAppointmentText = `<div id="outpatientAppointment">
			<div class="content">
				<div class="animated bounceIn">
					<div class="title printTitle">门诊预约</div>
					<ul class="user-info col-6 font-24 clearfix">
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
					</ul>
					<div class="menu-list">
						<li class="outpatientAppointmentgh item" data-type="YYGH"><div class="icon"></div></li>
						<li class="outpatientAppointmentqx item" data-type="QXYY"><div class="icon"></div></li>
					</div>
					<div class="cartoon cartoon-person-1"></div>
                </div>
                <div class="printNav">
					<div class="btn btn-exit"><span>退出</span>&nbsp;CARD</div>
				</div>
				<div class="time"><span class='s'>60</span></div>
				<div class="handle-group">
					<div class="handlefirst pull-right handle-prev">上一页</div>
					<div class="handlefirst pull-right handle-home">首页</div>
                </div>
			</div>
		</div>`;

//自我缴费   selfHelpPayment
var SelfHelpPaymentText = `<div id="selfHelpPayment">
			<div class="content">
				<div class="animated bounceIn">
					<div class="title printTitle">缴费与明细</div>
					<ul class="user-info col-6 font-24 clearfix">
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
					</ul>
					<div class="menu-list">
						<li class="selfHelpPaymentjf item" data-type="CFJF"><div class="icon"></div></li>
						<li class="selfHelpPaymentmx item" data-type="XFMX"><div class="icon"></div></li>
					</div>
					<div class="cartoon cartoon-person-1"></div>
                </div>
                <div class="printNav">
					<div class="btn btn-exit"><span>退出</span>&nbsp;CARD</div>
				</div>
				<div class="time"><span class='s'>60</span></div>
				<div class="handle-group">
					<div class="handlefirst pull-right handle-prev">上一页</div>
					<div class="handlefirst pull-right handle-home">首页</div>
                </div>
			</div>
		</div>`;


//预约取号   reservationNumber
var reservationNumberText = `<div id="reservationNumber">
			<div class="content">
				<div class="animated bounceIn">
					<div class="title printTitle">取号报到</div>
					<ul class="user-info col-6 font-24 clearfix">
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
					</ul>
					<div class="menu-list">
						<li class="reservationNumberyy item" data-type="YYQH2"><div class="icon"></div></li>
						<li class="reservationNumberwx item" data-type="XSQH"><div class="icon"></div></li>
					</div>
					<div class="cartoon cartoon-person-1"></div>
                </div>
                <div class="printNav">
					<div class="btn btn-exit"><span>退出</span>&nbsp;CARD</div>
				</div>
				<div class="time"><span class='s'>60</span></div>
				<div class="handle-group">
					<div class="handlefirst pull-right handle-prev">上一页</div>
					<div class="handlefirst pull-right handle-home">首页</div>
                </div>
			</div>
		</div>`;


// 银行卡 或者 社保卡 输入密码界面
var socialOrbankinputKeyText = `<div id="socialOrbankinputKey">
			<div class="content">
				<div class="animated bounceIn">
					<div class="title theme-title-color keywords-title">请输入密码</div>
					<div class="keyboard-wrap position"></div>
					<ul class="user-info col-8 font-24 clearfix">
						<li class="p-l-l p-r-l "></li> 
						<li class="p-l-l p-r-l "></li>
						<li class="p-l-l p-r-l "></li>
					</ul>
					<div class="input-keywords col-10">
						<input type="password" placeholder="请输入密码" class="form-control" maxlength="6"/>
						<br/>
						<p class="placetext">在机器下方密码键盘处输入密码</p>
					</div>
                </div>
				<div class="time"><span class='s'>60</span></div>
				<div class="handle-group">
					<div class="handle pull-left handle-home">首页</div>
					<div class="handle pull-right handle-exit">退出</div>
					<div class="handle pull-right handle-prev">上一页</div>
				</div>
			</div>
		</div>`;


// 注册
var identityCardRegistText = `<div id="identityCardRegist">
			<div class="content">
				<div class="animated bounceIn">
					<div class="title printTitle">病历号注册</div>
					<div class="menu-list">
						<li class="identityCardRegistBrushCard item" data-type="SFZZC"><div class="icon"></div></li>
						<li class="identityCardRegistSocial item" data-type="SBKZC"><div class="icon"></div></li>
						<li class="identityCardRegistNoCard item" data-type="WZZC"><div class="icon"></div></li>
					</div>
					<div class="cartoon cartoon-person-1"></div>
                </div>
                <div class="printNav">
					<div class="btn btn-exit"><span>退出</span>&nbsp;CARD</div>
				</div>
				<div class="time"><span class='s'>60</span></div>
				<div class="handle-group">
					<div class="handlefirst pull-right handle-prev">上一页</div>
					<div class="handlefirst pull-right handle-home">首页</div>
                </div>
			</div>
		</div>`;


// 无证办卡基本信息填写
var noCardRegisterText = `<div id="noCardRegister">
			<div  class="content">
				<div class="animated bounceIn">
					<div class="title theme-title-color text-shadow" style="font-weight:bold">请输入您的信息</div>

					<table class="nocard-table user-info col-7 font-22">
						<tr>
							<td class="table-title"><label for="user-names">姓名</label></td>
							<td class="table-content"><input id="user-names" type="text" placeholder="请输入您的真实姓名"/></td>
						</tr>
						<tr>
							<td class="table-title"><label for="user-sex">性别</label></td>
							
							<td class="table-content"><input id="user-sex" type="text" value="女" placeholder="男/女"/></td>
						</tr>
						<tr>
							<td class="table-title"><label for="user-minzu">民族</label></td>
							<td class="table-content"><input id="user-minzu" type="text" value="汉族" placeholder="汉族"/></td>
						</tr>
						<tr>
							<td class="table-title"><label for="user-address">地址</label></td>
							<td class="table-content"><input id="user-address" type="text" placeholder="顺德区***花园"/></td>
						</tr>
					</table>
									
					<div id="input-characters" style="margin-top:40px">
		                <div class="input-group" style="display:none">
		                    <input type="text" class="input-text">
		                    <span class="bename"></span>
		                </div>
		                <div class="keyboard-wrap"></div>
		            </div>
		            <div class="btn-input-gorunp">
						<div class="font-24 pingyin">拼音</div>
						<div class="font-24 shouxie">确定</div><br/>
						<div class="font-24 shanchu">删除</div>
						<div class="font-24 chonxie">重写</div>
					</div>
                </div>
                <div class="time"><span class='s'>60</span></div>
                <div class="handle-group">
					<div class="handle pull-left handle-home">首页</div>
					<div class="handle pull-right handle-exit">退出</div>
					<div class="handle pull-right handle-prev">上一页</div>
				</div>
			</div>
		</div>`;

var noCardRegisterText2 = `<div id="noCardRegister">
			<div  class="content">
				<div class="animated bounceIn">
					<div class="title theme-title-color text-shadow" style="font-weight:bold">请输入您的信息</div>

					<table class="nocard-table user-info col-7 font-22">
						<tr>
							<td class="table-title"><label for="user-names">姓名</label></td>
							<td class="table-content"><input id="user-names" type="text" placeholder="请输入您的真实姓名"/></td>
						</tr>
						<tr>
                            <td class="table-title"><label for="user-sex">性别</label></td>
                            <td class="table-content" id="radioChoise">
                                <span class="choise-sex clearfix">
                                    <label class="pull-left" for="male">男</label>
                                    <input class="pull-left" name="sex" type="radio" id="male" value="男" />
                                </span>
                                <span class="choise-sex clearfix">
                                    <label class="pull-left" for="female">女</label>
                                    <input class="pull-left" name="sex" type="radio" checked="checked" id="female" value="女"/>
                                </span>
                            </td>
                        </tr>
                        <tr>
                        	<td class="table-title"><label for="user-birth">出生日期</label></td>
                        	<td class="table-content">
                        		<select class="sel1" name="birthYear" id="birthYear"></select>
                                <select class="sel2" name="birthMonth" id="birthMonth"></select>
                                <select class="sel3" name="birthDay" id="birthDay"></select>
                        	</td>
                        </tr>
                        <tr>
                            <td class="table-title"><label for="user-address">居住地址</label></td>
                            <td class="table-content">
                                <select class="selA" name="provinceS" id="provinceS"></select>
                                <select class="selB" name="cityS" id="cityS"></select>
                                <select class="selC" name="areaS" id="areaS"></select>
                            </td>
                        </tr>
						<tr>
                            <td class="table-title"><label for="user-address">详细地址</label></td>
                            <td class="table-content">
                                <input id="user-address" type="text" placeholder="详细地址"/>
                            </td>
                        </tr>
					</table>
									
					<div id="input-characters" style="margin-top:40px">
		                <div class="input-group" style="display:none">
		                    <input type="text" class="input-text">
		                    <span class="bename"></span>
		                </div>
		                <div class="keyboard-wrap"></div>
		            </div>
		            <div class="btn-input-gorunp">
						<div class="font-24 pingyin">拼音</div>
						<div class="font-24 shouxie">确定</div><br/>
						<div class="font-24 shanchu">删除</div>
						<div class="font-24 chonxie">重写</div>
					</div>
                </div>
                <div class="time"><span class='s'>60</span></div>
                <div class="handle-group">
					<div class="handle pull-left handle-home">首页</div>
					<div class="handle pull-right handle-exit">退出</div>
					<div class="handle pull-right handle-prev">上一页</div>
				</div>
			</div>
		</div>`;



// 社保平台接入
var SocialintoText = `<div id="socialintoText">
			<div class="content">
				<div class="animated bounceIn">
					<div id="setIframeWidth">
						<iframe frameborder= "0" src="http://139.0.1.99:9393/ebf/dev/devHomepage/devHomepage.jsp?pageType=MENU3&amp"></iframe>
					</div>
                </div>
				<div class="handle-group">
					<div class="handlefirst pull-right handle-prev">上一页</div>
					<div class="handlefirst pull-right handle-home">首页</div>
                </div>
			</div>
		</div>`;