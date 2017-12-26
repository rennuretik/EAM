/**
 * Created by fudahua on 2016/9/13.
 */
/**
 * 提交
 * @param dataJson
 * @param url
 * @param type
 */
function  formSubmit(dataJson,url,type){
    var type=type||"get";
    var url=url||"";
    var html='<form action="'+url+'" method="'+type+'"></form>';
    var form=$(html);
    for (var i in dataJson) {
        form.append($('<input type="text" name="'+i+'" />').val(dataJson[i]));
    }
    // console.log(form);
    form.submit();//提交
}
/**
 * 加载树结构
 * @param dom
 * @param url 路径
 * @param dataDealCallback 数据处理回调
 */
function LoadTree(dom,url,dataDealCallback,isGetManager){
    this.dom=dom;
    this.url=url;
    this.dataDealCallback=dataDealCallback;
    this.isGetManager=isGetManager||"1";
    var _this=this;
    this.init=function(){
        Operation.start();
    };
    var zTreeOperation={
        "init":function(){
            var setting = {
                async: {
                    enable: true,
                    url:_this.url,
                    autoParam:["code=parentCode"],
                    otherParam:{"isGetManager":_this.isGetManager},
                    dataFilter: zTreeOperation.filter
                },
                data:{
                    simpleData: {
                        enable: true,
                        idKey:"code",
                        pIdKey:"parentCode"
                    }
                }
            };
            console.log(_this.dom);
            $.fn.zTree.init(_this.dom, setting);
        },
        "filter":function(treeId, parentNode, childNodes) {
            if (!childNodes||childNodes.success==false) return null;
            var d={};
            d.data=childNodes;
            _this.dataDealCallback&&_this.dataDealCallback(d);
            childNodes=d.data;
            for (var i=0, l=childNodes.length; i<l; i++) {
                childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
            }
            return childNodes;
        }
    };
    var Operation={
        //初始化
        "start":function(){
            if($(_this.dom).get(0).hasLoadTree!=undefined) {//已经加载
                return;
            }
            Operation.initZtree();//初始化
            $(_this.dom).get(0).hasLoadTree=true;
        },
        "initZtree":function(){
            zTreeOperation.init();
        }
    };
}

