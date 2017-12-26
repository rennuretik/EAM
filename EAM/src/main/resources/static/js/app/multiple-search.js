
// 客户经理补全
$('#client-manager-input').on('keyup', function () {
    if($(this).val() == ''){
        $('#name-list').hide()
    }else {
        $('#name-list').show()
    }
});
$('#name-list>li').on('click', function () {
    var text = $(this).text();
    $('#name-list').hide();
    $('#client-manager-input').val(text);
});

// 页面载入时需要请求的业务品种与区间筛选数据
var pubBusinessTypeData = [
    {key: 'personal_ebank_open_flag',text: '个人网银'},
    {key: 'intl_bussiness_open_flag',text: '国际业务'},
    {key: 'payroll_open_flag',text: '代发工资'},
    {key: 'yht_sign_flag',text: '一户通'},
    {key: 'watercharge_sign_flag',text: '水费代扣'},
    {key: 'eleccharge_sign_flag',text: '电费代扣'},
    {key: 'financial_open_flag',text: '理财'},
    {key: 'fund_open_flag',text: '基金'},
    {key: 'noblemetal_open_flag',text: '贵金属'}
];
var priBusinessTypeData = [
    {key: 'mbanking_open_flag',text: '手机银行'},
    {key: 'personal_ebank_open_flag',text: '网上银行'},
    {key: 'tbanking_open_flag',text: '电话银行'},
    {key: 'etc_open_flag',text: 'ETC'},
    {key: 'ccrd_open_flag',text: '丰收贷记卡'},
    {key: 'pos_open_flag',text: 'pos'},
    {key: 'financial_open_flag',text: '理财'},
    {key: 'fund_open_flag',text: '基金'},
    {key: 'noblemetal_open_flag',text: '贵金属'},
    {key: 'watercharge_sign_flag',text: '水费'},
    {key: 'eleccharge_sign_flag',text: '电费'},
    {key: 'catv_sign_falg',text: '有线电视'},
    {key: 'trafficfines_sign_flag',text: '交通罚没款'},
    {key: 'fengshouepay_open_flag',text: '丰收E支付'},
    {key: 'sscard_open_flag',text: '社保卡'},
    {key: 'ind_loan_156_open_flag',text: '小额贷款卡'},
    {key: 'ind_loan_118_open_flag',text: '丰收创业卡'},
    {key: 'ind_loan_157_open_flag',text: '福农卡'},
    {key: 'ind_loan_158_open_flag',text: '爱心卡'},
    {key: 'yht_sign_flag',text: '一户通'}
];
var rangeChooseData = [
    {key: 'asset_balance',text: '资产时点'},
    {key: 'asset_year_dailyaverage',text: '资产日均'},
    {key: 'deposit_cur_balance',text: '存款时点'},
    {key: 'deposit_year_dailyaverage',text: '存款日均'},
    {key: 'financial_cur_balance',text: '理财时点'},
    {key: 'financial_year_dailyaverage',text: '理财日均'},
    {key: 'credit_line',text: '授信额度'},
    {key: 'loan_cur_balance',text: '贷款时点'},
    {key: 'loan_year_dailyaverage',text: '贷款日均'},
    {key: 'general_profit_contribution',text: '综合利润'},
    {key: 'loan_deposit_ratio',text: '存贷比'},
    {key: 'own_products_sum',text: '持有产品数'},
    {key: 'cust_age',text: '客户年龄'}
];

/*
*   常用组合 ajax code here
* */
// 初始化或ajax返回的数据
var multipleSearchData = {
    "custType": "1",
    // "custGrade": "1,2,3",
    // "identifyStatus": "1",
    "custProduct": {
        // "mbanking_open_flag": "1",
        // "personal_ebank_open_flag": "1",
        // "tbanking_open_flag": "0",
        // "etc_open_flag": "1",
        // "ccrd_open_flag": "1",
        // "pos_open_flag": "1",
        // "financial_open_flag": "1",
        // "fund_open_flag": "1",
        // "noblemetal_open_flag": "1",
        // "watercharge_sign_flag": "1",
        // "eleccharge_sign_flag": "1",
        // "catv_sign_falg": "1",
        // "trafficfines_sign_flag": "1",
        // "fengshouepay_open_flag": "1",
        // "sscard_open_flag": "1",
        // "ind_loan_156_open_flag": "1",
        // "ind_loan_118_open_flag": "1",
        // "ind_loan_157_open_flag": "1",
        // "ind_loan_158_open_flag": "1",
        // "yht_sign_flag": "1"
    },
    "intervalFilter": {
        // "asset_balance": "1-2",
        // "asset_year_dailyaverage": "1-2",
        // "deposit_cur_balance": "23-66",
        // "deposit_year_dailyaverage": "1-2",
        // "financial_cur_balance": "14-88",
        // "financial_year_dailyaverage": "1-2",
        // "credit_line": "1-2",
        // "loan_cur_balance": "1-2",
        // "loan_year_dailyaverage": "1-2",
        // "general_profit_contribution": "1-2",
        // "loan_deposit_ratio": "1-2",
        // "own_products_sum": "1-2",
        // "cust_age": "1-2"
    }
};

//初始化常用组合数据
var awaysChooseRenderDatas = {};
// 渲染时先执行一次数据渲染
multipleSearchRender();

// 根据数据 渲染UI方法
function multipleSearchRender() {
    // 判断对公对私
    if(multipleSearchData.custType == '1'){             // 对私
        $('#client-type>.btnVal').html('客户类型：对私');
    }
    else if (multipleSearchData.custType == '2'){      // 对公
        $('#client-type>.btnVal').html('客户类型：对公');
    }
    // 渲染业务品种
    var tempDom = '';
    $(
        multipleSearchData.custType == '1'
        ? priBusinessTypeData
        : pubBusinessTypeData
    ).each(function () {
        var temp = '<li><div class="checkbox moreItem"><label><input type="checkbox" data-type="'+this.key+'" data-belong="businessType" onchange="moreCondiFun(this)"><span>'+this.text+'</span></label></div></li>';
        tempDom += temp;
    });
    $('#business-type').html(tempDom);
    renderBusinessType();
    // 渲染业务品种勾选
    function renderBusinessType() {
        var tempDom  = '';
        for(var key in multipleSearchData.custProduct){
            $('[data-type="'+key+'"]').prop('checked', true);
            var val = multipleSearchData.custProduct[key],yes,no,nameval;
            if(val == '1'){
                nameval = '是'
                yes = 'checked';
                no = '';
            }
            else if (val == '0'){
                nameval = '否'
                yes = '';
                no = 'checked';
            }
            var name;
            $(
                multipleSearchData.custType == '1'
                    ? priBusinessTypeData
                    : pubBusinessTypeData
            ).each(function () {
                if(key == this.key){name = this.text}
            });
            var temp = '<div class="btn-group btn-group-sm">\
                            <button type="button" class="btn btn-default dropdown-toggle crm-dropFirst" data-toggle="dropdown">'+name+'：'+nameval+'</button>\
                            <button type="button" class="btn btn-default crm-dropSecond"  data-remove="'+key+'" onclick="removeBT(this)">\
                                <span class="itemClose">X</span>\
                            </button>\
                            <ul class="dropdown-menu" role="menu">\
                                <li onclick="businessTypeCheck(this)">\
                                    <label class="checkbox-inline"><input type="radio" data-custType-key="1" name="'+key+'" '+yes+'>是</label>\
                                    <label class="checkbox-inline"><input type="radio" data-custType-key="0" name="'+key+'" '+no+'>否</label>\
                                </li>\
                            </ul>\
                        </div>';
            tempDom += temp;
        }
        $('#form-res').html(tempDom)
    }
    // 渲染客户星级
    if(multipleSearchData.custGrade){
        $('#client-star .valBtn').html('客户星级： ' + multipleSearchData.custGrade)
        var starList = multipleSearchData.custGrade.split(',');
        $(starList).each(function () {
            var _self = this;
            $('.client-star-input').each(function () {
                if($(this).attr('data-custGrade') == _self){
                    $(this).prop('checked', true)
                }
            })
        });
    }
    else {
        $('#client-star .valBtn').html('客户星级： 全部');
        $('.client-star-input').each(function () {
            $(this).prop('checked', true);
        });
    }
    // 渲染是否认定
    if(multipleSearchData.identifyStatus == '1'){
        $('#sure-not>.btnVal').html('已认定')
    }else if(multipleSearchData.identifyStatus == '0'){
        $('#sure-not>.btnVal').html('未认定')
    }else{
        $('#sure-not>.btnVal').html('全部')
    }
    // 渲染区间筛选
    (function () {
        var tempDom = '';
        $(rangeChooseData).each(function () {
            var temp = '<li><div class="checkbox moreItem"><label><input type="checkbox" data-type="'+this.key+'" data-belong="rangeChoose" onchange="moreCondiFun(this)"><span>'+this.text+'</span></label></div></li>';
            tempDom += temp;
        });
        $('#range-choose').html(tempDom);
    })();
    renderRangeChoose();
    // 渲染区间筛选的勾选
    function renderRangeChoose() {
        var tempDom = '';

        for (var key in multipleSearchData.intervalFilter){
            $('[data-type="'+key+'"]').prop('checked', true);
            var val = multipleSearchData.intervalFilter[key];
            var name;
            $(rangeChooseData).each(function () {
                if(key == this.key){name = this.text}
            });
            var arr = val.split('-');
            var temp = '<div class="btn-group btn-group-sm">\
                            <button type="button" class="btn btn-default dropdown-toggle crm-dropFirst" data-toggle="dropdown">'+name+'：'+val+'</button>\
                            <button type="button" class="btn btn-default crm-dropSecond"  data-remove="'+key+'" onclick="removeRC(this)">\
                                <span class="itemClose">X</span>\
                            </button>\
                            <ul class="dropdown-menu range-ul" role="menu" data-intervalFilter="'+key+'">\
                                <li>\
                                    <div class="col-sm-5">\
                                        <input type="text" class="form-control input-sm range-one" style="ime-mode: disabled;" onpaste="return false" value="'+arr[0]+'" onkeyup="rangeChooseInput(event)" onblur="rangeCBlurOne(this)">\
                                    </div>\
                                    <div class="col-sm-2 text-center">\
                                        <span class="glyphicon glyphicon-resize-horizontal"></span>\
                                    </div>\
                                    <div class="col-sm-5">\
                                        <input type="text" class="form-control input-sm range-two" style="ime-mode: disabled;" onpaste="return false" value="'+arr[1]+'" onkeyup="rangeChooseInput(event)" onblur="rangeCblurTwo(this)">\
                                    </div>\
                                </li>\
                            </ul>\
                        </div>';
            tempDom += temp;
        }

        $('#form-res2').html(tempDom)
    }

    // 移动下拉输入区间至可见
    var windowWidth = $(window).width();
    $('.range-ul').each(function () {
        var selfWidth = $(this).parents('.btn-group').offset().left;
        if(windowWidth - selfWidth < 302){
            $(this).css('left','-169px');
        }
    })
}

// 更多过滤
function moreFilter(el) {
    var val = $(el).val();

    var targetElList = $(el).parents('#more-condi-ul').find('.moreItem input[type=checkbox]');
    targetElList.each(function () {
        var key = $(this).next().text();
        if(key.indexOf(val) == -1){
            $(this).parents('li').hide();
        }else {
            $(this).parents('li').show();
        }
    })

}



// 客户类型
$('#client-type-ul>li>a').on('click', function () {
    multipleSearchData.custProduct = {};
    var key = $(this).attr('data-custType');
    multipleSearchData.custType = key;
    multipleSearchRender();
});

// 是否认定
$('#sure-not-ul>li>a').on('click', function () {
    var key = $(this).attr('data-identifyStatus');
    if(key){
        multipleSearchData.identifyStatus = key;
    }else {
        delete multipleSearchData.identifyStatus;
    }
    multipleSearchRender();
});


// 客户星级
var starInput = $('#client-star-ul .client-star-input');
starInput.on('change', function () {
    var starList = [];
    starInput.each(function () {
        if($(this).is(':checked')){
            var key = $(this).attr('data-custGrade');
            starList.push(key)
        }
    });

    if(starList.length == 0 || starList.length == 5){
        delete multipleSearchData.custGrade;
    }else {
        var text = starList.join(',');
        multipleSearchData.custGrade = text;
    }
    multipleSearchRender();
});

// 更多
function moreCondiFun(el) {
    var key = $(el).attr('data-type');
    var type = $(el).attr('data-belong');

    if(type == 'businessType'){
        $(el).is(':checked') ? multipleSearchData.custProduct[key] = '1' : delete multipleSearchData.custProduct[key];
    }else if (type == 'rangeChoose'){
        $(el).is(':checked') ? multipleSearchData.intervalFilter[key] = '0-0' : delete multipleSearchData.intervalFilter[key];
    }
    multipleSearchRender();
}

// 业务品种选择
function businessTypeCheck(el) {
    var arrEl = $(el).find('input');
    var key = arrEl.attr('name');
    arrEl.each(function () {
        if($(this).is(':checked')){
            var val = $(this).attr('data-custType-key');
            multipleSearchData.custProduct[key] = val;
        }
    });
    multipleSearchRender();
}
// 区间筛选输入
// 第1个框
function rangeChooseInput(event) {
    if(event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 8){

    }else {
        alert('请输入数字')
    }
}
function rangeCBlurOne(el) {
    var key = $(el).parents('.range-ul').attr('data-intervalFilter');
    var num = ~~$(el).val();
    $(el).parents('.range-ul').find('.range-two').val(num);
    var text = num + '-' + num;
    multipleSearchData.intervalFilter[key] = text;
    multipleSearchRender();
}
// 第2个框
function rangeCblurTwo(el) {
    var key = $(el).parents('.range-ul').attr('data-intervalFilter');
    var num = ~~$(el).val();
    var oneVal = ~~$(el).parents('.range-ul').find('.range-one').val();
    if(num <= oneVal){
        alert('请输入比前一个值大的数字')
    }else {
        var text = oneVal + '-' + num;
        multipleSearchData.intervalFilter[key] = text;
    }
    multipleSearchRender();
}

// 移除按钮
function removeBT(el) {
    var key = $(el).attr('data-remove');
    delete multipleSearchData.custProduct[key];
    multipleSearchRender();
}
function removeRC(el) {
    var key = $(el).attr('data-remove');
    delete multipleSearchData.intervalFilter[key];
    multipleSearchRender();
}

// 常用组合
function awaysChoose() {
    $.ajax({
        type:"POST",
        url:contextPath+"/custinfo/queryhistory/list.json",
        async:false,
        datatype:"json",
        success:function (data) {
            if (data.success){
                awaysChooseRenderDatas = data; // ajax 返回的数据
            }else {
                alert("常用组合加载失败!");
            }
        }
    });
    
    jsonToObject(awaysChooseRenderDatas);
    var tpl=document.getElementById("aways-choose-temp").innerHTML;
    var html=juicer(tpl,awaysChooseRenderDatas); //得到渲染结果，需要放到DOM元素中才能在页面中显示
    $('#aways-choose-ul').html(html)
}

function removeAwaysChoose(index) {
    $.ajax({
        type:"GET",
        url:contextPath+"/custinfo/queryhistory/delete.json",
        async:false,
        data:{id:awaysChooseRenderDatas.list[index].bizHistoryId},
        datatype:"json",
        success:function (data) {

        }
    });
    
}

function jsonToObject(awaysChooseRenderDatas) {
    for (i=0;i<awaysChooseRenderDatas.list.length;i++){
        awaysChooseRenderDatas.list[i].content = $.evalJSON(awaysChooseRenderDatas.list[i].content);
    }
}

function awaysChooseRender(index) {
    multipleSearchData = awaysChooseRenderDatas.list[index].content;
    if(!multipleSearchData.custProduct){
        multipleSearchData.custProduct = {}
    }
    if(!multipleSearchData.intervalFilter){
        multipleSearchData.intervalFilter = {}
    }
    multipleSearchRender();
}

// console.log(multipleSearchData);