$(function () {
    var path = $('#path').val();
    var longPath = $('#longPath').val();
    var $hy = $("#hy-date");

    //日期调用
    $hy.datepicker({
        language: 'zh-CN',
        format : 'yyyy-mm-dd',
        todayHight: true,
        autoclose: true
    });
    $hy.datepicker().on('changeDate', function (e) {
        formSubmit({
            orgId: $('#orgId').val(),
            lastEtlAcgDt : $hy.val()
        }, path + '/view/org/main', 'post');
    })


    $("#st-date").datepicker({
        language: 'zh-CN',
        todayHight: true,
        autoclose: true
    });

    //指标任务下达
    //日期间隔
    $("#time-list>li").click(function () {
        var val = $(this).text();
        $("#tg").text(val)
    });
    //排名
    $("#rank-list>li").click(function () {
        var val = $(this).text();
        var rankType = $(this).data('rank');
        $("#rank-val").text(val);
        var rank = $('.rank');
        for (var i = 0; i < rank.length; i++) {
            $(rank[i]).text($(rank[i]).data(rankType))
        }
    });
    $("#detail-rank-list>li").click(function () {
        var val = $(this).text();
        var rankType = $(this).data('rank');
        $("#detail-rank-val").text(val);
        var rank = $('.detail-rank');
        for (var i = 0; i < rank.length; i++) {
            $(rank[i]).text($(rank[i]).data(rankType))
        }
    });

    //查询的机构树
    var searchOrgTree = {};
    var searchOrgNodes = [];

    //机构树的设定
    var orgOption = {
        treeSettings: {
            async: {
                url: path + "/organization/treeview.json",
                dataType: "json",
                enable: true,
                autoParam: ["id"],
                dataFilter: function (treeId, parentNode, responseData) {
                    return responseData.result;
                }
            },
            callback: {
                onClick: function (e, treeId, treeNode, checkFlage) {
                    $('#orgName').val(treeNode.name);
                    hideTree(searchtree.stree[treeId]);
                    formSubmit({
                        orgId: treeNode.id,
                        lastEtlAcgDt : $hy.val()
                    }, path + '/view/org/main', 'post');
                }
            }
        }
    };

    /** 初始化机构树 */
    $.ajax({
        url: path + "/organization/treeview.json",
        dataType: "json",
        type: "post",
        success: function (data) {
            //获取数据
            if (searchOrgNodes.length === 0) {
                searchOrgNodes = data.result;
                searchOrgTree = new Stree(orgOption, searchOrgNodes);
            }
        }
    });

    //首页机构选择
    $(".down_arrow").on("focus", function () {
        searchOrgTree.proShow();
    });

    //弹出业绩种类模态框
    $('#per-list').on('show.bs.modal', function (e) {
        var funcType = $(e.relatedTarget).data('funcType');// 业绩类型大类
        var kindTable = $('#achievementKindTable');
        kindTable.data('funcType', funcType);
        kindTable.empty();

        // 设置模态框的内容,先查找字典表所有数据,再   查找是否在自定义tab 有保存数据 有-> 变成选中状态
        var html = ['<tr>'];
        $.post(path + '/dictionary/items/' + funcType + ".json", {}, function (result) {
            result = result.result;
            $.post(path + '/view/manager/tab/list.json', {functionType: funcType}, function (tab) {
                var indicators = "";
                if (tab.success && tab.result) {
                    indicators = tab.result[0].indicators;
                }
                for (var i = 0; i < result.length; i++) {
                    if (indicators.indexOf(result[i].value) >= 0) {
                        html.push('<td><input type="checkbox" checked="checked" name="achievementKind" value="' + result[i].value + '">' + result[i].text + '</td>');
                    } else {
                        html.push('<td><input type="checkbox" name="achievementKind" value="' + result[i].value + '">' + result[i].text + '</td>');
                    }
                    if (i == result.length - 1) {
                        html.push('</tr>');
                    } else if ((i + 1) % 5 == 0) {
                        html.push("</tr><tr>");
                    }
                }
                $('#achievementKindTable').html(html.join(''));
            })
        })
    })

    //选择业绩种类模态框 确定按钮
    $('#modalSureBtn').on('click', function (e) {
        var funcType = $('#achievementKindTable').data('funcType');
        var achievementKinds = $('#achievementKindTable').find('input:checked');
        // 没有选中的 复选框 直接关闭
        if (!achievementKinds || achievementKinds.length == 0) {
            $('#per-list').modal('hide');
            return;
        }
        // 选中的 复选框 多与10 个,提示
        if (achievementKinds.length > 10) {
            alert('最多只能选择10条,请重新选择');
            return;
        }

        // 正常数量,先保存到 自定义tab表中 在刷新页面
        var saveKinds = [];
        for (var i = 0; i < achievementKinds.length; i++) {
            saveKinds.push($(achievementKinds[i]).val());
        }
        $.post(path + '/view/manager/tab/update.json', {
            functionType: funcType,
            indicators: saveKinds.join(',')
        }, function (result) {
            if (result.success) {
                window.location.reload();
            }
        });
    })

    // 机构业绩预览 机构详情弹窗
    $('.overview-detail').on('click', function (e) {
        var archievementKind = $(this).data('archievementKind');// 业绩类型 具体类型
        var bizType = $(this).parents('table').data('bizType');
        // 设置弹窗标题为具体的业务类型
        $('#achievementTitle').text($(this).text());
        // 取出当前选中机构的下级子机构 在此业务类型的数据,将其显示到弹窗中,
        // 如果为最后一级机构(后台返回数据为空),不显示弹窗
        $.post(path + '/view/org/archievement/detail.json', {
            orgId: $('#orgId').val(),
            bizType : bizType,
            archievementKind: archievementKind
        }, function (result) {
            var orgTbody = $('#org-detail-tbody');
            orgTbody.empty();
            var html = [];
            if (result.success && result.result.length > 0) {
                result = result.result;
                for (var i = 0; i < result.length; i++) {
                    var org = result[i].belOrg.split('--');
                    html.push('<tr>');
                    html.push('<td>' + org[0] + '</td>');
                    html.push('<td>' + org[1] + '</td>');
                    html.push('<td>' + result[i].present + '</td>');
                    result[i].dayIncreament > 0 ?
                        html.push('<td class="crm-text-red">' + result[i].present + '</td>')
                        : html.push('<td class="crm-text-green">' + result[i].present + '</td>');
                    result[i].monthIncreament > 0 ?
                        html.push('<td class="crm-text-red">' + result[i].monthIncreament + '</td>')
                        : html.push('<td class="crm-text-green">' + result[i].monthIncreament + '</td>');
                    result[i].yearIncreament > 0 ?
                        html.push('<td class="crm-text-red">' + result[i].yearIncreament + '</td>')
                        : html.push('<td class="crm-text-green">' + result[i].yearIncreament + '</td>');
                    html.push('<td class="detail-rank" data-day="' + result[i].dayIncreamentRank +
                        '" data-month="' + result[i].monthIncreamentRank +
                        '" data-year="' + result[i].yearIncreamentRank + '">' +
                        result[i].yearIncreamentRank + '</td>');
                }
                orgTbody.html(html.join(''));
                $('#org-detail').modal('show');
            }
        });
    })
    
    // 机构劳动竞赛 完成度 详情弹窗
    $('.complete-detail').on('click', function (e) {
        var archievementKind = $(this).data('archievementKind');// 业绩类型 具体类型completeTitle
        var bizType = $(this).parents('table').data('bizType');

        // 设置弹窗标题为具体的业务类型
        $('#completeTitle').text($(this).text());
        // 取出当前选中机构的下级子机构 在此业务类型的数据,将其显示到弹窗中,
        // 如果为最后一级机构(后台返回数据为空),不显示弹窗
        $.post(path + '/view/org/archievement/detail.json', {
            orgId: $('#orgId').val(),
            bizType : bizType,
            archievementKind: archievementKind
        }, function (result) {
            var tbody = $('#completeTbody');
            tbody.empty();
            tbody.empty();
            var html = [];
            if (result.success && result.result.length > 0) {
                result = result.result;
                for (var i = 0; i < result.length; i++) {
                    var org = result[i].belOrg.split('--');
                    html.push('<tr>');
                    html.push('<td>' + org[0] + '</td>');
                    html.push('<td>' + org[1] + '</td>');
                    // html.push('<td>' + result[i].present + '</td>');
                    html.push('<td class="text-left"><i class="progress" style="width:50%"><span>' + result[i].completeRate + '</span></i></td>');
                    html.push('<td>' + result[i].completeRateRank + '</td>');
                }
                tbody.html(html.join(''));
                $('#indient').modal('show');
            }
        })
    })

    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var tabId = $(e.target).attr('href');
        $.cookie('tabId', tabId);
    })
    if ($.cookie('tabId')) {
        var tabId = $.cookie('tabId');
        $('#org-tab').find('a[href="'+tabId+'"]').click();
    }


})