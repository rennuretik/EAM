/**
 * Created by chenq on 16/10/8.
 */
$(function () {
    //右侧扩展到底部
    // var wHeight = $(window).innerHeight();
    // $('.menu_table').css({
    //     "min-height":wHeight
    // });

    $(window).on('scroll',function () {
        navFixed();
    })

  /*  /!*左侧栏固定*!/
    function navFixed() {
        var scrollTop = $(window).scrollTop();
        console.log('scrollTop:'+scrollTop);
        if(scrollTop >= 100) {
            $('.views-nav').css('top','0');
        } else {
            $('.views-nav').css('top','100');
        }
    }*/

    //导航栏悬浮
    $(document).on('scroll', function () {
        navwith = $('.right_table').width();
        navFixed();

    })

    function navFixed() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop >= 100) {
            $('.query-operation').css({
                position: 'fixed',
                top: '0',
                width: navwith,
            });

            $('.views-nav').css({
                position: 'fixed',
                top: '0'
            });
        } else if (scrollTop >0 && scrollTop < 100 ) {
            $('.query-operation').css({
                position: 'fixed',
                top: 100-scrollTop,
                width: navwith
            });
            
            $('.views-nav').css({
                position: 'fixed',
                top: 100-scrollTop
            });
        } else {
            $('.query-operation').css({
                position: '',
                top: '',
                width: navwith
            });
            $('.views-nav').css({
                position: '',
                top: ''
            });

        }

    }

    /*全局 初始化 应用上下文路径 */
    var baseUri = $("#baseUri").val();
    var contextPath = $("#contextPath").val();

    //当前选中的节点
    var currSelectNode = {};

/**
 * 消息框
 * */
    function showMsg(msg){
        showMsgCommon(msg);
        $("#modal-msg").css({
            zIndex: '9999'
        });
    }

    $(".cancleMsg").bind("click",function(){
        $(this).parent().parent().hide("normal", function () {
            $('#msgContent').text("");
        });
    });

/**
 * 菜单树展示部分
 * */
    var menuTree = {};

    //菜单树的设定
    var menuOption = {
        async: {
            enable: true,
            url: baseUri + "/menu/menutree.json",
            autoParam: ["menuCode"],
            dataFilter: function (treeId, parentNode, responseData) {
                return responseData.result;
            }
        }, view: {
            showLine: true,
            dblClickExpand: true,
            selectedMulti: false
        }, data: {
            key: {
                name: "menuName", //设置树节点的name，节点参数name必须和它匹配
                children: "childMenuVos",
                url: null //设置ztree点击节点不进行url跳转
            }, simpleData: {
                enable: true, //开启树的层级结构
                idKey: "menuId", //设置树节点id，节点参数id必须与之匹配
                pIdKey: "parentId" //设置pid，节电参数pid必须与之匹配
            }
        }, callback: {
            onClick: function (event, treeId, treeNode) {
                currSelectNode = treeNode;
                showRightList(treeNode);
            },
            onRightClick: function (event, treeId, treeNode) {
               /* alert("右键菜单展示!");*/
            },
            onAsyncSuccess:afterNodesRefresh
        }
    };

    menuTree = $.fn.zTree.init($("#tree"), menuOption);

    /*保存刷新前的选中节点*/
    var selectnode=null;
    /*刷新左侧菜单树数据 在：编辑-更新、新增、启用/禁用 操作后，必须同步刷新*/
    function refreshNodes() {
        var treeNode=menuTree.getSelectedNodes();
        if(treeNode.length>0) {
            selectnode = treeNode[0];
        }
        menuTree.reAsyncChildNodes(null,"refresh",false);
        /* PS：局部刷新不启用：因后台暂无合适接口
         menuTree.reAsyncChildNodes(selectnode,"refresh",false);
         */
    }
    function afterNodesRefresh(event,treeId,treeNode,msg) {
        var flag=true;
        var nodes;
        if(selectnode) {
            /*如果选中的节点依然存在*/
            nodes = menuTree.getNodeByParam("menuId", selectnode.menuId);
            if(nodes) {
                flag=false;
            }else{
                /*如果选中的节点刷新后不存在了*/
                nodes = menuTree.getNodeByParam("menuId", selectnode.parentId);
                flag=!nodes;
            }
        }
        /*如果没有选中的节点*/
        if(flag){
            nodes=menuTree.getNodes()[0];
        }
        /*初始化左侧选中节点，并重新渲染右侧页面列表*/
        menuTree.selectNode(nodes);
        showRightList(nodes);
        selectnode=null;
    }

    /*数据初始化 预编译juicer模板*/
    var tplRight=[
        "{@each childMenuVos as it,index}",
        "<tr>",
        "<td class='choose'>","<input type='checkbox' class='menu_table-checkbox'>","</td>",
        "<td class='menu-code'>", "${it.menuCode}", "</td>",
        "<td class='menu-call'>", "${it.menuName}", "</td>",
        "<td class='menu-url'>", "${it.menuAction}", "</td>",
        "<td style='display: none' class='menu-menuId'>", "${it.menuId}", "</td>",
        "<td class='operate'>",
        "<a href='#' class='edit'>","编辑","</a>",
        "<a href='#' class='del'>","删除","</a>",
        "<a href='#' class='state'>","${it|enableToCN}","</a>",
        "$${_|showOrder,index}",
        "$${it|showShifted}",
        "</td>",
        "</tr>",
        "{@/each}"].join("");
    var enableToCN=function(data){
        return data.isEnable ? "禁用":"启用";
    };
    var showShifted=function(data){
        return ["<a href='#' class='shifted' parentId='",data.parentId ,"'>","移动","</a>"].join("");
    };
    var showOrder=function(data,index){
        index=parseInt(index);
        var last=data.childMenuVos.length-1;
        if( data.childMenuVos && data.childMenuVos.length > 1 ) {
            var ordplus= index===0 ? "ordplus gray":"ordplus";
            var ordminus= index==last ? "ordminus gray":"ordminus";
            return ["<a href='#' class='", ordplus, "'>","∧","</a>","<a href='#' class='" ,ordminus ,"'>","∨","</a>"].join("");
        }
        return ;
    };
    juicer.register("enableToCN",enableToCN);
    juicer.register("showShifted",showShifted);
    juicer.register("showOrder",showOrder);
    var rightMenuVo=juicer(tplRight);
    /* 点击 左侧树节点 在右侧页面 展示列表*/
    function showRightList(treeNode) {
        var menuVoshtml;
        /*如果是单条数据*/
        if (!treeNode.childMenuVos) {
            treeNode = {"childMenuVos": []};
        }
        menuVoshtml = rightMenuVo.render(treeNode);/*修改：选中叶子节点后右侧不展示*/
        $("#tbody").html(menuVoshtml);
        checkSelAll();
    };


    /*填充编辑弹窗数据：从 左侧树 获取该节点 的各个属性值*/
    function menuEditShow(menuId) {
        /*根据ID查找节点*/
        var nodeObj = menuTree.getNodeByParam("menuId", menuId );
        $('.menu-menuId-update').val( nodeObj.menuId ||"");
        $('.menu-code-update').val( nodeObj.menuCode ||"" );
        $('.menu-name-update').val( nodeObj.menuName ||"" );
        $('.menu-url-update').val( nodeObj.url ||"" );
        $('.menu-url-update').val( nodeObj.url ||"" );
        var module = nodeObj.module;
        $('.text-block-update').text( module.split("##")[1]||"" );
        $('.text-block-update-value').text( module.split("##")[0] ||"" );
        var iconValue=nodeObj.menuIcon;
        $('.text-icon-update').text( getIconText(iconValue) );
        $('.text-icon-update-value').text( iconValue );
        $('.menu-belong-update').val( nodeObj.authCodes ||"" );
    }

    /*根据icon的图标名称（text），查找在新增、编辑弹窗的菜单图标下拉框中初始化过的（value）*/
    function getIconValue(iconTxet){
        if( !iconTxet ) {
            return "";
        }
        var classSel = ".flag-" + iconTxet+":first";
        return $(classSel).text();
    }

    function getIconText(iconValue){
        if( !iconValue ) {
            return "";
        }
        var iconText = "";
        $(".select-option6 ").find("p").each(function (idx,item) {
            if($(item).text()===iconValue) {
                iconText = $(item).next().text();
            }
        })
        return iconText;
    }

/**
 * ajax执行更、删、改、增
 */

    /*新增、编辑时 验证数据完整性 的flag及msg*/
    var validFlag=true;
    var validMsg="";
    function valid(_validMsg){
        if(validFlag){
            validMsg=_validMsg;
        }
        validFlag=false;
    }
    function turnValid(){
        if(validFlag) {
            return true;
        }
        showMsg("“"+validMsg+"”数据是必需项");
        validFlag=true;
        validMsg="";
        return false;
    }

    /*提交 新增 的ajax请求*/
    function addMenu() {
        var flag = false;
        var menuname=$('.menu-name').val()|| valid("菜单名称");
        var parentId = currSelectNode.menuId || "";
        var menuLevel = (currSelectNode.level  || 0) + 1;
        var menuCode= $('.menu-code').val() || valid("菜单编码");
        var menuAction= $('.menu-url').val() || "";
        var menuIcon= getIconValue($('.text-icon').text()) || valid("菜单图标");
        var module= $('.text-block-value').text() || valid("所属模块");
        var authCodes= $('.menu-belong').val() || "";
        if(!turnValid()) {
            return;
        }
        $.ajax({
            url: baseUri + "/menu/add.json",
            data: {
                "menuCode": menuCode,
                "menuName": menuname,
                "menuAction": menuAction,
                "menuIcon": menuIcon,
                "module": module,
                "authCodes": authCodes,
                "parentId": parentId,
                "menuLevel": menuLevel
            },
            type: "post",
            async: true,
            success: function (data) {
                if (data.success) {
                    showMsg("菜单" + menuname + "新增成功！");
                    flag = true;
                    $('.menu-name').val("");
                    $('.menu-code').val("") ;
                    $('.menu-url').val("");
                    $('.text-block-value').text("");
                    $('.text-block').text("");
                    $('.menu-belong').val("");
                    $('.text-icon').text("");
                    $('.text-icon-value').text("");
                } else {
                    var msg = data.message | "未知原因";
                    showMsg("菜单"+menuname+"删除未成功！" + msg);
                }
                refreshNodes();
            }, error: function (data) {
                showMsg("新增" + menuname + "失败，通讯异常！"+data.statusText);
            }, complete:function (data) {
                $('.win_con_cus-add').hide();
                $('.win_warp').removeClass('win_warpModal');
            }
        });
        return flag;
    }

    /*提交 更新 ajax请求*/
    function updateMenu() {
        var flag = false;
        var menuId=$('.menu-menuId-update').val()|| valid("菜单ID");
        var menuname=$('.menu-name-update').val()|| valid("菜单名称");
        var menuCode= $('.menu-code-update').val() || valid("菜单编码");
        var menuAction= $('.menu-url-update').val() || "";
        var menuIcon= $('.text-icon-update-value').text() || valid("菜单图标");
        var module= $('.text-block-update-value').text() || valid("所属模块");
        var authCodes= $('.menu-belong-update').val() || "";
        if(!turnValid()) {
            return;
        }
        $.ajax({
            url: baseUri + "/menu/update.json",
            data: {
                "menuId": menuId,
                "menuCode": menuCode,
                "menuName": menuname,
                "menuAction": menuAction,
                "menuIcon": menuIcon,
                "module": module,
                "authCodes": authCodes
            },
            type: "post",
            async: true,
            success: function (data) {
                if (data.success) {
                    showMsg("菜单" + menuname + "更新成功！");
                    flag = true;
                } else {
                    showMsg("菜单" + menuname + "更新失败！");
                }
                refreshNodes();
            }, error: function (data) {
                showMsg("更新" + menuname + "失败，通讯异常！"+data.statusText);
            }, complete:function (data) {
                $('.win_con_cus-update').hide();
                $('.win_warp').removeClass('win_warpModal');
            }
        });
        return flag;
    }

    /*提交 删除 的ajax请求*/
    function deteleMenu(id, name) {
        $.ajax({
            url: baseUri + "/menu/delete.json",
            data: {
                "menuId": id,
            },
            type: "post",
            async: true,
            success: function (data) {
                if (data.success) {
                    showMsg("菜单" + name + "删除成功！");
                } else {
                    var msg = data.message | "未知原因";
                    showMsg("菜单"+name+"删除未成功！" + msg);
                }
                refreshNodes();
            }, error: function (data) {
                showMsg("删除" + name + "失败，通讯异常！"+data.statusText);
            }, complete:function (data) {
                cancleDelete();
            }

        });

    }

    /*提交 批量删除 的ajax请求*/
    function batchDeleteMenu(ids) {
        $.ajax({
            url: baseUri + "/menu/batch_delete.json",
            data: {
                "idArray":  ids.join(",")
            },
            type: "post",
            async: true,
            success: function (data) {
                if (data.success) {
                    showMsg("批量删除 成功！");
                } else {
                    var msg = data.message | "未知原因";
                    showMsg("批量删除 未成功！" + msg);
                }
                refreshNodes();
            }, error: function (data) {
                showMsg("批量删除失败，通讯异常{"+data.statusText+"}");
            }
        });
    }

    /*提交 启/禁用 的ajax请求*/
    function beUsedMenu(id, name, flag) {
        var op = flag ? "启用" : "禁用";
        $.ajax({
            url: baseUri + "/menu/beUsed.json",
            data: {
                "menuId": id,
                "beUsed": flag
            },
            type: "post",
            async: true,
            success: function (data) {
                if (data.success && data.result) {
                    showMsg(""+name + op + "成功！");
                } else {
                    var msg = data.message | "未知原因";
                    showMsg(""+name + op + "失败！" + msg);
                }
                refreshNodes()
            }, error: function (data) {
                showMsg(""+name + op + "失败，" + "通讯异常！"+data.statusText);
            }
        });
    }

    /*菜单排序 的ajax请求*/
    function orderingMenus(ids,parentId) {
        $.ajax({
            url: baseUri + "/menu/reorder.json",
            data: {
                "orderIds": ids,
                "parentId": parentId
            },
            type: "post",
            async: true,
            success: function (data) {
                if (! data.success && data.result) {
                    var msg = data.message | "未知原因";
                    showMsg("菜单排序失败！" + msg);
                }
                refreshNodes()
            }, error: function (data) {
                showMsg("菜单排序失败，" + "通讯异常！"+data.statusText);
            }
        });
    }

    /*菜单移动 的ajax请求*/
    function shiftMenu(targetMenuId,newParentId) {
        $.ajax({
            url: baseUri + "/menu/shiftMenu.json",
            data: {
                "menuId": targetMenuId,
                "newParentId": newParentId
            },
            type: "post",
            async: true,
            success: function (data) {
                if (data.success && data.result) {
                    showMsg("菜单移位成功！");
                } else {
                    var msg = data.message | "未知原因";
                    showMsg("菜单移位失败！" + msg);
                }
                refreshNodes()
            }, error: function (data) {
                showMsg("菜单移位失败，" + "通讯异常！"+data.statusText);
            }, complete:function (data) {
                $('.win_con_cus-shift').hide();
                $('.win_warp').removeClass('win_warpModal');
            }
        });
    }

/**
 * 右侧菜单列表编辑、删除、启/禁用的按钮以及新增按钮的各种事件绑定
 * */

    /*点击隐藏菜单树*/
    arrowApp();
    function arrowApp(){
        var flag = true;
        $("#sy").click(function () {
            if (flag) {
                $(".views-nav").hide();
                $('.views-content').css('padding-left','15px');
                $('.right_arrow').show();
                $('.left_arrow').hide();
                var width = $('.right_table').width();
                $('.query-operation').width(width-32);
            } else {
                $(".views-nav").show();
                $('.views-content').css('padding-left','220px');
                $('.right_arrow').hide();
                $('.left_arrow').show();
                var width = $('.right_table').width();
                $('.query-operation').width(width-16);
            }
            flag = !flag;
        });
    }
        
       /* $(".views-nav").toggle();
        $("#lre").toggleClass('left_arrow').toggleClass('right_arrow');
        $("#rm").toggleClass('right_table').toggleClass('right_table2');*/



    /*弹出新增框*/
    $('.operate-btn1').bind("click",function () {
        $('.win_warp').addClass('win_warpModal');
        $('.win_con_cus-add').show().css({
            zIndex: '9999'
        });
        $('.win_con_cus-add').children(".wid_con_text").find("input,textarea").val("").end().find(".menu-icon,.menu-block").children("p").text("");
    });
    /*弹出编辑框*/
    $('#tbody').on("click", ".edit", function () {
        var menuId=$(this).parent().parent().children('.menu-menuId').text();
        menuEditShow(menuId);
        $('.win_warp').addClass('win_warpModal');
        $('.win_con_cus-update').show().css({
            zIndex: '9999'
        })
    });
    /*点击新增框确定按钮的事件绑定*/
    $('.submit-add').bind('click', addMenu );
    /*点击编辑框更新按钮的事件绑定*/
    $('.update').bind('click', updateMenu );
    /*关闭新增、更新弹框(下方取消按钮)*/
    $('.close').bind('click', function () {
        $(this).parent().parent().hide();
        $('.win_warp').removeClass('win_warpModal');

    })
    /*关闭新增、更新弹框(右上角关闭按钮)*/
    $('.wid_close').bind('click', function () {
        $(this).parent().parent().parent().hide();
        $('.win_warp').removeClass('win_warpModal');
    });

    /*点击 删除 弹出确认窗*/
    $('#tbody').on("click", ".del", function () {
        var trObj = $(this).parent().parent();
        $("#del-menuId").text(trObj.children('.menu-menuId').text());
        $("#del-menuName").text(trObj.children('.menu-call').text());
        $('.win_warp').addClass('win_warpModal');
        $('.win_con_cus-del').show().css({
            zIndex: '9999'
        });
    });
    /*点击删除消息弹窗 确认*/
    $('.delete-ensure').bind('click', function () {
        var id = $("#del-menuId").text();
        var name = $("#del-menuName").text();
        deteleMenu(id, name);
    });
    /*点击删除消息弹窗 取消*/
    $('.delete-cancle').bind('click', cancleDelete);
    function cancleDelete(){
        $('.win_con_cus-del').hide();
        $('.win_warp').removeClass('win_warpModal');
        $("#del-menuId").text("");
        $("#del-menuName").text("");
    }

    /*勾选复选框 全选/不选 */
    $('.menu_table-checkbox-all').on('click', function () {
        var isCheck = $(this).is(':checked');
        $('.menu_table-checkbox').prop('checked', isCheck);
    });
    /*判断 是否全选了列表*/
    $("tbody").on('click','.menu_table-checkbox',checkSelAll);

    function checkSelAll(){
        var isAll = true;
        var $many=$('.menu_table-checkbox');
        $many.each(function (i,item) {
            isAll = $(item).is(':checked') & isAll;
        })
        if($many.length<1) {
            isAll=false;
        }
        $('.menu_table-checkbox-all').prop('checked', isAll);
    }

    /*点击批量删除按钮*/
    /*var ids=[];*/
    $('.operate-btn2').on('click', function () {
        var ids = [];
        var inputs=$(".menu_table-checkbox");
        inputs.each(function(i,item) {
            if( $(this).is(':checked') ){
                ids.push( $(this).closest("td").siblings(".menu-menuId").text() );
            }
        });
        if(ids.length==0){
            showMsg("您未选中任何一条!");
        }else{
            confirmCom("确定删除这"+ids.length+"条数据？",batchDeleteMenu,new Array(ids),null);
        }

    });

    /*点击禁用启用按钮*/
    $('#tbody').on("click", ".state", function () {
        var flag = "启用" == $(this).text();
        var menuId = $(this).parent().siblings('.menu-menuId').text();
        var menuName = $(this).parent().siblings('.menu-call').text();
        beUsedMenu(menuId, menuName, flag)
    });

    /*点击 上移 按钮*/
    $('#tbody').on("click", ".ordplus", function () {
        var trTarget=$(this).closest("tr");
        var trPrev = trTarget.prev("tr");
        if(trPrev.length>0) {
            $(this).addClass("red");
            trPrev.before(trTarget);
            saveOrder();
        }
    });
    /*点击 下移 按钮*/
    $('#tbody').on("click", ".ordminus", function () {
        var trTarget=$(this).closest("tr");
        var trNext = trTarget.next("tr");
        if(trNext.length>0) {
            $(this).addClass("red");
            trNext.after(trTarget);
            saveOrder();
        }
    });
    /*提取当前顺序*/
    function saveOrder() {
        var ids=[];
        var parentId="";
        var selTreeNode=menuTree.getSelectedNodes();
        if(selTreeNode.length>0) {
            parentId=selTreeNode[0].menuId || "";
        }else{
            showMsg("选中左侧树父节点后，方可操作子菜单顺序！");
            return;
        }
        $('#tbody').children("tr").each(function (i, item) {
            ids[i]=$(this).children(".menu-menuId").text();
        });
        if(ids.length>1) {
            orderingMenus(ids.join(","),parentId);
        }
    };

    /*点击 移动 按钮*/
    $('#tbody').on("click", ".shifted", function () {
        $("#shiftOldParentId").val("");
        $("#shiftMenuId").val("");
        $("#shiftTree").empty();
        var parentId=$(this).attr('parentId');
        $("#shiftOldParentId").val(parentId);
        var shift_menuId = $(this).parent().siblings('.menu-menuId').text();
        $("#shiftMenuId").val(shift_menuId);
        initShiftTree(shift_menuId);
        $('.win_warp').addClass('win_warpModal');
        $(".win_con_cus-shift").show().css({
            zIndex: '9999'
        });
    });
    /*点击 移动弹窗-确定按钮*/
    $('.submit-shift').bind("click", function () {
        var new_parentId;
        var selTreeNode=menuShiftTree.getSelectedNodes();
        if(selTreeNode.length>0) {
            new_parentId = selTreeNode[0].menuId || "";
            var targetMenuId=$("#shiftMenuId").val();
            if(new_parentId) {
                var old_parentId=$("#shiftOldParentId").val();
                if(new_parentId!==old_parentId) {
                    shiftMenu(targetMenuId,new_parentId);
                }
            }else{
                shiftMenu(targetMenuId,"");
            }
        }else{
            showMsg("未做任何调整");
        }
    });

    //搜索树
    $(".d_search").click(function (){
        searchNode("menuName", $("#search-menu").val(), menuTree);
    });
    //收缩树结构
    $(".d_combine").click(function (eve) {
        menuTree.expandAll ( false );
    });
    //展开树结构
    $(".d_spread").click(function (eve) {
        menuTree.expandAll ( true );
    });

    //查找节点
    function searchNode( name ,value, treeObj ) {
        var contextNodes = treeObj.transformToArray( treeObj.getNodes () );

        treeObj.hideNodes ( contextNodes );

        if ( ! value || value==="请输入关键字" ) {
            treeObj.showNodes ( contextNodes );
            treeObj.expandAll ( false );
            return;
        }
        if ( value ) {
            var nodes = treeObj.getNodesByParamFuzzy ( name, value, null );
            //递归父节点
            for ( var i = 0, l = nodes.length; i < l; i ++ ) {
                getParents ( nodes[ i ], nodes );
            }
            treeObj.showNodes ( nodes );
            treeObj.expandAll ( true );
        }
    }

    //获取父节点
    function getParents( nd, nodeList ) {
        if ( nd ) {
            var ndp = nd.getParentNode ();

            if ( ndp ) {
                if ( nodeList.indexOf ( ndp ) === - 1 ) {
                    nodeList.push ( ndp );
                }
                getParents ( ndp, nodeList );
            }
        }
    }
/**
 * 下拉选择框部分
 * */
    /*初始化 菜单移动下拉可选项 弹窗中的树*/
    var menuShiftTree;
    function initShiftTree(menuId) {
        var nodes = menuTree.getNodes()[0];
        var menuShiftOption = {
            data: {
                key: {
                    name: "menuName", //设置树节点的name，节点参数name必须和它匹配
                    children: "childMenuVos",
                    url: null //设置ztree点击节点不进行url跳转
                }, simpleData: {
                    enable: true, //开启树的层级结构
                    idKey: "menuId", //设置树节点id，节点参数id必须与之匹配
                    pIdKey: "parentId" //设置pid，节电参数pid必须与之匹配
                }
            }
        };
        menuShiftTree = $.fn.zTree.init( $("#shiftTree"), menuShiftOption, nodes );
        if(menuId) {
            var selfNode = menuShiftTree.getNodeByParam("menuId", menuId);
            menuShiftTree.removeNode(selfNode);
        }
    }

    /* 新增、编辑 弹窗框的 菜单名称、模块名称、菜单图标三个下拉框 数据初始化及事件绑定 */
    function initSelValue() {
        /*初始化菜单名称*/
        $.ajax({
            url: contextPath + "/function/list/top.json",
            data: {},
            type: "post",
            async: true,
            success: function (data) {
                if (data.success) {
                    var tplA = [
                        "{@each childrenVo as it}",
                        "<div class='text-box0 menu-name-select' name='${it.funcName}'>",
                            "<p class='per-url' style='display:none'>${it.funcUrl}</p>",
                            "<p class='per-icon' style='display:none'>${it.funcIcon}</p>",
                            "<p class='per-authCode' style='display:none'>${it.authCode}</p>",
                            "<p class='select-text'>${it.funcName}</p>",
                        "</div>",
                        "{@/each}"].join("");
                    var contentA = "";
                    /*提取每项的childrenVo中的数据处理后接起来，组成菜单名称的列表*/
                    for (var i = 0; i < data.result.length; i++) {
                        contentA += juicer(tplA, data.result[i]);
                    }
                    $(".select-option,.select-option4").html(contentA);
                } else {
                    showMsg("获取功能列表失败！");
                }
            }, error: function (data) {
                showMsg("获取功能列表失败，通讯异常！");
            }

        });

        /*初始化模块名称*/
        $.ajax({
            url: contextPath + "/dictionary/items/system.module.json",
            data: {},
            type: "post",
            async: true,
            success: function (data) {
                if (data.success) {
                    var tplB = [
                        "{@each result as it}",
                        "<div class='text-box0 menu-block-select'>",
                            "<p style='display: none' class='moduleValue'>${it.value}</p>",
                            "<p class='select-text'>${it.text}</p>",
                        "</div>",
                        "{@/each}"].join("");
                    var contentB = juicer(tplB, data);
                    $(".select-option2,.select-option5").html(contentB);
                } else {
                    showMsg("获取模块列表失败！");
                }
            }, error: function (data) {
                showMsg("获取模块列表失败，通讯异常！");
            }

        });

        /*初始化菜单图标*/
        $.ajax({
            url: contextPath + "/dictionary/items/menu.icon.json",
            data: {},
            type: "post",
            async: true,
            success: function (data) {
                if (data.success) {
                    var tplC = [
                        "{@each result as it}",
                            "<div class='text-box0 menu-icon-select'>",
                            "<p style='display: none' class='flag-${it.text}'>${it.value}</p>",
                            "<p class='select-text'>${it.text}</p>",
                        "</div>",
                        "{@/each}"].join("");
                    var contentC = juicer(tplC, data);
                    $(".select-option3,.select-option6").html(contentC);
                } else {
                    showMsg("获取菜单图标列表失败！");
                }
            }, error: function (data) {
                showMsg("获取菜单图标列表失败，通讯异常！");
            }

        });
    }
    initSelValue();

    //编辑、新增弹窗 菜单名称、所属模块、菜单图标 下拉框 绑定点击事件
    $('.menu-block-update,.menu-block,.menu-icon-update,.menu-icon,.menu-name-update,.menu-name').bind('click', function () {
        var divObj=$(this).next("div");
        divObj.is(":visible")? divObj.hide():divObj.show().children("div").show();
    });

    //编辑、新增弹窗 1.菜单名称 输入框输入可自动补全事件绑定
    $('.drop input').keydown(throttle(autoComplete,500));

    /*自动补全*/
    function autoComplete(){
        var _this=$(".win_con_cus-add").is(":visible")?$(".menu-name"):$(".menu-name-update");
        var menuName=_this.val();
        var divObj=_this.next("div").children("div[name*='"+menuName+"']");
        if(divObj.length>0) {
            _this.next("div").show().children("div").not(divObj).hide();
        }
    }
    /*节流*/
    function throttle(method,delay){
        var timer;
        return function(){
            clearTimeout(timer);
            timer = setTimeout(function () {
                method();
            }, delay);
        }
    };

    //编辑、新增弹窗 1.菜单名称 下拉框 子选项 绑定点击事件并初始化弹窗页面数据
    $('.select-option,.select-option4').on("click", ".menu-name-select", function () {
        var thisObj=$(this);
        var input_box_drop=thisObj.closest(".drop");
        var preUrl=thisObj.find(".per-url").text();
        var perAuthCode=thisObj.find(".per-authCode").text();
        var perIconText=thisObj.find(".per-icon").text();
        /*如果是新增弹窗*/
        var _$span;
        if( input_box_drop.parent().parent().hasClass("win_con_cus-add") ){
            _$span = input_box_drop.find(".menu-name");
            $(".menu-url").val(preUrl);
            $(".menu-belong").val(perAuthCode);
            $(".text-icon").text(getIconText(perIconText));
            $(".text-icon-value").text(perIconText);
        }else{
            _$span = input_box_drop.find(".menu-name-update");
            $(".menu-url-update").val(preUrl);
            $(".menu-belong-update").val(perAuthCode);
            $(".text-icon-update").text(getIconText(perIconText));
            $(".text-icon-update-value").text(perIconText);
        }
        _$span.val(thisObj.find(".select-text").text());
        _$span.next("div").hide();
    });

    //编辑、新增弹窗 2.所属模块、3.菜单图标 下拉框 子选项 绑定点击事件并初始化弹窗页面数据
    $('.select-option2,.select-option5,.select-option3,.select-option6').on("click", ".menu-block-select,.menu-icon-select", function () {
        var _$span = $(this).closest(".drop").find("span:first");
        _$span.children("p:hidden").text($(this).children("p:hidden").text());
        _$span.children("p:visible").text($(this).children("p:visible").text());
        _$span.next("div").hide();
    });

})