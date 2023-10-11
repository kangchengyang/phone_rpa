appName = '工作助手新'
appVersion = '3.0.04'
fileDownloadPath = "/storage/emulated/0/rpa/config"
//配置表路径
configPath = fileDownloadPath+'/'+'配置表'+ '_模板.xls'
// phone = '18908321737'
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
order_view()
territory_view()
performance_view()
//打开软件
//版本3.0.04
function openApp(){
    app.launchApp(appName)
    selector().text('工作助手').depth(9).findOne().waitFor();
    if(selector().text('工作助手').depth(9).findOne()){
        console.log('打开软件成功！')
        return true
    }else{
        console.log('打开软件失败！')
        return false
    }
    
    //loginApp()/*登录软件*/
               //打开服务沙盘H5
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
        automator.gesture(6000, [237,929],[237,1253],[237,1577],[561,1253],[885,929]);
        if(selector().textContains('工作台').findOne(10000)){
            console.log('验证成功')
            return true
        }
    }
    console.log('验证失败')
    return false
    
}
//打开营销沙盘沙盘H5
function openH5(){
    try{
        selector().text('工作台').findOne(10000).click();
        sleep(2000)
        if(selector().text('营销沙盘H5').findOne(2000)){
            selector().text('营销沙盘H5').findOne(3000).click()
            console.log('营销沙盘H5打开成功');
            sleep(2000)
            return true
        }else{
            return false
        }
    }catch(e){
        return false
    }

}
//工单页面
function order_view(){
    console.log('====开始工单页面巡检====')
    var xj_str = '      ====开始工单页面巡检====\n'
    try{
        selector().text('工单').findOne(3000).click()
        order_list = selector().text('智慧营维').findOne(3000).parent().parent().children();
        console.log(order_list.length)
        is_not_order = false
        for(var i=0;i<order_list.length;i++){
            if(i==0){
                continue
            }
            if(order_list[i].children().length==2 && order_list[i].children()[0].text().indexOf('工单类型')==-1){
                console.log(order_list[i].children()[0].text())
                order_list[i].children()[0].click()
                sleep(1000)
                if(selector().className('android.widget.GridView').findOne(2000)){
                    console.log(order_list[i].children()[0].text()+': 有数据')
                    is_not_order = true
                }
            }
        }
        if(is_not_order){
            console.log('工单页面巡检完成，有数据页面显示正常')
            xj_str+='工单页面巡检完成，有数据页面显示正常'
        }else{
            console.log('工单页面巡检完成，页面没有数据')
            xj_str+='工单页面巡检完成，页面没有数据'
        }
    }catch(e){
        console.log('工单页面，查找元素异常，可能是页面发生了变动或者升级')
        xj_str+='工单页面，查找元素异常，可能是页面发生了变动或者升级'
    }finally{
        return xj_str+='工单页面巡检完成'
    }

}
//地盘页面
function territory_view(){
    console.log('====开始地盘页面巡检====')
    var xj_str = '      ====开始地盘页面巡检====\n'
    var is_not_continue = true
    try{
        selector().text('地盘').findOne(2000).click();
        if(selector().text('我的地盘').findOne(8000)){
            is_not_continue = true
        }else{
            is_not_continue = false
        }
        if(is_not_continue){
            console.log('跳转页面成功')     

        }else{
            console.log('跳转页面失败')
            xj_str +='跳转页面失败'
        }
        //网格视图
        console.log('------网格视图------')
        xj_str+=inspection('网格视图')
        //小区视图
        selector().text('小区视图').findOne(3000).click()
        console.log('------小区视图------')
        var str_list = []
        str_list.push(selector().text('计算房间').findOne(3000).next().text())
        str_list.push(selector().text('收集房间').findOne(3000).next().text())
        str_list.push(selector().text('电表房间').findOne(3000).next().text())
        console.log(str_list)
        var num = 0
        for(var i=0;i<str_list.length;i++){
            if(str_list[i]=='--' || str_list[i]=='0'){
                num+=1
            }
        }
        if(num>=3){
            console.log('小区视图基础信息页面数据异常')
            xj_str+='小区视图基础信息页面数据异常,'
        }else{
            xj_str+='小区视图基础信息页面数据正常,'
        }
        xj_str+=inspection('小区视图')
        //用户列表
        console.log('----开始用户列表页面巡检----')
        selector().text('用户列表').findOne(3000).click()
        sleep(2000)
        if(selector().className('android.widget.Button').text('收集').findOne(8000)){
            console.log('跳转用户列表页面成功')
            xj_str+='跳转用户列表页面成功'
            selector().className('android.widget.Button').text('收集').findOne(8000).parent().click()
            sleep(5000)
            if(selector().text('看接触').findOne(8000)){
                console.log('跳转住户画像页面成功')
                xj_str+='跳转住户画像页面成功，'
                is_not_continue = true
            }else{
                console.log('跳转住户画像页面异常')
                xj_str+='跳转住户画像页面异常，'
                is_not_continue = false                
            }
        }else{
            console.log('跳转用户列表页面失败')
            xj_str+='跳转用户列表页面失败'
        }
        if(is_not_continue){
            console.log('----开始住户画像界面巡检----')
            //身份证
            var str_id_card = selector().text('身份证').findOne(3000).next().text()
            console.log(str_id_card)
            //积分
            var str_inter = selector().text('积分').findOne(3000).next().text()
            console.log(str_inter)
            if((str_id_card=='--' || str_id_card=='0') && str_inter=='--'){
                console.log('住户画像数据异常')
                xj_str+='住户画像数据异常,'
            }else{
                console.log('住户画像数据显示正常')
                xj_str+='住户画像数据显示正常,'
            }
            /************看套餐************* */
            console.log('----开始巡检看套餐----')
            // selector().text('看套餐').findOne(3000).click()
            sleep(2000)
            try{
                console.log(selector().text('主套餐').findOne(3000).next().text())
                if(selector().text('主套餐').findOne(3000).next().text()=='--'){
                    xj_str+='套餐情况列表数据加载异常'
                    console.log('套餐情况列表数据加载异常,')
                }else{
                    xj_str+='套餐情况列表数据正常'
                    console.log('套餐情况列表数据正常,')                
                }
            }catch(e){
                console.log(e)
                xj_str+='套餐情况列表查找元素异常'
                console.log('套餐情况列表查找元素异常,')                
            }
            //看设备
            try{
                selector().text('看设备').findOne(3000).click()
                sleep(2000)
                console.log(selector().text('换机时间').findOne(3000).next().text())
                if(selector().text('换机时间').findOne(3000).next().text().indexOf('--')==-1){
                    xj_str+='设备情况列表数据正常'
                    console.log('设备情况列表数据正常,')                 
                }else{
                    xj_str+='设备情况列表数据异常'
                    console.log('设备情况列表数据异常,')                 
                }
            }catch(e){
                console.log(e)
                xj_str+='设备情况列表查找元素异常'
                console.log('设备情况列表查找元素异常,')                  
            }
            //看接触
            try{
                selector().text('看接触').findOne(3000).click();
                sleep(3000)
                console.log(selector().text('用户积分').findOne(3000).next().text())
                if(selector().text('用户积分').findOne(3000).next().text()=='--'){
                    xj_str+='看接触列表数据异常'
                    console.log('看接触列表数据异常,')
                }else{
                    xj_str+='看接触列表数据正常'
                    console.log('看接触列表数据正常,')
                }
            }catch(e){
                console.log(e)
                xj_str+='看接触列表查找元素异常'
                console.log('看接触列表查找元素异常,')           
            }
            back_index();
            xj_str+='地盘巡检完成。'
        }
    }catch(e){
        console.log('地盘页面查找元素异常，可能是页面发生了变动，或者升级')
        xj_str +='地盘页面查找元素异常，可能是页面发生了变动，或者升级'
    }finally{
        return xj_str+='地盘巡检完成'
    }
}
//业绩巡检
function performance_view(){
    console.log('====开始业绩巡检====')
    var xj_str = '====开始业绩巡检====\n'
    try{
        selector().text('业绩').findOne(3000).parent().click()
        selector().text('我的业绩').waitFor()
        //网格积分
        console.log('----开始网格积分巡检----\n')
        try{
             xj_str+='----网格积分----\n'
            selector().text('网格积分').findOne(3000).click()
            sleep(1000)
            selector().text('按日').findOne(3000).click()
            sleep(2000)
            selector().text('按月').findOne(3000).parent().next().click()
            sleep(2000)
            automator.gesture(2000, [600, 2001], [600, 2200])
            sleep(2000)
            selector().text('确定').className('android.widget.Button').findOne(2000).click()
            sleep(1000)
            //存量负积分
            console.log(selector().text('存量负积分').findOne(3000).next().text())
            console.log(selector().text('存量负积分').findOne(3000).parent().prev().children()[1].text())
            console.log(selector().text('网格净积分').findOne(3000).next().text())
            if(selector().text('存量负积分').findOne(3000).next().text()=='--' && selector().text('存量负积分').findOne(3000).parent().prev().children()[1].text()=='--' && selector().text('网格净积分').findOne(3000).next().text()=='--'){
                xj_str+='网格积分页面数据加载异常，'
            }else{
                xj_str+='网格积分页面数据加载正常，'
            }
        }catch(e){
            xj_str+='网格积分页面元素查找异常，'
        }
        //渠道积分
        try{
            xj_str+='----渠道积分----\n'
            selector().text('渠道积分').findOne(3000).click()
            sleep(1000)
            console.log(selector().text('揽收积分').findOne(3000).next().text())
            console.log(selector().text('协同积分').findOne(3000).next().text())
            console.log(selector().text('行为积分').findOne(3000).next().text())
            if(selector().text('揽收积分').findOne(3000).next().text()=='--' && selector().text('协同积分').findOne(3000).next().text()=='--' && selector().text('行为积分').findOne(3000).next().text()=='--'){
                xj_str+='渠道积分页面数据加载异常，'
            }else{
                xj_str+='渠道积分页面数据加载正常，'
            }
        }catch(e){
                xj_str+='渠道积分页面元素查找异常，'
        }
        //服务质量
        try{
            xj_str+='----服务质量----\n'
            selector().text('服务质量').findOne(3000).click()
            sleep(1000)
            var str_1 = selector().text('装维评测').findOne(3000).next().text()
            console.log(str_1)
            var rex_1 = str_1.match(/\d+\.\d+/)
            var str_2 = selector().text('本月服务模拟得分').findOne(3000).next().text()
            console.log(str_2)
            var rex_2 = str_2.match(/\d+/g)
            if(rex_1!=null && rex_2!=null){
                xj_str+='服务质量页面数据加载正常,'
            }else{
                xj_str+='服务质量页面数据加载异常,'
            }
        }catch(e){
            xj_str+='服务质量页面元素查找异常，'
        }
    }catch(e){
        console.log('业绩页面元素异常，可能是页面发生了变动或者升级.')
        xj_str+='业绩页面元素异常，可能是页面发生了变动或者升级.'
    }
    finally{
        return xj_str+'业绩巡检完成'
    }
}
//巡检
function inspection(param_str1){
    var xj_str = ''
    /*********************************************规模*********************************************/
    try{
        console.log('---开始'+param_str1+'   规模页面巡检---')
        selector().text('规模').findOne(3000).click()
        sleep(1000)
        var list_arry = []
        //净增
        var insert_jz = selector().textContains('当年累计（').find()[0].next().children()[1]
        list_arry.push(insert_jz)
        console.log(insert_jz.text())
        //新增
        var insert_xz = selector().textContains('当年累计（').find()[0].next().next().children()[1]
        list_arry.push(insert_xz)
        console.log(insert_xz.text())
        //移入
        var mover_yr = selector().textContains('当年累计（').find()[0].next().next().next().children()[1]
        list_arry.push(mover_yc)
        console.log(mover_yr.text())
        //移出
        var mover_yc = selector().textContains('当年累计（').find()[0].next().next().next().next().children()[1]
        list_arry.push(mover_yc)
        console.log(mover_yc.text())
        //流失
        var loss_ls = selector().textContains('当年累计（').find()[0].next().next().next().next().next().children()[1]
        list_arry.push(loss_ls) 
        console.log(loss_ls.text())
        var index_number = 0
        for(var i=0;i<list_arry.length;i++){
            if(list_arry[i]=='--' || list_arry[i]=='0'){
                index_number+=1
            }
        }
        if(index_number>=3){
            console.log(param_str1 + '规模页面数据有问题')
            xj_str+=(param_str1 + '规模页面数据有问题,')
        }else{
            console.log(param_str1 +'规模页面数据正常')
            xj_str+=(param_str1 +'规模页面数据异常,')
        }
    }catch(e){
        console.log(param_str1 +'规模页面查找元素异常')
        xj_str += param_str1 +'规模页面查找元素异常,'
    }
    sleep(1000)
    /***************************************结构********************************************* */
    try{
        console.log('---开始'+param_str1+'   结构页面巡检---') 
        selector().text('结构').findOne(2000).click();
        if(selector().text('套餐结构').findOne(8000)){
            console.log(param_str1+'结构页面加载完成')
            xj_str+=(param_str1+'结构页面加载完成,')
            var number_list = []
            //到达
            var str_daoda = selector().text('融合').findOne(5000).next().text();
            number_list.push(str_daoda)
            console.log(str_daoda)
            //占比
            var str_zhanbi = selector().text('融合').findOne(5000).next().next().text();
            number_list.push(str_zhanbi)
            console.log(str_zhanbi)
            //搭卡率
            var str_dakalv = selector().text('融合').findOne(5000).next().next().next().text();
            number_list.push(str_dakalv)
            console.log(str_dakalv)
            //有约率
            var str_youyuelv =selector().text('融合').findOne(5000).next().next().next().next().text();
            number_list.push(str_youyuelv)
            console.log(str_youyuelv)
            var index_number = 0
            for(var j=0;j<number_list.length;j++){
                if(number_list[j]=='--' || number_list[j]=='0'){
                    index_number +=1
                }
            }
            if(index_number>=3){
                console.log(param_str1 + '结构页面数据异常')
                xj_str+=(param_str1 + '结构页面数据异常,')
            }else{
                console.log(param_str1 +'结构页面数据正常')
                xj_str+=(param_str1 +'结构页面数据正常,')
            }
        }else{
            console.log(param_str1+'结构页面加载异常')
            xj_str+=(param_str1+'结构页面加载异常,')
        }
    }catch(e){
        console.log(param_str1 +'结构页面查找元素异常')
        xj_str += param_str1 +'结构页面查找元素异常,,'        
    }
    sleep(1000)
    /*******************************************流失***************************************** */
    try{
        console.log('---开始'+param_str1+'   流失页面巡检---')
        selector().text('流失').findOne(2000).click();
        sleep(4000)
        //流失量
        str_liushil = selector().text('流失量').findOne(3000).next().text();
        console.log(str_liushil)
        //流失价值
        str_liushi_v = selector().text('流失价值').findOne(3000).next().text()
        console.log(str_liushi_v)
        if(extractNumbers(str_liushil)==null && extractNumbers(str_liushi_v)==null){
            xj_str += param_str1 +'流失页面数据异常，未加载出来,' 
        }else{
            xj_str += param_str1 +'流失页面数据正常,'             
        }
    }catch(e){
        console.log(param_str1 +'流失页面查找元素异常')
        xj_str += param_str1 +'流失页面查找元素异常,' 
    }
    sleep(1000)
    /*****************************************场景******************************************* */
    //有场景按钮的才巡检
    if(param_str1.indexOf('网格视图')!=-1){
        try{
            console.log('---开始'+param_str1+'   场景页面巡检---')
            selector().text('场景').findOne(2000).click();
            sleep(2000)
            xj_str += param_str1 +'场景页面数据正常' 
        }catch(e){
            console.log(param_str1 +'场景页面查找元素异常')
            xj_str += param_str1 +'场景页面查找元素异常,' 
        }
    }
    return xj_str
}
//提取数字
function extractNumbers(str) {  
    try{
        var regex = /\d+/g; // 匹配一个或多个数字
        var matches = str.match(regex);  
        return matches      
    }catch(e){
         return [];
    }

}
//返回主页面
function back_index(){
    for(var i=0;i<4;i++){
        try{
            if(selector().text('工单').findOne(3000)){
                console.log('回到了首页');
                selector().text('工单').findOne(3000).click()
                break
            }else{
                automator.back();
                sleep(1000);
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
//////////////////////////////
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
//发送邮件
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
        var resDict = {}
        for(var i=1;i<excelRow;i++){
            let excelRowData = excel.getRow(excelObj, i);
            resDict[excelRowData[0]] = excelRowData[1]
        }
        excel.close(excelObj)
        console.log(resDict)
        return resDict
    }catch(e){
        excel.close(excelObj)
        return '读取配置表错误，请检查:\n'+e
    }
}
//读取对照表
function readExcel(fileDataPath,sheetName){
    try{
        let excelObj = excel.open(fileDataPath,sheetName)
        let excelRow = excel.getRowCount(excelObj);
        dataDict = {}
        for(var i=1;i<excelRow;i++){
            let excelRowData = excel.getRow(excelObj, i);
            dataDict[String(excelRowData[0])] = String(excelRowData[1])
        }
        excel.close(excelObj)
        return dataDict
    }catch(e){
        excel.close(excelObj)
        return '读取对比表错误，请检查:\n'+e
    }
}
//配置初始化
function init(){
    if(String(readConfig(configPath)).indexOf('错误')==-1){
        configDict = readConfig(configPath)
        console.warn('----配置表读取成功----')
        console.log(configDict)
    }else{
        console.error(readConfig(configPath))
        return false
    }
    console.log('----配置读取完成----')
    return true  
}
//退出帐户
function exitApp(){
    var xj_str = ''
    selector().text('我的工单').findOne(3000).prev().click()
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
//构建主函数
function main(){
    // 确保APP版本号，否之停止执行并提示，三个参数：name、version、msg
    resetDevice()
    var is_not_continue = true
    var app_str = ''
    if(init()){
        var time = get_time();
        var title = String(time) + '----本次营销沙盘巡检已完成，以下是巡检报告:' 
        var host = configDict['邮件服务器']
        var port = configDict['邮件端口']
        var email = configDict['email']
        var passw = configDict['邮件密码']
        var fromPseron = configDict['发件人']
        if(is_not_continue){
            console.log('开始登录')
            if(loginApp(String(configDict['登录账号']),String(configDict['验证码']))){
                console.log('登录成功')
            }else{
                console.log('登录失败')
                app_str +='登录失败'
                is_not_continue = false
            }
        }
        if(is_not_continue){
            if(openH5()){
                console.log('营销沙盘打开成功')
            }else{
                console.log('营销沙盘打开失败，未找到该选项')
                app_str +='营销沙盘打开失败，未找到该选项'
                is_not_continue = false
            }
        }
        if(is_not_continue){
            var str_text =  order_view()+'\n'+
                        territory_view()+'\n'+
                        performance_view()+'\n'+
                        exitApp()+'\n'+
                        '----------------------------------------------------'
            to_email(host,port,email,title,str_text,fromPseron,passw);            
        }else{
            to_email(host,port,email,title,app_str,fromPseron,passw);
        }
         
    }
    automator.home();
}
main();