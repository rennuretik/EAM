/**
 * Created by fudahua on 2016/9/28.
 */
var DataProcess = {
    /**
     * 分配用户
     * @param json
     * @param callback
     */
    "disInsert": function (json, callback) {
        var jsonStr = $.toJSON(json);
        $.post(contextPath+"/customer/dis/insert.json", {"data": jsonStr}, function (retData) {
            if (retData.isSuccess) {
                callback(retData.errorList);
            }
        }, "JSON");
    },
    /**
     * 申领
     * @param json
     * @param callback
     */
    "chaimInsert": function (json, callback) {
//			var jsonStr=$.toJSON(json);
        $.getJSON(contextPath+"/customer/claim/insert.json?custIsn=" + json, function (data) {
            callback(data.isSuccess);
        })
    }
};
// toJson({});
var   dealClickCallback={
    "disClaim":function(obj){
        var curDom = obj;
        var dom = curDom.parentNode;
        // console.log(tdDom);
        var custIsn = $(dom).attr("custIsn");
        var custNum = $(dom).attr("custNum");
        var custName = $(dom).attr("custName");

        var operation = $(curDom).attr("data-target");
        console.log(operation);
        if (operation == ".fen-modal") {//分配
            var html = '<tr class="odd gradeX" custIsn="' + custIsn + '">\
                    <td><input type="checkbox" class="checkboxes" value="1" /></td>\
                    <td>1</td>\
                    <td>' + custNum + '</td>\
                    <td>' + custName + '</td>\
                    <td><input type="text"/></td>\
                    <td>\
                    <input type="text"/>\
                    </td>\
                    </tr>';
            $(operation).find("tbody").html(html);
        } else {
            var html = '<p>您正在申请申领客户为：' + custIsn + '，客户名称：' + custName + '的客户</p>';
            $(operation).find(".modal-body").html(html);
            $(operation).find(".modal-body").attr("custIsn", custIsn);
        }
        $(operation).modal();
    },
    "fen":function(){
        var checkInputs = [];
        var checkDataFlag = true;
        $(".fen-modal").find("tbody").find("input[type=checkbox]").each(function () {
            if (this.checked == true) {
                var pDom = this.parentNode.parentNode;
                var simpleJson = {};
                var inputs = $(pDom).find("input[type=text]");
                inputs.each(function () {
                    if ($(this).val() == "") {
                        this.style.borderColor = "red";
                        checkDataFlag = false;
                    } else {
                        this.style.borderColor = "";
                    }
                })
                simpleJson.custIsn = pDom.getAttribute("custIsn");
//					simpleJson.modify=inputs[0].value;
                simpleJson.accManager = inputs[1].value;
                checkInputs.push(simpleJson);
            }
        })
        var json = {};
        json.list = checkInputs;
        DataProcess.disInsert(json, function (data) {
            if (data.length) {
                for (var i in data) {
                    $(".fen-modal").find("tr[custIsn=" + data[i] + "]").find("input[type=text]").css("borderColor", "red");
                }
            } else {
                $(".crm-modal").modal("hide");
            }
        })
    }
}
function dealSearch(url_local) {

    // $(".edit-font").click(function (evt) {
    //     var curDom = evt.target;
    //     var dom = evt.target.parentNode.parentNode;
    //     var tdDom = $(dom).find("td")[2];
    //     // console.log(tdDom);
    //     tdDom=$(tdDom).find("a").get(0);
    //     var content = (tdDom.innerHTML).split("/");
    //     var custIsn = $.trim(content[0]);
    //     var custNum = $.trim(content[1]);
    //     var custName = $.trim(content[2]);
    //
    //     var operation = $(curDom).attr("data-target");
    //     if (operation == "#crm-moda2") {//分配
    //         var html = '<tr class="odd gradeX" custIsn="' + custIsn + '">\
    //                 <td><input type="checkbox" class="checkboxes" value="1" /></td>\
    //                 <td>1</td>\
    //                 <td>' + custNum + '</td>\
    //                 <td>' + custName + '</td>\
    //                 <td><input type="text"/></td>\
    //                 <td>\
    //                 <input type="text"/>\
    //                 </td>\
    //                 </tr>';
    //         $(operation).find("tbody").html(html);
    //     } else {
    //         var html = '<p>您正在申请申领客户为：' + custIsn + '，客户名称：' + custName + '的客户</p>';
    //         $(operation).find(".modal-body").html(html);
    //         $(operation).find(".modal-body").attr("custIsn", custIsn);
    //     }
    // })
//     $(".btn-dis-sure").click(function (evt) {
//         var checkInputs = [];
//         var checkDataFlag = true;
//         $("#crm-moda2").find("tbody").find("input[type=checkbox]").each(function () {
//             if (this.checked == true) {
//                 var pDom = this.parentNode.parentNode;
//                 var simpleJson = {};
//                 var inputs = $(pDom).find("input[type=text]");
//                 inputs.each(function () {
//                     if ($(this).val() == "") {
//                         this.style.borderColor = "red";
//                         checkDataFlag = false;
//                     } else {
//                         this.style.borderColor = "";
//                     }
//                 })
//                 simpleJson.custIsn = pDom.getAttribute("custIsn");
// //					simpleJson.modify=inputs[0].value;
//                 simpleJson.accManager = inputs[1].value;
//                 checkInputs.push(simpleJson);
//             }
//         })
//         var json = {};
//         json.list = checkInputs;
//         DataProcess.disInsert(json, function (data) {
//             if (data.length) {
//                 for (var i in data) {
//                     $("#crm-moda2").find("tr[custIsn=" + data[i] + "]").find("input[type=text]").css("borderColor", "red");
//                 }
//             } else {
//                 $("#crm-moda2").modal("hide");
//             }
//         })
//
//     })
    $(".btn-charim-sure").click(function (evt) {
        var dom = evt.target;
        var custIsn = $("#crm-modal").find(".modal-body").attr("custIsn");
        console.log(custIsn);
        DataProcess.chaimInsert(custIsn, function (isSuccess) {
            if (!isSuccess) {
                alert("申领失败!");
            }
            $("#crm-modal").modal("hide");
        })

    });
    /**
     * 对公对私
     */
    $(".click-open").click(function(){
        var custNo=$(this).attr("custNo");
        var custName=$(this).attr("custName");
        var custUrl=$(this).attr("url");
        var custId = $(this).attr("custId");
        var sub=custNo.substr(0,2);
        if (sub=="81"){//对私
            parent.tab.add({name:custName,id:custNo,url:custUrl+'/custview/private/overview?custIsn='+custNo})
        }else{
            parent.tab.add({name:custName,id:custNo,url:custUrl+'/custview/public/menu?custIsn='+custNo+"&custName="+custName+"&custId="+custId})
        }

    })
}