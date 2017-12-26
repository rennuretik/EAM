$(function() {
    var path = $('#path').val();

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        },
        defaultDate: '2016-09-12',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        dayClick:function(){
            $(".wid_con_edit_function1").show()
        }
    });

    //查询的机构树
    var searchOrgTree = {};
    var searchOrgNodes = [];


    //机构树的设定
    var orgOption = {
        treeSettings : {
            async : {
                url : path + "/organization/treeview.json",
                dataType : "json",
                enable : true,
                autoParam : ["id","type"],
                dataFilter :function (treeId, parentNode, responseData) {
                    return responseData.result;
                }
            },
            callback : {
                onClick : function( e, treeId, treeNode, checkFlage){
                    onClicks(e, treeId,treeNode,function(){
                        console.log(treeNode);
                        var name = "";
                        if (treeNode.id.indexOf("user")!=-1){
                            multipleSearchData.isUser = 1;
                        }else {
                            multipleSearchData.isUser = 0;
                            if (treeNode.id.indexOf("self")!=-1){
                                multipleSearchData.isSelf = 1;
                            }else {
                                multipleSearchData.isSelf = 0;
                            }
                        }
                        if (treeNode.name.indexOf("-")!=-1){
                            name = treeNode.name.substr(treeNode.name.lastIndexOf("-")+1);
                        }
                        multipleSearchData["belClientManager"] = treeNode.code;
                        multipleSearchData["belClientManagerName"] = name ;
                    });
                }
            }
        }
    };
    earchOrgTree = new Stree(orgOption);

    //分配业绩种类弹窗
    $("#word-choose").click(function(){
        $(".win_warp .wid_con_edit_function").slideDown(300)
    })
    // 关闭弹窗
    $('.close-func1').click(function (e) {
        $(".wid_con_edit_function1").hide()
    })
    $('.close-func').click(function (e) {
        $(".win_warp .wid_con_edit_function").hide()
    })
});