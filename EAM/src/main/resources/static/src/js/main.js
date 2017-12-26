/**
 * Created by chenjia on 2017/3/12.
 */

/*全局 初始化 应用上下文路径 */
var baseUri = $("#baseUri").val();
var contextPath = $("#contextPath").val();


//右侧扩展到底部
var wHeight = $(window).innerHeight();
console.log('wHeight:' + wHeight);
$('.menu_table').css({
    height: wHeight - 169
})

$(window).on('scroll', function () {
    navFixed();
})

//导航栏悬浮
$(document).on('scroll', function () {
    navwith = $('.right_table').width();
    navFixed();
})

function navFixed() {
    var scrollTop = $(window).scrollTop();
    console.log('scrolltop:' + scrollTop);
    console.log('widthz;' + navwith);
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
    } else if (scrollTop > 0 && scrollTop < 100) {
        $('.query-operation').css({
            position: 'fixed',
            top: 100 - scrollTop,
            width: navwith
        });

        $('.views-nav').css({
            position: 'fixed',
            top: 100 - scrollTop
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
/*排课*/
$('#operate-btn1').on('click', function (e) {
    layer.open({
        type: 1,
        title: '排课',
        area: '566px',
        content: $('#arrange'),
        btn: ['确认', '取消'],
        yes: function (index) {
            $.ajax({
                url: contextPath + "/coursePlan/arrange/course",
                type: "post",
                async: true,
                success: function (data) {
                    layer.alert(data.result);
                    layer.close(index);
                }
            })
        },
        btn2: function (index) {
            layer.close(index);
        }
    })

})
/*清空教学计划*/
$('#operate-btn5').on('click', function (e) {
    layer.open({
        type: 1,
        title: '清空教学计划',
        area: '566px',
        content: $('#clear'),
        btn: ['确认', '取消'],
        yes: function (index) {
            $.ajax({
                url: contextPath + "/coursePlan/clear",
                type: "post",
                async: true,
                success: function (data) {
                    layer.alert(data.result);
                    layer.close(index);
                }
            })
        },
        btn2: function (index) {
            layer.close(index);
        }
    })

})
//当前选中的节点
var currSelectNode = {};

/**
 * 菜单树展示部分
 * */
var menuTree = {};
//点击的节点
var treeNode1 = null;
var byName = "";
var url = "/coursePlan/class/Ztree";
/*班级管理树，用于按班级查询课表*/
$('#operate-btn2').on('click', function (e) {
    url = "/coursePlan/class/Ztree";
    byName = "class";
    showTree(url);

})
/*教师管理树，用于按教师查询课表*/
$('#operate-btn3').on('click', function (e) {
    url = "/coursePlan/teacher/Ztree";
    byName = "teacher";
    showTree(url);
})
/*教室管理树，用于按教室查询课表*/
$('#operate-btn4').on('click', function (e) {
    url = "/coursePlan/room/Ztree";
    byName = "room";
    showTree(url);
})

function showTree(url) {
//菜单树的设定
    var menuOption = {
        async: {
            enable: true,
            url: contextPath + url,
            autoParam: ["id"],
            dataFilter: function (treeId, parentNode, responseData) {
                return responseData.result;
            }
        }, view: {
            showLine: true,
            dblClickExpand: true,
            selectedMulti: false
        }, data: {
            key: {
                name: "name", //设置树节点的name，节点参数name必须和它匹配
                children: "children",
                url: null //设置ztree点击节点不进行url跳转
            }, simpleData: {
                enable: true, //开启树的层级结构
                idKey: "id", //设置树节点id，节点参数id必须与之匹配
                pIdKey: "parentId" //设置pid，节电参数pid必须与之匹配
            }
        }, callback: {
            onClick: function (event, treeId, treeNode) {
                treeNode1 = treeNode;
                showRightList(treeNode);
            },
            onRightClick: function (event, treeId, treeNode) {
                /* alert("右键菜单展示!");*/
            },
        }
    };
    menuTree = $.fn.zTree.init($("#menuTree"), menuOption);
}

function showRightList(treeNode) {
    currSelectNode = treeNode;
    $.ajax({
        url: contextPath + "/coursePlan/" + byName + "/list",
        data: {
            "id": treeNode.id,
        },
        type: "post",
        async: true,
        success: function (data) {
            $("#tbody").html("");
            var week = data.result;
            var formHtml;
            formHtml += "<tr>" +
                "<td><h4><strong>时间/星期</strong></h4></td>" +
                "<td><h4><strong>星期一</strong></h4></td>" +
                "<td><h4><strong>星期二</strong></h4></td>" +
                "<td><h4><strong>星期三</strong></h4></td>" +
                "<td><h4><strong>星期四</strong></h4></td>" +
                "<td><h4><strong>星期五</strong></h4></td>" +
                "</tr>" +
                "<tr>" +
                "<td><h4><strong>第一节</strong></h4></td>" +
                "<td>" + week[0] + "</td>" +
                "<td>" + week[4] + "</td>" +
                "<td>" + week[8] + "</td>" +
                "<td>" + week[12] + "</td>" +
                "<td>" + week[16] + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td><h4><strong>第二节</strong></h4></td>" +
                "<td>" + week[1] + "</td>" +
                "<td>" + week[5] + "</td>" +
                "<td>" + week[9] + "</td>" +
                "<td>" + week[13] + "</td>" +
                "<td>" + week[17] + "</td>" +
                "</tr>" +
                "<td><h4><strong>第三节</strong></h4></td>" +
                "<td>" + week[2] + "</td>" +
                "<td>" + week[6] + "</td>" +
                "<td>" + week[10] + "</td>" +
                "<td>" + week[14] + "</td>" +
                "<td>" + week[18] + "</td>" +
                "</tr>" +
                "<td><h4><strong>第四节</strong></h4></td>" +
                "<td>" + week[3] + "</td>" +
                "<td>" + week[7] + "</td>" +
                "<td>" + week[11] + "</td>" +
                "<td>" + week[15] + "</td>" +
                "<td>" + week[19] + "</td>" +
                "</tr>";
            $("#tbody").html(formHtml);

        }, error: function (data) {
            //showMsg("新增" + menuname + "失败，通讯异常！" + data.statusText);
        }
    });
}





