// 初始化查询数据;
var searchData = {};

$(function () {
    $('#searchBtn').on('click', searchFun)  // 调用查询结果渲染方法
    // 重置按钮
    $('#searchResetBtn').on("click", function () {
        $('.accurately-input').each(function () {
            $(this).val(null)
            $(this).prop('disabled', false)
            $(this).prop('placeholder','请输入')
        })
    });
// 模拟触发打开视图按钮
    $('.search-result-container').on('click','.search-table-result', function () {
        $(this).parents('tr').find('span.scan-client').click();
    })

// 查询结果ajax--juicer渲染
    function searchFun() {
        var type = $(this).attr('data-val');
        var valArr = [];
        $('.accurately-input').each(function () {
            if($(this).val()){
                valArr.push( $(this).val() )
            }
        });
        // 判断是精准查询还是组合查询
        if(type == '精准'){
            if(valArr.length >= 2){
                alert('只允许输入一个条件')
            }else if(valArr.length == 0) {
                alert('请输入一个条件')
            }else {
                searchData["cretNum"] = $("#cretNum").val();
                searchData["mobilephoneNum"] = $("#mobilephoneNum").val();
                searchData["accountNum"] = $("#accountNum").val();
                searchData["custName"] = $("#custName").val();
                // console.log(searchData);
                loadPageData("table-temp-container",contextPath+"/custinfo/query/acc", 20000,searchData);
            }
        }else if(type == '组合'){
            if ($.isEmptyObject(multipleSearchData.custProduct)){
                delete multipleSearchData.custProduct;
            }
            if ($.isEmptyObject(multipleSearchData.intervalFilter)){
                delete multipleSearchData.intervalFilter;
            }
            searchData["data"] = JSON.stringify(multipleSearchData);
            loadPageData("table-temp-container",contextPath+"/custinfo/query/comb", 20000,searchData);
            if(!multipleSearchData.custProduct){
                multipleSearchData.custProduct = {}
            }
            if(!multipleSearchData.intervalFilter){
                multipleSearchData.intervalFilter = {}
            }
        }
    }
})










