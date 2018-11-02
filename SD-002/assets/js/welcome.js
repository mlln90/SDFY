/* 2017-07-15 13:48:39 */
;
$(function() {

	// 禁止选择文字
    document.onselectstart = function() {return false; };
    // 禁止点击右键弹出上下文菜单
    window.oncontextmenu = function() {return false; };

    // 初始化展示列
    // initView();

});

// 初始化
function initView() {
    // 调用绘图插件
    initPlugin();

    // 获取数据并加载绘图数据
    getData();
}

// 获取数据
function getData() {

    var TitleData = [];
    var ZJNumData = [];
    var RGNumData = [];
    var ZJCostData = [];
    var RGCostData = [];
    $.each(data, function(n, val) {
        TitleData.push(val.name);
        ZJNumData.push(val.ZJnum);
        RGNumData.push(val.RGnum);
        ZJCostData.push(val.ZJcost);
        RGCostData.push(val.RGcost);
    });

    myChart.hideLoading();
    myChart.setOption({
        xAxis: {
            data: TitleData
        },
        series: [
            {data: ZJCostData},
            {data: RGCostData},
            {data: ZJNumData},
            {data: RGNumData}
        ]
    });

    setInterval(function() {
        $.each(data, function(n, val) {
            data[n].ZJcost += 200.0;
            data[n].RGcost += 100.0;
            data[n].ZJnum += 2;
            data[n].RGnum += 1;
        });
        var ZJNumData = [];
        var RGNumData = [];
        var ZJCostData = [];
        var RGCostData = [];
        $.each(data, function(n, val) {
            ZJNumData.push(val.ZJnum);
            RGNumData.push(val.RGnum);
            ZJCostData.push(val.ZJcost);
            RGCostData.push(val.RGcost);
        });
        myChart.setOption({
            series: [
                {data: ZJCostData},
                {data: RGCostData},
                {data: ZJNumData},
                {data: RGNumData}
            ]
        });
    }, 2000);
}


var data = [
    {
        name: '挂号',
        ZJcost: 7800.32,
        ZJnum: 234,
        RGcost: 800.32,
        RGnum: 234        
    }, {
        name: '办卡',
        ZJcost: 3200.00,
        ZJnum: 320,
        RGcost: 600.32,
        RGnum: 53         
    }, {
        name: '现金充值',
        ZJcost: 8900.00,
        ZJnum: 564,
        RGcost: 2330.32,
        RGnum: 134      
    }, {
        name: '银联充值',
        ZJcost: 7976.00,
        ZJnum: 223,
        RGcost: 2900.32,
        RGnum: 187       
    }
];

// 初始化插件
var myChart;
function initPlugin() {
    myChart = echarts.init(document.getElementById('echarts'));
    var option = getOptions();
    myChart.setOption(option, true);
    window.onresize = myChart.resize;
    myChart.showLoading();
}

var CurrentDate = $.formatDate(new Date().getTime()).substring(0, 10);

// 获取展示参数
function getOptions() {
    var option = {
        title : { // 标题
            text: '全院自助终端与人工窗口日营业数据',
            left: 'center',
            top: 20,
            textStyle: { 
                fontSize: 35,
                color: '#F5F5F5',
                fontWeight: 'bold',
                fontFamily: 'Microsoft YaHei'
            },
            subtext: CurrentDate,
            subtextStyle: {
                fontSize: 18,
                color: '#F5F5F5',
                fontWeight: 'bold',
            }
        },
        backgroundColor: '#21202D',
        color:  [
            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0', '70AD46' ],
        tooltip : {
            // show: false,
            trigger: 'axis',
            axisPointer : { 
                type : 'cross', 
                crossStyle: {
                    color: '#999'
                }
            },
            enterable: true, // 鼠标是否可进入提示框
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        legend: {
            bottom: 10,
            itemWidth: 30,
            itemHeight: 20,
            inactiveColor: '#888',
            textStyle: {
                color: '#fff',
                fontSize: 16
            },
            data: ['自助金额', '人工金额', '自助数量', '人工数量']
        },
        grid:{ // 网格
            show: true,
            width: 'auto',
            height: 'auto',
            containLabel: true,
            borderWidth: 0, // 去除最外层边框
            x: 30,
            y: 100,
            x2: 60,
            y2: 60
        },
        xAxis: [ // 直角坐标系 grid 中的 x 轴
            {
                type : 'category',
                data : [],
                boundaryGap: true,
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                        fontSize: 18
                    }
                },
                axisLine: {
                    lineStyle:{
                        color: '#8392A5'
                    }
                },
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis : [
            { // 直角坐标系 grid 中的 y 轴
                type : 'value',
                name: '金额(￥)',
                nameTextStyle: {
                    fontSize: 18
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 18
                    }
                },
                axisLine: {
                    lineStyle:{
                        color: '#5793f3'
                    }
                },
                splitLine: {
                    lineStyle:{
                        color: 'rgba(255, 255, 255, .2)',
                        type:'dashed'

                    }
                }
            },  {
                type: 'value',
                name: '数量',
                min: 0,
                nameTextStyle: {
                    fontSize: 18
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 18
                    }
                },
                axisLine: {
                    lineStyle:{
                        color: '#d14a61'
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle:{
                        type:'dashed',
                        color: 'rgba(255, 255, 255, .3)'
                    }
                }
            }
        ],
        series : [
            {
                name: '自助金额',
                type:'bar',
                yAxisIndex: 0,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle:{
                                fontSize: 20, 
                                color: '#5793f3',
                            },
                            formatter: '￥{c}'
                        }
                    }                        
                },
                data: []
            },  {
                name: '人工金额',
                type:'bar',
                yAxisIndex: 0,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle:{
                                fontSize: 20, 
                                color: '#5793f3',
                            },
                            formatter: '￥{c}'
                        }
                    }                        
                },
                data: []
            }, {
                name: '自助数量',
                type:'bar',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle:{
                                fontSize: 20, 
                                color: '#d14a61',
                            },
                            formatter: '{c}'
                        }
                    }                        
                },
                data: []
            }, {
                name: '人工数量',
                type:'bar',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle:{
                                fontSize: 20, 
                                color: '#d14a61',
                            },
                            formatter: '{c}'
                        }
                    }                        
                },
                data: []
            }
        ]            
    }
    return option;
}