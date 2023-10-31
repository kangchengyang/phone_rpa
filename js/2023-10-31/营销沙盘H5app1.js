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
//打开营销沙盘沙盘H5
function openH5(){
    try{
        selector().text('营销沙盘H5').depth(13).findOne(10000).click();
        selector().text('分公司视图').waitFor();
        if(selector().text('分公司视图').findOne(10000)){
            console.log('营销沙盘H5打开成功');
            sleep(3000)
            return true
        }else{
            return false
        }
    }catch(e){
        return false
    }

    
}
//公司视图页面
function branch_office(){
    console.log('====开始分公司视图巡检====')
    var xj_str = '      ====开始分公司视图巡检====\n'
    var is_not_continue = true
    for(var i=0;i<3;i++){
        try{
            selector().text('分公司视图').findOne(1000).click();
            sleep(20000)
            for(var i=0;i<10;i++){
                var is_wait = selector().text('加载中...').waitFor(3000)
                if(!is_wait){
                    console.log('分公司主页加载完毕')
                    break
                }else{
                    sleep(3000)
                }
            }            
            sleep(1000)
            automator.clickCenter(selector().text('渝北').findOne(1000).parent())
            sleep(8000)
            automator.back()
            sleep(2000)
            for(var t=0;t<3;t++){
                automator.swipeDown()
                sleep(200)
            }
            sleep(2000)
            for(var t=0;t<4;t++){
                automator.swipeUp()
                sleep(200)
            }
            sleep(2000)           
            automator.clickCenter(selector().text('渝北').findOne(1000).parent())                       
            sleep(10000)
            break;
        }catch(e){
            console.log('页面还未加载出来,需要延迟2s')
            automator.swipeUp();//下拉一下
            is_not_continue = false
            sleep(2000)
        }
    }
    if(is_not_continue){
        // for(var i=0;i<20;i++){
        //     automator.swipeDown()
        //     sleep(200)
        // }
        // for(var i=0;i<22;i++){
        //     automator.swipeUp()
        //     sleep(200)
        // }         
        console.log('进入分公司页面成功，开始循环判断是否加载出来了数据')
        for(var erro =0;erro<2;erro++){
            try{
                for(var i=0;i<5;i++){
                    text_str = selector().text('总房间数(计算)').depth(7).findOne(2000).next().text();
                    console.log(text_str)
                    if(text_str=='--'){
                        is_not_continue = false;
                        automator.swipeUp();//下拉一下
                        sleep(2000);
                    }else{
                        is_not_continue = true;
                        break;
                    }
                }
            }catch(e){
                console.log(e)
                sleep(2000)
                for(var t=0;t<14;t++){
                    automator.swipeDown()
                    sleep(200)
                }
                sleep(2000)
                for(var t=0;t<22;t++){
                    automator.swipeUp()
                    sleep(200)
                }
                sleep(10000)                
            }
        }
    }else{
        for(var t=0;t<22;t++){
            automator.swipeUp()
            sleep(200)
        }        
        back_index()
        return xj_str +='分公司视图，页面加载异常。'
    }
    if(is_not_continue){
        var insp_str = inspection()
        xj_str +=insp_str
        console.log('====分公司视图巡检完成====')
        for(var t=0;t<22;t++){
            automator.swipeUp()
            sleep(200)
        }    
        back_index()
        return xj_str+='分公司视图巡检完成。'
    }

}
//支局视图
function branch_post_office(){
    console.log('====开始支局视图巡检====')
    var jx_str = '      ====开始支局视图巡检====\n'
    var is_not_continue = true
    selector().text('支局视图').findOne(5000).click();
    sleep(2000)
    for(var i=0;i<10;i++){
        var is_wait = selector().text('加载中...').waitFor(3000)
        if(!is_wait){
            console.log('加载完毕')
            break
        }else{
            sleep(3000)
        }
    }
    console.log('开始循环判断是否加载出来了页面')
    for(var i=0;i<3;i++){
        if(selector().textContains('入住住户数(收集):').find()[0]){
            is_not_continue = true
            break
        }else{
            is_not_continue = false
            automator.swipeUp();//下拉一下
            sleep(4000)
        }
    }
    if(is_not_continue){
        console.log('加载出来了主页面')
        sleep(2000)
        selector().textContains('入住住户数(收集):').findOne(3000).parent().click();
        sleep(8000)
        automator.back()
        sleep(2000)
        for(var t=0;t<2;t++){
            automator.swipeDown()
            sleep(200)
        }
        sleep(4000)
        for(var w=0;w<5;w++){
            automator.swipeUp()
            sleep(200)
        }
        sleep(4000)
        automator.clickCenter(selector().textContains('入住住户数(收集):').findOne(10000).parent())
        sleep(10000)
        for(var erro =0;erro<2;erro++){
            try{
                for(var i=0;i<10;i++){
                    text_str = selector().text('总房间数(计算)').depth(7).findOne(2000).next().text();
                    console.log(text_str)
                    if(text_str=='--'){
                        is_not_continue = false;
                        automator.swipeUp();//下拉一下
                        sleep(4000);
                    }else{
                        is_not_continue = true;
                        break;
                    }
                }
            }catch(e){
                console.log(e)
                automator.back()
                sleep(4000)
                selector().textContains('入住住户数(收集):').findOne(10000).parent().click();
                sleep(10000)              
            }
        }         
  
    }else{
        is_not_continue = false       
        return  jx_str +='支局页面加载异常。'
    }
    if(is_not_continue){
        var insp_str = inspection()
        jx_str +=insp_str
        console.log('====支局视图巡检完成=====')
        for(var t=0;t<22;t++){
            automator.swipeUp()
            sleep(200)
        }        
        back_index()
        return jx_str+='支局视图巡检完成。'
    }else{
        for(var t=0;t<22;t++){
            automator.swipeUp()
            sleep(200)
        }        
        back_index()
        return xj_str +='支局视图，页面加载异常，'
    }
}
//片区视图
function area_view(){
    var xj_str = '      ====开始片区视图巡检====\n'
    var is_not_continue = true
    console.log('====开始片区视图巡检====')
    try{
        selector().text('首页').findOne(3000).click()
        sleep(2000)
        selector().text('片区视图').findOne(5000).click();
        for(var i=0;i<10;i++){
            var is_wait = selector().text('加载中...').waitFor(3000)
            if(!is_wait){
                console.log('加载完毕')
                break
            }else{
                sleep(3000)
            }
        }         
        sleep(2000)
        selector().text('片区视图').findOne(2000).next().click();
        sleep(2000)
        automator.gesture(1000, [900, 2001], [900, 2800]);
        sleep(2000)
        selector().text('确定').findOne(2000).click();
        sleep(4000)
        for(var i=0;i<10;i++){
            var is_wait = selector().text('加载中...').waitFor(3000)
            if(!is_wait){
                console.log('加载完毕')
                break
            }else{
                sleep(3000)
            }
        }        
        console.log('选择全部完成，开始循环判断是否加载出来了页面')
        for(var i=0;i<3;i++){
            if(selector().textContains('入住住户数(收集):').find()[0]){
                console.log('页面加载出来了')
                is_not_continue = true
                break
            }
            else{
                is_not_continue = false
                automator.swipeUp();//下拉一下
                sleep(4000)
            }
        }
        if(is_not_continue){
            sleep(2000)
            automator.clickCenter(selector().textContains('入住住户数(收集):').find()[0].prev())
            console.log('点击完成')
            sleep(8000)
            automator.back()
            sleep(2000)
            automator.swipeDown()
            sleep(200)
            automator.swipeDown()
            sleep(5000)
            automator.swipeUp()
            sleep(200)
            automator.swipeUp()
            sleep(2000)
            automator.clickCenter(selector().textContains('入住住户数(收集):').find()[0].prev())
            sleep(20000)
            for(var erro=0;erro<2;erro++){
                try{
                    for(var j=0;j<10;j++){
                        text_str = selector().text('总房间数(计算)').depth(7).findOne(2000).next().text();
                        console.log(text_str)
                        if(text_str=='--'){
                            is_not_continue = false;
                            automator.swipeUp();//下拉一下
                            sleep(4000);
                        }else{
                            is_not_continue = true;
                            break;
                        }
                    }
                }catch(e){
                    console.log(e)
                    automator.back()
                    sleep(2000)
                    automator.swipeDown()
                    sleep(200)
                    automator.swipeDown()
                    sleep(5000)
                    automator.swipeUp()
                    sleep(200)
                    automator.swipeUp()
                    sleep(2000)
                    automator.clickCenter(selector().textContains('入住住户数(收集):').find()[0].prev())
                    sleep(20000)                    
                }
            }

        }else{
            console.log('片区视图页面加载异常')
            for(var t=0;t<22;t++){
                automator.swipeUp()
                sleep(200)
            }            
            back_index()
            return xj_str+='片区视图页面加载异常。'
        }if(is_not_continue){
            var insp_str = inspection()
            xj_str +=insp_str
            console.log('====片区视图巡检完成====')
            for(var i=0;i<20;i++){
                automator.swipeUp()
                sleep(200)
            }
            automator.back()             
            back_index()
            sleep(2000)
            selector().text('首页').findOne(3000).click()
            sleep(1000)
            return xj_str+='片区视图巡检完成。'
        }
    }catch(e){
        console.log(e)
        for(var t=0;t<22;t++){
            automator.swipeUp()
            sleep(200)
        }        
        back_index()
        return xj_str+='片区视图页面元素查找异常，可能是页面发生了变动或者升级。'
    }
}


//网格视图
function grid_view(){
    var xj_str = '      =====开始网格视图巡检====\n'
    var is_not_continue = true
    console.log('====开始网格视图巡检====')
    try{
        selector().text('网格视图').findOne(5000).click();
        sleep(2000)
        for(var i=0;i<10;i++){
            var is_wait = selector().text('加载中...').waitFor(3000)
            if(!is_wait){
                console.log('加载完毕')
                break
            }else{
                sleep(3000)
            }
        }        
        console.log('开始循环判断是否加载出来了页面')
        for(var i=0;i<3;i++){
            if(selector().textContains('入住住户数(收集):').find()[0]){
                is_not_continue = true
                console.log('页面加载出来了')
                break;
            }
            else{
                is_not_continue = false
                automator.swipeUp();//下拉一下
                sleep(4000)
            }
        }
        if(is_not_continue){
            sleep(3000)
            var grid = selector().textContains('入住住户数(收集):').find()
            var click_str = grid[j].prev().text()
            for(var j=0;j<grid.length;j++){
                if(grid[j].prev().text().indexOf('未归类')==-1){
                    console.log(grid[j].prev().text())
                    grid[j].click();
                    console.log('点击成功')
                    break;                
                }
            }
            sleep(8000)
            automator.back()
            sleep(2000)
            automator.swipeDown()
            sleep(200)
            automator.swipeDown()
            sleep(5000)
            automator.swipeUp()
            sleep(200)
            automator.swipeUp()
            sleep(2000)            
            automator.clickCenter(selector().text(click_str).findOne(3000).parent())
            sleep(20000)
            for(var erro=0;erro<3;erro++){
                try{
                    text_str = selector().text('总房间数(计算)').depth(7).findOne(2000).next().text();
                    console.log(text_str)
                    if(text_str=='--'){
                        is_not_continue = false;
                        automator.swipeUp();//下拉一下
                        sleep(2000);
                    }else{
                        is_not_continue = true;
                        break;
                    }
                }catch(e){
                    console.log(e)
                    automator.back()
                    sleep(2000)
                    automator.swipeDown()
                    sleep(200)
                    automator.swipeDown()
                    sleep(5000)
                    automator.swipeUp()
                    sleep(200)
                    automator.swipeUp()
                    sleep(2000)            
                    automator.clickCenter(selector().text(click_str).findOne(3000).parent())
                    sleep(20000)                    
                }

            } 

        }else{
            console.log('网格视图页面加载异常')
            for(var t=0;t<22;t++){
                automator.swipeUp()
                sleep(200)
            }            
            back_index()
            return xj_str+='网格视图页面加载异常。'
        }
        sleep(3000)
        if(is_not_continue){
            var insp_str = inspection()
            xj_str +=insp_str
            console.log('====网格视图巡检完成====')
            for(var i=0;i<20;i++){
                automator.swipeUp()
                sleep(200)
            }
            automator.back()          
            back_index()
            sleep(2000)
            selector().text('首页').findOne(3000).click()
             sleep(1000)
            return xj_str+='网格视图巡检完成'
        }else{
            console.log('网格视图页面数据加载异常')
            back_index()
            return xj_str+='网格视图页面数据加载异常。'
        }
    }catch(e){
        console.log(e)
        back_index()
        return xj_str+='网格视图页面元素查找异常，可能是页面发生了变动或者升级。'
    }

} 
//小区营销
function xq_marketing(){
    var xj_str ='      ====开始小区营销视图巡检====\n'
    var is_not_continue = true
    console.log('=====开始小区营销视图巡检====')
    try{
        sleep(2000)
        selector().id('m-tabs-1-2').findOne(5000).click();
        sleep(2000)
        for(var i=0;i<10;i++){
            var is_wait = selector().text('加载中...').waitFor(3000)
            if(!is_wait){
                console.log('加载完毕')
                break
            }else{
                sleep(3000)
            }
        }        
        console.log('开始循环判断是否加载出来了页面')
        sleep(2000)   
        for(var i=0;i<3;i++){
            if(selector().textContains('入住住户数(收集):').find()[0]){
                is_not_continue = true
                console.log('页面加载出来了')
                break;
            }
            else{
                is_not_continue = false
                automator.swipeUp();//下拉一下
                sleep(4000)
            }
        }
        if(is_not_continue){
            sleep(3000)
            var grid = selector().textContains('入住住户数(收集):').find()
            var str_click = ''
            for(var j=0;j<grid.length;j++){
                if(grid[j].prev().prev().prev().text().indexOf('大学')==-1){
                    console.log(grid[j].prev().prev().prev().text())
                    str_click = grid[j].prev().prev().prev().text()
                    grid[j].click();
                    sleep(2000)
                    automator.back()
                    selector().text('小区营销').waitFor(1000)
                    sleep(1000)
                    break;                
                }
            }
            sleep(2000)
            automator.swipeDown()
            sleep(200)
            automator.swipeDown()
            sleep(5000)
            automator.swipeUp()
            sleep(200)
            automator.swipeUp()
            sleep(1000)
            automator.clickCenter(selector().text(str_click).findOne(3000))
            sleep(2000)  
            automator.gesture(2000, [561,1253],[561,900]);
            sleep(3000)
            for(var i=0;i<10;i++){
                var is_wait = selector().text('加载中...').waitFor(3000)
                if(!is_wait){
                    console.log('加载完毕')
                    break
                }else{
                    sleep(3000)
                }
            }            
            console.log('开始循环判断是否进入成功')
            for(var i=0;i<5;i++){
                if(selector().text('收集').find()){
                    console.log('进入页面成功')
                    is_not_continue = true
                    break
                }else{
                    is_not_continue = false;
                    automator.swipeUp();//下拉一下
                    sleep(4000);
                }
            }
            if(is_not_continue){
                console.log('开始等待页面加载')
                selector().text('小区指标').waitFor(); ///等待住户信息加载完成
                automator.swipeDown()   //向上滑动
                var grid = selector().text('收集').find()
                for(var j=0;j<grid.length;j++){
                    if(grid[j].prev().prev().text().indexOf('EPON')==-1){
                        console.log(grid[j].prev().prev().text())
                        grid[j].parent().click();
                        break;                
                    }
                }
                selector().text('住户画像').waitFor()
                sleep(3000)
                info_str = selector().textContains('积分').textContains('身份证后六位').findOne(10000).text();//巡检住户信息
                //积分： 11217| 身份证后六位：231245
                var str_1 = '住户信息数据显示正常,'               
                matches_list = extractNumbers(info_str)
                for(var k=0;k<matches_list.length;k++){
                    if(matches_list[k]=='--' ||  matches_list[k]=='0'){
                        console.log('住户信息数据显示异常')
                        str_1 = '住户信息数据显示异常,'
                        break
                    }
                }
                console.log(str_1)
                xj_str +=str_1
                selector().text('用户画像').findOne(4000).click();
                sleep(3000)
                automator.swipeDown()   //向上滑动
                tc_list = selector().text('主套餐:').depth(9).find()
                info_str2 = '用户画像信息显示正常,'
                for(var i=0;i<tc_list.length;i++){
                    if(tc_list[i].prev().text()=='--' || tc_list[i].prev().text()=='0'){
                        console.log('用户画像信息显示异常')
                        info_str2 ='用户画像信息显示异常,'
                        break
                    }
                    if(tc_list[i].next().text().indexOf('宽带')=='-1' && tc_list[i].next().text().indexOf('高清')=='-1' && tc_list[i].next().text().indexOf('套餐')!='-1'){
                        console.log(tc_list[i].next().text())
                        tc_list[i].prev().click();
                        sleep(3000)
                        if(selector().text('是否拨打').findOne(4000)){
                            sleep(1000)
                            selector().text('是否拨打').findOne(2000).next().next().click();
                            sleep(1000)
                            xj_str+='外呼正常弹出,'
                        }else{
                            xj_str+='外呼不能正常弹出,'
                        }
                        break;
                    }
                }
                console.log(info_str2)
                xj_str+=info_str2
                console.log('用户画像巡检完成')
                automator.back();//返回上级
                sleep(3000);
                console.log('开始巡检筛选功能')
                try{
                    selector().text('场景').depth(7).findOne(10000).click();
                    sleep(1000)
                    selector().className('android.widget.Button').text('确定').waitFor();
                    automator.clickCenter(selector().text('分公司自定义').findOne(10000))
                    sleep(2000)
                    automator.clickCenter(selector().text('全选').findOne(10000))
                    sleep(1000)
                    selector().className('android.widget.Button').text('确定').findOne(10000).click();                    
                    xj_str+='筛选功能正常,'
                    console.log('筛选功能正常')
                }catch(e){
                    console.log('小区营销的筛选功能异常')
                    xj_str+='小区营销的筛选功能异常,'
                }
                automator.back();//返回上级
                console.log('====小区营销巡检完成====')
                return xj_str+='小区营销巡检完成。'
            }else{
                console.log('小区信息页面加载异常')
                back_index()//回到主页
                return xj_str+='小区信息页面加载异常。' 
            }
        }else{
            console.log('小区营销页面加载异常')
            back_index()
            return xj_str+='小区营销页面加载异常。'            
        }            
    }catch(e){
        console.log('出现错误')
        console.log(e)
        back_index();
        return xj_str+='小区营销页面元素查找异常，可能是页面发生了变动或者升级。'
    }
}
//筛选功能
function screen_view(phone){
    console.log('====筛选功能巡检开始====')
    var xj_str = '      ====筛选功能巡检开始====\n'
    var is_not_continue = true
    try{
        selector().text('筛选').findOne(5000).parent().click();
        selector().text('高级筛选').waitFor(10000);
        selector().text('搜索').findOne(5000).prev().children()[1].setText(String(phone))
        sleep(3000)
        automator.clickCenter(selector().text('搜索').findOne(3000))
        sleep(5000)
        try{
            var serach_str = selector().text('查询结果').findOne(2000).next().children()[0].children()[0].children()[0].children()[0].text()
            if(serach_str=''){
                console.log(serach_str)
                is_not_continue = true
            }
            
        }catch(e){
            is_not_continue = false
            console.log('未搜索出结果，或者元素查找失败')
        }
        if(is_not_continue){
            console.log('搜索出来了结果');
            console.log('开始点击进入')
            xj_str +='搜索功能正常,'
            automator.clickCenter(selector().text('搜索历史').findOne(3000).prev())
            selector().text('住户画像').waitFor()
            sleep(3000)
            xj_str +='搜索功能正常,'
            info_str = selector().textContains('积分').textContains('身份证后六位').findOne(10000).text();//巡检住户信息
            //积分： 11217| 身份证后六位：231245
            var str_1 = '搜索界面跳转住户画像正常'               
            matches_list = extractNumbers(info_str)
            for(var k=0;k<matches_list.length;k++){
                if(matches_list[k]=='--' ||  matches_list[k]=='0'){
                    console.log('住户信息数据显示异常')
                    str_1 = '住户信息数据显示异常,'
                    break
                }
            }
            console.log(str_1)
            xj_str +=str_1
            console.log('====筛选功能巡检完成====')
            back_index();
            return xj_str+='筛选功能巡检完成。'
        }else{
            console.log('搜索功能异常')
            back_index();
            return xj_str+='搜索功能异常'
        }
        
    }catch(e){
        console.log(e)
        console.log('筛选功能的界面元素查找异常，可能是页面变动或者升级')
        back_index();
        return xj_str+='筛选功能的界面元素查找异常，可能是页面变动或者升级'
    }
   

}
//任务功能_拆机工单
function task_view(){
    console.log('====拆机工单巡检开始====')
    var xj_str = '      ====拆机工单巡检开始====\n'
    var is_not_continue = true
    try{
        selector().text('任务').findOne(5000).parent().click();
        selector().text('已完成').waitFor(10000);
        selector().text('任务跟踪').findOne(3000).next().click();
        sleep(3000)
        selector().className('android.widget.Button').text('拆机咨询').findOne(2000).click();
        sleep(2000);
        var branch_post = selector().text('支局：').findOne(2000).next().text();
        console.log(branch_post)
        if(branch_post.indexOf('全部')==-1){
            console.log('没有筛选到全部需要选择全部');
            selector().text('支局：').findOne(2000).next().click();
            sleep(2000);
            for(var i=0;i<4;i++){   //向上滑动-----最顶上为全部
                automator.gesture(1000, [900, 2001], [900, 2800]);
                sleep(1000)
            }
            selector().text('确定').findOne(2000).click();
        }
        sleep(1000)
        selector().text('确 认').findOne(2000).click();
        sleep(2000)
        console.log('开始循环判断是否加载出来了数据')
        for(var i=0;i<10;i++){
            var is_wait = selector().text('加载中...').waitFor(3000)
            if(!is_wait){
                console.log('加载完毕')
                break
            }else{
                sleep(3000)
            }
        }       
        for(var i=0;i<8;i++){
            if(selector().textContains('待执行：').findOne(2000)){
                is_not_continue = true
                break
            }else{
                is_not_continue = false
                automator.swipeUp();//下拉一下
                sleep(4000)               
            }
        }
        if(is_not_continue){
            console.log('加载出来了页面')
            console.log('开始点击待执行项')
            selector().textContains('待执行：').findOne(2000).click();
        }else{
            console.log('拆机工单的筛选功能未加载出数据')
            back_index();
            return xj_str+='拆机工单的筛选功能未加载出数据'            
        }
        console.log('开始循环判断是否成功跳转')
        for(var j=0;j<8;j++){
            if(selector().textContains('当前处理人：').findOne(2000)){
                is_not_continue = true
                break               
            }else{
                is_not_continue = false
                automator.swipeUp();//下拉一下
                sleep(4000)                  
            }
        }
        if(is_not_continue){
            console.log('处理人页面加载出来了')
            sleep(2000)
            selector().textContains('当前处理人：').findOne(2000).click();
            sleep(2000)
            selector().text('转派').findOne(2000).parent().prev().click();
            sleep(5000)
            automator.back()
            sleep(3000)
            automator.clickCenter(selector().text('转派').findOne(2000).parent().prev())
            console.log('2次点击')
            sleep(2000)
            selector().text('用户画像').waitFor()
            if(selector().text('用户画像').findOne(3000)){
                xj_str+='处理人界面跳转用户画像功能正常,'
            }
            sleep(3000)
            info_str = selector().textContains('积分').textContains('身份证后六位').findOne(10000).text();//巡检住户信息
            console.log(info_str)
            //积分： 11217| 身份证后六位：231245
            var str_1 = '住户信息数据显示正常,'               
            matches_list = extractNumbers(info_str)
            for(var k=0;k<matches_list.length;k++){
                if(matches_list[k]=='--' ||  matches_list[k]=='0'){
                    console.log('住户信息数据显示异常')
                    str_1 = '住户信息数据显示异常,'
                    break
                }
            }
            xj_str+=str_1
            back_index();     //返回主页
            return xj_str+='拆机工单巡检完成。'       
        }else{
            console.log('拆机工单的处理人界面未加载出数据')
            back_index();
            return xj_str+='拆机工单的处理人界面未加载出数据'       
        }
    }catch(e){
            console.log('任务功能中的拆机工单的界面元素查找异常，可能是页面变动或者升级')
            back_index();
            return xj_str+='任务功能中的拆机工单的界面元素查找异常，可能是页面变动或者升级' 
    } 
}
//任务功能其他工单
function task_other(){
    console.log('====任务功能其他工单巡检开始====')
    var xj_str = '      ====任务功能其他工单巡检开始====\n'
    var is_not_continue = true
    try{
        selector().text('任务').findOne(5000).parent().click();
        selector().text('已完成').waitFor(10000);
        selector().text('任务跟踪').findOne(3000).next().click();
        sleep(3000)
        but_lsit = selector().className('android.widget.Button').text('拆机咨询').findOne(2000).parent().children();
        for(var i=0;i<but_lsit.length;i++){
            if(but_lsit[i].text().indexOf('拆机咨询')!=-1){
                continue;
            }else{
                console.log(but_lsit[i].text())
                selector().className('android.widget.Button').text(but_lsit[i].text()).findOne(2000).click()
                selector().text('确 认').findOne(2000).click();
                sleep(2000)
                console.log('开始循环判断是否加载出来了数据')
                for(var j=1;j<3;j++){
                    if(selector().textContains('待执行：').findOne(2000) || selector().textContains('待处理：').findOne(2000)){
                        is_not_continue = true
                        break
                    }else{
                        is_not_continue = false
                        automator.swipeUp();//下拉一下
                        sleep(1000)               
                    }
                }
                if(is_not_continue){
                    console.log('加载出来了页面')
                    xj_str+=(but_lsit[i].text()+'数据显示页面正常,')
                    sleep(1000)
                    selector().text('任务跟踪').findOne(3000).next().click();
                    sleep(1000)
                }else{
                    console.log(but_lsit[i].text()+'的筛选功能未加载出数据')
                    back_index();
                    xj_str+=(but_lsit[i].text()+'的筛选功能未加载出数据,')
                    selector().text('任务跟踪').findOne(3000).next().click();
                    sleep(1000)            
                }            
            }
        }
        selector().text('取 消').findOne(2000).click();
        return xj_str +='任务功能其他工单巡检完成。' 
    }catch(e){
        console.log('任务功能中的其他工单的界面元素查找异常，可能是页面变动或者升级')
        return xj_str+='任务功能中的其他工单的界面元素查找异常，可能是页面变动或者升级'       
    }
}
//移动看板
function mobile_kanban(){
    var xj_str = '      ====移动看板巡检====\n'
    try{
        console.log('----开始数字看板巡检----')
        var is_not_continue = true
        if(selector().text('首页').findOne(5000)){
            selector().text('首页').findOne(2000).click();
            sleep(2000)
            //数字看板
            automator.clickCenter(selector().className('android.widget.ListView').findOne(2000).children()[1].children()[0])
            sleep(3000)
            selector().text('数字看板').waitFor(5000);
            if(selector().text('数字看板').findOne(2000)){
                console.log('跳转数字看板成功')
                xj_str+='跳转数字看板成功,'
                is_not_continue = true
            }else{
                console.log('未能成功跳转数字看板')
                xj_str+='未能成功跳转数字看板,'
                is_not_continue = false
            }
            if(is_not_continue){ 
                var str_dx = selector().text('电信份额').find()
                for(var i=0;i<str_dx.length;i++){
                    console.log(str_dx[i].prev().text())
                    
                    if(str_dx[i].prev().text()=='--' || str_dx[i].prev().text().match(/\d+\.\d+/)[0]=='0'){
                        console.log('数字看板数据显示异常')
                        xj_str+='数字看板数据显示异常,'
                        break
                    }
                }
                xj_str+='数字看板数据加载正常,'
            }
            back_index();
            return xj_str+='数字看板巡检完成。'
        }else{
            console.log('未能找到首页按钮，移动看板巡检失败')
            xj_str+='未能找到首页按钮，移动看板巡检失败。'
            return xj_str
        }
    }catch(e){
            console.log('移动看板页面中查找元素失败，可能是页面发生了变动或者升级。')
            return xj_str+='移动看板页面中查找元素失败，可能是页面发生了变动或者升级。' 
                 
    }
}
//巡检
function inspection(){
    var xj_str = ''
    //有效宽带房间渗透率(收集)的值
    try{   
        var yxkd_percentage = selector().text('有效宽带房间渗透率(收集)').findOne(5000).next().text();  
        console.log(yxkd_percentage)
        var yxkd_number = selector().text('有效宽带数').findOne(5000).next().text();
        console.log(yxkd_number)
        var room_number = selector().text('房间收集数').findOne(5000).next().text();
        console.log(room_number)
        if(yxkd_percentage=='--' && yxkd_number=='--' && room_number=='--'){
            console.log('重点关注(考核口径)块的数值异常')
            xj_str +='重点关注(考核口径)块的数值异常，'
        }else{
            console.log('重点关注(考核口径)块巡检完毕，数值正常')
            xj_str += '重点关注(考核口径)块巡检完毕，数值正常，'
        }
    }catch(e){
        console.log('未找到重点关注(考核口径)的值,可能是页面发生了变更或者未加载出来')
        xj_str += '未找到重点关注(考核口径)的值,可能是页面发生了变更或者未加载出来，'
    }
    //渠道积分
    try{
        automator.clickCenter(selector().text('欠费追收').findOne(2000))
        console.log(selector().text('欠费追收').find().length)
        var ls_count = selector().text('揽收积分').depth(7).find()[1].next().next().text(); //揽收积分
        console.log(ls_count)
        var xt_count = selector().text('协同积分').depth(7).find()[1].next().next().text();//协同积分
        console.log(xt_count)
        var xw_count = selector().text('行为积分').depth(7).find()[1].next().next().text();//行为积分
        console.log(xw_count)
        var wy_count = selector().text('维挽积分').depth(7).find()[1].next().next().text();
        console.log(wy_count)
        if(ls_count=='--' && xt_count=='--' && xw_count=='--' && wy_count=='--'){
            console.log('渠道积分块的数值异常')
            xj_str +='渠道积分块的数值异常，'
        }else{
            console.log('渠道积分块的数值正常')
            xj_str +='渠道积分块的数值正常，'
        }
    }catch(e){
        console.log('未找到渠道积分的值,可能是页面发生了变更或者未加载出来')
        xj_str += '未找到渠道积分的值,可能是页面发生了变更或者未加载出来，'            
    }
    try{
        //欠费追收
        for(var i=0;i<15;i++){
             automator.swipeDown()
             sleep(200)
        }
        var qf_select = selector().text('欠费追收').findOne(5000);
        automator.clickCenter(qf_select);
        var target_number = selector().textContains('目标量').depth(16).find()
        console.log(target_number.length)
        var limit_index = 0
        target_number.forEach(function(fun){
            console.log(fun.text())
            if(extractNumbers(fun.text())[0]==0){
                limit_index+=1
            }
        })
        if(limit_index>=3){
            console.log('场景执行情况块的数值异常')
            xj_str += '场景执行情况块的数值异常'
        }else{
            console.log('场景执行情况块的数值正常')
            xj_str += '场景执行情况块的数值正常，'                
        }
    }catch(e){
        console.log('场景执行情况块的数值异常')
        xj_str += '场景执行情况块,可能是页面发生了变更或者未加载出来，'
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
    for(var i=0;i<2;i++){
        try{
            if(selector().text('首页').findOne(3000)){
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
//启动app
function runApp(user,pwss) {
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
    sleep(4000);
    if(selector().text('手势密码').findOne(3000)){
        console.log('已经登录了不需要再登录，直接手势验证')
        return gesture_verification()
    }else{
        selector().text('工作助手').waitFor(10000)
        if(selector().text('登录').findOne(3000)){
            console.log('打开软件成功')
            if(loginApp(String(user),String(pwss))){
                console.log('登录成功')
                return true
            }else{
                console.log('登录失败')
                return  false
            }            
        }else{
            console.log('打开软件失败')
            return false
        }
    }
}
//退出帐户
function exitApp(){
    var xj_str = ''
    back_index()
    selector().className('android.widget.Button').click()
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
        var phone = configDict['登录账号']
        if(runApp(String(configDict['登录账号']),String(configDict['验证码']))){
            console.log('登录成功')
        }else{
            console.log('登录失败')
            app_str +='登录失败'
            is_not_continue = false
        }
        if(is_not_continue){
            if(openH5()){
                console.log('营销沙盘H5打开成功')
            }else{
                console.log('营销沙盘H5打开失败，未找到该选项')
                app_str +='营销沙盘H5打开失败，未找到该选项'
                is_not_continue = false
            }
        }
        if(is_not_continue){
            var str_text =  branch_office()+'\n'+
                        branch_post_office()+'\n'+
                        grid_view()        +'\n'+
                        area_view()+'\n'+
                        xq_marketing()       +'\n'+
                        screen_view(phone) +'\n'+
                        task_view()    +'\n'+
                        task_other()  +'\n'+
                        // mobile_kanban() +'\n'+
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
// resetDevice()
// branch_post_office()
// xq_marketing()
// branch_post_office()
// back_index()

// grid_view()
// xq_marketing()
// area_view()      
// xq_marketing()
// mobile_kanban()
// init()
// runApp()