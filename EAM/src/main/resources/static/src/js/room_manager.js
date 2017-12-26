/**
 * Created by chenjia on 2017/3/12.
 */

/*全局 初始化 应用上下文路径 */
var baseUri = $("#baseUri").val();
var contextPath = $("#contextPath").val();

/*删除教师*/
function roomDelete(id) {
    layer.open({
        type: 1,
        title: '删除教室',
        area: '566px',
        content: $('#form-delete'),
        btn: ['确认', '取消'],
        yes: function (index) {
            $.post(contextPath + '/room/delete',
                {
                    'tId': id,
                },
                function (model) {
                    if (model['result'] == 'success') {
                        alert('删除教室成功');
                        $('#data-query').submit();

                    }
                    layer.close(index);

                });
        },
        btn2: function (index) {
            layer.close(index);
        }
    })
}
function roomEdit(id) {
    layer.open({
        type: 1,
        title: '编辑教室',
        area: '566px',
        content: $('#modal-edit'),
        btn: ['确认', '取消'],
        yes: function (index) {
            $.post(contextPath + '/room/update', $('#form-edit').serialize(), function (model) {
                if (model['result'] == 'success') {
                    alert('编辑教室成功');
                    $('#data-query').submit();

                }
                layer.close(index);
            });
        },
        btn2: function (index) {
            layer.close(index);
        }
    })
    $("input[name='rId']").val(id);
    $('#rName').val($('#' + id + '-rName').text());
    $('#capacity').val($('#' + id + '-capacity').text());
}

$(function () {
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


    /** 新增弹出框 */
    $('#operate-btn1').on('click', function (e) {
        $("input[name='rId']").val('');
        $('#rName').val('');
        $('#capacity').val('');
        layer.open({
            type: 1,
            title: '增加教室',
            area: '566px',
            content: $('#modal-edit'),
            btn: ['确认', '取消'],
            yes: function (index) {
                $.post(contextPath + '/room/add', $('#form-edit').serialize(), function (model) {
                    if (model['result'] == 'success') {
                        alert('增加教室成功');
                        $('#data-query').submit();
                    }
                    layer.close(index);
                });
            },
            btn2: function (index) {
                layer.close(index);
            }
        })
    });


    /**
     * ajax执行更、删、改、增
     */


    /*提交 批量删除 的ajax请求*/
    function batchDeleteForm(ids) {
        $.ajax({
            url: contextPath + "/room/batch_delete",
            data: {
                "ids": ids,
            },
            type: "post",
            async: true,
            success: function (data) {
                if (data['result'] == 'success') {
                    $('#data-query').submit();
                    alert("批量删除成功")
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
})
