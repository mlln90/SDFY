/**
 * 日清单打印
 * @param PrintInfo 打印操作信息
 * @param PrintInfo - ChargeDate 费用日期
 * @param PrintInfo - PrintDate 打印日期
 * @param PatientInfo 患者信息
 * @param PatientInfo - HospitaledNum 住院号
 * @param PatientInfo - Name 患者姓名
 * @param PatientInfo - InpatientWard 病区
 * @param PatientInfo - BedNumber 床号
 * @param ItemParams 显示项目列表参数
 * @param ItemParams - Depart 执行科室
 * @param ItemParams - ItemName 项目名称
 * @param ItemParams - Count 数量
 * @param ItemParams - Unit 单价
 * @param ItemParams - Amount 金额
 */
var PRINTITEMNAME = 13;
function PrintInventory_2(_data) {
    var PatientInfo = _data.PatientInfo,
    ItemParams = _data.ItemParams,
    PrintInfo = _data.PrintInfo;
    ZZJPrinter.Print(HYDPRINTNAME, 600, 1000, false, function(Code, ID){
        if (Code == 0) { // 打印机正常 DoctorBase
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 16, 0, (210 + _HYDX_), (0+_HYDY_), '十三师红星医院住院病人费用一日清单');  

            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (20 + _HYDX_), (40+_HYDY_), '费用日期：');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 9, 0, (80 + _HYDX_), (40+_HYDY_), '' + $.CheckUndefined(PrintInfo.ChargeDate));
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (450 + _HYDX_), (40+_HYDY_), '打印时间：');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (510 + _HYDX_), (40+_HYDY_), '' + $.CheckUndefined(PrintInfo.PrintDate));

            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (20 + _HYDX_), (60+_HYDY_), '住院号：');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (70 + _HYDX_), (60+_HYDY_), '' + $.CheckUndefined(PatientInfo.HospitaledNum));
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (163 + _HYDX_), (60+_HYDY_), '姓名：');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 9, 0, (200 + _HYDX_), (60+_HYDY_), '' + $.CheckUndefined(PatientInfo.Name));
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (300 + _HYDX_), (60+_HYDY_), '病区：');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (340 + _HYDX_), (60+_HYDY_), '' + $.CheckUndefined(PatientInfo.InpatientWard));
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (450 + _HYDX_), (60+_HYDY_), '床号：');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (490 + _HYDX_), (60+_HYDY_), '' + $.CheckUndefined(PatientInfo.BedNumber));

            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (25 + _HYDX_), (100+_HYDY_), '执行科室');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (100 + _HYDX_), (100+_HYDY_), '项目名称');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (240 + _HYDX_), (100+_HYDY_), '数量');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (290 + _HYDX_), (100+_HYDY_), '单价');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (330 + _HYDX_), (100+_HYDY_), '金额');

            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (420 + _HYDX_), (100+_HYDY_), '执行科室');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (500 + _HYDX_), (100+_HYDY_), '项目名称');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (640 + _HYDX_), (100+_HYDY_), '数量');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (690 + _HYDX_), (100+_HYDY_), '单价');
            ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 9, 0, (730 + _HYDX_), (100+_HYDY_), '金额');

            var y = 120, x = 0;
            $.each(PrintInfo.Items, function(n, val) {
                if (n === 17) {
                    y = 120;
                    x = 400;
                }
                if (n > 33) {
                    PrintInfo.Items = PrintInfo.Items.slice(34, PrintInfo.Items.length);
                    setTimeout(function() {
                        PrintInventory_2(_data);
                    }, 500);
                    return false;
                }
                var ItemName = $.CheckUndefined(val[ItemParams.ItemName]);
                ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, (10 + x + _HYDX_), (y+_HYDY_), '' + (n + 1));
                ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, (30 + x + _HYDX_), (y+_HYDY_), '' + $.CheckUndefined(val[ItemParams.Depart]));
                ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 11, 0, 0+_PR_, y, '执行科室：');
                if (ItemName.length > PRINTITEMNAME) {
                    ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, (100 + x + _HYDX_), (y-6+_HYDY_), ItemName.substring(0, PRINTITEMNAME));
                    ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, (100 + x + _HYDX_), (y+6+_HYDY_), ItemName.substring(PRINTITEMNAME));
                } else {
                    ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, (100 + x + _HYDX_), (y+_HYDY_), ItemName);
                }
                ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, (240 + x + _HYDX_), (y+_HYDY_), '' + $.CheckUndefined(val[ItemParams.Count]));
                ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, (290 + x + _HYDX_), (y+_HYDY_), '' + $.CheckUndefined(val[ItemParams.Unit]));
                ZZJPrinter.PrintString(ID, DTPTTYPEFACE, 8, 0, (330 + x + _HYDX_), (y+_HYDY_), '' + $.CheckUndefined(val[ItemParams.Amount]));
                y += 20;
            })

            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (10 + _HYDX_), (80+_HYDY_), '_______________________________________________________________________________________________________________');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (10 + _HYDX_), (100+_HYDY_), '_______________________________________________________________________________________________________________');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (10 + _HYDX_), (100+_HYDY_), '_______________________________________________________________________________________________________________');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), ( 95+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (110+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (125+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (140+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (155+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (170+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (185+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (200+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (215+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (230+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (245+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (260+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (275+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (290+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (305+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (320+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (335+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (350+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (365+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (380+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (395+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (410+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (425+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (390 + _HYDX_), (440+_HYDY_), '|');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 11, 0, (10 + _HYDX_), (441+_HYDY_), '_______________________________________________________________________________________________________________');

            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 10, 0, (290 + _HYDX_), (460+_HYDY_), '*本次共打印 ' + PrintInfo.pages + ' 页，当前第' + PrintInfo.pagenum + '页');
            PrintInfo.pagenum += 1;

            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 10, 0, (5 + _HYDX_), (480+_HYDY_), '合计总额：');
            ZZJPrinter.PrintStringB(ID, DTPTTYPEFACE, 10, 0, (75 + _HYDX_), (480+_HYDY_), '¥' + $.CheckUndefined(PrintInfo.TotalSum));
            ZZJPrinter.StartPrint(ID);
            AcsSwitch.SetAcs('B', HYDTSD, INDICATORTYPE); // 凭条提示开启
        } else { // 打印机异常
            $.Speak(ID);
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












































