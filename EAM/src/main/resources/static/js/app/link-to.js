/*
 *   对私持有产品跳转方法
 *   @ custIsn: 客户内码
 *   @ addr: 目标所属模块地址（如： 持有产品）用于发送ajax
 *   @ dataid 所属模块dataid
 *   @ targetkey 跳转1级菜单
 *   @ href 跳转2级子菜单
 * */
var privateSumLinkTo = function (custIsn, addr, dataid, targetKey, href){
    //(custIsn, targetKey, addr, dataid, href) {
    var targetPage;
    // 监听ajax "/cust/product/info"
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings.url === contextPath + addr) {
            // 在目标内层标签跳转到目标位置（模拟点击侧边栏链接）需等待ajax请求完成才执行次方法
            setTimeout(function () {
                targetPage = $('#no' + custIsn);
                if (targetKey){    //第一层链接
                    $('[id=id' + targetKey + '-' + custIsn + ']').click();
                    if(href){     //第二层链接
                        $('[href=#' + href +'-'+ custIsn + ']').click();
                    }
                }
            }, 500)
        } else {
            
        }
    });
    // 从对应的9宫格打开内层标签
    $('#no' + custIsn).find('[data-id='+dataid+']').click();

    // 如果该页已打开，直接执行
    if( $('#no'+ dataid + custIsn ) ) {
        if (targetKey){    //第一层链接
            $('[id=id' + targetKey + '-' + custIsn + ']').click();
            if(href){     //第二层链接
                $('[href=#' + href +'-'+ custIsn + ']').click();
            }
        }
    }
};
/*
 *   9宫格其他页面跳转方法
 *   @ custIsn: 客户内码
 *   @ addr: 目标所属模块地址（如： 持有产品）用于发送ajax
 *   @ dataid 所属模块dataid
 *   @ href 跳转菜单
 * */
var privateAllLinkTo = function (custIsn, addr, dataid, href) {
    var targetPage;
    // 监听ajax
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings.url === contextPath + addr) {
            // 在目标内层标签跳转到目标位置（模拟点击侧边栏链接）需等待ajax请求完成才执行次方法
            setTimeout(function () {
                targetPage = $('#no' + custIsn);
                console.log(targetPage);
                //ajax 如果是
                if(href != '-1'){     //第二层链接
                    $('[href=#' + href +'-'+ custIsn + ']').click();
                }
            }, 500)
        } else {

        }
    });
    // 从对应的9宫格打开内层标签
    $('#no' + custIsn).find('[data-id='+dataid+']').click();
    if( $('#no'+ dataid + custIsn ) ) {
        if(href != '-1'){     //第二层链接
            $('[href=#' + href +'-'+ custIsn + ']').click();
        }
    }
};
/*
 *   对私持有产品页面内跳转方法
 *   @ custIsn: 客户内码
 *   @ targetKey 一级链接
 *   @ href 二级链接
 * */
var privateLinkATab = function (custIsn, targetKey, href) {
    if (targetKey){    //第一层链接
        $('[id=id' + targetKey + '-' + custIsn + ']').click();
        if(href){     //第二层链接
            $('[href=#' + href +'-'+ custIsn + ']').click();
        }
    }
};
