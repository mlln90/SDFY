function convertCurrency(money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', ' 拾 ', ' 佰 ', ' 仟 ');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', ' 万 ', ' 亿 ', ' 兆 ');
  //对应小数部分单位
  var cnDecUnits = new Array(' 角 ', ' 分 ', ' 毫 ', ' 厘');
  //整数金额时后面跟的字符
  var cnInteger = ' 整 ';
  //整型完以后的单位
  var cnIntLast = ' 元 ';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money == '') { return ''; }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}


function currentMoney(money){
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    var maxNum = 999999.9999;   //最大处理的数字
    var integerNum;             //金额整数部分
    var decimalNum;             //金额小数部分
    var chineseStr = '';        //输出的中文金额字符串
    //分离金额后用的数组，预定义
    var parts;
    if (money == '') { return ''; }
        money = parseFloat(money);
    if (money >= maxNum) { return '';}
    if (money == 0) {
       chineseStr = cnNums[0];
       return chineseStr;
    }
    money = money.toString();              // 转换为字符串
    if (money.indexOf('.') == -1) {
       integerNum = money;
       decimalNum = '00';
    } else {
       parts = money.split('.');
       integerNum = parts[0];
       decimalNum = parts[1].substr(0, 2);
    }

    var shengshu="";
    var xiaoshu="";
    if (parseInt(integerNum, 10) > 0) {
      var len =  integerNum.length;
      if(len == 1){     // 个位数
        shengshu = "零零零零零" + cnNums[parseInt(integerNum)];
      }
      if(len == 2){       // 十位数
        var shi = integerNum.substr(0,1);
        var ge  = integerNum.substr(1,1);
        shengshu = "零零零零" + cnNums[parseInt(shi)] + cnNums[parseInt(ge)];
      }
      if(len == 3){
        var bai = integerNum.substr(0,1);
        var shi = integerNum.substr(1,1);
        var ge  = integerNum.substr(2,1);
        shengshu = "零零零" + cnNums[parseInt(bai)] + cnNums[parseInt(shi)] + cnNums[parseInt(ge)];
      }
      if(len == 4){
        var qian = integerNum.substr(0,1);
        var bai  = integerNum.substr(1,1);
        var shi  = integerNum.substr(2,1);
        var ge   = integerNum.substr(3,1);
        shengshu = "零零" + cnNums[parseInt(qian)] + cnNums[parseInt(bai)] + cnNums[parseInt(shi)] + cnNums[parseInt(ge)];
      }
      if(len == 5){
        var wan = integerNum.substr(0,1);
        var qian = integerNum.substr(0,1);
        var bai = integerNum.substr(0,1);
        var shi = integerNum.substr(1,1);
        var ge  = integerNum.substr(2,1);
        shengshu = "零" + cnNums[parseInt(wan)] + cnNums[parseInt(qian)] + cnNums[parseInt(bai)] + cnNums[parseInt(shi)] + cnNums[parseInt(ge)];
      }
      if(len == 6){
        var swan = integerNum.substr(0,1);
        var wan  = integerNum.substr(0,1);
        var bai  = integerNum.substr(0,1);
        var shi  = integerNum.substr(1,1);
        var ge   = integerNum.substr(2,1);
        shengshu = "" + cnNums[parseInt(swan)] + cnNums[parseInt(wan)] + cnNums[parseInt(qian)] + cnNums[parseInt(bai)] + cnNums[parseInt(shi)] + cnNums[parseInt(ge)];
      }
    }
    //小数部分
    if (decimalNum != '') {
      var decLen = decimalNum.length;
      if(decLen == 1){
        var jiao = decimalNum.substr(0,1);
        xiaoshu = "" + cnNums[parseInt(jiao)] + '零';
      }
      if(decLen == 2){
        var jiao = decimalNum.substr(0,1);
        var fen = decimalNum.substr(1,1);
        xiaoshu = "" + cnNums[parseInt(jiao)] + cnNums[parseInt(fen)];
      }
    }
    return shengshu + xiaoshu;
}