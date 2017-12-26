$(function () {

//		客户经理输入下拉
    $('#cm-name').on('keyup', function () {
        var val = $(this).val();
        if(val){
            $('#cm-name-list').show()
        }else {
            $('#cm-name-list').hide()
        }
    });
    $('#cm-name-list>li').on('click', function () {
        var val = $(this).text();
        $('#cm-name').val(val);
        $('#cm-name-list').hide();
    });
//		时间选择器
    $('#crm-datepicker').datepicker({
        language: 'zh-CN',
        todayHight: true,
        format: "yyyy-mm-dd"
    });

//*****************************************************
//  限制多选框个数
    $('input[type=checkbox]').click(function () {
        $("input[name='indicators']").attr('disabled',true);
        if($("input[name='indicators']:checked").length>=10){
            $("input[name='indicators']:checked").attr('disabled',false);
        }else {
            $("input[name='indicators']").attr('disabled',false);
        }
    });
//*******************************************************************************
});

//		tab改名
function changeTabTitle(el) {
    var act = $(el).parent().attr('class');
    if(act === 'active'){
        $(el).find('.title').prop('contenteditable', true);
    }
}
//		增加tab
function addTabs() {
    var addBtn = $('#add-tab').parent();
    var tabContent = $('#tab-content');
    var length = $('.tablist>li').length;
    var nowDate=new Date().getTime();
    if(length <= 5) {
        var tabTemp = '<li role="presentation" >\
									<a href="#'+(nowDate)+'" role="tab" data-toggle="tab"  onclick="changeTabTitle(this)" id="'+(nowDate)+'-tab">\
										<span class="title">业绩概览</span>\
										<span class="remove" onclick="removeTargetTab(this)">X</span>\
									</a>\
								</li>';

        var contentTemp = '<div role="tabpanel" class="tab-pane" id="'+nowDate+'">' +
            ' <table class="table table-responsive search-result-table"><thead><tr>' +
                '<th><button class="crm-btn crm-btn-green table-choose" onclick="openModal(this)">业绩指标筛选</button></th>\
                <th>当前(元/户数)</th>\
                <th>比上日(元/户数)</th>\
                <th>比上月(元/户数)</th>\
                <th>比年初(元/户数)</th>\
                <th>排名</th>'+
            '</tr></thead></table>' +
            '</div>';

        addBtn.before(tabTemp);

        $(contentTemp).appendTo(tabContent);

    }
}
//		删除tab
function removeTargetTab(el) {
    $(el).parent().parent().prev().find('a').click();
    $(el).parent().parent().remove();
    var id = $(el).parent().attr('href').slice(1);
    $('#'+id).remove();
}
// 打开业绩指标筛选modal,添加表格
function openModal(el) {
    var key = $(el).parents('.tab-pane').attr('id');

    var trDatas=$(el).parents('table').find('tbody').children('tr');
    if(trDatas.length>0){
        for(var i=0;i<trDatas.length;i++){
            var trId= $(trDatas[i]).attr('id');
            var id=trId.substr(3,trId.length);
            $('#'+id).prop('checked',true);
        }
    }

    $('#whoOpenModel').val(key);

    $('.bs-example-modal-lg').modal();
}

// 切换折线图
function openCharts(el) {

}
// 模态框取消按钮
$('#modalCancelBtn').on('click', function () {
    $("input[name='indicators']").attr('checked',false);

    $('.bs-example-modal-lg').modal('hide');
})
// 模态框确定按钮
$('#modalSureBtn').on('click', function () {

    var whoOpenModel=  $('#whoOpenModel').val();
    var tBodyContent=$('#'+whoOpenModel).find('tbody');
    var selectedDatas=$("input[name='indicators']:checked");

    if(selectedDatas.length==0){
        $('.bs-example-modal-lg').modal('hide');
    }else {
        tBodyContent.empty();
        for(var i=0;i<selectedDatas.length;i++){
            var id=$(selectedDatas[i]).attr('id');
            var temp='<tr id="tr-'+id+'"><td><a href="javascript: void(0);" onclick="openCharts(this)">'+$('#'+id).parent().text()+'</a></td></tr>'
            tBodyContent.prepend(temp);
        }

        //ajax 保存tab 信息

    }



});
// 名单详情
function openClientList() {
    var key = $('#clientListKey').val();    // 存款日均
    /*
     *   ajax
     * */
    var data = {};  // ajax 返回的数据
    window.open('./c-manager-views/client-list.html','','width='+(screen.availWidth-10)+',height='+(screen.availHeight-55)+',top=0,left=0,toolbar=no,status=no, menubar=no, resizable=no, location=no')
}
//下拉框选择
function hoopSelect(el, val, tex) {
    $(el).show();
    var selectValue = "";
    $(val).on('click', function () {
        selectValue = $(this).text();
        $(tex).text(selectValue);
        $(el).hide();
    })
}

//管户客户指标选择
$('.page-num').on('click', function () {
    hoopSelect('.select-option', '.page-num-select', '.page-num');
})