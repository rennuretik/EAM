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

//当前选中的节点
var currSelectNode = {};

/**
 * 菜单树展示部分
 * */
var menuTree = {};
//点击的节点
var treeNode1 = null;
//菜单树的设定
var menuOption = {
    async: {
        enable: true,
        url: contextPath + "/clazz/Ztree",
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

function showRightList(treeNode) {
    currSelectNode = treeNode;
    $.ajax({
        url: contextPath + "/selectCourse/click/list",
        data: {
            "id": treeNode.id,
        },
        type: "post",
        async: true,
        success: function (data) {
            $("#tbody").html("");
            var results = data.result;
            var formHtml;
            for (var i = 0; i < results.length; i++) {
                var selectCourse = results[i];
                formHtml += "<tr>" +
                    "<td class='choose'>" +
                    "<input type='checkbox' name='subBox' class='menu_table-checkbox'>" +
                    "</td>" +
                    "<td id='" + selectCourse.ccId + "-id' class='id' style='display: none'>" + selectCourse.ccId + "</td>" +
                    "<td id='" + selectCourse.ccId + "-mId' class='hide'>" + selectCourse.clazzByClassId.majorByMId.mId + "</td>" +
                    "<td id='" + selectCourse.ccId + "-mName' >" + selectCourse.clazzByClassId.majorByMId.mName + "</td>" +
                    "<td id='" + selectCourse.ccId + "-grade' >" + selectCourse.clazzByClassId.grade + "</td>" +
                    "<td id='" + selectCourse.ccId + "-courseName'>" + selectCourse.courseByCourseId.courseName + "</td>" +
                    "<td>" +
                    //"<a href='javascript:selectCourseEdit(" + selectCourse.ccId + ");'>编辑</a>" +
                    "<a href='javascript:selectCourseDelete(" + selectCourse.ccId + ");'>删除</a>" +
                    "</td>" +
                    "</tr>";
            }
            $("#tbody").html(formHtml);

        }, error: function (data) {
            //showMsg("新增" + menuname + "失败，通讯异常！" + data.statusText);
        }
    });
}


/** 新增弹出框 */
$('#operate-btn1').on('click', function (e) {
    if (treeNode1 != null) {
        if (treeNode1.isParent) {
            alert("请先在左侧选择专业");
        } else {
            $("input[name='ccId']").val('');
            $('#mName').val(treeNode1.name);
            $('#mId').val(treeNode1.id);
            $('#grade').val('');
            $('#courseName').val('');
            layer.open({
                type: 1,
                title: '增加班级',
                area: '566px',
                content: $('#modal-edit'),
                btn: ['确认', '取消'],
                yes: function (index) {
                    $.post(contextPath + '/selectCourse/add', $('#form-edit').serialize(), function (model) {
                        if (model['result'] == 'success') {
                            alert('增加班级成功');
                            if (treeNode1 == null) {
                                $('#data-query').submit();
                            }
                            else {
                                showRightList(treeNode1);
                            }
                        }
                        layer.close(index);
                    });
                },
                btn2: function (index) {
                    layer.close(index);
                }
            })
        }
    }
    else {
        alert("请先在左侧选择专业");
    }
});


/*删除班级*/
function selectCourseDelete(id) {
    layer.open({
        type: 1,
        title: '删除班级',
        area: '566px',
        content: $('#form-delete'),
        btn: ['确认', '取消'],
        yes: function (index) {
            $.post(contextPath + '/selectCourse/delete',
                {
                    'tId': id,
                },
                function (model) {
                    if (model['result'] == 'success') {
                        alert('删除班级成功');
                        if (treeNode1 == null) {
                            $('#data-query').submit();
                        }
                        else {
                            showRightList(treeNode1);
                        }
                    }
                    layer.close(index);

                });
        },
        btn2: function (index) {
            layer.close(index);
        }
    })
}
//function selectCourseEdit(id) {
//    $("input[name='ccId']").val(id);
//    $('#mId').val($('#' + id + '-mId').text());
//    $('#mName').val($('#' + id + '-mName').text());
//    $('#grade').val($('#' + id + '-grade').text());
//    $('#courseName').val($('#' + id + '-courseName').text());
//    layer.open({
//        type: 1,
//        title: '编辑班级',
//        area: '566px',
//        content: $('#modal-edit'),
//        btn: ['确认', '取消'],
//        yes: function (index) {
//            $.post(contextPath + '/selectCourse/update', $('#form-edit').serialize(), function (model) {
//                if (model['result'] == 'success') {
//                    alert('编辑班级成功');
//                    if (treeNode1 == null) {
//                        $('#data-query').submit();
//                    }
//                    else {
//                        showRightList(treeNode1);
//                    }
//                }
//                layer.close(index);
//            });
//        },
//        btn2: function (index) {
//            layer.close(index);
//        }
//    })
//}


/**
 * ajax执行更、删、改、增
 */


/*提交 批量删除 的ajax请求*/
function batchDeleteForm(ids) {
    $.ajax({
        url: contextPath + "/selectCourse/batch_delete",
        data: {
            "ids": ids,
        },
        type: "post",
        async: true,
        success: function (data) {
            if (data['result'] == 'success') {
                alert("批量删除成功")
                if (treeNode1 == null) {
                    $('#data-query').submit();
                }
                else {
                    showRightList(treeNode1);
                }
            } else {
                var msg = data.message | "未知原因";
                alert("批量删除 未成功！" + msg);
            }
            //$('#data-query').submit();

        }, error: function (data) {
            alert("批量删除失败，通讯异常{" + data.statusText + "}");
        }
    });
}


/*勾选复选框 全选/不选 */
$('.menu_table-checkbox-all').on('click', function () {
    var isCheck = $(this).is(':checked');
    $('.menu_table-checkbox').prop('checked', isCheck);
});
/*判断 是否全选了列表*/
$("tbody").on('click', '.menu_table-checkbox', checkSelAll);

function checkSelAll() {
    var isAll = true;
    var $many = $('.menu_table-checkbox');
    $many.each(function (i, item) {
        isAll = $(item).is(':checked') & isAll;
    })
    if ($many.length < 1) {
        isAll = false;
    }
    $('.menu_table-checkbox-all').prop('checked', isAll);
}

/*点击批量删除按钮*/
$('.operate-btn2').on('click', function () {
    var ids = [];
    var inputs = $(".menu_table-checkbox");
    inputs.each(function (i, item) {
        if ($(this).is(':checked')) {
            ids.push($(this).closest("td").siblings(".id").text());
        }
    });
    if (ids.length == 0) {
        alert("您未选中任何一条!");
    } else {
        if (confirm("确定删除这" + ids.length + "条数据？")) {
            batchDeleteForm(ids.join(","));
        }
    }

});


