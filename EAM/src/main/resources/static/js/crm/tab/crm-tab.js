/**
 * Created by Administrator on 2016/8/31.
 */
var crmTab={};
//获取tab的html模板
crmTab.getTabTpl=function(o){
    var tabTpl=["<li id='"+ o.id+"'>",
        "<a>"+ o.name+"&nbsp;&nbsp;<span class='glyphicon glyphicon-remove-circle'></span>",
        "</a>",
        "</li>"].join("");
    return tabTpl
};
//增加tab的方法
crmTab.addTab=function(o){
    var me=this;
    var arg={name: o.name,id: o.id};
    var html=this.getTabTpl(arg);
    var lis=this.tabs.find("li");
    //控制tab个数不能超过五个;
    if(lis.length<5){
        me.tabs.append(html);
    }else{
        lis.eq(1).remove()&&me.tabs.append(html);
    }
    me.clicked(o.id);
    //选中的tab的单击事件
    me.tabs.find("li").click(function(){
        me.clicked(this.id);
    });
    me.tabs.find("li>a>span").click(function(){
        me.closeTab(jQuery(this).parent().parent().attr("id"));
    })
}
//关闭tab
crmTab.closeTab=function(id){
    var me=this;
    var tab=this.tabs.find("#"+id);
    if(tab.next().is("li")){
        tab.next().click();
    }else if(tab.prev().is("li")){
        tab.prev().click()
    }
    tab.remove();

    jQuery("#"+this.getFrameId(id)).remove();


}
//获得frame的id
crmTab.getFrameId=function(id){
    return "frame"+id;
}
//判断tab是否存
crmTab.isExist=function(id){
    return this.tabs.find("#"+id).size()>0;
}
//tab是否存在和增加tab方法结合
crmTab.add=function(option){
    if(this.isExist(option.id)){
        this.clicked(option.id);
        return false
    }else{
      this.addTab(option);
      this.addFrame(option)
    }
}
//点击tab
crmTab.clicked=function(id){
    this.tabs.find("li").removeClass(this.activeClass);
    jQuery("#"+id).addClass(this.activeClass);
    this.loadFrame(id);
}
//增加frame
crmTab.addFrame=function(option){
    var url=option.url;
    var id=this.getFrameId(option.id);
    var frameTpl=["<iframe height='100%' width='100%' frameborder='0' id='"+id+"' src='"+url+"'>",
        "</iframe>"].join("");
    this.frame.append(frameTpl);
    this.loadFrame(option.id);
}
//加载frame
crmTab.loadFrame=function(id){

    var id=this.getFrameId(id);
    this.frame.find("iframe").hide();
    jQuery("#"+id).show();
}

//构造函数
var HoopTab=function(option){
    //构造函数传入的默认参数
    var defaults={
        tabId:"crm-tab",
        frameId:"crm-frame",
        activeClass:"crm-active"
    };
    var o=jQuery.extend(defaults,option)
    this.tabs=jQuery("#"+ o.tabId);
    this.frame=jQuery("#"+ o.frameId);
    this.activeClass= o.activeClass;
}
jQuery.extend(HoopTab.prototype,crmTab)