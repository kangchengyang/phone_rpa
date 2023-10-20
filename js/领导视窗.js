appName = '工作助手新'
appVersion = '3.0.04'
fileDownloadPath = "/storage/emulated/0/rpa/config"
//配置表路径
configPath = fileDownloadPath+'/'+'配置表'+ '_模板.xls'
//配置参数
configDict = {}
//对照表
dataDict = {}
// phone = '17725147730'
/*初始化*/
function resetDevice(){
    console.show()     //显示控制台
    console.clear()   //清空控制台
    console.log("----准备初始化环境----")
    //closeApp()       //关闭后台所有未锁定的App
                     //初始化文件保存路径
    console.log("----环境初始化完成----")
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
        if(selector().textContains('工作台').findOne(10000)){
            console.log('验证成功')
            return true
        }
    }
    console.log('验证失败')
    return false
    
}
//打开领导视窗
function openH5(){
    try{
        selector().text('(新)领导视窗').findOne(10000).parent().click();
        selector().text('main_menu_ico_user').waitFor();
        if(selector().text('首页').findOne(10000)){
            console.log('(新)领导视窗打开成功');
            sleep(3000)
            if (selector().className('android.app.Dialog').findOne(2000)) {
                console.info('跳过弹窗广告');
                selector().className('android.widget.Button').text('确认').findOne(200).click();
                }
            return true
        }else{
            return false
        }
    }catch(e){
        return false
    }

    
}
//用户发展
function user_development(){
    console.log('====开始用户发展巡检====')
    var xj_str = ''
    // var res = ''
    var is_not_continue = true
    try{    
        selector().text('用户发展').findOne(3000).parent().click();
        selector().id('userDay').waitFor(10000)
        if(selector().id('userDay').findOne(3000)){
            console.log('用户发展页面加载完成\n')
        }else{
            console.log('用户发展页面加载异常\n')
            is_not_continue = false
            xj_str = '用户发展页面加载异常\n'
        }
        sleep(2000)
        if(is_not_continue){
            console.log(selector().text('移动').findOne(3000).next().text())
            console.log(selector().text('宽带').findOne(3000).next().text())
            console.log(selector().text('电信电视').findOne(3000).next().text())
            if(selector().text('移动').findOne(3000).next().text()=='--' && selector().text('宽带').findOne(3000).next().text()=='--' && selector().text('电信电视').findOne(3000).next().text()=='--'){
                console.log('用户发展页面数据异常')
                xj_str+='用户发展页面数据异常\n'
                is_not_continue = false
            }else{
                xj_str+='用户发展页面数据正常\n'
                is_not_continue = true
            }
        }
        if(is_not_continue){
            //移动
            xj_str+='---开始用户发展-移动-日-数据查看页巡检---\n'
            //需要加入汇总

            selector().text('移动').findOne(3000).next().click()
            sleep(2000)
            selector().text('移动').findOne(3000).next().click()
            selector().id('data_echarts').waitFor(10000)
            sleep(2000)
            //用户发展-移动-日-----------------------------------------------------------------------------------------
            if(selector().id('data_echarts').findOne(3000)){
                console.log('移动-日，数据页面加载完成')
                var time = selector().id('day_id').findOne(3000).text()
                console.log(time)
                xj_str+=time+':\n'
                xj_str+='用户发展-移动-日-数据查看页面加载完成\n'
                var area_list = selector().className('android.widget.GridView').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                console.log(term_list)
                var temp_list = selector().className('android.widget.GridView').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    value_list.push(values[3].text())
                    value_list.push(values[4].text())
                    // console.log(value_list)
                    var data_com_list = data_com('用户发展-移动-日',term_list,value_list,dataDict,area)
                    if(data_com_list[0]){
                        //未配置的情况
                         config+=1
                    }else if(data_com_list[1]){
                        //数据异常的情况
                        exception+=1
                    }else{
                        //正常的情况
                        normal+=1
                    }
                    user_dve_str+=data_com_list[2]
                }
                xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                xj_str+=user_dve_str
                xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                xj_str+='用户发展-移动-日，数据查看页面加载异常\n'
                xj_str+='------------------\n'
            }

            //用户发展-移动-月-----------------------------------------------------------------------------------------
            selector().text('月发展').findOne(3000).click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            if(selector().id('data_echarts').findOne(3000)){
                console.log('移动-月，数据页面加载完成')
                xj_str+='用户发展-移动-月，数据查看页面加载完成\n'
                var area_list = selector().className('android.widget.GridView').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                console.log(term_list)
                var temp_list = selector().className('android.widget.GridView').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''                
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    value_list.push(values[3].text())
                    value_list.push(values[4].text())
                    // console.log(value_list)
                    var data_com_list = data_com('用户发展-移动-月',term_list,value_list,dataDict,area)
                    if(data_com_list[0]){
                        //未配置的情况
                         config+=1
                    }else if(data_com_list[1]){
                        //数据异常的情况
                        exception+=1
                    }else{
                        //正常的情况
                        normal+=1
                    }
                    user_dve_str+=data_com_list[2]
                }
                xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                xj_str+=user_dve_str
                xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                xj_str+='用户发展-移动-月，数据查看页面加载异常\n'
                xj_str+='------------------\n'
            }    
            automator.back()//返回上一页
            sleep(1000)
            automator.back()
            //用户发展-宽带-日----------------------------------------------------------------------------------
            xj_str+='---用户发展-宽带-日，数据查看页巡检---\n'
            selector().text('宽带').findOne(3000).next().click()
            sleep(2000)
            selector().text('宽带总量').findOne(3000).next().click()
            selector().id('data_echarts').waitFor(10000)
            sleep(2000)
            if(selector().id('data_echarts').findOne(3000)){
                var time = selector().id('day_id').findOne(3000).text()
                console.log(time)
                xj_str+=time+':\n'                
                console.log('宽带数据界面加载完成')
                xj_str+='宽带-日，数据界面加载完成\n'
                var area_list = selector().className('android.widget.GridView').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                var temp_list = selector().className('android.widget.GridView').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    var data_com_list = data_com('用户发展-宽带-日',term_list,value_list,dataDict,area)
                    if(data_com_list[0]){
                        //未配置的情况
                         config+=1
                    }else if(data_com_list[1]){
                        //数据异常的情况
                        exception+=1
                    }else{
                        //正常的情况
                        normal+=1
                    }
                    user_dve_str+=data_com_list[2]
                }
                xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                xj_str+=user_dve_str
                xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                 xj_str+='用户发展-宽带-日，宽带总量数据查看页面加载异常\n'
                 xj_str+='------------------\n'
            }
            //用户发展-宽带-月-------------------------------------------------------------------------------------------
            selector().text('月发展').findOne(3000).click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            if(selector().id('data_echarts').findOne(3000)){
                console.log('宽带数据界面加载完成')
                xj_str+='宽带-月，数据界面加载完成\n'
                var area_list = selector().className('android.widget.GridView').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                var temp_list = selector().className('android.widget.GridView').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    var data_com_list = data_com('用户发展-宽带-月',term_list,value_list,dataDict,area)
                    if(data_com_list[0]){
                        //未配置的情况
                         config+=1
                    }else if(data_com_list[1]){
                        //数据异常的情况
                        exception+=1
                    }else{
                        //正常的情况
                        normal+=1
                    }
                    user_dve_str+=data_com_list[2]
                }
                xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                xj_str+=user_dve_str
                xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                 xj_str+='用户发展-宽带-月，宽带总量数据查看页面加载异常\n'
                 xj_str+='------------------\n'
            }        
            automator.back()//返回上一页
            sleep(1000)
            automator.back()

            //用户发展-电信电视-日------------------------------------------------------------------------------
            xj_str+='---开始用户发展-电信电视-日，数据查看页巡检---\n'
            selector().text('电信电视').findOne(3000).next().click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            sleep(2000)
            if(selector().id('data_echarts').findOne(3000)){
                var time = selector().id('day_id').findOne(3000).text()
                console.log(time)
                xj_str+=time+':\n'                
                console.log('电信电视界面加载完成')
                xj_str+='电信电视-日，界面加载完成\n'
                var area_list = selector().className('android.widget.GridView').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                var temp_list = selector().className('android.widget.GridView').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    var data_com_list = data_com('用户发展-电信电视-日',term_list,value_list,dataDict,area)
                    if(data_com_list[0]){
                        //未配置的情况
                         config+=1
                    }else if(data_com_list[1]){
                        //数据异常的情况
                        exception+=1
                    }else{
                        //正常的情况
                        normal+=1
                    }
                    user_dve_str+=data_com_list[2]
                }
                xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                xj_str+=user_dve_str
                xj_str+='------------------\n'
            }else{
                 xj_str+='用户发展-电信电视-日，数据查看页面加载异常\n'
                 xj_str+='------------------\n'
            }


            //用户发展-电信电视-月-------------------------------------------------------------------------------------
            selector().text('月发展').findOne(3000).click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            if(selector().id('data_echarts').findOne(3000)){
                console.log('电信电视界面加载完成')
                xj_str+='电信电视-日，界面加载完成\n'
                var area_list = selector().className('android.widget.GridView').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                var temp_list = selector().className('android.widget.GridView').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    var data_com_list = data_com('用户发展-电信电视-日',term_list,value_list,dataDict,area)
                    if(data_com_list[0]){
                        //未配置的情况
                         config+=1
                    }else if(data_com_list[1]){
                        //数据异常的情况
                        exception+=1
                    }else{
                        //正常的情况
                        normal+=1
                    }
                    user_dve_str+=data_com_list[2]
                }
                xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                xj_str+=user_dve_str
                xj_str+='------------------\n'
            }else{
                 xj_str+='用户发展-电信电视-日，数据查看页面加载异常\n'
                 xj_str+='------------------\n'
            }
            back_index()//返回首页
            return xj_str+='====用户发展选项卡巡检完成===='
            
        }else{
            console.log('====用户发展巡检完成====')
            return xj_str
        }
    }catch(e){
        console.log('用户发展页面查找元素异常')
        xj_str+='用户发展页面查找元素异常,'
        back_index()//返回首页
        return xj_str
    }
}

//数据对比
function data_com(from_str,term_list,value_list,dict_data,area){
    /***
     * from_str:从哪进来的------sheet页
     * term_list：循环项
     * value_list: 需要比对的值
     * dict_data：对比的数据源
     * area: 地区
     */
    var str_1 = ''
    var exception = false
    var configured = false
    dict = dict_data[from_str]
    for(var i=0;i<term_list.length;i++){
        try{
            if(area in dict){
                var values = dict[area][term_list[i]].split('-')//新增：'100-507'
                console.log(values)
                if((parseInt(value_list[i])>parseInt(values[0])) && (parseInt(value_list[i])<=parseInt(values[1]))){
                    console.log('开始比较')
                    console.log(from_str+'--'+area+':'+term_list[i]+' '+value_list[i]+'--在'+'对照表---'+term_list[i]+'区间 '+dict[area][term_list[i]]+'内，数据正常')
                }else{
                    exception = true
                    console.log(from_str+'--'+area+':'+term_list[i]+' '+value_list[i]+'--不在'+'对照表---'+term_list[i]+'区间  '+dict[area][term_list[i]]+'内，数据异常\n')
                    str_1+=from_str+'--'+area+':'+term_list[i]+' '+value_list[i]+'--不在'+'对照表---'+term_list[i]+'区间  '+dict[area][term_list[i]]+'内，数据异常\n'
                }
            }else{
                configured = true
                console.log(from_str+'地区: '+area+' 在配置表未配置\n')
                str_1+= (from_str+'地区: '+area+' 在配置表未配置\n')
                break
            }

        }catch(e){
            console.log(area+':'+term_list[i]+' '+value_list[i]+'发生异常\n')
            console.log(e)
            str_1+= area+':'+term_list[i]+' '+value_list[i]+'发生异常\n'
        }
    }
    return [configured,exception,str_1]                   
}

//过网分析
function network_analysis(){
    console.log('====开始过网分析巡检====\n')
    var xj_str='====开始过网分析巡检====\n'
    try{
        selector().text('过网分析').findOne(3000).parent().click()
        selector().idContains('chart').waitFor(10000)
        //过网分析-日新增----------------------------------------------------------------------------------------
        if(selector().idContains('chart').findOne(3000)){
            var time = selector().id('opTime').findOne(3000).text()
            console.log(time)
            xj_str+=time+':\n'            
            console.log('过网分析-日新增，数据页面加载完成')
            xj_str+='过网分析-日新增，数据查看页面加载完成\n'
            var area_list = selector().className('android.widget.GridView').findOne(3000).children()[0].children()
            var term_list = []
            for(var term=1;term<area_list.length;term++){
                term_list.push(area_list[term].text().replace(' ',''))
            }
            console.log(term_list)
            var temp_list = selector().className('android.widget.GridView').findOne(3000).next().children()
            var exception = 0
            var config = 0
            var normal = 0
            var user_dve_str = ''
            for(var temp=0;temp<temp_list.length;temp++){
                var value_list = []
                var values = temp_list[temp].children()
                var area = values[0].text()
                value_list.push(values[1].text().split(' ')[0])
                value_list.push(values[2].text().split(' ')[0])
                value_list.push(values[3].text().split(' ')[0])
                // console.log(value_list)
                var data_com_list = data_com('过网分析-日新增',term_list,value_list,dataDict,area)
                if(data_com_list[0]){
                    //未配置的情况
                        config+=1
                }else if(data_com_list[1]){
                    //数据异常的情况
                    exception+=1
                }else{
                    //正常的情况
                    normal+=1
                }
                user_dve_str+=data_com_list[2]
            }
            xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
            xj_str+=user_dve_str
            xj_str+='------------------\n'
            // console.log(xj_str)
        }else{
             console.log('过网分析-日新增，页面加载异常')
            xj_str +='过网分析-日新增，页面加载异常\n'
            xj_str+='------------------\n'  
        }
        //过网分析-日净增----------------------------------------------------------------------------------------
        selector().text('日净增').findOne(3000).click();
        sleep(2000)
        selector().idContains('chart').waitFor(10000)
        if(selector().idContains('chart').findOne(3000)){
            console.log('过网分析-日净增，数据页面加载完成')
            xj_str+='过网分析-日净增，数据查看页面加载完成\n'
            var area_list = selector().className('android.widget.GridView').findOne(3000).children()[0].children()
            var term_list = []
            for(var term=1;term<area_list.length;term++){
                term_list.push(area_list[term].text().replace(' ',''))
            }
            console.log(term_list)
            var temp_list = selector().className('android.widget.GridView').findOne(3000).next().children()
            var exception = 0
            var config = 0
            var normal = 0
            var user_dve_str = ''
            for(var temp=0;temp<temp_list.length;temp++){
                var value_list = []
                var values = temp_list[temp].children()
                var area = values[0].text()
                value_list.push(values[1].text().split(' ')[0])
                value_list.push(values[2].text().split(' ')[0])
                value_list.push(values[3].text().split(' ')[0])
                // console.log(value_list)
                var data_com_list = data_com('过网分析-日净增',term_list,value_list,dataDict,area)
                if(data_com_list[0]){
                    //未配置的情况
                        config+=1
                }else if(data_com_list[1]){
                    //数据异常的情况
                    exception+=1
                }else{
                    //正常的情况
                    normal+=1
                }
                user_dve_str+=data_com_list[2]
            }
            xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
            xj_str+=user_dve_str
            xj_str+='------------------\n'
            // console.log(xj_str)
        }else{
             console.log('过网分析-日净增，页面加载异常')
            xj_str +='过网分析-日净增，页面加载异常\n'
            xj_str+='------------------\n'  
        }
        back_index()
        return xj_str+'====过网分析页面巡检完成====\n'
    }catch(e){
        console.log('过网分析页面查找元素异常\n'+e)
        xj_str +='过网分析页面查找元素异常\n'
        xj_str+='------------------\n'
        return xj_str
    }
}

//千兆5G
function kilomega_5G(){
    var xj_str='====开始千兆5G巡检====\n'
    console.log('====开始千兆5G巡检====')
    var is_not_continue = true
    try{
        selector().text('千兆及5G').findOne(3000).parent().click()
        sleep(1000)
        selector().textContains('千兆及5G').waitFor(10000)
        sleep(2000)
        if(selector().text('千兆发展及权益').findOne(3000)){
            console.log('千兆及5G页面加载完成')
            xj_str+='千兆及5G页面加载完成\n'
        }else{
            console.log('千兆及5G页面加载异常')
            vxj_str+='千兆及5G页面加载异常\n'
            is_not_continue = false            
        }
        sleep(2000)
    }catch(e){
        return xj_str+='千兆5G页面查找元素异常\n'
    }
    if(is_not_continue){
        //千兆发展及权益
        try{
            //千兆发展及权益
            selector().text('千兆发展及权益').findOne(3000).next().click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            //千兆及5G-千兆发展及权益-日-------------------------------------------------------------------------
            if(selector().id('data_echarts').findOne(3000)){
                var time = selector().id('day_id').findOne(3000).text()
                console.log(time)
                xj_str+=time+':\n'               
                console.log('千兆及5G-千兆发展及权益-日，数据页面加载完成')
                xj_str+='千兆及5G-千兆发展及权益-日，数据查看页面加载完成\n'
                var area_list = selector().id('column_title').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                console.log(term_list)
                var temp_list = selector().id('column_title').findOne(3000).next().children()
                // console.log(temp_list.length)
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    // console.log(area)
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    value_list.push(values[3].text())
                    // console.log(value_list)
                    var data_com_list = data_com('千兆及5G-千兆发展及权益-日',term_list,value_list,dataDict,area)
                    if(data_com_list[0]){
                        //未配置的情况
                         config+=1
                    }else if(data_com_list[1]){
                        //数据异常的情况
                        exception+=1
                    }else{
                        //正常的情况
                        normal+=1
                    }
                    user_dve_str+=data_com_list[2]
                }
                xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                xj_str+=user_dve_str
                xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                xj_str+='千兆及5G-千兆发展及权益-日，数据查看页面加载异常\n'
                xj_str+='------------------\n'
            }
            selector().text('月发展').findOne(3000).click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            //千兆及5G-千兆发展及权益-月-------------------------------------------------------------------------
            if(selector().id('data_echarts').findOne(3000)){
                var time = selector().id('day_id').findOne(3000).text()
                console.log(time)
                xj_str+=time+':\n'                 
                console.log('千兆及5G-千兆发展及权益-月，数据页面加载完成')
                xj_str+='千兆及5G-千兆发展及权益-月，数据查看页面加载完成\n'
                var area_list = selector().id('column_title').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                console.log(term_list)
                var temp_list = selector().id('column_title').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''                
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    value_list.push(values[3].text())
                    value_list.push(values[4].text())
                    console.log(value_list)
                    var data_com_list = data_com('千兆及5G-千兆发展及权益-月',term_list,value_list,dataDict,area)
                    if(data_com_list[0]){
                        //未配置的情况
                         config+=1
                    }else if(data_com_list[1]){
                        //数据异常的情况
                        exception+=1
                    }else{
                        //正常的情况
                        normal+=1
                    }
                    user_dve_str+=data_com_list[2]
                }
                xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                xj_str+=user_dve_str
                xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                xj_str+='千兆及5G-千兆发展及权益-月，数据查看页面加载异常\n'
                xj_str+='------------------\n'
            }
            automator.back()
            sleep(2000)
        }catch(e){
            console.log('千兆及5G-千兆发展及权益,数据页面查找元素异常\n'+e)
            for(var i=0;i<5;i++){
                if(selector().textContains('千兆及5G').findOne(2000)){
                    console.log('回到了数据页');
                    break
                }else{
                    automator.back();
                    sleep(1000);
                }
            }            
        }
        //500M发展及权益
        try{
            selector().text('500M发展及权益').findOne(3000).next().click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            //千兆及5G-500M发展及权益-日-------------------------------------------------------------------------
            if(selector().id('data_echarts').findOne(3000)){
                var time = selector().id('day_id').findOne(3000).text()
                console.log(time)
                xj_str+=time+':\n'                 
                console.log('千兆及5G-500M发展及权益-日，数据页面加载完成')
                xj_str+='千兆及5G-500M发展及权益-日，数据查看页面加载完成\n'
                var area_list = selector().id('column_title').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                console.log(term_list)
                var temp_list = selector().id('column_title').findOne(3000).next().children()
                // console.log(temp_list.length)
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    // console.log(area)
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    value_list.push(values[3].text())
                    console.log(value_list)
                    // var data_com_list = data_com('千兆及5G-500M发展及权益-日',term_list,value_list,dataDict,area)
                    // if(data_com_list[0]){
                    //     //未配置的情况
                    //      config+=1
                    // }else if(data_com_list[1]){
                    //     //数据异常的情况
                    //     exception+=1
                    // }else{
                    //     //正常的情况
                    //     normal+=1
                    // }
                    // user_dve_str+=data_com_list[2]
                }
                // xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                // xj_str+=user_dve_str
                // xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                xj_str+='千兆及5G-500M发展及权益-日，数据查看页面加载异常\n'
                xj_str+='------------------\n'
            }
            selector().text('月发展').findOne(3000).click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            //千兆及5G-500M发展及权益-月-------------------------------------------------------------------------
            if(selector().id('data_echarts').findOne(3000)){
                console.log('千兆及5G-500M发展及权益-月，数据页面加载完成')
                xj_str+='千兆及5G-500M发展及权益-月，数据查看页面加载完成\n'
                var area_list = selector().id('column_title').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                console.log(term_list)
                var temp_list = selector().id('column_title').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''                
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    value_list.push(values[3].text())
                    value_list.push(values[4].text())
                    console.log(value_list)
                    // var data_com_list = data_com('千兆及5G-500M发展及权益-月',term_list,value_list,dataDict,area)
                    // if(data_com_list[0]){
                    //     //未配置的情况
                    //      config+=1
                    // }else if(data_com_list[1]){
                    //     //数据异常的情况
                    //     exception+=1
                    // }else{
                    //     //正常的情况
                    //     normal+=1
                    // }
                    // user_dve_str+=data_com_list[2]
                }
                // xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                // xj_str+=user_dve_str
                // xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                xj_str+='千兆及5G-500M发展及权益-月，数据查看页面加载异常\n'
                xj_str+='------------------\n'
            }
            automator.back()
            sleep(2000)
        }catch(e){
            console.log('千兆及5G-500M发展及权益,数据页面查找元素异常\n'+e)
            for(var i=0;i<5;i++){
                if(selector().textContains('千兆及5G').findOne(2000)){
                    console.log('回到了数据页');
                    break
                }else{
                    automator.back();
                    sleep(1000);
                }
            }             
        }
        //239及以上发展
        try{
            selector().text('239及以上发展').findOne(3000).next().click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            //千兆及5G-239及以上发展-日-------------------------------------------------------------------------
            if(selector().id('data_echarts').findOne(3000)){
                var time = selector().id('day_id').findOne(3000).text()
                console.log(time)
                xj_str+=time+':\n'                 
                console.log('千兆及5G-239及以上发展-日，数据页面加载完成')
                xj_str+='千兆及5G-239及以上发展-日，数据查看页面加载完成\n'
                var area_list = selector().id('column_title').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                console.log(term_list)
                var temp_list = selector().id('column_title').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''                
                // console.log(temp_list.length)
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    // console.log(area)
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    value_list.push(values[3].text())
                    value_list.push(values[4].text())
                    console.log(value_list)
                    // var data_com_list = data_com('千兆及5G-239及以上发展-日',term_list,value_list,dataDict,area)
                    // if(data_com_list[0]){
                    //     //未配置的情况
                    //      config+=1
                    // }else if(data_com_list[1]){
                    //     //数据异常的情况
                    //     exception+=1
                    // }else{
                    //     //正常的情况
                    //     normal+=1
                    // }
                    // user_dve_str+=data_com_list[2]
                }
                // xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                // xj_str+=user_dve_str
                // xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                xj_str+='千兆及5G-239及以上发展-日，数据查看页面加载异常\n'
                xj_str+='------------------\n'
            }
            selector().text('月发展').findOne(3000).click()
            sleep(2000)
            selector().id('data_echarts').waitFor(10000)
            //千兆及5G-239及以上发展-月-------------------------------------------------------------------------
            if(selector().id('data_echarts').findOne(3000)){
                console.log('千兆及5G-239及以上发展-月，数据页面加载完成')
                xj_str+='千兆及5G-239及以上发展-月，数据查看页面加载完成\n'
                var area_list = selector().id('column_title').findOne(3000).children()[0].children()
                var term_list = []
                for(var term=1;term<area_list.length;term++){
                    term_list.push(area_list[term].text())
                }
                console.log(term_list)
                var temp_list = selector().id('column_title').findOne(3000).next().children()
                var exception = 0
                var config = 0
                var normal = 0
                var user_dve_str = ''
                for(var temp=0;temp<temp_list.length;temp++){
                    var value_list = []
                    var values = temp_list[temp].children()
                    var area = values[0].text()
                    value_list.push(values[1].text())
                    value_list.push(values[2].text())
                    value_list.push(values[3].text())
                    value_list.push(values[4].text())
                    console.log(value_list)
                    // var data_com_list = data_com('千兆及5G-239及以上发展-月',term_list,value_list,dataDict,area)
                    // if(data_com_list[0]){
                    //     //未配置的情况
                    //      config+=1
                    // }else if(data_com_list[1]){
                    //     //数据异常的情况
                    //     exception+=1
                    // }else{
                    //     //正常的情况
                    //     normal+=1
                    // }
                    // user_dve_str+=data_com_list[2]
                }
                // xj_str+='正常'+String(normal)+'项，异常'+String(exception)+'项，未配置'+String(config)+'项，异常内容：\n'
                // xj_str+=user_dve_str
                // xj_str+='------------------\n'
                // console.log(xj_str)
            }else{
                xj_str+='千兆及5G-239及以上发展-月，数据查看页面加载异常\n'
                xj_str+='------------------\n'
            }
        }catch(e){
            console.log('千兆及5G-239及以上发展,数据页面查找元素异常\n'+e)
            for(var i=0;i<5;i++){
                if(selector().textContains('千兆及5G').findOne(2000)){
                    console.log('回到了数据页');
                    break
                }else{
                    automator.back();
                    sleep(1000);
                }
            }             
        }
    }
    back_index()
    return xj_str +='====千兆及5G巡检完成===='    
}
//数字生活
function digital_living(){
    var xj_str='====开始数字生活巡检====\n'
    console.log('====开始数字生活巡检====')
    var is_not_continue = true
    try{
        selector().text('数字生活').findOne(3000).parent().click()
        sleep(1000)
        selector().textContains('数字生活').waitFor(10000)
        sleep(2000)
        if(selector().text('天翼看家').findOne(3000)){
            console.log('数字生活页面加载完成')
            xj_str+='数字生活页面加载完成\n'
        }else{
            console.log('数字生活页面加载异常')
            xj_str+='数字生活页面加载异常\n'
            is_not_continue = false            
        }
        sleep(2000)
        if(is_not_continue){
            //每一项巡检
            var key_list = selector().text('日新增').find() //应该至少有5个
            var term_list = []
            for(var i=0;i<key_list.length;i++){
                term_list.push(key_list[i].parent().prev().children()[0].text())
            }
            console.log(term_list)
            for(var i=0;i<term_list.length;i++){
                var term_name = term_list[i]
                try{
                    console.log('----开始'+term_name+'巡检----')
                    selector().text(term_name).findOne(3000).next().click();
                    selector().text('全市').waitFor(10000)
                    sleep(1000)
                    var citys = selector().text('全市').find()[1].parent().children()
                    var index_num = 0
                    var is_erro = false
                    for(var k=1;k<citys.length;k++){
                        if(citys[k]=='--'){
                            console.log(term_name+'数据查看页数据异常有的数字为--')
                            xj_str+=term_name+'数据查看页数据异常有的数字为--,'
                            is_erro = true
                            break
                        }else if(citys[k]=='0'){
                            index_num+=1
                        }
                    }
                    if(index_num==citys.length){
                        console.log(term_name+'数据查看页数据异常数字都是0')
                        xj_str+=term_name+'数据查看页数据异常数字都是0,'                        
                    }else if(!is_erro){
                        console.log(term_name+'数据查看页数据正常')
                        xj_str+=term_name+'数据查看页数据正常,'                         
                    }
                    xj_str+=term_name+'巡检完成\n'
                    console.log(term_name+'巡检完成\n')
                    for(var j=0;j<5;j++){
                        if(selector().textContains('数字生活').findOne(2000)){
                            console.log('回到了数据页');
                            break
                        }else{
                            automator.back();
                            sleep(1000);
                        }                        
                    }
                    sleep(3000);
                }catch(e){
                    console.log('在操作'+term_name+'页面的时候查找元素异常')
                    xj_str+='在操作'+term_name+'页面的时候查找元素异常\n'
                    for(var j=0;j<5;j++){
                        if(selector().textContains('千兆及5G').findOne(2000)){
                            console.log('回到了数据页');
                            break
                        }else{
                            automator.back();
                            sleep(1000);
                        }                        
                    }
                }

            }
        }
        back_index()
        return xj_str +='====数字生活巡检完成===='
    }catch(e){
        return xj_str+='数字生活页面查找元素异常\n'
    }    
}
//收入进度
function reven_Progress(){
    console.log('====开始收入进度巡检====\n')
    var xj_str='====开始收入进度巡检====\n'
    try{
        selector().text('收入进度').findOne(3000).parent().click()
        selector().idContains('data_echarts').waitFor(10000)
        if(selector().text('地区').findOne(3000)){
            console.log('收入进度页加载出来了')
            xj_str +='收入进度页面加载正常\n'
            var city_child = selector().text('全市').find()[1].parent().children()
            var is_meet = false
            for(var i=1;i<city_child.length;i++){
                console.log(city_child[i].text())
                if(city_child[i].text()=='--'){
                    console.log(city_child[i].text())
                    is_meet = true
                    break
                }
            }
            if(!is_meet){
                console.log('收入进度页数据加载正常')
                xj_str +='收入进度页数据加载正常\n'
            }else{
                console.log('收入进度页数据加载异常')
                xj_str +='收入进度页数据加载异常\n'
            }
        }else{
             console.log('收入进度页面加载异常')
            xj_str +='收入进度页面加载异常\n'           
        }
        back_index()
        return xj_str+'====收入进度页面巡检完成====\n'
    }catch(e){
        console.log('收入进度页面查找元素异常')
        xj_str +='收入进度页面查找元素异常\n'
        return xj_str
    }
}
//抢先看
function first_look(){
    console.log('====开始抢先看选项巡检====')
    var xj_str = '====开始抢先看选项巡检===='
    try{
        selector().text('抢先看').findOne(3000).click()
        selector().textContains('用户发展').waitFor(10000)
        if(selector().textContains('用户发展').findOne(3000)){
            console.log('抢先看-用户发展页加载完成')
            xj_str+='抢先看-用户发展页加载完成,'
        }else{
            console.log('抢先看-用户发展数据页加载异常')
            return xj_str+='抢先看-用户发展，数据页加载异常,'
        }
    }catch(e){
        console.log('选项卡抢先看查找元素异常')
        xj_str+='选项卡抢先看查找元素异常\n'
        return xj_str
    }    
    sleep(2000)
    //抢先看-用户发展---------------------------------------------------------
    try{
        xj_str+='开始抢先看-用户发展，巡检'
        var time = selector().id('cdma_title').findOne(3000).text()
        console.log(time)
        xj_str+=time+':\n'                 
        var titles = ['新增','净增','到达']
        list_yidong=[]
        list_kuandai=[]
        list_dianxindianshi=[]
        var inserts = selector().text('新增').find()
        var jing_inserts = selector().text('净增').find()
        var daoda = selector().text('到达').find()
        // console.log(inserts.length)
        //新增值
        list_yidong.push(inserts[0].prev().text())
        list_kuandai.push(inserts[1].prev().text())
        list_dianxindianshi.push(inserts[3].prev().text())
        //净增值
        list_yidong.push(jing_inserts[0].prev().text())
        list_kuandai.push(jing_inserts[1].prev().text())
        list_dianxindianshi.push(jing_inserts[3].prev().text())
        //到达值 
        list_yidong.push(daoda[0].prev().text())
        list_kuandai.push(daoda[1].prev().text())
        list_dianxindianshi.push(daoda[3].prev().text())
        console.log(list_yidong)
        console.log(list_kuandai) 
        console.log(list_dianxindianshi)
        //开始比较
        xj_str+=data_com('抢先看-用户发展',titles,list_yidong,dataDict,'移动')[2]
        xj_str+=data_com('抢先看-用户发展',titles,list_kuandai,dataDict,'宽带')[2]
        xj_str+=data_com('抢先看-用户发展',titles,list_dianxindianshi,dataDict,'电信电视')[2]
        xj_str+='抢先看-用户发展，巡检完成。'    
    }catch(e){
        console.log('抢先看-用户发展页面查找元素异常\n'+e)
        xj_str+='抢先看-用户发展页面查找元素异常\n'
    }
    sleep(2000)
    //抢先看-过网分析---------------------------------------------------------------
    try{
        xj_str+='开始抢先看-过网分析，巡检。'        
        selector().text('过网分析').findOne(3000).click()
        sleep(2000)
        selector().id('cdma_title').textContains('过网分析').waitFor(10000)
        if(selector().id('cdma_title').textContains('过网分析').findOne(3000)){
            var time = selector().id('cdma_title').findOne(3000).text()
            console.log(time)
            xj_str+=time+':\n'             
            console.log('抢先看-过网分析页面加载完成')
            var titles = ['新增','净增','到达']
            var dianxin_list = []
            var liantong_list = []
            var yiodng_list = []
            var dianxins = selector().text('电信').find()
            var liantongs = selector().text('联通').find()
            var yidongs = selector().text('移动').find()
            //电信
            for(var i=0;i<dianxins.length;i++){
                dianxin_list.push(dianxins[i].prev().text())
            }
            //联通
            for(var i=0;i<liantongs.length;i++){
                liantong_list.push(liantongs[i].prev().text())
            }
            //移动
            for(var i=0;i<yidongs.length;i++){
                yiodng_list.push(yidongs[i].prev().text())
            }
            console.log(dianxin_list)
            console.log(liantong_list)
            console.log(yiodng_list)
            xj_str+=data_com('抢先看-过网分析',titles,dianxin_list,dataDict,'电信')[2]
            xj_str+=data_com('抢先看-过网分析',titles,liantong_list,dataDict,'联通')[2]
            xj_str+=data_com('抢先看-过网分析',titles,yiodng_list,dataDict,'移动')[2]
            xj_str+='抢先看-过网分析，巡检完成。'
            automator.back()//返回上级
        }else{
            console.log('抢先看-5G,页面加载异常\n')
            xj_str+='抢先看-5G,页面加载异常\n'   
            for(var i=0;i<5;i++){
                if(selector().id('cdma_title').textContains('用户发展').findOne(2000)){
                    console.log('回到了数据页');
                    break
                }else{
                    automator.back();
                    sleep(1000);
                }
            }                
        }
        sleep(2000)
    }catch(e){
        console.log('抢先看-过网分析,页面查找元素异常\n'+e)
        xj_str+='抢先看-过网分析,页面查找元素异常\n'
        for(var i=0;i<5;i++){
            if(selector().id('cdma_title').textContains('用户发展').findOne(2000)){
                console.log('回到了数据页');
                break
            }else{
                automator.back();
                sleep(1000);
            }
        }                
    }
    sleep(2000)
    //抢先看-5G---------------------------------------------------------------------
    try{
        xj_str+='开始抢先看-5Gu，巡检。'
        selector().text('5G').findOne(3000).click()
        selector().id('cdma_title').textContains('5G发展').waitFor(10000)
        sleep(2000)
        if(selector().id('cdma_title').textContains('5G发展').findOne(3000)){
            var time = selector().id('cdma_title').findOne(3000).text()
            console.log(time)
            xj_str+=time+':\n'             
            var list_5G_day = []
            var list_5G_user =[]
            var list_5G_vip= []
            var list_qyadndyy = []
            var titles = []
            var insert_nums = selector().text('当日订购').find()
            // console.log(taocans[0].next().next().next().text())
            //5G套餐日发展量
            list_5G_day.push(insert_nums[0].next().text())
            list_5G_day.push(insert_nums[0].next().next().next().text())
            list_5G_day.push(insert_nums[0].next().next().next().next().next().text())
            titles = ['新增量','其中主套餐','其中升级包']
            console.log(list_5G_day)
            xj_str+=data_com('抢先看-5G',titles,list_5G_day,dataDict,'5G套餐日发展量')[2]
            //5G套餐日发展用户量
            list_5G_user.push(insert_nums[1].next().text())
            list_5G_user.push(insert_nums[1].next().next().next().text())
            list_5G_user.push(insert_nums[1].next().next().next().next().next().text())
            titles = ['新增','新用户','老用户']
            xj_str+=data_com('抢先看-5G',titles,list_5G_user,dataDict,'5G套餐日发展用户量')[2]
            console.log(list_5G_user)
            //5G会员
            list_5G_vip.push(insert_nums[2].next().text())
            list_5G_vip.push(insert_nums[2].next().next().next().text())
            list_5G_vip.push(insert_nums[2].next().next().next().next().next().text())
            titles = ['5g会员','黄金会员','白金会员']
            xj_str+=data_com('抢先看-5G',titles,list_5G_vip,dataDict,'5G会员')[2]
            console.log(list_5G_vip)
            //5G权益和应用
            list_qyadndyy.push(insert_nums[3].next().text())
            list_qyadndyy.push(insert_nums[3].next().next().next().text())
            list_qyadndyy.push(insert_nums[3].next().next().next().next().next().text())
            titles = ['权益','应用权益','生态权益']
            xj_str+=data_com('抢先看-5G',titles,list_qyadndyy,dataDict,'5G权益和应用')[2]
            console.log(list_qyadndyy)
            xj_str+='开始抢先看-5Gu，巡检完成。'
            automator.back()
        }else{
            console.log('抢先看-5G,页面加载异常\n')
            xj_str+='抢先看-5G,页面加载异常\n' 
            for(var i=0;i<5;i++){
                if(selector().id('cdma_title').textContains('用户发展').findOne(2000)){
                    console.log('回到了数据页');
                    break
                }else{
                    automator.back();
                    sleep(1000);
                }
            }              
        }
    }catch(e){
        console.log('抢先看-5G,页面查找元素异常\n'+e)
        xj_str+='抢先看-5G,页面查找元素异常\n'
        for(var i=0;i<5;i++){
            if(selector().id('cdma_title').textContains('用户发展').findOne(2000)){
                console.log('回到了数据页');
                break
            }else{
                automator.back();
                sleep(1000);
            }
        }  
    }
    sleep(2000)
    //携号转网
    try{
        selector().text('携号转网').findOne(3000).click()
        sleep(2000)
        selector().id('jxr_chart').waitFor(10000)
        if(selector().id('jxr_chart').findOne(3000)){
            var time = selector().id('cdma_title').findOne(3000).text()
            console.log(time)
            xj_str+=time+':\n'             
            console.log('抢先看-携号转网,页面加载完成。')
            selector().text('携入').findOne().click()
            var titles = ['携入','携出','净携入']
            var xierus = selector().text('携入').find()
            var xiechus = selector().text('携出').find()
            var jingxieru = selector().text('净携入').find()
            //重庆电信
            var chongqingdianxin = [xierus[0].next().text(),xiechus[0].next().text(),jingxieru[0].next().text()]
            console.log(chongqingdianxin)
            xj_str+=data_com('抢先看-携号转网',titles,chongqingdianxin,dataDict,'重庆电信')[2]
            //重庆移动
            var chongqingyidong = [xierus[1].next().text(),xiechus[1].next().text(),jingxieru[1].next().text()]
            console.log(chongqingyidong)
            xj_str+=data_com('抢先看-携号转网',titles,chongqingyidong,dataDict,'重庆移动')[2]
            //重庆联通
            var chongqingliantong = [xierus[2].next().text(),xiechus[2].next().text(),jingxieru[2].next().text()]
            console.log(chongqingliantong)
            xj_str+=data_com('抢先看-携号转网',titles,chongqingliantong,dataDict,'重庆联通')[2]
            xj_str+='抢先看-携号转网，巡检完成'
        }else{
            console.log('抢先看-携号转网,页面加载异常\n')
            xj_str+='抢先看-携号转网,页面加载异常\n' 
        }
    }catch(e){
        console.log('抢先看-携号转网,页面查找元素异常\n')
        xj_str+='抢先看-携号转网,页面查找元素异常\n' 
    }
    back_index()//返回首页
    return xj_str+='选项卡抢先看巡检完成\n'
}
//实时看数
function realtime_reading(){
    console.log('====开始实时看数选项卡巡检====')
    var xj_str='====开始实时看数选项卡巡检====\n'
    var is_not_continue = true
    try{
        selector().text('实时看数').findOne(3000).click()
        sleep(2000)
        selector().textContains('实时看数').waitFor(10000)
        if(selector().textContains('今日').textContains('昨日').textContains('环比差异').findOne(3000)){
            console.log('实时看数选项卡加载完成')
            xj_str+='实时看数选项卡加载完成,'
        }else{
            is_not_continue =false
            xj_str+='实时看数选项卡加载异常,'
        }
        if(is_not_continue){
            var str_list = selector().textContains('今日').textContains('昨日').textContains('环比差异').find()
            var is_meet = false
            var index_num = 0
            for(var i=0;i<str_list.length;i++){
                var split_list = str_list[i].text().split(/今日|昨日/)
                var today = split_list[0]//今日
                var yesterday = split_list[1]//昨天
                var str_1 = split_list[2]//环比
                console.log('今日--'+today+' ; 昨日--'+yesterday+' ; 环比--'+str_1)
                if(today=='0' && yesterday=='0'){
                    index_num+=1
                }else if(today=='--' && yesterday=='--'){
                    xj_str+='实时看数选项卡数据显示异常，为--,'
                    is_meet = true
                    break
                }
            }
            if(index_num==(str_list.length-3)){
                xj_str+='实时看数选项卡数据显示异常，为0,'
            }else if(!is_meet){
                xj_str+='实时看数选项卡数据显示正常,'
            }
            back_index()
            return xj_str+='实时看数选项卡巡检完成'
        }
    }catch(e){
        console.log('实时看数选项卡查找元素异常,')
        return xj_str+='实时看数选项卡查找元素异常,'
    }
}
//实时看数支局
function branch_realtime_reading(){
    console.log('====开始实时看数(支局)选项卡巡检====')
    var xj_str='====开始实时看数(支局)选项卡巡检====\n'
    var is_not_continue = true
    try{
        selector().text('实时看数(支局)').findOne(3000).parent().click()
        sleep(2000)
        for(var i=0;i<10;i++){
            if(selector().className('android.widget.Image').text('lu').findOne(3000).parent().next().children()[0].text()!='--'){
                break
            }else{
                sleep(2000)
            }
        }
        selector().textContains('实时看数').waitFor(10000)
        if(selector().textContains('今日').textContains('昨日').textContains('环比差异').findOne(3000)){
            console.log('实时看数(支局)选项卡加载完成')
            xj_str+='实时看数(支局)选项卡加载完成,'
        }else{
            is_not_continue =false
            xj_str+='实时看数(支局)选项卡加载异常,'
        }
        if(is_not_continue){
            var str_list = selector().textContains('今日').textContains('昨日').textContains('环比差异').find()
            var is_meet = false
            var index_num = 0
            for(var i=0;i<str_list.length;i++){
                var split_list = str_list[i].text().split(/今日|昨日/)
                var today = split_list[0]//今日
                var yesterday = split_list[1]//昨天
                var str_1 = split_list[2]//环比
                console.log('今日--'+today+' ; 昨日--'+yesterday+' ; 环比--'+str_1)
                if(today=='0' && yesterday=='0'){
                    index_num+=1
                }else if(today=='--' && yesterday=='--'){
                    xj_str+='实时看数(支局)选项卡数据显示异常，为--,'
                    is_meet = true
                    break
                }
            }
            if(index_num==(str_list.length-3)){
                xj_str+='实时看数(支局)选项卡数据显示异常，为0,'
            }else if(!is_meet){
                xj_str+='实时看数(支局)选项卡数据显示正常,'
            }
            back_index()
            return xj_str+='实时看数(支局)选项卡巡检完成'
        }
    }catch(e){
        console.log('实时看数(支局)选项卡查找元素异常,')
        return xj_str+='实时看数(支局)选项卡查找元素异常,'
    }    
}
//协转服务
function xz_service(){
    console.log('====开始携转服务选项卡巡检====')
    var xj_str = '====开始携转服务选项卡巡检====\n'
    var is_not_continue = true
    try{
        selector().text('携转服务').findOne(3000).parent().click()
        selector().idContains('data_echarts').waitFor(10000)
        if(selector().text('运营商').findOne(3000)){
            console.log('携转服务页加载出来了')
            xj_str +='携转服务页面加载正常\n'
            var city_child = selector().text('重庆 电信').findOne(3000).parent().children()
            var is_meet = false
            for(var i=1;i<city_child.length;i++){
                console.log(city_child[i].text())
                if(city_child[i].text()=='--'){
                    console.log(city_child[i].text())
                    is_meet = true
                    break
                }
            }
            if(!is_meet){
                console.log('携转服务页数据加载正常')
                xj_str +='携转服务页数据加载正常\n'
            }else{
                console.log('携转服务页数据加载异常')
                xj_str +='携转服务页数据加载异常\n'
            }
        }else{
             console.log('携转服务页面加载异常')
            xj_str +='携转服务页面加载异常\n'           
        }
        back_index()
        return xj_str+'====携转服务页面巡检完成====\n'
    }catch(e){
        console.log('携转服务页面查找元素异常'+e)
        xj_str +='携转服务页面查找元素异常\n'
        return xj_str
    }

}
//渠道积分
function qudao_integral(){
    console.log('====开始渠道积分选项卡巡检====')
    var xj_str='====开始渠道积分选项卡巡检===='
    try{
        selector().text('渠道积分').findOne(3000).parent().click()
        selector().idContains('chart').waitFor(10000)
        if(selector().text('地区').findOne(3000)){
            console.log('渠道积分页加载出来了')
            xj_str +='渠道积分页面加载正常\n'
            var city_child = selector().text('全市').find()[1].parent().children()
            var is_meet = false
            for(var i=1;i<city_child.length;i++){
                console.log(city_child[i].text())
                if(city_child[i].text()=='--'){
                    console.log(city_child[i].text())
                    is_meet = true
                    break
                }
            }
            if(!is_meet){
                console.log('渠道积分页数据加载正常')
                xj_str +='渠道积分页数据加载正常\n'
            }else{
                console.log('渠道积分页数据加载异常')
                xj_str +='渠道积分页数据加载异常\n'
            }
        }else{
             console.log('渠道积分页面加载异常')
            xj_str +='渠道积分页面加载异常\n'           
        }
        back_index()
        return xj_str+'====渠道积分页面巡检完成====\n'
    }catch(e){
        console.log('渠道积分页面查找元素异常')
        xj_str +='渠道积分页面查找元素异常\n'
        return xj_str
    }    
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
    for(var i=0;i<5;i++){
        try{
            if(selector().text('首页').findOne(2000)){
                console.log('回到了首页');
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
                if (selector().className('android.app.Dialog').findOne(200)) {
                    console.info('跳过弹窗广告');
                    selector().className('android.widget.Button').text('确认').findOne(200).click();
                }
                // if (selector().id('tv_countdown_bottom').textStartsWith('跳过').findOne(200)) {
                //     console.info('跳过开屏广告');
                //     selector().id('tv_countdown_bottom').textStartsWith('跳过').findOne(200).click();
                // }
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
//钉钉接口发送信息
function to_dingdingtalk(url,str_text,header){
    let res = http.post(url, {
                        "at": {
                            "atMobiles":[
                            ],
                            "atUserIds":[
                            ],
                            "isAtAll": true
                        },
                        "text": {
                            "content":str_text
                        },
                        "msgtype":"text"
                    },header);
    if(res.statusCode==200){
        console.log('钉钉消息发送成功')
        console.log(res.body.string())
    }else{
        console.log(res.statusCode)
        console.log('钉钉消息发送失败')
        console.log(res.body.string())
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
function readExcel(fileDataPath,sheetNames){
    /******
     * fileDataPath:读取表的路径
     * sheetNames:需要读取的sheet页列表
     */
    try{
        for(var s=0;s<sheetNames.length;s++){
            var sheetName = sheetNames[s]
            let excelObj = excel.open(fileDataPath,sheetName)
            let excelRow = excel.getRowCount(excelObj);
            dataDict[sheetName] = {}
            var  titles = excel.getRow(excelObj, 0)
            for(var i=1;i<excelRow;i++){
                var excelRowData = excel.getRow(excelObj, i); //一行数据
                temp_dit={}
                for(var j=1;j<titles.length;j++){
                    var value = excelRowData[j]
                    if(value==undefined){
                        value = ''
                    }
                    if(value=='`'){
                        value = ''
                    }
                    temp_dit[titles[j]]= value
                }
                dataDict[sheetName][excelRowData[0]] = temp_dit
            }
            excel.close(excelObj)
        }
        console.log(dataDict)
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
    for(var i=0;i<5;i++){
        try{
            if(selector().text('工作台').findOne(2000)){
                console.log('回到了工作助手首页');
                break
            }else{
                automator.back();
                sleep(1000);
            }
        }catch (e){
            continue
        }
    }
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
    if(init()){
        var time = get_time();
        var title ='巡检结果：'+ String(time) 
        var app_str = title+'\n'
        // var host = configDict['邮件服务器']
        // var port = configDict['邮件端口']
        // var email = configDict['email']
        // var passw = configDict['邮件密码']
        // var fromPseron = configDict['发件人']
        var url = configDict['钉钉接口']
        var path = fileDownloadPath+'/数据对比表_模板.xls'
        var sheetNames = configDict['sheet页名称'].split(',')
        var header = {"contentType": "application/json"}
        if(String(readExcel(path,sheetNames)).indexOf('错误')!=-1){
            is_not_continue = false
            app_str+=readExcel(path,sheetNames)
        }else{
            readExcel(path,sheetNames)
        }
        if(!runApp()){
            is_not_continue = false
            app_str+='打开软件失败'
        }
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
                console.log('领导视窗打开成功')
            }else{
                console.log('领导视窗打开失败，未找到该选项')
                app_str +='领导视窗打开失败，未找到该选项'
                is_not_continue = false
            }
        }
        if(is_not_continue){
            //上面需要一巡检一个消息
            var str_development = title + '\n' +user_development()
            to_dingdingtalk(url,str_development,header)
            var str_kilomega_5G = title +'\n' + kilomega_5G()
            to_dingdingtalk(url,str_kilomega_5G,header)
            var str_first_look = title +'\n' + first_look()
            to_dingdingtalk(url,str_first_look,header)
            var str_network_analysis = title +'\n'+ network_analysis()
            to_dingdingtalk(url,str_network_analysis,header)
            //巡检完成一起发送
            var str_1 = title + '\n'+
                        reven_Progress()        +'\n'+ //少
                        realtime_reading() +'\n'+ //少
                        branch_realtime_reading()    +'\n'+ //少
                        xz_service()  +'\n'+  //少
                        qudao_integral()+'\n'+
                        digital_living()+'\n'+ //少
                        exitApp()
            to_dingdingtalk(url,str_1,header)           
        }else{            
            to_dingdingtalk(url,app_str,header)
        }
         
    }
    automator.home();
}
main();
// var url = 'https://oapi.dingtalk.com/robot/send?access_token=d7e4f7cbf1c308065dca9d474be886065526119f3b605b4ad6b198db2a3bae83'
// var data = {
//             "at": {
//                 "atMobiles":[
//                 ],
//                 "atUserIds":[
//                 ],
//                 "isAtAll": true
//             },
//             "text": {
//                 "content":'巡检结果：\n'+
//                 '----本次（新）领导视窗巡检已完成，以下是巡检报告:'
//             },
//             "msgtype":"text"
//         }
// var header = {"contentType": "application/json"}
// to_dingdingtalk(url,data,header)
// console.log('hello')
// configDict = readConfig(configPath)
// var path = fileDownloadPath+'/数据对比表_模板.xls'
// var sheetNames = configDict['sheet页名称'].split(',')
// readExcel(path,sheetNames)
// console.log(first_look())