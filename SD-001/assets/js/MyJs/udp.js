// udp 银联+社保 lastTime 2018.09.20

async function Sleep(time){   // 申明 Sleep
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve('');
		},time)
	})
}

/**-----------------------------------------------------------UDP 正式库 调用银联------------------------------------------------------------**/
/**-----------------------------------------------------------UDP 正式库 调用银联------------------------------------------------------------**/

async function UDPOpenAndQueryCardStatus(){
    clearInterval(CheckCardTimer);                   // 清除循环查卡   
    if(ISBG == true){
        AcsSwitch.SetAcs('B', 4, 1);                 // 打卡读卡器灯  -闪烁
    }else{
        AcsSwitch.SetAcs('B', 2, 1);                 // 打卡读卡器灯  -闪烁 
    };
    var registerprice = 0;
    var BackPrevPage;
    if(pageType == 'DRGH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 挂号费
        BackPrevPage = choosePayMethodOnTheDay;
    }
    if(pageType == 'YYQH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 挂号费
        BackPrevPage = choosePayMethods;
    };
    if(pageType == 'ZZJF'){
        for(var i=0;i<CardInfo.RecipesInfo.length;i++){
            registerprice += Number( CardInfo.RecipesInfo[i].SelfAmt );   // 自费
        }
        BackPrevPage = choosePayMethodSelf;
    }
    if(pageType == 'DYYW'){
        registerprice = Number(CardInfo.Amount);                          // 病历本费用
        BackPrevPage = printChoisePaymethods;
    }
    registerprice = registerprice.toFixed(2);
    console.log(registerprice);
    var openDKQTExt;
    try {
    	let value=JSON.parse(await ServicesManager.Status("银行社保交易接口"));
    	console.log(value);
    	if(value == 0){           // 正在运行
    		ServicesManager.Stop('银行社保交易接口');      // 停止服务
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');     // 开启服务
    		await Sleep(2000);
    		openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
			readbackFunction(openDKQTExt,BackPrevPage);
    	}else if(value == 1){     // 启动挂起
    		ServicesManager.Stop('银行社保交易接口');      
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');
    		await Sleep(2000);  
    		openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
			readbackFunction(openDKQTExt,BackPrevPage);
    	}else if(value == 2){     // 暂停
    		ServicesManager.Start('银行社保交易接口');
    		await Sleep(2000);
    		openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
			readbackFunction(openDKQTExt,BackPrevPage);
    	}else if(value == 3){    // 暂停挂起
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');
    		await Sleep(2000);
    		openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
			readbackFunction(openDKQTExt,BackPrevPage);
    	}else if(value == 4){    // 继续运行挂起
    		ServicesManager.Stop('银行社保交易接口');      
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');    
    		await Sleep(2000);
    		openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
			readbackFunction(openDKQTExt,BackPrevPage);
    	}else if(value == 5){    // 停止
    		ServicesManager.Start('银行社保交易接口');     
    		await Sleep(2000);
    		openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
			readbackFunction(openDKQTExt,BackPrevPage);
    	}else if(value == 6){   // 停止挂起
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');
    		await Sleep(2000);
    		openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
			readbackFunction(openDKQTExt,BackPrevPage);
    	}else{
    		$.layer({
    			msg :"找不到银联服务,请联系服务人员检查银联服务是否开启",
    			btn :["确认"],
    			type: 1,
    			time: 10,
    			yes : function(){
    				ShowMainMenu();
    			}
    		})
    	}
    }catch(error){
    	console.log(error);
    	if(ISBG == true){
	        AcsSwitch.SetAcs('B', 4, 0);       // 读卡器灯关  
	    }else{
	        AcsSwitch.SetAcs('B', 2, 0);       // 读卡器灯关  
	    };
    	$.layer({
			msg :"查询服务状态异常",
			btn :["确认"],
			type: 1,
			time: 10,
			yes : function(){
				ShowMainMenu();
			}
		})
    }

  //   ServicesManager.Status("银行社保交易接口").then(function(value){      // 查询服务状态
  //   	var value = JSON.parse(value);
  //   	console.log(value);
  //   	if(value == 0){    // 正在运行
  //   		ServicesManager.Stop('银行社保交易接口');      // 停止服务
  //   		setTimeout(function(){
  //   			ServicesManager.Start('银行社保交易接口');
  //   			setTimeout(function(){		
	 //    			openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
	 //    			readbackFunction(openDKQTExt,BackPrevPage);
	 //    		},3000);
  //   		},2000);
  //   	}else if(value == 1){    // 启动挂起
  //   		setTimeout(function(){
  //   			ServicesManager.Start('银行社保交易接口');
  //   			setTimeout(function(){		
	 //    			openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
	 //    			readbackFunction(openDKQTExt,BackPrevPage);
	 //    		},3000);
  //   		},2000);
  //   	}else if(value == 2){    // 暂停
  //   		ServicesManager.Start('银行社保交易接口');
  //   		setTimeout(function(){		
  //   			openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
  //   			readbackFunction(openDKQTExt,BackPrevPage);
  //   		},5000);
  //   	}else if(value == 3){    // 暂停挂起
  //   		ServicesManager.Start('银行社保交易接口');
  //   		setTimeout(function(){		
  //   			openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
  //   			readbackFunction(openDKQTExt,BackPrevPage);
  //   		},5000);
  //   	}else if(value == 4){    // 继续运行挂起
  //   		setTimeout(function(){
  //   			openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
  //   			readbackFunction(openDKQTExt,BackPrevPage);
  //   		},5000);
  //   	}else if(value == 5){    // 停止
  //   		ServicesManager.Start('银行社保交易接口');
  //   		setTimeout(function(){
  //   			openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
  //   			readbackFunction(openDKQTExt,BackPrevPage);
  //   		},5000)
  //   	}else if(value == 6){    // 停止挂起
  //   		ServicesManager.Start('银行社保交易接口');
  //   		setTimeout(function(){
  //   			openDKQTExt = MachineBGPOS.ReadCardDataOne( JSON.stringify({'Amount' : registerprice}) );
  //   			readbackFunction(openDKQTExt);
  //   		},5000);
  //   	}else{                   // -1 找不到服务 -> 提示 并返回首页
  //   		$.layer({
  //   			msg :"找不到银联服务,请联系服务人员检查银联服务是否开启",
  //   			btn :["确认"],
  //   			type: 1,
  //   			time: 10,
  //   			yes : function(){
  //   				ShowMainMenu();
  //   			}
  //   		})
  //   	}
  //   }, function(error){
  //   	console.log(error);
  //   	$.layer({
		// 	msg :"查询服务状态异常",
		// 	btn :["确认"],
		// 	type: 1,
		// 	time: 10,
		// 	yes : function(){
		// 		ShowMainMenu();
		// 	}
		// })
  //   });  	
}

function readbackFunction(openDKQTExt,_call){
	var BackPrevPage = _call;
	var openDKQTExt = openDKQTExt;
    openDKQTExt.then(function(value){
        var openvalue = JSON.parse(value);
        console.log(openvalue);
        if(openvalue.Code == 0){
            console.log(openvalue.IntPrt);
            // //轮循查询是否有卡 （状态）
            var cardinfomations = MachineBGPOS.ReadCardDataOneTwo( JSON.stringify({'IntPrt' : openvalue.IntPrt}) ); 
            $.loading(false,'读卡中...');
            cardinfomations.then(function(value){       // 读取卡信息
                $.layerClose();
                var getcardinfo = JSON.parse(value);
                console.log(getcardinfo);
                if(getcardinfo.Code == 0){
                    intprt = getcardinfo.IntPrt;        //  == >
                    inputSocialPasword();               // 查卡信息 ==> 输入密码
                }else{
                    console.log(getcardinfo.msg);
                    if(ISBG == true){
                        AcsSwitch.SetAcs('B', 4, 0);                
                    }else{
                        AcsSwitch.SetAcs('B', 2, 0);                
                    };
                    MachineBGPOS.CloseDKQ(readCardCOM);            // 关闭读卡器
                    $.Writelog('等卡失败,'+ getcardinfo.msg);
                    $.layer({
                        msg: '等卡失败,返回重试',
                        btn:['确认'],
                        tme:6,
                        type:1,
                        yes:function(){
                            BackPrevPage();
                        }
                    });
                }
            } ,function(error){
                $.layerClose();
                console.log(error);
                if(ISBG == true){
                    AcsSwitch.SetAcs('B', 4, 0);                
                }else{
                    AcsSwitch.SetAcs('B', 2, 0);                
                };
                MachineBGPOS.CloseDKQ(readCardCOM);            // 关闭读卡器
                $.Writelog('读卡错误');
                $.layer({
                    msg: '读取卡号错误,返回重试',
                    btn:['确认'],
                    tme:6,
                    type:1,
                    yes:function(){
                        BackPrevPage();
                    }
                });
            });
        }else{
            if(ISBG == true){
                AcsSwitch.SetAcs('B', 4, 0);                
            }else{
                AcsSwitch.SetAcs('B', 2, 0);                
            };
            MachineBGPOS.CloseDKQ(readCardCOM);            // 关闭读卡器
            $.Writelog('读卡失败',openvalue.msg);
            $.layer({
                msg: openvalue.msg,
                btn:['确认'],
                tme:5,
                type:1,
                endExecute: true, 
                yes:function(){
                    BackPrevPage();
                }
            })
        }
    },function(error){
        console.log('打开读卡器失败');
        if(ISBG == true){
            AcsSwitch.SetAcs('B', 4, 0);                
        }else{
            AcsSwitch.SetAcs('B', 2, 0);                
        };
        MachineBGPOS.CloseDKQ(readCardCOM);            // 关闭读卡器
        $.Writelog('打开读卡器失败');
        console.log(error);
        $.layer({
            msg: '打开读卡器失败',
            btn:['确认'],
            tme:5,
            type:1,
            endExecute: true, 
            yes:function(){
                ShowMainMenu();
            }
        })
    }); 
};

/**-----------------------------------------------------------UDP 正式库 调用社保------------------------------------------------------------**/
/**-----------------------------------------------------------UDP 正式库 调用社保------------------------------------------------------------**/

async function UDPOpenAndQueryCardStatusOfSocial(){
	clearInterval(CheckCardTimer);                   // 清除循环查卡   
    if(ISBG == true){
        AcsSwitch.SetAcs('B', 4, 1);                 // 打卡读卡器灯  -闪烁
    }else{
        AcsSwitch.SetAcs('B', 2, 1);                 // 打卡读卡器灯  -闪烁 
    };
    var registerprice = 0;
    var BackPrevPage;
    if(pageType == 'DRGH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 挂号费
        BackPrevPage = choosePayMethodOnTheDay;
    }
    if(pageType == 'YYQH'){
        registerprice = Number(CardInfo.Doct.PriceList[0].Price);         // 挂号费
        BackPrevPage = choosePayMethods;
    };
    if(pageType == 'ZZJF'){
        for(var i=0;i<CardInfo.RecipesInfo.length;i++){
            registerprice += Number( CardInfo.RecipesInfo[i].SelfAmt );   // 自费
        }
        BackPrevPage = choosePayMethodSelf;
    }
    if(pageType == 'DYYW'){
        registerprice = Number(CardInfo.Amount);                          // 病历本费用
        BackPrevPage = printChoisePaymethods;
    }
    registerprice = registerprice.toFixed(2);
    console.log(registerprice);
    var opensocialvalue;
    try {
    	let value=JSON.parse(await ServicesManager.Status("银行社保交易接口"));
    	console.log(value);
    	if(value == 0){           // 正在运行
    		ServicesManager.Stop('银行社保交易接口');      // 停止服务
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');     // 开启服务
    		await Sleep(2000);
    		opensocialvalue = MachineBGPOS.OpenDKQ( readCardCOM );
			readbackFunctionSocial(opensocialvalue,BackPrevPage);
    	}else if(value == 1){     // 启动挂起
    		ServicesManager.Stop('银行社保交易接口');      
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');
    		await Sleep(2000);  
    		opensocialvalue = MachineBGPOS.OpenDKQ( readCardCOM );
			readbackFunctionSocial(opensocialvalue,BackPrevPage);
    	}else if(value == 2){     // 暂停
    		ServicesManager.Start('银行社保交易接口');
    		await Sleep(2000);
    		opensocialvalue = MachineBGPOS.OpenDKQ( readCardCOM );
			readbackFunctionSocial(opensocialvalue,BackPrevPage);
    	}else if(value == 3){    // 暂停挂起
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');
    		await Sleep(2000);
    		opensocialvalue = MachineBGPOS.OpenDKQ( readCardCOM );
			readbackFunctionSocial(opensocialvalue,BackPrevPage);
    	}else if(value == 4){    // 继续运行挂起
    		ServicesManager.Stop('银行社保交易接口');      
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');    
    		await Sleep(2000);
    		opensocialvalue = MachineBGPOS.OpenDKQ( readCardCOM );
			readbackFunctionSocial(opensocialvalue,BackPrevPage);
    	}else if(value == 5){    // 停止
    		ServicesManager.Start('银行社保交易接口');     
    		await Sleep(2000);
    		opensocialvalue = MachineBGPOS.OpenDKQ( readCardCOM );
			readbackFunctionSocial(opensocialvalue,BackPrevPage);
    	}else if(value == 6){
    		await Sleep(2000);
    		ServicesManager.Start('银行社保交易接口');
    		await Sleep(2000);
    		opensocialvalue = MachineBGPOS.OpenDKQ( readCardCOM );
			readbackFunctionSocial(opensocialvalue,BackPrevPage);
    	}else{
    		$.layer({
    			msg :"找不到银联服务,请联系服务人员检查银联服务是否开启",
    			btn :["确认"],
    			type: 1,
    			time: 10,
    			yes : function(){
    				ShowMainMenu();
    			}
    		})
    	}
    }catch(error){
    	console.log(error);
    	if(ISBG == true){
	        AcsSwitch.SetAcs('B', 4, 0);                 // 读卡器灯关  
	    }else{
	        AcsSwitch.SetAcs('B', 2, 0);                 // 读卡器灯关  
	    };
    	$.layer({
			msg :"查询服务状态异常",
			btn :["确认"],
			type: 1,
			time: 10,
			yes : function(){
				ShowMainMenu();
			}
		})
    }
}

function readbackFunctionSocial(opensocialvalue,_call){
	var opensocialvalue = opensocialvalue;
	var BackPrevPage = _call;
	console.log(opensocialvalue);
	if(opensocialvalue.Code == 0){
	    clearInterval(timerDKQStatus);
	    timerDKQStatus = setInterval(function(){
	        MachineBGPOS.GetStatusDKQ().then(function(value){          // 查卡状态
	            var querysocialstatus = JSON.parse(value);
	            console.log(querysocialstatus);
	            if(querysocialstatus.Code == 0){
	                clearInterval(timerDKQStatus);                     // 清楚循环查卡
	                MachineBGPOS.ssiRead( JSON.stringify({'Amount' : registerprice}) ).then(function(value){          // 读卡信息
	                    var readSocialCardinfo = JSON.parse(value);
	                    console.log(readSocialCardinfo);
	                    if(readSocialCardinfo.Code == 0){
	                        intprt = readSocialCardinfo.IntPrt;
	                        openSocialKeyPrinet();                     // 打开密码键盘
	                    }else{
	                        console.log(readSocialCardinfo.msg);
	                        $.Writelog('读社保卡卡信息:');
	                        $.Writelog(readSocialCardinfo.msg);
	                        if(ISBG == true){
	                            AcsSwitch.SetAcs('B', 4, 0);           // 提示灯常关
	                        }else{
	                            AcsSwitch.SetAcs('B', 2, 0);           // 提示灯常关
	                        };
	                        MachineBGPOS.CloseDKQ(readCardCOM).then(function(value){       // 关闭读卡器
	                            console.log(value)
	                        }, function(error){
	                            console.log(error)
	                        });              
	                        $.layer({
	                            msg: readSocialCardinfo.msg, 
	                            btn: ['确定'],
	                            type: 1,     
	                            time: 6,
	                            bulbSrc: 'assets/images/tip/bulb.png',
	                            yes:function(){
	                                BackPrevPage();     
	                            }
	                        })
	                    }
	                }, function(error){
	                    console.log(error);
	                    if(ISBG == true){
	                        AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
	                    }else{
	                        AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
	                    };
	                    MachineBGPOS.CloseDKQ(readCardCOM);              // 关闭读卡器
	                    console.log(error);
	                    $.Writelog('机器故障，查卡状态失败');
	                    $.layer({
	                        msg: '异常，查询卡失败', 
	                        btn: ['确定'],
	                        type: 1,     
	                        time: 6,
	                        bulbSrc: 'assets/images/tip/bulb.png',
	                        yes:function(){
	                            BackPrevPage();     
	                        }
	                    })
	                });
	            }else{
	                console.log(querysocialstatus.msg);
	                $.Writelog('读卡状态:'+ querysocialstatus.msg);
	            }
	        }, function(error){
	            clearInterval(timerDKQStatus);
	            if(ISBG == true){
	                AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
	            }else{
	                AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
	            };
	            MachineBGPOS.CloseDKQ(readCardCOM);              // 关闭读卡器
	            console.log(error);
	            $.Writelog('机器故障，查卡状态失败');
	            $.layer({
	                msg: '异常，查询卡失败', 
	                btn: ['确定'],
	                type: 1,     
	                time: 6,
	                bulbSrc: 'assets/images/tip/bulb.png',
	                yes:function(){
	                    BackPrevPage();     
	                }
	            })
	        });
	    },1300);
	}else{
	    $.Writelog('打开读卡器失败');
	    if(ISBG == true){
	        AcsSwitch.SetAcs('B', 4, 0);                 // 提示灯常关
	    }else{
	        AcsSwitch.SetAcs('B', 2, 0);                 // 提示灯常关
	    };
	    MachineBGPOS.CloseDKQ(readCardCOM);              // 关闭读卡器
	    $.layer({
	        msg: opensocialvalue.msg, 
	        btn: ['确定'],
	        type: 1,     
	        time: 6,
	        bulbSrc: 'assets/images/tip/bulb.png',
	        yes:function(){
	            BackPrevPage();     
	        }
	    })
	}
}