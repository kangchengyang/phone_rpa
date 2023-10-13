appName = '工作助手新'
appVersion = '3.0.04'
// phone = '17725147730'
fileDownloadPath = "/storage/emulated/0/rpa/config"
//配置表路径
configPath = fileDownloadPath+'/'+'配置表'+ '_模板.xls'
//配置参数
configDict = {}
//对照表
dataDict = {}
/*初始化*/
function resetDevice(){
    console.show()     //显示控制台
    console.clear()   //清空控制台
    console.log("----准备初始化环境----")
    //closeApp()       //关闭后台所有未锁定的App
                     //初始化文件保存路径
    console.log("----环境初始化完成----")
}
//启动app
function runApp() {
    automator.home();
    sleep(1000);
    automator.recents();
    automator.clickCenter(selector().id('clearAnimView').findOne(5000))
    sleep(2000)
    automator.back()
    sleep(3000);
    loginAway = configDict['软件打开方式']//两种：1---automator.clickCenter(selector().text('工作助手新').findOne(3000))  2：app.launchApp('工作助手新')
    if(String(loginAway)==1){
        console.warn('使用第一种登录方式')
        automator.clickCenter(selector().text('工作助手新').findOne(3000))
    }else{
        console.log('使用第二种登录方式')
        app.launchApp('工作助手新')
    }
    sleep(1000);
    selector().text('工作助手').waitFor(10000)
    if(selector().text('登录').findOne(3000)){
        console.log('打开软件成功')
        return true
    }else{
        console.log('打开软件失败')
        return false
    }
}
//登录工作助手
function loginApp(phone,passw){
    var is_not_continue = false
    console.log('开始登录工作助手')
    try{
        if(selector().id('j-sms-send').findOne(2000)){
            console.log('进入了免密登录界面，需要返回')
            automator.back();
            if(selector().id('username').findOne(2000)){
            }else{
                console.log('点击账号登录')
                selector().text('账号登录').findOne(2000).click();
            }
        }
    }catch(e){
        console.log('登录界面查找元素失败，可能是界面发生了变动或者升级')
        return false
    }

    for(var i=0;i<3;i++){
        try{
            selector().id('username').findOne(2000).setText(String(phone))
            sleep(2000)
            selector().id('password').findOne(2000).setText(String(passw))
            if(selector().className('android.widget.Image').findOne(2000)){
                console.log('隐私政策和免责权议已勾选')
            }else{
                console.log('未勾选隐私政策和免责权议,需要勾选')
                selector().text('已阅读并同意').findOne(2000).click();
            }
            sleep(2000)
            selector().className('android.widget.Button').text('登录').findOne(2000).click();
            sleep(4000)
            if(selector().className('android.widget.Button').text('登录').findOne(2000)){
             }else{
                 is_not_continue = true
                 break
            }
        }catch(e){

        }
    }
    if(is_not_continue){
        if(gesture_verification()){
            console.log('手势验证成功')
            return true
        }else{
            console.log('手势验证失败')
            return false
        }
    }else{
        console.log('登录失败，可能是账号密码错误')
        return false
    }

}
//手势验证码
function gesture_verification(){
    for(var i=0;i<3;i++){
        automator.gesture(4000, [237,929],[237,1253],[237,1500],[561,1500],[885,1500]);
        if(selector().textContains('服务沙盘H5').findOne(10000)){
            console.log('验证成功')
            return true
        }
    }
    console.log('验证失败')
    return false
    
}
//打开服务沙盘H5
function openH5(){
    try{
        selector().text('服务沙盘H5').findOne(10000).click();
        selector().text('系统登陆中...').waitFor(20000)
        for(var i=0;i<10;i++){
            var is_wait = selector().text('系统登陆中...').waitFor(3000)
            if(!is_wait){
                console.log('加载完毕')
                break
            }else{
                sleep(3000)
            }
        }
        selector().desc('即时测评').waitFor();
        if(selector().desc('即时测评').findOne(10000)){
            console.log('服务沙盘打开成功');
            return true
        }else{
            return false
        }
    }catch(e){
        return false
    }

    
}
//即时测评
function instant_evaluation(){
    var cp_str = '';
    click_card('即时测评');
    console.log('====开始即时测评巡检====');
    var sheet = go_inspection('装维即时测评','10分满意率')
    if(sheet=='页面加载异常'){
        cp_str += '装维即时测评数据页面未加载出来'
    }else{
        console.log('页面加载完成')
        var index = sheet
        console.log(index)
        console.log('当前错误的次数'+index);
        var day_2 = getDay(-2)
        console.log('前天的时间：'+day_2)
        var time_str = selector().textContains('日期').depth(20).findOne().text();
        console.log('获取到的日期'+time_str)
        var time = time_str.split('：')[1]
        if(day_2==time){
            console.log('出数的日期是前天的：'+time)
            cp_str += '装维即时测评出数日期是前天的：'+time+','
        }else{
            console.log('出数的日期不是前天的：'+ time);
            cp_str += '装维即时测评出数的日期不是前天的：：'+time+','
        }
        console.log('当前数据错误的次数'+String(index)); 
        if(index>3){
            console.log('页面数据异常，需要警告')
            cp_str += '装维即时测评页面数据异常'      
        }      
    }
    console.log('====即时测评巡检完成====');
    automator.back();        //返回上级页面
    sleep(2000);
    console.log('====开始厅店即时评测巡检====');
    sheet = go_inspection('厅店即时测评','10分满意率');
    if(sheet=='页面加载异常'){
        cp_str += '厅店即时测评数据页面未加载出来'
    }else{
        index = sheet;
        day_2 = getDay(-5)
        time_str = selector().textContains('日期').depth(20).findOne().text();
        time = time_str.split('：')[1]
        if(day_2==time){
            console.log('出数的日期是5天前的：'+time)
            cp_str += '厅店即时测评出数日期是5天前的：'+time+','
        }else{
            alert_info = '出数的日期不是5天前的：'+ time
            cp_str += '厅店即时测评出数的日期不是5天前的：：'+time+','
        }
        if(index>3){
            console.log('厅店即时评测页面数据异常，需要警告')
            cp_str += '厅店即时评测页面数据异常'         
        }       
    }
    automator.back();
    sleep(2000);
    console.log('====开始企微即时评测巡检====');
    sheet = go_inspection('企微即时测评','非常满意率')
    if(sheet=='页面加载异常'){
        cp_str += '企微即时测评数据页面未加载出来'
    }else{
        index = sheet;
        if(index>3){
        console.log('企微即时测评页面数据异常，需要警告')
        cp_str += '企微即时测评页面数据异常'        
        }
    }
    console.log('====企微即时评测巡检完成====');
    back_index();      //返回主页
    console.log('即时评测巡检完成');
    return cp_str += '即时评测巡检完成'
}
//装维服务
function servce_evaluation(){
    var cp_str = '';
    click_card('装维服务');
    console.log('====开始装维测评巡检====');
    var sheet = go_inspection('装维测评','10分满意率');
    if(sheet=='页面加载异常'){
        cp_str += '装维测评数据页面未加载出来'
    }else{
        var index = sheet;
        console.log('当前数据错误的次数'+String(index));
        if(index>3){
        console.log('装维测评页面数据异常，需要警告')
        cp_str += '装维测评页面数据异常'
        }
    }
    console.log('====装维测评巡检完成====');
    automator.back();
    sleep(2000);
    console.log('====开始固网申告量巡检====');
    //页面变动
    index = 0
    try{
        selector().textContains('固网申告量').textContains('今日').findOne().click();
        sleep(3000)
        for(var i=0;i<10;i++){
            var is_wait = selector().text('数据加载中...').waitFor(3000)
            if(!is_wait){
                console.log('加载完毕')
                break
            }else{
                sleep(3000)
            }
        }        
        selector().text('全市').depth(18).waitFor(20000);
        // for(var k=0;k<5;k++){
        //     var gridview_child = selector().id('tableHead').findOne(3000).children()
        //     if(gridview_child.length>3){
        //         console.log('数据加载出来了')
        //     }else{
        //         selector().text('体内').findOne(3000).click()
        //         sleep(3000)
        //         for(var i=0;i<10;i++){
        //             var is_wait = selector().text('数据加载中...').waitFor(3000)
        //             if(!is_wait){
        //                 break
        //             }else{
        //                 sleep(3000)
        //             }
        //         }
        //         selector().text('全市').depth(18).waitFor(10000)
        //         sleep(4000)    
        //     }
        // }
        sleep(2000)
        var city_child_list = selector().text("全市").depth(18).findOne(3000).parent().children(); //一共应该找到出来7个元素 
        console.log(city_child_list.length)    
        for(var i=0;i<city_child_list.length;i++){
            var c_text = city_child_list[i].text();
            console.log(c_text);
            if( (String(c_text).replace('%','')=='0') || (String(c_text)=='--')){
                index +=1;
            }
        }
        console.log('完成了页面巡检')
        if(index>3){
            console.log('固网申告量页面数据异常，需要警告')
            cp_str += '固网申告量页面数据异常'
        }else{
            cp_str += '固网申告量页面数据正常'
        }
    }catch(e){
        console.log(e)
        console.log('页面加载异常')
        cp_str += '固网申告量数据页面未加载出来'
    }
    console.log('====固网申告量巡检完成====');
    back_index(); 
    console.log('装维服务卡片巡检完成')
    return cp_str += '装维服务卡片巡检完成'
}
//投诉管控
function complaint_control(){
    var cp_str = '';
    click_card('投诉管控');
    console.log('====开始投诉管控巡检====');
    var re  = /\d+/g;
    cp_str += card_inspection('本级投诉来单量','日新增',re)
    console.log('====投诉管控巡检完成====');
    back_index();         //返回主页面
    return cp_str += '投诉管控巡检完成'
}
//移动网络
function m_network(){
    var cp_str = '';
    click_card('移动网络');
    console.log('====开始移动网络巡检====');
    var re = /\d+/g
    cp_str += card_inspection('移动故障申告量','日新增',re);
    re = /[\d.]+%/g
    cp_str += card_inspection('MR覆盖率','当日',re);
    console.log('====移动网络巡检完成====')
    back_index();
    return cp_str += '移动网络巡检完成'
}
//厅店服务
function td_service(){
    var cp_str = '';
    click_card('厅店服务');
    console.log('====开始厅店服务巡检====');
    var re = /[\d.]+%/g;
    cp_str += card_inspection('厅店即时测评','10分满意率',re)
    console.log('====厅店服务巡检完成====');
    back_index();
    return cp_str += '厅店服务巡检完成';
}
//正向积分
function forword_jf(){
    var cp_str = '';
    selector().desc('正向积分').findOne().click();
    selector().textContains('营业厅总积分').textContains('当日').waitFor();
    console.log('====开始正向积分巡检====');
    try{
        selector().textContains('营业厅总积分').textContains('当日').findOne().click();
        sleep(2000);
        automator.back();
        var re = /\d+/g;
        cp_str += card_inspection('营业厅总积分','当日',re);
        cp_str += card_inspection('营业厅人均积分','当日',re);
        console.log('====正向积分巡检完成====');
        back_index();
        return cp_str += '正向积分巡检完成';
    }catch(e){
        return cp_str += '正向积分页面加载异常';
    }
}
//进入巡检页面
function go_inspection(param_str1,param_str2){
    var index = 0;     //统计出现错误数据的次数
    try{
        selector().textContains(param_str1).textContains(param_str2).findOne(3000).click();
        sleep(3000)
        for(var i=0;i<10;i++){
            var is_wait = selector().text('数据加载中...').waitFor(3000)
            if(!is_wait){
                console.log('加载完毕')
                break
            }else{
                sleep(3000)
            }
        }        
        selector().text('全市').depth(18).waitFor(15000);
        if(selector().text('全市').depth(18).findOne(3000)){

        }else{
            selector().text('地区').findOne(3000).click()
            selector().text('全市').depth(18).waitFor(10000);
        }
        var city_child_list = selector().text("全市").depth(18).findOne(20000).parent().children(); //一共应该找到出来7个元素     
        for(var i=0;i<city_child_list.length;i++){
            var c_text = city_child_list[i].text();
            console.log(c_text);
            if( (String(c_text).replace('%','')=='0') || (String(c_text)=='--')){
                index +=1;
            }
        }
        console.log('完成了页面巡检')
        return index;
    }catch(e){
        console.log(e)
        console.log('页面加载异常')
        return '页面加载异常'
    }
}
//点击卡片
function click_card(str){
    selector().desc(str).findOne().click();
    selector().textContains(str).waitFor();
    sleep(2000);
}
//返回主页面
function back_index(){
    for(var i=0;i<5;i++){
        try{
            if(selector().textContains('服务沙盘（试运行）').findOne(3000)){
                console.log('回到了首页');
                break
            }else{
                sleep(2000);
                automator.back();
                for(var j=0;j<10;j++){
                    var is_wait = selector().text('系统登陆中...').waitFor(3000)
                    if(!is_wait){
                        console.log('加载完毕')
                        break
                    }else{
                        sleep(3000)
                    }
                }                  
                
            }

        }catch (e){
            continue
        }
    }
}
//启动监听，用于关闭弹窗广告和开屏广告
function wathcer() {
    try {
        console.log('启动监听');
        threads.start(function () {
            while (true) {
                if (selector().id('iv_close').findOne(200)) {
                    console.info('跳过弹窗广告');
                    selector().id('iv_close').findOne(200).click();
                }
                if (selector().id('tv_countdown_bottom').textStartsWith('跳过').findOne(200)) {
                    console.info('跳过开屏广告');
                    selector().id('tv_countdown_bottom').textStartsWith('跳过').findOne(200).click();
                }
            }
        })
    } catch (e) {
        console.error("未知异常引起流程终止!");
        stop('未知异常引起流程终止!');
    }
}
//用于计算前面的日期///////////
function getDay(day){
  var today = new Date()
  // 获取时间戳(毫秒级)
  /*
    day为1，则是，明天的时间戳
    day为-1，则是，昨天的时间戳
    day为-2，则是，前天的时间戳
  */
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  // Date.setTime(时间戳)：设置当前日期的时间
  today.setTime(targetday_milliseconds)
  var tYear = today.getFullYear() // 年
  var tMonth = today.getMonth() // 月
  var tDate = today.getDate() // 日
  tMonth = this.doHandleMonth(tMonth + 1)
  tDate = this.doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth(month) {
  var m = month
  if (month.toString().length == 1) {
    m = '0' + month
  }
  return m
} 
//////////////////////////////
///进入数据页面
function card_inspection(param_str1,param_str2,re){
    var cp_str = ''
    try{
        var increasing = selector().textContains(String(param_str1)).textContains(String(param_str2)).findOne(3000).text();
        var regex = re // 正则匹配 
        var numbers = increasing.match(regex);
        for(var i=0; i<numbers.length;i++){
            console.log(numbers[i])
            if(numbers[i]=='--'){
                console.log(param_str1+'数据异常,需要警告')
                cp_str += (param_str1 +'数据异常')
            }
        }       
    }catch (e){
        console.log(e)
        console.log(param_str1+'数据异常,需要警告')
        cp_str += (param_str1 +'数据异常')
        return cp_str;
    }

    return cp_str;
} 
//获取当前时间格式:
function get_time(){
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    time = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second
    return time;

} 
function to_email(host,port,email,param_str1,param_str2,fromPerson,passw){
    /***
     * host:服务器地址
     * port:端口
     * email:接收人
     * param_str1：标题
     * param_str2：正文
     * fromPerson：发件人
     * passw：邮件密码
     */
    ret = mail.send(email,param_str1,param_str2,{
    // smtp服务器配置信息
    host:host,
    ssl:true,
    port:parseInt(port),
    user:fromPerson,
    password:passw,
    // 发送附件
    // files: files.pathSdcard('rpa/test.txt')
    })
    if(ret){
        console.log('邮件发送成功');
    }else{
        console.log('邮件发送失败')
    }
}
//创建配置表
function createDefaultExcel(){
    let excelObj = excel.open(fileDownloadPath+'/'+'配置表'+ '_模板.xls', '数据源')
    excel.setRow(excelObj, 0, ['配置项','值'])
    excel.setRow(excelObj, 1, ['登录账号'])
    excel.setRow(excelObj, 2, ['验证码'])
    excel.setRow(excelObj, 3, ['邮件服务器','smtp.qq.com'])
    excel.setRow(excelObj, 4, ['邮件端口','465'])
    excel.setRow(excelObj, 5, ['email'])
    excel.setRow(excelObj, 6, ['发件人','3138048773@qq.com'])
    excel.setRow(excelObj, 7, ['邮件密码','pxfuxpsfyiptdgji'])
    excel.setRow(excelObj, 8, ['软件打开方式','1'])
    excel.setRow(excelObj, 9, ['对照表名称','数据对比表_模板.xls'])
    excel.setRow(excelObj, 10, ['sheet页名称'])
    excel.syncDisk(excelObj)
    excel.close(excelObj)
}
//读取配置表
function readConfig(configPath){
    try{
        if(!files.exists(configPath)){
            console.warn('配置表不存在需要创建')
            createDefaultExcel();
            console.warn('创建完成')
        }
        let excelObj = excel.open(configPath, '数据源')
        let excelRow = excel.getRowCount(excelObj);
        resDict = {}
        for(var i=1;i<excelRow;i++){
            let excelRowData = excel.getRow(excelObj, i);
            resDict[excelRowData[0]] = excelRowData[1]
        }
        excel.close(excelObj)
        return resDict
    }catch(e){
        excel.close(excelObj)
        return '读取配置表错误，请检查:\n'+e
    }
}

//退出帐户
function exitApp(){
    selector().text('返回').findOne(3000).click()
    var xj_str = ''
    console.log('----开始退出账号----')
    sleep(3000)
    try{
        selector().text('我的').findOne(3000).click()
        selector().text('设置').waitFor(10000)
        sleep(2000)
        selector().text('设置').findOne(3000).click()
        sleep(1000)
        selector().text('退出登录').findOne(3000).click()
        sleep(2000)
        if(selector().textContains('确定注销当前登录信息').findOne(3000)){
            selector().text('确定').findOne(3000).click()
            
            xj_str+='账号退出成功'
        }
    }catch(e){
        console.log('在工作助手首页查找元素异常，退出账号失败')
        xj_str+='在工作助手首页查找元素异常，退出账号失败'
    }
    return xj_str
}


 
//配置初始化
function init(){
    if(String(readConfig(configPath)).indexOf('错误')==-1){
        configDict = readConfig(configPath)
        console.warn('----配置表读取成功----')
        console.log(configDict)
        // if('对照表名称' in configDict){
        //     console.log('----需要读取对照表----')
        //     if(String(readExcel(fileDownloadPath +'/'+ configDict['对照表名称'],configDict['sheet页名称'])).indexOf('错误')==-1){
        //         dataDict = readExcel(fileDownloadPath +'/'+ configDict['对照表名称'],configDict['sheet页名称'])
        //         console.warn('----对照表读取成功----')
        //         console.log(dataDict)
        //     }
        // }else{
        //     console.error(readExcel(fileDownloadPath +'/'+ configDict['对照表名称'],configDict['sheet页名称']))
        //     return false
        // }
    }else{
        console.error(readConfig(configPath))
        return false
    }
    console.log('----配置读取完成----')
    return true  
}
//构建主函数
function main(){
    // 确保APP版本号，否之停止执行并提示，三个参数：name、version、msg
    resetDevice()
    var is_not_continue = true
    var app_str = ''
    if(init()){
       var time = get_time(); 
       var title = String(time) + '----本次服务沙盘巡检已完成，以下是巡检报告:'
       var host = configDict['邮件服务器']
       var port = configDict['邮件端口']
       var email = configDict['email']
       var passw = configDict['邮件密码']
       var fromPseron = configDict['发件人']
        if(!runApp()){
            is_not_continue = false
            app_str+='打开软件失败'
        }
       if(loginApp(String(configDict['登录账号']),String(configDict['验证码']))){
            console.log('登录成功')
        }else{
            console.log('登录失败')
            app_str +='登录失败'
            is_not_continue = false
        }
        if(is_not_continue){
            if(openH5()){
                console.log('服务沙盘H5打开成功')
            }else{
                console.log('服务沙盘H5打开失败，未找到该选项')
                app_str +='服务沙盘H5打开失败，未找到该选项'
                is_not_continue = false
            }
        }
        if(is_not_continue){
            var str_text =  instant_evaluation()+'\n'+
                        servce_evaluation()+'\n'+
                        complaint_control()+'\n'+
                        m_network()        +'\n'+
                        td_service()       +'\n'+
                        forword_jf()       +'\n'+
						exitApp()          +'\n'+
						'----------------------------------------------------'
            to_email(host,port,email,title,str_text,fromPseron,passw);
        }else{
            to_email(host,port,email,title,app_str,fromPseron,passw);
        }
    }
    automator.home();
}
main();
// resetDevice()
// openH5()
// instant_evaluation()
// init()
// runApp()
// loginApp(String(configDict['登录账号']),String(configDict['验证码']))
